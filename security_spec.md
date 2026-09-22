# Security Specification - Market Place Hub

## Data Invariants
1. A user can only edit their own profile (except admins).
2. Only verified users can create listings, leads, or reviews.
3. A user can only view their own private chat history.
4. Orders can only be updated by the involved buyer, seller, or an admin.
5. Critical fields like `role` or `commissionRate` can only be set by admins.

## The Dirty Dozen Payloads
1. **Privilege Escalation**: Non-admin user trying to set `role: 'admin'` on their profile.
2. **Identity Spoofing**: User A trying to update User B's profile.
3. **Malicious ID**: Document ID with 1KB junk characters.
4. **Invalid Type**: Setting `price` as a string instead of a number.
5. **PII Leak**: Unauthenticated user trying to read all user profiles.
6. **Shadow Field**: Adding `isVerified: true` to a listing via client SDK.
7. **Resource Poisoning**: Sending a 10MB description in a listing.
8. **State Shortcut**: Moving an order from `pending` to `completed` without payment.
9. **Orphaned Record**: Creating a lead for a non-existent listing.
10. **Unverified Write**: User with unverified email trying to post a listing.
11. **Blanket Read**: Querying all orders without filtering by `buyerId` or `sellerId`.
12. **Immutable Field Attack**: Trying to change `createdAt` on an existing document.

## Test Runner
Verified via `firestore.rules` and manual security review.
