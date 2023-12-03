from flask_jwt_extended import jwt_required
from src.core.util import unknown_error
from src.core.schemas import parse_input
from src.core.services import notebook_service
from src.notebook import api
from src.notebook.schemas import GetNotebookListRequest, CreateNotebookRequest

@api.route('', methods=['GET'])
@jwt_required()
def get_notebook_list():
    """List all the notebooks associated with the session account."""
    try:
        input = parse_input(GetNotebookListRequest())
        result = []
        for notebook, pages in notebook_service.get_notebooks(input):
            result.append({'notebook': notebook.to_dict(), 'pages': [page.to_dict() for page in pages]})
        return result, 200
    except Exception as e:
        return unknown_error(e)

@api.route('', methods=['POST'])
@jwt_required()
def create_notebook():
    """Add a new notebook associated with the session account."""
    try:
        input = parse_input(CreateNotebookRequest())
        notebook = notebook_service.create_notebook(input)
        if notebook is not None:
            return notebook.to_dict(), 201
        else:
            return 'Failed to create notebook.', 400
    except Exception as e:
        return unknown_error(e)