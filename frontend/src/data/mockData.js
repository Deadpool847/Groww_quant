// Mock data for Aladdin clone - comprehensive trading and portfolio management data

export const portfolios = [
  {
    id: 'port_1',
    name: 'Growth Portfolio',
    value: 2847500,
    dayChange: 24750,
    dayChangePercent: 0.88,
    cash: 125000,
    invested: 2722500,
    totalReturn: 347500,
    totalReturnPercent: 14.6,
    benchmark: 'NIFTY 50',
    benchmarkReturn: 12.3,
    riskScore: 7.2,
    sharpeRatio: 1.45,
    beta: 1.12,
    volatility: 18.5,
    maxDrawdown: -12.3,
    createdAt: '2023-06-15',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'port_2', 
    name: 'Defensive Portfolio',
    value: 1523400,
    dayChange: -8450,
    dayChangePercent: -0.55,
    cash: 78000,
    invested: 1445400,
    totalReturn: 123400,
    totalReturnPercent: 8.8,
    benchmark: 'NIFTY 50',
    benchmarkReturn: 12.3,
    riskScore: 4.1,
    sharpeRatio: 0.98,
    beta: 0.73,
    volatility: 12.2,
    maxDrawdown: -8.1,
    createdAt: '2023-08-20',
    lastUpdated: new Date().toISOString()
  }
];

export const holdings = [
  {
    id: 'hold_1',
    portfolioId: 'port_1',
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd',
    quantity: 500,
    avgPrice: 2456.75,
    currentPrice: 2587.30,
    marketValue: 1293650,
    dayChange: 15.80,
    dayChangePercent: 0.61,
    totalReturn: 65275,
    totalReturnPercent: 5.32,
    allocation: 45.5,
    sector: 'Energy',
    exchange: 'NSE'
  },
  {
    id: 'hold_2',
    portfolioId: 'port_1',
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    quantity: 300,
    avgPrice: 3245.60,
    currentPrice: 3398.45,
    marketValue: 1019535,
    dayChange: -12.35,
    dayChangePercent: -0.36,
    totalReturn: 45855,
    totalReturnPercent: 4.71,
    allocation: 35.9,
    sector: 'IT Services',
    exchange: 'NSE'
  },
  {
    id: 'hold_3',
    portfolioId: 'port_1',
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Ltd',
    quantity: 200,
    avgPrice: 1567.80,
    currentPrice: 1623.25,
    marketValue: 324650,
    dayChange: 8.45,
    dayChangePercent: 0.52,
    totalReturn: 11090,
    totalReturnPercent: 3.54,
    allocation: 11.4,
    sector: 'Banking',
    exchange: 'NSE'
  },
  {
    id: 'hold_4',
    portfolioId: 'port_1',
    symbol: 'INFY',
    name: 'Infosys Ltd',
    quantity: 150,
    avgPrice: 1432.50,
    currentPrice: 1478.90,
    marketValue: 221835,
    dayChange: 5.20,
    dayChangePercent: 0.35,
    totalReturn: 6960,
    totalReturnPercent: 3.24,
    allocation: 7.8,
    sector: 'IT Services',
    exchange: 'NSE'
  }
];

export const marketData = [
  {
    symbol: 'NIFTY50',
    name: 'NIFTY 50',
    value: 21456.75,
    change: 145.30,
    changePercent: 0.68,
    high: 21478.90,
    low: 21298.45,
    volume: 2847563210
  },
  {
    symbol: 'SENSEX',
    name: 'S&P BSE Sensex',
    value: 71234.85,
    change: 387.65,
    changePercent: 0.55,
    high: 71456.23,
    low: 70892.45,
    volume: 3456789123
  },
  {
    symbol: 'BANKNIFTY',
    name: 'Bank NIFTY',
    value: 45678.90,
    change: -234.56,
    changePercent: -0.51,
    high: 45987.45,
    low: 45234.78,
    volume: 1234567890
  }
];

export const riskMetrics = {
  portfolioRisk: {
    var95: 156780,
    var99: 234560,
    expectedShortfall: 287645,
    trackingError: 2.45,
    informationRatio: 1.23,
    correlationToBenchmark: 0.89
  },
  sectorExposure: [
    { sector: 'IT Services', allocation: 43.7, risk: 'Medium' },
    { sector: 'Energy', allocation: 45.5, risk: 'High' },
    { sector: 'Banking', allocation: 11.4, risk: 'Medium' },
    { sector: 'Healthcare', allocation: 8.9, risk: 'Low' },
    { sector: 'Consumer Goods', allocation: 12.5, risk: 'Medium' }
  ],
  stressTests: [
    { scenario: '2008 Financial Crisis', portfolioImpact: -23.4, benchmarkImpact: -28.7 },
    { scenario: 'COVID-19 Pandemic', portfolioImpact: -18.9, benchmarkImpact: -22.1 },
    { scenario: 'Interest Rate Shock +200bp', portfolioImpact: -8.7, benchmarkImpact: -10.2 },
    { scenario: 'Oil Price Shock +50%', portfolioImpact: 12.3, benchmarkImpact: 8.9 }
  ]
};

export const chartData = {
  portfolioPerformance: [
    { date: '2024-01-01', portfolio: 100, benchmark: 100 },
    { date: '2024-01-15', portfolio: 102.3, benchmark: 101.8 },
    { date: '2024-02-01', portfolio: 104.7, benchmark: 103.2 },
    { date: '2024-02-15', portfolio: 103.9, benchmark: 102.8 },
    { date: '2024-03-01', portfolio: 106.2, benchmark: 104.5 },
    { date: '2024-03-15', portfolio: 108.8, benchmark: 106.9 },
    { date: '2024-04-01', portfolio: 107.5, benchmark: 105.7 },
    { date: '2024-04-15', portfolio: 110.2, benchmark: 108.3 },
    { date: '2024-05-01', portfolio: 112.6, benchmark: 109.8 },
    { date: '2024-05-15', portfolio: 111.3, benchmark: 108.9 },
    { date: '2024-06-01', portfolio: 114.6, benchmark: 112.3 },
    { date: '2024-06-15', portfolio: 114.6, benchmark: 112.3 }
  ],
  riskReturn: [
    { risk: 10.2, return: 8.5, size: 50000, name: 'Conservative Fund' },
    { risk: 15.7, return: 12.3, size: 125000, name: 'Balanced Fund' },
    { risk: 18.5, return: 14.6, size: 2847500, name: 'Growth Portfolio' },
    { risk: 22.1, return: 16.8, size: 75000, name: 'Aggressive Fund' },
    { risk: 12.3, return: 12.3, size: 100000, name: 'NIFTY 50' }
  ]
};

export const orders = [
  {
    id: 'ord_1',
    symbol: 'RELIANCE',
    side: 'BUY',
    quantity: 100,
    price: 2587.30,
    orderType: 'LIMIT',
    status: 'FILLED',
    timestamp: '2024-01-06T09:15:30Z',
    fillPrice: 2587.30,
    fillQuantity: 100
  },
  {
    id: 'ord_2', 
    symbol: 'TCS',
    side: 'SELL',
    quantity: 50,
    price: 3400.00,
    orderType: 'LIMIT',
    status: 'PENDING',
    timestamp: '2024-01-06T10:22:15Z',
    fillPrice: null,
    fillQuantity: 0
  },
  {
    id: 'ord_3',
    symbol: 'HDFCBANK',
    side: 'BUY',
    quantity: 75,
    price: 1625.00,
    orderType: 'MARKET',
    status: 'FILLED',
    timestamp: '2024-01-06T11:45:22Z',
    fillPrice: 1623.25,
    fillQuantity: 75
  }
];

export const watchlist = [
  { symbol: 'ITC', name: 'ITC Ltd', price: 412.35, change: 2.45, changePercent: 0.60 },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd', price: 967.80, change: -8.20, changePercent: -0.84 },
  { symbol: 'WIPRO', name: 'Wipro Ltd', price: 445.60, change: 12.30, changePercent: 2.84 },
  { symbol: 'LT', name: 'Larsen & Toubro', price: 2789.45, change: 45.60, changePercent: 1.66 },
  { symbol: 'MARUTI', name: 'Maruti Suzuki India', price: 9876.25, change: -123.45, changePercent: -1.23 }
];

export const news = [
  {
    id: 'news_1',
    title: 'RBI Monetary Policy: Repo Rate Held at 6.50%',
    summary: 'Reserve Bank of India maintains status quo on key policy rates, focuses on inflation control',
    timestamp: '2024-01-06T14:30:00Z',
    source: 'Economic Times',
    category: 'Policy'
  },
  {
    id: 'news_2',
    title: 'Q3 Results: TCS Reports Strong Growth in Banking Vertical',
    summary: 'Tata Consultancy Services shows robust performance with 4.1% QoQ revenue growth',
    timestamp: '2024-01-06T13:15:00Z',
    source: 'Business Standard',
    category: 'Earnings'
  },
  {
    id: 'news_3',
    title: 'Oil Prices Surge 3% on Middle East Tensions',
    summary: 'Crude oil futures jump on geopolitical concerns, impacting energy stocks positively',
    timestamp: '2024-01-06T12:45:00Z',
    source: 'Reuters',
    category: 'Commodities'
  }
];

export const analytics = {
  attribution: [
    { factor: 'Security Selection', contribution: 2.3 },
    { factor: 'Sector Allocation', contribution: 1.8 },
    { factor: 'Market Timing', contribution: -0.4 },
    { factor: 'Currency Effect', contribution: 0.1 },
    { factor: 'Interaction Effect', contribution: 0.2 }
  ],
  monthlyReturns: [
    { month: 'Jan 2024', portfolio: 2.3, benchmark: 1.8 },
    { month: 'Feb 2024', portfolio: 1.9, benchmark: 2.1 },
    { month: 'Mar 2024', portfolio: 3.1, benchmark: 2.8 },
    { month: 'Apr 2024', portfolio: -0.8, benchmark: -1.2 },
    { month: 'May 2024', portfolio: 2.7, benchmark: 2.3 },
    { month: 'Jun 2024', portfolio: 1.4, benchmark: 1.1 }
  ]
};

// API simulation functions
export const simulateApiCall = (data, delay = 1000) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

export const generateRandomPrice = (basePrice, volatility = 0.02) => {
  const change = (Math.random() - 0.5) * 2 * volatility;
  return basePrice * (1 + change);
};

export const updateMarketData = () => {
  return marketData.map(item => ({
    ...item,
    value: generateRandomPrice(item.value),
    change: generateRandomPrice(item.change, 0.1),
    changePercent: generateRandomPrice(item.changePercent, 0.1)
  }));
};