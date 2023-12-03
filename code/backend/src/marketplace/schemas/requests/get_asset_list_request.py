from marshmallow import Schema, fields, validate
from flask_jwt_extended import get_jwt_identity

class GetAssetListRequest(Schema):
    user_id = fields.String(load_default=lambda: get_jwt_identity())
    purchased = fields.Boolean(load_default=False)
    search_term = fields.String(load_default='')
    page = fields.Integer(load_default=1, validate=validate.Range(min=0))
    get_uploaded = fields.Boolean(load_default=False)
