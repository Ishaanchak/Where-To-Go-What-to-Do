"use client";

import { cn } from "@/lib/utils";

export type GroupOption = {
  id: string;
  name: string | null;
};

type GroupContextSwitcherProps = {
  groups: GroupOption[];
  value: "solo" | string;
  onChange: (value: "solo" | string) => void;
};

export function GroupContextSwitcher({ groups, value, onChange }: GroupContextSwitcherProps) {
  return (
    <div className="flex flex-wrap gap-1 border-b pb-2">
      <button
        type="button"
        onClick={() => onChange("solo")}
        className={cn(
          "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
          value === "solo"
            ? "bg-secondary text-secondary-foreground"
            : "text-muted-foreground hover:bg-secondary/50"
        )}
      >
        Solo
      </button>
      {groups.map((group) => (
        <button
          key={group.id}
          type="button"
          onClick={() => onChange(group.id)}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            value === group.id
              ? "bg-secondary text-secondary-foreground"
              : "text-muted-foreground hover:bg-secondary/50"
          )}
        >
          {group.name || "Untitled group"}
        </button>
      ))}
    </div>
  );
}
