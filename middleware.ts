import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const AUTH_PATHS = ["/sign-in", "/sign-up"];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: userData } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  // Route Handlers do their own auth checks and return JSON errors; the
  // redirect-to-page logic below only applies to actual page navigation.
  if (pathname.startsWith("/api")) {
    return response;
  }

  const isAuthPath = AUTH_PATHS.includes(pathname);

  if (!userData.user) {
    if (!isAuthPath) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    return response;
  }

  if (isAuthPath) {
    return NextResponse.redirect(new URL("/swipe", request.url));
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarded_at")
    .eq("id", userData.user.id)
    .single();

  const isOnboarded = Boolean(profile?.onboarded_at);
  const isOnboardingPath = pathname.startsWith("/onboarding");

  if (!isOnboarded && !isOnboardingPath) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }
  if (isOnboarded && isOnboardingPath) {
    return NextResponse.redirect(new URL("/swipe", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
