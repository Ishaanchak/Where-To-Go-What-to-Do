"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Activity } from "@/lib/scoring";

type FeedbackModalProps = {
  activity: Activity | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function FeedbackModal({ activity, open, onOpenChange }: FeedbackModalProps) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!activity || rating === 0) return;
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activityId: activity.id, rating }),
    });

    setSubmitting(false);

    if (!res.ok) {
      const json = await res.json();
      setError(json.error ?? "Failed to submit feedback.");
      return;
    }
    setSubmitted(true);
  }

  function handleOpenChange(next: boolean) {
    if (!next) {
      setRating(0);
      setHovered(0);
      setSubmitted(false);
      setError(null);
    }
    onOpenChange(next);
  }

  if (!activity) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>How was {activity.name}?</DialogTitle>
        </DialogHeader>

        {submitted ? (
          <p className="text-sm text-muted-foreground">Thanks for the feedback!</p>
        ) : (
          <>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onMouseEnter={() => setHovered(n)}
                  onMouseLeave={() => setHovered(0)}
                  onClick={() => setRating(n)}
                  aria-label={`${n} star`}
                >
                  <Star
                    className={cn(
                      "h-7 w-7",
                      (hovered || rating) >= n ? "fill-current" : "fill-none"
                    )}
                  />
                </button>
              ))}
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button onClick={handleSubmit} disabled={rating === 0 || submitting}>
              {submitting ? "Submitting..." : "Submit"}
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
