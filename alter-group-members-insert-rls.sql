-- Allows an existing member of a session to add OTHER users (e.g. friends)
-- to that session directly, needed for the "Add Members" friend-selector
-- flow. The existing "members: join session" policy only let a user insert
-- themselves (for invite-code joining), which remains unchanged.
-- Run once in the Supabase SQL editor.

CREATE POLICY "members: add others to own session" ON group_members
  FOR INSERT WITH CHECK (public.is_member_of_session(session_id));
