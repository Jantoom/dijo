import src.marketplace.routes.asset_list_routes
import src.marketplace.routes.asset_routes
from src.marketplace import api

@api.route('/health', methods=['GET'])
def health_check():
    """Query the health of the asset service."""
    return 'Service is healthy.', 200