import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/EmptyState";
import { OnboardingToast } from "@/components/OnboardingToast";
import { MOOD_TAG_LABELS, type MoodTag } from "@/lib/scoring";

type Group = {
  id: string;
  name: string | null;
  mood_tags: string[];
  memberCount: number;
};

export function GroupsListView({ groups }: { groups: Group[] }) {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Groups</h1>
        <div className="flex gap-2">
          <Link href="/groups/create">
            <Button size="sm">New group</Button>
          </Link>
          <Link href="/groups/join">
            <Button size="sm" variant="outline">
              Join
            </Button>
          </Link>
        </div>
      </div>

      {groups.length > 0 && (
        <div className="flex flex-col gap-3">
          {groups.map((group) => (
            <Link key={group.id} href={`/groups/${group.id}/lobby`}>
              <Card className="transition-colors hover:bg-secondary/30">
                <CardContent className="flex flex-col gap-2 py-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{group.name || "Unnamed Group"}</span>
                    <span className="text-sm text-muted-foreground">
                      {group.memberCount} {group.memberCount === 1 ? "member" : "members"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.mood_tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {MOOD_TAG_LABELS[tag as MoodTag] ?? tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
      {groups.length === 0 && (
        <EmptyState
          emoji="🎯"
          title="No groups yet"
          subtitle="Create a group to plan activities with friends"
          ctaLabel="New Group"
          ctaHref="/groups/create"
        />
      )}

      <OnboardingToast
        storageKey="toast_groups_seen"
        message="Create a group with friends to get activity recommendations based on everyone's preferences combined."
      />
    </div>
  );
}
