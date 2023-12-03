import pytest
from flask_jwt_extended import create_access_token
from src.notebook import create_app
from src.core.services import notebook_service, db
from src.core.models.user import User
from src.core.models.notebook import Notebook
from src.core.models.page import Page
from werkzeug.security import generate_password_hash


USER_ID = 'c50c21d6-e1c6-4ea4-8bc3-4f65ce126d7f'
access_token = ''
headers = {}
notebook1_id = ''
BASE_URL = '/api/v1/notebooks'


@pytest.fixture(scope='function')
def app():
    yield create_app({'SQLALCHEMY_DATABASE_URI': 'sqlite:///test_db.sqlite'})


@pytest.fixture
def create_test_data(app):
    with app.app_context():
        user1 = User(email='abc@cde.com', username='user1', password_hash=generate_password_hash('password'))
        user1.id = USER_ID
        db.session.add(user1)
        db.session.commit()
        notebook1 = Notebook(user_id=USER_ID,
                            title='notebook1',
                            description='descr')
        db.session.add(notebook1)
        db.session.commit()
        global notebook1_id
        notebook1_id = notebook1.id
        page1_notebook1 = Page(notebook_id=notebook1_id, title='page1_notebook1', content='')
        page2_notebook1 = Page(notebook_id=notebook1_id, title='page2_notebook1', content='')
        db.session.add(page1_notebook1)
        db.session.add(page2_notebook1)
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


def test_get_notebooks(app, client):
    data = {'user_id': USER_ID}
    with app.app_context():
        response = notebook_service.get_notebooks(data)
        assert len(response) == 1
        assert response[0][0].title == 'notebook1'


def test_get_notebooks_missing_user_id(app, client):
    data = {}
    with app.app_context():
        with pytest.raises(KeyError):
            response = notebook_service.get_notebooks(data)


def test_get_notebooks_invalid_user_id(app, client):
    data = {'user_id': '00000000-e1c6-4ea4-8bc3-000000000123'}
    with app.app_context():
        response = notebook_service.get_notebooks(data)
        assert len(response) == 0


def test_get_notebook(app, client):
    data = {'user_id': USER_ID, 'notebook_id': notebook1_id}
    with app.app_context():
        response = notebook_service.get_notebook(data)
        assert response[0].title == 'notebook1'
        assert len(response[1]) == 2


def test_get_notebook_missing_user_id(app, client):
    data = {'notebook_id': notebook1_id}
    with app.app_context():
        with pytest.raises(KeyError):
            response = notebook_service.get_notebook(data)


def test_get_notebook_missing_notebook_id(app, client):
    data = {'user_id': USER_ID}
    with app.app_context():
        with pytest.raises(KeyError):
            response = notebook_service.get_notebook(data)


def test_get_notebook_invalid_notebook_id(app, client):
    data = {'user_id': USER_ID, 'notebook_id': '00000000-e1c6-4ea4-8bc3-000000000123'}
    with app.app_context():
        response = notebook_service.get_notebook(data)
        assert response[0] is None
        assert response[1] is None


def test_get_notebook_invalid_user_id(app, client):
    data = {'user_id': '00000000-e1c6-4ea4-8bc3-000000000123', 'notebook_id': notebook1_id}
    with app.app_context():
        response = notebook_service.get_notebook(data)
        assert response[0] is None
        assert response[1] is None


def test_create_notebook(app, client):
    data = {'user_id': USER_ID, 'title': 'title1', 'description': 'desc'}
    with app.app_context():
        response = notebook_service.create_notebook(data)
        assert response.title == 'title1'


def test_create_notebook_missing_user_id(app, client):
    data = {'title': 'title1', 'description': 'desc'}
    with app.app_context():
        with pytest.raises(KeyError):
            response = notebook_service.create_notebook(data)


def test_create_notebook_missing_title(app, client):
    data = {'user_id': USER_ID, 'description': 'desc'}
    with app.app_context():
        with pytest.raises(KeyError):
            response = notebook_service.create_notebook(data)


def test_edit_notebook(app, client):
    data = {'user_id': USER_ID, 'notebook_id': notebook1_id, 'title': 'new_title', 'description': 'new_description'}
    with app.app_context():
        response = notebook_service.edit_notebook(data)
        assert response.title == 'new_title'
        assert response.description == 'new_description'


def test_edit_notebook_missing_user_id(app, client):
    data = {'notebook_id': notebook1_id, 'title': 'new_title', 'description': 'new_description'}
    with app.app_context():
        with pytest.raises(KeyError):
            response = notebook_service.edit_notebook(data)


def test_edit_notebook_missing_notebook_id(app, client):
    data = {'user_id': USER_ID, 'title': 'new_title', 'description': 'new_description'}
    with app.app_context():
        with pytest.raises(KeyError):
            response = notebook_service.edit_notebook(data)


def test_delete_notebook(app, client):
    data = {'user_id': USER_ID, 'notebook_id': notebook1_id}
    with app.app_context():
        response = notebook_service.delete_notebook(data)
        assert response.id == notebook1_id


def test_delete_notebook_missing_user_id(app, client):
    data = {'notebook_id': notebook1_id}
    with app.app_context():
        with pytest.raises(KeyError):
            response = notebook_service.delete_notebook(data)


def test_delete_notebook_missing_notebook_id(app, client):
    data = {'user_id': USER_ID}
    with app.app_context():
        with pytest.raises(KeyError):
            response = notebook_service.delete_notebook(data)


def test_get_pages(app, client):
    data = {'user_id': USER_ID, 'notebook_id': notebook1_id}
    with app.app_context():
        response = notebook_service.get_pages(data)
        assert len(response) == 2


def test_get_pages_missing_user_id(app, client):
    data = {'notebook_id': notebook1_id}
    with app.app_context():
        with pytest.raises(KeyError):
            response = notebook_service.get_pages(data)


def test_get_pages_missing_notebook_id(app, client):
    data = {'user_id': USER_ID}
    with app.app_context():
        with pytest.raises(KeyError):
            response = notebook_service.get_pages(data)


def test_get_page(app, client):
    data = {'user_id': USER_ID, 'notebook_id': notebook1_id, 'index': 1}
    with app.app_context():
        response = notebook_service.get_page(data)
        assert response.title == 'page1_notebook1'


def test_get_page_missing_user_id(app, client):
    data = {'notebook_id': notebook1_id, 'index': 1}
    with app.app_context():
        with pytest.raises(KeyError):
            response = notebook_service.get_page(data)


def test_get_page_missing_notebook_id(app, client):
    data = {'user_id': USER_ID, 'index': 1}
    with app.app_context():
        with pytest.raises(KeyError):
            response = notebook_service.get_page(data)


def test_get_page_missing_index(app, client):
    data = {'user_id': USER_ID, 'notebook_id': notebook1_id}
    with app.app_context():
        with pytest.raises(KeyError):
            response = notebook_service.get_page(data)


def test_add_page(app, client):
    data = {'user_id': USER_ID, 'notebook_id': notebook1_id, 'title': 'title123', 'content': 'content123'}
    with app.app_context():
        response = notebook_service.add_page(data)
        assert response.title == 'title123'


def test_add_page_missing_user_id(app, client):
    data = {'notebook_id': notebook1_id, 'title': 'title123', 'content': 'content123'}
    with app.app_context():
        with pytest.raises(KeyError):
            response = notebook_service.add_page(data)


def test_add_page_missing_notebook_id(app, client):
    data = {'user_id': USER_ID, 'title': 'title123', 'content': 'content123'}
    with app.app_context():
        with pytest.raises(KeyError):
            response = notebook_service.add_page(data)


def test_add_page_missing_title(app, client):
    data = {'user_id': USER_ID, 'notebook_id': notebook1_id, 'content': 'content123'}
    with app.app_context():
        with pytest.raises(KeyError):
            response = notebook_service.add_page(data)


def test_add_page_missing_content(app, client):
    data = {'user_id': USER_ID, 'notebook_id': notebook1_id, 'title': 'title123'}
    with app.app_context():
        with pytest.raises(KeyError):
            response = notebook_service.add_page(data)


def test_save_page(app, client):
    data = {'user_id': USER_ID, 'notebook_id': notebook1_id, 'title': 'title123', 'content': 'content123', 'index': 1}
    with app.app_context():
        response = notebook_service.save_page(data)
        assert response.title == 'title123'


def test_save_page_missing_user_id(app, client):
    data = {'notebook_id': notebook1_id, 'title': 'title123', 'content': 'content123', 'index': 1}
    with app.app_context():
        with pytest.raises(KeyError):
            response = notebook_service.save_page(data)


def test_delete_page(app, client):
    data = {'user_id': USER_ID, 'notebook_id': notebook1_id, 'index': 1}
    with app.app_context():
        response = notebook_service.delete_page(data)
        assert response.title == 'page1_notebook1'


def test_delete_page_missing_user_id(app, client):
    data = {'notebook_id': notebook1_id, 'index': 1}
    with app.app_context():
        with pytest.raises(KeyError):
            response = notebook_service.delete_page(data)


def test_delete_page_missing_notebook_id(app, client):
    data = {'user_id': USER_ID, 'index': 1}
    with app.app_context():
        with pytest.raises(KeyError):
            response = notebook_service.delete_page(data)


def test_delete_page_missing_title(app, client):
    data = {'user_id': USER_ID, 'notebook_id': notebook1_id}
    with app.app_context():
        with pytest.raises(KeyError):
            response = notebook_service.delete_page(data)


def test_get_notebooks_view(app, client):
    with app.app_context():
        response = client.get(BASE_URL, headers=headers)
        assert response.status_code == 200


def test_create_notebook_view(app, client):
    data = {'user_id': USER_ID, 'title': 'title', 'description': 'description'}
    with app.app_context():
        response = client.post(BASE_URL, data=data, headers=headers)
        assert response.status_code == 201


def test_get_notebook_view(app, client):
    with app.app_context():
        response = client.get(f'{BASE_URL}/{notebook1_id}', headers=headers)
        assert response.status_code == 200


def test_get_nonexisting_notebook_view(app, client):
    with app.app_context():
        response = client.get(f'{BASE_URL}/c50c21d6-e1c6-4ea4-8bc3-111111111111', headers=headers)
        assert response.status_code == 404


def test_save_notebook_view(app, client):
    data = {'user_id': USER_ID, 'title': 'new_title', 'description': 'description'}
    with app.app_context():
        response = client.put(f'{BASE_URL}/{notebook1_id}', data=data, headers=headers)
        assert response.status_code == 201


def test_delete_notebook_view(app, client):
    with app.app_context():
        response = client.delete(f'{BASE_URL}/{notebook1_id}', headers=headers)
        assert response.status_code == 204


def test_create_page_view(app, client):
    data = {'user_id': USER_ID, 'notebook_id': notebook1_id, 'title': 'title123', 'content': 'content123'}
    with app.app_context():
        response = client.post(f'{BASE_URL}/{notebook1_id}', data=data, headers=headers)
        assert response.status_code == 201
