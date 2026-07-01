import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { MOOD_TAGS, type MoodTag } from "@/lib/scoring";

const CODE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function generateInviteCode(): string {
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return code;
}

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, moodTags } = body as { name?: string; moodTags: MoodTag[] };

  const validTags = (moodTags ?? []).filter((t) => MOOD_TAGS.includes(t));
  if (validTags.length < 1 || validTags.length > 2) {
    return NextResponse.json(
      { error: "Select 1-2 mood tags for the group." },
      { status: 400 }
    );
  }

  const MAX_ATTEMPTS = 5;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const inviteCode = generateInviteCode();

    const { data: session, error: insertError } = await supabase
      .from("group_sessions")
      .insert({
        name: name?.trim() || null,
        created_by: userData.user.id,
        invite_code: inviteCode,
        mood_tags: validTags,
      })
      .select("id, name, invite_code, mood_tags")
      .single();

    if (insertError) {
      // Postgres unique_violation — retry with a new code.
      if (insertError.code === "23505") continue;
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    const { error: memberError } = await supabase
      .from("group_members")
      .insert({ session_id: session.id, user_id: userData.user.id });

    if (memberError) {
      return NextResponse.json({ error: memberError.message }, { status: 500 });
    }

    return NextResponse.json({ group: session });
  }

  return NextResponse.json(
    { error: "Could not generate a unique invite code, please try again." },
    { status: 500 }
  );
}
