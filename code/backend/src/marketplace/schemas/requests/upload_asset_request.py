from base64 import b64decode
from marshmallow import Schema, fields, validate
from flask_jwt_extended import get_jwt_identity

class UploadAssetRequest(Schema):
    user_id = fields.String(load_default=lambda: get_jwt_identity())
    name = fields.String(required=True, validate=validate.Length(min=1))
    description = fields.String(load_default='')
    price = fields.Integer(load_default=0)
    file = fields.Function(required=True, deserialize=lambda data: b64decode(data))
