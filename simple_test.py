#!/usr/bin/env python3
import requests

# Test the exact same logic as the main test
BACKEND_URL = "http://localhost:8001"
API_BASE = f"{BACKEND_URL}/api/v1"

session = requests.Session()
session.headers.update({
    'Content-Type': 'application/json',
    'User-Agent': 'Aladdin-Test-Suite/1.0'
})

def test_endpoint(endpoint):
    url = f"{BACKEND_URL}{endpoint}" if endpoint.startswith('/') else f"{API_BASE}/{endpoint}"
    print(f"Testing: {url}")
    
    response = session.get(url, timeout=30)
    print(f"Status: {response.status_code}")
    
    try:
        response_data = response.json()
        print(f"JSON Response: {response_data}")
    except:
        print(f"Text Response: {response.text}")
    print("-" * 50)

# Test the same endpoints as the main test
test_endpoint("portfolio/")
test_endpoint("market/quote/RELIANCE")