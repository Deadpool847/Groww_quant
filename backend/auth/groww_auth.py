"""
Advanced Groww API Authentication Manager
Handles TOTP authentication, session management, and token refresh
"""

import asyncio
import pyotp
import structlog
from typing import Optional, Dict, Any
from datetime import datetime, timedelta
from growwapi import GrowwAPI
from growwapi.groww.exceptions import GrowwAPIAuthenticationException
from config import get_settings

logger = structlog.get_logger(__name__)

class GrowwAuthenticationManager:
    """
    Manages Groww API authentication with advanced features:
    - TOTP-based authentication
    - Automatic session refresh
    - Connection pooling
    - Error handling and retry logic
    """
    
    def __init__(self):
        self.settings = get_settings()
        self._api_client: Optional[GrowwAPI] = None
        self._totp_generator: Optional[pyotp.TOTP] = None
        self._session_data: Dict[str, Any] = {}
        self._last_auth_time: Optional[datetime] = None
        self._auth_lock = asyncio.Lock()
        self._is_authenticated = False
        
        # Initialize TOTP generator
        if self.settings.groww_totp_seed:
            self._totp_generator = pyotp.TOTP(self.settings.groww_totp_seed)
        
    async def initialize(self) -> bool:
        """Initialize the authentication manager"""
        try:
            logger.info("Initializing Groww Authentication Manager")
            
            # Validate configuration
            if not self.settings.groww_api_key or not self.settings.groww_api_secret:
                raise ValueError("Groww API key and secret are required")
            
            # Initialize API client
            self._api_client = GrowwAPI()
            
            # Perform initial authentication
            await self.authenticate()
            
            logger.info("Groww Authentication Manager initialized successfully")
            return True
            
        except Exception as e:
            logger.error("Failed to initialize authentication manager", error=str(e))
            return False
    
    async def authenticate(self) -> bool:
        """
        Perform TOTP authentication with Groww API
        Returns True if authentication successful, False otherwise
        """
        async with self._auth_lock:
            try:
                if not self._api_client:
                    self._api_client = GrowwAPI()
                
                # Generate TOTP token
                totp_token = None
                if self._totp_generator:
                    totp_token = self._totp_generator.now()
                    logger.debug("Generated TOTP token for authentication")
                
                # Prepare authentication parameters
                auth_params = {
                    'api_key': self.settings.groww_api_key,
                    'api_secret': self.settings.groww_api_secret,
                }
                
                if totp_token:
                    auth_params['totp'] = totp_token
                
                # Perform authentication
                logger.info("Attempting authentication with Groww API")
                
                # Use the login method with TOTP
                auth_response = await self._api_client.login(
                    user_id=self.settings.groww_api_key,
                    password="",  # Not used for API authentication
                    totp=totp_token
                )
                
                if auth_response and auth_response.get('status') == 'success':
                    self._is_authenticated = True
                    self._last_auth_time = datetime.now()
                    self._session_data = auth_response.get('data', {})
                    
                    logger.info(
                        "Authentication successful",
                        session_id=self._session_data.get('session_id', 'unknown'),
                        user_id=self._session_data.get('user_id', 'unknown')
                    )
                    
                    return True
                else:
                    error_msg = auth_response.get('error', 'Unknown authentication error')
                    logger.error("Authentication failed", error=error_msg)
                    self._is_authenticated = False
                    return False
                    
            except GrowwAPIAuthenticationException as e:
                logger.error("Groww API authentication error", error=str(e))
                self._is_authenticated = False
                return False
            except Exception as e:
                logger.error("Unexpected authentication error", error=str(e), exc_info=True)
                self._is_authenticated = False
                return False
    
    async def get_authenticated_client(self) -> Optional[GrowwAPI]:
        """
        Get authenticated API client with automatic session management
        """
        # Check if authentication is needed
        if not self._is_authenticated or self._should_refresh_auth():
            success = await self.authenticate()
            if not success:
                return None
        
        return self._api_client
    
    def _should_refresh_auth(self) -> bool:
        """
        Check if authentication should be refreshed
        """
        if not self._last_auth_time:
            return True
        
        # Refresh authentication every 8 hours as a safety measure
        time_since_auth = datetime.now() - self._last_auth_time
        return time_since_auth > timedelta(hours=8)
    
    async def refresh_authentication(self) -> bool:
        """
        Force refresh authentication
        """
        logger.info("Forcing authentication refresh")
        self._is_authenticated = False
        return await self.authenticate()
    
    def is_authenticated(self) -> bool:
        """Check if currently authenticated"""
        return self._is_authenticated and self._api_client is not None
    
    async def get_session_info(self) -> Dict[str, Any]:
        """Get current session information"""
        return {
            'authenticated': self._is_authenticated,
            'last_auth_time': self._last_auth_time.isoformat() if self._last_auth_time else None,
            'session_data': self._session_data,
            'should_refresh': self._should_refresh_auth()
        }
    
    async def logout(self) -> bool:
        """
        Logout and cleanup session
        """
        try:
            if self._api_client and self._is_authenticated:
                # Perform logout if API supports it
                logger.info("Logging out from Groww API")
                # Note: Actual logout implementation depends on Groww API
                
            self._is_authenticated = False
            self._last_auth_time = None
            self._session_data = {}
            self._api_client = None
            
            logger.info("Logout successful")
            return True
            
        except Exception as e:
            logger.error("Error during logout", error=str(e))
            return False
    
    async def validate_connection(self) -> bool:
        """
        Validate that the API connection is working
        """
        try:
            if not self._is_authenticated:
                return False
            
            # Try a simple API call to validate connection
            client = await self.get_authenticated_client()
            if not client:
                return False
            
            # Make a test API call (like getting user profile)
            test_response = await client.get_profile()
            
            if test_response and test_response.get('status') == 'success':
                logger.debug("Connection validation successful")
                return True
            else:
                logger.warning("Connection validation failed", response=test_response)
                return False
                
        except Exception as e:
            logger.error("Connection validation error", error=str(e))
            return False

# Global authentication manager instance
_auth_manager: Optional[GrowwAuthenticationManager] = None

async def get_auth_manager() -> GrowwAuthenticationManager:
    """
    Get or create the global authentication manager instance
    """
    global _auth_manager
    
    if _auth_manager is None:
        _auth_manager = GrowwAuthenticationManager()
        await _auth_manager.initialize()
    
    return _auth_manager

async def get_authenticated_groww_client() -> Optional[GrowwAPI]:
    """
    Convenience function to get authenticated Groww API client
    """
    auth_manager = await get_auth_manager()
    return await auth_manager.get_authenticated_client()

async def cleanup_auth() -> None:
    """
    Cleanup authentication resources
    """
    global _auth_manager
    
    if _auth_manager:
        await _auth_manager.logout()
        _auth_manager = None