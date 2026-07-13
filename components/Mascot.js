const MASCOT_BY_COLOR = {
  blue: "/characters/monggle-blue.png",
  yellow: "/characters/monggle-yellow.png",
  orange: "/characters/monggle-orange.png",
  red: "/characters/monggle-red.png",
  black: "/characters/monggle-black.png",
};

const COLOR_ID_BY_HEX = {
  "#6698FF": "blue",
  "#FBE7A1": "yellow",
  "#FFA500": "orange",
  "#E42217": "red",
  "#000000": "black",
};

function resolveColorId({ colorId, color }) {
  if (MASCOT_BY_COLOR[colorId]) return colorId;
  return COLOR_ID_BY_HEX[color?.toUpperCase()] ?? "blue";
}

export default function Mascot({ colorId, color, size = 140, className = "" }) {
  const resolvedColorId = resolveColorId({ colorId, color });

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={MASCOT_BY_COLOR[resolvedColorId]}
      alt="몽글이"
      width={size}
      height={size}
      className={`select-none object-contain ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
