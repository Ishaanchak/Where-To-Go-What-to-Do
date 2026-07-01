import Link from "next/link";
import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  emoji: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
} & ({ ctaHref: string; onCtaClick?: never } | { onCtaClick: () => void; ctaHref?: never });

export function EmptyState({ emoji, title, subtitle, ctaLabel, ...cta }: EmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center">
      <span className="text-6xl opacity-60">{emoji}</span>
      <p className="text-lg font-bold">{title}</p>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
      {"ctaHref" in cta && cta.ctaHref ? (
        <Link href={cta.ctaHref} className="mt-2">
          <Button>{ctaLabel}</Button>
        </Link>
      ) : (
        <Button className="mt-2" onClick={"onCtaClick" in cta ? cta.onCtaClick : undefined}>
          {ctaLabel}
        </Button>
      )}
    </div>
  );
}
