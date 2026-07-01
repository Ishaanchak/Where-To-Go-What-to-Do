import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { RecommendationsView } from "./RecommendationsView";

export default async function RecommendationsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    redirect("/sign-in");
  }

  const { data: memberships } = await supabase
    .from("group_members")
    .select("group_sessions(id, name, mood_tags)")
    .eq("user_id", userData.user.id);

  type GroupRow = { id: string; name: string | null; mood_tags: string[] };

  const groupRows = ((memberships ?? []) as unknown as { group_sessions: GroupRow | null }[])
    .map((m) => m.group_sessions)
    .filter((g): g is GroupRow => g !== null);

  const groups = await Promise.all(
    groupRows.map(async (g) => {
      const { count } = await supabase
        .from("group_members")
        .select("*", { count: "exact", head: true })
        .eq("session_id", g.id);
      return { ...g, memberCount: count ?? 0 };
    })
  );

  return (
    <Suspense>
      <RecommendationsView groups={groups} />
    </Suspense>
  );
}
