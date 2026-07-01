const FIELD_MASK =
  "places.id,places.displayName,places.formattedAddress,places.rating,places.priceLevel,places.regularOpeningHours";

const REVIEWS_FIELD_MASK = "reviews";

export type PlaceResult = {
  placeId: string;
  name: string;
  address: string;
  rating: number | null;
  priceLevel: string | null;
  openNow: boolean | null;
};

export type PlaceReview = {
  authorName: string;
  rating: number;
  text: string;
};

type GooglePlace = {
  id?: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  rating?: number;
  priceLevel?: string;
  regularOpeningHours?: { openNow?: boolean };
};

type GoogleReview = {
  authorAttribution?: { displayName?: string };
  rating?: number;
  text?: { text?: string };
  originalText?: { text?: string };
};

/** Calls Google Places Text Search (New). Server-only — uses GOOGLE_PLACES_API_KEY. */
export async function searchPlaces(query: string, near?: string): Promise<PlaceResult[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_PLACES_API_KEY is not configured");
  }

  const body: Record<string, unknown> = { textQuery: query };

  if (near) {
    const parts = near.split(",").map(Number);
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      // Use locationBias so results are anchored to the user's actual coordinates
      // regardless of which country Vercel's servers are in.
      body.locationBias = {
        circle: {
          center: { latitude: parts[0], longitude: parts[1] },
          radius: 50000,
        },
      };
    } else {
      body.textQuery = `${query} near ${near}`;
    }
  }

  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": FIELD_MASK,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Places API error: ${res.status}`);
  }

  const data = (await res.json()) as { places?: GooglePlace[] };
  const places = data.places ?? [];

  return places.slice(0, 5).map((p) => ({
    placeId: p.id ?? "",
    name: p.displayName?.text ?? "Unknown",
    address: p.formattedAddress ?? "",
    rating: p.rating ?? null,
    priceLevel: p.priceLevel ?? null,
    openNow: p.regularOpeningHours?.openNow ?? null,
  }));
}

/** Fetches up to 3 reviews for a place. Server-only — uses GOOGLE_PLACES_API_KEY. */
export async function getPlaceReviews(placeId: string): Promise<PlaceReview[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_PLACES_API_KEY is not configured");
  }

  const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
    headers: {
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": REVIEWS_FIELD_MASK,
    },
  });

  if (!res.ok) {
    throw new Error(`Places API error: ${res.status}`);
  }

  const data = (await res.json()) as { reviews?: GoogleReview[] };
  const reviews = data.reviews ?? [];

  return reviews.slice(0, 3).map((r) => ({
    authorName: r.authorAttribution?.displayName ?? "Anonymous",
    rating: r.rating ?? 0,
    text: r.text?.text ?? r.originalText?.text ?? "",
  }));
}
