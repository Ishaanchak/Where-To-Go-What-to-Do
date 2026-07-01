-- Friends system: friend_requests table + username column + RLS.
-- Run once in the Supabase SQL editor before any app code changes.

-- Friend requests (directional)
CREATE TABLE friend_requests (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (sender_id, receiver_id)
);

-- Add username to profiles
ALTER TABLE profiles ADD COLUMN username TEXT UNIQUE;

-- RLS
ALTER TABLE friend_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "friend_requests: sender or receiver" ON friend_requests
  FOR ALL USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "profiles: public username read" ON profiles
  FOR SELECT USING (true);
