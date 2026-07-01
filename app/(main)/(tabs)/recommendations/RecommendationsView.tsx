"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ActivityCard } from "@/components/ActivityCard";
import { MoodTagSelector } from "@/components/MoodTagSelector";
import { GroupContextSwitcher, type GroupOption } from "@/components/GroupContextSwitcher";
import { ActivityDetail } from "@/components/ActivityDetail";
import { SaveToListModal } from "@/components/SaveToListModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOOD_TAG_LABELS, type Activity, type MoodTag, type ScoredActivity } from "@/lib/scoring";

type Group = GroupOption & { mood_tags: string[]; memberCount: number };

export function RecommendationsView({ groups }: { groups: Group[] }) {
  const searchParams = useSearchParams();
  const initialGroup = searchParams.get("group");
  const [context, setContext] = useState<"solo" | string>(
    initialGroup && groups.some((g) => g.id === initialGroup) ? initialGroup : "solo"
  );
  const [moodTags, setMoodTags] = useState<MoodTag[]>(["chill"]);
  const [results, setResults] = useState<ScoredActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detailActivity, setDetailActivity] = useState<Activity | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [saveActivity, setSaveActivity] = useState<Activity | null>(null);
  const [saveOpen, setSaveOpen] = useState(false);
  const [dismissingIds, setDismissingIds] = useState<Set<string>>(new Set());

  const activeGroup = context === "solo" ? null : groups.find((g) => g.id === context) ?? null;
  const effectiveMoodTags = context === "solo" ? moodTags : (activeGroup?.mood_tags ?? []);

  function handleDismiss(activity: Activity) {
    setDismissingIds((prev) => new Set(prev).add(activity.id));

    fetch("/api/dismiss", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activityId: activity.id, moodTags: effectiveMoodTags }),
    });

    setTimeout(() => {
      setResults((prev) => prev.filter((r) => r.activity.id !== activity.id));
      setDismissingIds((prev) => {
        const next = new Set(prev);
        next.delete(activity.id);
        return next;
      });
    }, 300);
  }

  const needsMoreMembers = activeGroup !== null && activeGroup.memberCount < 2;

  useEffect(() => {
    if (effectiveMoodTags.length < 1 || needsMoreMembers) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (context === "solo") {
      params.set("tags", moodTags.join(","));
    } else {
      params.set("groupId", context);
    }

    fetch(`/api/recommendations?${params.toString()}`)
      .then(async (res) => {
        const json = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setError(json.error ?? "Failed to load recommendations.");
          setResults([]);
          return;
        }
        setResults(json.results);
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load recommendations.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context, moodTags.join(","), needsMoreMembers]);

  return (
    <div className="mx-auto flex w-full max-w-[600px] flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between gap-2">
        <GroupContextSwitcher groups={groups} value={context} onChange={setContext} />
        <div className="flex shrink-0 gap-1">
          <Link href="/groups/create">
            <Button variant="outline" size="sm">
              New group
            </Button>
          </Link>
          <Link href="/groups/join">
            <Button variant="outline" size="sm">
              Join
            </Button>
          </Link>
        </div>
      </div>

      {context === "solo" ? (
        <MoodTagSelector selected={moodTags} onChange={setMoodTags} />
      ) : (
        <div className="flex flex-wrap gap-2">
          {effectiveMoodTags.map((tag) => (
            <Badge key={tag} variant="default">
              {MOOD_TAG_LABELS[tag as MoodTag] ?? tag}
            </Badge>
          ))}
        </div>
      )}

      {needsMoreMembers && activeGroup && (
        <div className="flex flex-col items-start gap-2 rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">
            Waiting for more members to join before recommendations are available.
          </p>
          <Link href={`/groups/${activeGroup.id}/lobby`}>
            <Button size="sm">View lobby</Button>
          </Link>
        </div>
      )}

      {!needsMoreMembers && loading && (
        <p className="text-sm text-muted-foreground">Loading recommendations...</p>
      )}
      {!needsMoreMembers && error && <p className="text-sm text-destructive">{error}</p>}

      {!needsMoreMembers && (
        <div className="flex flex-col gap-3">
          {results.map(({ activity }) => (
            <ActivityCard
              key={activity.id}
              activity={activity as Activity}
              dismissing={dismissingIds.has(activity.id)}
              onTap={() => {
                setDetailActivity(activity as Activity);
                setDetailOpen(true);
              }}
              onSave={() => {
                setSaveActivity(activity as Activity);
                setSaveOpen(true);
              }}
              onDismiss={() => handleDismiss(activity as Activity)}
            />
          ))}
        </div>
      )}

      {!needsMoreMembers && !loading && !error && results.length === 0 && (
        <p className="text-sm text-muted-foreground">No recommendations to show yet.</p>
      )}

      <ActivityDetail activity={detailActivity} open={detailOpen} onOpenChange={setDetailOpen} />
      <SaveToListModal activity={saveActivity} open={saveOpen} onOpenChange={setSaveOpen} />
    </div>
  );
}
