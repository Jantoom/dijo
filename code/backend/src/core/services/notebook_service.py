from typing import List, Tuple
from src.core.services import db
from src.core.models.notebook import Notebook
from src.core.models.page import Page

def get_notebooks(data: dict) -> List[Tuple[Notebook, List[Page]]]:
    result = []
    notebooks = db.session.scalars(db.
        select(Notebook).
        where(Notebook.user_id == data['user_id'])).all()
    for notebook in notebooks:
        pages = db.session.scalars(db.
            select(Page).
            where(Page.notebook_id == notebook.id).
            order_by(Page.created_at.desc())).all()
        result.append((notebook, pages))
    return result

def get_notebook(data: dict) -> Tuple[Notebook, List[Page]]:
    notebook = db.session.scalars(db.
        select(Notebook).
        where(db.and_(
            Notebook.user_id == data['user_id'],
            Notebook.id == data['notebook_id']))).first()
    if notebook is not None:
        pages = db.session.scalars(db.
            select(Page).
            where(Page.notebook_id == data['notebook_id']).
            order_by(Page.created_at.desc())).all()
        return notebook, pages
    else:
        return notebook, None

def create_notebook(data: dict) -> Notebook:
    notebook = Notebook(
        user_id=data['user_id'],
        title=data['title'],
        description=data['description']
    )
    db.session.add(notebook)
    db.session.commit()
    db.session.refresh(notebook)
    return notebook

def edit_notebook(data: dict) -> Notebook:
    notebook = db.session.scalars(db.
        select(Notebook).
        where(db.and_(
            Notebook.id == data['notebook_id'],
            Notebook.user_id == data['user_id'])).
        with_for_update()).first()
    if notebook is not None:
        notebook.title = data['title'] if data['title'] is not None else notebook.title
        notebook.description = data['description'] if data['description'] is not None else notebook.description
        db.session.add(notebook)
        db.session.commit()
    return notebook

def delete_notebook(data: dict) -> Notebook:
    notebook, pages = get_notebook(data)
    if notebook is not None:
        for page in pages:
            db.session.delete(page)
        db.session.delete(notebook)
        db.session.commit()
        return notebook
    else:
        return None

def get_pages(data: dict) -> List[Page]:
    notebook, pages = get_notebook(data)
    if notebook is not None:
        return pages
    else:
        return None

def get_page(data: dict) -> Page:
    notebook = db.session.scalars(db.
        select(Notebook).
        where(db.and_(
            Notebook.user_id == data['user_id'],
            Notebook.id == data['notebook_id']))).first()
    if notebook is not None:
        page = db.session.scalars(db.
            select(Page).
            where(Page.notebook_id == data['notebook_id']).
            order_by(Page.created_at.desc()).
            offset(data['index'])).first()
        return page
    else:
        return None

def add_page(data: dict) -> Page:
    notebook = db.session.scalars(db.
        select(Notebook).
        where(db.and_(
            Notebook.user_id == data['user_id'],
            Notebook.id == data['notebook_id']))).first()
    if notebook is not None:
        page = Page(
            notebook_id=data['notebook_id'],
            title=data['title'],
            content=data['content']
        )
        db.session.add(page)
        db.session.commit()
        db.session.refresh(page)
        return page
    else:
        return None
    
def save_page(data: dict) -> Notebook:
    notebook = db.session.scalars(db.
        select(Notebook).
        where(db.and_(
            Notebook.user_id == data['user_id'],
            Notebook.id == data['notebook_id']))).first()
    if notebook is not None:
        page = db.session.scalars(db.
            select(Page).
            where(Page.notebook_id == data['notebook_id']).
            order_by(Page.created_at.desc()).
            offset(data['index']).
            limit(1).
            with_for_update()).first()
        if page is not None:
            page.title = data['title'] if data['title'] is not None else page.title
            page.content = data['content'] if data['content'] is not None else page.content
            db.session.add(page)
            db.session.commit()
            return page
    return None

def delete_page(data: dict) -> Page:
    notebook = db.session.scalars(db.
        select(Notebook).
        where(db.and_(
            Notebook.user_id == data['user_id'],
            Notebook.id == data['notebook_id']))).first()
    if notebook is not None:
        page = db.session.scalars(db.
            select(Page).
            where(Page.notebook_id == data['notebook_id']).
            order_by(Page.created_at.desc()).
            offset(data['index'])).first()
        if page is not None:
            db.session.delete(page)
            db.session.commit()
            return page
    return None