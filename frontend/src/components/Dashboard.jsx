import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  BarChart3, 
  Target,
  Shield,
  Globe,
  Bell,
  Settings,
  User,
  LogOut,
  Search,
  Filter,
  Calendar,
  Download,
  RefreshCw,
  Plus,
  Minus
} from 'lucide-react';
import PortfolioOverview from './PortfolioOverview';
import RiskAnalytics from './RiskAnalytics';
import TradingInterface from './TradingInterface';
import MarketData from './MarketData';
import PerformanceAnalytics from './PerformanceAnalytics';
import { portfolios, marketData, updateMarketData } from '../data/mockData';

const Dashboard = () => {
  const [activePortfolio, setActivePortfolio] = useState(portfolios[0]);
  const [marketDataState, setMarketDataState] = useState(marketData);
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'alert', message: 'Portfolio risk threshold exceeded', time: '2m ago' },
    { id: 2, type: 'info', message: 'Q3 earnings season starting next week', time: '1h ago' },
    { id: 3, type: 'success', message: 'Order executed successfully', time: '3h ago' }
  ]);

  useEffect(() => {
    // Simulate real-time market data updates
    const interval = setInterval(() => {
      setMarketDataState(updateMarketData());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setMarketDataState(updateMarketData());
    setRefreshing(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (percent, showSign = true) => {
    const formatted = Math.abs(percent).toFixed(2);
    const sign = percent >= 0 ? '+' : '-';
    return showSign ? `${sign}${formatted}%` : `${formatted}%`;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Aladdin</h1>
                  <p className="text-sm text-slate-500">Portfolio Management System</p>
                </div>
              </div>
              
              <nav className="hidden md:flex space-x-6">
                <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
                  <PieChart className="w-4 h-4 mr-2" />
                  Portfolio
                </Button>
                <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
                  <Shield className="w-4 h-4 mr-2" />
                  Risk
                </Button>
                <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </Button>
                <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
                  <Globe className="w-4 h-4 mr-2" />
                  Trading
                </Button>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search securities..."
                  className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                />
              </div>
              
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>

              <div className="relative">
                <Button variant="ghost" size="sm">
                  <Bell className="w-5 h-5" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                  )}
                </Button>
              </div>

              <Button variant="ghost" size="sm">
                <Settings className="w-5 h-5" />
              </Button>

              <div className="flex items-center space-x-2 border-l border-slate-200 pl-4">
                <Button variant="ghost" size="sm">
                  <User className="w-4 h-4 mr-2" />
                  Admin User
                </Button>
                <Button variant="ghost" size="sm">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-6 py-6">
        {/* Portfolio Selector & Key Metrics */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <select 
                className="text-2xl font-bold bg-transparent border-none focus:outline-none cursor-pointer"
                value={activePortfolio.id}
                onChange={(e) => {
                  const portfolio = portfolios.find(p => p.id === e.target.value);
                  setActivePortfolio(portfolio);
                }}
              >
                {portfolios.map(portfolio => (
                  <option key={portfolio.id} value={portfolio.id}>{portfolio.name}</option>
                ))}
              </select>
              <p className="text-slate-500 mt-1">
                Last updated: {new Date(activePortfolio.lastUpdated).toLocaleString()}
              </p>
            </div>
            
            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              <Button className="bg-slate-900 hover:bg-slate-800">
                <Plus className="w-4 h-4 mr-2" />
                New Order
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Date Range
              </Button>
            </div>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700 mb-1">Portfolio Value</p>
                    <h3 className="text-2xl font-bold text-blue-900">{formatCurrency(activePortfolio.value)}</h3>
                    <div className="flex items-center mt-2">
                      {activePortfolio.dayChange >= 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                      )}
                      <span className={`text-sm font-medium ${
                        activePortfolio.dayChange >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatCurrency(activePortfolio.dayChange)} ({formatPercent(activePortfolio.dayChangePercent)})
                      </span>
                    </div>
                  </div>
                  <DollarSign className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700 mb-1">Total Return</p>
                    <h3 className="text-2xl font-bold text-green-900">{formatCurrency(activePortfolio.totalReturn)}</h3>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                      <span className="text-sm font-medium text-green-600">
                        {formatPercent(activePortfolio.totalReturnPercent)}
                      </span>
                    </div>
                  </div>
                  <Target className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-700 mb-1">Risk Score</p>
                    <h3 className="text-2xl font-bold text-purple-900">{activePortfolio.riskScore}/10</h3>
                    <div className="mt-2">
                      <Progress value={activePortfolio.riskScore * 10} className="h-2" />
                    </div>
                  </div>
                  <Shield className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-700 mb-1">Sharpe Ratio</p>
                    <h3 className="text-2xl font-bold text-orange-900">{activePortfolio.sharpeRatio}</h3>
                    <div className="mt-2">
                      <Badge variant={activePortfolio.sharpeRatio > 1 ? "default" : "secondary"} className="text-xs">
                        {activePortfolio.sharpeRatio > 1 ? 'Excellent' : 'Good'}
                      </Badge>
                    </div>
                  </div>
                  <BarChart3 className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full lg:w-auto grid-cols-2 lg:grid-cols-5 bg-white border border-slate-200 rounded-lg p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white">
              Portfolio Overview
            </TabsTrigger>
            <TabsTrigger value="risk" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white">
              Risk Analytics
            </TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white">
              Performance
            </TabsTrigger>
            <TabsTrigger value="trading" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white">
              Trading
            </TabsTrigger>
            <TabsTrigger value="market" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white">
              Market Data
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <PortfolioOverview portfolio={activePortfolio} />
          </TabsContent>

          <TabsContent value="risk">
            <RiskAnalytics portfolio={activePortfolio} />
          </TabsContent>

          <TabsContent value="performance">
            <PerformanceAnalytics portfolio={activePortfolio} />
          </TabsContent>

          <TabsContent value="trading">
            <TradingInterface />
          </TabsContent>

          <TabsContent value="market">
            <MarketData marketData={marketDataState} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;