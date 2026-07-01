"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoodTagSelector } from "@/components/MoodTagSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { MoodTag } from "@/lib/scoring";

export default function CreateGroupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [moodTags, setMoodTags] = useState<MoodTag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (moodTags.length < 1) {
      setError("Select 1-2 mood tags.");
      return;
    }
    setLoading(true);
    setError(null);

    const res = await fetch("/api/groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, moodTags }),
    });
    const json = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(json.error ?? "Failed to create group.");
      return;
    }

    router.push(`/groups/${json.group.id}/lobby`);
  }

  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create a group</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Name (optional)</Label>
              <Input
                id="name"
                placeholder="Friday night"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Mood (pick 1-2)</Label>
              <MoodTagSelector selected={moodTags} onChange={setMoodTags} />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Create group"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
