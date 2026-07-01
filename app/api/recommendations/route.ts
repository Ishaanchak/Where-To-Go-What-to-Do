import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  scoreActivities,
  toPreferenceProfile,
  type Activity,
  type MoodTag,
  MOOD_TAGS,
} from "@/lib/scoring";

type SupabaseClient = Awaited<ReturnType<typeof createServerSupabaseClient>>;

async function getFeedbackExclusions(
  supabase: SupabaseClient,
  userIds: string[]
): Promise<string[]> {
  const { data } = await supabase.from("feedback").select("activity_id").in("user_id", userIds);
  return (data ?? []).map((row) => row.activity_id);
}

/** Excludes activities any of the given users dismissed for a mood tag that overlaps moodTags. */
async function getDismissedExclusions(
  supabase: SupabaseClient,
  userIds: string[],
  moodTags: MoodTag[]
): Promise<string[]> {
  if (moodTags.length === 0) return [];
  const { data } = await supabase
    .from("dismissed_activities")
    .select("activity_id")
    .in("user_id", userIds)
    .overlaps("mood_tags", moodTags);
  return (data ?? []).map((row) => row.activity_id);
}

export async function GET(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const groupId = searchParams.get("groupId");
  const tagsParam = searchParams.get("tags") ?? "";

  const { data: activitiesData, error: activitiesError } = await supabase
    .from("activities")
    .select("*");

  if (activitiesError) {
    return NextResponse.json({ error: activitiesError.message }, { status: 500 });
  }
  const activities = activitiesData as Activity[];

  if (groupId) {
    const { data: session, error: sessionError } = await supabase
      .from("group_sessions")
      .select("id, name, mood_tags")
      .eq("id", groupId)
      .single();

    if (sessionError || !session) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    const { data: members, error: membersError } = await supabase
      .from("group_members")
      .select("user_id")
      .eq("session_id", groupId);

    if (membersError || !members || members.length === 0) {
      return NextResponse.json({ error: "Group has no members" }, { status: 404 });
    }

    const memberIds = members.map((m) => m.user_id);

    const { data: profiles, error: profilesError } = await supabase
      .from("user_preference_profiles")
      .select("*")
      .in("user_id", memberIds);

    if (profilesError || !profiles) {
      return NextResponse.json({ error: "Could not load member profiles" }, { status: 500 });
    }

    const memberProfiles = profiles.map(toPreferenceProfile);

    const moodTags = (session.mood_tags ?? []) as MoodTag[];

    const [excludeFeedback, excludeDismissed] = await Promise.all([
      getFeedbackExclusions(supabase, memberIds),
      getDismissedExclusions(supabase, memberIds, moodTags),
    ]);
    const excludeActivityIds = [...excludeFeedback, ...excludeDismissed];

    const results = scoreActivities(memberProfiles, moodTags, activities, {
      excludeActivityIds,
      topN: 8,
    });

    return NextResponse.json({ results, moodTags, groupName: session.name });
  }

  const requestedTags = tagsParam.split(",").filter(Boolean) as MoodTag[];
  const moodTags = requestedTags.filter((t) => MOOD_TAGS.includes(t));

  if (moodTags.length < 1 || moodTags.length > 2) {
    return NextResponse.json(
      { error: "Select 1-2 mood tags for solo recommendations." },
      { status: 400 }
    );
  }

  const { data: profile, error: profileError } = await supabase
    .from("user_preference_profiles")
    .select("*")
    .eq("user_id", userData.user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: "Preference profile not found" }, { status: 404 });
  }

  const userProfile = toPreferenceProfile(profile);

  const [excludeFeedback, excludeDismissed] = await Promise.all([
    getFeedbackExclusions(supabase, [userData.user.id]),
    getDismissedExclusions(supabase, [userData.user.id], moodTags),
  ]);
  const excludeActivityIds = [...excludeFeedback, ...excludeDismissed];

  const results = scoreActivities(userProfile, moodTags, activities, {
    excludeActivityIds,
    topN: 10,
  });

  return NextResponse.json({ results, moodTags });
}
