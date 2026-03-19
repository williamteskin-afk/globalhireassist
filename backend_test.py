#!/usr/bin/env python3
"""
Backend API Testing for Global Hire Assist Platform
Tests all backend endpoints with proper error handling and validation.
"""

import requests
import sys
import json
from datetime import datetime
import time
import os

class GlobalHireAPITester:
    def __init__(self, base_url="https://hire-assist-portal.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_base = f"{base_url}/api"
        self.session_token = None
        self.test_user_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        self.passed_tests = []

    def log_result(self, test_name, success, details=""):
        """Log test results"""
        self.tests_run += 1
        status = "✅ PASSED" if success else "❌ FAILED"
        print(f"{status}: {test_name}")
        if details:
            print(f"  Details: {details}")
        
        if success:
            self.tests_passed += 1
            self.passed_tests.append(test_name)
        else:
            self.failed_tests.append({"test": test_name, "details": details})

    def make_request(self, method, endpoint, data=None, headers=None, expected_status=200):
        """Make API request with error handling"""
        url = f"{self.api_base}/{endpoint}"
        req_headers = {'Content-Type': 'application/json'}
        
        if self.session_token:
            req_headers['Authorization'] = f'Bearer {self.session_token}'
        
        if headers:
            req_headers.update(headers)
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=req_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=req_headers, timeout=10)
            elif method == 'PATCH':
                response = requests.patch(url, json=data, headers=req_headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=req_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=req_headers, timeout=10)
            
            success = response.status_code == expected_status
            response_data = {}
            
            try:
                response_data = response.json()
            except:
                response_data = {"raw_response": response.text}
            
            return success, response.status_code, response_data
            
        except Exception as e:
            return False, 0, {"error": str(e)}

    def test_basic_endpoints(self):
        """Test basic public endpoints"""
        print("\n🔍 Testing Basic Public Endpoints...")
        
        # Test blog posts
        success, status, data = self.make_request('GET', 'blog', expected_status=200)
        if success and isinstance(data, list) and len(data) >= 3:
            self.log_result("GET /api/blog - List blog posts", True, f"Found {len(data)} posts")
        else:
            self.log_result("GET /api/blog - List blog posts", False, f"Status: {status}, Data: {data}")

        # Test specific blog post
        success, status, data = self.make_request('GET', 'blog/post-001', expected_status=200)
        if success and data.get('id') == 'post-001':
            self.log_result("GET /api/blog/post-001 - Get specific blog post", True)
        else:
            self.log_result("GET /api/blog/post-001 - Get specific blog post", False, f"Status: {status}")

        # Test jobs endpoint (should return empty list)
        success, status, data = self.make_request('GET', 'jobs', expected_status=200)
        if success and isinstance(data, list):
            self.log_result("GET /api/jobs - List jobs", True, f"Found {len(data)} jobs")
        else:
            self.log_result("GET /api/jobs - List jobs", False, f"Status: {status}")

    def test_application_submission(self):
        """Test application form submission"""
        print("\n🔍 Testing Application Submission...")
        
        app_data = {
            "full_name": f"Test User {datetime.now().strftime('%H%M%S')}",
            "email": f"test.{int(time.time())}@example.com",
            "phone": "+1234567890",
            "visa_type": "h2a-visa",
            "message": "Test application submission"
        }
        
        success, status, data = self.make_request('POST', 'applications', data=app_data, expected_status=200)
        if success and data.get('id'):
            self.log_result("POST /api/applications - Submit application", True, f"Application ID: {data.get('id')}")
            return data.get('id')
        else:
            self.log_result("POST /api/applications - Submit application", False, f"Status: {status}, Data: {data}")
            return None

    def test_contact_submission(self):
        """Test contact form submission"""
        print("\n🔍 Testing Contact Form...")
        
        contact_data = {
            "name": "Test Contact",
            "email": f"contact.{int(time.time())}@example.com",
            "phone": "+1234567890",
            "subject": "Test Inquiry",
            "message": "This is a test contact submission"
        }
        
        success, status, data = self.make_request('POST', 'contact', data=contact_data, expected_status=200)
        if success and data.get('message') == 'Message sent successfully':
            self.log_result("POST /api/contact - Submit contact form", True)
        else:
            self.log_result("POST /api/contact - Submit contact form", False, f"Status: {status}")

    def test_newsletter_subscription(self):
        """Test newsletter subscription"""
        print("\n🔍 Testing Newsletter Subscription...")
        
        newsletter_data = {
            "email": f"newsletter.{int(time.time())}@example.com"
        }
        
        success, status, data = self.make_request('POST', 'newsletter/subscribe', data=newsletter_data, expected_status=200)
        if success and data.get('message') == 'Subscribed successfully':
            self.log_result("POST /api/newsletter/subscribe - Newsletter signup", True)
        else:
            self.log_result("POST /api/newsletter/subscribe - Newsletter signup", False, f"Status: {status}")

    def test_employer_registration(self):
        """Test employer registration"""
        print("\n🔍 Testing Employer Registration...")
        
        employer_data = {
            "company_name": "Test Company Inc",
            "contact_person": "John Doe",
            "email": f"employer.{int(time.time())}@company.com",
            "phone": "+1234567890",
            "industry": "Agriculture",
            "workers_needed": 10,
            "job_description": "Seasonal farm workers needed"
        }
        
        success, status, data = self.make_request('POST', 'employers/register', data=employer_data, expected_status=200)
        if success and data.get('message') == 'Registration submitted':
            self.log_result("POST /api/employers/register - Employer registration", True, f"ID: {data.get('id')}")
        else:
            self.log_result("POST /api/employers/register - Employer registration", False, f"Status: {status}")

    def test_stripe_checkout(self):
        """Test Stripe payment checkout creation"""
        print("\n🔍 Testing Stripe Checkout...")
        
        payment_data = {
            "package_id": "consultation",
            "origin_url": self.base_url
        }
        
        success, status, data = self.make_request('POST', 'payments/checkout', data=payment_data, expected_status=200)
        if success and data.get('url') and data.get('session_id'):
            self.log_result("POST /api/payments/checkout - Create Stripe session", True, f"Session: {data.get('session_id')}")
            return data.get('session_id')
        else:
            self.log_result("POST /api/payments/checkout - Create Stripe session", False, f"Status: {status}, Data: {data}")
            return None

    def test_auth_endpoints_without_auth(self):
        """Test auth-protected endpoints should return 401"""
        print("\n🔍 Testing Auth-Protected Endpoints (should fail without auth)...")
        
        # These should all return 401 without authentication
        protected_endpoints = [
            ('GET', 'auth/me'),
            ('GET', 'applications'),
            ('GET', 'admin/stats'),
            ('GET', 'payments'),
            ('GET', 'contact'),
            ('GET', 'employers'),
            ('GET', 'newsletter/subscribers'),
        ]
        
        for method, endpoint in protected_endpoints:
            success, status, data = self.make_request(method, endpoint, expected_status=401)
            if success:
                self.log_result(f"{method} /api/{endpoint} - Auth protection", True, "Correctly returns 401")
            else:
                self.log_result(f"{method} /api/{endpoint} - Auth protection", False, f"Expected 401, got {status}")

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting Global Hire Assist Backend API Testing")
        print(f"🔗 Base URL: {self.base_url}")
        print(f"🔗 API Base: {self.api_base}")
        
        # Test basic functionality
        self.test_basic_endpoints()
        self.test_application_submission()
        self.test_contact_submission()
        self.test_newsletter_subscription()
        self.test_employer_registration()
        self.test_stripe_checkout()
        self.test_auth_endpoints_without_auth()
        
        # Print summary
        print("\n" + "="*60)
        print("📊 BACKEND TESTING SUMMARY")
        print("="*60)
        print(f"Total Tests: {self.tests_run}")
        print(f"Passed: {self.tests_passed}")
        print(f"Failed: {len(self.failed_tests)}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        if self.failed_tests:
            print("\n❌ FAILED TESTS:")
            for fail in self.failed_tests:
                print(f"  - {fail['test']}: {fail['details']}")
        
        return {
            "total": self.tests_run,
            "passed": self.tests_passed,
            "failed": len(self.failed_tests),
            "failed_tests": self.failed_tests,
            "passed_tests": self.passed_tests,
            "success_rate": round(self.tests_passed/self.tests_run*100, 1) if self.tests_run > 0 else 0
        }

def main():
    tester = GlobalHireAPITester()
    results = tester.run_all_tests()
    
    # Return appropriate exit code
    return 0 if results["failed"] == 0 else 1

if __name__ == "__main__":
    sys.exit(main())