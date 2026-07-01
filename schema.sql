-- ============================================================
-- Collaborative Activity Discovery Platform — DB Schema
-- Supabase (PostgreSQL)
-- ============================================================

-- NOTE: auth.users is managed by Supabase Auth automatically.
-- All other tables reference it via user_id.


-- ------------------------------------------------------------
-- 1. PROFILES
-- Extends auth.users with display name.
-- Created automatically on user sign-up via a Supabase trigger.
-- ------------------------------------------------------------
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ------------------------------------------------------------
-- 2. ACTIVITIES
-- The 75 pre-seeded activity types with attribute scores.
-- Populated once from activities.json; never written to at runtime.
-- ------------------------------------------------------------
CREATE TABLE activities (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name               TEXT NOT NULL,
  places_query       TEXT NOT NULL,
  places_type        TEXT,                  -- Google Places type string, nullable
  budget             SMALLINT NOT NULL CHECK (budget BETWEEN 1 AND 5),
  physical_intensity SMALLINT NOT NULL CHECK (physical_intensity BETWEEN 1 AND 5),
  competitiveness    SMALLINT NOT NULL CHECK (competitiveness BETWEEN 1 AND 5),
  group_size         SMALLINT NOT NULL CHECK (group_size BETWEEN 1 AND 5),
  outdoor            SMALLINT NOT NULL CHECK (outdoor BETWEEN 1 AND 5),
  duration           SMALLINT NOT NULL CHECK (duration BETWEEN 1 AND 5),
  novelty            SMALLINT NOT NULL CHECK (novelty BETWEEN 1 AND 5),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ------------------------------------------------------------
-- 3. USER PREFERENCE PROFILES
-- One row per user. Scores float between 1.0–5.0, initialized at 3.0.
-- Updated on every swipe using exponential moving average (alpha = 0.2).
-- ------------------------------------------------------------
CREATE TABLE user_preference_profiles (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  budget             NUMERIC(3,2) NOT NULL DEFAULT 3.0,
  physical_intensity NUMERIC(3,2) NOT NULL DEFAULT 3.0,
  competitiveness    NUMERIC(3,2) NOT NULL DEFAULT 3.0,
  group_size         NUMERIC(3,2) NOT NULL DEFAULT 3.0,
  outdoor            NUMERIC(3,2) NOT NULL DEFAULT 3.0,
  duration           NUMERIC(3,2) NOT NULL DEFAULT 3.0,
  novelty            NUMERIC(3,2) NOT NULL DEFAULT 3.0,
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ------------------------------------------------------------
-- 4. SWIPE HISTORY
-- Every swipe logged. Used to avoid re-showing activities
-- and as an audit trail for preference updates.
-- ------------------------------------------------------------
CREATE TYPE swipe_direction AS ENUM ('left', 'right');

CREATE TABLE swipe_history (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  direction   swipe_direction NOT NULL,
  swiped_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX swipe_history_user_idx ON swipe_history(user_id);


-- ------------------------------------------------------------
-- 5. GROUP SESSIONS
-- A collaborative planning session created by one user.
-- Others join via invite_code.
-- ------------------------------------------------------------
CREATE TYPE session_status AS ENUM ('active', 'completed');

CREATE TABLE group_sessions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT,                          -- optional label e.g. "Friday night"
  created_by  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  invite_code TEXT NOT NULL UNIQUE,          -- short code for sharing, e.g. "HIKE42"
  mood_tags   TEXT[] NOT NULL DEFAULT '{}', -- 1-2 values from the mood tag enum
  status      session_status NOT NULL DEFAULT 'active',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ------------------------------------------------------------
-- 6. GROUP MEMBERS
-- Junction table between users and group sessions.
-- The session creator is also inserted here on session creation.
-- ------------------------------------------------------------
CREATE TABLE group_members (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES group_sessions(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (session_id, user_id)               -- prevent duplicate membership
);

CREATE INDEX group_members_session_idx ON group_members(session_id);


-- ------------------------------------------------------------
-- 7. FEEDBACK
-- Post-activity rating. Updates preference profile on submission.
-- session_id is nullable — feedback can come from solo or group use.
-- ------------------------------------------------------------
CREATE TABLE feedback (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  session_id  UUID REFERENCES group_sessions(id) ON DELETE SET NULL,
  rating      SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX feedback_user_idx ON feedback(user_id);


-- ------------------------------------------------------------
-- 8. SAVED LISTS
-- User-created named lists for bookmarking activities.
-- Personal only — not shared with groups.
-- ------------------------------------------------------------
CREATE TABLE saved_lists (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX saved_lists_user_idx ON saved_lists(user_id);


-- ------------------------------------------------------------
-- 9. SAVED LIST ITEMS
-- Activities saved to a user's named list.
-- An activity can appear in multiple lists.
-- ------------------------------------------------------------
CREATE TABLE saved_list_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id     UUID NOT NULL REFERENCES saved_lists(id) ON DELETE CASCADE,
  activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  saved_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (list_id, activity_id)              -- prevent duplicates within a list
);

CREATE INDEX saved_list_items_list_idx ON saved_list_items(list_id);


-- ============================================================
-- ROW LEVEL SECURITY
-- Enable RLS on all user-facing tables so users can only
-- read/write their own data. Activities are public read.
-- ============================================================

ALTER TABLE profiles                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preference_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE swipe_history            ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_sessions           ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members            ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_lists              ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_list_items         ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own row
CREATE POLICY "profiles: own row" ON profiles
  FOR ALL USING (auth.uid() = id);

-- Preference profiles: users can read/update their own row
CREATE POLICY "prefs: own row" ON user_preference_profiles
  FOR ALL USING (auth.uid() = user_id);

-- Swipe history: users can read/insert their own rows
CREATE POLICY "swipes: own rows" ON swipe_history
  FOR ALL USING (auth.uid() = user_id);

-- Group sessions: creator can manage; members can read
CREATE POLICY "sessions: creator manage" ON group_sessions
  FOR ALL USING (auth.uid() = created_by);

CREATE POLICY "sessions: member read" ON group_sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.session_id = group_sessions.id
        AND group_members.user_id = auth.uid()
    )
  );

-- Group members: members can read their session; anyone can insert (to join)
CREATE POLICY "members: read own session" ON group_members
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "members: join session" ON group_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Feedback: users can read/insert their own rows
CREATE POLICY "feedback: own rows" ON feedback
  FOR ALL USING (auth.uid() = user_id);

-- Saved lists: users can manage their own lists
CREATE POLICY "saved_lists: own rows" ON saved_lists
  FOR ALL USING (auth.uid() = user_id);

-- Saved list items: users can manage items in their own lists
CREATE POLICY "saved_list_items: own rows" ON saved_list_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM saved_lists
      WHERE saved_lists.id = saved_list_items.list_id
        AND saved_lists.user_id = auth.uid()
    )
  );

-- Activities: public read, no writes at runtime
CREATE POLICY "activities: public read" ON activities
  FOR SELECT USING (true);
