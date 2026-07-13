"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Mascot from "@/components/Mascot";
import {
  ChevronRightIcon,
  RefreshIcon,
  SendIcon,
  SpeakerIcon,
  TrashIcon,
} from "@/components/Icons";
import { CHECKIN_STORAGE_KEY, COLORS, normalizeColorId } from "@/lib/colorLogic";

const CHAT_STORAGE_KEY = "monglemongle-chat-history";
const SUMMARY_STORAGE_KEY = "monglemongle-chat-summary";
const DEFAULT_COLOR_ID = "blue";

function createId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createAssistantMessage(content, extra = {}) {
  return {
    id: createId(),
    role: "assistant",
    content,
    createdAt: new Date().toISOString(),
    ...extra,
  };
}

function getSavedColorId() {
  if (typeof window === "undefined") return DEFAULT_COLOR_ID;
  try {
    const raw = localStorage.getItem(CHECKIN_STORAGE_KEY);
    const saved = raw ? JSON.parse(raw) : null;
    const colorId = normalizeColorId(saved?.colorId);
    return colorId && COLORS[colorId] ? colorId : DEFAULT_COLOR_ID;
  } catch {
    return DEFAULT_COLOR_ID;
  }
}

function speakText(text) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ko-KR";
  utterance.rate = 0.92;
  utterance.pitch = 1.05;
  window.speechSynthesis.speak(utterance);
}

function stopSpeech() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [summary, setSummary] = useState("");
  const [colorId, setColorId] = useState(DEFAULT_COLOR_ID);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastFailedText, setLastFailedText] = useState("");
  const [hasLoaded, setHasLoaded] = useState(false);
  const listRef = useRef(null);

  const activeColor = COLORS[colorId] ?? COLORS[DEFAULT_COLOR_ID];
  const greeting = useMemo(
    () =>
      createAssistantMessage("오늘 있었던 일을 천천히 말해줘. 몽글이가 여기서 같이 듣고 있을게.", {
        shouldOfferTTS: true,
        riskLevel: "normal",
      }),
    []
  );

  useEffect(() => {
    queueMicrotask(() => {
      setColorId(getSavedColorId());
      try {
        const savedMessages = localStorage.getItem(CHAT_STORAGE_KEY);
        const savedSummary = localStorage.getItem(SUMMARY_STORAGE_KEY);
        setMessages(savedMessages ? JSON.parse(savedMessages) : [greeting]);
        setSummary(savedSummary || "");
      } catch {
        setMessages([greeting]);
      }
      setHasLoaded(true);
    });

    const updateColor = () => setColorId(getSavedColorId());
    window.addEventListener("storage", updateColor);
    window.addEventListener("monggle:checkin-change", updateColor);
    return () => {
      stopSpeech();
      window.removeEventListener("storage", updateColor);
      window.removeEventListener("monggle:checkin-change", updateColor);
    };
  }, [greeting]);

  useEffect(() => {
    if (!hasLoaded) return;
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
  }, [hasLoaded, messages]);

  useEffect(() => {
    if (!hasLoaded) return;
    localStorage.setItem(SUMMARY_STORAGE_KEY, summary);
  }, [hasLoaded, summary]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    list.scrollTop = list.scrollHeight;
  }, [messages, isLoading]);

  async function sendMessage(textOverride) {
    const trimmed = (textOverride ?? input).trim();
    if (!trimmed || isLoading) return;

    const previousMessages = messages;
    const userMessage = {
      id: createId(),
      role: "user",
      content: trimmed,
      createdAt: new Date().toISOString(),
    };
    const placeholderId = createId();
    const placeholderMessage = {
      id: placeholderId,
      role: "assistant",
      content: "몽글이가 천천히 듣고 있어요...",
      createdAt: new Date().toISOString(),
      isPlaceholder: true,
      riskLevel: "normal",
      shouldOfferTTS: false,
    };

    setMessages((current) => [...current, userMessage, placeholderMessage]);
    setInput("");
    setError("");
    setLastFailedText("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          color: colorId,
          history: previousMessages.slice(-10).map(({ role, content }) => ({ role, content })),
          previousSummary: summary,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        const requestError = new Error(data.message || data.error || "대화 요청에 실패했습니다.");
        requestError.replyMessage = data.message;
        throw requestError;
      }

      setMessages((current) =>
        current.map((message) =>
          message.id === placeholderId
            ? createAssistantMessage(data.message, {
                id: placeholderId,
                riskLevel: data.riskLevel,
                shouldOfferTTS: data.shouldOfferTTS,
                contentCategory: data.contentCategory,
              })
            : message
        )
      );

      if (data.conversationSummary) {
        setSummary(data.conversationSummary);
      }
    } catch (requestError) {
      const fallbackMessage = "몽글이와 연결이 잠시 끊겼어요. 작성한 내용은 그대로 남아 있어요.";
      const replyMessage = requestError?.replyMessage || "연결이 잠깐 흔들렸어. 아래에서 다시 시도해줘.";
      setError(requestError?.message || fallbackMessage);
      setLastFailedText(trimmed);
      setMessages((current) =>
        current.map((message) =>
          message.id === placeholderId
            ? createAssistantMessage(replyMessage, {
                id: placeholderId,
                riskLevel: "normal",
                shouldOfferTTS: false,
                contentCategory: "safe",
              })
            : message
        )
      );
    } finally {
      setIsLoading(false);
    }
  }

  function clearChat() {
    stopSpeech();
    setMessages([greeting]);
    setSummary("");
    setError("");
    setLastFailedText("");
  }

  return (
    <main
      className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-white"
      style={{
        "--mood-color": activeColor.hex,
        "--mood-border": activeColor.borderHex,
      }}
    >
      <header className="shrink-0 px-4 pb-3 pt-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-100 text-zinc-400"
            aria-label="홈으로"
          >
            <ChevronRightIcon width={20} height={20} className="rotate-180" />
          </Link>
          <div className="text-center">
            <h1 className="font-[family-name:var(--font-hakgyo-nalgae)] text-[28px] leading-none text-[var(--mood-color)]">
              몽글 대화
            </h1>
            <p className="mt-1 text-xs font-medium text-zinc-400">{activeColor.state}</p>
          </div>
          <button
            type="button"
            onClick={clearChat}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-100 text-zinc-400"
            aria-label="대화 지우기"
          >
            <TrashIcon width={18} height={18} />
          </button>
        </div>

        <section className="mt-3 flex items-center gap-3 rounded-[22px] border p-3" style={{ borderColor: activeColor.borderHex }}>
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl" style={{ backgroundColor: activeColor.borderHex }}>
            <Mascot color={activeColor.hex} size={48} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-zinc-900">몽글이가 듣고 있어요</p>
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-zinc-500">
              전문적인 진단이나 상담 대신, 오늘 마음을 천천히 돌아볼 수 있게 곁에 있을게요.
            </p>
          </div>
        </section>
      </header>

      <section ref={listRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 pb-3">
        {messages.map((message) => {
          const isUser = message.role === "user";
          const isCrisis = message.riskLevel === "crisis";
          return (
            <article key={message.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
              {!isUser ? (
                <div className="mr-2 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: activeColor.borderHex }}>
                  <Mascot color={activeColor.hex} size={24} />
                </div>
              ) : null}
              <div
                className={`max-w-[78%] rounded-[20px] px-4 py-3 text-sm leading-relaxed ${
                  isUser
                    ? "rounded-br-md bg-[var(--mood-color)] text-white"
                    : isCrisis
                      ? "rounded-bl-md border border-red-100 bg-red-50 text-red-950"
                      : `rounded-bl-md bg-zinc-50 text-zinc-800 ${message.isPlaceholder ? "animate-pulse" : ""}`
                }`}
              >
                <p>{message.content}</p>
                {!isUser && message.shouldOfferTTS ? (
                  <button
                    type="button"
                    onClick={() => speakText(message.content)}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[var(--mood-color)]"
                  >
                    <SpeakerIcon width={14} height={14} />
                    듣기
                  </button>
                ) : null}
              </div>
            </article>
          );
        })}

      </section>

      <footer className="shrink-0 border-t border-zinc-100 bg-white px-4 pb-4 pt-3">
        {error ? (
          <div className="mb-2 flex items-center justify-between gap-2 rounded-2xl bg-red-50 px-3 py-2 text-xs text-red-900">
            <span className="min-w-0 flex-1">{error}</span>
            {lastFailedText ? (
              <button
                type="button"
                onClick={() => sendMessage(lastFailedText)}
                className="inline-flex shrink-0 items-center gap-1 font-bold"
              >
                <RefreshIcon width={13} height={13} />
                재시도
              </button>
            ) : null}
          </div>
        ) : null}

        <form
          className="flex items-end gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            sendMessage();
          }}
        >
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="오늘 마음에 남은 일을 적어주세요"
            rows={1}
            maxLength={2000}
            disabled={isLoading}
            className="max-h-24 min-h-12 flex-1 resize-none rounded-3xl border border-zinc-100 bg-zinc-50 px-4 py-3 text-sm leading-relaxed outline-none transition focus:border-[var(--mood-color)] disabled:opacity-60"
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                sendMessage();
              }
            }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--mood-color)] text-white disabled:bg-zinc-200"
            aria-label="메시지 보내기"
          >
            <SendIcon width={19} height={19} />
          </button>
        </form>
      </footer>
    </main>
  );
}
