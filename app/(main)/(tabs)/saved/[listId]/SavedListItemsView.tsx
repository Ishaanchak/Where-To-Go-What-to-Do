"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bookmark, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { getCardChips } from "@/lib/activity-display";
import { Badge } from "@/components/ui/badge";
import { ActivityDetail } from "@/components/ActivityDetail";
import { SaveToListModal } from "@/components/SaveToListModal";
import type { Activity } from "@/lib/scoring";

type Item = { itemId: string; activity: Activity };

export function SavedListItemsView({
  listId,
  listName,
  initialItems,
}: {
  listId: string;
  listName: string;
  initialItems: Item[];
}) {
  const [items, setItems] = useState(initialItems);
  const [detailActivity, setDetailActivity] = useState<Activity | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [saveActivity, setSaveActivity] = useState<Activity | null>(null);
  const [saveOpen, setSaveOpen] = useState(false);

  async function removeItem(itemId: string) {
    const supabase = createClient();
    const { error } = await supabase.from("saved_list_items").delete().eq("id", itemId);
    if (!error) {
      setItems((prev) => prev.filter((i) => i.itemId !== itemId));
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center gap-2">
        <Link href="/saved">
          <Button variant="ghost" size="icon" aria-label="Back to lists">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold">{listName}</h1>
      </div>

      <div className="flex flex-col gap-3">
        {items.map(({ itemId, activity }) => (
          <div
            key={itemId}
            onClick={() => {
              setDetailActivity(activity);
              setDetailOpen(true);
            }}
            className="flex items-start justify-between gap-3 rounded-xl border bg-card p-4 shadow-sm cursor-pointer transition-colors hover:bg-secondary/30"
          >
            <div className="flex flex-col gap-2">
              <h3 className="font-medium">{activity.name}</h3>
              <div className="flex flex-wrap gap-2">
                {getCardChips(activity).map((chip) => (
                  <Badge key={chip} variant="secondary">
                    {chip}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Save to another list"
                onClick={(e) => {
                  e.stopPropagation();
                  setSaveActivity(activity);
                  setSaveOpen(true);
                }}
              >
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Remove from list"
                onClick={(e) => {
                  e.stopPropagation();
                  removeItem(itemId);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground">No activities saved to this list yet.</p>
        )}
      </div>

      <ActivityDetail activity={detailActivity} open={detailOpen} onOpenChange={setDetailOpen} />
      <SaveToListModal activity={saveActivity} open={saveOpen} onOpenChange={setSaveOpen} />
    </div>
  );
}
