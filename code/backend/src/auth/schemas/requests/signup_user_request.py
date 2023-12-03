from marshmallow import Schema, fields, validate

class SignupUserRequest(Schema):
    email = fields.Email(required=True)
    username = fields.String(required=True, validate=validate.Length(min=1))
    password = fields.String(required=True, validate=validate.Length(min=1))
