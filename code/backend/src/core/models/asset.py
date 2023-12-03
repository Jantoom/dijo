import uuid
from src.core.services import db

class Asset(db.Model):
    __tablename__ = 'assets'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(30), nullable=False)
    description = db.Column(db.String, nullable=False, default='')
    resource_url = db.Column(db.String(200), nullable=False)
    price = db.Column(db.Integer, nullable=False, default=0)
    owners = db.relationship('UserAsset', backref='asset', lazy='dynamic')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'description': self.description,
            'resource_url': self.resource_url,
            'price': self.price
        }
    
    def __repr__(self):
        return f'<Asset({self.id}, {self.user_id}, {self.name}, {self.description}, {self.resource_url}, {self.price})>'