from src.admin import api

@api.route('/health', methods=['GET'])
def health_check():
    """Query the health of the admin service."""
    return 'Service is healthy.', 200