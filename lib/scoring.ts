/**
 * Pure, deterministic scoring per scoring-algorithm.md. No I/O — callers
 * (Route Handlers) fetch profiles/activities/exclusions and pass them in.
 */

export const DIMENSIONS = [
  "budget",
  "physical_intensity",
  "competitiveness",
  "group_size",
  "outdoor",
  "duration",
  "novelty",
] as const;

export type Dimension = (typeof DIMENSIONS)[number];

export type PreferenceProfile = Record<Dimension, number>;

/** Picks just the 7 dimension fields off a DB row (e.g. a Supabase result). */
export function toPreferenceProfile(row: Record<string, number>): PreferenceProfile {
  return Object.fromEntries(DIMENSIONS.map((d) => [d, row[d]])) as PreferenceProfile;
}

export type Activity = {
  id: string;
  name: string;
  places_query: string;
  places_type: string | null;
} & PreferenceProfile;

export const MOOD_TAGS = [
  "chill",
  "active",
  "social",
  "adventure",
  "date_night",
  "wild_night_out",
  "budget_friendly",
] as const;

export type MoodTag = (typeof MOOD_TAGS)[number];

export const MOOD_TAG_LABELS: Record<MoodTag, string> = {
  chill: "Chill",
  active: "Active",
  social: "Social",
  adventure: "Adventure",
  date_night: "Date Night",
  wild_night_out: "Wild Night Out",
  budget_friendly: "Budget-Friendly",
};

export type ScoredActivity = { activity: Activity; score: number };

const MOOD_ADJUSTMENTS: Record<MoodTag, PreferenceProfile> = {
  chill: {
    budget: 0,
    physical_intensity: -1.5,
    competitiveness: -1.5,
    group_size: 0,
    outdoor: 0,
    duration: 0,
    novelty: -1,
  },
  active: {
    budget: 0,
    physical_intensity: 2,
    competitiveness: 1,
    group_size: 0,
    outdoor: 1.5,
    duration: 1,
    novelty: 0,
  },
  social: {
    budget: 0,
    physical_intensity: 0,
    competitiveness: -0.5,
    group_size: 2,
    outdoor: 0,
    duration: 0,
    novelty: 0,
  },
  adventure: {
    budget: 0,
    physical_intensity: 1,
    competitiveness: 0,
    group_size: 0,
    outdoor: 2,
    duration: 1,
    novelty: 2,
  },
  date_night: {
    budget: 1,
    physical_intensity: 0,
    competitiveness: -1.5,
    group_size: -2,
    outdoor: 0,
    duration: 1,
    novelty: 1,
  },
  wild_night_out: {
    budget: 0,
    physical_intensity: 0,
    competitiveness: 1,
    group_size: 1.5,
    outdoor: -2,
    duration: 0,
    novelty: 2,
  },
  budget_friendly: {
    budget: -2,
    physical_intensity: 0,
    competitiveness: 0,
    group_size: 0,
    outdoor: 0,
    duration: 0,
    novelty: 0,
  },
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Averages mood adjustments across 1-2 selected tags. */
function averagedAdjustment(moodTags: MoodTag[]): PreferenceProfile {
  const sum: PreferenceProfile = {
    budget: 0,
    physical_intensity: 0,
    competitiveness: 0,
    group_size: 0,
    outdoor: 0,
    duration: 0,
    novelty: 0,
  };
  for (const tag of moodTags) {
    for (const d of DIMENSIONS) {
      sum[d] += MOOD_ADJUSTMENTS[tag][d];
    }
  }
  for (const d of DIMENSIONS) {
    sum[d] /= moodTags.length;
  }
  return sum;
}

/** Step 1 — shift a global preference profile by the session's mood tag(s). */
export function getEffectivePreferences(
  globalPref: PreferenceProfile,
  moodTags: MoodTag[]
): PreferenceProfile {
  const adjustment = averagedAdjustment(moodTags);
  const effective = {} as PreferenceProfile;
  for (const d of DIMENSIONS) {
    effective[d] = clamp(globalPref[d] + adjustment[d], 1.0, 5.0);
  }
  return effective;
}

/** Step 2 — match score (0-1) between an effective preference profile and one activity. */
export function scoreActivityForProfile(
  effectivePref: PreferenceProfile,
  activity: Activity
): number {
  const dimensionScores = DIMENSIONS.map((d) =>
    clamp((5 - Math.abs(effectivePref[d] - activity[d])) / 4, 0, 1)
  );
  return dimensionScores.reduce((a, b) => a + b, 0) / dimensionScores.length;
}

/** Step 3 — combine individual member scores into one group score. */
export function combineGroupScores(memberScores: number[]): number {
  const mean = memberScores.reduce((a, b) => a + b, 0) / memberScores.length;
  const min = Math.min(...memberScores);
  return 0.6 * mean + 0.4 * min;
}

export type ScoreActivitiesOptions = {
  /** Activity ids to exclude (e.g. ones already rated via feedback). */
  excludeActivityIds?: Iterable<string>;
  /** If provided, only the top N results are returned. */
  topN?: number;
};

/**
 * Scores and ranks activities for a solo user (single profile) or a group
 * (array of member profiles), against 1-2 mood tags.
 */
export function scoreActivities(
  profiles: PreferenceProfile | PreferenceProfile[],
  moodTags: MoodTag[],
  activities: Activity[],
  options: ScoreActivitiesOptions = {}
): ScoredActivity[] {
  const memberProfiles = Array.isArray(profiles) ? profiles : [profiles];
  const effectivePrefs = memberProfiles.map((p) => getEffectivePreferences(p, moodTags));

  const excludeSet = options.excludeActivityIds
    ? new Set(options.excludeActivityIds)
    : undefined;
  const candidates = excludeSet
    ? activities.filter((a) => !excludeSet.has(a.id))
    : activities;

  const scored: ScoredActivity[] = candidates.map((activity) => {
    const memberScores = effectivePrefs.map((ep) => scoreActivityForProfile(ep, activity));
    const score =
      memberScores.length === 1 ? memberScores[0] : combineGroupScores(memberScores);
    return { activity, score };
  });

  scored.sort((a, b) => b.score - a.score);

  return options.topN !== undefined ? scored.slice(0, options.topN) : scored;
}

/** Preference update formula — applied after every swipe and after feedback (rating 4-5 or 1-2). */
export function updatePreferenceProfile(
  currentProfile: PreferenceProfile,
  activity: Activity,
  direction: "right" | "left",
  alpha = 0.2
): PreferenceProfile {
  const updated = {} as PreferenceProfile;
  for (const d of DIMENSIONS) {
    const signal = direction === "right" ? activity[d] : 6 - activity[d];
    updated[d] = clamp(alpha * signal + (1 - alpha) * currentProfile[d], 1.0, 5.0);
  }
  return updated;
}
