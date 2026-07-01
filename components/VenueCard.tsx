"use client";

import { useState } from "react";
import { ExternalLink, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PlaceResult, PlaceReview } from "@/lib/places";

const PRICE_LEVEL_LABELS: Record<string, string> = {
  PRICE_LEVEL_FREE: "Free",
  PRICE_LEVEL_INEXPENSIVE: "$",
  PRICE_LEVEL_MODERATE: "$$",
  PRICE_LEVEL_EXPENSIVE: "$$$",
  PRICE_LEVEL_VERY_EXPENSIVE: "$$$$",
};

export function VenueCard({ venue }: { venue: PlaceResult }) {
  const [expanded, setExpanded] = useState(false);
  const [reviews, setReviews] = useState<PlaceReview[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleExpanded() {
    const next = !expanded;
    setExpanded(next);

    if (next && reviews === null && venue.placeId) {
      setLoading(true);
      setError(null);
      fetch("/api/places/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ placeId: venue.placeId }),
      })
        .then(async (res) => {
          const json = await res.json();
          if (!res.ok) {
            setError(json.error ?? "Could not load reviews.");
            return;
          }
          setReviews(json.reviews);
        })
        .catch(() => setError("Could not load reviews."))
        .finally(() => setLoading(false));
    }
  }

  return (
    <div className="rounded-lg border p-3">
      <button
        type="button"
        onClick={toggleExpanded}
        className="flex w-full flex-col items-start text-left"
      >
        <p className="font-medium">{venue.name}</p>
        {venue.address && <p className="text-sm text-muted-foreground">{venue.address}</p>}
        <div className="mt-1 flex gap-3 text-sm text-muted-foreground">
          {venue.rating !== null && <span>★ {venue.rating}</span>}
          {venue.priceLevel && (
            <span>{PRICE_LEVEL_LABELS[venue.priceLevel] ?? venue.priceLevel}</span>
          )}
          {venue.openNow !== null && <span>{venue.openNow ? "Open now" : "Closed"}</span>}
        </div>
      </button>

      {expanded && (
        <div className="mt-3 flex flex-col gap-3 border-t pt-3">
          {loading && <p className="text-sm text-muted-foreground">Loading reviews...</p>}
          {error && <p className="text-sm text-destructive">{error}</p>}
          {reviews?.map((review, i) => (
            <div key={i} className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-sm font-medium">
                <span>{review.authorName}</span>
                <span className="flex items-center gap-0.5 text-muted-foreground">
                  <Star className="h-3 w-3 fill-current" />
                  {review.rating}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{review.text}</p>
            </div>
          ))}
          {reviews && reviews.length === 0 && (
            <p className="text-sm text-muted-foreground">No reviews available.</p>
          )}
          {venue.placeId && (
            <a
              href={`https://www.google.com/maps/place/?q=place_id:${venue.placeId}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              <Button type="button" variant="outline" size="sm">
                <ExternalLink className="h-4 w-4" />
                View on Google
              </Button>
            </a>
          )}
        </div>
      )}
    </div>
  );
}
