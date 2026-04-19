import requests

url = "http://localhost:8000/api/auth/register"
payload = {
    "name": "Test User",
    "email": "testuser" + str(__import__('time').time()) + "@example.com",
    "phone": "+91 9999999999",
    "city": "Mumbai",
    "country": "India",
    "password": "password123"
}

try:
    response = requests.post(url, json=payload)
    print("Status Code:", response.status_code)
    print("Response JSON:", response.json())
except Exception as e:
    print("Request failed:", e)
