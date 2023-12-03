from base64 import b64encode
from flask import request
from marshmallow import Schema

def parse_input(schema: Schema) -> dict:
    params = dict()
    # Route
    params.update(request.view_args)
    # JSON
    params.update(request.get_json(silent=True) if request.is_json else dict())
    # Query
    params.update(request.args.to_dict())
    # Form
    params.update(request.form.to_dict())
    # File
    params.update({key: b64encode(value.read()).decode('utf-8') for key, value in request.files.items()})

    return schema.load(params)