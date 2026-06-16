"use client";

import { useEffect, useState } from "react";
import { formatHMS } from "@/lib/date";

/** target までの残り時間を 1 秒ごとに更新して HH:MM:SS で表示する。*/
export default function Countdown({
  target,
  className,
}: {
  target: Date;
  className?: string;
}) {
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const remainingSec = (target.getTime() - now) / 1000;

  return (
    <span className={className} suppressHydrationWarning>
      {formatHMS(remainingSec)}
    </span>
  );
}
