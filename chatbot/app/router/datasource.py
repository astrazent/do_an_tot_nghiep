from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas, oauth2

router = APIRouter(
    prefix="/datasource",
    tags=["datasource"],
)

@router.get("/", response_model=list[schemas.DataSourceResponse])
def get_all_datasources(db: Session = Depends(get_db)):
    return db.query(models.DataSource).all()

@router.post("/", response_model=schemas.DataSourceResponse)
def create_datasource(
    body: schemas.DataSourceCreate,
    db: Session = Depends(get_db),
    ):
    slug = body.slug.strip().lower()
    if not slug:
        raise HTTPException(status_code=417, detail="Slug is required")

    exists = db.query(models.DataSource).filter(models.DataSource.slug == slug).first()
    if exists:
        raise HTTPException(status_code=400, detail="Slug already exists")

    ds = models.DataSource(slug=slug, name=body.name, description=body.description, is_active=body.is_active)
    db.add(ds)
    db.commit()
    db.refresh(ds)
    return ds

@router.patch("/by-slug", response_model=schemas.DataSourceResponse)
def update_datasource_by_slug(
    body: schemas.DataSourceUpdateBySlug,
    db: Session = Depends(get_db),
    current_user = Depends(oauth2.get_current_user),
    ):
    slug = body.slug.strip().lower()

    ds = db.query(models.DataSource).filter(models.DataSource.slug == slug).first()
    if not ds:
        raise HTTPException(status_code=404, detail="Datasource not found")

    # Update slug nếu có new_slug
    if body.new_slug is not None:
        new_slug = body.new_slug.strip().lower()

        conflict = db.query(models.DataSource).filter(
            models.DataSource.slug == new_slug,
            models.DataSource.id != ds.id
        ).first()

        if conflict:
            raise HTTPException(status_code=400, detail="Slug already exists for another datasource")

        ds.slug = new_slug

    if body.name is not None:
        ds.name = body.name

    if body.description is not None:
        ds.description = body.description

    if body.is_active is not None:
        ds.is_active = body.is_active

    db.commit()
    db.refresh(ds)
    return ds

@router.delete("/by-slug", status_code=204)
def delete_datasource_by_slug(
    slug: str,
    db: Session = Depends(get_db),
    current_user = Depends(oauth2.get_current_user),
):
    normalized_slug = slug.strip().lower()

    ds = db.query(models.DataSource).filter(models.DataSource.slug == normalized_slug).first()

    if not ds:
        raise HTTPException(status_code=404, detail="Datasource not found")

    db.delete(ds)
    db.commit()
    return