from marshmallow import Schema, fields

class GetAssetRequest(Schema):
    asset_id = fields.String(required=True)
