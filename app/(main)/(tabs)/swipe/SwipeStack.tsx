"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import TinderCard from "react-tinder-card";
import { SwipeCard } from "@/components/SwipeCard";
import { ActivityDetail } from "@/components/ActivityDetail";
import { SaveToListModal } from "@/components/SaveToListModal";
import { OnboardingToast } from "@/components/OnboardingToast";
import type { Activity } from "@/lib/scoring";

const PRELOAD_THRESHOLD = 3;
const BATCH_SIZE = 10;

export function SwipeStack({
  initialActivities,
  hasSwipeHistory,
}: {
  initialActivities: Activity[];
  hasSwipeHistory: boolean;
}) {
  const [queue, setQueue] = useState<Activity[]>(initialActivities);
  const [exhausted, setExhausted] = useState(initialActivities.length === 0);
  const seenIds = useRef(new Set(initialActivities.map((a) => a.id)));
  const fetching = useRef(false);
  const [detailActivity, setDetailActivity] = useState<Activity | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [saveActivity, setSaveActivity] = useState<Activity | null>(null);
  const [saveOpen, setSaveOpen] = useState(false);
  const [hasSwiped, setHasSwiped] = useState(hasSwipeHistory);

  async function fetchMore() {
    if (fetching.current || exhausted) return;
    fetching.current = true;
    const exclude = Array.from(seenIds.current).join(",");
    const res = await fetch(
      `/api/activities/unseen?limit=${BATCH_SIZE}&exclude=${encodeURIComponent(exclude)}`
    );
    const { activities } = (await res.json()) as { activities: Activity[] };
    fetching.current = false;

    if (activities.length === 0) {
      setExhausted(true);
      return;
    }
    activities.forEach((a) => seenIds.current.add(a.id));
    setQueue((prev) => [...prev, ...activities]);
  }

  useEffect(() => {
    if (queue.length <= PRELOAD_THRESHOLD) {
      fetchMore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue.length]);

  async function logSwipe(activityId: string, direction: "left" | "right") {
    await fetch("/api/swipe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activityId, direction }),
    });
  }

  function handleSwipe(direction: string, activity: Activity) {
    if (direction !== "left" && direction !== "right") return;
    logSwipe(activity.id, direction);
    setQueue((prev) => prev.filter((a) => a.id !== activity.id));
    setHasSwiped(true);
  }

  const visible = queue.slice(0, 3);

  if (queue.length === 0 && exhausted) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center">
        <p className="text-lg font-medium">You&apos;ve seen everything!</p>
        <p className="text-sm text-muted-foreground">Check back later for more activities.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center gap-6 p-6">
      {!hasSwiped && (
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-xl font-bold text-foreground">
            Start swiping to discover activities
          </p>
          <Link href="/recommendations" className="text-sm text-muted-foreground underline">
            Or skip for now to explore recommendations
          </Link>
        </div>
      )}
      <div className="relative h-[28rem] w-full max-w-sm">
        {[...visible].reverse().map((activity) => (
          <TinderCard
            key={activity.id}
            className="absolute inset-0"
            onSwipe={(dir) => handleSwipe(dir, activity)}
            preventSwipe={["up", "down"]}
          >
            <SwipeCard
              activity={activity}
              onTap={() => {
                setDetailActivity(activity);
                setDetailOpen(true);
              }}
              onSave={() => {
                setSaveActivity(activity);
                setSaveOpen(true);
              }}
            />
          </TinderCard>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        Swipe right to like, left to pass — the algorithm learns your preferences as you go.
      </p>
      <ActivityDetail activity={detailActivity} open={detailOpen} onOpenChange={setDetailOpen} />
      <SaveToListModal activity={saveActivity} open={saveOpen} onOpenChange={setSaveOpen} />
      <OnboardingToast
        storageKey="toast_swipe_tab_seen"
        message="Spotted something fun? Tap the card to dig into the details and find great venues near you."
      />
    </div>
  );
}
