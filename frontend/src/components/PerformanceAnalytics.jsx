import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Target,
  Calendar,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { chartData, analytics } from '../data/mockData';

const PerformanceAnalytics = ({ portfolio }) => {
  const [timeframe, setTimeframe] = useState('6M');
  const [benchmark, setBenchmark] = useState('NIFTY50');

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

  const calculateVolatility = (returns) => {
    const mean = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) / returns.length;
    return Math.sqrt(variance * 252); // Annualized
  };

  const timeframeOptions = [
    { value: '1M', label: '1 Month' },
    { value: '3M', label: '3 Months' },
    { value: '6M', label: '6 Months' },
    { value: '1Y', label: '1 Year' },
    { value: '3Y', label: '3 Years' },
    { value: 'YTD', label: 'Year to Date' }
  ];

  return (
    <div className="space-y-6">
      {/* Performance Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Performance Analytics</h2>
          <p className="text-slate-600 mt-1">Comprehensive portfolio performance analysis and attribution</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          <select 
            className="border border-slate-300 rounded-md px-3 py-2"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          >
            {timeframeOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <select 
            className="border border-slate-300 rounded-md px-3 py-2"
            value={benchmark}
            onChange={(e) => setBenchmark(e.target.value)}
          >
            <option value="NIFTY50">NIFTY 50</option>
            <option value="SENSEX">SENSEX</option>
            <option value="NIFTY100">NIFTY 100</option>
          </select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 mb-1">Total Return</p>
                <h3 className="text-2xl font-bold text-green-900">{formatPercent(portfolio.totalReturnPercent)}</h3>
                <p className="text-xs text-green-600 mt-1">Since inception</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 mb-1">Alpha</p>
                <h3 className="text-2xl font-bold text-blue-900">2.3%</h3>
                <p className="text-xs text-blue-600 mt-1">Excess return</p>
              </div>
              <Target className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 mb-1">Sharpe Ratio</p>
                <h3 className="text-2xl font-bold text-purple-900">{portfolio.sharpeRatio}</h3>
                <p className="text-xs text-purple-600 mt-1">Risk-adjusted return</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700 mb-1">Volatility</p>
                <h3 className="text-2xl font-bold text-orange-900">{portfolio.volatility}%</h3>
                <p className="text-xs text-orange-600 mt-1">Annualized</p>
              </div>
              <PieChart className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Analysis Tabs */}
      <Tabs defaultValue="returns" className="space-y-6">
        <TabsList className="grid w-full lg:w-auto grid-cols-2 lg:grid-cols-4 bg-white border border-slate-200 rounded-lg p-1">
          <TabsTrigger value="returns" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white">
            Returns Analysis
          </TabsTrigger>
          <TabsTrigger value="attribution" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white">
            Performance Attribution
          </TabsTrigger>
          <TabsTrigger value="comparison" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white">
            Benchmark Comparison
          </TabsTrigger>
          <TabsTrigger value="drawdown" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white">
            Drawdown Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="returns">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Performance Chart */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Performance Chart</span>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">Portfolio</Badge>
                      <Badge variant="secondary">Benchmark</Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80 bg-slate-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600 mb-2">Interactive Performance Chart</p>
                      <p className="text-sm text-slate-500">
                        Portfolio vs Benchmark performance over time
                      </p>
                    </div>
                  </div>
                  
                  {/* Chart Legend */}
                  <div className="mt-4 flex items-center justify-center space-x-6">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                      <span className="text-sm text-slate-600">Portfolio (+14.6%)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-gray-400 rounded mr-2"></div>
                      <span className="text-sm text-slate-600">NIFTY 50 (+12.3%)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Returns */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Monthly Returns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics.monthlyReturns.map((monthData, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-700">{monthData.month}</span>
                          <div className="text-right">
                            <div className={`text-sm font-semibold ${
                              monthData.portfolio >= monthData.benchmark ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {formatPercent(monthData.portfolio)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-slate-200 rounded-full h-2">
                            <div 
                              className={`h-full rounded-full ${
                                monthData.portfolio >= 0 ? 'bg-green-500' : 'bg-red-500'
                              }`}
                              style={{
                                width: `${Math.min(Math.abs(monthData.portfolio) * 10, 100)}%`
                              }}
                            ></div>
                          </div>
                          <span className="text-xs text-slate-500 w-12">
                            {formatPercent(monthData.benchmark, false)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="attribution">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Attribution */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Attribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {analytics.attribution.map((factor, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-900">{factor.factor}</span>
                        <div className="flex items-center">
                          {factor.contribution >= 0 ? (
                            <ArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4 text-red-600 mr-1" />
                          )}
                          <span className={`font-semibold ${
                            factor.contribution >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {factor.contribution >= 0 ? '+' : ''}{factor.contribution.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                      <Progress 
                        value={Math.abs(factor.contribution) * 20} 
                        className={`h-3 ${
                          factor.contribution >= 0 ? '[&>div]:bg-green-500' : '[&>div]:bg-red-500'
                        }`}
                      />
                    </div>
                  ))}
                  
                  <div className="pt-4 border-t border-slate-200">
                    <div className="flex justify-between font-semibold">
                      <span>Total Attribution</span>
                      <span className="text-green-600">
                        +{analytics.attribution.reduce((sum, factor) => sum + factor.contribution, 0).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk-Return Scatter */}
            <Card>
              <CardHeader>
                <CardTitle>Risk-Return Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 bg-slate-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <PieChart className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 mb-2">Risk vs Return Scatter Plot</p>
                    <p className="text-sm text-slate-500">
                      Comparing portfolio positions on risk-return spectrum
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Efficient Frontier Position</span>
                    <Badge className="bg-green-100 text-green-700">Optimal</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Risk-Adjusted Performance</span>
                    <span className="font-medium">Above Average</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Diversification Ratio</span>
                    <span className="font-medium">0.73</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle>Benchmark Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Comparison Table */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 font-semibold text-slate-900">Metric</th>
                        <th className="text-right py-3 px-4 font-semibold text-slate-900">Portfolio</th>
                        <th className="text-right py-3 px-4 font-semibold text-slate-900">Benchmark</th>
                        <th className="text-right py-3 px-4 font-semibold text-slate-900">Difference</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="py-3 px-4 text-slate-700">Total Return</td>
                        <td className="py-3 px-4 text-right font-medium">{formatPercent(portfolio.totalReturnPercent)}</td>
                        <td className="py-3 px-4 text-right font-medium">{formatPercent(portfolio.benchmarkReturn)}</td>
                        <td className="py-3 px-4 text-right font-semibold text-green-600">
                          +{(portfolio.totalReturnPercent - portfolio.benchmarkReturn).toFixed(2)}%
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-slate-700">Volatility</td>
                        <td className="py-3 px-4 text-right font-medium">{portfolio.volatility}%</td>
                        <td className="py-3 px-4 text-right font-medium">16.2%</td>
                        <td className="py-3 px-4 text-right font-semibold text-red-600">
                          +{(portfolio.volatility - 16.2).toFixed(1)}%
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-slate-700">Sharpe Ratio</td>
                        <td className="py-3 px-4 text-right font-medium">{portfolio.sharpeRatio}</td>
                        <td className="py-3 px-4 text-right font-medium">0.76</td>
                        <td className="py-3 px-4 text-right font-semibold text-green-600">
                          +{(portfolio.sharpeRatio - 0.76).toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-slate-700">Max Drawdown</td>
                        <td className="py-3 px-4 text-right font-medium">{portfolio.maxDrawdown}%</td>
                        <td className="py-3 px-4 text-right font-medium">-18.7%</td>
                        <td className="py-3 px-4 text-right font-semibold text-green-600">
                          +{(Math.abs(portfolio.maxDrawdown) - 18.7).toFixed(1)}%
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-slate-700">Beta</td>
                        <td className="py-3 px-4 text-right font-medium">{portfolio.beta}</td>
                        <td className="py-3 px-4 text-right font-medium">1.00</td>
                        <td className="py-3 px-4 text-right font-semibold">
                          +{(portfolio.beta - 1.0).toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Performance Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">Outperformance</h4>
                    <p className="text-2xl font-bold text-green-600">
                      +{(portfolio.totalReturnPercent - portfolio.benchmarkReturn).toFixed(1)}%
                    </p>
                    <p className="text-sm text-green-700 mt-1">vs Benchmark</p>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Tracking Error</h4>
                    <p className="text-2xl font-bold text-blue-600">2.45%</p>
                    <p className="text-sm text-blue-700 mt-1">Annualized</p>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-900 mb-2">Information Ratio</h4>
                    <p className="text-2xl font-bold text-purple-600">1.23</p>
                    <p className="text-sm text-purple-700 mt-1">Risk-Adjusted Alpha</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drawdown">
          <Card>
            <CardHeader>
              <CardTitle>Drawdown Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Drawdown Chart */}
                <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <TrendingDown className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 mb-2">Drawdown Timeline Chart</p>
                    <p className="text-sm text-slate-500">
                      Historical portfolio drawdowns and recovery periods
                    </p>
                  </div>
                </div>

                {/* Drawdown Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-slate-900">Maximum Drawdown</h4>
                    <p className="text-3xl font-bold text-red-600">{portfolio.maxDrawdown}%</p>
                    <p className="text-sm text-slate-600">Peak-to-trough decline</p>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-slate-900">Recovery Time</h4>
                    <p className="text-3xl font-bold text-blue-600">4.2</p>
                    <p className="text-sm text-slate-600">Months to new high</p>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-slate-900">Drawdown Duration</h4>
                    <p className="text-3xl font-bold text-orange-600">2.8</p>
                    <p className="text-sm text-slate-600">Average months</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Historical Drawdowns</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700">Mar 2020 - COVID-19 Crash</span>
                      <div className="text-right">
                        <span className="font-semibold text-red-600">-18.9%</span>
                        <p className="text-xs text-slate-500">45 days to recover</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700">Sep 2023 - Interest Rate Surge</span>
                      <div className="text-right">
                        <span className="font-semibold text-red-600">-12.3%</span>
                        <p className="text-xs text-slate-500">Current drawdown</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700">Jan 2023 - Market Correction</span>
                      <div className="text-right">
                        <span className="font-semibold text-red-600">-8.7%</span>
                        <p className="text-xs text-slate-500">28 days to recover</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceAnalytics;