from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.core.util import unknown_error
from src.core.schemas import parse_input
from src.core.services import asset_service
from src.marketplace import api
from src.marketplace.schemas import GetAssetRequest, PurchaseAssetRequest, RevokeAssetRequest

@api.route('/<string:asset_id>', methods=['GET'])
@jwt_required()
def get_asset(asset_id):
    """Get details for a particular asset."""
    try:
        input = parse_input(GetAssetRequest())
        asset = asset_service.get_asset(input)
        if asset:
            return jsonify(asset.to_dict()), 200
        else:
            return 'Asset does not exist.', 404
    except Exception as e:
        return unknown_error(e)

@api.route('/<string:asset_id>', methods=['POST'])
@jwt_required()
def purchase_asset(asset_id):
    """Purchase an asset for an account."""
    try:
        input = parse_input(PurchaseAssetRequest())
        asset = asset_service.purchase_asset(input)
        if asset is not None:
            return jsonify(asset.to_dict()), 200
        else:
            return 'Failed to purchase asset.', 400
    except Exception as e:
        return unknown_error(e)
    
@api.route('/<string:asset_id>', methods=['DELETE'])
@jwt_required()
def revoke_asset(asset_id):
    """Revokes an asset associated with the session account."""
    try:
        input = parse_input(RevokeAssetRequest())
        userAsset = asset_service.revoke_asset(input)
        if userAsset is not None:
            return 'Successfully revoked asset.', 201
        else:
            return 'Failed to revoke asset.', 400
    except Exception as e:
        return unknown_error(e)
