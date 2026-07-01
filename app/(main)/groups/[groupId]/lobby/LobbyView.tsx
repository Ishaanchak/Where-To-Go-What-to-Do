"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AddMembersModal } from "@/components/AddMembersModal";
import { createClient } from "@/lib/supabase/client";
import { MOOD_TAG_LABELS, type MoodTag } from "@/lib/scoring";

type Session = {
  id: string;
  name: string | null;
  invite_code: string;
  mood_tags: string[];
};

type Member = { userId: string; username: string };

export function LobbyView({
  session,
  members,
  isCreator,
}: {
  session: Session;
  members: Member[];
  isCreator: boolean;
}) {
  const router = useRouter();
  const canViewRecommendations = members.length >= 2;
  const [addMembersOpen, setAddMembersOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    const supabase = createClient();
    const { error } = await supabase.from("group_sessions").delete().eq("id", session.id);
    if (error) {
      setDeleting(false);
      return;
    }
    router.push("/groups");
    router.refresh();
  }

  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{session.name || "Group session"}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            {session.mood_tags.map((tag) => (
              <Badge key={tag} variant="default">
                {MOOD_TAG_LABELS[tag as MoodTag] ?? tag}
              </Badge>
            ))}
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-sm text-muted-foreground">Invite code</p>
            <p className="text-lg font-mono font-semibold tracking-widest">
              {session.invite_code}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">
              {members.length} {members.length === 1 ? "member" : "members"}
            </p>
            <ul className="flex flex-col gap-1">
              {members.map((m) => (
                <li key={m.userId} className="text-sm">
                  @{m.username}
                </li>
              ))}
            </ul>
          </div>

          <Button variant="outline" className="w-full" onClick={() => setAddMembersOpen(true)}>
            Add Members
          </Button>

          {canViewRecommendations ? (
            <Link href={`/recommendations?group=${session.id}`}>
              <Button className="w-full">View Recommendations</Button>
            </Link>
          ) : (
            <p className="text-sm text-muted-foreground">
              Waiting for at least one more member to join.
            </p>
          )}

          {isCreator && (
            <AlertDialog>
              <AlertDialogTrigger
                render={
                  <Button variant="destructive" className="w-full">
                    Delete Group
                  </Button>
                }
              />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this group?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This permanently deletes &quot;{session.name || "Unnamed Group"}&quot; and
                    removes all members. This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} disabled={deleting}>
                    {deleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </CardContent>
      </Card>

      <AddMembersModal
        groupId={session.id}
        existingMemberIds={members.map((m) => m.userId)}
        open={addMembersOpen}
        onOpenChange={setAddMembersOpen}
        onAdded={() => router.refresh()}
      />
    </div>
  );
}
