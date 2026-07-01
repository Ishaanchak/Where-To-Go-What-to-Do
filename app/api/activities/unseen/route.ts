import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit") ?? "10");
  const clientExclude = (searchParams.get("exclude") ?? "")
    .split(",")
    .filter(Boolean);

  const [{ data: allActivities, error: activitiesError }, { data: swiped, error: swipedError }] =
    await Promise.all([
      supabase.from("activities").select("*"),
      supabase.from("swipe_history").select("activity_id").eq("user_id", userData.user.id),
    ]);

  if (activitiesError) {
    return NextResponse.json({ error: activitiesError.message }, { status: 500 });
  }
  if (swipedError) {
    return NextResponse.json({ error: swipedError.message }, { status: 500 });
  }

  const excludeSet = new Set([
    ...(swiped ?? []).map((s) => s.activity_id),
    ...clientExclude,
  ]);

  const unseen = (allActivities ?? []).filter((a) => !excludeSet.has(a.id));
  const shuffled = unseen.sort(() => Math.random() - 0.5).slice(0, limit);

  return NextResponse.json({ activities: shuffled });
}
