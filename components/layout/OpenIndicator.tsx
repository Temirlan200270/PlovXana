"use client";

import { useEffect, useMemo, useState } from "react";

function toMinutes(value: string): number | null {
  const m = value.match(/(\d{1,2}):(\d{2})/);
  if (!m) return null;
  const hh = Number(m[1]);
  const mm = Number(m[2]);
  if (!Number.isFinite(hh) || !Number.isFinite(mm)) return null;
  return hh * 60 + mm;
}

function parseHoursRange(hoursLine: string): { from: number; to: number } | null {
  const matches = hoursLine.match(/(\d{1,2}:\d{2}).*?(\d{1,2}:\d{2})/);
  if (!matches) return null;
  const from = toMinutes(matches[1]);
  const to = toMinutes(matches[2]);
  if (from == null || to == null) return null;
  return { from, to };
}

function isOpenNow(range: { from: number; to: number }, now: Date): boolean {
  const minutes = now.getHours() * 60 + now.getMinutes();
  if (range.from === range.to) return false;
  if (range.from < range.to) return minutes >= range.from && minutes < range.to;
  // Over midnight
  return minutes >= range.from || minutes < range.to;
}

export function OpenIndicator({ hoursLine }: { hoursLine: string }) {
  const range = useMemo(() => parseHoursRange(hoursLine), [hoursLine]);
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const open = range ? isOpenNow(range, now) : false;

  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={`h-1.5 w-1.5 rounded-full ${open ? "bg-ember-500 lamp-breathe" : "bg-muted-600"}`}
        style={{ boxShadow: open ? "0 0 8px #D66A3A" : "none" }}
        aria-hidden
      />
      <span className="t-micro">{open ? "КАЗАН ГОРИТ" : "ДО ЗАВТРА"}</span>
    </span>
  );
}

