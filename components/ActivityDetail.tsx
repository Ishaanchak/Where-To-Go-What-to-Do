"use client";

import { useEffect, useState } from "react";
import { Bookmark, Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VenueCard } from "@/components/VenueCard";
import { SaveToListModal } from "@/components/SaveToListModal";
import { FeedbackModal } from "@/components/FeedbackModal";
import { getAllChips } from "@/lib/activity-display";
import type { Activity } from "@/lib/scoring";
import type { PlaceResult } from "@/lib/places";

type ActivityDetailProps = {
  activity: Activity | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ActivityDetail({ activity, open, onOpenChange }: ActivityDetailProps) {
  const [venues, setVenues] = useState<PlaceResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveOpen, setSaveOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  useEffect(() => {
    if (!open || !activity) {
      setVenues(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    function fetchVenues(near?: string) {
      fetch("/api/places", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: activity!.places_query, near }),
      })
        .then(async (res) => {
          const json = await res.json();
          if (!res.ok) {
            setError(json.error ?? "Could not load nearby venues.");
            return;
          }
          setVenues(json.places);
        })
        .catch(() => setError("Could not load nearby venues."))
        .finally(() => setLoading(false));
    }

    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchVenues(`${pos.coords.latitude},${pos.coords.longitude}`),
        () => fetchVenues(undefined),
        { timeout: 5000 }
      );
    } else {
      fetchVenues(undefined);
    }
    // Intentionally fetch only once per open/activity — never re-fetch while the view is open.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, activity?.id]);

  if (!activity) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{activity.name}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-wrap gap-2">
          {getAllChips(activity).map((chip) => (
            <Badge key={chip} variant="secondary">
              {chip}
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => setSaveOpen(true)}>
            <Bookmark className="h-4 w-4" />
            Save
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => setFeedbackOpen(true)}>
            <Star className="h-4 w-4" />
            I did this
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold">Nearby Venues</h3>
          {loading && <p className="text-sm text-muted-foreground">Loading venues...</p>}
          {error && <p className="text-sm text-destructive">{error}</p>}
          {venues && venues.length === 0 && (
            <p className="text-sm text-muted-foreground">No venues found.</p>
          )}
          <div className="flex flex-col gap-2">
            {venues?.map((venue, i) => <VenueCard key={i} venue={venue} />)}
          </div>
        </div>
      </DialogContent>
      <SaveToListModal activity={activity} open={saveOpen} onOpenChange={setSaveOpen} />
      <FeedbackModal activity={activity} open={feedbackOpen} onOpenChange={setFeedbackOpen} />
    </Dialog>
  );
}
