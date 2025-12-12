import os
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Form
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.models import DataSource, Document
import shutil
from app.database import get_db
from .. import oauth2

router = APIRouter(
    prefix="/document",
    tags=["document"]
)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DOCSTORE_DIR = os.path.join(BASE_DIR, "docstore")

os.makedirs(DOCSTORE_DIR, exist_ok=True)

def validate_ext(filename: str):
    ext = filename.lower().split(".")[-1]
    if ext not in ["txt", "pdf", "json"]:
        raise HTTPException(status_code=400, detail="Only txt, pdf, json files are allowed")

def list_all_files_in_docstore() -> set[str]:
    all_files = set()

    for root, dirs, files in os.walk(DOCSTORE_DIR):
        for f in files:
            # lấy đường dẫn tương đối tính từ DOCSTORE_DIR
            rel_path = os.path.relpath(os.path.join(root, f), DOCSTORE_DIR)
            all_files.add(rel_path.replace("\\", "/"))

    return all_files

@router.get("/")
def get_files_status(
    db: Session = Depends(get_db),
    current_user = Depends(oauth2.get_current_user),
):
    # 1. Load datasource map
    datasources = db.query(DataSource).all()
    ds_map = {ds.id: ds.slug for ds in datasources}

    # 2. Load DB files & normalize paths
    db_files = db.query(Document).all()
    db_normalized = set()
    for doc in db_files:
        slug = ds_map.get(doc.datasource_id)
        if slug:
            normalized_path = f"{slug}/{doc.file_name}"
            db_normalized.add(normalized_path)

    # 3. Load filesystem files
    fs_filenames = set(list_all_files_in_docstore())

    # 4. Detect mismatches
    missing_in_fs = db_normalized - fs_filenames
    missing_in_db = fs_filenames - db_normalized

    return {
        "db_files": list(db_normalized),
        "missing_in_filesystem": list(missing_in_fs),
        "missing_in_database": list(missing_in_db)
    }

@router.post("/upload")
def upload_file(
    file: UploadFile = File(...),
    datasource_slug: str = Form(...),
    description: str = Form(...),
    doc_owner: str = Form("user"),
    is_active: bool = Form(True),
    db: Session = Depends(get_db),
    current_user = Depends(oauth2.get_current_user)
):
    validate_ext(file.filename)

    datasource = db.query(DataSource).filter(DataSource.slug == datasource_slug).first()
    if not datasource:
        raise HTTPException(status_code=404, detail="Datasource not found")

    ext = file.filename.split(".")[-1].lower()
    slug_folder = os.path.join(DOCSTORE_DIR, datasource_slug)
    os.makedirs(slug_folder, exist_ok=True)
    file_path = os.path.join(slug_folder, file.filename)
    # Kiểm tra file trên filesystem
    if os.path.exists(file_path):
        raise HTTPException(status_code=400, detail="File already exists in filesystem")

    # Kiểm tra file trong DB
    existing_doc = db.query(Document).filter(
        Document.file_name == file.filename,
        Document.datasource_id == datasource.id
    ).first()
    if existing_doc:
        raise HTTPException(status_code=400, detail="Document already exists in database")

    # Lưu file mới
    with open(file_path, "wb") as f:
        f.write(file.file.read())

    # Tạo document mới trong DB
    doc = Document(
        datasource_id=datasource.id,
        file_name=file.filename,
        description=description,
        source_type=ext,
        doc_owner=doc_owner,
        is_active=is_active
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)

    return {
        "id": doc.id,
        "file_name": doc.file_name,
        "datasource_id": doc.datasource_id,
        "description": doc.description,
        "source_type": doc.source_type,
        "doc_owner": doc.doc_owner,
        "is_active": doc.is_active,
        "path": os.path.join(BASE_DIR, "docstore", doc.file_name)
    }

@router.patch("/")
def update_document(
    datasource_slug: str = Form(...),
    filename: str = Form(...),
    new_file: UploadFile | None = File(None),
    description: str | None = Form(None),
    doc_owner: str | None = Form(None),
    is_active: bool | None = Form(None),
    db: Session = Depends(get_db),
    current_user = Depends(oauth2.get_current_user)
):
    validate_ext(filename)

    doc = db.query(Document).join(DataSource).filter(
        Document.file_name == f"{filename}",
        Document.datasource.has(slug=datasource_slug)
    ).first()
    
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    if new_file:
        validate_ext(new_file.filename)
        slug_folder = os.path.join(DOCSTORE_DIR, datasource_slug)

        old_path = os.path.join(slug_folder, doc.file_name)
        if not os.path.exists(old_path):
            raise HTTPException(status_code=404, detail="File not found on system")
        os.remove(old_path)
        
        new_file_path = os.path.join(slug_folder, new_file.filename)
        with open(new_file_path, "wb") as f:
            shutil.copyfileobj(new_file.file, f)

        doc.file_name = new_file.filename
        doc.source_type = new_file.filename.split(".")[-1].lower()

    if description is not None:
        doc.description = description
    if doc_owner is not None:
        doc.doc_owner = doc_owner
    if is_active is not None:
        doc.is_active = is_active

    db.commit()
    db.refresh(doc)

    return {
        "id": doc.id,
        "file_name": doc.file_name,
        "datasource_id": doc.datasource_id,
        "description": doc.description,
        "doc_owner": doc.doc_owner,
        "is_active": doc.is_active,
        "source_type": doc.source_type
    }

@router.delete("/{datasource_slug}/{filename}", status_code=200)
def delete_file_by_path(
    datasource_slug: str,
    filename: str,
    db: Session = Depends(get_db),
    current_user = Depends(oauth2.get_current_user)
):
    validate_ext(filename)
    normalized_path = f"{datasource_slug}/{filename}"
    file_path = os.path.join(DOCSTORE_DIR, normalized_path)

    # Kiểm tra file trên filesystem
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    os.remove(file_path)

    # Xoá bản ghi trong DB nếu có
    doc = db.query(Document).join(DataSource).filter(
        Document.file_name == normalized_path,
        Document.datasource.has(slug=datasource_slug)
    ).first()
    
    if doc:
        db.delete(doc)
        db.commit()

    return {"deleted": normalized_path, "deleted_in_db": bool(doc)}

@router.get("/{datasource_slug}/{filename}", response_class=FileResponse)
def download_file_by_slug(
    datasource_slug: str,
    filename: str,
    db: Session = Depends(get_db),
    current_user = Depends(oauth2.get_current_user)
):
    validate_ext(filename)

    # Chuẩn hóa đường dẫn
    normalized = f"{datasource_slug}/{filename}"

    # Kiểm tra DB
    db_file = db.query(Document).join(DataSource).filter(
        Document.file_name == filename,
        Document.datasource.has(slug=datasource_slug)
    ).first()
    exists_in_db = db_file is not None

    # Kiểm tra filesystem
    fs_filenames = list_all_files_in_docstore()
    exists_in_fs = normalized in fs_filenames

    file_path = os.path.join(DOCSTORE_DIR, normalized)

    # Nếu file thiếu ở DB hoặc FS → trả JSON đơn giản
    if not exists_in_db or not exists_in_fs:
        return {
            "datasource_slug": datasource_slug,
            "filename": filename,
            "exists_in_db": exists_in_db,
            "exists_in_filesystem": exists_in_fs
        }

    # Nếu hợp lệ → trả file
    return FileResponse(file_path, filename=filename)