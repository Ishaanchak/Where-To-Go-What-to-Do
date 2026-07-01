-- Resets claudetest1 and claudetest2 to a clean, freshly-onboarded state.
-- Run in the Supabase SQL editor. Safe to re-run any time.

DO $$
DECLARE
  test_user_ids UUID[];
BEGIN
  SELECT array_agg(id) INTO test_user_ids
  FROM profiles
  WHERE username IN ('claudetest1', 'claudetest2');

  -- Drop any groups these users created (cascades to group_members).
  DELETE FROM group_sessions WHERE created_by = ANY(test_user_ids);

  -- Remove them from any other groups they joined.
  DELETE FROM group_members WHERE user_id = ANY(test_user_ids);

  -- Clear swipe history, feedback, dismissals, saved lists, friend requests.
  DELETE FROM swipe_history WHERE user_id = ANY(test_user_ids);
  DELETE FROM feedback WHERE user_id = ANY(test_user_ids);
  DELETE FROM dismissed_activities WHERE user_id = ANY(test_user_ids);
  DELETE FROM saved_lists WHERE user_id = ANY(test_user_ids); -- cascades to saved_list_items
  DELETE FROM friend_requests
    WHERE sender_id = ANY(test_user_ids) OR receiver_id = ANY(test_user_ids);

  -- Reset preference profiles to neutral.
  UPDATE user_preference_profiles
  SET budget = 3.0,
      physical_intensity = 3.0,
      competitiveness = 3.0,
      group_size = 3.0,
      outdoor = 3.0,
      duration = 3.0,
      novelty = 3.0,
      updated_at = NOW()
  WHERE user_id = ANY(test_user_ids);

  -- Send them back through onboarding.
  UPDATE profiles
  SET onboarded_at = NULL
  WHERE id = ANY(test_user_ids);
END $$;
