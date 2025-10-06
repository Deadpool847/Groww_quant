"""
Market Data Schemas for request/response validation
"""

from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class Exchange(str, Enum):
    NSE = "NSE"
    BSE = "BSE"

class Segment(str, Enum):
    CASH = "CASH"
    FNO = "FNO"
    CURRENCY = "CURRENCY"
    COMMODITY = "COMMODITY"

class MarketQuoteResponse(BaseModel):
    symbol: str
    exchange: Exchange
    segment: Segment = Segment.CASH
    ltp: float = Field(..., description="Last Traded Price")
    open_price: float
    high_price: float
    low_price: float
    close_price: float
    volume: int
    change: float
    change_percent: float
    bid_price: Optional[float] = None
    ask_price: Optional[float] = None
    bid_quantity: Optional[int] = None
    ask_quantity: Optional[int] = None
    timestamp: datetime

class LTPResponse(BaseModel):
    symbol: str
    exchange: Exchange
    segment: Segment = Segment.CASH
    ltp: float = Field(..., description="Last Traded Price")
    timestamp: datetime

class OHLCResponse(BaseModel):
    symbol: str
    exchange: Exchange
    segment: Segment = Segment.CASH
    open_price: float
    high_price: float
    low_price: float
    close_price: float
    volume: int
    timestamp: datetime

class CandleData(BaseModel):
    timestamp: datetime
    open_price: float
    high_price: float
    low_price: float
    close_price: float
    volume: int

class HistoricalDataResponse(BaseModel):
    symbol: str
    exchange: Exchange
    segment: Segment
    start_time: str
    end_time: str
    interval_minutes: int
    candles: List[CandleData]
    total_candles: int

class MarketDepthEntry(BaseModel):
    price: float
    quantity: int
    orders: int

class MarketDepthResponse(BaseModel):
    symbol: str
    exchange: Exchange
    segment: Segment
    bid_depth: List[MarketDepthEntry]
    ask_depth: List[MarketDepthEntry]
    timestamp: datetime

class IndexData(BaseModel):
    name: str
    symbol: str
    value: float
    change: float
    change_percent: float
    high: float
    low: float
    timestamp: datetime

class SectorData(BaseModel):
    name: str
    symbol: str
    value: float
    change: float
    change_percent: float
    stocks_count: int
    top_gainers: List[str]
    top_losers: List[str]

class TopMoversResponse(BaseModel):
    gainers: List[Dict[str, Any]]
    losers: List[Dict[str, Any]]
    most_active: List[Dict[str, Any]]
    timestamp: datetime

class MarketOverviewResponse(BaseModel):
    indices: List[IndexData]
    sectors: List[SectorData]
    top_movers: TopMoversResponse
    market_status: str
    timestamp: datetime