"""
Portfolio Management Schemas
"""

from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict, Any
from datetime import datetime
from decimal import Decimal

class HoldingDetail(BaseModel):
    isin: str
    trading_symbol: str
    company_name: Optional[str] = None
    exchange: str = "NSE"
    segment: str = "CASH"
    quantity: float
    average_price: float
    current_price: float = 0.0
    market_value: float = 0.0
    pnl: float = 0.0
    pnl_percentage: float = 0.0
    day_change: float = 0.0
    day_change_percentage: float = 0.0
    sector: Optional[str] = None
    industry: Optional[str] = None
    pledge_quantity: float = 0.0
    demat_locked_quantity: float = 0.0
    t1_quantity: float = 0.0
    demat_free_quantity: float = 0.0
    
    @validator('market_value', always=True)
    def calculate_market_value(cls, v, values):
        quantity = values.get('quantity', 0)
        current_price = values.get('current_price', 0)
        return quantity * current_price
    
    @validator('pnl', always=True)
    def calculate_pnl(cls, v, values):
        market_value = values.get('market_value', 0)
        quantity = values.get('quantity', 0)
        average_price = values.get('average_price', 0)
        investment_value = quantity * average_price
        return market_value - investment_value
    
    @validator('pnl_percentage', always=True)
    def calculate_pnl_percentage(cls, v, values):
        pnl = values.get('pnl', 0)
        quantity = values.get('quantity', 0)
        average_price = values.get('average_price', 0)
        investment_value = quantity * average_price
        if investment_value > 0:
            return (pnl / investment_value) * 100
        return 0.0

class HoldingsResponse(BaseModel):
    holdings: List[HoldingDetail]
    total_holdings: int
    total_investment: float
    current_value: float
    total_pnl: float
    total_pnl_percentage: float
    day_pnl: float = 0.0
    day_pnl_percentage: float = 0.0
    last_updated: datetime

class PositionDetail(BaseModel):
    trading_symbol: str
    exchange: str
    segment: str
    product: str
    quantity: int
    average_price: float
    current_price: float = 0.0
    market_value: float = 0.0
    pnl: float = 0.0
    pnl_percentage: float = 0.0
    day_pnl: float = 0.0
    multiplier: int = 1
    
    # Additional position fields
    buy_quantity: int = 0
    buy_price: float = 0.0
    buy_value: float = 0.0
    sell_quantity: int = 0
    sell_price: float = 0.0
    sell_value: float = 0.0
    
    @validator('market_value', always=True)
    def calculate_market_value(cls, v, values):
        quantity = values.get('quantity', 0)
        current_price = values.get('current_price', 0)
        multiplier = values.get('multiplier', 1)
        return quantity * current_price * multiplier

class PositionsResponse(BaseModel):
    positions: List[PositionDetail]
    total_positions: int
    total_pnl: float
    day_pnl: float = 0.0
    segment: str
    last_updated: datetime

class PortfolioSummary(BaseModel):
    total_investment: float
    current_value: float
    total_pnl: float
    total_pnl_percentage: float
    day_pnl: float = 0.0
    day_pnl_percentage: float = 0.0
    
    holdings_count: int
    cash_positions_count: int
    fno_positions_count: int
    
    # Portfolio metrics
    portfolio_beta: Optional[float] = None
    portfolio_volatility: Optional[float] = None
    sharpe_ratio: Optional[float] = None
    sortino_ratio: Optional[float] = None
    max_drawdown: Optional[float] = None
    
    # Allocation breakdowns
    sector_allocation: Optional[Dict[str, float]] = None
    asset_allocation: Optional[Dict[str, float]] = None
    
    last_updated: datetime

class AllocationData(BaseModel):
    name: str
    value: float
    percentage: float
    change: float = 0.0

class SectorAllocationResponse(BaseModel):
    allocations: List[AllocationData]
    total_value: float
    last_updated: datetime

class AssetAllocationResponse(BaseModel):
    equity: float
    debt: float
    cash: float
    derivatives: float
    others: float
    last_updated: datetime

class PerformanceMetrics(BaseModel):
    total_return: float
    annualized_return: float
    volatility: float
    sharpe_ratio: float
    sortino_ratio: float
    max_drawdown: float
    beta: float
    alpha: float
    information_ratio: float
    treynor_ratio: float
    
    # Risk metrics
    var_95: float
    cvar_95: float
    
    # Time period
    period_start: datetime
    period_end: datetime
    
class PortfolioAnalyticsResponse(BaseModel):
    performance_metrics: PerformanceMetrics
    sector_allocation: List[AllocationData]
    asset_allocation: AssetAllocationResponse
    top_holdings: List[HoldingDetail]
    risk_analysis: Dict[str, Any]
    last_updated: datetime