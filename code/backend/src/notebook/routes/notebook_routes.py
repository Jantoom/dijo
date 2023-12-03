from flask import jsonify
from flask_jwt_extended import jwt_required
from src.core.util import unknown_error
from src.core.schemas import parse_input
from src.core.services import notebook_service
from src.notebook import api
from src.notebook.schemas import GetNotebookRequest, SaveNotebookRequest, DeleteNotebookRequest, CreatePageRequest

@api.route('/<string:notebook_id>', methods=['GET'])
@jwt_required()
def get_notebook(notebook_id):
    """Get details for a particular notebook associated with the session account."""
    try:
        input = parse_input(GetNotebookRequest())
        notebook, pages = notebook_service.get_notebook(input)
        if notebook is not None:
            return jsonify({'notebook': notebook.to_dict(), 'pages': [page.to_dict() for page in pages]}), 200
        else:
            return 'Notebook does not exist.', 404
    except Exception as e:
        return unknown_error(e)

@api.route('/<string:notebook_id>', methods=['PUT'])
@jwt_required()
def save_notebook(notebook_id):
    """Edit details about a notebook associated with the session account."""
    try:
        input = parse_input(SaveNotebookRequest())
        notebook = notebook_service.edit_notebook(input)
        if notebook is not None:
            return jsonify(notebook.to_dict()), 201
        else:
            return 'Failed to edit notebook.', 400
    except Exception as e:
        return unknown_error(e)

@api.route('/<string:notebook_id>', methods=['DELETE'])
@jwt_required()
def delete_notebook(notebook_id):
    """Deletes a notebook associated with the session account."""
    try:
        input = parse_input(DeleteNotebookRequest())
        notebook = notebook_service.delete_notebook(input)
        if notebook is not None:
            return 'Successfully deleted notebook.', 204
        else:
            return 'Failed to delete notebook.', 400
    except Exception as e:
        return unknown_error(e)

@api.route('/<string:notebook_id>', methods=['POST'])
@jwt_required()
def create_page(notebook_id):
    """Add a new page associated with the notebook and session account."""
    try:
        input = parse_input(CreatePageRequest())
        page = notebook_service.add_page(input)
        if page is not None:
            return jsonify(page.to_dict()), 201
        else:
            return 'Failed to add page.', 400
    except Exception as e:
        return unknown_error(e)
