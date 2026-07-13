"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Mascot from "@/components/Mascot";
import WordCloud, { WORD_CLOUD_WIDTH } from "@/components/WordCloud";
import { ChevronRightIcon } from "@/components/Icons";
import {
  COLORS,
  SESSION_PARAMS,
  CHECKIN_STORAGE_KEY,
  buildSessionQueue,
  createEmptyTally,
  resolveSessionResult,
} from "@/lib/colorLogic";

const WORD_START_Y = -WORD_CLOUD_WIDTH / 2;

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function CloudShape({ className = "" }) {
  return (
    <svg viewBox="0 0 64 36" width="56" height="32" className={className}>
      <path
        d="M14 28c-7 0-12-5-12-11S7 6 14 6c2-4 6-6 11-6 6 0 11 4 12 9 6 1 10 5 10 10 0 6-5 9-11 9H14Z"
        fill="#DDEBFF"
        stroke="#6698FF"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function CloudDecor() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between px-4 pt-3 opacity-80">
      <CloudShape />
      <CloudShape className="translate-y-3" />
    </div>
  );
}

export default function CheckInPage() {
  const [phase, setPhase] = useState("intro"); // intro | playing | result
  const [fallingWords, setFallingWords] = useState([]);
  const [secondsLeft, setSecondsLeft] = useState(Math.floor(SESSION_PARAMS.sessionLimitMs / 1000));
  const [resultColorId, setResultColorId] = useState(null);
  const [stageSize, setStageSize] = useState({ width: 360, height: 640 });

  const stageRef = useRef(null);
  const queueRef = useRef([]);
  const tallyRef = useRef(createEmptyTally());
  const lastPickedRef = useRef(null);
  const tappedWordIdsRef = useRef(new Set());
  const spawnTimerRef = useRef(null);
  const sessionTimerRef = useRef(null);
  const tickTimerRef = useRef(null);
  const endedRef = useRef(false);

  const stopTimers = useCallback(() => {
    clearInterval(spawnTimerRef.current);
    clearTimeout(sessionTimerRef.current);
    clearInterval(tickTimerRef.current);
  }, []);

  useEffect(() => stopTimers, [stopTimers]);

  useEffect(() => {
    if (!stageRef.current) return undefined;
    const updateStageSize = () => {
      const rect = stageRef.current.getBoundingClientRect();
      setStageSize({ width: rect.width, height: rect.height });
    };
    updateStageSize();
    const observer = new ResizeObserver(updateStageSize);
    observer.observe(stageRef.current);
    return () => observer.disconnect();
  }, [phase]);

  const endSession = useCallback(
    (colorId) => {
      if (endedRef.current) return;
      endedRef.current = true;
      stopTimers();
      setFallingWords([]);
      setResultColorId(colorId);
      setPhase("result");
      try {
        localStorage.setItem(CHECKIN_STORAGE_KEY, JSON.stringify({ colorId, ts: Date.now() }));
        window.dispatchEvent(new Event("monggle:checkin-change"));
      } catch {
        // localStorage 접근 불가 시 저장 생략
      }
    },
    [stopTimers]
  );

  const handleWordTap = useCallback(
    (event, id, color) => {
      event?.preventDefault();
      if (endedRef.current) return;
      if (tappedWordIdsRef.current.has(id)) return;
      tappedWordIdsRef.current.add(id);
      setFallingWords((words) => words.filter((w) => w.id !== id));
      tallyRef.current = { ...tallyRef.current, [color]: tallyRef.current[color] + 1 };
      lastPickedRef.current = color;
      if (tallyRef.current[color] >= SESSION_PARAMS.threshold) {
        endSession(color);
      }
    },
    [endSession]
  );

  const removeIfNotTapped = useCallback((id) => {
    if (tappedWordIdsRef.current.has(id)) return;
    setFallingWords((words) => words.filter((w) => w.id !== id));
  }, []);

  const startSession = useCallback(() => {
    endedRef.current = false;
    tallyRef.current = createEmptyTally();
    lastPickedRef.current = null;
    tappedWordIdsRef.current = new Set();
    setFallingWords([]);
    setResultColorId(null);
    setSecondsLeft(Math.floor(SESSION_PARAMS.sessionLimitMs / 1000));
    setPhase("playing");

    queueRef.current = buildSessionQueue();

    spawnTimerRef.current = setInterval(() => {
      const next = queueRef.current.shift();
      if (!next) {
        clearInterval(spawnTimerRef.current);
        return;
      }
      const duration = randomBetween(SESSION_PARAMS.fallDurationMs[0], SESSION_PARAMS.fallDurationMs[1]);
      const minLeft = -WORD_CLOUD_WIDTH * 0.35;
      const maxLeft = Math.max(minLeft, stageSize.width - WORD_CLOUD_WIDTH * 0.65);
      setFallingWords((words) => [
        ...words,
        {
          id: next.id,
          word: next.word,
          color: next.color,
          left: randomBetween(8, maxLeft),
          duration,
        },
      ]);
    }, SESSION_PARAMS.spawnIntervalMs);

    sessionTimerRef.current = setTimeout(() => {
      endSession(
        resolveSessionResult({ tally: tallyRef.current, lastPickedColor: lastPickedRef.current })
      );
    }, SESSION_PARAMS.sessionLimitMs);

    tickTimerRef.current = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
  }, [endSession, stageSize.width]);

  const resultColor = resultColorId ? COLORS[resultColorId] : null;
  const isPlaying = phase === "playing";

  return (
    <main
      className={
        isPlaying
          ? "relative flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-gradient-to-b from-brand-light via-white to-white"
          : "flex h-full min-h-0 flex-1 flex-col gap-5 overflow-hidden p-5"
      }
    >
      <header
        className={
          isPlaying
            ? "absolute inset-x-0 top-0 z-20 flex items-center gap-3 bg-white/70 px-5 py-4 backdrop-blur"
            : "flex items-center gap-3 pt-2"
        }
      >
        <Link href="/" className="text-zinc-400" aria-label="홈으로">
          <ChevronRightIcon width={20} height={20} className="rotate-180" />
        </Link>
        <h1 className="flex-1 text-lg font-bold text-zinc-900">오늘 체크인</h1>
        {phase === "playing" && (
          <span className="text-sm font-semibold tabular-nums text-zinc-400">{secondsLeft}초</span>
        )}
      </header>

      {phase === "intro" && (
        <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
          <Mascot colorId="blue" size={110} />
          <div>
            <p className="text-lg font-bold text-zinc-900">
              오늘 마음에 와닿는 단어를 골라주세요
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              구름에서 떨어지는 단어 중, 지금 내 마음과 가까운 단어를 탭하세요
            </p>
          </div>
          <button
            type="button"
            onClick={startSession}
            className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white"
          >
            시작하기
          </button>
        </div>
      )}

      {phase === "playing" && (
        <div ref={stageRef} className="relative min-h-0 flex-1 overflow-hidden">
          <CloudDecor />
          <AnimatePresence>
            {fallingWords.map((w) => (
              <motion.button
                key={w.id}
                type="button"
                data-word-id={w.id}
                className="absolute top-0 z-10 cursor-pointer touch-manipulation select-none border-0 bg-transparent p-0"
                style={{ left: w.left }}
                initial={{ y: WORD_START_Y, opacity: 1 }}
                animate={{ y: stageSize.height + WORD_CLOUD_WIDTH, opacity: [1, 1, 1, 0] }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.12 } }}
                whileTap={{ scale: 0.88 }}
                transition={{ duration: w.duration / 1000, ease: "linear" }}
                onAnimationComplete={() => removeIfNotTapped(w.id)}
                onPointerDown={(event) => handleWordTap(event, w.id, w.color)}
                onMouseDown={(event) => handleWordTap(event, w.id, w.color)}
                onTouchStart={(event) => handleWordTap(event, w.id, w.color)}
                onClick={(event) => handleWordTap(event, w.id, w.color)}
              >
                <WordCloud word={w.word} />
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      )}

      {phase === "result" && resultColor && (
        <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
          <Mascot colorId="blue" size={130} />
          <div>
            <p className="text-2xl font-extrabold text-zinc-900">체크인이 완료됐어요</p>
            <p className="mt-2 text-sm text-zinc-500">
              몽글이가 오늘의 흐름에 맞춰 대화를 준비했어요
            </p>
          </div>
          <div className="flex w-full flex-col gap-2">
            <Link
              href="/chat"
              className="rounded-full bg-brand px-6 py-3 text-center text-sm font-semibold text-white"
            >
              몽글이와 이야기하러 가기
            </Link>
            <Link
              href="/"
              className="rounded-full border border-zinc-200 px-6 py-3 text-center text-sm font-semibold text-zinc-600"
            >
              홈으로
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
