#!/usr/bin/env python3
"""
Comprehensive Backend Test Suite for Aladdin Trading Platform
Tests all API endpoints, error handling, and functionality
"""

import requests
import json
import time
from datetime import datetime, timedelta
from typing import Dict, Any, List
import sys
import os

# Backend URL - Use internal URL for testing since external routing has issues
BACKEND_URL = "http://localhost:8001"
API_BASE = f"{BACKEND_URL}/api/v1"

class AladdinTester:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'User-Agent': 'Aladdin-Test-Suite/1.0'
        })
        self.results = {
            'passed': 0,
            'failed': 0,
            'errors': [],
            'test_details': []
        }
    
    def log_test(self, test_name: str, success: bool, details: str = "", response_data: Any = None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"    {details}")
        if not success and response_data:
            print(f"    Response: {response_data}")
        
        self.results['test_details'].append({
            'test': test_name,
            'success': success,
            'details': details,
            'response': response_data
        })
        
        if success:
            self.results['passed'] += 1
        else:
            self.results['failed'] += 1
            self.results['errors'].append(f"{test_name}: {details}")
    
    def test_endpoint(self, method: str, endpoint: str, expected_status: int = 200, 
                     data: Dict = None, test_name: str = None) -> Dict:
        """Generic endpoint tester"""
        if not test_name:
            test_name = f"{method} {endpoint}"
        
        try:
            url = f"{BACKEND_URL}{endpoint}" if endpoint.startswith('/') else f"{API_BASE}{endpoint}"
            
            if method.upper() == 'GET':
                response = self.session.get(url, timeout=30)
            elif method.upper() == 'POST':
                response = self.session.post(url, json=data, timeout=30)
            elif method.upper() == 'PUT':
                response = self.session.put(url, json=data, timeout=30)
            elif method.upper() == 'DELETE':
                response = self.session.delete(url, timeout=30)
            else:
                raise ValueError(f"Unsupported method: {method}")
            
            success = response.status_code == expected_status
            
            try:
                response_data = response.json()
            except:
                response_data = response.text
            
            details = f"Status: {response.status_code}, Expected: {expected_status}"
            if not success:
                details += f", Response: {str(response_data)[:200]}"
            
            self.log_test(test_name, success, details, response_data if not success else None)
            
            return {
                'success': success,
                'status_code': response.status_code,
                'data': response_data,
                'response': response
            }
            
        except Exception as e:
            self.log_test(test_name, False, f"Exception: {str(e)}")
            return {
                'success': False,
                'error': str(e),
                'data': None
            }
    
    def test_health_endpoints(self):
        """Test health check and basic endpoints"""
        print("\n🏥 Testing Health & Basic Endpoints")
        print("=" * 50)
        
        # Test root endpoint
        self.test_endpoint('GET', '/', 200, test_name="Root endpoint")
        
        # Test health endpoint
        result = self.test_endpoint('GET', '/health', 200, test_name="Health check")
        if result['success'] and result['data']:
            data = result['data']
            if isinstance(data, dict):
                if data.get('status') == 'healthy':
                    self.log_test("Health status validation", True, "Status is healthy")
                else:
                    self.log_test("Health status validation", False, f"Status: {data.get('status')}")
        
        # Test detailed health endpoint
        result = self.test_endpoint('GET', '/health/detailed', 200, test_name="Detailed health check")
        if result['success'] and result['data']:
            data = result['data']
            if isinstance(data, dict) and 'detailed_checks' in data:
                self.log_test("Detailed health structure", True, "Contains detailed_checks")
            else:
                self.log_test("Detailed health structure", False, "Missing detailed_checks")
        
        # Test metrics endpoint
        self.test_endpoint('GET', '/metrics', 200, test_name="Metrics endpoint")
    
    def test_market_data_endpoints(self):
        """Test market data API endpoints"""
        print("\n📈 Testing Market Data Endpoints")
        print("=" * 50)
        
        # Test market quote
        symbols = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY']
        
        for symbol in symbols[:2]:  # Test first 2 symbols
            self.test_endpoint('GET', f'/market/quote/{symbol}', 200, 
                             test_name=f"Market quote for {symbol}")
        
        # Test LTP endpoints
        for symbol in symbols[:2]:
            self.test_endpoint('GET', f'/market/ltp/{symbol}', 200,
                             test_name=f"LTP for {symbol}")
        
        # Test historical data with date parameters
        end_date = datetime.now().strftime('%Y-%m-%d')
        start_date = (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d')
        
        self.test_endpoint('GET', f'/market/historical/HDFCBANK?start_time={start_date}&end_time={end_date}', 
                          200, test_name="Historical data with date params")
        
        # Test market overview
        self.test_endpoint('GET', '/market/overview', 200, test_name="Market overview")
        
        # Test bulk LTP endpoint
        bulk_symbols = "RELIANCE,TCS,HDFCBANK"
        self.test_endpoint('GET', f'/market/bulk/ltp?symbols={bulk_symbols}', 200,
                          test_name="Bulk LTP endpoint")
        
        # Test invalid symbol
        self.test_endpoint('GET', '/market/quote/INVALID_SYMBOL', 500,
                          test_name="Invalid symbol handling")
    
    def test_portfolio_endpoints(self):
        """Test portfolio management endpoints"""
        print("\n💼 Testing Portfolio Management Endpoints")
        print("=" * 50)
        
        # Test get all portfolios
        result = self.test_endpoint('GET', '/portfolio/', 200, test_name="Get all portfolios")
        
        # Test specific portfolio
        self.test_endpoint('GET', '/portfolio/port_1', 200, test_name="Get specific portfolio")
        
        # Test portfolio holdings
        result = self.test_endpoint('GET', '/portfolio/port_1/holdings', 200, 
                                   test_name="Get portfolio holdings")
        if result['success'] and result['data']:
            data = result['data']
            if isinstance(data, dict) and 'holdings' in data:
                self.log_test("Holdings structure validation", True, "Contains holdings array")
            else:
                self.log_test("Holdings structure validation", False, "Missing holdings array")
        
        # Test portfolio performance
        self.test_endpoint('GET', '/portfolio/port_1/performance', 200,
                          test_name="Get portfolio performance")
        
        # Test portfolio performance with period
        self.test_endpoint('GET', '/portfolio/port_1/performance?period=6M', 200,
                          test_name="Portfolio performance with period")
        
        # Test portfolio risk analytics
        result = self.test_endpoint('GET', '/portfolio/port_1/risk', 200,
                                   test_name="Get portfolio risk analytics")
        if result['success'] and result['data']:
            data = result['data']
            if isinstance(data, dict) and 'risk_score' in data:
                self.log_test("Risk analytics structure", True, "Contains risk_score")
            else:
                self.log_test("Risk analytics structure", False, "Missing risk_score")
        
        # Test non-existent portfolio
        self.test_endpoint('GET', '/portfolio/non_existent', 404,
                          test_name="Non-existent portfolio handling")
    
    def test_order_endpoints(self):
        """Test order management endpoints"""
        print("\n📋 Testing Order Management Endpoints")
        print("=" * 50)
        
        # Test get orders list
        result = self.test_endpoint('GET', '/orders/', 200, test_name="Get orders list")
        if result['success'] and result['data']:
            data = result['data']
            if isinstance(data, dict) and 'orders' in data:
                self.log_test("Orders list structure", True, "Contains orders array")
            else:
                self.log_test("Orders list structure", False, "Missing orders array")
        
        # Test get orders with filters
        self.test_endpoint('GET', '/orders/?status=FILLED', 200,
                          test_name="Get orders with status filter")
        
        self.test_endpoint('GET', '/orders/?symbol=RELIANCE', 200,
                          test_name="Get orders with symbol filter")
        
        # Test place new order
        order_data = {
            "symbol": "RELIANCE",
            "side": "BUY",
            "quantity": 10,
            "orderType": "MARKET"
        }
        
        result = self.test_endpoint('POST', '/orders/place', 200, data=order_data,
                                   test_name="Place new order")
        
        order_id = None
        if result['success'] and result['data']:
            data = result['data']
            if isinstance(data, dict) and 'order' in data:
                order_id = data['order'].get('id')
                self.log_test("Order placement response", True, f"Order ID: {order_id}")
            else:
                self.log_test("Order placement response", False, "Missing order in response")
        
        # Test place order with missing fields
        invalid_order = {"symbol": "TCS"}  # Missing required fields
        self.test_endpoint('POST', '/orders/place', 400, data=invalid_order,
                          test_name="Place order with missing fields")
        
        # Test get specific order
        self.test_endpoint('GET', '/orders/ord_1', 200, test_name="Get specific order")
        
        # Test modify order
        modify_data = {
            "quantity": 20,
            "price": 2600.0
        }
        self.test_endpoint('PUT', '/orders/ord_1', 200, data=modify_data,
                          test_name="Modify existing order")
        
        # Test cancel order
        self.test_endpoint('DELETE', '/orders/ord_1', 200, test_name="Cancel order")
        
        # Test get order status
        self.test_endpoint('GET', '/orders/ord_1/status', 200, test_name="Get order status")
        
        # Test non-existent order
        self.test_endpoint('GET', '/orders/non_existent', 404,
                          test_name="Non-existent order handling")
    
    def test_analytics_endpoints(self):
        """Test analytics API endpoints"""
        print("\n📊 Testing Analytics Endpoints")
        print("=" * 50)
        
        # Test performance analytics
        result = self.test_endpoint('GET', '/analytics/performance/port_1', 200,
                                   test_name="Performance analytics")
        if result['success'] and result['data']:
            data = result['data']
            if isinstance(data, dict) and 'performance_metrics' in data:
                self.log_test("Performance metrics structure", True, "Contains performance_metrics")
            else:
                self.log_test("Performance metrics structure", False, "Missing performance_metrics")
        
        # Test performance analytics with parameters
        self.test_endpoint('GET', '/analytics/performance/port_1?period=6M&benchmark=NIFTY100', 200,
                          test_name="Performance analytics with params")
        
        # Test risk analytics
        result = self.test_endpoint('GET', '/analytics/risk/port_1', 200,
                                   test_name="Risk analytics")
        if result['success'] and result['data']:
            data = result['data']
            if isinstance(data, dict) and 'risk_metrics' in data:
                self.log_test("Risk metrics structure", True, "Contains risk_metrics")
            else:
                self.log_test("Risk metrics structure", False, "Missing risk_metrics")
        
        # Test risk analytics with parameters
        self.test_endpoint('GET', '/analytics/risk/port_1?confidence_level=0.99&include_stress_tests=true', 200,
                          test_name="Risk analytics with params")
        
        # Test correlation analysis
        result = self.test_endpoint('GET', '/analytics/correlation/port_1', 200,
                                   test_name="Correlation analysis")
        if result['success'] and result['data']:
            data = result['data']
            if isinstance(data, dict) and 'correlation_matrix' in data:
                self.log_test("Correlation matrix structure", True, "Contains correlation_matrix")
            else:
                self.log_test("Correlation matrix structure", False, "Missing correlation_matrix")
        
        # Test attribution analysis
        result = self.test_endpoint('GET', '/analytics/attribution/port_1', 200,
                                   test_name="Attribution analysis")
        if result['success'] and result['data']:
            data = result['data']
            if isinstance(data, dict) and 'attribution_factors' in data:
                self.log_test("Attribution factors structure", True, "Contains attribution_factors")
            else:
                self.log_test("Attribution factors structure", False, "Missing attribution_factors")
        
        # Test stress test
        stress_scenario = {
            "name": "Market Crash Scenario",
            "market_shock": -20.0,
            "sector_shocks": {
                "IT": -15.0,
                "Banking": -25.0
            }
        }
        
        result = self.test_endpoint('POST', '/analytics/stress-test/port_1', 200, 
                                   data=stress_scenario, test_name="Stress test execution")
        if result['success'] and result['data']:
            data = result['data']
            if isinstance(data, dict) and 'results' in data:
                self.log_test("Stress test results structure", True, "Contains results")
            else:
                self.log_test("Stress test results structure", False, "Missing results")
        
        # Test additional analytics endpoints
        self.test_endpoint('GET', '/analytics/drawdown/port_1', 200, test_name="Drawdown analysis")
        self.test_endpoint('GET', '/analytics/sectors/port_1', 200, test_name="Sector analysis")
    
    def test_error_handling(self):
        """Test error handling and edge cases"""
        print("\n🚨 Testing Error Handling & Edge Cases")
        print("=" * 50)
        
        # Test 404 endpoints
        self.test_endpoint('GET', '/api/v1/nonexistent', 404, test_name="Non-existent endpoint")
        
        # Test malformed requests
        self.test_endpoint('POST', '/orders/place', 400, data={"invalid": "data"},
                          test_name="Malformed order request")
        
        # Test missing parameters
        self.test_endpoint('GET', '/market/historical/RELIANCE', 400,
                          test_name="Historical data without required params")
        
        # Test invalid portfolio ID
        self.test_endpoint('GET', '/portfolio/invalid_id', 404,
                          test_name="Invalid portfolio ID")
        
        # Test invalid order ID
        self.test_endpoint('GET', '/orders/invalid_order_id', 404,
                          test_name="Invalid order ID")
        
        # Test bulk request with too many symbols
        too_many_symbols = ",".join([f"SYM{i}" for i in range(60)])  # More than 50 limit
        self.test_endpoint('GET', f'/market/bulk/ltp?symbols={too_many_symbols}', 400,
                          test_name="Bulk request exceeding limit")
    
    def test_authentication_status(self):
        """Test authentication-related functionality"""
        print("\n🔐 Testing Authentication Status")
        print("=" * 50)
        
        # Check health endpoint for auth status
        result = self.test_endpoint('GET', '/health', 200, test_name="Authentication status check")
        if result['success'] and result['data']:
            data = result['data']
            if isinstance(data, dict):
                auth_status = data.get('authentication_status', False)
                if auth_status:
                    self.log_test("Authentication validation", True, "Authentication is active")
                else:
                    self.log_test("Authentication validation", False, 
                                "Authentication is false (expected with placeholder credentials)")
    
    def run_all_tests(self):
        """Run all test suites"""
        print("🚀 Starting Aladdin Trading Platform Backend Tests")
        print("=" * 60)
        print(f"Backend URL: {BACKEND_URL}")
        print(f"API Base: {API_BASE}")
        print("=" * 60)
        
        start_time = time.time()
        
        # Run all test suites
        self.test_health_endpoints()
        self.test_market_data_endpoints()
        self.test_portfolio_endpoints()
        self.test_order_endpoints()
        self.test_analytics_endpoints()
        self.test_error_handling()
        self.test_authentication_status()
        
        end_time = time.time()
        duration = end_time - start_time
        
        # Print summary
        print("\n" + "=" * 60)
        print("🎯 TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {self.results['passed'] + self.results['failed']}")
        print(f"✅ Passed: {self.results['passed']}")
        print(f"❌ Failed: {self.results['failed']}")
        print(f"⏱️  Duration: {duration:.2f} seconds")
        
        if self.results['failed'] > 0:
            print(f"\n🚨 FAILED TESTS:")
            for error in self.results['errors']:
                print(f"   • {error}")
        
        success_rate = (self.results['passed'] / (self.results['passed'] + self.results['failed'])) * 100
        print(f"\n📊 Success Rate: {success_rate:.1f}%")
        
        if success_rate >= 80:
            print("🎉 Overall Status: GOOD - Most functionality working")
        elif success_rate >= 60:
            print("⚠️  Overall Status: FAIR - Some issues need attention")
        else:
            print("🚨 Overall Status: POOR - Major issues detected")
        
        return self.results

def main():
    """Main test execution"""
    tester = AladdinTester()
    results = tester.run_all_tests()
    
    # Exit with appropriate code
    if results['failed'] == 0:
        sys.exit(0)
    else:
        sys.exit(1)

if __name__ == "__main__":
    main()