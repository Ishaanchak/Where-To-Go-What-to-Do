import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { updatePreferenceProfile, toPreferenceProfile, type Activity } from "@/lib/scoring";

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { activityId, rating, sessionId } = body as {
    activityId: string;
    rating: number;
    sessionId?: string;
  };

  if (!activityId || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const userId = userData.user.id;

  const { error: insertError } = await supabase.from("feedback").insert({
    user_id: userId,
    activity_id: activityId,
    session_id: sessionId ?? null,
    rating,
  });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  // Rating 3 = neutral, no preference update per scoring-algorithm.md.
  if (rating === 3) {
    return NextResponse.json({ updated: false });
  }

  const direction = rating >= 4 ? "right" : "left";

  const [{ data: activity, error: activityError }, { data: profile, error: profileError }] =
    await Promise.all([
      supabase.from("activities").select("*").eq("id", activityId).single(),
      supabase.from("user_preference_profiles").select("*").eq("user_id", userId).single(),
    ]);

  if (activityError || !activity) {
    return NextResponse.json({ error: "Activity not found" }, { status: 404 });
  }
  if (profileError || !profile) {
    return NextResponse.json({ error: "Preference profile not found" }, { status: 404 });
  }

  const currentProfile = toPreferenceProfile(profile);
  const updatedProfile = updatePreferenceProfile(currentProfile, activity as Activity, direction);

  const { error: updateError } = await supabase
    .from("user_preference_profiles")
    .update(updatedProfile)
    .eq("user_id", userId);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ updated: true, profile: updatedProfile });
}
