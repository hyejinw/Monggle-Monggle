"use client";

import { useSyncExternalStore } from "react";
import { CHECKIN_STORAGE_KEY, COLORS, getContrastText, normalizeColorId } from "@/lib/colorLogic";

const DEFAULT_COLOR_ID = "blue";

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

export default function AppFrame({ children }) {
  const colorId = useSyncExternalStore(subscribeToCheckinColor, getSavedColorId, () => DEFAULT_COLOR_ID);
  const activeColor = COLORS[colorId] ?? COLORS[DEFAULT_COLOR_ID];

  return (
    <div
      data-app-frame
      className="mx-auto flex h-dvh max-w-[480px] flex-col overflow-hidden rounded-[42px] border-[6px] bg-white shadow-lg min-[390px]:rounded-[56px] min-[390px]:border-8"
      style={{
        borderColor: activeColor.borderHex,
        "--mood-color": activeColor.hex,
        "--mood-border-color": activeColor.borderHex,
        "--mood-on-color": getContrastText(activeColor.hex),
      }}
    >
      {children}
    </div>
  );
}
