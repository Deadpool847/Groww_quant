# BlackRock Aladdin Clone - API Contracts & Integration Plan

## Overview
This document outlines the API contracts and integration strategy for connecting our BlackRock Aladdin clone frontend with the backend services and Groww API integration.

## API Contracts

### 1. Portfolio Management APIs

#### GET /api/portfolios
**Purpose:** Fetch all user portfolios
**Response:**
```json
{
  "portfolios": [
    {
      "id": "string",
      "name": "string",
      "value": "number",
      "dayChange": "number",
      "dayChangePercent": "number",
      "totalReturn": "number",
      "totalReturnPercent": "number",
      "riskScore": "number",
      "sharpeRatio": "number",
      "beta": "number",
      "volatility": "number",
      "maxDrawdown": "number",
      "benchmark": "string",
      "benchmarkReturn": "number"
    }
  ]
}
```

#### GET /api/portfolios/{portfolioId}/holdings
**Purpose:** Get portfolio holdings with current market data
**Response:**
```json
{
  "holdings": [
    {
      "id": "string",
      "symbol": "string", 
      "name": "string",
      "quantity": "number",
      "avgPrice": "number",
      "currentPrice": "number",
      "marketValue": "number",
      "dayChange": "number",
      "totalReturn": "number",
      "allocation": "number",
      "sector": "string"
    }
  ]
}
```

### 2. Risk Analytics APIs

#### GET /api/portfolios/{portfolioId}/risk-metrics
**Purpose:** Calculate and return comprehensive risk analytics
**Response:**
```json
{
  "var95": "number",
  "var99": "number", 
  "expectedShortfall": "number",
  "trackingError": "number",
  "informationRatio": "number",
  "correlationToBenchmark": "number",
  "sectorExposure": [],
  "stressTests": []
}
```

#### POST /api/portfolios/{portfolioId}/stress-test
**Purpose:** Run custom stress testing scenarios
**Request:**
```json
{
  "scenario": "string",
  "parameters": {
    "marketShock": "number",
    "interestRateChange": "number", 
    "sectorImpact": "string"
  }
}
```

### 3. Trading APIs

#### POST /api/orders
**Purpose:** Place new trading order
**Request:**
```json
{
  "symbol": "string",
  "side": "BUY|SELL", 
  "quantity": "number",
  "price": "number",
  "orderType": "LIMIT|MARKET|STOP",
  "portfolioId": "string"
}
```

#### GET /api/orders
**Purpose:** Get user's order history and status
**Response:**
```json
{
  "orders": [
    {
      "id": "string",
      "symbol": "string",
      "side": "string", 
      "quantity": "number",
      "price": "number",
      "status": "PENDING|FILLED|CANCELLED",
      "timestamp": "string"
    }
  ]
}
```

### 4. Market Data APIs

#### GET /api/market-data
**Purpose:** Get real-time market indices and sector data
**Response:**
```json
{
  "indices": [],
  "sectors": [], 
  "topGainers": [],
  "topLosers": [],
  "commodities": [],
  "currencies": []
}
```

#### GET /api/historical-data/{symbol}
**Purpose:** Get historical price data for charts
**Query Params:** timeframe, interval
**Response:**
```json
{
  "data": [
    {
      "date": "string",
      "open": "number",
      "high": "number", 
      "low": "number",
      "close": "number",
      "volume": "number"
    }
  ]
}
```

### 5. Performance Analytics APIs

#### GET /api/portfolios/{portfolioId}/performance
**Purpose:** Calculate portfolio performance metrics
**Response:**
```json
{
  "totalReturn": "number",
  "alpha": "number", 
  "sharpeRatio": "number",
  "volatility": "number",
  "attribution": [],
  "monthlyReturns": [],
  "drawdownAnalysis": {}
}
```

## Groww API Integration

### Authentication Setup
- **TOTP Authentication:** Implement secure TOTP flow for Groww API access
- **Environment Variables:**
  - `GROWW_API_KEY`
  - `GROWW_SECRET_KEY` 
  - `GROWW_TOTP_SECRET`

### Key Integration Points

1. **Historical Data Fetching**
   - Use Groww historical candle data APIs
   - Map to our internal chart data format
   - Implement caching for performance

2. **Real-time Market Data**
   - Subscribe to Groww market feeds
   - Update frontend via WebSocket connections
   - Handle rate limiting gracefully

3. **Portfolio Sync**
   - Fetch user holdings from Groww
   - Calculate portfolio metrics
   - Sync with our internal portfolio models

4. **Order Management**
   - Place orders through Groww trading API
   - Track order status and updates
   - Handle order confirmations and rejections

## Mock Data Replacement Strategy

### Current Mock Files to Replace:
- `mockData.js` - portfolios, holdings, marketData
- All simulated API responses in components

### Implementation Order:
1. **Setup Groww SDK and authentication**
2. **Implement market data endpoints first**
3. **Add portfolio management APIs**
4. **Integrate risk calculation engines**  
5. **Connect trading functionality**
6. **Add performance analytics**

## Database Schema

### Collections:
- **users** - User authentication and preferences
- **portfolios** - Portfolio configurations and metadata
- **holdings** - Position tracking and history
- **orders** - Trading order history
- **risk_calculations** - Cached risk metrics
- **market_data_cache** - Performance optimization

## Frontend Integration Changes

### Components to Update:
1. **Dashboard.jsx** - Replace mock portfolio data with API calls
2. **PortfolioOverview.jsx** - Connect to real holdings data
3. **RiskAnalytics.jsx** - Use calculated risk metrics 
4. **TradingInterface.jsx** - Connect to actual order placement
5. **MarketData.jsx** - Real-time market data feeds
6. **PerformanceAnalytics.jsx** - Calculated performance data

### API Client Setup:
- Create centralized API client with auth handling
- Implement error handling and retry logic
- Add loading states and real-time updates
- WebSocket integration for live data

## Security & Performance

### Security Measures:
- Secure TOTP token management
- API rate limiting and throttling
- Input validation and sanitization
- Secure session management

### Performance Optimization:
- Redis caching for frequently accessed data
- Database indexing for portfolio queries
- Lazy loading for large datasets
- Real-time data throttling

## Testing Strategy

### Backend Testing:
- Unit tests for all API endpoints
- Integration tests with Groww API
- Mock external dependencies
- Performance testing under load

### Frontend Testing:
- Component testing with real API integration
- End-to-end user workflow testing
- Cross-browser compatibility testing
- Mobile responsiveness verification

This contracts document will guide the seamless integration of our frontend with a fully functional backend powered by Groww API, transforming our mock Aladdin clone into a production-ready trading platform.