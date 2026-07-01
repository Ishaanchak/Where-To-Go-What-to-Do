"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/EmptyState";
import type { FriendProfile, PendingRequest } from "./page";

type SearchResult = { id: string; username: string | null };

export function FriendsView({
  initialFriends,
  initialIncoming,
  initialOutgoing,
}: {
  initialFriends: FriendProfile[];
  initialIncoming: PendingRequest[];
  initialOutgoing: PendingRequest[];
}) {
  const [friends, setFriends] = useState(initialFriends);
  const [incoming, setIncoming] = useState(initialIncoming);
  const [outgoing, setOutgoing] = useState(initialOutgoing);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  async function handleSearch(value: string) {
    setQuery(value);
    setMessage(null);
    if (!value.trim()) {
      setResults([]);
      return;
    }

    setSearching(true);
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();

    const existingIds = new Set([
      ...friends.map((f) => f.id),
      ...incoming.map((r) => r.profile.id),
      ...outgoing.map((r) => r.profile.id),
    ]);

    const { data } = await supabase
      .from("profiles")
      .select("id, username")
      .ilike("username", `%${value.trim()}%`)
      .not("username", "is", null)
      .neq("id", userData.user?.id ?? "")
      .limit(20);

    setResults(
      (data ?? [])
        .filter((p) => !existingIds.has(p.id))
        .map((p) => ({ id: p.id, username: p.username }))
    );
    setSearching(false);
  }

  async function sendRequest(target: SearchResult) {
    setMessage(null);
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const { data: requestData, error } = await supabase
      .from("friend_requests")
      .insert({ sender_id: userData.user.id, receiver_id: target.id })
      .select("id")
      .single();

    if (error) {
      setMessage(
        error.code === "23505" ? "Request already sent." : error.message
      );
      return;
    }

    setMessage(`Friend request sent to @${target.username ?? target.id}.`);
    setResults((prev) => prev.filter((r) => r.id !== target.id));
    setOutgoing((prev) => [
      ...prev,
      { requestId: requestData.id, profile: { id: target.id, username: target.username } },
    ]);
  }

  async function acceptRequest(req: PendingRequest) {
    const supabase = createClient();
    const { error } = await supabase
      .from("friend_requests")
      .update({ status: "accepted" })
      .eq("id", req.requestId);
    if (!error) {
      setIncoming((prev) => prev.filter((r) => r.requestId !== req.requestId));
      setFriends((prev) => [...prev, req.profile]);
    }
  }

  async function declineRequest(req: PendingRequest) {
    const supabase = createClient();
    const { error } = await supabase
      .from("friend_requests")
      .update({ status: "declined" })
      .eq("id", req.requestId);
    if (!error) {
      setIncoming((prev) => prev.filter((r) => r.requestId !== req.requestId));
    }
  }

  async function cancelRequest(req: PendingRequest) {
    const supabase = createClient();
    const { error } = await supabase
      .from("friend_requests")
      .delete()
      .eq("id", req.requestId);
    if (!error) {
      setOutgoing((prev) => prev.filter((r) => r.requestId !== req.requestId));
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <Input
        ref={searchInputRef}
        placeholder="Search by username"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
      />

      {query.trim() && (
        <div className="flex flex-col gap-2">
          {searching && <p className="text-sm text-muted-foreground">Searching...</p>}
          {!searching &&
            results.map((r) => (
              <Card
                key={r.id}
                className="cursor-pointer transition-colors hover:bg-secondary/30"
                onClick={() => sendRequest(r)}
              >
                <CardContent className="flex items-center justify-between py-3">
                  <p className="font-medium">@{r.username}</p>
                  <Button size="sm" variant="outline" type="button">
                    Add
                  </Button>
                </CardContent>
              </Card>
            ))}
          {!searching && results.length === 0 && (
            <p className="text-sm text-muted-foreground">No users found.</p>
          )}
        </div>
      )}

      {message && <p className="text-sm text-muted-foreground">{message}</p>}

      <Tabs defaultValue="friends">
        <TabsList>
          <TabsTrigger value="friends">Friends</TabsTrigger>
          <TabsTrigger value="pending">
            Pending
            {incoming.length > 0 && (
              <span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
                {incoming.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="friends" className="flex flex-col gap-2">
          {friends.map((f) => (
            <Card key={f.id}>
              <CardContent className="py-3">
                <p className="font-medium">@{f.username}</p>
              </CardContent>
            </Card>
          ))}
          {friends.length === 0 && (
            <EmptyState
              emoji="👥"
              title="No friends yet"
              subtitle="Search by username to connect with friends"
              ctaLabel="Search for friends"
              onCtaClick={() => searchInputRef.current?.focus()}
            />
          )}
        </TabsContent>

        <TabsContent value="pending" className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold">Incoming</h3>
            {incoming.map((req) => (
              <Card key={req.requestId}>
                <CardContent className="flex items-center justify-between py-3">
                  <p className="font-medium">@{req.profile.username}</p>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => acceptRequest(req)}>
                      Accept
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => declineRequest(req)}>
                      Decline
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {incoming.length === 0 && (
              <p className="text-sm text-muted-foreground">No incoming requests.</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold">Outgoing</h3>
            {outgoing.map((req) => (
              <Card key={req.requestId}>
                <CardContent className="flex items-center justify-between py-3">
                  <p className="font-medium">@{req.profile.username}</p>
                  <Button size="sm" variant="outline" onClick={() => cancelRequest(req)}>
                    Cancel
                  </Button>
                </CardContent>
              </Card>
            ))}
            {outgoing.length === 0 && (
              <p className="text-sm text-muted-foreground">No outgoing requests.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
