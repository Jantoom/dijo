import traceback, os, secrets
from flask import Flask
from flask_cors import CORS
from datetime import timedelta


def unknown_error(e):
    return 'An unknown error occurred trying to process the request.' + \
        f'\nMessage: {e}' + \
        f'\n{traceback.format_exc()}', 500

def create_default_app(config_overrides=None) -> Flask:
    app = Flask(__name__)
    CORS(app)

    app.config["JWT_SECRET_KEY"] = os.getenv('SECRET_KEY', secrets.token_urlsafe())
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=5)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI', 'sqlite:///db.sqlite')

    if config_overrides:
        app.config.update(config_overrides)

    # Load the models
    from src.core.models import Asset, Notebook, Page, UserAsset, User
    from src.core.services import db, ma, jwt_manager
    db.init_app(app)
    ma.init_app(app)
    jwt_manager.init_app(app)

    # Create the tables
    with app.app_context(): 
        db.create_all()
        db.session.commit()

    return app