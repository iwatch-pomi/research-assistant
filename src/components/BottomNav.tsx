"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  Home,
  QrCode,
  SquarePen,
  type LucideIcon,
} from "lucide-react";

const ITEMS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/protocols", label: "Protocol", icon: FileText },
  { href: "/notes", label: "Record", icon: SquarePen },
  { href: "/share", label: "Share", icon: QrCode },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 z-20 grid grid-cols-4 border-t border-slate-200 bg-white/95 backdrop-blur">
      {ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center gap-1 py-2.5 transition-colors ${
              active ? "text-blue-600" : "text-slate-400"
            }`}
          >
            <Icon size={20} strokeWidth={active ? 2.4 : 2} />
            <span className="text-[11px] font-medium leading-none">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
