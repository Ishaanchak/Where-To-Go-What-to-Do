import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { inviteCode } = body as { inviteCode?: string };

  if (!inviteCode) {
    return NextResponse.json({ error: "Missing invite code" }, { status: 400 });
  }

  const { data: session, error: sessionError } = await supabase
    .from("group_sessions")
    .select("id, name, invite_code, mood_tags")
    .eq("invite_code", inviteCode.trim().toUpperCase())
    .single();

  if (sessionError || !session) {
    return NextResponse.json({ error: "Invalid invite code" }, { status: 404 });
  }

  const { error: memberError } = await supabase
    .from("group_members")
    .insert({ session_id: session.id, user_id: userData.user.id });

  // Postgres unique_violation means the user is already a member — fine, not an error.
  if (memberError && memberError.code !== "23505") {
    return NextResponse.json({ error: memberError.message }, { status: 500 });
  }

  return NextResponse.json({ group: session });
}
