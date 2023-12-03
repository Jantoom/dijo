from marshmallow import Schema, fields
from flask_jwt_extended import get_jwt_identity

class GetNotebookListRequest(Schema):
    user_id = fields.String(load_default=lambda: get_jwt_identity())
