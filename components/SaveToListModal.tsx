"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Activity } from "@/lib/scoring";

type ListSummary = { id: string; name: string };

type SaveToListModalProps = {
  activity: Activity | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SaveToListModal({ activity, open, onOpenChange }: SaveToListModalProps) {
  const [lists, setLists] = useState<ListSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [savedListIds, setSavedListIds] = useState<Set<string>>(new Set());
  const [newListName, setNewListName] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setSavedListIds(new Set());
      setNewListName("");
      setError(null);
      return;
    }

    setLoading(true);
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        setLoading(false);
        return;
      }
      supabase
        .from("saved_lists")
        .select("id, name")
        .eq("user_id", data.user.id)
        .order("created_at", { ascending: false })
        .then(({ data: listRows }) => {
          setLists(listRows ?? []);
          setLoading(false);
        });
    });
  }, [open]);

  async function saveTo(listId: string) {
    if (!activity) return;
    const supabase = createClient();
    const { error: insertError } = await supabase
      .from("saved_list_items")
      .insert({ list_id: listId, activity_id: activity.id });

    // Postgres unique_violation means it's already saved there — fine, not an error.
    if (insertError && insertError.code !== "23505") {
      setError(insertError.message);
      return;
    }
    setSavedListIds((prev) => new Set(prev).add(listId));
  }

  async function createAndSave(e: React.FormEvent) {
    e.preventDefault();
    if (!newListName.trim() || !activity) return;

    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const { data: list, error: createError } = await supabase
      .from("saved_lists")
      .insert({ user_id: userData.user.id, name: newListName.trim() })
      .select("id, name")
      .single();

    if (createError || !list) {
      setError(createError?.message ?? "Failed to create list.");
      return;
    }

    setLists((prev) => [list, ...prev]);
    setNewListName("");
    await saveTo(list.id);
  }

  if (!activity) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save &quot;{activity.name}&quot;</DialogTitle>
        </DialogHeader>

        {loading && <p className="text-sm text-muted-foreground">Loading lists...</p>}

        <div className="flex flex-col gap-2">
          {lists.map((list) => (
            <Button
              key={list.id}
              type="button"
              variant={savedListIds.has(list.id) ? "secondary" : "outline"}
              className="justify-start"
              onClick={() => saveTo(list.id)}
            >
              {savedListIds.has(list.id) ? `✓ ${list.name}` : list.name}
            </Button>
          ))}
          {!loading && lists.length === 0 && (
            <p className="text-sm text-muted-foreground">No lists yet — create one below.</p>
          )}
        </div>

        <form onSubmit={createAndSave} className="flex gap-2 border-t pt-3">
          <Input
            placeholder="New list name"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
          />
          <Button type="submit" disabled={!newListName.trim()}>
            Create &amp; save
          </Button>
        </form>

        {error && <p className="text-sm text-destructive">{error}</p>}
      </DialogContent>
    </Dialog>
  );
}
