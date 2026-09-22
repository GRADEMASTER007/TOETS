# Security Specification - Market Place Hub

## Data Invariants
- A Listing cannot exist without an `ownerId`.
- Only the owner of a listing can update or delete it.
- Users can only read their own private profile data.
- Messages in a chat can only be read by the participants of that chat.
- Status fields (e.g., `role` in User, `status` in Listing) can only be changed by authorized roles (Admins) or under specific conditions.

## The Dirty Dozen Payloads

1. **Identity Spoofing**: Attempt to create a listing with someone else's `ownerId`.
2. **Privilege Escalation**: Attempt to update own user profile to `role: "admin"`.
3. **Ghost Field Injection**: Attempt to add `isVerified: true` to a listing.
4. **Unauthorized Deletion**: Attempt to delete another user's listing.
5. **PII Leakage**: Attempt to read another user's full profile document.
6. **Chat Hijacking**: Attempt to read messages in a chat where the user is not a participant.
7. **Resource Poisoning**: Attempt to set a listing price to -1.
8. **Massive Payload**: Attempt to send a 1MB string in the listing title.
9. **Orphaned Message**: Attempt to post a message to a non-existent chat.
10. **State Skipping**: Attempt to move a listing status from `active` directly to `sold` without a transaction record (if enforced).
11. **Regex Bypass**: Attempt to use invalid characters in a document ID.
12. **Timestamp Manipulation**: Attempt to set a custom `createdAt` date in the past.

## Test Runner
Verified via `firestore.rules.test.ts` (conceptual for this turn).
