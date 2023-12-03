from src.core.services import db

class UserAsset(db.Model):
    __tablename__ = 'users_assets'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    asset_id = db.Column(db.String(36), db.ForeignKey('assets.id'), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'owner': self.user_id,
            'asset': self.asset_id
        }
    
    def __repr__(self):
        return f'<UserAsset({self.id}, {self.user_id}, {self.asset_id})>'