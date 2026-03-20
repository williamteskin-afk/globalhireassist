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

        # Test jobs endpoint (should return seeded jobs)
        success, status, data = self.make_request('GET', 'jobs', expected_status=200)
        if success and isinstance(data, list):
            self.log_result("GET /api/jobs - List jobs", True, f"Found {len(data)} jobs")
            if len(data) >= 3:
                # Check if we have expected job titles from seeded data
                job_titles = [job.get('title', '') for job in data]
                expected_jobs = ['Seasonal Farm Worker', 'Hotel Housekeeper', 'Landscaping Crew Member']
                found_jobs = [expected_job for expected_job in expected_jobs if any(expected_job in title for title in job_titles)]
                if found_jobs:
                    self.log_result("GET /api/jobs - Seeded jobs verification", True, f"Found expected jobs: {found_jobs}")
                else:
                    self.log_result("GET /api/jobs - Seeded jobs verification", False, f"Expected jobs not found, got: {job_titles}")
            return data
        else:
            self.log_result("GET /api/jobs - List jobs", False, f"Status: {status}")
            return []

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

    def test_admin_auth_and_jobs(self):
        """Test admin authentication and job creation"""
        print("\n🔍 Testing Admin Authentication and Job Creation...")
        
        # Set the admin session token provided in the review request
        admin_token = "admin_session_1773937338274"
        self.session_token = admin_token
        
        # Test admin auth endpoint
        success, status, data = self.make_request('GET', 'auth/me', expected_status=200)
        if success and data.get('email') == 'globalhireassist@gmail.com' and data.get('is_admin'):
            self.log_result("GET /api/auth/me - Admin authentication", True, f"Admin user: {data.get('email')}")
        else:
            self.log_result("GET /api/auth/me - Admin authentication", False, f"Status: {status}, Data: {data}")
            return
        
        # Test admin stats
        success, status, data = self.make_request('GET', 'admin/stats', expected_status=200)
        if success and 'applications' in data and 'jobs' in data:
            self.log_result("GET /api/admin/stats - Admin stats", True, f"Jobs count: {data.get('jobs', 0)}")
        else:
            self.log_result("GET /api/admin/stats - Admin stats", False, f"Status: {status}")
        
        # Test job creation
        job_data = {
            "title": "Test Software Engineer Position",
            "location": "New York, NY",
            "description": "Test job description for software engineering position. Requires 3+ years experience in Python and FastAPI.",
            "visa_type": "H-2B Non-Agricultural",
            "positions": 2
        }
        
        success, status, data = self.make_request('POST', 'jobs', data=job_data, expected_status=200)
        if success and data.get('id') and data.get('title') == job_data['title']:
            self.log_result("POST /api/jobs - Create job listing", True, f"Job ID: {data.get('id')}")
            return data.get('id')
        else:
            self.log_result("POST /api/jobs - Create job listing", False, f"Status: {status}, Data: {data}")
            return None

    def test_admin_blog_management(self):
        """Test admin blog management features - key focus of iteration 3"""
        print("\n🔍 Testing Admin Blog Management (Iteration 3 Focus)...")
        
        # Set the admin session token provided in the review request
        admin_token = "admin_session_1773937338274"
        self.session_token = admin_token
        
        # Verify admin auth first
        success, status, data = self.make_request('GET', 'auth/me', expected_status=200)
        if not success or not data.get('is_admin'):
            self.log_result("Admin Blog Management - Auth Check", False, "Admin authentication failed")
            return
        
        # Test creating a new blog post
        new_post_data = {
            "title": "Test Blog Post - Automated Testing",
            "content": "This is a test blog post created during automated testing. It should demonstrate all the key features of the blog management system including content creation, category assignment, and metadata handling.",
            "excerpt": "A test blog post to validate the upgraded blog management system with professional card-based editor functionality.",
            "category": "Tips",
            "image_url": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"
        }
        
        success, status, created_post = self.make_request('POST', 'blog', data=new_post_data, expected_status=200)
        if success and created_post.get('id'):
            self.log_result("POST /api/blog - Create new blog post", True, f"Created post ID: {created_post.get('id')}")
            test_post_id = created_post.get('id')
        else:
            self.log_result("POST /api/blog - Create new blog post", False, f"Status: {status}, Data: {created_post}")
            return
        
        # Test updating existing post - specifically post-002 as mentioned in review request
        update_data = {
            "title": "Updated: Top 5 Tips for a Successful Visa Interview - Enhanced Edition",
            "content": "Your visa interview is one of the most critical steps in the visa application process. Here are five essential tips to help you succeed:\n\n1. Prepare Your Documents\nOrganize all required documents in a neat folder. Include your passport, DS-160 confirmation, appointment letter, photo, and supporting financial documents.\n\n2. Dress Professionally\nFirst impressions matter. Dress in business or business-casual attire to show you take the process seriously.\n\n3. Be Honest and Direct\nAnswer questions truthfully and concisely. Don't provide unnecessary information, but don't be evasive either.\n\n4. Know Your Purpose\nBe clear about why you're traveling to the U.S. and what you plan to do there. Have specific details ready.\n\n5. Show Strong Ties to Home\nDemonstrate that you have reasons to return to your home country, such as family, property, or employment.\n\nBonus Tip: Practice common interview questions beforehand and stay calm during the process.",
            "excerpt": "Prepare for your visa interview with these proven strategies from our expert consultants. Updated with bonus tips and enhanced guidance.",
            "category": "Tips", 
            "image_url": "https://images.unsplash.com/photo-1744580389912-e424d67b9749?w=800"
        }
        
        success, status, data = self.make_request('PUT', 'blog/post-002', data=update_data, expected_status=200)
        if success:
            self.log_result("PUT /api/blog/post-002 - Update existing post", True, "Successfully updated post-002")
        else:
            self.log_result("PUT /api/blog/post-002 - Update existing post", False, f"Status: {status}, Data: {data}")
        
        # Test getting the updated post to verify changes
        success, status, updated_post = self.make_request('GET', 'blog/post-002', expected_status=200)
        if success and updated_post.get('title') and 'Updated:' in updated_post.get('title', ''):
            self.log_result("GET /api/blog/post-002 - Verify post update", True, "Post successfully updated with new title")
        else:
            self.log_result("GET /api/blog/post-002 - Verify post update", False, f"Status: {status}, Update not reflected")
        
        # Test updating our newly created post
        test_update_data = {
            "title": "Updated Test Blog Post - Automated Testing Complete",
            "content": new_post_data["content"] + "\n\nThis post has been updated during testing to verify the PUT endpoint functionality.",
            "excerpt": "Updated test post excerpt with additional testing validation content.",
            "category": "News",
            "image_url": new_post_data["image_url"]
        }
        
        success, status, data = self.make_request('PUT', f'blog/{test_post_id}', data=test_update_data, expected_status=200)
        if success:
            self.log_result(f"PUT /api/blog/{test_post_id} - Update created post", True, "Successfully updated test post")
        else:
            self.log_result(f"PUT /api/blog/{test_post_id} - Update created post", False, f"Status: {status}")
        
        # Test deleting the test post we created
        success, status, data = self.make_request('DELETE', f'blog/{test_post_id}', expected_status=200)
        if success:
            self.log_result(f"DELETE /api/blog/{test_post_id} - Delete test post", True, "Successfully deleted test post")
        else:
            self.log_result(f"DELETE /api/blog/{test_post_id} - Delete test post", False, f"Status: {status}")
        
        # Verify deletion by attempting to get the deleted post
        success, status, data = self.make_request('GET', f'blog/{test_post_id}', expected_status=404)
        if success:
            self.log_result(f"GET /api/blog/{test_post_id} - Verify deletion", True, "Correctly returns 404 for deleted post")
        else:
            self.log_result(f"GET /api/blog/{test_post_id} - Verify deletion", False, f"Expected 404, got {status}")
        
        # Clear admin token after testing
        self.session_token = None

    def test_auth_endpoints_without_auth(self):
        """Test auth-protected endpoints should return 401"""
        print("\n🔍 Testing Auth-Protected Endpoints (should fail without auth)...")
        
        # Make sure no token is set
        self.session_token = None
        
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
        self.test_admin_auth_and_jobs()
        
        # Test blog management features - key focus for iteration 3
        self.test_admin_blog_management()
        
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