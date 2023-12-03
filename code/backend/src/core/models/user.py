import uuid
from src.core.services import db

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = db.Column(db.String(64), nullable=False, unique=True)
    username = db.Column(db.String(64), nullable=False, unique=True)
    password_hash = db.Column(db.String(120), nullable=False)
    credit = db.Column(db.Integer(), nullable=False, default=0)
    notebooks = db.relationship('Notebook', backref='creator', lazy='dynamic')
    uploaded_assets = db.relationship('Asset', backref='uploader', lazy='dynamic')
    owned_assets = db.relationship('UserAsset', backref='owner', lazy='dynamic')

    def is_authenticated(self):
        return True
    
    def is_active(self):
        return True
    
    def is_anonymous(self):
        return False
    
    def get_id(self):
        return str(self.id)

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'username': self.username,
            'password_hash': self.password_hash,
            'credit': self.credit
        }
    
    def __repr__(self):
        return f'<User({self.id}, {self.email}, {self.username}, {self.password_hash}, {self.credit})>'