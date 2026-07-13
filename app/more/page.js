"use client";

import { useSyncExternalStore } from "react";
import Mascot from "@/components/Mascot";
import { ChevronRightIcon } from "@/components/Icons";
import { CHECKIN_STORAGE_KEY, COLORS, normalizeColorId } from "@/lib/colorLogic";

const USER_NAME = "혜진";
const DEFAULT_COLOR_ID = "blue";

const SECTIONS = [
  {
    title: "내 마음 기록",
    items: ["감정 캘린더", "마음 변화 리포트", "주기적 마음검사", "비밀노트"],
  },
  {
    title: "몽글이 알아보기",
    items: ["감정 컬러 안내", "이용 가이드", "정신건강 정보"],
  },
  {
    title: "도움과 안전",
    items: ["지금 도움이 필요해요", "도움받을 곳 찾기"],
  },
  {
    title: "설정 및 관리",
    items: ["알림 설정", "개인정보 및 보안", "고객지원", "약관 및 앱 정보"],
  },
];

function getSavedColorId() {
  if (typeof window === "undefined") return DEFAULT_COLOR_ID;
  try {
    const raw = localStorage.getItem(CHECKIN_STORAGE_KEY);
    const saved = raw ? JSON.parse(raw) : null;
    const colorId = normalizeColorId(saved?.colorId);
    return COLORS[colorId] ? colorId : DEFAULT_COLOR_ID;
  } catch {
    return DEFAULT_COLOR_ID;
  }
}

function subscribeToCheckinColor(onStoreChange) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener("monggle:checkin-change", onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener("monggle:checkin-change", onStoreChange);
  };
}

function GearIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M12 8.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6Z" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.2 13.3c.1-.4.1-.8.1-1.3s0-.9-.1-1.3l2-1.5-2-3.5-2.4 1a8 8 0 0 0-2.2-1.3L14.3 3h-4.6l-.4 2.4a8 8 0 0 0-2.2 1.3l-2.4-1-2 3.5 2 1.5c-.1.4-.1.8-.1 1.3s0 .9.1 1.3l-2 1.5 2 3.5 2.4-1a8 8 0 0 0 2.2 1.3l.4 2.4h4.6l.4-2.4a8 8 0 0 0 2.2-1.3l2.4 1 2-3.5-2.1-1.5Z"
      />
    </svg>
  );
}

function MockRow({ children }) {
  return (
    <div className="flex h-12 items-center justify-between border-b border-zinc-100 last:border-b-0">
      <span className="text-[15px] font-medium text-zinc-900 min-[390px]:text-base">{children}</span>
      <ChevronRightIcon width={19} height={19} className="text-zinc-900" />
    </div>
  );
}

export default function MorePage() {
  const colorId = useSyncExternalStore(subscribeToCheckinColor, getSavedColorId, () => DEFAULT_COLOR_ID);

  return (
    <main className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-white">
      <header className="flex shrink-0 items-center justify-between px-5 pb-3 pt-5">
        <h1 className="font-[family-name:var(--font-hakgyo-nalgae)] text-[34px] font-normal leading-none text-[var(--mood-color)] min-[390px]:text-[38px]">
          몽글몽글
        </h1>
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-100 bg-white text-zinc-900 shadow-sm">
          <GearIcon width={24} height={24} />
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">
        <section className="mb-3 flex items-center gap-4 rounded-[22px] border border-zinc-100 bg-white p-4 shadow-sm">
          <div className="flex h-[76px] w-[76px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--mood-border-color)]">
            <Mascot colorId={colorId} size={82} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xl font-extrabold text-zinc-900">{USER_NAME}님</p>
            <p className="mt-1 text-sm font-medium text-zinc-500">내 정보 및 이용 설정</p>
          </div>
          <ChevronRightIcon width={22} height={22} className="shrink-0 text-zinc-900" />
        </section>

        <div className="space-y-3">
          {SECTIONS.map((section) => (
            <section
              key={section.title}
              className="rounded-[22px] border border-zinc-100 bg-white px-4 py-3 shadow-sm"
            >
              <h2 className="mb-1 text-[17px] font-extrabold text-zinc-900">{section.title}</h2>
              {section.items.map((item) => (
                <MockRow key={item}>{item}</MockRow>
              ))}
            </section>
          ))}
        </div>

        <div className="mt-3 flex h-12 items-center justify-center rounded-[18px] border border-zinc-100 text-sm font-medium text-zinc-500">
          로그아웃
        </div>
      </div>
    </main>
  );
}
