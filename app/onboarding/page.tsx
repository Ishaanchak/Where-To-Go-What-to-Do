import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { OnboardingSwipeStack } from "./OnboardingSwipeStack";
import type { Activity } from "@/lib/scoring";

export default async function OnboardingPage() {
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
  const picked = shuffled.slice(0, 20);

  return (
    <div className="flex flex-1 flex-col">
      <OnboardingSwipeStack activities={picked} />
    </div>
  );
}
