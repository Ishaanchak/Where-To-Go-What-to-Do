-- Upsert activities from the updated activities.json.
-- Step 1: ensure a unique index on name so ON CONFLICT works.
CREATE UNIQUE INDEX IF NOT EXISTS activities_name_unique ON activities(name);

-- Step 2: upsert all 81 rows — overwrites places_query and all dimension scores on conflict.

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Hiking', 'hiking trails', 'park', 1, 4, 1, 3, 5, 4, 1)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Rock Climbing (Outdoor)', 'outdoor rock climbing area crag', NULL, 2, 5, 2, 2, 5, 4, 3)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Kayaking', 'kayak rental outfitter', NULL, 3, 3, 1, 2, 5, 3, 3)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Beach Day', 'public beach', NULL, 1, 2, 1, 4, 5, 5, 1)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Disc Golf', 'disc golf course', 'park', 1, 3, 3, 3, 5, 3, 2)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Picnic in the Park', 'park picnic area', 'park', 1, 1, 1, 3, 5, 3, 1)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Cycling', 'bike trail cycling path', 'park', 1, 4, 2, 3, 5, 3, 1)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Stargazing', 'dark sky park stargazing', 'park', 1, 1, 1, 2, 5, 3, 3)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Camping', 'campground camping site', 'campground', 2, 3, 1, 3, 5, 5, 2)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Paddleboarding', 'paddleboard SUP rental', NULL, 3, 3, 1, 2, 5, 2, 3)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Bowling', 'bowling alley', 'bowling_alley', 2, 2, 3, 3, 1, 2, 1)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Mini Golf', 'mini golf miniature golf course', NULL, 2, 1, 3, 3, 3, 2, 1)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Go-Kart Racing', 'go kart racing track', NULL, 3, 2, 4, 3, 3, 2, 3)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Laser Tag', 'laser tag arena', NULL, 2, 3, 4, 4, 1, 1, 2)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Rock Climbing (Indoor)', 'indoor rock climbing gym bouldering', 'gym', 3, 5, 2, 2, 1, 3, 3)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Paintball', 'paintball field arena', NULL, 3, 4, 5, 4, 4, 3, 3)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Trampoline Park', 'trampoline park indoor jumping', NULL, 2, 4, 2, 3, 1, 2, 2)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Axe Throwing', 'axe throwing venue', NULL, 3, 2, 3, 3, 1, 2, 4)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Archery', 'archery range club lessons', NULL, 2, 2, 3, 2, 2, 2, 3)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Ice Skating', 'ice skating rink', NULL, 2, 3, 1, 3, 2, 2, 2)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Roller Skating', 'roller skating rink', NULL, 2, 3, 1, 3, 1, 2, 2)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Batting Cages', 'batting cages baseball softball', NULL, 2, 3, 3, 2, 3, 1, 2)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Tennis', 'public tennis courts', NULL, 1, 4, 4, 2, 4, 2, 1)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Volleyball', 'volleyball court beach volleyball', NULL, 1, 4, 4, 5, 4, 2, 1)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Basketball', 'public basketball court', NULL, 1, 5, 4, 4, 4, 2, 1)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Escape Room', 'escape room puzzle', NULL, 3, 1, 2, 3, 1, 2, 3)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Movie Theater', 'movie theater cinema', 'movie_theater', 2, 1, 1, 3, 1, 3, 1)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Trivia Night', 'pub quiz trivia night bar', 'bar', 2, 1, 3, 4, 1, 3, 2)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Karaoke', 'karaoke bar lounge', NULL, 2, 1, 2, 4, 1, 3, 2)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Comedy Club', 'comedy club stand-up', NULL, 3, 1, 1, 3, 1, 2, 2)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Live Music / Concert', 'live music concert venue', NULL, 3, 1, 1, 4, 3, 3, 2)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Theater / Play', 'performing arts theater playhouse', NULL, 3, 1, 1, 3, 1, 3, 2)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Haunted House', 'haunted house horror attraction', NULL, 3, 2, 1, 3, 2, 2, 4)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Pottery Class', 'pottery ceramics class studio', NULL, 3, 1, 1, 2, 1, 3, 3)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Sip and Paint', 'sip and paint painting class wine', NULL, 3, 1, 1, 4, 1, 3, 2)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Cooking Class', 'cooking class culinary school', NULL, 4, 1, 1, 3, 1, 3, 3)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Glassblowing Class', 'glassblowing studio class workshop', NULL, 4, 2, 1, 2, 1, 2, 5)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Photography Walk', 'guided photography walk tour', NULL, 1, 2, 1, 2, 4, 3, 3)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Craft Workshop', 'arts crafts workshop studio class', NULL, 3, 1, 1, 3, 1, 3, 3)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Candle Making Class', 'candle making workshop studio class', NULL, 3, 1, 1, 3, 1, 2, 4)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Wine Tasting', 'winery tasting room wine tasting experience', NULL, 3, 1, 1, 3, 2, 2, 2)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Brewery Tour', 'craft brewery tour taproom', NULL, 3, 1, 1, 4, 2, 2, 2)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Food Tour', 'food tour culinary walking tour', NULL, 4, 2, 1, 3, 4, 3, 3)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Cocktail Making Class', 'mixology class cocktail making workshop', NULL, 4, 1, 1, 3, 1, 2, 3)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Coffee Tasting', 'specialty coffee cupping tasting', 'cafe', 2, 1, 1, 2, 1, 1, 3)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Museum Visit', 'museum', 'museum', 2, 2, 1, 2, 1, 3, 2)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Art Gallery', 'art gallery exhibition', 'art_gallery', 1, 2, 1, 2, 1, 2, 2)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Zoo', 'zoo animal park', 'zoo', 3, 2, 1, 3, 4, 4, 2)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Aquarium', 'aquarium marine life', 'aquarium', 3, 2, 1, 3, 1, 3, 2)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Botanical Garden', 'botanical garden arboretum', 'park', 2, 2, 1, 2, 5, 3, 2)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Historical Walking Tour', 'historical guided walking tour', 'tourist_attraction', 2, 2, 1, 3, 4, 2, 2)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Science Center', 'science museum interactive center', 'museum', 3, 2, 1, 3, 1, 3, 2)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Planetarium', 'planetarium astronomy show', 'museum', 2, 1, 1, 3, 1, 2, 3)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Board Game Cafe', 'board game cafe tabletop games', 'cafe', 2, 1, 3, 3, 1, 3, 2)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Arcade', 'video game arcade', NULL, 2, 2, 3, 3, 1, 2, 1)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Billiards / Pool Hall', 'billiards pool hall', NULL, 2, 1, 3, 2, 1, 2, 1)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Darts at a Bar', 'bar darts games', 'bar', 2, 1, 3, 3, 1, 2, 1)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('VR Experience', 'virtual reality experience center', NULL, 3, 2, 2, 2, 1, 2, 4)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Murder Mystery Dinner', 'murder mystery dinner theater event', NULL, 4, 1, 2, 4, 1, 3, 4)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Spa Day', 'day spa massage treatment', 'spa', 5, 1, 1, 2, 1, 4, 2)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Yoga Class', 'yoga studio class', 'gym', 2, 3, 1, 3, 2, 2, 1)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Hot Spring / Bathhouse', 'hot spring bathhouse spa mineral', 'spa', 3, 1, 1, 2, 3, 3, 3)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Rage Room', 'rage room smash room destruction', NULL, 3, 3, 1, 2, 1, 1, 5)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Aerial Silks / Trapeze Class', 'aerial silks trapeze circus class', NULL, 4, 5, 1, 2, 1, 2, 5)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Archery Tag', 'archery tag combat archery', NULL, 3, 3, 5, 4, 2, 2, 4)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Dance Class', 'dance class studio lessons', NULL, 2, 3, 1, 3, 1, 2, 2)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Salsa / Latin Dancing', 'salsa latin dance class studio', NULL, 2, 3, 1, 4, 1, 2, 3)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Amusement Park', 'amusement park theme park rides', 'amusement_park', 4, 3, 1, 4, 4, 5, 2)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Water Park', 'water park waterslides', 'amusement_park', 4, 3, 1, 4, 5, 5, 2)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Mini Motorsports / Karting', 'go kart karting track racing', NULL, 3, 2, 4, 3, 3, 2, 3)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Horseback Riding', 'horseback riding stable equestrian trail', NULL, 4, 2, 1, 2, 5, 3, 4)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Zip Lining', 'zip line zipline adventure course', NULL, 4, 3, 1, 3, 5, 3, 4)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Whale Watching / Boat Tour', 'whale watching boat tour cruise', NULL, 4, 1, 1, 4, 5, 4, 4)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Improv / Comedy Workshop', 'improv comedy class workshop theater', NULL, 3, 1, 1, 4, 1, 2, 4)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Bouldering', 'bouldering climbing gym', 'gym', 3, 5, 2, 2, 1, 3, 3)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Surfing Lesson', 'surf school surfing lessons', NULL, 4, 4, 1, 2, 5, 3, 4)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Fencing Class', 'fencing sport club lessons', NULL, 3, 3, 4, 2, 1, 2, 5)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Ax Throwing League Night', 'axe throwing venue league', NULL, 3, 2, 4, 4, 1, 3, 4)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Night Market', 'night market outdoor market evening', NULL, 2, 2, 1, 4, 5, 2, 3)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Farmers Market', 'farmers market local produce', NULL, 2, 2, 1, 3, 5, 2, 1)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;

INSERT INTO activities (name, places_query, places_type, budget, physical_intensity, competitiveness, group_size, outdoor, duration, novelty)
VALUES ('Escape Room (Horror)', 'horror escape room scary', NULL, 3, 2, 1, 3, 1, 2, 5)
ON CONFLICT (name) DO UPDATE SET
  places_query       = EXCLUDED.places_query,
  places_type        = EXCLUDED.places_type,
  budget             = EXCLUDED.budget,
  physical_intensity = EXCLUDED.physical_intensity,
  competitiveness    = EXCLUDED.competitiveness,
  group_size         = EXCLUDED.group_size,
  outdoor            = EXCLUDED.outdoor,
  duration           = EXCLUDED.duration,
  novelty            = EXCLUDED.novelty;
