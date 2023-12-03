from marshmallow import Schema, fields, validate
from flask_jwt_extended import get_jwt_identity

class SaveNotebookRequest(Schema):
    user_id = fields.String(load_default=lambda: get_jwt_identity())
    notebook_id = fields.String(required=True)
    title = fields.String(required=True, validate=validate.Length(min=1))
    description = fields.String(load_default='')
