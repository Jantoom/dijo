import pytest
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash
from src.marketplace import create_app
from src.core.services import asset_service, db
from src.core.models.asset import Asset
from src.core.models.user_asset import UserAsset
from src.core.models.user import User

USER_ID = 'c50c21d6-e1c6-4ea4-8bc3-4f65ce126d7f'
test_asset_id = ''
test_purchasable_asset_id = ''
test_purchased_asset_id = ''
access_token = ''
headers = {}
BASE_URL = '/api/v1/assets'


@pytest.fixture(scope='function')
def app():
    yield create_app({'SQLALCHEMY_DATABASE_URI': 'sqlite:///test_db.sqlite'})


@pytest.fixture
def create_test_data(app):
    with app.app_context():
        uploaded_asset = Asset(
            user_id='c50c21d6-e1c6-4ea4-8bc3-4f65ce126d7f',
            name='uploaded_asset',
            description='descr',
            resource_url='abc',
            price=0
        )
        asset2 = Asset(
            user_id='00000000-e1c6-4ea4-8bc3-000000000000',
            name='asset2',
            description='descr',
            resource_url='abcd',
            price=0
        )
        purchased_asset = Asset(
            user_id='11111111-e1c6-4ea4-8bc3-111111111111',
            name='purchased_asset',
            description='descr',
            resource_url='abce',
            price=0
        )
        user1 = User(email='abc@cde.com',
                    username='user1',
                    password_hash=generate_password_hash('password'))
        user1.id = USER_ID
        db.session.add(purchased_asset)
        db.session.add(asset2)
        db.session.commit()

        user_asset1 = UserAsset(user_id=USER_ID, asset_id=purchased_asset.id)
        global test_asset_id
        test_asset_id = purchased_asset.id
        global test_purchasable_asset_id
        test_purchasable_asset_id = asset2.id
        db.session.add(uploaded_asset)
        db.session.add(user1)
        db.session.add(user_asset1)
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


def test_get_purchased_assets(app, client):
    data = {'user_id': USER_ID,
            'purchased': True,
            'search_term': '',
            'page': 1,
            'get_uploaded': False
            }
    with app.app_context():
        response = asset_service.get_assets(data)
        assert len(response[0]) == 1
        assert response[0][0].name == 'purchased_asset'


def test_get_all_assets(app, client):
    data = {'user_id': USER_ID,
            'purchased': False,
            'search_term': '',
            'page': 1,
            'get_uploaded': False
            }
    with app.app_context():
        response = asset_service.get_assets(data)
        assert len(response[0]) == 3


def test_get_assets_by_search_term(app, client):
    data = {'user_id': USER_ID,
            'purchased': False,
            'search_term': '2',
            'page': 1,
            'get_uploaded': False
            }
    with app.app_context():
        response = asset_service.get_assets(data)
        assert len(response[0]) == 1
        assert response[0][0].name == 'asset2'


def test_get_assets_missing_user_id(app, client):
    data = {'purchased': False,
            'search_term': '2',
            'page': 1,
            'get_uploaded': True
            }
    with app.app_context():
        with pytest.raises(KeyError):
            response = asset_service.get_assets(data)


def test_get_asset_valid(app, client):
    data = {'asset_id': test_asset_id}
    with app.app_context():
        response = asset_service.get_asset(data)
        assert response.name == 'purchased_asset'


def test_asset_missing_asset_id(app, client):
    data = {}
    with app.app_context():
        with pytest.raises(KeyError):
            response = asset_service.get_assets(data)


def test_get_uploaded_assets(app, client):
    data = {'user_id': USER_ID,
            'purchased': False,
            'search_term': '',
            'page': 1,
            'get_uploaded': True
            }
    with app.app_context():
        response = asset_service.get_assets(data)
        assert len(response[0]) == 1
        assert response[0][0].name == 'uploaded_asset'


def test_revoke_asset(app, client):
    data = {'user_id': USER_ID, 'asset_id': test_asset_id}
    with app.app_context():
        response = asset_service.revoke_asset(data)
        assert response.user_id == USER_ID
        assert response.asset_id == test_asset_id


def test_revoke_asset_missing_user_id(app, client):
    data = {'asset_id': test_asset_id}
    with app.app_context():
        with pytest.raises(KeyError):
            response = asset_service.revoke_asset(data)


def test_revoke_asset_missing_asset_id(app, client):
    data = {'user_id': USER_ID}
    with app.app_context():
        with pytest.raises(KeyError):
            response = asset_service.revoke_asset(data)


def test_revoke_asset_invalid_user_id(app, client):
    data = {'user_id': '22222222-e1c6-4ea4-8bc3-4f65ce126d7f', 'asset_id': test_asset_id}
    with app.app_context():
        response = asset_service.revoke_asset(data)
        assert response is None


def test_revoke_asset_invalid_asset_id(app, client):
    data = {'user_id': USER_ID, 'asset_id': '22222222-e1c6-4ea4-8bc3-4f65ce126d7f'}
    with app.app_context():
        response = asset_service.revoke_asset(data)
        assert response is None


def test_purchase_asset(app, client):
    data = {'user_id': USER_ID, 'asset_id': test_purchasable_asset_id}
    with app.app_context():
        response = asset_service.purchase_asset(data)
        assert response.id == test_purchasable_asset_id


def test_purchase_asset_already_purchased(app, client):
    data = {'user_id': USER_ID, 'asset_id': test_asset_id}
    with app.app_context():
        response = asset_service.purchase_asset(data)
        assert response is None


def test_upload_asset_valid(app, client):
    data = {'user_id': USER_ID,
            'name': 'asset_name',
            'description': 'asset_description',
            'resource_url': 'asset_url',
            'price': 0}
    with app.app_context():
        response = asset_service.upload_asset(data)
        assert response


def test_upload_asset_missing_asset_name_raises_key_error(app, client):
    data = {'user_id': USER_ID,
            'description': 'asset_description',
            'resource_url': 'asset_url',
            'price': 0}
    with app.app_context():
        with pytest.raises(KeyError):
            response = asset_service.upload_asset(data)


def test_upload_asset_missing_asset_description_raises_key_error(app, client):
    data = {'user_id': USER_ID,
            'name': 'asset_name',
            'resource_url': 'asset_url',
            'price': 0}
    with app.app_context():
        with pytest.raises(KeyError):
            response = asset_service.upload_asset(data)


def test_upload_asset_missing_asset__resource_url_raises_key_error(app, client):
    data = {'user_id': USER_ID,
            'name': 'asset_name',
            'description': 'asset_description',
            'price': 0}
    with app.app_context():
        with pytest.raises(KeyError):
            response = asset_service.upload_asset(data)


def test_upload_asset_missing_user_id_raises_key_error(app, client):
    data = {'name': 'asset_name',
            'description': 'asset_description',
            'resource_url': 'asset_url',
            'price': 0}
    with app.app_context():
        with pytest.raises(KeyError):
            response = asset_service.upload_asset(data)


def test_upload_asset_missing_price_raises_key_error(app, client):
    data = {'user_id': USER_ID,
            'name': 'asset_name',
            'description': 'asset_description',
            'resource_url': 'asset_url'}
    with app.app_context():
        with pytest.raises(KeyError):
            response = asset_service.upload_asset(data)


def test_upload_asset_view(app, client, mocker):
    with app.app_context():
        mocker.patch("src.core.services.asset_service.upload_asset_to_s3_bucket", return_value='mocked_resource_url')
        test_img = open('test/resources/black.png', 'rb')
        data = {'name': 'abc', 'description': 'descr', 'price': 0, 'file': test_img}
        response = client.post(BASE_URL, data=data, headers=headers)
        assert response.status_code == 201


def test_get_assets_view(app, client, mocker):
    with app.app_context():
        mocker.patch("src.core.services.asset_service.create_presigned_url", return_value='mocked_presigned_url')
        response = client.get(BASE_URL, headers=headers)
        assert response.status_code == 200


def test_get_asset_view(app, client):
    with app.app_context():
        response = client.get(f'{BASE_URL}/{test_asset_id}', headers=headers)
        assert response.status_code == 200


def test_purchase_asset_view(app, client):
    with app.app_context():
        response = client.post(f'{BASE_URL}/{test_purchasable_asset_id}', headers=headers)
        assert response.status_code == 200


def test_revoke_asset_view(app, client):
    with app.app_context():
        response = client.delete(f'{BASE_URL}/{test_asset_id}', headers=headers)
        assert response.status_code == 201
