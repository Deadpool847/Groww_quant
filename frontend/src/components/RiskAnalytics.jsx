import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  AlertTriangle, 
  Shield, 
  TrendingDown, 
  Target,
  BarChart3,
  PieChart,
  Activity,
  Zap
} from 'lucide-react';
import { riskMetrics, chartData } from '../data/mockData';

const RiskAnalytics = ({ portfolio }) => {
  const [selectedStressTest, setSelectedStressTest] = useState(null);
  const [riskTimeframe, setRiskTimeframe] = useState('1M');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getRiskLevel = (score) => {
    if (score <= 3) return { level: 'Low', color: 'bg-green-500', textColor: 'text-green-700' };
    if (score <= 6) return { level: 'Medium', color: 'bg-yellow-500', textColor: 'text-yellow-700' };
    return { level: 'High', color: 'bg-red-500', textColor: 'text-red-700' };
  };

  const riskLevel = getRiskLevel(portfolio.riskScore);

  return (
    <div className="space-y-6">
      {/* Risk Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700 mb-1">Value at Risk (95%)</p>
                <h3 className="text-xl font-bold text-red-900">{formatCurrency(riskMetrics.portfolioRisk.var95)}</h3>
                <p className="text-xs text-red-600 mt-1">1-day horizon</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700 mb-1">Expected Shortfall</p>
                <h3 className="text-xl font-bold text-orange-900">{formatCurrency(riskMetrics.portfolioRisk.expectedShortfall)}</h3>
                <p className="text-xs text-orange-600 mt-1">Tail risk measure</p>
              </div>
              <TrendingDown className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 mb-1">Tracking Error</p>
                <h3 className="text-xl font-bold text-blue-900">{riskMetrics.portfolioRisk.trackingError}%</h3>
                <p className="text-xs text-blue-600 mt-1">vs {portfolio.benchmark}</p>
              </div>
              <Target className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 mb-1">Information Ratio</p>
                <h3 className="text-xl font-bold text-purple-900">{riskMetrics.portfolioRisk.informationRatio}</h3>
                <p className="text-xs text-purple-600 mt-1">Risk-adjusted alpha</p>
              </div>
              <Activity className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Analytics Tabs */}
      <Tabs defaultValue="exposure" className="space-y-6">
        <TabsList className="grid w-full lg:w-auto grid-cols-2 lg:grid-cols-4 bg-white border border-slate-200 rounded-lg p-1">
          <TabsTrigger value="exposure" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white">
            Exposure Analysis
          </TabsTrigger>
          <TabsTrigger value="stress" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white">
            Stress Testing
          </TabsTrigger>
          <TabsTrigger value="scenarios" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white">
            Scenario Analysis
          </TabsTrigger>
          <TabsTrigger value="correlation" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white">
            Correlation Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="exposure">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sector Risk Exposure */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="w-5 h-5 mr-2" />
                  Sector Risk Exposure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {riskMetrics.sectorExposure.map((sector, index) => (
                    <div key={sector.sector} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-900">{sector.sector}</span>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={sector.risk === 'High' ? 'destructive' : sector.risk === 'Medium' ? 'secondary' : 'default'}
                            className="text-xs"
                          >
                            {sector.risk}
                          </Badge>
                          <span className="text-sm text-slate-600">{sector.allocation.toFixed(1)}%</span>
                        </div>
                      </div>
                      <Progress 
                        value={sector.allocation} 
                        className={`h-3 ${
                          sector.risk === 'High' ? '[&>div]:bg-red-500' : 
                          sector.risk === 'Medium' ? '[&>div]:bg-yellow-500' : '[&>div]:bg-green-500'
                        }`} 
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Risk Concentration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Risk Concentration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center p-6 bg-slate-50 rounded-lg">
                    <div className={`w-24 h-24 mx-auto rounded-full ${riskLevel.color} flex items-center justify-center mb-4`}>
                      <Shield className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-1">{portfolio.riskScore}/10</h3>
                    <p className={`font-medium ${riskLevel.textColor} mb-2`}>{riskLevel.level} Risk</p>
                    <p className="text-sm text-slate-600">Portfolio Risk Score</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Single Asset Risk (Max)</span>
                      <span className="font-medium">45.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Sector Concentration</span>
                      <span className="font-medium">Medium</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Geographic Concentration</span>
                      <span className="font-medium">High</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Correlation to Benchmark</span>
                      <span className="font-medium">{riskMetrics.portfolioRisk.correlationToBenchmark}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stress">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Historical Stress Tests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {riskMetrics.stressTests.map((test, index) => (
                  <div 
                    key={index} 
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedStressTest === index 
                        ? 'border-slate-900 bg-slate-50' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                    onClick={() => setSelectedStressTest(selectedStressTest === index ? null : index)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-slate-900">{test.scenario}</h4>
                        <p className="text-sm text-slate-600 mt-1">
                          Historical simulation based on past market conditions
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center space-x-4">
                          <div>
                            <p className="text-xs text-slate-500">Portfolio Impact</p>
                            <p className={`font-semibold ${
                              test.portfolioImpact >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {test.portfolioImpact >= 0 ? '+' : ''}{test.portfolioImpact.toFixed(1)}%
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Benchmark</p>
                            <p className={`font-semibold ${
                              test.benchmarkImpact >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {test.benchmarkImpact >= 0 ? '+' : ''}{test.benchmarkImpact.toFixed(1)}%
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {selectedStressTest === index && (
                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-slate-600 mb-2">Portfolio Performance vs Benchmark</p>
                            <div className="flex items-center justify-between mb-1">
                              <span>Relative Performance:</span>
                              <span className={`font-medium ${
                                (test.portfolioImpact - test.benchmarkImpact) >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {test.portfolioImpact - test.benchmarkImpact >= 0 ? '+' : ''}
                                {(test.portfolioImpact - test.benchmarkImpact).toFixed(1)}%
                              </span>
                            </div>
                            <Progress 
                              value={Math.abs(test.portfolioImpact - test.benchmarkImpact) * 2} 
                              className="h-2" 
                            />
                          </div>
                          <div>
                            <p className="text-slate-600 mb-2">Estimated Loss</p>
                            <p className="text-lg font-bold text-red-600">
                              {formatCurrency(portfolio.value * Math.abs(test.portfolioImpact) / 100)}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              Based on current portfolio value
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scenarios">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monte Carlo Simulation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Simulation Parameters</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Time Horizon:</span>
                        <span className="font-medium">1 Year</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Simulations:</span>
                        <span className="font-medium">10,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Confidence Level:</span>
                        <span className="font-medium">95%</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Best Case (95th percentile)</span>
                      <span className="font-semibold text-green-600">+28.4%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Expected Return (50th percentile)</span>
                      <span className="font-semibold">+12.7%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Worst Case (5th percentile)</span>
                      <span className="font-semibold text-red-600">-15.2%</span>
                    </div>
                  </div>

                  <Button className="w-full bg-slate-900 hover:bg-slate-800">
                    Run New Simulation
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Custom Scenario Builder</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Market Shock Magnitude
                    </label>
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      defaultValue="0"
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>-50%</span>
                      <span>0%</span>
                      <span>+50%</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Interest Rate Change
                    </label>
                    <select className="w-full border border-slate-300 rounded-md px-3 py-2">
                      <option>No Change</option>
                      <option>+100 basis points</option>
                      <option>+200 basis points</option>
                      <option>-100 basis points</option>
                      <option>-200 basis points</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Sector Impact
                    </label>
                    <select className="w-full border border-slate-300 rounded-md px-3 py-2">
                      <option>All Sectors</option>
                      <option>IT Sector Only</option>
                      <option>Banking Sector Only</option>
                      <option>Energy Sector Only</option>
                    </select>
                  </div>

                  <Button className="w-full bg-slate-900 hover:bg-slate-800">
                    Analyze Scenario
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="correlation">
          <Card>
            <CardHeader>
              <CardTitle>Correlation Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <h4 className="text-lg font-semibold text-blue-900 mb-1">0.89</h4>
                    <p className="text-sm text-blue-700">Portfolio vs Benchmark</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <h4 className="text-lg font-semibold text-green-900 mb-1">0.34</h4>
                    <p className="text-sm text-green-700">Average Asset Correlation</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <h4 className="text-lg font-semibold text-purple-900 mb-1">0.67</h4>
                    <p className="text-sm text-purple-700">Sector Correlation</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-4">Correlation Heatmap</h4>
                  <p className="text-sm text-slate-600 text-center py-8">
                    Interactive correlation matrix would be displayed here
                    <br />
                    Showing relationships between portfolio holdings
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RiskAnalytics;