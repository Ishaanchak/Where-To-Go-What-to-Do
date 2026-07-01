import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { SwipeStack } from "./SwipeStack";
import type { Activity } from "@/lib/scoring";

export default async function SwipePage() {
  const supabase = await createServerSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    redirect("/sign-in");
  }

  const userId = userData.user.id;

  const [{ data: allActivities }, { data: swiped }] = await Promise.all([
    supabase.from("activities").select("*"),
    supabase.from("swipe_history").select("activity_id").eq("user_id", userId),
  ]);

  const swipedIds = new Set((swiped ?? []).map((s) => s.activity_id));
  const unseen = (allActivities ?? []).filter((a) => !swipedIds.has(a.id)) as Activity[];
  const shuffled = [...unseen].sort(() => Math.random() - 0.5);
  const initialActivities = shuffled.slice(0, 10);

  return <SwipeStack initialActivities={initialActivities} hasSwipeHistory={swipedIds.size > 0} />;
}
