from src.notebook import api

@api.route('/health', methods=['GET'])
def health_check():
    """Query the health of the notebook service."""
    return 'Service is healthy.', 200