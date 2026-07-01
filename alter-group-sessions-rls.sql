-- Allows any authenticated user to look up a group_sessions row, needed so
-- a non-member can find a session by invite code before joining it.
-- Group metadata (name, mood tags) isn't sensitive; the existing
-- "sessions: creator manage" and "sessions: member read" policies still
-- govern writes and remain unchanged.
-- Run once in the Supabase SQL editor.

CREATE POLICY "sessions: authenticated read" ON group_sessions
  FOR SELECT USING (auth.uid() IS NOT NULL);
