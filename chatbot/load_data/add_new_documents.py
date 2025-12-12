from domain.retriever import Retriever
from app.models import DataSource, Document
from app.database import SessionLocal
import os
from config import settings
import json
import pdfplumber
import shutil

CHROMA_DB_DIR = settings.CHROMA_DB_DIR

def get_all_datasources(db):
    return db.query(DataSource).filter(DataSource.is_active == True).all()

def get_documents_by_datasource(db, datasource_id: int):
    return (
        db.query(Document)
        .filter(Document.datasource_id == datasource_id, Document.is_active == True)
        .all()
    )

def get_file_path(doc: Document, datasource_slug: str):
    return os.path.join("docstore", datasource_slug, doc.file_name)

def load_document_content(doc: Document, datasource_slug: str):
    file_path = get_file_path(doc, datasource_slug)
    if doc.source_type == "txt":
        with open(file_path, "r", encoding="utf-8") as f:
            return f.read()

    if doc.source_type == "json":
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            if isinstance(data, list):
                return [json.dumps(item, ensure_ascii=False) for item in data]
            else:
                return [json.dumps(data, ensure_ascii=False)]

    if doc.source_type == "pdf":
        text = ""
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                text += page.extract_text() + "\n"
        return text

    return ""

def load_retriever_for_datasource(db, datasource: DataSource):
    retriever = Retriever(collection_name=datasource.slug)
    docs = get_documents_by_datasource(db, datasource.id)
    print(f"➡️ Loading {len(docs)} documents for datasource: {datasource.slug}")

    loaded_docs = []
    for doc in docs:
        content = load_document_content(doc, datasource.slug)
        if doc.source_type == "json":
            loaded_docs = []
            if isinstance(content, str):
                content = [content]
            for i, chunk in enumerate(content, start=1):
                doc_item = {
                    "text": chunk,
                    "metadata": {
                        "doc_id": f"{doc.id}-{i}",
                        "description": doc.description,
                        "source": datasource.slug
                    }
                }
                loaded_docs.append(doc_item)
            retriever.add_json_to_retriever(loaded_docs)
        
        else:
            retriever.add_documents_to_retriever(
                chunk_size=settings.CHUNK_SIZE,
                chunk_overlap=settings.OVERLAP_SIZE,
                max_batch_size=settings.MAX_BATCH_SIZE,
                documents=[{
                    "text": content,
                    "metadata": {
                        "doc_id": doc.id,
                        "description": doc.description,
                        "source": datasource.slug,
                    }
                }]
            )

    return retriever

def safe_rmtree(path, retries=20, delay=0.2):
    import time
    for i in range(retries):
        try:
            shutil.rmtree(path)
            return True
        except PermissionError:
            print(f"⚠️ Folder bị khóa, thử lại... ({i+1}/{retries})")
            time.sleep(delay)
    return False

def load_all_retrievers():
    if os.path.exists(CHROMA_DB_DIR):
        if not safe_rmtree(CHROMA_DB_DIR):
            raise RuntimeError("❌ Không thể xóa thư mục chroma_db vì bị lock.")
        print("Đã xóa toàn bộ nội dung trong thư mục chroma_db!")
    db = SessionLocal()
    datasources = get_all_datasources(db)
    retrievers = {}
    for ds in datasources:
        retrievers[ds.slug] = load_retriever_for_datasource(db, ds)
    db.close()
    print("🎉 DONE — đã load toàn bộ retrievers từ database!")
    return retrievers

if __name__ == "__main__":
    load_all_retrievers()