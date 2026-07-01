"use client";

import { useState } from "react";
import TinderCard from "react-tinder-card";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { SwipeCard } from "@/components/SwipeCard";
import { Button } from "@/components/ui/button";
import { OnboardingToast } from "@/components/OnboardingToast";
import type { Activity } from "@/lib/scoring";

export function OnboardingSwipeStack({ activities }: { activities: Activity[] }) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [finishing, setFinishing] = useState(false);

  const total = activities.length;
  const remaining = activities.slice(index, index + 3);

  async function logSwipe(activityId: string, direction: "left" | "right") {
    await fetch("/api/swipe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activityId, direction }),
    });
  }

  async function finishOnboarding() {
    if (finishing) return;
    setFinishing(true);
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      await supabase
        .from("profiles")
        .update({ onboarded_at: new Date().toISOString() })
        .eq("id", data.user.id);
    }
    router.push("/swipe");
    router.refresh();
  }

  async function handleSwipe(direction: string, activity: Activity) {
    if (direction !== "left" && direction !== "right") return;
    await logSwipe(activity.id, direction);
    const next = index + 1;
    if (next >= total) {
      finishOnboarding();
    } else {
      setIndex(next);
    }
  }

  if (total === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
        <p className="text-muted-foreground">No activities to show right now.</p>
        <Button onClick={finishOnboarding} disabled={finishing}>
          Continue
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center gap-6 p-6">
      <div className="flex w-full max-w-sm items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {Math.min(index, total)} / {total}
        </p>
        <Button variant="ghost" size="sm" onClick={finishOnboarding} disabled={finishing}>
          Skip
        </Button>
      </div>
      <div className="relative h-[28rem] w-full max-w-sm">
        {[...remaining].reverse().map((activity) => (
          <TinderCard
            key={activity.id}
            className="absolute inset-0"
            onSwipe={(dir) => handleSwipe(dir, activity)}
            preventSwipe={["up", "down"]}
          >
            <SwipeCard activity={activity} />
          </TinderCard>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">Swipe right to like, left to pass.</p>
      <OnboardingToast
        storageKey="toast_swipe_seen"
        message="Swipe right to like an activity, left to pass. Tap any card for more details and venues near you."
      />
    </div>
  );
}
