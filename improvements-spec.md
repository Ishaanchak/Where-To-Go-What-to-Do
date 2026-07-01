# Improvements Spec — V1 Enhancements

This document describes all improvements to be made to the existing codebase. Do not add features outside this spec. Implement all changes together in one pass, working through each section.

---

## 1. Friends System

### Data Model
Add the following tables to Supabase (run in SQL editor before building):

```sql
-- Friend requests (directional)
CREATE TABLE friend_requests (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (sender_id, receiver_id)
);

-- Add username to profiles
ALTER TABLE profiles ADD COLUMN username TEXT UNIQUE;

-- RLS
ALTER TABLE friend_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "friend_requests: sender or receiver" ON friend_requests
  FOR ALL USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "profiles: public username read" ON profiles
  FOR SELECT USING (true);
```

### User Discovery
- Add a username field to the sign-up flow. Usernames must be unique.
- Friends tab includes a search bar at the top. Searching queries the `profiles` table by username (case-insensitive, partial match).
- Search results show display name and username. Clicking a result sends a friend request.

### Friends Tab
Dedicated tab in the main navigation. Contains two sub-views toggled by a tab within the page:

**Friends** — list of accepted friends (status = 'accepted') showing display name and username.

**Pending** — two sections:
- Incoming: requests where receiver_id = current user, status = 'pending'. Show sender name with Accept and Decline buttons.
- Outgoing: requests where sender_id = current user, status = 'pending'. Show receiver name with Cancel button.

### Group Creation Flow
- User creates a group first (name + mood tags).
- After creation, on the group detail screen, show an "Add Members" button.
- Clicking opens a modal listing the user's accepted friends. Select one or more and confirm to add them to the group (inserts into group_members).
- Invite code remains visible on the group detail screen as a fallback for adding people who aren't friends yet.

---

## 2. Dark Theme

Apply a dark theme globally across all screens, tabs, modals, and cards.

**Color palette:**
- Background: `#09090b`
- Surface (cards, modals, inputs): `#18181b`
- Border: `#27272a`
- Primary accent: `#7c3aed` (purple)
- Primary accent hover: `#6d28d9`
- Primary text: `#fafafa` (white)
- Secondary text: `#a1a1aa` (muted gray)
- Destructive: `#ef4444`

Apply via Tailwind CSS and update the shadcn/ui theme config in `globals.css` to use these as CSS variables. All components should inherit the theme — do not hardcode colors in individual components.

---

## 3. Activity Cards — Icons

Each activity card (on the Swipe tab and Recommendations tab) should display a large centered emoji icon that represents the activity, above the activity name.

Map each activity to an emoji in a `lib/activity-icons.ts` file keyed by activity name. Example mappings:

```
Hiking → 🥾
Rock Climbing (Outdoor) → 🧗
Kayaking → 🛶
Beach Day → 🏖️
Disc Golf → 🥏
Picnic in the Park → 🧺
Cycling → 🚴
Stargazing → 🔭
Camping → ⛺
Paddleboarding → 🏄
Bowling → 🎳
Mini Golf → ⛳
Go-Kart Racing → 🏎️
Laser Tag → 🔫
Rock Climbing (Indoor) → 🧗
Paintball → 🎯
Trampoline Park → 🤸
Axe Throwing → 🪓
Archery → 🏹
Ice Skating → ⛸️
Roller Skating → 🛼
Batting Cages → ⚾
Tennis → 🎾
Volleyball → 🏐
Basketball → 🏀
Escape Room → 🔐
Movie Theater → 🎬
Trivia Night → 🧠
Karaoke → 🎤
Comedy Club → 🎭
Live Music / Concert → 🎸
Theater / Play → 🎭
Haunted House → 👻
Pottery Class → 🏺
Sip and Paint → 🎨
Cooking Class → 👨‍🍳
Glassblowing Class → 🫧
Photography Walk → 📷
Craft Workshop → ✂️
Candle Making Class → 🕯️
Wine Tasting → 🍷
Brewery Tour → 🍺
Food Tour → 🍜
Cocktail Making Class → 🍸
Coffee Tasting → ☕
Museum Visit → 🏛️
Art Gallery → 🖼️
Zoo → 🦁
Aquarium → 🐠
Botanical Garden → 🌸
Historical Walking Tour → 🗺️
Science Center → 🔬
Planetarium → 🪐
Board Game Cafe → 🎲
Arcade → 🕹️
Billiards / Pool Hall → 🎱
Darts at a Bar → 🎯
VR Experience → 🥽
Murder Mystery Dinner → 🕵️
Spa Day → 💆
Yoga Class → 🧘
Hot Spring / Bathhouse → ♨️
Rage Room → 💥
Aerial Silks / Trapeze Class → 🎪
Archery Tag → 🏹
Dance Class → 💃
Salsa / Latin Dancing → 🪩
Amusement Park → 🎡
Water Park → 🌊
Mini Motorsports / Karting → 🏁
Horseback Riding → 🐴
Zip Lining → 🪂
Whale Watching / Boat Tour → 🐋
Improv / Comedy Workshop → 🎭
Bouldering → 🧗
Surfing Lesson → 🏄
Fencing Class → 🤺
Ax Throwing League Night → 🪓
Night Market → 🏮
Farmers Market → 🥦
Escape Room (Horror) → 😱
```

Card design: large emoji (text-6xl or similar) centered in the upper portion of the card, activity name in bold below it, attribute chips below the name.

---

## 4. Swipe Screen — Onboarding Direction Text

When the user is on the Swipe tab and has zero swipe history (first visit), display bold centered instructional text above the card stack:

- Primary: **"Start swiping to discover activities"** (large, white, bold)
- Secondary: "Or skip for now to explore recommendations" (smaller, muted gray)
- Skip is a tappable link that navigates to the Recommendations tab

Once the user has swiped at least one card, this text disappears and does not reappear.

---

## 5. Always-Visible Tab Navigation

The bottom tab bar (Swipe, Recommendations, Saved, Friends, Groups) must remain visible on every screen including:
- Nested group detail screens
- Nested saved list item screens
- Activity Detail views
- All modals (tab bar visible behind modal overlay)

Implement the tab bar in the root layout so it is never unmounted during navigation.

---

## 6. Groups Tab

Dedicated tab in the main navigation showing all groups the user belongs to (as creator or member).

Each group entry shows:
- Group name (or "Unnamed Group" if no name set)
- Mood tags as small chips
- Member count

Tapping a group opens a group detail view showing:
- Group name and mood tags
- Full member list with display names
- Invite code (for sharing)
- "Add Members" button (opens friend selector modal)
- "View Recommendations" button (navigates to Recommendations tab with this group selected)
- **"Delete Group" button** — visible only if the current user is the group creator. Shows a confirmation dialog before deleting. Deletion cascades to group_members via the existing schema.

---

## 7. Venues — Expandable with Reviews

In the Activity Detail screen, each venue card is collapsed by default showing: name, address, star rating, price level, hours.

Clicking a venue card expands it to additionally show:
- Up to 3 Google Places reviews (reviewer name, star rating, review snippet)
- A **"View on Google"** button that opens `https://www.google.com/maps/place/?q=place_id:{place_id}` in a new tab

Fetch review data lazily — only when the venue card is expanded, not on initial Activity Detail load. Use the Places API field mask: `reviews` added to the existing detail fetch, or fire a separate detail request for the specific place_id on expand.

---

## 8. Save Activities from Within a Saved List

On the saved list item view (viewing activities inside a named list), each activity card should have a **"Save to another list"** option alongside the existing remove option. Clicking it opens the Save to List modal, allowing the activity to be added to a different list without navigating away.
