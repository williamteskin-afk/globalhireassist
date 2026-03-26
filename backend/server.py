from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict
import uuid
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
import jwt
from emergentintegrations.payments.stripe.checkout import StripeCheckout, CheckoutSessionResponse, CheckoutStatusResponse, CheckoutSessionRequest
from twilio.rest import Client

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT and Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()
JWT_SECRET = os.environ.get('JWT_SECRET')
JWT_ALGORITHM = os.environ.get('JWT_ALGORITHM', 'HS256')
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get('ACCESS_TOKEN_EXPIRE_MINUTES', 1440))

# Twilio client
twilio_client = Client(
    os.environ.get('TWILIO_ACCOUNT_SID'),
    os.environ.get('TWILIO_AUTH_TOKEN')
)
TWILIO_PHONE_NUMBER = os.environ.get('TWILIO_PHONE_NUMBER')

app = FastAPI()
api_router = APIRouter(prefix="/api")

# Models
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    full_name: str
    role: str = "admin"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ApplicationCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    visa_type: str
    country: Optional[str] = None
    additional_info: Optional[str] = None

class Application(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    full_name: str
    email: EmailStr
    phone: str
    visa_type: str
    country: Optional[str] = None
    additional_info: Optional[str] = None
    status: str = "pending"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ApplicationUpdate(BaseModel):
    status: str

class EmployerCreate(BaseModel):
    company_name: str
    contact_person: str
    email: EmailStr
    phone: str
    job_details: Optional[str] = None

class Employer(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    company_name: str
    contact_person: str
    email: EmailStr
    phone: str
    job_details: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class BlogPostCreate(BaseModel):
    title: str
    content: str
    category: str
    author: str

class BlogPost(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    content: str
    category: str
    author: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactForm(BaseModel):
    name: str
    email: EmailStr
    message: str

class PaymentTransaction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    amount: float
    currency: str
    payment_status: str
    status: str
    metadata: Optional[Dict] = None
    user_email: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CheckoutRequest(BaseModel):
    package_id: str
    origin_url: str
    user_email: Optional[str] = None
    metadata: Optional[Dict] = None

class Testimonial(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    country: str
    visa_type: str
    message: str
    avatar_seed: int
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Helper functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt

async def send_sms(phone_number: str, message: str):
    """Send SMS notification using Twilio"""
    try:
        # Format phone number to E.164 format if not already
        if not phone_number.startswith('+'):
            phone_number = f'+{phone_number}'
        
        # Don't send if it's the same as Twilio number (for testing purposes)
        if phone_number == TWILIO_PHONE_NUMBER:
            logger.info(f"Skipping SMS to Twilio number itself: {phone_number}")
            return True
        
        message_sent = twilio_client.messages.create(
            body=message,
            from_=TWILIO_PHONE_NUMBER,
            to=phone_number
        )
        logger.info(f"SMS sent successfully to {phone_number}: {message_sent.sid}")
        return True
    except Exception as e:
        logger.error(f"Failed to send SMS to {phone_number}: {str(e)}")
        return False

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        user = await db.users.find_one({"id": user_id}, {"_id": 0})
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")

# Payment packages
PACKAGES = {
    "basic_application": {"amount": 50.0, "name": "Basic Application Fee"},
    "premium_support": {"amount": 25.0, "name": "Premium Support Monthly"},
    "express_processing": {"amount": 100.0, "name": "Express Processing"}
}

# Auth routes
@api_router.post("/auth/register")
async def register(user_data: UserCreate):
    existing_user = await db.users.find_one({"email": user_data.email}, {"_id": 0})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user_data.password)
    user = User(email=user_data.email, full_name=user_data.full_name)
    user_dict = user.model_dump()
    user_dict['timestamp'] = user_dict.pop('created_at').isoformat()
    user_dict['hashed_password'] = hashed_password
    
    await db.users.insert_one(user_dict)
    return {"message": "User registered successfully", "user": {"email": user.email, "full_name": user.full_name}}

@api_router.post("/auth/login")
async def login(user_data: UserLogin):
    user = await db.users.find_one({"email": user_data.email}, {"_id": 0})
    if not user or not verify_password(user_data.password, user['hashed_password']):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    access_token = create_access_token(data={"sub": user['id']})
    return {"access_token": access_token, "token_type": "bearer", "user": {"email": user['email'], "full_name": user['full_name'], "role": user['role']}}

@api_router.get("/auth/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return {"email": current_user['email'], "full_name": current_user['full_name'], "role": current_user['role']}

# Application routes
@api_router.post("/applications", response_model=Application)
async def create_application(app_data: ApplicationCreate):
    application = Application(**app_data.model_dump())
    app_dict = application.model_dump()
    app_dict['created_at'] = app_dict['created_at'].isoformat()
    app_dict['updated_at'] = app_dict['updated_at'].isoformat()
    
    await db.applications.insert_one(app_dict)
    
    # Send SMS notification
    sms_message = f"Hello {application.full_name}! Your visa application (ID: {application.id[:8]}) has been received by Global Hire Assist. We'll review your documents and contact you soon. Track status at globalhireassist.com"
    await send_sms(application.phone, sms_message)
    
    return application

@api_router.get("/applications", response_model=List[Application])
async def get_applications(current_user: dict = Depends(get_current_user)):
    applications = await db.applications.find({}, {"_id": 0}).to_list(1000)
    for app in applications:
        if isinstance(app['created_at'], str):
            app['created_at'] = datetime.fromisoformat(app['created_at'])
        if isinstance(app['updated_at'], str):
            app['updated_at'] = datetime.fromisoformat(app['updated_at'])
    return applications

@api_router.put("/applications/{application_id}")
async def update_application(application_id: str, update_data: ApplicationUpdate, current_user: dict = Depends(get_current_user)):
    # Get application details first
    application = await db.applications.find_one({"id": application_id}, {"_id": 0})
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    result = await db.applications.update_one(
        {"id": application_id},
        {"$set": {"status": update_data.status, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Send SMS notification about status change
    status_messages = {
        "approved": f"Great news {application['full_name']}! Your visa application has been APPROVED. Check your email for next steps. - Global Hire Assist",
        "rejected": f"Hello {application['full_name']}, unfortunately your visa application was not approved. Please contact us for details. - Global Hire Assist",
        "processing": f"Hi {application['full_name']}, your visa application is now being processed. We'll keep you updated. - Global Hire Assist",
        "pending": f"Hello {application['full_name']}, your application status has been updated to pending review. - Global Hire Assist"
    }
    
    if update_data.status in status_messages:
        await send_sms(application['phone'], status_messages[update_data.status])
    
    return {"message": "Application updated successfully"}

# Employer routes
@api_router.post("/employers", response_model=Employer)
async def create_employer(employer_data: EmployerCreate):
    employer = Employer(**employer_data.model_dump())
    emp_dict = employer.model_dump()
    emp_dict['created_at'] = emp_dict['created_at'].isoformat()
    
    await db.employers.insert_one(emp_dict)
    return employer

@api_router.get("/employers", response_model=List[Employer])
async def get_employers(current_user: dict = Depends(get_current_user)):
    employers = await db.employers.find({}, {"_id": 0}).to_list(1000)
    for emp in employers:
        if isinstance(emp['created_at'], str):
            emp['created_at'] = datetime.fromisoformat(emp['created_at'])
    return employers

# Blog routes
@api_router.post("/blog", response_model=BlogPost)
async def create_blog_post(post_data: BlogPostCreate, current_user: dict = Depends(get_current_user)):
    blog_post = BlogPost(**post_data.model_dump())
    post_dict = blog_post.model_dump()
    post_dict['created_at'] = post_dict['created_at'].isoformat()
    
    await db.blog_posts.insert_one(post_dict)
    return blog_post

@api_router.get("/blog", response_model=List[BlogPost])
async def get_blog_posts():
    posts = await db.blog_posts.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    for post in posts:
        if isinstance(post['created_at'], str):
            post['created_at'] = datetime.fromisoformat(post['created_at'])
    return posts

@api_router.delete("/blog/{post_id}")
async def delete_blog_post(post_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.blog_posts.delete_one({"id": post_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return {"message": "Blog post deleted successfully"}

# Contact form
@api_router.post("/contact")
async def submit_contact_form(contact_data: ContactForm):
    contact_dict = contact_data.model_dump()
    contact_dict['id'] = str(uuid.uuid4())
    contact_dict['created_at'] = datetime.now(timezone.utc).isoformat()
    
    await db.contacts.insert_one(contact_dict)
    return {"message": "Contact form submitted successfully"}

# Payment routes
@api_router.post("/payments/checkout")
async def create_checkout(checkout_data: CheckoutRequest):
    if checkout_data.package_id not in PACKAGES:
        raise HTTPException(status_code=400, detail="Invalid package")
    
    package = PACKAGES[checkout_data.package_id]
    amount = package["amount"]
    
    success_url = f"{checkout_data.origin_url}/payment-success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{checkout_data.origin_url}/apply"
    
    stripe_api_key = os.environ.get('STRIPE_API_KEY')
    webhook_url = f"{checkout_data.origin_url}/api/webhook/stripe"
    
    stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url=webhook_url)
    
    metadata = checkout_data.metadata or {}
    metadata['package_id'] = checkout_data.package_id
    metadata['package_name'] = package['name']
    
    checkout_request = CheckoutSessionRequest(
        amount=amount,
        currency="usd",
        success_url=success_url,
        cancel_url=cancel_url,
        metadata=metadata
    )
    
    session = await stripe_checkout.create_checkout_session(checkout_request)
    
    # Create payment transaction record
    transaction = PaymentTransaction(
        session_id=session.session_id,
        amount=amount,
        currency="usd",
        payment_status="pending",
        status="initiated",
        metadata=metadata,
        user_email=checkout_data.user_email
    )
    trans_dict = transaction.model_dump()
    trans_dict['created_at'] = trans_dict['created_at'].isoformat()
    trans_dict['updated_at'] = trans_dict['updated_at'].isoformat()
    
    await db.payment_transactions.insert_one(trans_dict)
    
    return {"url": session.url, "session_id": session.session_id}

@api_router.get("/payments/status/{session_id}")
async def get_payment_status(session_id: str):
    stripe_api_key = os.environ.get('STRIPE_API_KEY')
    stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url="")
    
    checkout_status = await stripe_checkout.get_checkout_status(session_id)
    
    # Update transaction in database
    existing_transaction = await db.payment_transactions.find_one({"session_id": session_id}, {"_id": 0})
    
    if existing_transaction and existing_transaction['payment_status'] != checkout_status.payment_status:
        await db.payment_transactions.update_one(
            {"session_id": session_id},
            {"$set": {
                "payment_status": checkout_status.payment_status,
                "status": checkout_status.status,
                "updated_at": datetime.now(timezone.utc).isoformat()
            }}
        )
        
        # Send SMS on successful payment
        if checkout_status.payment_status == "paid" and existing_transaction.get('user_email'):
            # Get application details
            app_id = existing_transaction.get('metadata', {}).get('application_id')
            if app_id:
                application = await db.applications.find_one({"id": app_id}, {"_id": 0})
                if application:
                    sms_message = f"Payment received! Thank you {application['full_name']}. Your ${checkout_status.amount_total / 100:.2f} payment was successful. Your visa application is now being processed. - Global Hire Assist"
                    await send_sms(application['phone'], sms_message)
    
    return {
        "session_id": session_id,
        "status": checkout_status.status,
        "payment_status": checkout_status.payment_status,
        "amount": checkout_status.amount_total / 100.0,
        "currency": checkout_status.currency
    }

@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    body = await request.body()
    signature = request.headers.get("Stripe-Signature")
    
    stripe_api_key = os.environ.get('STRIPE_API_KEY')
    stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url="")
    
    try:
        webhook_response = await stripe_checkout.handle_webhook(body, signature)
        
        # Update payment transaction
        await db.payment_transactions.update_one(
            {"session_id": webhook_response.session_id},
            {"$set": {
                "payment_status": webhook_response.payment_status,
                "updated_at": datetime.now(timezone.utc).isoformat()
            }}
        )
        
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Testimonials routes
@api_router.post("/testimonials", response_model=Testimonial)
async def create_testimonial(test_data: Testimonial):
    test_dict = test_data.model_dump()
    test_dict['created_at'] = test_dict['created_at'].isoformat()
    await db.testimonials.insert_one(test_dict)
    return test_data

@api_router.get("/testimonials", response_model=List[Testimonial])
async def get_testimonials():
    testimonials = await db.testimonials.find({}, {"_id": 0}).to_list(100)
    for test in testimonials:
        if isinstance(test['created_at'], str):
            test['created_at'] = datetime.fromisoformat(test['created_at'])
    return testimonials

# Dashboard stats
@api_router.get("/dashboard/stats")
async def get_dashboard_stats(current_user: dict = Depends(get_current_user)):
    total_applications = await db.applications.count_documents({})
    pending_applications = await db.applications.count_documents({"status": "pending"})
    approved_applications = await db.applications.count_documents({"status": "approved"})
    total_employers = await db.employers.count_documents({})
    total_payments = await db.payment_transactions.count_documents({"payment_status": "paid"})
    
    # Calculate total revenue
    paid_transactions = await db.payment_transactions.find({"payment_status": "paid"}, {"_id": 0}).to_list(1000)
    total_revenue = sum(trans['amount'] for trans in paid_transactions)
    
    return {
        "total_applications": total_applications,
        "pending_applications": pending_applications,
        "approved_applications": approved_applications,
        "total_employers": total_employers,
        "total_payments": total_payments,
        "total_revenue": total_revenue
    }

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()