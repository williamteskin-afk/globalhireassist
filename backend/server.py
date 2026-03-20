from fastapi import FastAPI, APIRouter, HTTPException, Request, Response
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import httpx
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
from emergentintegrations.payments.stripe.checkout import (
    StripeCheckout, CheckoutSessionRequest
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

stripe_api_key = os.environ.get('STRIPE_API_KEY', '')
ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', 'globalhireassist@gmail.com')

SERVICE_PACKAGES = {
    "consultation": {"name": "Visa Consultation", "amount": 75.00, "currency": "usd"},
    "processing": {"name": "Application Processing", "amount": 150.00, "currency": "usd"},
    "premium_membership": {"name": "Premium Monthly Support", "amount": 25.00, "currency": "usd"},
}

app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# --- Models ---
class ApplicationCreate(BaseModel):
    full_name: str
    email: str
    phone: str
    visa_type: str
    message: Optional[str] = ""

class BlogPostCreate(BaseModel):
    title: str
    content: str
    excerpt: Optional[str] = ""
    category: Optional[str] = ""
    image_url: Optional[str] = ""

class ContactCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = ""
    subject: Optional[str] = ""
    message: str

class EmployerCreate(BaseModel):
    company_name: str
    contact_person: str
    email: str
    phone: str
    industry: str
    workers_needed: int = 1
    job_description: Optional[str] = ""

class JobListingCreate(BaseModel):
    employer_id: Optional[str] = ""
    title: str
    location: str
    description: str
    visa_type: str
    positions: int = 1

class NewsletterSubscribe(BaseModel):
    email: str

class PaymentRequest(BaseModel):
    package_id: str
    origin_url: str

class StatusUpdateRequest(BaseModel):
    status: str

# --- Auth Helpers ---
async def get_current_user(request: Request):
    session_token = request.cookies.get("session_token")
    if not session_token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            session_token = auth_header[7:]
    if not session_token:
        return None
    session = await db.user_sessions.find_one({"session_token": session_token}, {"_id": 0})
    if not session:
        return None
    expires_at = session.get("expires_at")
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at and expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at and expires_at < datetime.now(timezone.utc):
        return None
    user = await db.users.find_one({"user_id": session["user_id"]}, {"_id": 0})
    return user

async def require_user(request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user

async def require_admin(request: Request):
    user = await require_user(request)
    if user.get("email") != ADMIN_EMAIL:
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

# --- Auth Routes ---
@api_router.post("/auth/session")
async def exchange_session(request: Request, response: Response):
    body = await request.json()
    session_id = body.get("session_id")
    if not session_id:
        raise HTTPException(status_code=400, detail="session_id required")
    async with httpx.AsyncClient() as http:
        resp = await http.get(
            "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
            headers={"X-Session-ID": session_id}
        )
        if resp.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid session")
        data = resp.json()
    email = data["email"]
    name = data.get("name", "")
    picture = data.get("picture", "")
    session_token = data.get("session_token", str(uuid.uuid4()))
    existing = await db.users.find_one({"email": email}, {"_id": 0})
    if existing:
        user_id = existing["user_id"]
        await db.users.update_one({"email": email}, {"$set": {"name": name, "picture": picture}})
    else:
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        await db.users.insert_one({
            "user_id": user_id,
            "email": email,
            "name": name,
            "picture": picture,
            "created_at": datetime.now(timezone.utc).isoformat()
        })
    await db.user_sessions.insert_one({
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": (datetime.now(timezone.utc) + timedelta(days=7)).isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    is_admin = email == ADMIN_EMAIL
    response.set_cookie(
        key="session_token", value=session_token,
        httponly=True, secure=True, samesite="none", path="/", max_age=7*24*3600
    )
    return {"user_id": user_id, "email": email, "name": name, "picture": picture, "is_admin": is_admin}

@api_router.get("/auth/me")
async def get_me(request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    user["is_admin"] = user.get("email") == ADMIN_EMAIL
    return user

@api_router.post("/auth/logout")
async def logout(request: Request, response: Response):
    session_token = request.cookies.get("session_token")
    if session_token:
        await db.user_sessions.delete_one({"session_token": session_token})
    response.delete_cookie("session_token", path="/", secure=True, samesite="none")
    return {"message": "Logged out"}

# --- Application Routes ---
@api_router.post("/applications")
async def create_application(data: ApplicationCreate, request: Request):
    user = await get_current_user(request)
    app_id = str(uuid.uuid4())[:8]
    doc = {
        "id": app_id, **data.model_dump(),
        "user_id": user.get("user_id", "") if user else "",
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.applications.insert_one(doc)
    doc.pop("_id", None)
    return doc

@api_router.get("/applications")
async def list_applications(request: Request):
    await require_admin(request)
    apps = await db.applications.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return apps

@api_router.patch("/applications/{app_id}/status")
async def update_application_status(app_id: str, data: StatusUpdateRequest, request: Request):
    await require_admin(request)
    result = await db.applications.update_one({"id": app_id}, {"$set": {"status": data.status}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Application not found")
    try:
        app_doc = await db.applications.find_one({"id": app_id}, {"_id": 0})
        if app_doc and app_doc.get("phone"):
            await send_sms_notification(
                app_doc["phone"],
                f"Global Hire Assist: Your visa application status has been updated to '{data.status}'."
            )
    except Exception as e:
        logger.warning(f"SMS notification failed: {e}")
    return {"message": "Status updated", "status": data.status}

@api_router.get("/my/applications")
async def get_my_applications(request: Request):
    user = await require_user(request)
    apps = await db.applications.find({"email": user["email"]}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return apps

# --- Payment Routes ---
@api_router.post("/payments/checkout")
async def create_checkout(data: PaymentRequest, request: Request):
    if data.package_id not in SERVICE_PACKAGES:
        raise HTTPException(status_code=400, detail="Invalid package")
    package = SERVICE_PACKAGES[data.package_id]
    origin_url = data.origin_url
    success_url = f"{origin_url}/payment/success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{origin_url}/membership"
    webhook_url = f"{str(request.base_url)}api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url=webhook_url)
    checkout_request = CheckoutSessionRequest(
        amount=package["amount"], currency=package["currency"],
        success_url=success_url, cancel_url=cancel_url,
        metadata={"package_id": data.package_id, "package_name": package["name"]}
    )
    session = await stripe_checkout.create_checkout_session(checkout_request)
    user = await get_current_user(request)
    await db.payment_transactions.insert_one({
        "id": str(uuid.uuid4())[:8], "session_id": session.session_id,
        "package_id": data.package_id, "package_name": package["name"],
        "amount": package["amount"], "currency": package["currency"],
        "user_email": user.get("email", "") if user else "",
        "payment_status": "initiated", "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    return {"url": session.url, "session_id": session.session_id}

@api_router.get("/payments/status/{session_id}")
async def get_payment_status(session_id: str, request: Request):
    webhook_url = f"{str(request.base_url)}api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url=webhook_url)
    checkout_status = await stripe_checkout.get_checkout_status(session_id)
    existing = await db.payment_transactions.find_one({"session_id": session_id}, {"_id": 0})
    if existing and existing.get("payment_status") != "paid":
        await db.payment_transactions.update_one(
            {"session_id": session_id},
            {"$set": {"payment_status": checkout_status.payment_status, "status": checkout_status.status, "updated_at": datetime.now(timezone.utc).isoformat()}}
        )
    return {"status": checkout_status.status, "payment_status": checkout_status.payment_status, "amount_total": checkout_status.amount_total, "currency": checkout_status.currency}

@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    body = await request.body()
    signature = request.headers.get("Stripe-Signature", "")
    try:
        webhook_url = f"{str(request.base_url)}api/webhook/stripe"
        stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url=webhook_url)
        webhook_response = await stripe_checkout.handle_webhook(body, signature)
        if webhook_response.session_id:
            await db.payment_transactions.update_one(
                {"session_id": webhook_response.session_id},
                {"$set": {"payment_status": webhook_response.payment_status, "status": webhook_response.event_type, "updated_at": datetime.now(timezone.utc).isoformat()}}
            )
        return {"status": "ok"}
    except Exception as e:
        logger.error(f"Webhook error: {e}")
        return {"status": "error"}

@api_router.get("/payments")
async def list_payments(request: Request):
    await require_admin(request)
    return await db.payment_transactions.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)

# --- Blog Routes ---
@api_router.get("/blog")
async def list_blog_posts():
    return await db.blog_posts.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)

@api_router.get("/blog/{post_id}")
async def get_blog_post(post_id: str):
    post = await db.blog_posts.find_one({"id": post_id}, {"_id": 0})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@api_router.post("/blog")
async def create_blog_post(data: BlogPostCreate, request: Request):
    user = await require_admin(request)
    post_id = str(uuid.uuid4())[:8]
    doc = {"id": post_id, **data.model_dump(), "author": user.get("name", "Admin"), "created_at": datetime.now(timezone.utc).isoformat()}
    await db.blog_posts.insert_one(doc)
    doc.pop("_id", None)
    return doc

@api_router.put("/blog/{post_id}")
async def update_blog_post(post_id: str, data: BlogPostCreate, request: Request):
    await require_admin(request)
    result = await db.blog_posts.update_one({"id": post_id}, {"$set": data.model_dump()})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")
    return {"message": "Updated"}

@api_router.delete("/blog/{post_id}")
async def delete_blog_post(post_id: str, request: Request):
    await require_admin(request)
    result = await db.blog_posts.delete_one({"id": post_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")
    return {"message": "Deleted"}

# --- Contact Routes ---
@api_router.post("/contact")
async def submit_contact(data: ContactCreate):
    doc = {"id": str(uuid.uuid4())[:8], **data.model_dump(), "created_at": datetime.now(timezone.utc).isoformat()}
    await db.contact_submissions.insert_one(doc)
    doc.pop("_id", None)
    return {"message": "Message sent successfully", "id": doc["id"]}

@api_router.get("/contact")
async def list_contacts(request: Request):
    await require_admin(request)
    return await db.contact_submissions.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)

# --- Employer Routes ---
@api_router.post("/employers/register")
async def register_employer(data: EmployerCreate):
    emp_id = str(uuid.uuid4())[:8]
    doc = {"id": emp_id, **data.model_dump(), "status": "pending", "created_at": datetime.now(timezone.utc).isoformat()}
    await db.employers.insert_one(doc)
    doc.pop("_id", None)
    return {"message": "Registration submitted", "id": emp_id}

@api_router.get("/employers")
async def list_employers(request: Request):
    await require_admin(request)
    return await db.employers.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)

@api_router.post("/jobs")
async def create_job(data: JobListingCreate, request: Request):
    await require_admin(request)
    job_id = str(uuid.uuid4())[:8]
    doc = {"id": job_id, **data.model_dump(), "status": "active", "created_at": datetime.now(timezone.utc).isoformat()}
    await db.job_listings.insert_one(doc)
    doc.pop("_id", None)
    return doc

@api_router.get("/jobs")
async def list_jobs():
    return await db.job_listings.find({"status": "active"}, {"_id": 0}).sort("created_at", -1).to_list(100)

# --- Newsletter Routes ---
@api_router.post("/newsletter/subscribe")
async def subscribe_newsletter(data: NewsletterSubscribe):
    existing = await db.newsletter_subscribers.find_one({"email": data.email}, {"_id": 0})
    if existing:
        return {"message": "Already subscribed"}
    await db.newsletter_subscribers.insert_one({"id": str(uuid.uuid4())[:8], "email": data.email, "created_at": datetime.now(timezone.utc).isoformat()})
    return {"message": "Subscribed successfully"}

@api_router.get("/newsletter/subscribers")
async def list_subscribers(request: Request):
    await require_admin(request)
    return await db.newsletter_subscribers.find({}, {"_id": 0}).to_list(10000)

# --- Admin Stats ---
@api_router.get("/admin/stats")
async def get_admin_stats(request: Request):
    await require_admin(request)
    return {
        "applications": {"total": await db.applications.count_documents({}), "pending": await db.applications.count_documents({"status": "pending"})},
        "payments": {"total": await db.payment_transactions.count_documents({}), "paid": await db.payment_transactions.count_documents({"payment_status": "paid"})},
        "employers": await db.employers.count_documents({}),
        "jobs": await db.job_listings.count_documents({}),
        "contacts": await db.contact_submissions.count_documents({}),
        "subscribers": await db.newsletter_subscribers.count_documents({}),
        "blog_posts": await db.blog_posts.count_documents({})
    }

# --- SMS Notification (Twilio) ---
async def send_sms_notification(phone, message):
    account_sid = os.environ.get("TWILIO_ACCOUNT_SID", "")
    auth_token = os.environ.get("TWILIO_AUTH_TOKEN", "")
    from_number = os.environ.get("TWILIO_PHONE_NUMBER", "")
    if not all([account_sid, auth_token, from_number]):
        logger.info(f"Twilio not configured. Would send to {phone}: {message}")
        return {"status": "skipped", "reason": "Twilio not configured"}
    try:
        from twilio.rest import Client as TwilioClient
        twilio_client = TwilioClient(account_sid, auth_token)
        msg = twilio_client.messages.create(body=message, from_=from_number, to=phone)
        return {"status": "sent", "sid": msg.sid}
    except Exception as e:
        logger.error(f"Twilio SMS error: {e}")
        return {"status": "error", "detail": str(e)}

@api_router.post("/notifications/sms")
async def send_sms(request: Request):
    await require_admin(request)
    body = await request.json()
    return await send_sms_notification(body.get("phone", ""), body.get("message", ""))

# --- Seed Data ---
@app.on_event("startup")
async def seed_data():
    count = await db.blog_posts.count_documents({})
    if count == 0:
        await db.blog_posts.insert_many([
            {"id": "post-001", "title": "Understanding H-2A Visa: A Complete Guide for Agricultural Workers", "content": "The H-2A visa program allows U.S. employers to bring foreign nationals to the United States to fill temporary agricultural jobs. This program is essential for the agricultural industry, which relies heavily on seasonal labor.\n\nKey Requirements:\n- A valid job offer from a U.S. employer\n- The work must be temporary or seasonal in nature\n- The employer must demonstrate that there are not enough U.S. workers available\n- The employer must provide housing and transportation\n\nBenefits of H-2A Visa:\n- Legal work authorization in the United States\n- Employer-provided housing at no cost\n- Transportation to and from the worksite\n- Guaranteed wage rates\n- Opportunity to return for subsequent seasons\n\nApplication Process:\n1. Employer files a temporary labor certification with the DOL\n2. Employer files Form I-129 with USCIS\n3. Worker applies for H-2A visa at a U.S. Embassy\n4. Visa interview and processing\n5. Travel to the United States", "excerpt": "Everything you need to know about the H-2A temporary agricultural worker visa program.", "category": "Work Visa", "image_url": "https://images.unsplash.com/photo-1752242931857-93f947f304b7?w=800", "author": "Global Hire Assist", "created_at": datetime.now(timezone.utc).isoformat()},
            {"id": "post-002", "title": "Top 5 Tips for a Successful Visa Interview", "content": "Your visa interview is one of the most critical steps in the visa application process. Here are five essential tips to help you succeed:\n\n1. Prepare Your Documents\nOrganize all required documents in a neat folder. Include your passport, DS-160 confirmation, appointment letter, photo, and supporting financial documents.\n\n2. Dress Professionally\nFirst impressions matter. Dress in business or business-casual attire to show you take the process seriously.\n\n3. Be Honest and Direct\nAnswer questions truthfully and concisely. Don't provide unnecessary information, but don't be evasive either.\n\n4. Know Your Purpose\nBe clear about why you're traveling to the U.S. and what you plan to do there. Have specific details ready.\n\n5. Show Strong Ties to Home\nDemonstrate that you have reasons to return to your home country, such as family, property, or employment.", "excerpt": "Prepare for your visa interview with these proven strategies from our expert consultants.", "category": "Tips", "image_url": "https://images.unsplash.com/photo-1744580389912-e424d67b9749?w=800", "author": "Global Hire Assist", "created_at": datetime.now(timezone.utc).isoformat()},
            {"id": "post-003", "title": "H-2B Visa: Opportunities in Non-Agricultural Sectors", "content": "The H-2B program enables employers to hire foreign workers for temporary non-agricultural jobs in the United States. This visa category covers a wide range of industries.\n\nPopular Industries:\n- Hospitality and Tourism\n- Landscaping and Groundskeeping\n- Construction\n- Seafood Processing\n- Amusement and Recreation\n\nEligibility Requirements:\n- Employer must prove temporary need (seasonal, peak load, intermittent, or one-time)\n- No qualified U.S. workers available\n- Foreign worker's employment won't adversely affect wages of similarly employed U.S. workers\n\nH-2B Cap:\nThe H-2B visa has an annual cap of 66,000 visas, split between the first and second halves of the fiscal year. Additional visas may be made available through supplemental allocations.", "excerpt": "Explore work opportunities in hospitality, landscaping, and more through the H-2B visa.", "category": "Work Visa", "image_url": "https://images.unsplash.com/photo-1759038085950-1234ca8f5fed?w=800", "author": "Global Hire Assist", "created_at": datetime.now(timezone.utc).isoformat()},
        ])
        logger.info("Seeded blog posts")

app.include_router(api_router)

# --- Sitemap & Robots (outside /api prefix for SEO) ---
from fastapi.responses import Response as FastResponse

@app.get("/api/sitemap.xml")
async def sitemap(request: Request):
    base_url = str(request.headers.get("x-forwarded-proto", "https")) + "://" + str(request.headers.get("host", "globalhireassist.com"))

    static_pages = [
        {"loc": "/", "priority": "1.0", "changefreq": "weekly"},
        {"loc": "/about", "priority": "0.8", "changefreq": "monthly"},
        {"loc": "/programs", "priority": "0.9", "changefreq": "weekly"},
        {"loc": "/programs/h2a-visa", "priority": "0.8", "changefreq": "monthly"},
        {"loc": "/programs/h2b-visa", "priority": "0.8", "changefreq": "monthly"},
        {"loc": "/programs/tourist-visa", "priority": "0.8", "changefreq": "monthly"},
        {"loc": "/programs/visit-visa", "priority": "0.8", "changefreq": "monthly"},
        {"loc": "/programs/study-visa", "priority": "0.8", "changefreq": "monthly"},
        {"loc": "/apply", "priority": "0.9", "changefreq": "monthly"},
        {"loc": "/jobs", "priority": "0.9", "changefreq": "daily"},
        {"loc": "/blog", "priority": "0.8", "changefreq": "weekly"},
        {"loc": "/contact", "priority": "0.7", "changefreq": "monthly"},
        {"loc": "/employers", "priority": "0.7", "changefreq": "monthly"},
        {"loc": "/membership", "priority": "0.7", "changefreq": "monthly"},
    ]

    blog_posts = await db.blog_posts.find({}, {"_id": 0, "id": 1, "created_at": 1}).to_list(500)
    jobs = await db.job_listings.find({"status": "active"}, {"_id": 0, "id": 1, "created_at": 1}).to_list(500)

    xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

    for page in static_pages:
        xml += f'  <url>\n    <loc>{base_url}{page["loc"]}</loc>\n    <priority>{page["priority"]}</priority>\n    <changefreq>{page["changefreq"]}</changefreq>\n  </url>\n'

    for post in blog_posts:
        lastmod = post.get("created_at", "")[:10] if post.get("created_at") else ""
        xml += f'  <url>\n    <loc>{base_url}/blog/{post["id"]}</loc>\n    <priority>0.6</priority>\n    <changefreq>monthly</changefreq>\n'
        if lastmod:
            xml += f'    <lastmod>{lastmod}</lastmod>\n'
        xml += '  </url>\n'

    for job in jobs:
        lastmod = job.get("created_at", "")[:10] if job.get("created_at") else ""
        xml += f'  <url>\n    <loc>{base_url}/jobs#{job["id"]}</loc>\n    <priority>0.6</priority>\n    <changefreq>weekly</changefreq>\n'
        if lastmod:
            xml += f'    <lastmod>{lastmod}</lastmod>\n'
        xml += '  </url>\n'

    xml += '</urlset>'
    return FastResponse(content=xml, media_type="application/xml")

@app.get("/api/robots.txt")
async def robots(request: Request):
    base_url = str(request.headers.get("x-forwarded-proto", "https")) + "://" + str(request.headers.get("host", "globalhireassist.com"))
    content = f"""User-agent: *
Allow: /
Disallow: /admin
Disallow: /dashboard
Disallow: /payment/

Sitemap: {base_url}/api/sitemap.xml
"""
    return FastResponse(content=content, media_type="text/plain")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
