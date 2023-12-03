import uuid
from src.core.services import db

class Notebook(db.Model):
    __tablename__ = 'notebooks'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(30), nullable=False)
    description = db.Column(db.String(200), nullable=False, default='')
    pages = db.relationship('Page', backref='notebook', lazy='dynamic')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'description': self.description
        }
    
    def __repr__(self):
        return f'<Notebook({self.id}, {self.user_id}, {self.title}, {self.description})>'