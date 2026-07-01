"use client";

import { Bookmark, ThumbsDown } from "lucide-react";
import type { Activity } from "@/lib/scoring";
import { getCardChips } from "@/lib/activity-display";
import { getActivityIcon } from "@/lib/activity-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ActivityCardProps = {
  activity: Activity;
  onTap?: () => void;
  onSave?: () => void;
  onDismiss?: () => void;
  dismissing?: boolean;
};

export function ActivityCard({
  activity,
  onTap,
  onSave,
  onDismiss,
  dismissing,
}: ActivityCardProps) {
  const chips = getCardChips(activity);

  return (
    <div
      onClick={onTap}
      className={cn(
        "relative flex flex-col items-center gap-3 rounded-xl border bg-card p-6 text-center shadow-sm transition-all duration-300 hover:bg-secondary/30 cursor-pointer",
        dismissing && "pointer-events-none scale-95 opacity-0"
      )}
    >
      <div className="absolute top-2 right-2 flex gap-1">
        {onDismiss && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDismiss();
            }}
            aria-label="Not interested"
          >
            <ThumbsDown className="h-5 w-5" />
          </Button>
        )}
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
          >
            <Bookmark className="h-5 w-5" />
          </Button>
        )}
      </div>
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
