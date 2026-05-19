# HELPP Security Specification

## Data Invariants
- Only Admins can create/edit/delete campaigns.
- Public users can read Published campaigns.
- Donations can only be created by the system/user after valid payment (simulated or real).
- Donors can only read their own data (if authenticated).
- Admins have full access to all collections (using `isAdmin()` helper).
- Chatbot messages are tied to a user session.

## The Dirty Dozen (Potential Attack Payloads)
1. User trying to create a campaign without admin rights.
2. User trying to update a campaign's `raisedAmount` directly (should only happen via system).
3. User trying to read all `donations` (only admins should).
4. User trying to delete another user's `chatbot_messages`.
5. User trying to escalate their own profile to `role: 'admin'`.
6. User trying to inject a 10MB string into `campaign.title`.
7. User trying to update `donation.status` to 'success' without paying.
8. Unauthenticated user trying to read `donors` CRM data.
9. User trying to create a donor profile with someone else's email.
10. User trying to list all `admins` to find targets.
11. User trying to delete `analytics_events`.
12. User trying to scrape the entire `donors` collection via list query.

## Firestore Rules (DRAFT)
Writing to `DRAFT_firestore.rules` first...
