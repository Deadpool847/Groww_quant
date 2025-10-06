"""
FastAPI Dependencies
Dependency injection for authentication, services, and utilities
"""

import structlog
from fastapi import Depends, HTTPException, Request
from typing import Optional

from .auth.groww_auth import get_authenticated_groww_client, get_auth_manager
from .services.market_data_service import get_market_data_service
from growwapi import GrowwAPI

logger = structlog.get_logger(__name__)

async def get_groww_client() -> GrowwAPI:
    """
    Dependency to get authenticated Groww API client
    """
    try:
        client = await get_authenticated_groww_client()
        if not client:
            logger.error("Failed to get authenticated Groww client")
            raise HTTPException(
                status_code=503,
                detail="Trading service temporarily unavailable"
            )
        return client
    except Exception as e:
        logger.error("Error in get_groww_client dependency", error=str(e))
        raise HTTPException(
            status_code=503,
            detail="Authentication service error"
        )

async def get_authenticated_user_id(
    groww_client: GrowwAPI = Depends(get_groww_client)
) -> str:
    """
    Extract user ID from authenticated session
    """
    try:
        # This would depend on how Groww API provides user identification
        # For now, returning a placeholder
        return "authenticated_user"
    except Exception as e:
        logger.error("Failed to get user ID", error=str(e))
        raise HTTPException(
            status_code=401,
            detail="Could not identify user"
        )

async def verify_authentication() -> bool:
    """
    Verify that authentication is working
    """
    try:
        auth_manager = await get_auth_manager()
        return auth_manager.is_authenticated()
    except Exception as e:
        logger.error("Authentication verification failed", error=str(e))
        return False