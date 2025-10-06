import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { 
  TrendingUp, 
  TrendingDown, 
  Search,
  Filter,
  RefreshCw,
  BarChart3,
  Globe,
  Clock,
  Bell,
  Star,
  AlertCircle,
  Activity,
  DollarSign
} from 'lucide-react';
import { news, updateMarketData } from '../data/mockData';

const MarketData = ({ marketData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [newsData, setNewsData] = useState(news);
  const [selectedMarket, setSelectedMarket] = useState('NSE');
  const [refreshing, setRefreshing] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercent = (percent) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  const formatNumber = (num) => {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toString();
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const marketSectors = [
    { name: 'NIFTY IT', value: 34567.89, change: 234.56, changePercent: 0.68 },
    { name: 'NIFTY BANK', value: 45678.90, change: -123.45, changePercent: -0.27 },
    { name: 'NIFTY AUTO', value: 18456.78, change: 167.89, changePercent: 0.92 },
    { name: 'NIFTY PHARMA', value: 14567.34, change: 78.90, changePercent: 0.54 },
    { name: 'NIFTY FMCG', value: 56789.01, change: -89.12, changePercent: -0.16 },
    { name: 'NIFTY METAL', value: 6789.45, change: 234.67, changePercent: 3.58 }
  ];

  const topGainers = [
    { symbol: 'ADANIENT', price: 2456.75, change: 234.56, changePercent: 10.55 },
    { symbol: 'TATASTEEL', price: 1234.50, change: 145.67, changePercent: 13.38 },
    { symbol: 'HINDALCO', price: 567.80, change: 67.89, changePercent: 13.59 },
    { symbol: 'COALINDIA', price: 345.60, change: 38.90, changePercent: 12.69 },
    { symbol: 'NTPC', price: 234.75, change: 25.60, changePercent: 12.25 }
  ];

  const topLosers = [
    { symbol: 'CIPLA', price: 1456.25, change: -178.90, changePercent: -10.94 },
    { symbol: 'DRREDDY', price: 5234.50, change: -623.40, changePercent: -10.65 },
    { symbol: 'SUNPHARMA', price: 1123.75, change: -123.45, changePercent: -9.90 },
    { symbol: 'APOLLOHOSP', price: 4567.80, change: -456.70, changePercent: -9.09 },
    { symbol: 'DIVISLAB', price: 3456.90, change: -334.50, changePercent: -8.81 }
  ];

  const commodities = [
    { name: 'Gold', price: 62345.67, unit: '10g', change: -234.56, changePercent: -0.38 },
    { name: 'Silver', price: 78901.23, unit: '1kg', change: 456.78, changePercent: 0.58 },
    { name: 'Crude Oil', price: 6789.45, unit: 'barrel', change: 123.45, changePercent: 1.85 },
    { name: 'Natural Gas', price: 234.56, unit: 'mmBtu', change: -12.34, changePercent: -5.00 }
  ];

  const currencies = [
    { pair: 'USD/INR', price: 83.45, change: 0.23, changePercent: 0.28 },
    { pair: 'EUR/INR', price: 90.12, change: -0.45, changePercent: -0.50 },
    { pair: 'GBP/INR', price: 105.67, change: 0.78, changePercent: 0.74 },
    { pair: 'JPY/INR', price: 0.56, change: -0.01, changePercent: -1.79 }
  ];

  return (
    <div className="space-y-6">
      {/* Market Overview Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Market Data</h2>
          <p className="text-slate-600 mt-1">Real-time market information and analytics</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <Input
              type="text"
              placeholder="Search symbols..."
              className="pl-10 pr-4"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Major Indices */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {marketData.map((index) => (
          <Card key={index.symbol} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg text-slate-900">{index.name}</h3>
                  <p className="text-sm text-slate-600">{index.symbol}</p>
                </div>
                {index.change >= 0 ? (
                  <TrendingUp className="w-6 h-6 text-green-600" />
                ) : (
                  <TrendingDown className="w-6 h-6 text-red-600" />
                )}
              </div>
              
              <div className="space-y-2">
                <p className="text-2xl font-bold text-slate-900">
                  {index.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
                <div className="flex items-center space-x-4">
                  <span className={`text-sm font-semibold ${
                    index.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatPercent(index.changePercent)}
                  </span>
                  <span className={`text-sm ${
                    index.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>H: {index.high.toLocaleString('en-IN')}</span>
                  <span>L: {index.low.toLocaleString('en-IN')}</span>
                  <span>Vol: {formatNumber(index.volume)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Market Analysis Tabs */}
      <Tabs defaultValue="sectors" className="space-y-6">
        <TabsList className="grid w-full lg:w-auto grid-cols-2 lg:grid-cols-5 bg-white border border-slate-200 rounded-lg p-1">
          <TabsTrigger value="sectors" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white">
            Sectors
          </TabsTrigger>
          <TabsTrigger value="movers" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white">
            Top Movers
          </TabsTrigger>
          <TabsTrigger value="commodities" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white">
            Commodities
          </TabsTrigger>
          <TabsTrigger value="currencies" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white">
            Currencies
          </TabsTrigger>
          <TabsTrigger value="news" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white">
            Market News
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sectors">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Sector Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {marketSectors.map((sector, index) => (
                  <div key={index} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-slate-900">{sector.name}</h4>
                      {sector.change >= 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <p className="text-lg font-bold text-slate-900 mb-1">
                      {sector.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-semibold ${
                        sector.change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatPercent(sector.changePercent)}
                      </span>
                      <span className={`text-sm ${
                        sector.change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {sector.change >= 0 ? '+' : ''}{sector.change.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movers">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Gainers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-700">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Top Gainers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topGainers.map((stock, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-slate-900">{stock.symbol}</h4>
                        <p className="text-sm text-slate-600">{formatCurrency(stock.price)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">+{formatPercent(stock.changePercent)}</p>
                        <p className="text-sm text-green-600">+{formatCurrency(stock.change)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Losers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-red-700">
                  <TrendingDown className="w-5 h-5 mr-2" />
                  Top Losers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topLosers.map((stock, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-slate-900">{stock.symbol}</h4>
                        <p className="text-sm text-slate-600">{formatCurrency(stock.price)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-red-600">{formatPercent(stock.changePercent)}</p>
                        <p className="text-sm text-red-600">{formatCurrency(stock.change)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="commodities">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                Commodities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {commodities.map((commodity, index) => (
                  <div key={index} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-slate-900">{commodity.name}</h4>
                      {commodity.change >= 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <p className="text-lg font-bold text-slate-900 mb-1">
                      ₹{commodity.price.toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-slate-500 mb-2">per {commodity.unit}</p>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-semibold ${
                        commodity.change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatPercent(commodity.changePercent)}
                      </span>
                      <span className={`text-sm ${
                        commodity.change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {commodity.change >= 0 ? '+' : ''}₹{Math.abs(commodity.change).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="currencies">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Currency Exchange Rates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {currencies.map((currency, index) => (
                  <div key={index} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-slate-900">{currency.pair}</h4>
                      {currency.change >= 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <p className="text-lg font-bold text-slate-900 mb-1">
                      ₹{currency.price.toFixed(2)}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-semibold ${
                        currency.change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatPercent(currency.changePercent)}
                      </span>
                      <span className={`text-sm ${
                        currency.change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {currency.change >= 0 ? '+' : ''}{currency.change.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="news">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Market News & Updates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {newsData.map((item) => (
                  <div key={item.id} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant={
                            item.category === 'Policy' ? 'default' :
                            item.category === 'Earnings' ? 'secondary' :
                            'outline'
                          }>
                            {item.category}
                          </Badge>
                          <span className="text-xs text-slate-500">{item.source}</span>
                        </div>
                        <h4 className="font-semibold text-slate-900 mb-2">{item.title}</h4>
                        <p className="text-sm text-slate-600 mb-2">{item.summary}</p>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span className="text-xs text-slate-500">
                            {new Date(item.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Star className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketData;