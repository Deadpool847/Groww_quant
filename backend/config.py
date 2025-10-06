"""
Advanced Configuration Management for Aladdin Trading Platform
Handles all environment variables, settings, and application configuration
"""

import os
from typing import List, Optional, Union
from pydantic_settings import BaseSettings
from pydantic import Field, validator
from pathlib import Path
import logging

# Load environment variables from .env file
from dotenv import load_dotenv
load_dotenv()

class Settings(BaseSettings):
    """
    Comprehensive application settings with validation
    """
    
    # Groww API Configuration
    groww_api_key: str = Field(..., env="GROWW_API_KEY")
    groww_api_secret: str = Field(..., env="GROWW_API_SECRET")
    groww_totp_seed: Optional[str] = Field(None, env="GROWW_TOTP_SEED")
    groww_allowed_ip: Optional[str] = Field(None, env="GROWW_ALLOWED_IP")
    
    # Database Configuration
    mongo_url: str = Field(default="mongodb://localhost:27017", env="MONGO_URL")
    db_name: str = Field(default="aladdin_trading_db", env="DB_NAME")
    
    # Application Configuration
    environment: str = Field(default="development", env="ENVIRONMENT")
    secret_key: str = Field(default="change-this-secret-key", env="SECRET_KEY")
    debug: bool = Field(default=False, env="DEBUG")
    
    # Cache Configuration
    redis_url: str = Field(default="redis://localhost:6379", env="REDIS_URL")
    cache_ttl: int = Field(default=300, env="CACHE_TTL")
    
    # Rate Limiting Configuration
    rate_limit_enabled: bool = Field(default=True, env="RATE_LIMIT_ENABLED")
    rate_limit_redis_url: str = Field(default="redis://localhost:6379", env="RATE_LIMIT_REDIS_URL")
    
    # Logging Configuration
    log_level: str = Field(default="INFO", env="LOG_LEVEL")
    structured_logging: bool = Field(default=True, env="STRUCTURED_LOGGING")
    
    # Security Configuration
    allowed_hosts: str = Field(default="localhost,127.0.0.1", env="ALLOWED_HOSTS")
    cors_origins: str = Field(default="http://localhost:3000,http://127.0.0.1:3000", env="CORS_ORIGINS")
    
    # Performance Configuration
    max_workers: int = Field(default=4, env="MAX_WORKERS")
    keepalive_timeout: int = Field(default=65, env="KEEPALIVE_TIMEOUT")
    graceful_timeout: int = Field(default=30, env="GRACEFUL_TIMEOUT")
    
    # API Configuration
    api_version: str = "v1"
    api_prefix: str = "/api"
    
    # Trading Configuration
    max_order_quantity: int = Field(default=10000, env="MAX_ORDER_QUANTITY")
    max_order_value: float = Field(default=1000000.0, env="MAX_ORDER_VALUE")
    default_order_validity: str = Field(default="DAY", env="DEFAULT_ORDER_VALIDITY")
    
    # Risk Management Configuration
    max_portfolio_risk_score: float = Field(default=8.0, env="MAX_PORTFOLIO_RISK_SCORE")
    var_confidence_level: float = Field(default=0.95, env="VAR_CONFIDENCE_LEVEL")
    stress_test_scenarios: int = Field(default=10, env="STRESS_TEST_SCENARIOS")
    
    def get_allowed_hosts(self) -> List[str]:
        return [host.strip() for host in self.allowed_hosts.split(',')]
    
    def get_cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.cors_origins.split(',')]
    
    @validator('log_level')
    def validate_log_level(cls, v):
        valid_levels = ['DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL']
        if v.upper() not in valid_levels:
            raise ValueError(f'Log level must be one of: {valid_levels}')
        return v.upper()
    
    @validator('environment')
    def validate_environment(cls, v):
        valid_envs = ['development', 'testing', 'staging', 'production']
        if v.lower() not in valid_envs:
            raise ValueError(f'Environment must be one of: {valid_envs}')
        return v.lower()
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False

# Global settings instance
settings = Settings()

def get_settings() -> Settings:
    """Get application settings"""
    return settings

# Logging configuration
LOGGING_CONFIG = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'default': {
            'format': '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        },
        'structured': {
            'format': '%(message)s',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'structured' if settings.structured_logging else 'default',
            'level': settings.log_level,
        },
        'file': {
            'class': 'logging.FileHandler',
            'filename': 'logs/aladdin_trading.log',
            'formatter': 'structured' if settings.structured_logging else 'default',
            'level': settings.log_level,
        },
    },
    'root': {
        'level': settings.log_level,
        'handlers': ['console', 'file'],
    },
    'loggers': {
        'aladdin': {
            'level': settings.log_level,
            'handlers': ['console', 'file'],
            'propagate': False,
        },
        'groww': {
            'level': settings.log_level,
            'handlers': ['console', 'file'],
            'propagate': False,
        },
        'uvicorn': {
            'level': 'INFO',
            'handlers': ['console'],
            'propagate': False,
        },
    },
}

# Create logs directory if it doesn't exist
os.makedirs('logs', exist_ok=True)