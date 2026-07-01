import { notFound, redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { LobbyView } from "./LobbyView";

export default async function GroupLobbyPage({ params }: { params: { groupId: string } }) {
  const supabase = await createServerSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    redirect("/sign-in");
  }

  const { data: session } = await supabase
    .from("group_sessions")
    .select("id, name, invite_code, mood_tags, created_by")
    .eq("id", params.groupId)
    .single();

  if (!session) {
    notFound();
  }

  const { data: members } = await supabase
    .from("group_members")
    .select("user_id, profiles(username)")
    .eq("session_id", params.groupId);

  type MemberRow = { user_id: string; profiles: { username: string | null } | null };

  const memberList = ((members ?? []) as unknown as MemberRow[]).map((m) => ({
    userId: m.user_id,
    username: m.profiles?.username || "member",
  }));

  return (
    <LobbyView
      session={session}
      members={memberList}
      isCreator={session.created_by === userData.user.id}
    />
  );
}
