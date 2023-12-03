from marshmallow import Schema, fields
from flask_jwt_extended import get_jwt_identity

class GetNotebookRequest(Schema):
    user_id = fields.String(load_default=lambda: get_jwt_identity())
    notebook_id = fields.String(required=True)
