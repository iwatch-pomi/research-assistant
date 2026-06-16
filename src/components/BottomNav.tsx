"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Share2 } from "lucide-react";

const ITEMS = [
  { href: "/", label: "カレンダー", icon: CalendarDays },
  { href: "/share", label: "共有", icon: Share2 },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 z-20 grid grid-cols-2 border-t border-slate-200 bg-white/95 backdrop-blur">
      {ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition-colors ${
              active ? "text-blue-600" : "text-slate-400"
            }`}
          >
            <Icon size={22} strokeWidth={active ? 2.4 : 2} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
