"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import Mascot from "@/components/Mascot";
import MoodFace from "@/components/MoodFace";
import {
  PlusIcon,
  BellIcon,
  PersonIcon,
  ChevronRightIcon,
  QuoteMarkIcon,
  SparkleHeartIcon,
} from "@/components/Icons";
import { COLORS, COLOR_ORDER, CHECKIN_STORAGE_KEY, normalizeColorId } from "@/lib/colorLogic";

const USER_NAME = "혜진";
const DEFAULT_COLOR_ID = "blue";
const NOTIFICATION_COUNT = 201;

const MOOD_COPY = {
  yellow: {
    title: "편안해요",
    description: "마음이 잔잔한 상태예요",
  },
  blue: {
    title: "아주 좋아요",
    description: "마음이 가볍고 편안한 상태예요",
  },
  orange: {
    title: "조금 불안해요",
    description: "생각이 많아지는 상태예요",
  },
  red: {
    title: "과부하예요",
    description: "잠깐 멈춤이 필요한 상태예요",
  },
  black: {
    title: "쉬고 싶어요",
    description: "에너지를 아껴야 하는 상태예요",
  },
};

const MENU_ITEMS = [
  {
    href: "/chat",
    title: "몽글 대화",
    icon: "chat",
  },
  {
    href: "/comic",
    title: "몽글 만화",
    icon: "comic",
  },
  {
    href: "/game",
    title: "몽글 게임",
    icon: "game",
  },
];

function getMenuIconSrc(icon, colorId) {
  return `/menu-icons/${icon}/${colorId}.png`;
}

function getSavedCheckinColorId() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CHECKIN_STORAGE_KEY);
    const saved = raw ? JSON.parse(raw) : null;
    const colorId = normalizeColorId(saved?.colorId);
    return colorId && COLORS[colorId] ? colorId : null;
  } catch {
    return null;
  }
}

function subscribeToCheckinStorage(onStoreChange) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener("monggle:checkin-change", onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener("monggle:checkin-change", onStoreChange);
  };
}

function IconButton({ children, badge }) {
  return (
    <button
      type="button"
      className="home-icon-button relative flex h-11 w-11 items-center justify-center rounded-full border border-zinc-100 text-zinc-900"
    >
      {children}
      {badge ? (
        <span className="absolute -top-1.5 -right-1.5 rounded-full bg-[var(--mood-color)] px-1.5 py-0.5 text-[10px] font-semibold leading-none text-[var(--mood-on-color)]">
          {badge}
        </span>
      ) : null}
    </button>
  );
}

export default function HomePage() {
  const checkedInColorId = useSyncExternalStore(
    subscribeToCheckinStorage,
    getSavedCheckinColorId,
    () => null
  );

  const hasCheckedInToday = checkedInColorId !== null;
  const activeColor = COLORS[checkedInColorId ?? DEFAULT_COLOR_ID];
  const activeMood = MOOD_COPY[activeColor.id] ?? MOOD_COPY[DEFAULT_COLOR_ID];

  return (
    <main className="home-shell flex h-full min-h-0 flex-col gap-3 overflow-hidden px-4 py-3 min-[390px]:gap-4 min-[390px]:p-5">
      <header className="flex shrink-0 items-center justify-between">
        <h1 className="home-logo font-[family-name:var(--font-hakgyo-nalgae)] text-[34px] font-normal leading-none tracking-normal text-[var(--mood-color)] min-[390px]:text-[38px]">
          몽글몽글
        </h1>
        <div className="flex items-center gap-2.5">
          <IconButton>
            <PlusIcon width={18} height={18} />
          </IconButton>
          <IconButton badge={NOTIFICATION_COUNT}>
            <BellIcon width={18} height={18} />
          </IconButton>
          <IconButton>
            <PersonIcon width={18} height={18} />
          </IconButton>
        </div>
      </header>

      <section className="home-card flex shrink-0 items-center justify-between gap-3 rounded-[22px] border border-zinc-100 p-4 min-[390px]:rounded-3xl min-[390px]:p-5">
        <div className="flex min-w-0 flex-col gap-3">
          <div>
            <p className="text-lg font-bold leading-tight text-zinc-900">
              안녕하세요, <span className="text-[var(--mood-color)]">{USER_NAME}님</span>
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              {hasCheckedInToday ? "몽글이가 오늘의 흐름을 기억하고 있어요" : "오늘의 마음은 어떤가요?"}
            </p>
          </div>
          <Link
            href="/checkin"
            className="inline-flex w-fit items-center gap-1 rounded-full bg-[var(--mood-color)] px-5 py-2.5 text-sm font-semibold leading-none text-[var(--mood-on-color)]"
          >
            {hasCheckedInToday ? "다시 체크인" : "오늘 체크인 하기"}
            <ChevronRightIcon width={16} height={16} />
          </Link>
        </div>
        <div className="home-mascot shrink-0">
          <Mascot colorId={activeColor.id} size={128} />
        </div>
      </section>

      <section className="home-card flex shrink-0 items-center justify-between gap-3 rounded-[22px] border border-zinc-100 p-4 min-[390px]:rounded-3xl min-[390px]:p-5">
        <div className="min-w-0">
          <p className="text-sm font-medium text-zinc-600">지금 내 마음</p>
          <p className="home-mood-title mt-1 truncate text-[26px] font-extrabold leading-tight text-[var(--mood-color)]">
            {hasCheckedInToday ? activeMood.title : "체크인 전"}
          </p>
          {hasCheckedInToday ? (
            <p className="mt-1 truncate text-sm text-zinc-500">{activeMood.description}</p>
          ) : null}
        </div>
        <div className="flex shrink-0 gap-1.5">
          {COLOR_ORDER.map((colorId) => {
            const color = COLORS[colorId];
            const isActive = color.id === activeColor.id && hasCheckedInToday;
            return (
              <div
                key={color.id}
                className={`rounded-full p-0.5 ${isActive ? "ring-2 ring-[var(--mood-color)] ring-offset-2" : "opacity-70"}`}
                aria-label={color.state}
              >
                <MoodFace bg={color.hex} size={30} />
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid min-h-0 flex-1 grid-rows-3 gap-2.5 min-[390px]:gap-3">
        {MENU_ITEMS.map(({ href, title, icon }) => (
          <Link
            key={href}
            href={href}
            className="home-menu-card flex min-h-0 items-center gap-3 rounded-[20px] border border-zinc-100 px-4 py-3 min-[390px]:rounded-3xl"
          >
            <div className="home-menu-icon flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--mood-border-color)] min-[390px]:h-14 min-[390px]:w-14">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getMenuIconSrc(icon, activeColor.id)}
                alt=""
                width={32}
                height={32}
                className="h-8 w-8 select-none object-contain"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-[family-name:var(--font-hakgyo-nalgae)] text-[19px] font-normal leading-tight text-zinc-900 min-[390px]:text-[22px]">
                {title}
              </p>
            </div>
            <ChevronRightIcon width={18} height={18} className="shrink-0 text-zinc-400" />
          </Link>
        ))}
      </section>

      <section className="home-quote flex shrink-0 items-center justify-between gap-3 rounded-[20px] bg-[var(--mood-border-color)] px-4 py-3 min-[390px]:rounded-3xl min-[390px]:p-4">
        <div className="flex min-w-0 items-start gap-2">
          <QuoteMarkIcon width={20} height={20} className="mt-0.5 shrink-0 text-[var(--mood-color)]" />
          <p className="truncate font-bold text-[var(--mood-color)]">작은 하루도, 충분히 잘하고 있어!</p>
        </div>
        <SparkleHeartIcon color="var(--mood-color)" width={34} height={30} className="shrink-0" />
      </section>
    </main>
  );
}
