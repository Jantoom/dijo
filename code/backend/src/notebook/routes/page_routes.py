from flask import jsonify
from flask_jwt_extended import jwt_required
from src.core.util import unknown_error
from src.core.schemas import parse_input
from src.core.services import notebook_service
from src.notebook import api
from src.notebook.schemas import GetPageRequest, SavePageRequest, DeletePageRequest

@api.route('/<string:notebook_id>/<int:index>', methods=['GET'])
@jwt_required()
def get_page(notebook_id, index):
    """Get details for a particular page associated with the notebook and session account."""
    try:
        input = parse_input(GetPageRequest())
        page = notebook_service.get_page(input)
        if page is not None:
            return jsonify(page.to_dict()), 200
        else:
            return 'Page does not exist.', 404
    except Exception as e:
        return unknown_error(e)

@api.route('/<string:notebook_id>/<int:index>', methods=['PUT'])
@jwt_required()
def save_page(notebook_id, index):
    """Save details about a page associated with the notebook and session account."""
    try:
        input = parse_input(SavePageRequest())
        page = notebook_service.save_page(input)
        if page is not None:
            return jsonify(page.to_dict()), 201
        else:
            return 'Failed to save page.', 400
    except Exception as e:
        return unknown_error(e)

@api.route('/<string:notebook_id>/<int:index>', methods=['DELETE'])
@jwt_required()
def delete_page(notebook_id, index):
    """Deletes a page associated with the notebook and session account."""
    try:
        input = parse_input(DeletePageRequest())
        page = notebook_service.delete_page(input)
        if page is not None:
            return 'Successfully deleted page.', 201
        else:
            return 'Failed to delete page.', 400
    except Exception as e:
        return unknown_error(e)
