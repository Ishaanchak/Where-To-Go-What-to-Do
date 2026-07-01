"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

type Friend = { id: string; username: string | null };

type AddMembersModalProps = {
  groupId: string;
  existingMemberIds: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdded: () => void;
};

export function AddMembersModal({
  groupId,
  existingMemberIds,
  open,
  onOpenChange,
  onAdded,
}: AddMembersModalProps) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setSelected(new Set());
      setError(null);
      return;
    }

    setLoading(true);
    const supabase = createClient();

    supabase.auth.getUser().then(async ({ data: userData }) => {
      if (!userData.user) {
        setLoading(false);
        return;
      }
      const userId = userData.user.id;

      const { data: rows } = await supabase
        .from("friend_requests")
        .select("sender_id, receiver_id, status")
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .eq("status", "accepted");

      const friendIds = (rows ?? [])
        .map((r) => (r.sender_id === userId ? r.receiver_id : r.sender_id))
        .filter((id) => !existingMemberIds.includes(id));

      if (friendIds.length === 0) {
        setFriends([]);
        setLoading(false);
        return;
      }

      const { data: profileRows } = await supabase
        .from("profiles")
        .select("id, username")
        .in("id", friendIds);

      setFriends(
        (profileRows ?? []).map((p) => ({ id: p.id, username: p.username }))
      );
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  async function handleConfirm() {
    if (selected.size === 0) return;
    setSubmitting(true);
    setError(null);

    const supabase = createClient();
    const { error: insertError } = await supabase
      .from("group_members")
      .insert(Array.from(selected).map((userId) => ({ session_id: groupId, user_id: userId })));

    setSubmitting(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    onAdded();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add members</DialogTitle>
        </DialogHeader>

        {loading && <p className="text-sm text-muted-foreground">Loading friends...</p>}

        <div className="flex flex-col gap-2">
          {friends.map((f) => (
            <label
              key={f.id}
              className="flex items-center gap-3 rounded-md border p-3 cursor-pointer"
            >
              <Checkbox checked={selected.has(f.id)} onCheckedChange={() => toggle(f.id)} />
              <p className="font-medium">@{f.username}</p>
            </label>
          ))}
          {!loading && friends.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No friends available to add (they may already be in this group).
            </p>
          )}
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button onClick={handleConfirm} disabled={selected.size === 0 || submitting}>
          {submitting ? "Adding..." : "Add selected"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
