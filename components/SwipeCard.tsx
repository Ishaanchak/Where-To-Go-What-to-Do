"use client";

import { Bookmark } from "lucide-react";
import type { Activity } from "@/lib/scoring";
import { getCardChips } from "@/lib/activity-display";
import { getActivityIcon } from "@/lib/activity-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type SwipeCardProps = {
  activity: Activity;
  onTap?: () => void;
  onSave?: () => void;
};

export function SwipeCard({ activity, onTap, onSave }: SwipeCardProps) {
  const chips = getCardChips(activity);

  return (
    <div
      onClick={onTap}
      className="relative flex h-full w-full flex-col items-center justify-center gap-3 rounded-2xl border bg-card px-6 py-3 text-center shadow-[var(--shadow-card-lift)] select-none"
    >
      {onSave && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onSave();
          }}
          aria-label="Save to list"
          className="absolute top-3 right-3"
        >
          <Bookmark className="h-5 w-5" />
        </Button>
      )}
      <span className="text-6xl">{getActivityIcon(activity.name)}</span>
      <h2 className="text-2xl font-bold">{activity.name}</h2>
      <div className="flex flex-wrap justify-center gap-2">
        {chips.map((chip) => (
          <Badge
            key={chip}
            variant="outline"
            className="border-transparent bg-(--chip-tint-bg) text-(--chip-tint-text)"
          >
            {chip}
          </Badge>
        ))}
      </div>
    </div>
  );
}
