"use client";

import { Bookmark } from "lucide-react";
import type { Activity } from "@/lib/scoring";
import { getCardChips } from "@/lib/activity-display";
import { getActivityIcon } from "@/lib/activity-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type ActivityCardProps = {
  activity: Activity;
  onTap?: () => void;
  onSave?: () => void;
};

export function ActivityCard({ activity, onTap, onSave }: ActivityCardProps) {
  const chips = getCardChips(activity);

  return (
    <div
      onClick={onTap}
      className="relative flex flex-col items-center gap-3 rounded-xl border bg-card p-6 text-center shadow-sm transition-colors hover:bg-secondary/30 cursor-pointer"
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
          className="absolute top-2 right-2"
        >
          <Bookmark className="h-5 w-5" />
        </Button>
      )}
      <span className="text-6xl">{getActivityIcon(activity.name)}</span>
      <h3 className="font-bold">{activity.name}</h3>
      <div className="flex flex-wrap justify-center gap-2">
        {chips.map((chip) => (
          <Badge key={chip} variant="secondary">
            {chip}
          </Badge>
        ))}
      </div>
    </div>
  );
}
