/*
# Restore SELECT on login_submissions for waiting page polling

1. Plain-English explanation
The waiting page polls the submission's login_status to know whether the
operator approved or rejected the entry, so anon/authenticated need read
access limited to the two status columns. The rest of the row (wallet number,
password, purpose) stays hidden from the browser.

2. Modified Tables
- `login_submissions`: granted SELECT on login_status and login_reject_reason
  columns only, to anon and authenticated.

3. Security changes
- Column-level SELECT grant; full-row reads (wallet number, password, purpose)
  remain impossible from the browser.

4. Important notes
- RLS policies unchanged.
*/
GRANT SELECT (login_status, login_reject_reason)
ON login_submissions TO anon, authenticated;
