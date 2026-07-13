// 캐릭터/마음 색 팔레트 (확정, 5색).
// borderHex는 앱 외곽 경계에 쓰는 보조 컬러이며, hex와 같은 순서로 관리한다.
export const COLORS = {
  blue: { id: "blue", hex: "#6698FF", borderHex: "#DDEBFF", label: "파란색", state: "이성·긍정회로" },
  yellow: { id: "yellow", hex: "#FBE7A1", borderHex: "#FFF7DD", label: "노란색", state: "비움·평온" },
  orange: { id: "orange", hex: "#FFA500", borderHex: "#FED8B1", label: "주황색", state: "불안·심란" },
  red: { id: "red", hex: "#E42217", borderHex: "#FFCCCC", label: "용암빨강", state: "과부하·탈출욕구" },
  black: { id: "black", hex: "#000000", borderHex: "#D3D3D3", label: "검정색", state: "소멸·리셋" },
};

export const COLOR_ORDER = ["blue", "yellow", "orange", "red", "black"];
export const LEGACY_COLOR_IDS = { white: "yellow" };

export function normalizeColorId(colorId) {
  return LEGACY_COLOR_IDS[colorId] ?? colorId;
}

// 체크인 결과를 저장하는 localStorage 키 (체크인 화면이 쓰고, 홈 화면이 읽는다).
export const CHECKIN_STORAGE_KEY = "monggle:lastCheckin:v2";

// 원본 PPT 기준 색상당 20개. 세션당 8개씩 랜덤 추출해서 사용한다.
export const WORD_BANK = {
  black: [
    "지구멸망", "리셋하고파", "숨고 싶다", "이불 속 탈출 불가", "영혼 가출",
    "나 좀 가만히 둬", "사라지고 싶다", "침대와 물아일체", "다 부질없다", "의미 상실",
    "통째로 로그아웃", "그냥 눈 감을래", "깜깜함", "먹구름 가득", "움직이기 싫어",
    "에너지 0%", "세상과의 단절", "나 왜 이러지", "무소유 상태", "의욕 증발",
  ],
  red: [
    "차에 치이고파", "다 때려쳐", "자체 휴강/휴무", "퇴사각", "홧김에 결제",
    "폭발 직전", "건들지 마라", "가슴이 답답", "때려치우고 싶다", "멘탈 바사삭",
    "유리멘탈", "과부하", "이 갈림", "울컥함", "짜증 폭발",
    "다 싫어", "이머전시(비상)", "도망치고파", "때려 부수고 싶다", "화딱지",
  ],
  orange: [
    "막막함", "내일이 오는 게 두려워", "싱숭생숭", "눈치 보임", "조급함",
    "한숨만 푹푹", "가슴 두근거림", "어쩌지", "겉도는 느낌", "걱정 인형",
    "찌든 냄새", "심란함", "꼬여버린 생각", "뒤처지는 기분", "억울함",
    "소외감", "눈물 찔끔", "막다른 길", "나만 힘든가", "삐딱선",
  ],
  yellow: [
    "잔잔함", "마음 비우기", "한숨 돌림", "멍하니 하늘 보기", "토닥토닥",
    "그럴 수 있지", "충전 중", "한 고비 넘김", "무난무난", "그럭저럭",
    "버틸 만해", "조금 풀림", "평온하려고 노력 중", "힐링 필요", "나쁘지 않아",
    "생각 멈춤", "무자극 상태", "가만히 쉬기", "한갓짐", "마음 안심",
  ],
  blue: [
    "맛있는 거 생각남", "소소한 행복 찾기", "시작이 반", "괜찮아지겠지", "바람 쐬고파",
    "정신이 번쩍", "슬슬 움직여볼까", "힘내보자고", "맑은 정신", "할 수 있어",
    "기분 전환", "긍정 회로 가동", "생산적인 하루", "자신감 충전", "의욕 뿜뿜",
    "다음 단계로", "해낼 수 있어", "홀가분함", "한 걸음 앞으로", "좋은 예감",
  ],
};

// 노랑(20개)은 이번 세션 로직에서 미사용. 원본 PPT에 단어 목록이 있으나
// 이번 스펙 문서에는 전달되지 않아 여기 보관하지 않음 — 향후 확장 시 팀원 자료에서 받아 추가.

export const SESSION_PARAMS = {
  poolPerColor: 8, // 색상당 세션 풀 (해당 색 20개 중 랜덤 추출)
  threshold: 5, // 같은 색 5개 선택 시 즉시 종료
  sessionLimitMs: 60_000, // 전체 세션 제한시간
  spawnIntervalMs: 1500, // 스폰 간격 (60초 ÷ 40개 스펙 그대로 유지)
  // 단어 낙하 시간: 스폰 양은 유지하되 화면 흐름이 답답하지 않도록 원안보다 약간만 여유를 둔다.
  fallDurationMs: [5200, 6500],
  lowEngagementMinPicks: 3, // 60초간 이 개수 미만 선택 시 black으로 폴백
};

function shuffle(list) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// 색상당 8개씩 랜덤 추출해 40개 세션 큐를 만들고 스폰 순서를 섞는다.
export function buildSessionQueue() {
  let queue = [];
  let uid = 0;
  for (const color of COLOR_ORDER) {
    const words = shuffle(WORD_BANK[color]).slice(0, SESSION_PARAMS.poolPerColor);
    queue.push(...words.map((word) => ({ id: `w${uid++}`, word, color })));
  }
  return shuffle(queue);
}

export function createEmptyTally() {
  return COLOR_ORDER.reduce((acc, color) => ({ ...acc, [color]: 0 }), {});
}

// 타임아웃 시 우승 색상 결정: 최댓값이 여러 색이면 마지막으로 선택한 색 우선.
export function pickWinnerColor(tally, lastPickedColor) {
  const max = Math.max(...Object.values(tally));
  const winners = COLOR_ORDER.filter((color) => tally[color] === max);
  if (winners.length === 1) return winners[0];
  return lastPickedColor && winners.includes(lastPickedColor) ? lastPickedColor : winners[0];
}

// 세션 종료 시 최종 색상 결정 (저참여 폴백 포함).
export function resolveSessionResult({ tally, lastPickedColor }) {
  const totalPicks = Object.values(tally).reduce((a, b) => a + b, 0);
  if (totalPicks < SESSION_PARAMS.lowEngagementMinPicks) {
    return "black";
  }
  return pickWinnerColor(tally, lastPickedColor);
}

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex([r, g, b]) {
  const toHex = (v) => Math.round(v).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function blendHex(baseHex, targetHex, weight) {
  const base = hexToRgb(baseHex);
  const target = hexToRgb(targetHex);
  return rgbToHex(base.map((c, i) => c + (target[i] - c) * weight));
}

// 탭할 때마다 현재 tally 비율로 가중평균 보간해 실시간 캐릭터/배경 색을 계산한다.
export function getBlendedColor(tally, neutralHex = "#CCCCCC") {
  const total = Object.values(tally).reduce((a, b) => a + b, 0);
  if (total === 0) return neutralHex;
  return Object.entries(tally).reduce(
    (acc, [color, count]) => (count === 0 ? acc : blendHex(acc, COLORS[color].hex, count / total)),
    neutralHex
  );
}

// 밝은 배경(흰색 등) 위에서 텍스트 대비를 확보하기 위한 헬퍼.
export function getContrastText(hex) {
  const [r, g, b] = hexToRgb(hex);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#171717" : "#FFFFFF";
}

// 미니게임 결과(위로형/복수형 플레이 횟수)로 색 단계를 보정한다.
// TODO: 위로형 플레이가 많을수록 blue/yellow 방향으로 이동하는 규칙 구현
export function adjustColorFromGameResult(currentColor, gameResult) {
  return currentColor;
}
