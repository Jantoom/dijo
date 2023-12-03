from src.auth import api

@api.route('/health', methods=['GET'])
def health_check():
    """Query the health of the user service."""
    return 'Service is healthy.', 200