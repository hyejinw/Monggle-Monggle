"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRightIcon } from "@/components/Icons";

const COMICS = [
  "/comics/four-cut-1.png",
  "/comics/four-cut-2.png",
  "/comics/four-cut-3.png",
  "/comics/four-cut-4.png",
];

const LOADING_COPY = [
  "대화를 만화로 그리고 있어요",
  "장면을 고르고 있어요",
  "몽글이가 컷을 정리하고 있어요",
];

export default function ComicPage() {
  const [comicSrc, setComicSrc] = useState(null);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);

  useEffect(() => {
    const selected = COMICS[Math.floor(Math.random() * COMICS.length)];
    const textTimer = setInterval(() => {
      setLoadingTextIndex((index) => (index + 1) % LOADING_COPY.length);
    }, 1600);
    const imageTimer = setTimeout(() => {
      clearInterval(textTimer);
      setComicSrc(selected);
    }, 3800);

    return () => {
      clearInterval(textTimer);
      clearTimeout(imageTimer);
    };
  }, []);

  return (
    <main className="relative flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-white">
      <div className="pointer-events-none absolute -right-12 top-24 h-32 w-32 rounded-full bg-[var(--mood-border-color)] opacity-70" />
      <div className="pointer-events-none absolute -left-10 bottom-28 h-28 w-28 rounded-full bg-[var(--mood-border-color)] opacity-60" />
      <div className="pointer-events-none absolute right-8 bottom-20 h-3 w-16 rotate-[-18deg] rounded-full bg-[var(--mood-color)] opacity-25" />

      <header className="relative z-10 flex shrink-0 items-center gap-3 px-5 py-4">
        <Link href="/" className="text-zinc-400" aria-label="홈으로">
          <ChevronRightIcon width={20} height={20} className="rotate-180" />
        </Link>
        <h1 className="font-[family-name:var(--font-hakgyo-nalgae)] text-[28px] font-normal leading-none text-[var(--mood-color)]">
          몽글 만화
        </h1>
      </header>

      {comicSrc ? (
        <div className="relative z-10 flex min-h-0 flex-1 items-center justify-center overflow-hidden px-5 pb-5">
          <div className="w-full max-w-[380px] rounded-[34px] border-4 border-[var(--mood-border-color)] bg-white p-2 shadow-[0_18px_45px_rgba(0,0,0,0.08)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={comicSrc}
              alt="몽글이가 만든 네컷 만화"
              className="mx-auto max-h-[calc(100dvh-190px)] w-full rounded-[24px] object-contain"
            />
          </div>
        </div>
      ) : (
        <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
          <div className="relative flex h-20 w-20 items-center justify-center">
            <span className="absolute h-full w-full rounded-full bg-[var(--mood-border-color)]" />
            <span className="relative h-14 w-14 animate-spin rounded-full border-4 border-white border-t-[var(--mood-color)]" />
          </div>
          <p className="text-xl font-bold text-zinc-900">{LOADING_COPY[loadingTextIndex]}</p>
        </div>
      )}
    </main>
  );
}
