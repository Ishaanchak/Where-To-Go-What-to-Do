/**
 * One-time seed script: reads activities.json and upserts every record
 * into the `activities` table, matching existing rows by name.
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY in the environment — RLS on
 * `activities` only grants SELECT to the anon key, so writes need the
 * service role to bypass it. Run with: npx tsx scripts/seed-activities.ts
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import path from "path";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in the environment."
  );
  process.exit(1);
}

type ActivityRecord = {
  name: string;
  places_query: string;
  places_type: string | null;
  budget: number;
  physical_intensity: number;
  competitiveness: number;
  group_size: number;
  outdoor: number;
  duration: number;
  novelty: number;
};

async function main() {
  const filePath = path.join(process.cwd(), "activities.json");
  const activities: ActivityRecord[] = JSON.parse(readFileSync(filePath, "utf-8"));

  const supabase = createClient(SUPABASE_URL!, SERVICE_ROLE_KEY!);

  const { data: existing, error: fetchError } = await supabase
    .from("activities")
    .select("id, name");

  if (fetchError) {
    console.error("Failed to fetch existing activities:", fetchError.message);
    process.exit(1);
  }

  const existingByName = new Map(existing.map((row) => [row.name, row.id]));

  const toInsert = activities.filter((a) => !existingByName.has(a.name));
  const toUpdate = activities.filter((a) => existingByName.has(a.name));

  if (toInsert.length > 0) {
    const { error } = await supabase.from("activities").insert(toInsert);
    if (error) {
      console.error("Insert failed:", error.message);
      process.exit(1);
    }
  }

  for (const activity of toUpdate) {
    const id = existingByName.get(activity.name);
    const { error } = await supabase.from("activities").update(activity).eq("id", id);
    if (error) {
      console.error(`Update failed for "${activity.name}":`, error.message);
      process.exit(1);
    }
  }

  console.log(
    `Seed complete: ${toInsert.length} inserted, ${toUpdate.length} updated, ${activities.length} total.`
  );
}

main();
