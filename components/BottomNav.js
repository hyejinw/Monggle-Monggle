"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, ChatIcon, CalendarIcon, MenuIcon } from "./Icons";

const TABS = [
  { href: "/", label: "홈", Icon: HomeIcon },
  { href: "/chat", label: "대화", Icon: ChatIcon },
  { href: "/record", label: "기록", Icon: CalendarIcon },
  { href: "/more", label: "더보기", Icon: MenuIcon },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="z-10 flex shrink-0 border-t border-zinc-100 bg-white/95 backdrop-blur">
      {TABS.map(({ href, label, Icon }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex h-[72px] flex-1 flex-col items-center justify-center gap-1 text-xs ${
              active ? "text-[var(--mood-color)] font-semibold" : "text-zinc-400"
            }`}
          >
            <Icon active={active} width={22} height={22} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
