import { notFound, redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { SavedListItemsView } from "./SavedListItemsView";
import type { Activity } from "@/lib/scoring";

export default async function SavedListPage({ params }: { params: { listId: string } }) {
  const supabase = await createServerSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    redirect("/sign-in");
  }

  const { data: list } = await supabase
    .from("saved_lists")
    .select("id, name")
    .eq("id", params.listId)
    .single();

  if (!list) {
    notFound();
  }

  const { data: items } = await supabase
    .from("saved_list_items")
    .select("id, activities(*)")
    .eq("list_id", params.listId);

  type ItemRow = { id: string; activities: Activity | null };

  const activityItems = ((items ?? []) as unknown as ItemRow[])
    .filter((i) => i.activities !== null)
    .map((i) => ({ itemId: i.id, activity: i.activities as Activity }));

  return (
    <SavedListItemsView listId={list.id} listName={list.name} initialItems={activityItems} />
  );
}
