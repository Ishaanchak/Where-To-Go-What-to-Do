# Scoring Algorithm

All recommendations are generated deterministically at runtime. No ML, no LLM calls.

---

## Core Concept

Each activity has 7 attribute scores (1–5). Each user has a preference profile with 7 scores (1–5). A high match score means the activity's attributes closely align with the user's preferences.

---

## Step 1 — Apply Mood Adjustments

Before scoring, shift the user's preference vector based on the session's mood tag. This creates an **effective preference profile** for that session without modifying the stored global profile.

```
effective_pref[d] = clamp(global_pref[d] + mood_adjustment[d], 1.0, 5.0)
```

### Mood Tags & Adjustments

| Mood | budget | physical | competitive | group_size | outdoor | duration | novelty |
|------|--------|----------|-------------|------------|---------|----------|---------|
| Chill | 0 | -1.5 | -1.5 | 0 | 0 | 0 | -1 |
| Active | 0 | +2 | +1 | 0 | +1.5 | +1 | 0 |
| Social | 0 | 0 | -0.5 | +2 | 0 | 0 | 0 |
| Adventure | 0 | +1 | 0 | 0 | +2 | +1 | +2 |
| Date Night | +1 | 0 | -1.5 | -2 | 0 | +1 | +1 |
| Wild Night Out | 0 | 0 | +1 | +1.5 | -2 | 0 | +2 |
| Budget-Friendly | -2 | 0 | 0 | 0 | 0 | 0 | 0 |

A session may have 1–2 mood tags. If 2 are selected, average their adjustments before applying.

---

## Step 2 — Score Each Activity (Individual)

For each activity, compute a match score between 0 and 1:

```
dimension_score[d] = (5 - |effective_pref[d] - activity[d]|) / 4

activity_score = mean(dimension_score[d] for all d in dimensions)
```

A perfect match on every dimension = 1.0. A complete mismatch on every dimension = 0.0.

### Example

User effective_pref (after mood adjustments): `[2, 4, 2, 3, 5, 3, 4]`
Activity "Hiking": `[1, 4, 1, 3, 5, 4, 1]`

```
budget:             (5 - |2-1|) / 4 = 4/4 = 1.0
physical_intensity: (5 - |4-4|) / 4 = 5/4 = 1.0  (capped at 1.0)
competitiveness:    (5 - |2-1|) / 4 = 4/4 = 1.0
group_size:         (5 - |3-3|) / 4 = 5/4 = 1.0
outdoor:            (5 - |5-5|) / 4 = 5/4 = 1.0
duration:           (5 - |3-4|) / 4 = 4/4 = 1.0
novelty:            (5 - |4-1|) / 4 = 2/4 = 0.5

activity_score = (1.0 + 1.0 + 1.0 + 1.0 + 1.0 + 1.0 + 0.5) / 7 = 0.93
```

---

## Step 3 — Group Scoring (Group Sessions Only)

For each activity, compute an individual score for every group member using their own effective preference profile (global profile + session mood adjustments). Then combine:

```
group_score = (0.6 × mean(member_scores)) + (0.4 × min(member_scores))
```

The 0.4 weight on the minimum ensures no member is dragged to an activity they'd strongly dislike. The 0.6 weight on the mean still optimizes for overall group enjoyment.

### Why Not Average?

Pure averaging produces the blandest possible recommendation — the activity nobody hates but nobody loves either. This formula balances collective satisfaction against individual veto power.

---

## Step 4 — Rank & Return

Sort all activities by score (descending). Return the top N (e.g. 10 for solo, 8 for groups).

Exclude any activities the user (or any group member) has already given feedback on in a prior session — surface fresh options.

---

## Preference Update Formula

Called after every swipe. Updates the user's global preference profile using an exponential moving average:

```
signal[d] = activity[d]           // swipe right: user liked this
signal[d] = (6 - activity[d])     // swipe left: user disliked this (invert the score)

new_pref[d] = (0.2 × signal[d]) + (0.8 × current_pref[d])
```

`alpha = 0.2` keeps scores stable — a single swipe won't dramatically shift the profile, but consistent patterns accumulate over time. All values stay within 1.0–5.0 via the clamp in Step 1.

Also called after feedback submission (rating 4–5 = swipe right signal, rating 1–2 = swipe left signal, rating 3 = no update).
