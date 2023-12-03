from marshmallow import Schema, fields, validate
from flask_jwt_extended import get_jwt_identity

class CreateNotebookRequest(Schema):
    user_id = fields.String(load_default=lambda: get_jwt_identity())
    title = fields.String(required=True, validate=validate.Length(min=1))
    description = fields.String(load_default='')
