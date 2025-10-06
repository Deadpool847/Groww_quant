#!/usr/bin/env python3
import requests

BACKEND_URL = "http://localhost:8001"
API_BASE = f"{BACKEND_URL}/api/v1"

def test_endpoint(endpoint):
    url = f"{BACKEND_URL}{endpoint}" if endpoint.startswith('/') else f"{API_BASE}/{endpoint}"
    print(f"Testing: {url}")
    
    try:
        response = requests.get(url, timeout=30)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            print(f"Response: {response.json()}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Exception: {e}")
    print("-" * 50)

# Test endpoints
test_endpoint("portfolio/")
test_endpoint("orders/")
test_endpoint("market/quote/RELIANCE")
test_endpoint("analytics/performance/port_1")