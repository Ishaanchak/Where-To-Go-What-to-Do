-- Allows the server to read fellow group members' feedback rows, needed to
-- exclude activities any group member has already rated from group
-- recommendations (per scoring-algorithm.md step 4). Only activity_ids are
-- ever returned to the client, never the rating or which member gave it.
-- Run once in the Supabase SQL editor.

CREATE POLICY "feedback: read fellow group members" ON feedback
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM group_members gm1
      JOIN group_members gm2 ON gm1.session_id = gm2.session_id
      WHERE gm1.user_id = auth.uid() AND gm2.user_id = feedback.user_id
    )
  );
