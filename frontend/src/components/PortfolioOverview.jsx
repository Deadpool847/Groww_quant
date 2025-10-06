import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { 
  PieChart, 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Eye,
  Edit3,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { holdings } from '../data/mockData';

const PortfolioOverview = ({ portfolio }) => {
  const [viewMode, setViewMode] = useState('holdings'); // holdings, sectors, geography

  const portfolioHoldings = holdings.filter(h => h.portfolioId === portfolio.id);
  
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

  const sectorAllocation = portfolioHoldings.reduce((acc, holding) => {
    const existing = acc.find(s => s.sector === holding.sector);
    if (existing) {
      existing.value += holding.marketValue;
      existing.allocation += holding.allocation;
    } else {
      acc.push({
        sector: holding.sector,
        value: holding.marketValue,
        allocation: holding.allocation
      });
    }
    return acc;
  }, []);

  const geographicAllocation = [
    { region: 'India', allocation: 85.6, value: portfolio.value * 0.856 },
    { region: 'United States', allocation: 8.2, value: portfolio.value * 0.082 },
    { region: 'Europe', allocation: 4.1, value: portfolio.value * 0.041 },
    { region: 'Others', allocation: 2.1, value: portfolio.value * 0.021 }
  ];

  return (
    <div className="space-y-6">
      {/* Allocation View Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button 
            variant={viewMode === 'holdings' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('holdings')}
            className={viewMode === 'holdings' ? 'bg-slate-900' : ''}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Holdings
          </Button>
          <Button 
            variant={viewMode === 'sectors' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('sectors')}
            className={viewMode === 'sectors' ? 'bg-slate-900' : ''}
          >
            <PieChart className="w-4 h-4 mr-2" />
            Sectors
          </Button>
          <Button 
            variant={viewMode === 'geography' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('geography')}
            className={viewMode === 'geography' ? 'bg-slate-900' : ''}
          >
            <Eye className="w-4 h-4 mr-2" />
            Geography
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Edit3 className="w-4 h-4 mr-2" />
            Rebalance
          </Button>
          <Button variant="outline" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Holdings View */}
          {viewMode === 'holdings' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Portfolio Holdings</span>
                  <Badge variant="secondary">{portfolioHoldings.length} Securities</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {portfolioHoldings.map((holding) => (
                    <div key={holding.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div>
                            <h4 className="font-semibold text-slate-900">{holding.symbol}</h4>
                            <p className="text-sm text-slate-600">{holding.name}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {holding.exchange}
                          </Badge>
                        </div>
                        
                        <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-slate-500">Quantity</p>
                            <p className="font-medium">{holding.quantity.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-slate-500">Avg Price</p>
                            <p className="font-medium">{formatCurrency(holding.avgPrice)}</p>
                          </div>
                          <div>
                            <p className="text-slate-500">Current Price</p>
                            <p className="font-medium">{formatCurrency(holding.currentPrice)}</p>
                          </div>
                          <div>
                            <p className="text-slate-500">Allocation</p>
                            <p className="font-medium">{holding.allocation.toFixed(1)}%</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right ml-4">
                        <p className="font-semibold text-lg">{formatCurrency(holding.marketValue)}</p>
                        <div className="flex items-center justify-end mt-1">
                          {holding.totalReturn >= 0 ? (
                            <ArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4 text-red-600 mr-1" />
                          )}
                          <span className={`text-sm font-medium ${
                            holding.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatCurrency(holding.totalReturn)} ({formatPercent(holding.totalReturnPercent)})
                          </span>
                        </div>
                        <div className="mt-2">
                          <Progress value={holding.allocation} className="h-2 w-20" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sectors View */}
          {viewMode === 'sectors' && (
            <Card>
              <CardHeader>
                <CardTitle>Sector Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {sectorAllocation.map((sector, index) => (
                    <div key={sector.sector} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-900">{sector.sector}</span>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(sector.value)}</p>
                          <p className="text-sm text-slate-600">{sector.allocation.toFixed(1)}%</p>
                        </div>
                      </div>
                      <Progress value={sector.allocation} className="h-3" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Geography View */}
          {viewMode === 'geography' && (
            <Card>
              <CardHeader>
                <CardTitle>Geographic Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {geographicAllocation.map((region, index) => (
                    <div key={region.region} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-900">{region.region}</span>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(region.value)}</p>
                          <p className="text-sm text-slate-600">{region.allocation.toFixed(1)}%</p>
                        </div>
                      </div>
                      <Progress value={region.allocation} className="h-3" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Portfolio Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-slate-600">Beta</span>
                <span className="font-medium">{portfolio.beta}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Volatility</span>
                <span className="font-medium">{portfolio.volatility}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Max Drawdown</span>
                <span className="font-medium text-red-600">{portfolio.maxDrawdown}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Sharpe Ratio</span>
                <span className="font-medium">{portfolio.sharpeRatio}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Benchmark</span>
                <span className="font-medium">{portfolio.benchmark}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Benchmark Return</span>
                <span className="font-medium">{portfolio.benchmarkReturn}%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Asset Allocation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Equity</span>
                  <span className="font-medium">92.4%</span>
                </div>
                <Progress value={92.4} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Cash</span>
                  <span className="font-medium">4.6%</span>
                </div>
                <Progress value={4.6} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Fixed Income</span>
                  <span className="font-medium">2.1%</span>
                </div>
                <Progress value={2.1} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Alternatives</span>
                  <span className="font-medium">0.9%</span>
                </div>
                <Progress value={0.9} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top Contributors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {portfolioHoldings
                .sort((a, b) => b.totalReturn - a.totalReturn)
                .slice(0, 3)
                .map((holding) => (
                  <div key={holding.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{holding.symbol}</p>
                      <p className="text-xs text-slate-600">{holding.allocation.toFixed(1)}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">
                        +{formatCurrency(holding.totalReturn)}
                      </p>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PortfolioOverview;