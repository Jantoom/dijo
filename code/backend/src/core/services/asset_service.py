import boto3, random, string, io, os
from typing import List, Tuple
from src.core.services import db
from src.core.models.asset import Asset
from src.core.models.user_asset import UserAsset
from botocore.exceptions import ClientError

PAGE_SIZE = 10
BUCKET_NAME = os.getenv('S3_BUCKET', None) # Set your S3 bucket name in code/docker-compose.env
S3 = boto3.client('s3')

def get_assets(data: dict) -> Tuple[List[Asset], int]:
    # get assets uploaded by user with user_id
    if data['get_uploaded']:
        assets = Asset.query.filter_by(user_id=data['user_id']).all()
        total_asset_count = Asset.query.filter_by(user_id=data['user_id']).count()
        return assets, total_asset_count

    formatted_search_term = '%{}%'.format(data['search_term'])
    offset = (data['page'] - 1) * PAGE_SIZE
    if data['purchased']:
        assets = db.session.scalars(db.
            select(Asset).
            join(UserAsset).
            where(UserAsset.user_id == data['user_id'] and Asset.name.ilike(formatted_search_term))).all()
    else:
        assets = db.session.scalars(db.
            select(Asset).
            where(Asset.name.ilike(formatted_search_term)).
            limit(PAGE_SIZE).offset(offset)).all()
    total_asset_count = Asset.query.filter(Asset.name.ilike(formatted_search_term)).count()
    return assets, total_asset_count

def get_asset(data: dict) -> Asset:
    asset = db.session.scalars(db.
        select(Asset).
        where(Asset.id == data['asset_id'])).first()
    return asset

def upload_asset(data: dict) -> Asset:
    asset = Asset(
        user_id=data['user_id'],
        name=data['name'],
        description=data['description'],
        resource_url=data['resource_url'],
        price=data['price']
    )
    db.session.add(asset)
    db.session.commit()
    db.session.refresh(asset)
    userAsset = UserAsset(
        user_id=data['user_id'],
        asset_id=asset.id
    )
    db.session.add(userAsset)
    db.session.commit()
    return asset

def revoke_asset(data: dict) -> UserAsset:
    userAsset = UserAsset.query.filter_by(user_id=data['user_id'], asset_id=data['asset_id']).first()
    if userAsset is not None:
        db.session.delete(userAsset)
        db.session.commit()
        return userAsset
    else:
        return None
    
def delete_asset(data: dict) -> Asset:
    asset = db.session.scalars(db.
        select(Asset).
        where(Asset.id == data['asset_id'])).first()
    if asset is not None:
        userAssets = db.session.scalars(db.
            select(UserAsset).
            where(UserAsset.asset_id == data['asset_id'])).all()
        for userAsset in userAssets:
            db.session.delete(userAsset)
            db.session.commit()
        db.session.delete(asset)
        db.session.commit()
        return asset
    else:
        return None

def upload_asset_to_s3_bucket(data: dict) -> str:
    random_string = ''.join(random.choice(string.ascii_uppercase) for _ in range(10))
    key_name = f'{data["name"]}_{random_string}'
    response = S3.upload_fileobj(Fileobj=io.BytesIO(data['file']), Bucket=BUCKET_NAME, Key=key_name)
    
    return key_name

def create_presigned_url(resource_url: str) -> str:
    try:
        response = S3.generate_presigned_url('get_object',
                                                    Params={'Bucket': BUCKET_NAME,
                                                            'Key': resource_url},
                                                    ExpiresIn=3600)
    except ClientError as e:
        #TODO handle better
        print(e)
        return ""
    return response

def purchase_asset(data: dict) -> Asset:
    userAsset = db.session.scalars(db.
        select(UserAsset).
        where(db.and_(
            UserAsset.user_id == data['user_id'], 
            UserAsset.asset_id == data['asset_id']))).first()
    if userAsset is None:
        asset = db.session.scalars(db.
            select(Asset).
            where(Asset.id == data['asset_id'])).first()
        userAsset = UserAsset(
            user_id=data['user_id'],
            asset_id=data['asset_id']
        )
        db.session.add(userAsset)
        db.session.commit()
        return asset
    else:
        return None
