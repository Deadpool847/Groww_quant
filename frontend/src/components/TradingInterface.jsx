import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  Plus, 
  Minus, 
  TrendingUp, 
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit3,
  Trash2
} from 'lucide-react';
import { orders, watchlist } from '../data/mockData';
import { useToast } from '../hooks/use-toast';

const TradingInterface = () => {
  const [orderForm, setOrderForm] = useState({
    symbol: '',
    side: 'BUY',
    quantity: '',
    price: '',
    orderType: 'LIMIT'
  });
  const [activeOrders, setActiveOrders] = useState(orders);
  const [watchlistData, setWatchlistData] = useState(watchlist);
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const { toast } = useToast();

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

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    
    if (!orderForm.symbol || !orderForm.quantity) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newOrder = {
      id: `ord_${Date.now()}`,
      symbol: orderForm.symbol.toUpperCase(),
      side: orderForm.side,
      quantity: parseInt(orderForm.quantity),
      price: parseFloat(orderForm.price),
      orderType: orderForm.orderType,
      status: 'PENDING',
      timestamp: new Date().toISOString(),
      fillPrice: null,
      fillQuantity: 0
    };

    setActiveOrders([newOrder, ...activeOrders]);
    
    // Simulate order processing
    setTimeout(() => {
      setActiveOrders(prev => prev.map(order => 
        order.id === newOrder.id 
          ? { ...order, status: 'FILLED', fillPrice: order.price, fillQuantity: order.quantity }
          : order
      ));
      
      toast({
        title: "Order Executed",
        description: `${orderForm.side} order for ${orderForm.quantity} ${orderForm.symbol} executed successfully`,
      });
    }, 2000);

    setOrderForm({
      symbol: '',
      side: 'BUY',
      quantity: '',
      price: '',
      orderType: 'LIMIT'
    });

    toast({
      title: "Order Placed",
      description: `${orderForm.side} order for ${orderForm.quantity} ${orderForm.symbol} placed successfully`,
    });
  };

  const cancelOrder = (orderId) => {
    setActiveOrders(prev => prev.map(order =>
      order.id === orderId ? { ...order, status: 'CANCELLED' } : order
    ));
    
    toast({
      title: "Order Cancelled",
      description: "Order has been cancelled successfully",
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'FILLED':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'PENDING':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'CANCELLED':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'FILLED':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'CANCELLED':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="place-order" className="space-y-6">
        <TabsList className="grid w-full lg:w-auto grid-cols-2 lg:grid-cols-4 bg-white border border-slate-200 rounded-lg p-1">
          <TabsTrigger value="place-order" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white">
            Place Order
          </TabsTrigger>
          <TabsTrigger value="orders" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white">
            Order Book
          </TabsTrigger>
          <TabsTrigger value="watchlist" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white">
            Watchlist
          </TabsTrigger>
          <TabsTrigger value="positions" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white">
            Positions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="place-order">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Entry Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plus className="w-5 h-5 mr-2" />
                    Place New Order
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleOrderSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="symbol">Symbol</Label>
                        <Input
                          id="symbol"
                          placeholder="e.g., RELIANCE, TCS"
                          value={orderForm.symbol}
                          onChange={(e) => setOrderForm({...orderForm, symbol: e.target.value})}
                          className="uppercase"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="side">Side</Label>
                        <select
                          id="side"
                          className="w-full border border-slate-300 rounded-md px-3 py-2"
                          value={orderForm.side}
                          onChange={(e) => setOrderForm({...orderForm, side: e.target.value})}
                        >
                          <option value="BUY">Buy</option>
                          <option value="SELL">Sell</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input
                          id="quantity"
                          type="number"
                          placeholder="Number of shares"
                          value={orderForm.quantity}
                          onChange={(e) => setOrderForm({...orderForm, quantity: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="orderType">Order Type</Label>
                        <select
                          id="orderType"
                          className="w-full border border-slate-300 rounded-md px-3 py-2"
                          value={orderForm.orderType}
                          onChange={(e) => setOrderForm({...orderForm, orderType: e.target.value})}
                        >
                          <option value="LIMIT">Limit</option>
                          <option value="MARKET">Market</option>
                          <option value="STOP">Stop</option>
                          <option value="STOP_LIMIT">Stop Limit</option>
                        </select>
                      </div>
                    </div>

                    {orderForm.orderType !== 'MARKET' && (
                      <div className="space-y-2">
                        <Label htmlFor="price">Price</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          placeholder="Order price"
                          value={orderForm.price}
                          onChange={(e) => setOrderForm({...orderForm, price: e.target.value})}
                        />
                      </div>
                    )}

                    {/* Order Preview */}
                    {orderForm.symbol && orderForm.quantity && (
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-3">Order Preview</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Symbol:</span>
                            <span className="font-medium">{orderForm.symbol.toUpperCase()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Side:</span>
                            <span className={`font-medium ${
                              orderForm.side === 'BUY' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {orderForm.side}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Quantity:</span>
                            <span className="font-medium">{orderForm.quantity}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Order Type:</span>
                            <span className="font-medium">{orderForm.orderType}</span>
                          </div>
                          {orderForm.price && (
                            <div className="flex justify-between">
                              <span className="text-slate-600">Price:</span>
                              <span className="font-medium">{formatCurrency(parseFloat(orderForm.price))}</span>
                            </div>
                          )}
                          {orderForm.quantity && orderForm.price && (
                            <div className="flex justify-between border-t border-slate-300 pt-2 font-semibold">
                              <span>Estimated Total:</span>
                              <span>{formatCurrency(parseFloat(orderForm.quantity) * parseFloat(orderForm.price))}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <Button 
                      type="submit" 
                      className={`w-full ${
                        orderForm.side === 'BUY' 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'bg-red-600 hover:bg-red-700'
                      }`}
                    >
                      {orderForm.side === 'BUY' ? 'Place Buy Order' : 'Place Sell Order'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Market Data Sidebar */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Access</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {watchlistData.slice(0, 5).map((item) => (
                    <div 
                      key={item.symbol} 
                      className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                      onClick={() => setOrderForm({...orderForm, symbol: item.symbol})}
                    >
                      <div>
                        <p className="font-medium text-sm">{item.symbol}</p>
                        <p className="text-xs text-slate-600 truncate">{item.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{formatCurrency(item.price)}</p>
                        <p className={`text-xs ${
                          item.change >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatPercent(item.changePercent)}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Order Book</span>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(order.status)}
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold">{order.symbol}</h4>
                          <Badge 
                            variant={order.side === 'BUY' ? 'default' : 'secondary'}
                            className={`text-xs ${
                              order.side === 'BUY' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {order.side}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {order.orderType}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">
                          Qty: {order.quantity} @ {formatCurrency(order.price)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <Badge className={`${getStatusColor(order.status)} border`}>
                          {order.status}
                        </Badge>
                        <p className="text-xs text-slate-500 mt-1">
                          {new Date(order.timestamp).toLocaleString()}
                        </p>
                      </div>
                      
                      {order.status === 'PENDING' && (
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => cancelOrder(order.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                      
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="watchlist">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Watchlist</span>
                <Button className="bg-slate-900 hover:bg-slate-800">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Symbol
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {watchlistData.map((item) => (
                  <div key={item.symbol} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h4 className="font-semibold">{item.symbol}</h4>
                        <p className="text-sm text-slate-600">{item.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <p className="font-semibold text-lg">{formatCurrency(item.price)}</p>
                        <div className="flex items-center">
                          {item.change >= 0 ? (
                            <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                          )}
                          <span className={`text-sm font-medium ${
                            item.change >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatCurrency(item.change)} ({formatPercent(item.changePercent)})
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => setOrderForm({...orderForm, symbol: item.symbol, side: 'BUY'})}
                        >
                          Buy
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-red-300 text-red-600 hover:bg-red-50"
                          onClick={() => setOrderForm({...orderForm, symbol: item.symbol, side: 'SELL'})}
                        >
                          Sell
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="positions">
          <Card>
            <CardHeader>
              <CardTitle>Current Positions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-slate-600 mb-4">No open positions</p>
                <p className="text-sm text-slate-500">
                  Positions will appear here after executing trades
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TradingInterface;