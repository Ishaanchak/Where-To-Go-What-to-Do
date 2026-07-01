import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { FriendsView } from "./FriendsView";

export type FriendProfile = { id: string; username: string | null };
export type PendingRequest = { requestId: string; profile: FriendProfile };

export default async function FriendsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    redirect("/sign-in");
  }

  const userId = userData.user.id;

  const { data: rows } = await supabase
    .from("friend_requests")
    .select("id, sender_id, receiver_id, status")
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);

  const allRows = rows ?? [];
  const otherIds = Array.from(
    new Set(allRows.map((r) => (r.sender_id === userId ? r.receiver_id : r.sender_id)))
  );

  const { data: profileRows } = otherIds.length
    ? await supabase.from("profiles").select("id, username").in("id", otherIds)
    : { data: [] as { id: string; username: string | null }[] };

  const profileMap = new Map(
    (profileRows ?? []).map((p) => [p.id, { id: p.id, username: p.username }])
  );

  const friends: FriendProfile[] = [];
  const incoming: PendingRequest[] = [];
  const outgoing: PendingRequest[] = [];

  for (const row of allRows) {
    const otherId = row.sender_id === userId ? row.receiver_id : row.sender_id;
    const profile = profileMap.get(otherId);
    if (!profile) continue;

    if (row.status === "accepted") {
      friends.push(profile);
    } else if (row.status === "pending" && row.receiver_id === userId) {
      incoming.push({ requestId: row.id, profile });
    } else if (row.status === "pending" && row.sender_id === userId) {
      outgoing.push({ requestId: row.id, profile });
    }
  }

  return <FriendsView initialFriends={friends} initialIncoming={incoming} initialOutgoing={outgoing} />;
}
