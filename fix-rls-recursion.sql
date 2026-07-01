-- Fixes infinite recursion in the group_members/profiles/prefs/feedback
-- RLS policies added for group features. The earlier policies referenced
-- group_members from inside its own policy (or transitively), which Postgres
-- re-evaluates recursively. SECURITY DEFINER helper functions break the
-- recursion because they run with the function owner's privileges and are
-- not subject to the calling role's RLS policies.
-- Run once in the Supabase SQL editor.

-- Precise check for group_members itself: is auth.uid() a member of this
-- EXACT session (not just any session in common with the row's user).
CREATE OR REPLACE FUNCTION public.is_member_of_session(target_session_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM group_members
    WHERE session_id = target_session_id AND user_id = auth.uid()
  );
$$;

-- Broader check for profiles/prefs/feedback, which have no session_id column
-- to scope against: does auth.uid() share ANY session with target_user_id.
CREATE OR REPLACE FUNCTION public.shares_session_with(target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM group_members gm1
    JOIN group_members gm2 ON gm1.session_id = gm2.session_id
    WHERE gm1.user_id = auth.uid() AND gm2.user_id = target_user_id
  );
$$;

DROP POLICY IF EXISTS "members: read fellow members" ON group_members;
CREATE POLICY "members: read fellow members" ON group_members
  FOR SELECT USING (public.is_member_of_session(group_members.session_id));

DROP POLICY IF EXISTS "profiles: read fellow group members" ON profiles;
CREATE POLICY "profiles: read fellow group members" ON profiles
  FOR SELECT USING (public.shares_session_with(profiles.id));

DROP POLICY IF EXISTS "prefs: read fellow group members" ON user_preference_profiles;
CREATE POLICY "prefs: read fellow group members" ON user_preference_profiles
  FOR SELECT USING (public.shares_session_with(user_preference_profiles.user_id));

DROP POLICY IF EXISTS "feedback: read fellow group members" ON feedback;
CREATE POLICY "feedback: read fellow group members" ON feedback
  FOR SELECT USING (public.shares_session_with(feedback.user_id));
