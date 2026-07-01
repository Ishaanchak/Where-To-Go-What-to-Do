import type { Activity, Dimension } from "@/lib/scoring";

/** Human-readable label for a single dimension's 1-5 score, per preference-dimensions.md. */
function labelFor(dimension: Dimension, value: number): string {
  switch (dimension) {
    case "budget":
      if (value <= 1) return "free";
      if (value <= 2) return "low budget";
      if (value <= 3) return "moderate cost";
      if (value <= 4) return "pricey";
      return "splurge";
    case "physical_intensity":
      if (value <= 1) return "low-key";
      if (value <= 2) return "light activity";
      if (value <= 3) return "moderate activity";
      if (value <= 4) return "active";
      return "intense";
    case "competitiveness":
      if (value <= 2) return "casual";
      if (value <= 3) return "moderately competitive";
      if (value <= 4) return "competitive";
      return "high stakes";
    case "group_size":
      if (value <= 1) return "solo/duo";
      if (value <= 2) return "small group";
      if (value <= 3) return "group";
      if (value <= 4) return "large group";
      return "big crowd";
    case "outdoor":
      if (value <= 2) return "indoors";
      if (value <= 3) return "indoor/outdoor";
      return "outdoors";
    case "duration":
      if (value <= 1) return "quick";
      if (value <= 2) return "short";
      if (value <= 3) return "a few hours";
      if (value <= 4) return "half-day";
      return "all-day";
    case "novelty":
      if (value <= 2) return "classic";
      if (value <= 3) return "unique";
      return "unusual";
  }
}

/** 3 chips shown on Swipe/Recommendation cards, e.g. "outdoors · low budget · active". */
export function getCardChips(activity: Activity): string[] {
  return [
    labelFor("outdoor", activity.outdoor),
    labelFor("budget", activity.budget),
    labelFor("physical_intensity", activity.physical_intensity),
  ];
}

/** All 7 chips, shown on Activity Detail. */
export function getAllChips(activity: Activity): string[] {
  return [
    labelFor("budget", activity.budget),
    labelFor("physical_intensity", activity.physical_intensity),
    labelFor("competitiveness", activity.competitiveness),
    labelFor("group_size", activity.group_size),
    labelFor("outdoor", activity.outdoor),
    labelFor("duration", activity.duration),
    labelFor("novelty", activity.novelty),
  ];
}
