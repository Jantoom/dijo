import uuid
from datetime import datetime
from src.core.services import db

class Page(db.Model):
    __tablename__ = 'pages'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    notebook_id = db.Column(db.String(36), db.ForeignKey('notebooks.id'), nullable=False)
    title = db.Column(db.String(30), nullable=False, default='New page')
    content = db.Column(db.String(), nullable=False, default='')
    created_at = db.Column(db.DateTime(), default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'notebook_id': self.notebook_id,
            'title': self.title,
            'content': self.content,
            'created_at': self.created_at
        }
    
    def __repr__(self):
        return f'<Page({self.id}, {self.notebook_id}, {self.title}, {self.content}, {self.created_at})>'