from botocore.exceptions import ClientError
from flask import jsonify, request
from flask_jwt_extended import jwt_required
from src.core.schemas import parse_input
from src.core.services import asset_service
from src.core.util import unknown_error
from src.marketplace import api
from src.marketplace.schemas import GetAssetListRequest, UploadAssetRequest

@api.route('', methods=['GET'])
@jwt_required()
def get_asset_list():
    """List all the assets registered with Dijo."""
    try:
        input = parse_input(GetAssetListRequest())
        assets, total_asset_count = asset_service.get_assets(input)
        asset_result = []
        for asset in assets:
            presigned_url = asset_service.create_presigned_url(asset.resource_url)
            asset_dict = asset.to_dict()
            asset_dict['presigned_url'] = presigned_url
            asset_result.append(asset_dict)
        return jsonify({
            "assets": asset_result,
            "total_asset_count": total_asset_count
            }), 200
    except Exception as e:
        return unknown_error(e)

@api.route('', methods=['POST'])
@jwt_required()
def upload_asset():
    """Upload a new asset to the marketplace."""
    try:
        input = parse_input(UploadAssetRequest())
        input['resource_url'] = asset_service.upload_asset_to_s3_bucket(input) # Consider hiding in upload_asset() as a helper function
        asset = asset_service.upload_asset(input)
        if asset is not None:
            return jsonify(asset.to_dict()), 201
        else:
            return 'Failed to upload asset.', 400
    except ClientError as e:
        return f'Failed to upload asset to S3 bucket. Reason: {e}', 400
    except Exception as e:
        return unknown_error(e)
