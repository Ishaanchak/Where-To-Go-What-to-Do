# Preference Dimensions

Every user has a preference profile storing a score (1–5) for each of these 7 dimensions. Scores are initialized to 3 (neutral) and updated via swipe feedback using an exponential moving average.

---

## 1. Budget
How much the user is willing to spend per person on an activity.

| Score | Meaning |
|-------|---------|
| 1 | Free or under $5 |
| 2 | $5–$15 |
| 3 | $15–$40 |
| 4 | $40–$80 |
| 5 | $80+ / splurge-worthy |

---

## 2. Physical Intensity
Level of physical exertion the user enjoys.

| Score | Meaning |
|-------|---------|
| 1 | Fully seated, no movement |
| 2 | Light walking or standing |
| 3 | Moderate movement |
| 4 | Active / likely to sweat |
| 5 | Intense physical effort |

---

## 3. Competitiveness
Degree of head-to-head competition the user enjoys.

| Score | Meaning |
|-------|---------|
| 1 | No competition, purely cooperative or exploratory |
| 2 | Friendly / casual stakes |
| 3 | Moderate competition |
| 4 | Competitive focus |
| 5 | Win-oriented, high stakes |

---

## 4. Group Size
How many people the user typically wants to do activities with.

| Score | Meaning |
|-------|---------|
| 1 | Solo or 2 people |
| 2 | 3–4 people |
| 3 | 4–6 people |
| 4 | 6–10 people |
| 5 | 10+ people |

---

## 5. Outdoors
Indoor vs. outdoor preference.

| Score | Meaning |
|-------|---------|
| 1 | Strictly indoors |
| 2 | Mostly indoors |
| 3 | Either / flexible |
| 4 | Mostly outdoors |
| 5 | Strictly outdoors |

---

## 6. Duration
How long the user wants to spend on an activity.

| Score | Meaning |
|-------|---------|
| 1 | Under 1 hour |
| 2 | 1–2 hours |
| 3 | 2–3 hours |
| 4 | 3–5 hours |
| 5 | 5+ hours / all day |

---

## 7. Novelty
Whether the user prefers familiar classics or unusual/unique experiences.

| Score | Meaning |
|-------|---------|
| 1 | Very common / familiar |
| 2 | Common |
| 3 | Moderately unique |
| 4 | Fairly unique |
| 5 | Very unusual / uncommon |

---

## Preference Update Formula

On each swipe, update the relevant dimension score using an exponential moving average:

```
new_score = (alpha * swipe_signal) + ((1 - alpha) * current_score)
```

- `alpha = 0.2` (controls how fast preferences shift)
- `swipe_signal`: the activity's score on that dimension (swipe right) or its inverse `(6 - score)` (swipe left)

This keeps scores bounded to the 1–5 range and smooths out noise from individual swipes.
