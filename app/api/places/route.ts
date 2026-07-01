import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { searchPlaces } from "@/lib/places";

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { query, near } = body as { query?: string; near?: string };

  if (!query) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  try {
    const places = await searchPlaces(query, near);
    return NextResponse.json({ places });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Places lookup failed" },
      { status: 502 }
    );
  }
}
