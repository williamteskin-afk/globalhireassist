import requests
import sys
import json
from datetime import datetime

class GlobalHireAssistAPITester:
    def __init__(self, base_url="https://work-sponsor.preview.emergentagent.com"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        self.session = requests.Session()

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        
        if headers:
            test_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = self.session.get(url, headers=test_headers, timeout=30)
            elif method == 'POST':
                response = self.session.post(url, json=data, headers=test_headers, timeout=30)
            elif method == 'PUT':
                response = self.session.put(url, json=data, headers=test_headers, timeout=30)
            elif method == 'DELETE':
                response = self.session.delete(url, headers=test_headers, timeout=30)

            print(f"   Status: {response.status_code}")
            
            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json() if response.content else {}
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_detail = response.json()
                    print(f"   Error: {error_detail}")
                except:
                    print(f"   Error: {response.text}")
                self.failed_tests.append({
                    'test': name,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'endpoint': endpoint
                })
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                'test': name,
                'error': str(e),
                'endpoint': endpoint
            })
            return False, {}

    def test_admin_registration(self):
        """Test admin user registration"""
        admin_data = {
            "email": "admin@globalhire.com",
            "password": "admin123",
            "full_name": "Admin User"
        }
        success, response = self.run_test(
            "Admin Registration",
            "POST",
            "auth/register",
            200,
            data=admin_data
        )
        return success

    def test_admin_login(self):
        """Test admin login and get token"""
        login_data = {
            "email": "admin@globalhire.com",
            "password": "admin123"
        }
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "auth/login",
            200,
            data=login_data
        )
        if success and 'access_token' in response:
            self.token = response['access_token']
            print(f"   Token obtained: {self.token[:20]}...")
            return True
        return False

    def test_get_current_user(self):
        """Test getting current user info"""
        success, response = self.run_test(
            "Get Current User",
            "GET",
            "auth/me",
            200
        )
        return success

    def test_create_application(self):
        """Test creating a visa application"""
        app_data = {
            "full_name": "John Test Applicant",
            "email": "john.test@example.com",
            "phone": "+1234567890",
            "visa_type": "work-visa",
            "country": "Mexico",
            "additional_info": "Test application for work visa"
        }
        success, response = self.run_test(
            "Create Application",
            "POST",
            "applications",
            200,
            data=app_data
        )
        if success and 'id' in response:
            self.application_id = response['id']
            return True
        return False

    def test_get_applications(self):
        """Test getting all applications (admin only)"""
        success, response = self.run_test(
            "Get Applications",
            "GET",
            "applications",
            200
        )
        return success

    def test_update_application_status(self):
        """Test updating application status"""
        if not hasattr(self, 'application_id'):
            print("❌ Skipping - No application ID available")
            return False
            
        update_data = {"status": "approved"}
        success, response = self.run_test(
            "Update Application Status",
            "PUT",
            f"applications/{self.application_id}",
            200,
            data=update_data
        )
        return success

    def test_create_employer(self):
        """Test creating an employer registration"""
        employer_data = {
            "company_name": "Test Company Inc",
            "contact_person": "Jane Employer",
            "email": "jane@testcompany.com",
            "phone": "+1987654321",
            "job_details": "Looking for skilled workers"
        }
        success, response = self.run_test(
            "Create Employer",
            "POST",
            "employers",
            200,
            data=employer_data
        )
        return success

    def test_get_employers(self):
        """Test getting all employers (admin only)"""
        success, response = self.run_test(
            "Get Employers",
            "GET",
            "employers",
            200
        )
        return success

    def test_submit_contact_form(self):
        """Test contact form submission"""
        contact_data = {
            "name": "Test Contact",
            "email": "test@example.com",
            "message": "This is a test contact message"
        }
        success, response = self.run_test(
            "Submit Contact Form",
            "POST",
            "contact",
            200,
            data=contact_data
        )
        return success

    def test_create_checkout_session(self):
        """Test creating Stripe checkout session"""
        checkout_data = {
            "package_id": "basic_application",
            "origin_url": "https://work-sponsor.preview.emergentagent.com",
            "user_email": "john.test@example.com",
            "metadata": {
                "application_id": getattr(self, 'application_id', 'test-id'),
                "full_name": "John Test Applicant"
            }
        }
        success, response = self.run_test(
            "Create Checkout Session",
            "POST",
            "payments/checkout",
            200,
            data=checkout_data
        )
        if success and 'session_id' in response:
            self.session_id = response['session_id']
            return True
        return False

    def test_get_payment_status(self):
        """Test getting payment status"""
        if not hasattr(self, 'session_id'):
            print("❌ Skipping - No session ID available")
            return False
            
        success, response = self.run_test(
            "Get Payment Status",
            "GET",
            f"payments/status/{self.session_id}",
            200
        )
        return success

    def test_get_testimonials(self):
        """Test getting testimonials"""
        success, response = self.run_test(
            "Get Testimonials",
            "GET",
            "testimonials",
            200
        )
        return success

    def test_create_blog_post(self):
        """Test creating a blog post (admin only)"""
        blog_data = {
            "title": "Test Blog Post",
            "content": "This is a test blog post content",
            "category": "visa-tips",
            "author": "Admin User"
        }
        success, response = self.run_test(
            "Create Blog Post",
            "POST",
            "blog",
            200,
            data=blog_data
        )
        if success and 'id' in response:
            self.blog_post_id = response['id']
            return True
        return False

    def test_get_blog_posts(self):
        """Test getting all blog posts"""
        success, response = self.run_test(
            "Get Blog Posts",
            "GET",
            "blog",
            200
        )
        return success

    def test_delete_blog_post(self):
        """Test deleting a blog post (admin only)"""
        if not hasattr(self, 'blog_post_id'):
            print("❌ Skipping - No blog post ID available")
            return False
            
        success, response = self.run_test(
            "Delete Blog Post",
            "DELETE",
            f"blog/{self.blog_post_id}",
            200
        )
        return success

    def test_get_dashboard_stats(self):
        """Test getting dashboard statistics (admin only)"""
        success, response = self.run_test(
            "Get Dashboard Stats",
            "GET",
            "dashboard/stats",
            200
        )
        return success

def main():
    print("🚀 Starting Global Hire Assist API Testing...")
    print("=" * 60)
    
    tester = GlobalHireAssistAPITester()
    
    # Test sequence
    test_results = []
    
    # 1. Test admin registration (might fail if already exists)
    print("\n📝 AUTHENTICATION TESTS")
    print("-" * 30)
    tester.test_admin_registration()  # May fail if user exists, that's OK
    
    # 2. Test admin login
    if not tester.test_admin_login():
        print("❌ Admin login failed, stopping tests")
        return 1
    
    # 3. Test getting current user
    tester.test_get_current_user()
    
    # 4. Test application flow
    print("\n📋 APPLICATION TESTS")
    print("-" * 30)
    tester.test_create_application()
    tester.test_get_applications()
    tester.test_update_application_status()
    
    # 5. Test employer registration
    print("\n🏢 EMPLOYER TESTS")
    print("-" * 30)
    tester.test_create_employer()
    tester.test_get_employers()
    
    # 6. Test contact form
    print("\n📞 CONTACT TESTS")
    print("-" * 30)
    tester.test_submit_contact_form()
    
    # 7. Test payment flow
    print("\n💳 PAYMENT TESTS")
    print("-" * 30)
    tester.test_create_checkout_session()
    tester.test_get_payment_status()
    
    # 8. Test blog functionality
    print("\n📝 BLOG TESTS")
    print("-" * 30)
    tester.test_create_blog_post()
    tester.test_get_blog_posts()
    tester.test_delete_blog_post()
    
    # 9. Test testimonials
    print("\n⭐ TESTIMONIAL TESTS")
    print("-" * 30)
    tester.test_get_testimonials()
    
    # 10. Test dashboard
    print("\n📊 DASHBOARD TESTS")
    print("-" * 30)
    tester.test_get_dashboard_stats()
    
    # Print final results
    print("\n" + "=" * 60)
    print("📊 FINAL TEST RESULTS")
    print("=" * 60)
    print(f"Tests run: {tester.tests_run}")
    print(f"Tests passed: {tester.tests_passed}")
    print(f"Tests failed: {len(tester.failed_tests)}")
    print(f"Success rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    if tester.failed_tests:
        print("\n❌ FAILED TESTS:")
        for failure in tester.failed_tests:
            error_msg = failure.get('error', f"Expected {failure.get('expected')}, got {failure.get('actual')}")
            print(f"  - {failure['test']}: {error_msg}")
    
    return 0 if len(tester.failed_tests) == 0 else 1

if __name__ == "__main__":
    sys.exit(main())