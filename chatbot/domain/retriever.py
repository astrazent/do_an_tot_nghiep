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

class Retriever(MultiVectorRetriever): #nó chịu trách nhiệm lấy tài liệu liên quan từ kho dữ liệu vector và docstore
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
            vectorstore=vectorstore,   # Lưu trữ vector embeddings của các tài liệu, dùng để tìm kiếm tương đồng
            byte_store=redis_store,    # Lưu trữ nhị phân hoặc metadata bổ sung của tài liệu (ở đây dùng Redis)
            id_key="doc_id",           # Tên trường dùng làm ID duy nhất cho mỗi tài liệu trong vectorstore/byte_store
            search_type='mmr',         # Loại tìm kiếm: 'mmr' = Maximal Marginal Relevance (ưu tiên đa dạng & liên quan)
            search_kwargs={
                'k': 5,                # Số lượng tài liệu trả về tối đa sau khi tìm kiếm
                'ef': 50                # Tham số điều chỉnh độ chính xác/tốc độ của thuật toán tìm kiếm (dùng với ANN)
            },
            embedding=embedding_instance  # Instance của embedding model dùng để mã hóa tài liệu & câu hỏi
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
        chunk_size: int = 300,        # Kích thước mỗi đoạn (số ký tự) khi chia nhỏ tài liệu trước khi lưu vào vectorstore
        chunk_overlap: int = 50,      # Số ký tự chồng lấn giữa các đoạn liền kề, giúp giữ ngữ cảnh khi tìm kiếm
        max_batch_size: int = 166,    # Số lượng tài liệu xử lý cùng lúc khi thêm vào retriever (giúp tránh quá tải bộ nhớ)
        documents: list = None        # Danh sách các tài liệu cần thêm vào retriever, mỗi phần tử thường là object Document
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
        # Khởi tạo danh sách để lưu các tài liệu kèm điểm số
        scored_docs = []

        # Lặp qua tất cả các tài liệu, cùng với thứ hạng ban đầu (rank)
        for rank, doc in enumerate(documents):
            # Tính điểm cơ bản dựa trên vị trí ban đầu của tài liệu
            # Tài liệu đầu tiên có điểm cao hơn vì rank càng nhỏ thì 1/(rank+k) càng lớn
            base_score = 1 / (rank + k)

            # Lấy mô tả từ metadata của tài liệu, nếu có
            desc = doc.metadata.get("description", "")
            if desc:
                # Tách mô tả thành các từ riêng lẻ
                desc_terms = desc.split()
                # Khởi tạo biến tăng điểm dựa trên việc trùng khớp cụm từ
                phrase_boost = 0.0

                # Tạo danh sách các phrase dài 4 từ trở lên từ mô tả
                desc_phrases = [desc_terms[i:j] for i in range(len(desc_terms)) for j in range(i+4, len(desc_terms)+1)]
                # Chuyển nội dung tài liệu về chữ thường để so khớp
                doc_content_lower = doc.page_content.lower()
                
                # Kiểm tra từng phrase có xuất hiện trong nội dung tài liệu không
                for phrase in desc_phrases:
                    phrase_str = " ".join(phrase).lower()
                    if phrase_str in doc_content_lower:
                        # Nếu phrase trùng, cộng thêm 3.0 điểm
                        phrase_boost += 3.0

                # Kiểm tra từng bigram (2 từ liền nhau) trong mô tả có xuất hiện trong nội dung không
                for i in range(len(desc_terms) - 1):
                    bigram = " ".join(desc_terms[i:i+2]).lower()
                    if bigram in doc_content_lower:
                        # Nếu bigram trùng, cộng thêm 0.1 điểm
                        phrase_boost += 0.1

                # Cộng điểm tăng phrase vào điểm cơ bản
                base_score += phrase_boost

            # Thêm tài liệu và điểm số của nó vào danh sách
            scored_docs.append((doc, base_score))

        # Sắp xếp danh sách tài liệu theo điểm số giảm dần
        scored_docs.sort(key=lambda x: x[1], reverse=True)
        
        # Nếu chỉ lấy top_k tài liệu, cắt danh sách xuống còn top_k
        if top_k is not None and top_k <= len(scored_docs):
            scored_docs = scored_docs[:top_k]

        # In bảng xếp hạng ra màn hình (rank, doc_id, score)
        for i, (doc, score) in enumerate(scored_docs, start=1):
            print(f"Rank {i}: doc_id={doc.metadata.get('doc_id')}, score={score}")

        # Trả về danh sách các tài liệu đã được sắp xếp lại
        return [doc for doc, _ in scored_docs]
    
    def delete(self, where: dict):
        if hasattr(self.vectorstore, "_collection"):
            self.vectorstore._collection.delete(where=where)