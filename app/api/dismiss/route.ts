import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { activityId, moodTags } = body as { activityId?: string; moodTags?: string[] };

  if (!activityId || !moodTags || moodTags.length === 0) {
    return NextResponse.json({ error: "Missing activityId or moodTags" }, { status: 400 });
  }

  const { error } = await supabase.from("dismissed_activities").insert({
    user_id: userData.user.id,
    activity_id: activityId,
    mood_tags: moodTags,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
