from typing import List
from werkzeug.security import generate_password_hash, check_password_hash
from src.core.services import db, jwt_manager
from src.core.models.user import User
    
@jwt_manager.user_identity_loader
def load_user(user_id) -> User:
    user = db.session.scalars(db.
            select(User).
            where(User.id == user_id)).first()
    return user.id

def signup_user(data: dict) -> User:
        user = User(
            email=data['email'],
            username=data['username'],
            password_hash=generate_password_hash(data['password'])
        )
        db.session.add(user)
        db.session.commit()
        db.session.refresh(user)
        return user
    
def login_user(data: dict) -> User:
    user = db.session.scalars(db.
        select(User).
        where(User.username == data['username'])).first()
    if user and check_password_hash(user.password_hash, data['password']):
        return user
    else:
        return None
    
def logout_user(data: dict) -> None:
    return None

def get_users(data: dict) -> List[User]:
    users = db.session.scalars(db.
        select(User)).all()
    return users