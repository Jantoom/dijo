from flask import Blueprint
from flask_cors import CORS
from src.core.util import create_default_app

api = Blueprint('api', __name__, url_prefix='/api/v1/notebooks')

def create_app(config_overrides=None):
    app = create_default_app(config_overrides)
    CORS(app)
    
    # Enable the endpoints
    from src.notebook.routes import notebook_list_routes, notebook_routes, page_routes
    app.register_blueprint(api)

    return app
