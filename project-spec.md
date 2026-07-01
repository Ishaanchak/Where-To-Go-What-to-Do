# Project Spec — Collaborative Activity Discovery Platform

## Overview

A full-stack web app that helps individuals and groups discover activities they'll enjoy. The app learns user preferences over time through a swipe interface and generates ranked activity recommendations tailored to a session's mood. For groups, it finds activities that maximize collective enjoyment without sacrificing any individual's experience.

**Recruitment context:** Demonstrates full-stack web development, recommendation systems, multi-user collaborative features, and external API integration.

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Database + Auth | Supabase (PostgreSQL + Supabase Auth) |
| Styling | Tailwind CSS + shadcn/ui |
| External API | Google Places API (New) |
| Deployment | Vercel |

**No LLM calls at runtime.** All recommendations are deterministic. LLM was used offline only to generate `activities.json`.

---

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
GOOGLE_PLACES_API_KEY=
```

---

## Data Model

See `schema.sql` for full DDL. Tables:

- `profiles` — extends Supabase auth.users
- `activities` — 75 pre-seeded activity types with 7 attribute scores (see `activities.json`)
- `user_preference_profiles` — one row per user, 7 float scores initialized at 3.0
- `swipe_history` — every swipe logged (left/right), always global
- `group_sessions` — named session with invite code and mood tags
- `group_members` — junction table: users ↔ sessions
- `feedback` — post-activity rating (1–5)
- `saved_lists` — user-created named lists (personal only, not group-level)
- `saved_list_items` — activities saved to a named list

---

## Scoring Algorithm

See `scoring-algorithm.md` for full spec. Summary:

1. Apply mood tag adjustments to user's global preference vector to get effective preferences
2. Score each activity: `mean((5 - |effective_pref[d] - activity[d]|) / 4)` across all 7 dimensions
3. For groups: `0.6 × mean(member scores) + 0.4 × min(member scores)`
4. Sort descending, return top N results
5. On each swipe, update preference profile via EMA (alpha = 0.2)

**Mood tag selection reruns the full scoring algorithm** — it is not a filter on existing results. Changing the tag produces a meaningfully different ranked list.

---

## Mood Tags

7 tags: `chill`, `active`, `social`, `adventure`, `date_night`, `wild_night_out`, `budget_friendly`. Sessions support 1–2 tags. See `scoring-algorithm.md` for adjustment values per dimension.

For solo recommendations, mood tag is selected in the UI and passed to the scoring function — not persisted to the database.

---

## Navigation Structure

Three top-level tabs accessible after auth:

### Tab 1 — Swipe
The preference learning interface. Always global — swipes are never tied to a session or group. Shows activity cards one at a time. Swipe right = like, swipe left = pass. Each swipe updates the user's global preference profile via EMA.

- Activity cards show name and attribute tag chips (e.g. "outdoors · low budget · active")
- Tapping a card (without swiping) opens Activity Detail
- Any activity can be saved to a named list from the card or detail view

### Tab 2 — Recommendations
Shows ranked activity recommendations. Contains a sub-navigation to switch context:

- **Solo** — user picks 1–2 mood tags, scoring runs against their global profile with tag adjustments applied. Returns top 10 activities. Changing the tag reruns scoring.
- **[Group Name]** — one entry per group the user belongs to. Selecting a group loads that session's mood tags (set at group creation) and runs group scoring across all members. Returns top 8 activities.

Each recommendation card shows activity name and attribute tag chips. Tapping opens Activity Detail. Any activity can be saved from here.

### Tab 3 — Saved
Personal named lists. Users can create multiple lists with custom names (e.g. "Date Night Ideas", "Summer Bucket List", "With the Boys"). Activities can be saved to any list from anywhere in the app (swipe card, recommendation card, activity detail).

- List view shows all user's lists
- Tapping a list shows its saved activities
- Tapping an activity opens Activity Detail

---

## Screens

### Auth
- **Sign Up** — email/password via Supabase Auth
- **Sign In** — email/password

### Onboarding (first-time users only)
- **Onboarding Swipe** — 20 activity cards to bootstrap the preference profile before the user reaches the main app. Skip option available. On completion (or skip), navigate to main app with Swipe tab active.

### Main App (tab shell)

**Swipe tab**
- Continuous swipe card stack
- Card shows activity name + attribute chips
- Tap card → Activity Detail
- Save button on card → Save to List modal

**Recommendations tab**
- Mood tag selector at top (1–2 selectable, reruns scoring on change)
- Context switcher: Solo | [Group 1] | [Group 2] | ...
- Ranked activity list (10 for solo, 8 for groups)
- Each card: activity name + attribute chips + save button
- Tap card → Activity Detail

**Saved tab**
- List of user's named lists with activity count
- "+ New List" button
- Tap list → list items view
- Tap activity → Activity Detail
- Long press or swipe on item → remove from list

### Activity Detail (modal or full screen, opened from anywhere)
- Activity name and full attribute chip set
- "Nearby Venues" section — calls Google Places API on open, shows top 3–5 results
- Each venue: name, address, rating, price level, opening hours
- Save button → Save to List modal
- "I did this" button → Feedback modal (1–5 stars)

### Modals
- **Save to List** — shows user's existing lists + "Create new list" option. Selecting a list saves the activity there.
- **Feedback** — 1–5 star rating. On submit, updates global preference profile using same EMA formula as swipes.

### Group Screens
- **Create Group** — name (optional), mood tags (1–2), generates 6-char invite code
- **Join Group** — enter invite code
- **Group Lobby** — shows session name, mood tags, member list, member count. "View Recommendations" button available to all members once 2+ have joined. Accessible from Recommendations tab context switcher.

---

## Key Implementation Notes

### Seeding Activities
Write a seed script at `scripts/seed-activities.ts` that reads `activities.json` and upserts all 75 records into the `activities` table. Run once manually before first use.

### Preference Profile Creation
Create a Supabase database trigger: on insert to `profiles`, automatically insert a row into `user_preference_profiles` with all scores defaulting to 3.0.

### Invite Codes
Generate a 6-character alphanumeric string server-side on session creation. Check for uniqueness before inserting (retry on collision).

### Google Places API
Call on Activity Detail open, not before. Use Places Text Search (New):
```
POST https://places.googleapis.com/v1/places:searchText
Body: { textQuery: "{places_query} near {city or coordinates}" }
Header: X-Goog-Api-Key: {GOOGLE_PLACES_API_KEY}
Header: X-Goog-FieldMask: places.displayName,places.formattedAddress,places.rating,places.priceLevel,places.regularOpeningHours
```
Return top 3–5 results. Cache in component state — do not re-fetch while the detail view is open.

### Scoring Implementation
Implement in a pure TypeScript function at `lib/scoring.ts`. Accepts a preference profile (or array of profiles for groups), mood tags, and the full activity list. Returns `{ activity, score }[]` sorted descending. Called server-side in a Route Handler — never expose raw preference data to the client.

### Swipe Stack
Use `react-tinder-card` for swipe animation. On each swipe: (1) log to `swipe_history`, (2) update `user_preference_profiles` via server action using the EMA formula. Pre-load the next 10 unseen activities (not in `swipe_history` for this user) to keep the stack feeling instant.

---

## Out of Scope for V1

- LLM recommendation explanations or itinerary generation
- Group voting on recommendations
- Group-level saved lists (saving is personal only)
- Calendar / scheduling integration
- Push notifications
- Social features (following, public profiles)
- Native mobile app
- Admin dashboard or analytics UI
- Venue bookmarking separate from activity saving

---

## File Structure

```
/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/page.tsx
│   │   └── sign-up/page.tsx
│   ├── (main)/
│   │   ├── layout.tsx              # tab shell
│   │   ├── swipe/page.tsx
│   │   ├── recommendations/page.tsx
│   │   ├── saved/
│   │   │   ├── page.tsx            # list of saved lists
│   │   │   └── [listId]/page.tsx   # items in a list
│   │   └── onboarding/page.tsx
│   └── api/
│       ├── recommendations/route.ts
│       ├── swipe/route.ts
│       └── places/route.ts
├── lib/
│   ├── scoring.ts                  # pure scoring function
│   ├── supabase.ts                 # supabase client helpers
│   └── places.ts                  # google places fetch wrapper
├── components/
│   ├── SwipeCard.tsx
│   ├── ActivityCard.tsx
│   ├── ActivityDetail.tsx
│   ├── VenueCard.tsx
│   ├── MoodTagSelector.tsx
│   ├── SaveToListModal.tsx
│   ├── FeedbackModal.tsx
│   └── GroupContextSwitcher.tsx
├── scripts/
│   └── seed-activities.ts
├── activities.json
├── schema.sql
├── scoring-algorithm.md
└── preference-dimensions.md
```
