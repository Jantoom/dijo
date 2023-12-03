from marshmallow import Schema, fields

class LoginUserRequest(Schema):
    username = fields.String(required=True)
    password = fields.String(required=True)
