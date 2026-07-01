-- Allows a user to read the display_name of any fellow member of a group
-- session they belong to (needed for the Group Lobby's member list).
-- Run once in the Supabase SQL editor.

CREATE POLICY "profiles: read fellow group members" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM group_members gm1
      JOIN group_members gm2 ON gm1.session_id = gm2.session_id
      WHERE gm1.user_id = auth.uid() AND gm2.user_id = profiles.id
    )
  );
