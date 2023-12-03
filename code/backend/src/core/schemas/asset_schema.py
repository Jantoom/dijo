from marshmallow import Schema, fields, validate

class AssetSchema(Schema):
    id = fields.Str(required=True)
    user_id = fields.Str(required=True)
    name = fields.Str(required=True, validate=validate.Length(min=1))
    description = fields.Str()
    price = fields.Str()
    resource_url = fields.Str()
