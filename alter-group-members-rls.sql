-- Allows a member of a session to see all OTHER members of that same
-- session (the existing policy only let a user see their own membership
-- row). Needed for the Group Lobby's member list and for group-recommendation
-- scoring, which needs every member's profile.
-- Run once in the Supabase SQL editor.

CREATE POLICY "members: read fellow members" ON group_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM group_members gm
      WHERE gm.session_id = group_members.session_id
        AND gm.user_id = auth.uid()
    )
  );
