"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/EmptyState";

type ListSummary = { id: string; name: string; itemCount: number; emojis: string[] };

export function SavedListsView({ initialLists }: { initialLists: ListSummary[] }) {
  const [lists, setLists] = useState(initialLists);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function createList(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;

    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const { data, error: insertError } = await supabase
      .from("saved_lists")
      .insert({ user_id: userData.user.id, name: newName.trim() })
      .select("id, name")
      .single();

    if (insertError || !data) {
      setError(insertError?.message ?? "Failed to create list.");
      return;
    }

    setLists((prev) => [{ id: data.id, name: data.name, itemCount: 0, emojis: [] }, ...prev]);
    setNewName("");
    setCreating(false);
    setError(null);
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Saved Lists</h1>
        <Button size="sm" onClick={() => setCreating((v) => !v)}>
          <Plus className="h-4 w-4" />
          New List
        </Button>
      </div>

      {creating && (
        <form onSubmit={createList} className="flex gap-2">
          <Input
            autoFocus
            placeholder="List name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <Button type="submit">Create</Button>
        </form>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}

      {lists.length > 0 && (
        <div className="flex flex-col gap-3">
          {lists.map((list) => (
            <Link key={list.id} href={`/saved/${list.id}`}>
              <Card className="transition-colors hover:bg-secondary/30">
                <CardContent className="flex items-center justify-between py-4">
                  <span className="font-medium">{list.name}</span>
                  <span className="flex items-center gap-2">
                    {list.emojis.length > 0 && (
                      <span className="flex gap-1 text-lg">
                        {list.emojis.map((emoji, i) => (
                          <span key={i}>{emoji}</span>
                        ))}
                      </span>
                    )}
                    <span className="text-sm text-muted-foreground">
                      {list.itemCount} {list.itemCount === 1 ? "activity" : "activities"}
                    </span>
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
      {lists.length === 0 && (
        <EmptyState
          emoji="🔖"
          title="No saved lists yet"
          subtitle="Save activities you want to revisit"
          ctaLabel="+ New List"
          onCtaClick={() => setCreating(true)}
        />
      )}
    </div>
  );
}
