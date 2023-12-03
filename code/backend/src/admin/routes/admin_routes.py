from flask import jsonify
from flask_jwt_extended import jwt_required
from src.core.util import unknown_error
from src.core.schemas import parse_input
from src.core.services import asset_service, user_service
from src.admin import api
from src.admin.schemas import GetUserListRequest, DeleteAssetRequest

@api.route('/users', methods=['GET'])
@jwt_required()
def get_user_list():
    """List all the users."""
    try:
        input = parse_input(GetUserListRequest())
        result = []
        for user in user_service.get_users(input):
            result.append(user.to_dict())
        return jsonify(result), 200
    except Exception as e:
        return unknown_error(e)

@api.route('/<string:asset_id>', methods=['DELETE'])
@jwt_required()
def delete_asset(asset_id):
    """Deletes all references to an asset."""
    try:
        input = parse_input(DeleteAssetRequest())
        asset = asset_service.delete_asset(input)
        if asset is not None:
            return 'Successfully deleted asset.', 201
        else:
            return 'Failed to delete asset.', 400
    except Exception as e:
        return unknown_error(e)