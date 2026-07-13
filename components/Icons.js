const base = {
  fill: "none",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function PlusIcon(props) {
  return (
    <svg viewBox="0 0 24 24" stroke="currentColor" {...base} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function BellIcon(props) {
  return (
    <svg viewBox="0 0 24 24" stroke="currentColor" {...base} {...props}>
      <path d="M6 10a6 6 0 0 1 12 0c0 4 1.5 5.5 2 6H4c.5-.5 2-2 2-6Z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </svg>
  );
}

export function PersonIcon(props) {
  return (
    <svg viewBox="0 0 24 24" stroke="currentColor" {...base} {...props}>
      <circle cx="12" cy="8" r="3.4" />
      <path d="M5 20c1.2-3.8 4-5.6 7-5.6s5.8 1.8 7 5.6" />
    </svg>
  );
}

export function ChevronRightIcon(props) {
  return (
    <svg viewBox="0 0 24 24" stroke="currentColor" {...base} {...props}>
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
}

export function ChatHeartIcon({ color = "#6698FF", ...rest }) {
  return (
    <svg viewBox="0 0 40 40" {...rest}>
      <path
        d="M6 10a4 4 0 0 1 4-4h20a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4H16l-7 6v-6H10a4 4 0 0 1-4-4Z"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M20 24c-5-3-8-6-8-9.5a3.5 3.5 0 0 1 6.5-1.8 3.5 3.5 0 0 1 6.5 1.8c0 3.5-3 6.5-8 9.5Z"
        fill={color}
      />
    </svg>
  );
}

export function ComicGridIcon({ color = "#6698FF", ...rest }) {
  return (
    <svg viewBox="0 0 40 40" {...rest}>
      <rect x="5" y="5" width="13" height="13" rx="3" fill="none" stroke={color} strokeWidth="2" />
      <rect x="22" y="5" width="13" height="13" rx="3" fill="none" stroke={color} strokeWidth="2" />
      <rect x="5" y="22" width="13" height="13" rx="3" fill="none" stroke={color} strokeWidth="2" />
      <rect x="22" y="22" width="13" height="13" rx="3" fill="none" stroke={color} strokeWidth="2" />
      {[
        [11.5, 13.5],
        [28.5, 13.5],
        [11.5, 30.5],
        [28.5, 30.5],
      ].map(([cx, cy], i) => (
        <g key={i} stroke={color} strokeWidth="1.3" fill="none">
          <circle cx={cx} cy={cy} r="3.4" />
          <path d={`M${cx - 1} ${cy - 3.8}c1.5-1 2.5 0.5 1 1.5`} />
        </g>
      ))}
    </svg>
  );
}

export function GameControllerIcon({ color = "#6698FF", ...rest }) {
  return (
    <svg viewBox="0 0 40 40" {...rest}>
      <path
        d="M10 15h20a6 6 0 0 1 6 6v4a4 4 0 0 1-7 2.6L26 24H14l-3 3.6A4 4 0 0 1 4 25v-4a6 6 0 0 1 6-6Z"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M12 19v5M9.5 21.5h5" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="24.5" cy="20" r="1.4" fill={color} />
      <circle cx="28" cy="23.5" r="1.4" fill={color} />
      <path d="M32 6l1 2 2 1-2 1-1 2-1-2-2-1 2-1Z" fill={color} />
      <path d="M6 8l.7 1.4L8 10l-1.3.6L6 12l-.7-1.4L4 10l1.3-.6Z" fill={color} />
    </svg>
  );
}

export function QuoteMarkIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M3 11c0-3.9 2.3-6.6 6-7.6l.8 2.1C7.4 6.2 6 7.9 6 10h3v6H3v-5Zm11 0c0-3.9 2.3-6.6 6-7.6l.8 2.1c-2.4.7-3.8 2.4-3.8 4.5h3v6h-6v-5Z" />
    </svg>
  );
}

export function SparkleHeartIcon({ color = "#6698FF", ...rest }) {
  return (
    <svg viewBox="0 0 60 50" {...rest}>
      <path
        d="M40 14c-6-4-13-1-13 6.5C27 28 40 35 40 35s13-7 13-14.5c0-7.5-7-10.5-13-6.5Z"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <g fill={color}>
        <circle cx="8" cy="30" r="1.6" />
        <circle cx="15" cy="38" r="1.2" />
        <circle cx="20" cy="20" r="1.2" />
        <path d="M6 16l.6 1.4L8 18l-1.4.6L6 20l-.6-1.4L4 18l1.4-.6Z" />
      </g>
    </svg>
  );
}

export function HomeIcon({ active = false, ...rest }) {
  return (
    <svg
      viewBox="0 0 24 24"
      stroke="currentColor"
      fill={active ? "currentColor" : "none"}
      {...base}
      {...rest}
    >
      <path d="M4 11.5 12 4l8 7.5V20a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1Z" />
    </svg>
  );
}

export function ChatIcon({ active, ...props }) {
  return (
    <svg viewBox="0 0 24 24" stroke="currentColor" {...base} {...props}>
      <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-8l-4 3v-3H6a2 2 0 0 1-2-2Z" />
    </svg>
  );
}

export function CalendarIcon({ active = false, ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      stroke="currentColor"
      fill={active ? "currentColor" : "none"}
      {...base}
      {...props}
    >
      <path d="M7 3v4M17 3v4" />
      <rect x="4" y="5" width="16" height="16" rx="3" />
      <path d="M4 10h16" />
      <g fill={active ? "white" : "currentColor"} stroke="none">
        <circle cx="8" cy="14" r="1" />
        <circle cx="12" cy="14" r="1" />
        <circle cx="16" cy="14" r="1" />
        <circle cx="8" cy="18" r="1" />
        <circle cx="12" cy="18" r="1" />
      </g>
    </svg>
  );
}

export function MenuIcon({ active, ...props }) {
  return (
    <svg viewBox="0 0 24 24" stroke="currentColor" {...base} {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function SendIcon(props) {
  return (
    <svg viewBox="0 0 24 24" stroke="currentColor" {...base} {...props}>
      <path d="M21 4 10 15" />
      <path d="m21 4-7 17-4-6-6-4 17-7Z" />
    </svg>
  );
}

export function SpeakerIcon(props) {
  return (
    <svg viewBox="0 0 24 24" stroke="currentColor" {...base} {...props}>
      <path d="M4 10v4h4l5 4V6l-5 4H4Z" />
      <path d="M16 9.5c.8.7 1.2 1.5 1.2 2.5s-.4 1.8-1.2 2.5" />
      <path d="M18.5 7c1.5 1.3 2.3 3 2.3 5s-.8 3.7-2.3 5" />
    </svg>
  );
}

export function TrashIcon(props) {
  return (
    <svg viewBox="0 0 24 24" stroke="currentColor" {...base} {...props}>
      <path d="M4 7h16" />
      <path d="M10 11v6M14 11v6" />
      <path d="M6 7l1 14h10l1-14" />
      <path d="M9 7V4h6v3" />
    </svg>
  );
}

export function RefreshIcon(props) {
  return (
    <svg viewBox="0 0 24 24" stroke="currentColor" {...base} {...props}>
      <path d="M20 12a8 8 0 0 1-13.6 5.7" />
      <path d="M4 12A8 8 0 0 1 17.6 6.3" />
      <path d="M17 3v4h4" />
      <path d="M7 21v-4H3" />
    </svg>
  );
}
