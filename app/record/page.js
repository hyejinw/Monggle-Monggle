"use client";

import { useState } from "react";
import { ChevronRightIcon, PlusIcon, SpeakerIcon } from "@/components/Icons";

const MOOD_COLORS = ["#6698FF", "#FBE7A1", "#FFA500", "#E42217", "#000000"];

const DAYS = [
  { day: 28, muted: true },
  { day: 29, muted: true },
  { day: 30, muted: true },
  { day: 1, mood: 0 },
  { day: 2, mood: 1 },
  { day: 3, mood: 2 },
  { day: 4, mood: 2 },
  { day: 5, mood: 2 },
  { day: 6, mood: 0 },
  { day: 7, mood: 0 },
  { day: 8, mood: 2 },
  { day: 9, mood: 1 },
  { day: 10, mood: 2 },
  { day: 11, mood: 0 },
  { day: 12, mood: 3 },
  { day: 13, mood: 0 },
  { day: 14, selected: true, mood: 1 },
  { day: 15, mood: 0 },
  { day: 16, mood: 4 },
  { day: 17, mood: 4 },
  { day: 18, mood: 2 },
  { day: 19, mood: 4 },
  { day: 20, mood: 0 },
  { day: 21, mood: 2 },
  { day: 22, mood: 4 },
  { day: 23, mood: 3 },
  { day: 24, mood: 2 },
  { day: 25 },
  { day: 26 },
  { day: 27 },
  { day: 28, mood: 4 },
  { day: 29, mood: 4 },
  { day: 30, mood: 0 },
  { day: 31 },
  { day: 1, muted: true },
  { day: 2, muted: true },
];

const TABS = ["캘린더", "마음 일기", "내 음악"];
const TAGS = ["피곤함", "신경 쓰임", "집중이 안 됨", "불안함", "짜증", "적정"];
const DIARY_ITEMS = [
  {
    date: "7월 14일 (화)",
    mood: "주의",
    summary: "오늘은 별일은 없었지만 조금 피곤하고 집중이 잘 안 됐어요.",
    color: "#FBE7A1",
  },
  {
    date: "7월 10일 (금)",
    mood: "불안",
    summary: "해야 할 일이 많아서 마음이 조금 복잡했어요.",
    color: "#FFA500",
  },
  {
    date: "7월 6일 (월)",
    mood: "괜찮음",
    summary: "산책을 하고 나니 생각이 조금 가벼워졌어요.",
    color: "#6698FF",
  },
];

const MUSIC_ITEMS = [
  { title: "잔잔한 오후", meta: "AI가 만들어준 음악 · 02:15", mood: "주의" },
  { title: "느린 숨", meta: "마음을 정리하는 음악 · 01:45", mood: "편안" },
  { title: "작은 파도", meta: "쉬어가는 음악 · 03:00", mood: "괜찮음" },
];

function MoodDot({ mood }) {
  if (mood === undefined) return <span className="h-2.5 w-2.5" />;
  return (
    <span
      className="h-2.5 w-2.5 rounded-full border border-black/10"
      style={{ backgroundColor: MOOD_COLORS[mood] }}
    />
  );
}

function StatBox({ icon, label }) {
  return (
    <div className="flex min-w-0 flex-1 items-center justify-center gap-1.5 border-r border-zinc-100 px-2 py-3 text-sm font-semibold text-zinc-700 last:border-r-0">
      <span className="text-base">{icon}</span>
      <span className="truncate">{label}</span>
    </div>
  );
}

function TabBar({ activeTab, onChange }) {
  return (
    <div className="mb-3 grid grid-cols-3 rounded-full bg-zinc-100 p-1">
      {TABS.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          className={`flex h-11 items-center justify-center rounded-full text-sm font-extrabold ${
            activeTab === tab
              ? "border border-[var(--mood-color)] bg-white text-[var(--mood-color)] shadow-sm"
              : "text-zinc-500"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

function CalendarView() {
  return (
    <>
      <section className="rounded-[26px] border border-zinc-100 bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <ChevronRightIcon width={22} height={22} className="rotate-180 text-zinc-800" />
          <h2 className="text-xl font-extrabold text-zinc-900">2026년 7월</h2>
          <ChevronRightIcon width={22} height={22} className="text-zinc-800" />
        </div>

        <div className="grid grid-cols-7 pb-2 text-center text-sm font-bold text-zinc-500">
          {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-3">
          {DAYS.map((item, index) => (
            <div key={`${item.day}-${index}`} className="flex h-[46px] flex-col items-center justify-start gap-1">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-extrabold ${
                  item.selected
                    ? "border-2 border-[var(--mood-color)] text-[var(--mood-color)]"
                    : item.muted
                      ? "text-zinc-300"
                      : "text-zinc-900"
                }`}
              >
                {item.day}
              </span>
              <MoodDot mood={item.mood} />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-4 overflow-hidden rounded-[24px] border border-[var(--mood-border-color)] bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 p-4">
          <div className="min-w-0">
            <p className="truncate text-base font-bold text-zinc-900">
              7월 14일 (화)
              <span className="ml-2 text-sm font-extrabold text-[var(--mood-color)]">● 주의</span>
            </p>
            <p className="mt-2 truncate text-sm font-medium text-zinc-500">
              조금 피곤하고 신경 쓰이는 날
            </p>
          </div>
          <ChevronRightIcon width={22} height={22} className="shrink-0 text-zinc-900" />
        </div>
        <div className="grid grid-cols-3 border-t border-[var(--mood-border-color)]">
          <StatBox icon="▤" label="일기 1개" />
          <StatBox icon="▧" label="사진 2장" />
          <StatBox icon="♫" label="음악 1곡" />
        </div>
      </section>

      <button
        type="button"
        className="mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-[18px] bg-[var(--mood-color)] text-lg font-extrabold text-[var(--mood-on-color)]"
      >
        <PlusIcon width={22} height={22} />
        오늘의 일기 쓰기
      </button>
    </>
  );
}

function DiaryView() {
  return (
    <div className="space-y-4">
      {DIARY_ITEMS.map((item) => (
        <section key={item.date} className="rounded-[24px] border border-zinc-100 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex min-w-0 items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
              <p className="truncate text-base font-bold text-zinc-900">{item.date}</p>
            </div>
            <span className="shrink-0 text-sm font-extrabold text-[var(--mood-color)]">{item.mood}</span>
          </div>
          <p className="rounded-[18px] bg-zinc-50 p-4 text-[15px] font-medium leading-7 text-zinc-700">
            {item.summary}
          </p>
          <div className="mt-3 flex gap-2 overflow-hidden">
            <div className="h-20 flex-1 rounded-2xl bg-[linear-gradient(135deg,#F7D7A7,#8B6E4E)]" />
            <div className="h-20 flex-1 rounded-2xl bg-[linear-gradient(135deg,#A9D8FF,#FFFFFF)]" />
            <div className="h-20 flex-1 rounded-2xl bg-[linear-gradient(135deg,#EFE7D8,#9A8B72)]" />
          </div>
        </section>
      ))}
    </div>
  );
}

function MusicView() {
  return (
    <div className="space-y-4">
      <section className="rounded-[24px] border border-[var(--mood-border-color)] bg-white p-4 shadow-sm">
        <p className="text-sm font-bold text-[var(--mood-color)]">오늘의 마음색</p>
        <div className="mt-3 flex items-center justify-between gap-3 rounded-[18px] bg-[var(--mood-border-color)] p-4">
          <div>
            <p className="text-lg font-extrabold text-zinc-900">주의</p>
            <p className="mt-1 text-sm font-medium text-zinc-500">조금 피곤하고 신경 쓰이는 날</p>
          </div>
          <ChevronRightIcon width={22} height={22} className="text-zinc-900" />
        </div>
      </section>

      <section className="rounded-[24px] border border-zinc-100 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-extrabold text-zinc-900">AI 음악 만들기</h2>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {["마음을 정리하고 싶어요", "기분을 가볍게 하고 싶어요", "집중할 수 있는 음악", "편안하게 쉬고 싶어요"].map((label, index) => (
            <div
              key={label}
              className={`rounded-[18px] border p-3 text-sm font-bold ${
                index === 0
                  ? "border-[var(--mood-color)] text-[var(--mood-color)]"
                  : "border-zinc-100 text-zinc-700"
              }`}
            >
              {label}
            </div>
          ))}
        </div>
      </section>

      {MUSIC_ITEMS.map((item) => (
        <section key={item.title} className="flex items-center gap-3 rounded-[22px] border border-zinc-100 bg-white p-4 shadow-sm">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--mood-border-color)] text-[var(--mood-color)]">
            <SpeakerIcon width={26} height={26} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-extrabold text-zinc-900">{item.title}</p>
            <p className="mt-1 truncate text-sm font-medium text-zinc-500">{item.meta}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--mood-color)] text-[var(--mood-on-color)]">
            ▶
          </div>
        </section>
      ))}
    </div>
  );
}

export default function RecordPage() {
  const [activeTab, setActiveTab] = useState(TABS[0]);

  return (
    <main className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-white">
      <header className="flex shrink-0 items-center justify-between px-5 pb-3 pt-5">
        <h1 className="font-[family-name:var(--font-hakgyo-nalgae)] text-[34px] font-normal leading-none text-[var(--mood-color)] min-[390px]:text-[38px]">
          기록
        </h1>
        <div className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-900">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 8.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.2 13.3c.1-.4.1-.8.1-1.3s0-.9-.1-1.3l2-1.5-2-3.5-2.4 1a8 8 0 0 0-2.2-1.3L14.3 3h-4.6l-.4 2.4a8 8 0 0 0-2.2 1.3l-2.4-1-2 3.5 2 1.5c-.1.4-.1.8-.1 1.3s0 .9.1 1.3l-2 1.5 2 3.5 2.4-1a8 8 0 0 0 2.2 1.3l.4 2.4h4.6l.4-2.4a8 8 0 0 0 2.2-1.3l2.4 1 2-3.5-2.1-1.5Z" />
          </svg>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">
        <TabBar activeTab={activeTab} onChange={setActiveTab} />
        {activeTab === "캘린더" && <CalendarView />}
        {activeTab === "마음 일기" && <DiaryView />}
        {activeTab === "내 음악" && <MusicView />}
      </div>
    </main>
  );
}
