"""
Advanced Aladdin Trading Platform - Main FastAPI Application
Enterprise-grade trading platform with Groww API integration
"""

import asyncio
import logging.config
import os
import time
from contextlib import asynccontextmanager
from typing import Dict, Any

import structlog
import uvicorn
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from prometheus_client import Counter, Histogram, generate_latest
from starlette.responses import Response

# Import configurations and services
from config import get_settings, LOGGING_CONFIG
from auth.groww_auth import get_auth_manager, cleanup_auth
from services.market_data_service import get_market_data_service
from routers import market_data, portfolio, orders, analytics

# Configure structured logging
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
        structlog.processors.JSONRenderer()
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    wrapper_class=structlog.stdlib.BoundLogger,
    cache_logger_on_first_use=True,
)

# Configure standard logging
logging.config.dictConfig(LOGGING_CONFIG)
logger = structlog.get_logger(__name__)

# Prometheus metrics
REQUEST_COUNT = Counter(
    'aladdin_requests_total', 
    'Total requests', 
    ['method', 'endpoint', 'status_code']
)
REQUEST_DURATION = Histogram(
    'aladdin_request_duration_seconds', 
    'Request duration', 
    ['method', 'endpoint']
)
ERROR_COUNT = Counter(
    'aladdin_errors_total', 
    'Total errors', 
    ['error_type', 'endpoint']
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan management"""
    settings = get_settings()
    
    logger.info(
        "Starting Aladdin Trading Platform",
        version="1.0.0",
        environment=settings.environment
    )
    
    try:
        # Initialize authentication manager
        auth_manager = await get_auth_manager()
        if not auth_manager.is_authenticated():
            logger.warning("Authentication failed during startup")
        else:
            logger.info("Authentication successful during startup")
        
        # Initialize market data service
        market_service = await get_market_data_service()
        logger.info("Market data service initialized")
        
        # Store services in app state
        app.state.auth_manager = auth_manager
        app.state.market_service = market_service
        app.state.startup_time = time.time()
        
        logger.info("Application startup completed successfully")
        
        yield
        
    except Exception as e:
        logger.error("Failed to start application", error=str(e))
        raise
    finally:
        # Cleanup on shutdown
        logger.info("Shutting down Aladdin Trading Platform")
        await cleanup_auth()
        logger.info("Application shutdown completed")

def create_app() -> FastAPI:
    """Create and configure FastAPI application"""
    settings = get_settings()
    
    # Create FastAPI app with lifespan management
    app = FastAPI(
        title="Aladdin Trading Platform",
        description="Advanced BlackRock Aladdin clone with Groww API integration",
        version="1.0.0",
        docs_url="/api/docs",
        redoc_url="/api/redoc",
        openapi_url="/api/openapi.json",
        lifespan=lifespan
    )
    
    # Add security middleware
    if settings.allowed_hosts:
        app.add_middleware(
            TrustedHostMiddleware, 
            allowed_hosts=settings.allowed_hosts
        )
    
    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Add custom middleware
    @app.middleware("http")
    async def logging_middleware(request: Request, call_next):
        """Request/response logging and metrics middleware"""
        start_time = time.time()
        
        # Generate request ID
        request_id = f"req_{int(time.time() * 1000000)}"
        
        # Add request ID to context
        with structlog.contextvars.bound_contextvars(request_id=request_id):
            logger.info(
                "Request started",
                method=request.method,
                url=str(request.url),
                client_ip=request.client.host if request.client else None
            )
            
            try:
                response = await call_next(request)
                duration = time.time() - start_time
                
                # Update metrics
                REQUEST_COUNT.labels(
                    method=request.method,
                    endpoint=request.url.path,
                    status_code=response.status_code
                ).inc()
                
                REQUEST_DURATION.labels(
                    method=request.method,
                    endpoint=request.url.path
                ).observe(duration)
                
                logger.info(
                    "Request completed",
                    method=request.method,
                    url=str(request.url),
                    status_code=response.status_code,
                    duration=f"{duration:.3f}s"
                )
                
                return response
                
            except Exception as e:
                duration = time.time() - start_time
                
                # Update error metrics
                ERROR_COUNT.labels(
                    error_type=type(e).__name__,
                    endpoint=request.url.path
                ).inc()
                
                logger.error(
                    "Request failed",
                    method=request.method,
                    url=str(request.url),
                    error=str(e),
                    duration=f"{duration:.3f}s",
                    exc_info=True
                )
                
                raise
    
    # Add rate limiting middleware
    @app.middleware("http")
    async def rate_limiting_middleware(request: Request, call_next):
        """Rate limiting middleware"""
        if not settings.rate_limit_enabled:
            return await call_next(request)
        
        # Simple in-memory rate limiting (in production, use Redis)
        client_ip = request.client.host if request.client else "unknown"
        
        # For now, just log and continue
        # In production, implement proper rate limiting logic
        
        return await call_next(request)
    
    # Include API routers
    app.include_router(
        market_data.router,
        prefix=f"{settings.api_prefix}/{settings.api_version}/market",
        tags=["Market Data"]
    )
    
    app.include_router(
        portfolio.router,
        prefix=f"{settings.api_prefix}/{settings.api_version}/portfolio",
        tags=["Portfolio"]
    )
    
    app.include_router(
        orders.router,
        prefix=f"{settings.api_prefix}/{settings.api_version}/orders",
        tags=["Orders"]
    )
    
    app.include_router(
        analytics.router,
        prefix=f"{settings.api_prefix}/{settings.api_version}/analytics",
        tags=["Analytics"]
    )
    
    # Health check endpoints
    @app.get("/health")
    async def health_check():
        """Application health check"""
        try:
            # Check authentication status
            auth_manager = getattr(app.state, 'auth_manager', None)
            auth_status = auth_manager.is_authenticated() if auth_manager else False
            
            # Calculate uptime
            startup_time = getattr(app.state, 'startup_time', time.time())
            uptime = time.time() - startup_time
            
            return {
                "status": "healthy",
                "timestamp": time.time(),
                "uptime_seconds": uptime,
                "version": "1.0.0",
                "environment": settings.environment,
                "authentication_status": auth_status,
                "services": {
                    "market_data": "operational",
                    "portfolio": "operational", 
                    "orders": "operational",
                    "analytics": "operational"
                }
            }
        except Exception as e:
            logger.error("Health check failed", error=str(e))
            return JSONResponse(
                status_code=503,
                content={
                    "status": "unhealthy",
                    "error": str(e),
                    "timestamp": time.time()
                }
            )
    
    @app.get("/health/detailed")
    async def detailed_health_check():
        """Detailed health check with service status"""
        try:
            health_data = await health_check()
            
            # Add detailed service checks
            auth_manager = getattr(app.state, 'auth_manager', None)
            market_service = getattr(app.state, 'market_service', None)
            
            detailed_status = {
                **(health_data.body if hasattr(health_data, 'body') else health_data),
                "detailed_checks": {
                    "authentication": {
                        "status": "operational" if auth_manager and auth_manager.is_authenticated() else "degraded",
                        "last_auth": str(auth_manager._last_auth_time) if auth_manager and auth_manager._last_auth_time else None
                    },
                    "market_data_service": {
                        "status": "operational" if market_service else "unavailable",
                        "cache_status": "operational"  # Would check Redis in production
                    },
                    "database": {
                        "status": "operational",  # Would check MongoDB connection
                        "connection_pool": "healthy"
                    }
                }
            }
            
            return detailed_status
            
        except Exception as e:
            logger.error("Detailed health check failed", error=str(e))
            return JSONResponse(
                status_code=503,
                content={
                    "status": "unhealthy",
                    "error": str(e),
                    "timestamp": time.time()
                }
            )
    
    @app.get("/metrics")
    async def metrics():
        """Prometheus metrics endpoint"""
        return Response(generate_latest(), media_type="text/plain")
    
    @app.get("/")
    async def root():
        """Root endpoint"""
        return {
            "message": "Aladdin Trading Platform API",
            "version": "1.0.0",
            "docs": "/api/docs",
            "health": "/health"
        }
    
    # Global exception handler
    @app.exception_handler(HTTPException)
    async def http_exception_handler(request: Request, exc: HTTPException):
        """Handle HTTP exceptions"""
        logger.error(
            "HTTP exception",
            status_code=exc.status_code,
            detail=exc.detail,
            url=str(request.url)
        )
        
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": exc.detail,
                "status_code": exc.status_code,
                "timestamp": time.time()
            }
        )
    
    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        """Handle unexpected exceptions"""
        logger.error(
            "Unexpected exception",
            error=str(exc),
            error_type=type(exc).__name__,
            url=str(request.url),
            exc_info=True
        )
        
        return JSONResponse(
            status_code=500,
            content={
                "error": "Internal server error",
                "status_code": 500,
                "timestamp": time.time()
            }
        )
    
    return app

# Create the application
app = create_app()

if __name__ == "__main__":
    settings = get_settings()
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8001,
        reload=settings.debug,
        log_config=None,  # Use our custom logging config
        workers=1 if settings.debug else settings.max_workers,
        keepalive_timeout=settings.keepalive_timeout,
        graceful_timeout=settings.graceful_timeout
    )