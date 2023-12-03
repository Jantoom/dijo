from marshmallow import Schema, fields
from flask_jwt_extended import get_jwt_identity

class PurchaseAssetRequest(Schema):
    user_id = fields.String(load_default=lambda: get_jwt_identity())
    asset_id = fields.String(required=True)
    headers = fields.Field()
