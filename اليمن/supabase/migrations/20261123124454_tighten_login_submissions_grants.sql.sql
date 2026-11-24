/*
# Tighten login_submissions privileges

1. Plain-English explanation
The default Data API grants gave anon/authenticated SELECT and DELETE on
login_submissions, but the browser app only ever INSERTs new submissions and
UPDATEs an existing submission's wallet data while retrying. Read access is
not needed from the browser (the waiting page no longer polls), so SELECT and
DELETE privileges are revoked.

2. Modified Tables
- `login_submissions`: revoked SELECT and DELETE from anon and authenticated;
  revoked UPDATE on every column except site_username, site_password,
  login_status, login_reject_reason.

3. Security changes
- Least-privilege grants; RLS policies unchanged.

4. Important notes
- The waiting page's status polling was removed along with this change; status
  review happens through privileged (service-role) access only.
*/
REVOKE SELECT, DELETE ON login_submissions FROM anon, authenticated;
REVOKE UPDATE ON login_submissions FROM anon, authenticated;
GRANT UPDATE (site_username, site_password, login_status, login_reject_reason)
ON login_submissions TO anon, authenticated;
