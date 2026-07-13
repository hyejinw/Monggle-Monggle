import { COLORS, normalizeColorId } from "@/lib/colorLogic";

export function validateChatRequest(body) {
  if (!body || typeof body !== "object") {
    return "잘못된 요청입니다.";
  }

  if (typeof body.message !== "string" || !body.message.trim()) {
    return "메시지가 필요합니다.";
  }

  if (body.message.length > 2000) {
    return "메시지는 2,000자 이하로 입력해 주세요.";
  }

  const color = normalizeColorId(body.color || "blue");
  if (!COLORS[color]) {
    return "지원하지 않는 마음 색입니다.";
  }

  if (body.history && !Array.isArray(body.history)) {
    return "대화 기록 형식이 올바르지 않습니다.";
  }

  return null;
}
