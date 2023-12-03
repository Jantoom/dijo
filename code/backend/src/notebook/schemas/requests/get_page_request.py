from marshmallow import Schema, fields, validate
from flask_jwt_extended import get_jwt_identity

class GetPageRequest(Schema):
    user_id = fields.String(load_default=lambda: get_jwt_identity())
    notebook_id = fields.String(required=True)
    index = fields.Integer(required=True, validate=validate.Range(min=0))
