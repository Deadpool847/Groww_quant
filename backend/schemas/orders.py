"""
Order Management Schemas
"""

from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class OrderType(str, Enum):
    MARKET = "MARKET"
    LIMIT = "LIMIT"
    STOP_LOSS = "SL"
    STOP_LOSS_MARKET = "SL-M"

class OrderSide(str, Enum):
    BUY = "BUY" 
    SELL = "SELL"

class ProductType(str, Enum):
    DELIVERY = "CNC"
    INTRADAY = "MIS"
    NORMAL = "NRML"

class OrderStatus(str, Enum):
    PENDING = "PENDING"
    OPEN = "OPEN"
    COMPLETE = "COMPLETE"
    CANCELLED = "CANCELLED"
    REJECTED = "REJECTED"
    MODIFIED = "MODIFIED"
    PARTIAL = "PARTIAL"

class OrderValidity(str, Enum):
    DAY = "DAY"
    IOC = "IOC"
    GTD = "GTD"

class OrderRequest(BaseModel):
    trading_symbol: str = Field(..., description="Trading symbol")
    exchange: str = Field(..., description="Exchange (NSE/BSE)")
    segment: str = Field(default="CASH", description="Market segment")
    side: OrderSide = Field(..., description="Order side (BUY/SELL)")
    order_type: OrderType = Field(..., description="Order type")
    product: ProductType = Field(..., description="Product type")
    quantity: int = Field(..., gt=0, description="Order quantity")
    price: Optional[float] = Field(None, gt=0, description="Order price (required for limit orders)")
    trigger_price: Optional[float] = Field(None, gt=0, description="Trigger price (for SL orders)")
    validity: OrderValidity = Field(default=OrderValidity.DAY, description="Order validity")
    disclosed_quantity: Optional[int] = Field(None, ge=0, description="Disclosed quantity")
    
    @validator('price')
    def validate_price_for_limit_orders(cls, v, values):
        order_type = values.get('order_type')
        if order_type in [OrderType.LIMIT, OrderType.STOP_LOSS] and v is None:
            raise ValueError(f"Price is required for {order_type} orders")
        return v
    
    @validator('trigger_price')
    def validate_trigger_price_for_sl_orders(cls, v, values):
        order_type = values.get('order_type')
        if order_type in [OrderType.STOP_LOSS, OrderType.STOP_LOSS_MARKET] and v is None:
            raise ValueError(f"Trigger price is required for {order_type} orders")
        return v

class OrderResponse(BaseModel):
    order_id: str
    status: OrderStatus
    message: str
    trading_symbol: str
    side: OrderSide
    quantity: int
    filled_quantity: int = 0
    remaining_quantity: int = 0
    order_type: OrderType
    product: ProductType
    price: Optional[float] = None
    average_price: Optional[float] = None
    trigger_price: Optional[float] = None
    validity: OrderValidity = OrderValidity.DAY
    exchange: str = ""
    segment: str = ""
    timestamp: datetime
    order_timestamp: Optional[datetime] = None
    update_timestamp: Optional[datetime] = None
    
    @validator('remaining_quantity', always=True)
    def calculate_remaining_quantity(cls, v, values):
        quantity = values.get('quantity', 0)
        filled_quantity = values.get('filled_quantity', 0)
        return quantity - filled_quantity

class OrderModifyRequest(BaseModel):
    quantity: Optional[int] = Field(None, gt=0, description="New quantity")
    price: Optional[float] = Field(None, gt=0, description="New price")
    trigger_price: Optional[float] = Field(None, gt=0, description="New trigger price")
    order_type: Optional[OrderType] = Field(None, description="New order type")
    validity: Optional[OrderValidity] = Field(None, description="New validity")

class OrderListResponse(BaseModel):
    orders: List[OrderResponse]
    total_orders: int
    filters: Dict[str, Any] = {}
    last_updated: datetime

class TradeDetail(BaseModel):
    trade_id: str
    order_id: str
    trading_symbol: str
    exchange: str
    segment: str
    side: OrderSide
    quantity: int
    price: float
    trade_value: float
    timestamp: datetime
    
    @validator('trade_value', always=True)
    def calculate_trade_value(cls, v, values):
        quantity = values.get('quantity', 0)
        price = values.get('price', 0)
        return quantity * price

class TradeListResponse(BaseModel):
    trades: List[TradeDetail]
    total_trades: int
    total_value: float
    filters: Dict[str, Any] = {}
    last_updated: datetime

class OrderValidationResult(BaseModel):
    is_valid: bool
    error_message: Optional[str] = None
    warnings: List[str] = []
    estimated_charges: Optional[Dict[str, float]] = None
    margin_required: Optional[float] = None
    
class OrderBookEntry(BaseModel):
    price: float
    quantity: int
    orders: int

class OrderBookResponse(BaseModel):
    symbol: str
    exchange: str
    segment: str
    buy_orders: List[OrderBookEntry]
    sell_orders: List[OrderBookEntry]
    last_updated: datetime

class OrderExecutionReport(BaseModel):
    order_id: str
    execution_id: str
    trading_symbol: str
    side: OrderSide
    executed_quantity: int
    execution_price: float
    execution_value: float
    execution_time: datetime
    remaining_quantity: int
    order_status: OrderStatus