"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const SHOW_DELAY_MS = 600;
const AUTO_DISMISS_MS = 5000;
const FADE_MS = 300;

export function OnboardingToast({
  storageKey,
  message,
}: {
  storageKey: string;
  message: string;
}) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(storageKey)) return;

    const showTimer = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => clearTimeout(showTimer);
  }, [storageKey]);

  useEffect(() => {
    if (!visible) return;
    const dismissTimer = setTimeout(dismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(dismissTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  function dismiss() {
    localStorage.setItem(storageKey, "true");
    setLeaving(true);
    setTimeout(() => setVisible(false), FADE_MS);
  }

  if (!visible) return null;

  return (
    <div
      onClick={dismiss}
      role="status"
      className={cn(
        "fixed bottom-6 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 cursor-pointer rounded-lg bg-[#18181b] border-l-[3px] border-l-[#7c3aed] px-4 py-3 text-sm text-white shadow-lg transition-opacity duration-300",
        leaving ? "opacity-0" : "opacity-100"
      )}
    >
      {message}
    </div>
  );
}
