-- Tracks whether a user has completed (or skipped) onboarding.
-- Run once in the Supabase SQL editor, after schema.sql and triggers.sql.

ALTER TABLE profiles ADD COLUMN onboarded_at TIMESTAMPTZ;
