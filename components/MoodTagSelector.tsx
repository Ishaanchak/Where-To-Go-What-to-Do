"use client";

import { MOOD_TAGS, MOOD_TAG_LABELS, type MoodTag } from "@/lib/scoring";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type MoodTagSelectorProps = {
  selected: MoodTag[];
  onChange: (tags: MoodTag[]) => void;
  disabled?: boolean;
};

export function MoodTagSelector({ selected, onChange, disabled }: MoodTagSelectorProps) {
  function toggle(tag: MoodTag) {
    if (disabled) return;
    if (selected.includes(tag)) {
      onChange(selected.filter((t) => t !== tag));
      return;
    }
    if (selected.length >= 2) {
      onChange([selected[1], tag]);
      return;
    }
    onChange([...selected, tag]);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {MOOD_TAGS.map((tag) => {
        const active = selected.includes(tag);
        return (
          <Badge
            key={tag}
            variant={active ? "default" : "secondary"}
            className={cn(
              !active && "border-(--pill-inactive-border)",
              disabled ? "opacity-60" : "cursor-pointer"
            )}
            onClick={() => toggle(tag)}
          >
            {MOOD_TAG_LABELS[tag]}
          </Badge>
        );
      })}
    </div>
  );
}
