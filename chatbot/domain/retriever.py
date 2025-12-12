from langchain_community.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.retrievers.multi_vector import MultiVectorRetriever
from langchain_chroma import Chroma
from langchain_core.documents.base import Document
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.storage import RedisStore
from config import settings

import time

class UTF8TextLoader(TextLoader):
    def __init__(self, file_path):
        super().__init__(file_path, encoding='utf-8')

class Retriever(MultiVectorRetriever):
    embedding: HuggingFaceEmbeddings

    def __init__(self, collection_name: str, embedding_model: str = 'BAAI/bge-m3'):
        embedding_instance = HuggingFaceEmbeddings(model_name=embedding_model)
        vectorstore = Chroma(
            collection_name=collection_name,
            embedding_function=embedding_instance,
            persist_directory='./chroma_db'
        )
        redis_store = RedisStore(
            redis_url = f"redis://:{settings.REDIS_PASSWORD}@{settings.REDIS_HOST}:{settings.REDIS_PORT}/{settings.REDIS_DB}",
            namespace=collection_name
        )
        super().__init__(
            vectorstore=vectorstore,
            byte_store=redis_store,
            id_key="doc_id",
            search_type='mmr',
            search_kwargs={
                'k': 5,
                'ef': 50
            },
            embedding=embedding_instance
        )

    def split_documents(self, documents, chunk_size: int, chunk_overlap: int) -> tuple[list[Document], list[str]]:
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
        chunks = []
        doc_ids = []

        for doc in documents:
            split_docs = text_splitter.split_documents([doc])
            for i, chunk in enumerate(split_docs, start=1):
                # Gán doc_id theo dạng gốc + số thứ tự chunk
                if "doc_id" in doc.metadata:
                    chunk_id = f"{doc.metadata['doc_id']}-{i}"
                    chunk.metadata[self.id_key] = chunk_id
                    doc_ids.append(chunk_id)
                chunk.page_content = chunk.page_content.lower()
            chunks.extend(split_docs)
        return chunks, doc_ids
    def make_batch_chunks(self, chunks: list[Document], max_batch_size: int):
        for i in range(0, len(chunks), max_batch_size):
            yield chunks[i:i + max_batch_size]
    
    def add_documents_to_retriever(
        self,
        chunk_size: int = 300,
        chunk_overlap: int = 50,
        max_batch_size: int = 166,
        documents: list = None
    ):
        if not documents:
            raise ValueError("Phải truyền documents")
        if isinstance(documents[0], dict):
            documents = [Document(page_content=d['text'], metadata=d['metadata']) for d in documents]
        chunks, doc_ids = self.split_documents(documents, chunk_size, chunk_overlap)
        for batch in self.make_batch_chunks(chunks, max_batch_size):
            self.vectorstore.add_documents(batch)
        self.docstore.mset(list(zip(doc_ids, documents)))
        
    def add_json_to_retriever(self, documents: list):
        docs = [Document(page_content=d['text'], metadata=d['metadata']) for d in documents]
        doc_ids = [d.metadata['doc_id'] for d in docs]

        # Đo thời gian thêm vào vector store
        start_vector = time.time()
        self.vectorstore.add_documents(docs)
        end_vector = time.time()
        print(f"Save vectorStore took {end_vector - start_vector:.4f} seconds")

        # Đo thời gian thêm vào doc store
        start_docstore = time.time()
        self.docstore.mset(list(zip(doc_ids, docs)))
        end_docstore = time.time()
        print(f"Save DocStore took {end_docstore - start_docstore:.4f} seconds")

    def deduplicate_documents(self, documents: list[list[Document]]) -> list[Document]:
        seen_ids = set()
        unique_docs = []

        # flatten
        flat_docs = [doc for docs in documents for doc in docs]

        for doc in flat_docs:
            doc_id = doc.metadata.get("doc_id") or doc.page_content
            if doc_id not in seen_ids:
                unique_docs.append(doc)
                seen_ids.add(doc_id)

        return unique_docs

    def multi_query(self, queries: list[str], top_k: int) -> list[Document]:
        retrieved_results = self.map().invoke(queries)
        documents = self.deduplicate_documents(retrieved_results)
        return self.re_ranking(documents, top_k)

    def re_ranking(self, documents: list[Document], top_k: int | None = None, k: int = 60):
        scored_docs = []

        for rank, doc in enumerate(documents):
            base_score = 1 / (rank + k)

            desc = doc.metadata.get("description", "")
            if desc:
                desc_terms = desc.split()
                phrase_boost = 0.0

                desc_phrases = [desc_terms[i:j] for i in range(len(desc_terms)) for j in range(i+4, len(desc_terms)+1)]
                doc_content_lower = doc.page_content.lower()
                for phrase in desc_phrases:
                    phrase_str = " ".join(phrase).lower()
                    if phrase_str in doc_content_lower:
                        phrase_boost += 3.0

                for i in range(len(desc_terms) - 1):
                    bigram = " ".join(desc_terms[i:i+2]).lower()
                    if bigram in doc_content_lower:
                        phrase_boost += 0.1

                base_score += phrase_boost

            scored_docs.append((doc, base_score))

        scored_docs.sort(key=lambda x: x[1], reverse=True)
        
        if top_k is not None and top_k <= len(scored_docs):
            scored_docs = scored_docs[:top_k]

        # In bảng xếp hạng
        for i, (doc, score) in enumerate(scored_docs, start=1):
            print(f"Rank {i}: doc_id={doc.metadata.get('doc_id')}, score={score}")

        return [doc for doc, _ in scored_docs]
    
    def delete(self, where: dict):
        if hasattr(self.vectorstore, "_collection"):
            self.vectorstore._collection.delete(where=where)