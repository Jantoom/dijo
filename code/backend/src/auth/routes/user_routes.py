from flask import jsonify
from flask_jwt_extended import create_access_token, jwt_required
from src.core.util import unknown_error
from src.core.schemas import parse_input
from src.core.services import user_service
from src.auth import api
from src.auth.schemas import SignupUserRequest, LoginUserRequest, LogoutUserRequest

@api.route('/signup', methods=['POST'])
def signup_user():
    """Signs up a new user."""
    try:
        input = parse_input(SignupUserRequest())
        user_service.signup_user(input)
        return 'Successfully created user.', 201
    except Exception as e:    
        return unknown_error(e)

@api.route('/login', methods=['POST'])
def login_user():
    """Logs in a user."""
    try:
        input = parse_input(LoginUserRequest())
        user = user_service.login_user(input)
        if user is not None:
            access_token = create_access_token(identity=user.id)
            return jsonify(message='Successfully logged in user.', access_token=access_token), 200
        else:
            return 'Username or password is invalid', 404
    except Exception as e:
        return unknown_error(e)

@api.route('/logout', methods=['GET'])
@jwt_required()
def logout_user():
    """Logs out a user."""
    try:
        input = parse_input(LogoutUserRequest())
        user_service.logout_user(input)
        response = jsonify(message='Successfully logged out user')
        return response, 200
    except Exception as e:
        return unknown_error(e)
