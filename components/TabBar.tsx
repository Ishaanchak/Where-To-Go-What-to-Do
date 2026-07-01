"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Compass, Heart, Sparkles, UsersRound, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/swipe", label: "Swipe", icon: Compass },
  { href: "/recommendations", label: "Recommendations", icon: Sparkles },
  { href: "/saved", label: "Saved", icon: Heart },
  { href: "/friends", label: "Friends", icon: Users },
  { href: "/groups", label: "Groups", icon: UsersRound },
];

function UserMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<{ username: string; email: string } | null>(null);
  const [friendCount, setFriendCount] = useState<number | null>(null);
  const [groupCount, setGroupCount] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const { data: p } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", data.user.id)
        .single();
      setProfile({ username: p?.username ?? "", email: data.user.email ?? "" });
    });
  }, []);

  useEffect(() => {
    if (!open || friendCount !== null) return;
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const userId = data.user.id;
      const [{ count: fc }, { count: gc }] = await Promise.all([
        supabase
          .from("friend_requests")
          .select("id", { count: "exact", head: true })
          .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
          .eq("status", "accepted"),
        supabase
          .from("group_members")
          .select("session_id", { count: "exact", head: true })
          .eq("user_id", userId),
      ]);
      setFriendCount(fc ?? 0);
      setGroupCount(gc ?? 0);
    });
  }, [open, friendCount]);

  useEffect(() => {
    if (!open) return;
    function handleOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/sign-in");
    router.refresh();
  }

  const initials = profile?.username?.slice(0, 2).toUpperCase() ?? "?";

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open profile menu"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold hover:bg-(--primary-hover) transition-colors"
      >
        {initials}
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-50 w-64 rounded-xl border bg-card shadow-lg overflow-hidden">
          <div className="p-4 flex flex-col gap-3">
            <div>
              <p className="text-lg font-bold leading-tight">{profile?.username}</p>
              <p className="text-sm text-muted-foreground">{profile?.email}</p>
            </div>

            <Separator />

            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <p className="text-xl font-semibold">
                  {friendCount !== null ? friendCount : "—"}
                </p>
                <p className="text-xs text-muted-foreground">Friends</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-xl font-semibold">
                  {groupCount !== null ? groupCount : "—"}
                </p>
                <p className="text-xs text-muted-foreground">Groups</p>
              </div>
            </div>

            <Separator />

            <Button
              variant="destructive"
              size="sm"
              className="w-full"
              onClick={handleSignOut}
            >
              Sign out
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export function TabBar() {
  const pathname = usePathname();

  return (
    <header className="flex items-center justify-between border-b px-4 py-2">
      <nav className="flex gap-1">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2 border-b-2 px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:bg-secondary/50"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          );
        })}
      </nav>
      <UserMenu />
    </header>
  );
}
