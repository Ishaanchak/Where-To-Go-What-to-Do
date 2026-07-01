import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getActivityIcon } from "@/lib/activity-icons";
import { SavedListsView } from "./SavedListsView";

export default async function SavedPage() {
  const supabase = await createServerSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    redirect("/sign-in");
  }

  const { data } = await supabase
    .from("saved_lists")
    .select("id, name, saved_list_items(count)")
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false });

  type ListRow = { id: string; name: string; saved_list_items: { count: number }[] };

  const listRows = (data ?? []) as unknown as ListRow[];

  const lists = await Promise.all(
    listRows.map(async (l) => {
      const { data: previewItems } = await supabase
        .from("saved_list_items")
        .select("activities(name)")
        .eq("list_id", l.id)
        .order("saved_at", { ascending: true })
        .limit(3);

      type PreviewRow = { activities: { name: string } | null };

      const emojis = ((previewItems ?? []) as unknown as PreviewRow[])
        .filter((item) => item.activities !== null)
        .map((item) => getActivityIcon(item.activities!.name));

      return {
        id: l.id,
        name: l.name,
        itemCount: l.saved_list_items[0]?.count ?? 0,
        emojis,
      };
    })
  );

  return <SavedListsView initialLists={lists} />;
}
