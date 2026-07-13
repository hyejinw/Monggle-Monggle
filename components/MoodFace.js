import { getContrastText } from "@/lib/colorLogic";

export default function MoodFace({ bg, size = 56 }) {
  const featureColor = getContrastText(bg) === "#FFFFFF" ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.55)";
  return (
    <svg viewBox="0 0 40 40" width={size} height={size}>
      <circle cx="20" cy="20" r="19" fill={bg} stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
      <circle cx="14" cy="17" r="1.8" fill={featureColor} />
      <circle cx="26" cy="17" r="1.8" fill={featureColor} />
      <path
        d="M13 25C15 28 25 28 27 25"
        stroke={featureColor}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
