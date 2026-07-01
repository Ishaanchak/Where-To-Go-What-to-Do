-- Allows the server (acting as a member, via that member's own session) to
-- read fellow group members' preference profiles for group-recommendation
-- scoring. The raw values are only ever used in server-side computation in
-- the /api/recommendations Route Handler — the response sent to the browser
-- contains only the final computed scores, never raw preference data.
-- Run once in the Supabase SQL editor.

CREATE POLICY "prefs: read fellow group members" ON user_preference_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM group_members gm1
      JOIN group_members gm2 ON gm1.session_id = gm2.session_id
      WHERE gm1.user_id = auth.uid() AND gm2.user_id = user_preference_profiles.user_id
    )
  );
