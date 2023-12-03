import pytest
from src.core.services import user_service, db
from flask_jwt_extended import create_access_token
from src.auth import create_app
from src.core.models.user import User
from werkzeug.security import generate_password_hash


USER_ID = 'c50c21d6-e1c6-4ea4-8bc3-4f65ce126d7f'
USERNAME = 'user1'
PASSWORD = 'password'
access_token = ''
headers = {}
notebook1_id = ''
BASE_URL = '/api/v1/users'


@pytest.fixture(scope='function')
def app():
    yield create_app({'SQLALCHEMY_DATABASE_URI': 'sqlite:///test_db.sqlite'})


@pytest.fixture
def create_test_data(app):
    with app.app_context():
        user1 = User(email='abc@cde.com',
                    username=USERNAME,
                    password_hash=generate_password_hash(PASSWORD))
        user1.id = USER_ID
        db.session.add(user1)
        db.session.commit()
        db.session.commit()


@pytest.fixture
def client(app, create_test_data):
    with app.app_context():
        global access_token
        access_token = create_access_token(identity=USER_ID)
    global headers
    headers['Authorization'] = 'Bearer {}'.format(access_token)
    yield app.test_client()
    with app.app_context():
        db.drop_all()


def test_signup_user(app, client):
    with app.app_context():
        data = {'email': 'abc@gmail.com', 'username': 'new_user', 'password': 'secure_password'}
        response = user_service.signup_user(data)
        assert response.username == 'new_user'


def test_signup_user_missing_email(app, client):
    with app.app_context():
        data = {'username': 'new_user', 'password': 'secure_password'}
        with pytest.raises(KeyError):
            response = user_service.signup_user(data)


def test_signup_user_missing_username(app, client):
    data = {'email': 'abc@gmail.com', 'password': 'secure_password'}
    with app.app_context():
        with pytest.raises(KeyError):
            response = user_service.signup_user(data)


def test_signup_user_missing_password(app, client):
    data = {'email': 'abc@gmail.com', 'username': 'new_user'}
    with app.app_context():
        with pytest.raises(KeyError):
            response = user_service.signup_user(data)


def test_login_user(app, client):
    data = {'username': 'user1', 'password': 'password'}
    with app.app_context():
        response = user_service.login_user(data)
        assert response.username == USERNAME


def test_login_user_missing_username(app, client):
    data = {'password': 'password'}
    with app.app_context():
        with pytest.raises(KeyError):
            response = user_service.login_user(data)


def test_login_user_missing_password(app, client):
    data = {'username': 'user1'}
    with app.app_context():
        with pytest.raises(KeyError):
            response = user_service.login_user(data)


def test_get_users(app, client):
    data = {}
    with app.app_context():
        response = user_service.get_users(data)
        assert len(response) == 1


def test_signup_user_view(app, client):
    data = {'email': 'abc@gmail.com', 'username': 'new_user', 'password': 'secure_password'}
    with app.app_context():
        response = client.post(f'{BASE_URL}/signup', data=data, headers=headers)
        assert response.status_code == 201


def test_login_user_view(app, client):
    data = {'username': USERNAME, 'password': PASSWORD}
    with app.app_context():
        response = client.post(f'{BASE_URL}/login', data=data, headers=headers)
        assert response.status_code == 200
