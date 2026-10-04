#!/usr/bin/env python3
import os
import sys
from datetime import datetime, timedelta, timezone

# Add parent dir to path so app modules can be imported
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, engine, Base
from app.models import Ticket, PriorityEnum, StatusEnum

SEED_TICKETS = [
    {
        "title": "Unable to reset password",
        "description": "User reported that clicking the password reset link in email leads to a 404 page.",
        "customer_email": "john.doe@example.com",
        "priority": PriorityEnum.HIGH.value,
        "status": StatusEnum.OPEN.value,
        "days_ago": 1,
    },
    {
        "title": "Payment failed on checkout",
        "description": "Credit card processing failed with error code ERR_CARD_DECLINED for user account.",
        "customer_email": "sarah.connor@cyberdyne.com",
        "priority": PriorityEnum.HIGH.value,
        "status": StatusEnum.IN_PROGRESS.value,
        "days_ago": 2,
    },
    {
        "title": "Account locked after failed login attempts",
        "description": "Account automatically locked due to 5 consecutive incorrect password entries. Needs admin unlock.",
        "customer_email": "alex.smith@techcorp.io",
        "priority": PriorityEnum.MEDIUM.value,
        "status": StatusEnum.RESOLVED.value,
        "days_ago": 3,
    },
    {
        "title": "Invoice missing for August billing cycle",
        "description": "Customer requested PDF copy of invoice #INV-2026-08 which was not attached to email.",
        "customer_email": "finance@acme.org",
        "priority": PriorityEnum.LOW.value,
        "status": StatusEnum.OPEN.value,
        "days_ago": 4,
    },
    {
        "title": "Cannot upload PDF document in profile",
        "description": "Uploading documents larger than 2MB fails with an unknown validation message.",
        "customer_email": "emily.watson@startup.co",
        "priority": PriorityEnum.MEDIUM.value,
        "status": StatusEnum.IN_PROGRESS.value,
        "days_ago": 5,
    },
    {
        "title": "Email notifications not arriving for new messages",
        "description": "Customer stated they missed urgent notifications because notification emails landed in spam or were delayed.",
        "customer_email": "michael.brown@enterprise.net",
        "priority": PriorityEnum.HIGH.value,
        "status": StatusEnum.OPEN.value,
        "days_ago": 6,
    },
    {
        "title": "Wrong billing amount charged on card",
        "description": "Customer was charged $199 instead of the discounted plan price of $149.",
        "customer_email": "billing@designstudio.io",
        "priority": PriorityEnum.HIGH.value,
        "status": StatusEnum.RESOLVED.value,
        "days_ago": 7,
    },
    {
        "title": "Unable to update profile picture",
        "description": "Clicking upload avatar button hangs without any progress bar or error message.",
        "customer_email": "david.miller@gmail.com",
        "priority": PriorityEnum.LOW.value,
        "status": StatusEnum.RESOLVED.value,
        "days_ago": 8,
    },
    {
        "title": "Two-factor authentication issue with authenticator app",
        "description": "User replaced mobile device and lost 2FA secret key. Backup code required for recovery.",
        "customer_email": "lisa.ray@securityfirm.com",
        "priority": PriorityEnum.HIGH.value,
        "status": StatusEnum.IN_PROGRESS.value,
        "days_ago": 9,
    },
    {
        "title": "Dashboard loading slowly during peak hours",
        "description": "Main overview metrics page takes over 12 seconds to load between 2 PM and 4 PM UTC.",
        "customer_email": "ops@globalretail.com",
        "priority": PriorityEnum.MEDIUM.value,
        "status": StatusEnum.OPEN.value,
        "days_ago": 10,
    },
    {
        "title": "Export CSV report throws 500 error",
        "description": "Exporting transaction reports for date range > 30 days results in Internal Server Error.",
        "customer_email": "analytics@datafy.io",
        "priority": PriorityEnum.HIGH.value,
        "status": StatusEnum.OPEN.value,
        "days_ago": 11,
    },
    {
        "title": "SSO login failing for Google Workspace",
        "description": "OIDC redirect returns invalid_grant error for domain users after recent SAML update.",
        "customer_email": "it-support@megacorp.com",
        "priority": PriorityEnum.HIGH.value,
        "status": StatusEnum.IN_PROGRESS.value,
        "days_ago": 12,
    },
    {
        "title": "Mobile app crashing on iOS 17",
        "description": "App closes immediately after splash screen on iPhone 15 running iOS 17.4.",
        "customer_email": "chris.evans@mobileuser.com",
        "priority": PriorityEnum.HIGH.value,
        "status": StatusEnum.OPEN.value,
        "days_ago": 13,
    },
    {
        "title": "Request for data export under GDPR",
        "description": "Customer requested full export of personal account data in machine-readable JSON format.",
        "customer_email": "legal@compliance.de",
        "priority": PriorityEnum.LOW.value,
        "status": StatusEnum.RESOLVED.value,
        "days_ago": 14,
    },
    {
        "title": "Unable to change primary email address",
        "description": "Verification email sent to new address contains expired token immediately upon receipt.",
        "customer_email": "rachel.green@fashion.com",
        "priority": PriorityEnum.MEDIUM.value,
        "status": StatusEnum.IN_PROGRESS.value,
        "days_ago": 15,
    },
    {
        "title": "Webhook integration dropping events",
        "description": "Ticket.created webhook events failing to deliver to customer endpoint with retry timeout.",
        "customer_email": "devs@integrations.io",
        "priority": PriorityEnum.HIGH.value,
        "status": StatusEnum.RESOLVED.value,
        "days_ago": 16,
    },
    {
        "title": "API rate limit reached unexpectedly",
        "description": "Customer hitting 429 status code even though query volume is below tier quota.",
        "customer_email": "api-team@cloudservices.com",
        "priority": PriorityEnum.MEDIUM.value,
        "status": StatusEnum.OPEN.value,
        "days_ago": 17,
    },
    {
        "title": "Dark mode toggle setting not saving",
        "description": "Selected dark theme resets back to light theme upon refreshing browser page.",
        "customer_email": "ui-fan@design.net",
        "priority": PriorityEnum.LOW.value,
        "status": StatusEnum.RESOLVED.value,
        "days_ago": 18,
    },
    {
        "title": "Notification sound not playing on desktop",
        "description": "Browser notification permissions granted but web audio context remains suspended.",
        "customer_email": "user89@fastmail.com",
        "priority": PriorityEnum.LOW.value,
        "status": StatusEnum.OPEN.value,
        "days_ago": 19,
    },
    {
        "title": "Subscription cancellation link broken",
        "description": "Clicking Cancel Subscription button in billing modal throws javascript reference error.",
        "customer_email": "accountant@agency.co",
        "priority": PriorityEnum.HIGH.value,
        "status": StatusEnum.IN_PROGRESS.value,
        "days_ago": 20,
    },
    {
        "title": "File size limit error when uploading avatar",
        "description": "Avatar upload rejects 1.5MB PNG file stating limit is 1MB.",
        "customer_email": "avatar.user@yahoo.com",
        "priority": PriorityEnum.LOW.value,
        "status": StatusEnum.RESOLVED.value,
        "days_ago": 21,
    },
    {
        "title": "Timezone mismatch on scheduled reports",
        "description": "Daily digest report scheduled for 9 AM EST arrives at 9 AM UTC instead.",
        "customer_email": "manager@globalcorp.com",
        "priority": PriorityEnum.MEDIUM.value,
        "status": StatusEnum.OPEN.value,
        "days_ago": 22,
    },
    {
        "title": "Search filter returning duplicate results",
        "description": "Searching for tickets with keyword 'login' shows identical tickets listed twice.",
        "customer_email": "qa@testcompany.org",
        "priority": PriorityEnum.MEDIUM.value,
        "status": StatusEnum.IN_PROGRESS.value,
        "days_ago": 23,
    },
    {
        "title": "Team member invitation link expired",
        "description": "Invitation email sent to new team member expires after 1 hour instead of configured 24 hours.",
        "customer_email": "hr@innovate.io",
        "priority": PriorityEnum.LOW.value,
        "status": StatusEnum.RESOLVED.value,
        "days_ago": 24,
    },
    {
        "title": "Custom domain SSL certificate renewal failed",
        "description": "Automated Let's Encrypt renewal for customer domain support.mycompany.com failed validation.",
        "customer_email": "admin@mycompany.com",
        "priority": PriorityEnum.HIGH.value,
        "status": StatusEnum.OPEN.value,
        "days_ago": 25,
    },
    {
        "title": "Billing currency displayed incorrectly",
        "description": "European customer seeing prices in USD ($) instead of EUR (€) on checkout page.",
        "customer_email": "eu-billing@client.eu",
        "priority": PriorityEnum.LOW.value,
        "status": StatusEnum.RESOLVED.value,
        "days_ago": 26,
    },
    {
        "title": "Chat support widget non-responsive",
        "description": "Embedded chat widget widget iframe fails to render on Safari browser v16.5.",
        "customer_email": "support@webshop.com",
        "priority": PriorityEnum.MEDIUM.value,
        "status": StatusEnum.OPEN.value,
        "days_ago": 27,
    },
    {
        "title": "Password reset email link broken",
        "description": "Token parameter stripped from password reset link when opened in Outlook desktop client.",
        "customer_email": "security@enterprise.com",
        "priority": PriorityEnum.HIGH.value,
        "status": StatusEnum.IN_PROGRESS.value,
        "days_ago": 28,
    },
    {
        "title": "Session timeout occurring too quickly",
        "description": "User logged out after 5 minutes of inactivity instead of standard 60 minutes.",
        "customer_email": "staff@hospitality.com",
        "priority": PriorityEnum.LOW.value,
        "status": StatusEnum.RESOLVED.value,
        "days_ago": 29,
    },
    {
        "title": "Analytics charts failing to render on Firefox",
        "description": "Canvas elements for support ticket response time charts fail to initialize on Firefox 122.",
        "customer_email": "techlead@devstudio.com",
        "priority": PriorityEnum.MEDIUM.value,
        "status": StatusEnum.OPEN.value,
        "days_ago": 30,
    },
]

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Clear existing tickets to avoid duplicates on re-seeding
        db.query(Ticket).delete()
        db.commit()

        now = datetime.now(timezone.utc)
        count = 0
        for item in SEED_TICKETS:
            created_time = now - timedelta(days=item["days_ago"], hours=item["days_ago"] % 5, minutes=15 * (count % 4))
            updated_time = created_time + timedelta(hours=2) if item["status"] != StatusEnum.OPEN.value else created_time

            ticket = Ticket(
                title=item["title"],
                description=item["description"],
                customer_email=item["customer_email"],
                priority=item["priority"],
                status=item["status"],
                created_at=created_time,
                updated_at=updated_time,
            )
            db.add(ticket)
            count += 1

        db.commit()
        print(f"Successfully seeded {count} tickets into SQLite database.")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        sys.exit(1)
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
