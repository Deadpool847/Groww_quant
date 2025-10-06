"""
Risk Analytics Schemas
"""

from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict, Any, Union
from datetime import datetime
from enum import Enum

class RiskLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM" 
    HIGH = "HIGH"
    VERY_HIGH = "VERY_HIGH"

class StressTestScenario(str, Enum):
    MARKET_CRASH = "MARKET_CRASH"
    INTEREST_RATE_SHOCK = "INTEREST_RATE_SHOCK"
    CURRENCY_DEVALUATION = "CURRENCY_DEVALUATION"
    SECTOR_CRISIS = "SECTOR_CRISIS"
    LIQUIDITY_CRISIS = "LIQUIDITY_CRISIS"
    INFLATION_SPIKE = "INFLATION_SPIKE"
    CUSTOM = "CUSTOM"

class RiskMetrics(BaseModel):
    """Core risk metrics for portfolio analysis"""
    
    # Value at Risk metrics
    var_95: float = Field(..., description="Value at Risk at 95% confidence")
    var_99: float = Field(..., description="Value at Risk at 99% confidence") 
    cvar_95: float = Field(..., description="Conditional VaR at 95%")
    
    # Portfolio risk measures
    portfolio_volatility: float = Field(..., description="Portfolio volatility (annualized)")
    portfolio_beta: float = Field(..., description="Portfolio beta vs benchmark")
    tracking_error: float = Field(..., description="Tracking error vs benchmark")
    information_ratio: float = Field(..., description="Information ratio")
    correlation_to_benchmark: float = Field(..., description="Correlation to benchmark")
    
    # Drawdown metrics
    max_drawdown: float = Field(..., description="Maximum historical drawdown")
    current_drawdown: float = Field(..., description="Current drawdown from peak")
    drawdown_duration: int = Field(..., description="Current drawdown duration in days")
    
    # Risk-adjusted returns
    sharpe_ratio: float = Field(..., description="Sharpe ratio")
    sortino_ratio: float = Field(..., description="Sortino ratio")
    calmar_ratio: float = Field(..., description="Calmar ratio")
    
    # Concentration risk
    concentration_risk: float = Field(..., description="Concentration risk score")
    largest_position_weight: float = Field(..., description="Weight of largest position")
    
    # Risk level assessment
    overall_risk_level: RiskLevel = Field(..., description="Overall risk level")
    risk_score: float = Field(..., ge=0, le=10, description="Risk score (0-10)")

class SectorExposure(BaseModel):
    sector: str
    allocation_percentage: float
    market_value: float
    risk_contribution: float
    risk_level: RiskLevel
    beta: Optional[float] = None
    correlation: Optional[float] = None

class AssetExposure(BaseModel):
    asset_class: str
    allocation_percentage: float
    market_value: float
    volatility: float
    expected_return: float
    risk_contribution: float

class GeographicExposure(BaseModel):
    country: str
    region: str
    allocation_percentage: float
    market_value: float
    country_risk_score: float

class StressTestResult(BaseModel):
    scenario: StressTestScenario
    scenario_name: str
    description: str
    portfolio_impact: float = Field(..., description="Portfolio impact in percentage")
    portfolio_value_impact: float = Field(..., description="Portfolio impact in absolute value")
    benchmark_impact: float = Field(..., description="Benchmark impact in percentage")
    relative_impact: float = Field(..., description="Relative impact vs benchmark")
    probability: Optional[float] = Field(None, description="Scenario probability")
    
    # Detailed impacts by asset class/sector
    sector_impacts: Optional[Dict[str, float]] = None
    asset_impacts: Optional[Dict[str, float]] = None

class MonteCarloResult(BaseModel):
    simulations_count: int
    time_horizon_days: int
    
    # Return statistics
    expected_return: float
    return_volatility: float
    
    # Percentile returns
    percentile_5: float = Field(..., description="5th percentile return")
    percentile_25: float = Field(..., description="25th percentile return")
    percentile_50: float = Field(..., description="50th percentile return (median)")
    percentile_75: float = Field(..., description="75th percentile return")
    percentile_95: float = Field(..., description="95th percentile return")
    
    # Risk metrics from simulation
    probability_of_loss: float = Field(..., description="Probability of negative return")
    worst_case_scenario: float = Field(..., description="Worst case return from simulation")
    best_case_scenario: float = Field(..., description="Best case return from simulation")

class CorrelationMatrix(BaseModel):
    assets: List[str]
    correlation_data: List[List[float]]
    last_updated: datetime

class RiskAnalyticsResponse(BaseModel):
    portfolio_id: str
    risk_metrics: RiskMetrics
    sector_exposures: List[SectorExposure]
    asset_exposures: List[AssetExposure]
    geographic_exposures: Optional[List[GeographicExposure]] = None
    stress_test_results: List[StressTestResult]
    monte_carlo_result: Optional[MonteCarloResult] = None
    correlation_matrix: Optional[CorrelationMatrix] = None
    risk_warnings: List[str] = []
    risk_recommendations: List[str] = []
    last_calculated: datetime
    calculation_duration_ms: int

class RiskLimits(BaseModel):
    max_portfolio_risk_score: float = 8.0
    max_sector_allocation: float = 0.4  # 40%
    max_single_stock_allocation: float = 0.15  # 15%
    max_var_95: float = 0.05  # 5% of portfolio
    min_diversification_ratio: float = 0.6
    max_correlation_threshold: float = 0.8
    max_drawdown_threshold: float = 0.2  # 20%

class RiskAlert(BaseModel):
    alert_id: str
    alert_type: str
    severity: RiskLevel
    message: str
    current_value: float
    threshold_value: float
    triggered_at: datetime
    portfolio_id: str
    is_acknowledged: bool = False

class RiskReportRequest(BaseModel):
    portfolio_id: str
    include_stress_tests: bool = True
    include_monte_carlo: bool = False
    stress_scenarios: Optional[List[StressTestScenario]] = None
    monte_carlo_simulations: int = 10000
    monte_carlo_horizon_days: int = 252  # 1 year
    benchmark_symbol: Optional[str] = "NIFTY50"

class CustomStressTest(BaseModel):
    name: str
    description: str
    market_shock_percentage: float
    sector_shocks: Optional[Dict[str, float]] = None  # sector -> shock percentage
    interest_rate_change_bps: Optional[int] = None  # basis points
    currency_shock_percentage: Optional[float] = None
    volatility_multiplier: Optional[float] = None