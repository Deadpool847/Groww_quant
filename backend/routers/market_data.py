"""
Market Data API Endpoints
Real-time market data, quotes, and historical data
"""

import structlog
from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional

from ..services.market_data_service import get_market_data_service, MarketDataService
from ..schemas.market_data import (
    MarketQuoteResponse, LTPResponse, OHLCResponse,
    HistoricalDataResponse, MarketOverviewResponse
)

logger = structlog.get_logger(__name__)
router = APIRouter()

@router.get("/quote/{symbol}", response_model=MarketQuoteResponse)
async def get_market_quote(
    symbol: str,
    exchange: str = Query(default="NSE", description="Exchange (NSE/BSE)"),
    segment: str = Query(default="CASH", description="Market segment"),
    market_service: MarketDataService = Depends(get_market_data_service)
):
    """Get comprehensive market quote for a symbol"""
    try:
        return await market_service.get_market_quote(symbol, exchange, segment)
    except Exception as e:
        logger.error("Error in get_market_quote endpoint", symbol=symbol, error=str(e))
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/ltp/{symbol}", response_model=LTPResponse)
async def get_last_traded_price(
    symbol: str,
    exchange: str = Query(default="NSE", description="Exchange (NSE/BSE)"),
    segment: str = Query(default="CASH", description="Market segment"),
    market_service: MarketDataService = Depends(get_market_data_service)
):
    """Get Last Traded Price for a symbol"""
    try:
        return await market_service.get_ltp(symbol, exchange, segment)
    except Exception as e:
        logger.error("Error in get_ltp endpoint", symbol=symbol, error=str(e))
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/historical/{symbol}", response_model=HistoricalDataResponse)
async def get_historical_data(
    symbol: str,
    exchange: str = Query(default="NSE", description="Exchange (NSE/BSE)"),
    segment: str = Query(default="CASH", description="Market segment"),
    start_time: str = Query(..., description="Start time (YYYY-MM-DD or epoch)"),
    end_time: str = Query(..., description="End time (YYYY-MM-DD or epoch)"),
    interval: int = Query(default=1, description="Interval in minutes"),
    market_service: MarketDataService = Depends(get_market_data_service)
):
    """Get historical candle data for a symbol"""
    try:
        return await market_service.get_historical_data(
            symbol, exchange, segment, start_time, end_time, interval
        )
    except Exception as e:
        logger.error("Error in get_historical_data endpoint", symbol=symbol, error=str(e))
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/overview", response_model=MarketOverviewResponse)
async def get_market_overview(
    market_service: MarketDataService = Depends(get_market_data_service)
):
    """Get comprehensive market overview"""
    try:
        return await market_service.get_market_overview()
    except Exception as e:
        logger.error("Error in get_market_overview endpoint", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/bulk/ltp")
async def get_bulk_ltp(
    symbols: str = Query(..., description="Comma-separated list of symbols"),
    exchange: str = Query(default="NSE", description="Exchange"),
    segment: str = Query(default="CASH", description="Segment"),
    market_service: MarketDataService = Depends(get_market_data_service)
):
    """Get LTP for multiple symbols"""
    try:
        symbol_list = [s.strip() for s in symbols.split(',') if s.strip()]
        
        if len(symbol_list) > 50:  # Limit bulk requests
            raise HTTPException(status_code=400, detail="Maximum 50 symbols allowed")
        
        results = {}
        for symbol in symbol_list:
            try:
                ltp_data = await market_service.get_ltp(symbol, exchange, segment)
                results[symbol] = ltp_data
            except Exception as e:
                logger.warning("Failed to fetch LTP for symbol", symbol=symbol, error=str(e))
                results[symbol] = {"error": str(e)}
        
        return {
            "symbols": results,
            "total_requested": len(symbol_list),
            "successful": len([r for r in results.values() if "error" not in r])
        }
    except Exception as e:
        logger.error("Error in get_bulk_ltp endpoint", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))