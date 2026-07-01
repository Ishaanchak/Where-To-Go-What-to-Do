-- Dismissed activities: per-user, per-mood-tag "never show again" exclusions.
-- Run once in the Supabase SQL editor before any app code changes.

CREATE TABLE dismissed_activities (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  mood_tags   TEXT[] NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE dismissed_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "dismissed: own rows" ON dismissed_activities
  FOR ALL USING (auth.uid() = user_id);

CREATE INDEX dismissed_activities_user_idx ON dismissed_activities(user_id);
