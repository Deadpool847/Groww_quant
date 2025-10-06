"""
Advanced Market Data Service with Caching and Real-time Updates
"""

import asyncio
import structlog
from typing import List, Optional, Dict, Any, Union
from datetime import datetime, timedelta
from growwapi import GrowwAPI
from growwapi.groww.exceptions import GrowwAPIException, GrowwAPIRateLimitException
import redis
import json

from auth.groww_auth import get_authenticated_groww_client
from schemas.market_data import (
    MarketQuoteResponse, LTPResponse, OHLCResponse, 
    HistoricalDataResponse, CandleData, TopMoversResponse,
    MarketOverviewResponse, IndexData, SectorData
)
from config import get_settings

logger = structlog.get_logger(__name__)

class MarketDataService:
    """
    Advanced market data service with intelligent caching, 
    rate limiting, and real-time data management
    """
    
    def __init__(self):
        self.settings = get_settings()
        self._redis_client: Optional[redis.Redis] = None
        self._rate_limiter = RateLimiter()
        
    async def initialize(self):
        """Initialize the market data service"""
        try:
            # Initialize Redis connection for caching
            self._redis_client = redis.from_url(self.settings.redis_url)
            await self._test_redis_connection()
            
            logger.info("Market data service initialized successfully")
        except Exception as e:
            logger.error("Failed to initialize market data service", error=str(e))
            raise
    
    async def _test_redis_connection(self):
        """Test Redis connection"""
        try:
            await self._redis_client.ping()
            logger.debug("Redis connection successful")
        except Exception as e:
            logger.warning("Redis connection failed, caching disabled", error=str(e))
            self._redis_client = None
    
    async def get_market_quote(
        self, 
        symbol: str, 
        exchange: str = "NSE", 
        segment: str = "CASH"
    ) -> MarketQuoteResponse:
        """Get comprehensive market quote for a symbol"""
        
        cache_key = f"quote:{exchange}:{segment}:{symbol}"
        
        # Check cache first
        cached_data = await self._get_cached_data(cache_key, ttl_seconds=5)
        if cached_data:
            return MarketQuoteResponse(**cached_data)
        
        # Rate limiting check
        if not await self._rate_limiter.can_make_request("market_quote"):
            raise GrowwAPIRateLimitException("Rate limit exceeded for market quotes")
        
        try:
            client = await get_authenticated_groww_client()
            if not client:
                raise Exception("Failed to get authenticated client")
            
            response = await client.get_market_quote(
                trading_symbol=symbol,
                exchange=exchange,
                segment=segment
            )
            
            if response.get('status') == 'SUCCESS':
                quote_data = response.get('payload', {})
                
                market_quote = MarketQuoteResponse(
                    symbol=symbol,
                    exchange=exchange,
                    segment=segment,
                    ltp=float(quote_data.get('ltp', 0)),
                    open_price=float(quote_data.get('open', 0)),
                    high_price=float(quote_data.get('high', 0)),
                    low_price=float(quote_data.get('low', 0)),
                    close_price=float(quote_data.get('close', 0)),
                    volume=int(quote_data.get('volume', 0)),
                    change=float(quote_data.get('day_change', 0)),
                    change_percent=float(quote_data.get('day_change_percentage', 0)),
                    bid_price=float(quote_data.get('bid_price', 0)) or None,
                    ask_price=float(quote_data.get('ask_price', 0)) or None,
                    bid_quantity=int(quote_data.get('bid_quantity', 0)) or None,
                    ask_quantity=int(quote_data.get('ask_quantity', 0)) or None,
                    timestamp=datetime.now()
                )
                
                # Cache the result
                await self._cache_data(cache_key, market_quote.dict(), ttl_seconds=5)
                
                logger.debug("Market quote retrieved successfully", symbol=symbol)
                return market_quote
            else:
                error_msg = response.get('error', 'Failed to fetch market quote')
                raise GrowwAPIException(error_msg)
                
        except Exception as e:
            logger.error("Error fetching market quote", symbol=symbol, error=str(e))
            raise
    
    async def get_ltp(
        self, 
        symbol: str, 
        exchange: str = "NSE", 
        segment: str = "CASH"
    ) -> LTPResponse:
        """Get Last Traded Price for a symbol"""
        
        cache_key = f"ltp:{exchange}:{segment}:{symbol}"
        
        # Check cache first
        cached_data = await self._get_cached_data(cache_key, ttl_seconds=1)
        if cached_data:
            return LTPResponse(**cached_data)
        
        try:
            client = await get_authenticated_groww_client()
            if not client:
                raise Exception("Failed to get authenticated client")
            
            response = await client.get_ltp(
                trading_symbol=symbol,
                exchange=exchange,
                segment=segment
            )
            
            if response.get('status') == 'SUCCESS':
                ltp_data = response.get('payload', {})
                
                ltp_response = LTPResponse(
                    symbol=symbol,
                    exchange=exchange,
                    segment=segment,
                    ltp=float(ltp_data.get('ltp', 0)),
                    timestamp=datetime.now()
                )
                
                # Cache the result with short TTL
                await self._cache_data(cache_key, ltp_response.dict(), ttl_seconds=1)
                
                return ltp_response
            else:
                error_msg = response.get('error', 'Failed to fetch LTP')
                raise GrowwAPIException(error_msg)
                
        except Exception as e:
            logger.error("Error fetching LTP", symbol=symbol, error=str(e))
            raise
    
    async def get_historical_data(
        self,
        symbol: str,
        exchange: str = "NSE",
        segment: str = "CASH",
        start_time: str = "",
        end_time: str = "",
        interval_minutes: int = 1
    ) -> HistoricalDataResponse:
        """Get historical candle data for a symbol"""
        
        cache_key = f"historical:{exchange}:{segment}:{symbol}:{start_time}:{end_time}:{interval_minutes}"
        
        # Check cache first (longer TTL for historical data)
        cached_data = await self._get_cached_data(cache_key, ttl_seconds=300)
        if cached_data:
            return HistoricalDataResponse(**cached_data)
        
        try:
            client = await get_authenticated_groww_client()
            if not client:
                raise Exception("Failed to get authenticated client")
            
            response = await client.get_historical_candle_data(
                exchange=exchange,
                segment=segment,
                trading_symbol=symbol,
                start_time=start_time,
                end_time=end_time,
                interval_in_minutes=str(interval_minutes)
            )
            
            if response.get('status') == 'SUCCESS':
                payload = response.get('payload', {})
                candles_data = payload.get('candles', [])
                
                # Process candle data
                processed_candles = []
                for candle in candles_data:
                    if len(candle) >= 6:
                        processed_candles.append(CandleData(
                            timestamp=datetime.fromtimestamp(candle[0] / 1000),  # Convert milliseconds
                            open_price=float(candle[1]),
                            high_price=float(candle[2]),
                            low_price=float(candle[3]),
                            close_price=float(candle[4]),
                            volume=int(candle[5])
                        ))
                
                historical_response = HistoricalDataResponse(
                    symbol=symbol,
                    exchange=exchange,
                    segment=segment,
                    start_time=start_time,
                    end_time=end_time,
                    interval_minutes=interval_minutes,
                    candles=processed_candles,
                    total_candles=len(processed_candles)
                )
                
                # Cache the result
                await self._cache_data(cache_key, historical_response.dict(), ttl_seconds=300)
                
                logger.info(
                    "Historical data retrieved successfully",
                    symbol=symbol,
                    candles_count=len(processed_candles)
                )
                
                return historical_response
            else:
                error_msg = response.get('error', 'Failed to fetch historical data')
                raise GrowwAPIException(error_msg)
                
        except Exception as e:
            logger.error("Error fetching historical data", symbol=symbol, error=str(e))
            raise
    
    async def get_market_overview(self) -> MarketOverviewResponse:
        """Get comprehensive market overview"""
        
        cache_key = "market_overview"
        
        # Check cache first
        cached_data = await self._get_cached_data(cache_key, ttl_seconds=30)
        if cached_data:
            return MarketOverviewResponse(**cached_data)
        
        try:
            # Fetch major indices
            indices = await self._fetch_major_indices()
            
            # Fetch sector data
            sectors = await self._fetch_sector_data()
            
            # Get top movers
            top_movers = await self._fetch_top_movers()
            
            market_overview = MarketOverviewResponse(
                indices=indices,
                sectors=sectors,
                top_movers=top_movers,
                market_status="OPEN",  # This should be determined from actual market hours
                timestamp=datetime.now()
            )
            
            # Cache the result
            await self._cache_data(cache_key, market_overview.dict(), ttl_seconds=30)
            
            return market_overview
            
        except Exception as e:
            logger.error("Error fetching market overview", error=str(e))
            raise
    
    async def _fetch_major_indices(self) -> List[IndexData]:
        """Fetch major market indices"""
        major_indices = ["NIFTY50", "SENSEX", "BANKNIFTY"]
        indices_data = []
        
        for index_symbol in major_indices:
            try:
                quote = await self.get_market_quote(index_symbol, "NSE", "CASH")
                
                indices_data.append(IndexData(
                    name=index_symbol,
                    symbol=index_symbol,
                    value=quote.ltp,
                    change=quote.change,
                    change_percent=quote.change_percent,
                    high=quote.high_price,
                    low=quote.low_price,
                    timestamp=quote.timestamp
                ))
                
                # Small delay to respect rate limits
                await asyncio.sleep(0.1)
                
            except Exception as e:
                logger.warning("Failed to fetch index data", index=index_symbol, error=str(e))
                continue
        
        return indices_data
    
    async def _fetch_sector_data(self) -> List[SectorData]:
        """Fetch sector performance data"""
        # This would typically fetch from sectoral indices
        # For now, returning empty list as it requires specific sector indices
        return []
    
    async def _fetch_top_movers(self) -> TopMoversResponse:
        """Fetch top gaining and losing stocks"""
        # This would typically require a separate API call or screener
        # For now, returning empty data
        return TopMoversResponse(
            gainers=[],
            losers=[],
            most_active=[],
            timestamp=datetime.now()
        )
    
    async def _get_cached_data(self, key: str, ttl_seconds: int) -> Optional[Dict[str, Any]]:
        """Get data from Redis cache"""
        if not self._redis_client:
            return None
        
        try:
            cached_value = await self._redis_client.get(key)
            if cached_value:
                return json.loads(cached_value)
        except Exception as e:
            logger.debug("Cache get error", key=key, error=str(e))
        
        return None
    
    async def _cache_data(self, key: str, data: Dict[str, Any], ttl_seconds: int):
        """Cache data in Redis"""
        if not self._redis_client:
            return
        
        try:
            await self._redis_client.setex(
                key,
                ttl_seconds,
                json.dumps(data, default=str)
            )
        except Exception as e:
            logger.debug("Cache set error", key=key, error=str(e))

class RateLimiter:
    """Rate limiter for API calls"""
    
    def __init__(self):
        self.call_history: Dict[str, List[float]] = {}
        self.limits = {
            "market_quote": {"calls": 10, "window": 1},  # 10 calls per second
            "ltp": {"calls": 15, "window": 1},  # 15 calls per second
            "historical": {"calls": 5, "window": 1},  # 5 calls per second
            "default": {"calls": 10, "window": 1}
        }
    
    async def can_make_request(self, operation: str) -> bool:
        """Check if request can be made within rate limits"""
        import time
        
        current_time = time.time()
        limit_config = self.limits.get(operation, self.limits["default"])
        
        # Clean old entries
        if operation in self.call_history:
            self.call_history[operation] = [
                call_time for call_time in self.call_history[operation]
                if current_time - call_time < limit_config["window"]
            ]
        else:
            self.call_history[operation] = []
        
        # Check if we can make the request
        if len(self.call_history[operation]) < limit_config["calls"]:
            self.call_history[operation].append(current_time)
            return True
        
        return False

# Global service instance
_market_data_service: Optional[MarketDataService] = None

async def get_market_data_service() -> MarketDataService:
    """Get or create market data service instance"""
    global _market_data_service
    
    if _market_data_service is None:
        _market_data_service = MarketDataService()
        await _market_data_service.initialize()
    
    return _market_data_service