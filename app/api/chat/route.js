import { getOpenAI } from "@/lib/openai";
import { COLORS, normalizeColorId } from "@/lib/colorLogic";
import { MONGLE_SYSTEM_PROMPT } from "@/lib/prompts";
import { containsCrisisSignal, SAFE_CRISIS_MESSAGE } from "@/lib/safety";
import { validateChatRequest } from "@/lib/validators";

export const runtime = "nodejs";

const CHAT_RESPONSE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    message: { type: "string" },
    riskLevel: {
      type: "string",
      enum: ["normal", "concern", "crisis"],
    },
    shouldOfferTTS: { type: "boolean" },
    contentCategory: {
      type: "string",
      enum: ["safe", "abusive", "sexual", "illegal", "self_harm", "ambiguous"],
    },
    conversationSummary: { type: "string" },
  },
  required: ["message", "riskLevel", "shouldOfferTTS", "contentCategory", "conversationSummary"],
};

function sanitizeHistory(history = []) {
  return Array.isArray(history)
    ? history
        .filter((item) => item && ["user", "assistant"].includes(item.role) && typeof item.content === "string")
        .slice(-10)
        .map((item) => ({
          role: item.role,
          content: item.content.slice(0, 2000),
        }))
    : [];
}

export async function POST(request) {
  try {
    const body = await request.json();
    const color = normalizeColorId(body.color || "blue");
    const errorMessage = validateChatRequest({ ...body, color });

    if (errorMessage) {
      return Response.json({ error: errorMessage }, { status: 400 });
    }

    const userMessage = body.message.trim();
    const history = sanitizeHistory(body.history);
    const previousSummary =
      typeof body.previousSummary === "string" ? body.previousSummary.slice(0, 1000) : "";

    if (containsCrisisSignal(userMessage)) {
      return Response.json({
        message: SAFE_CRISIS_MESSAGE,
        riskLevel: "crisis",
        shouldOfferTTS: false,
        contentCategory: "self_harm",
        conversationSummary: "사용자가 즉각적인 안전 지원이 필요할 수 있는 표현을 사용함",
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        {
          message: "아직 API 키가 연결되지 않았어요. 환경변수를 설정한 뒤 다시 이야기해줘.",
          riskLevel: "normal",
          shouldOfferTTS: false,
          contentCategory: "safe",
          conversationSummary: "",
          error: "OPENAI_API_KEY_MISSING",
        },
        { status: 500 }
      );
    }

    const systemPrompt = MONGLE_SYSTEM_PROMPT.replace("{{COLOR}}", COLORS[color] ? color : "blue");
    const messages = [
      { role: "system", content: systemPrompt },
      ...(previousSummary
        ? [{ role: "user", content: `이전 대화 요약: ${previousSummary}` }]
        : []),
      ...history,
      {
        role: "user",
        content: [
          `현재 마음 색: ${color}`,
          `사용자의 새 메시지: ${userMessage}`,
          "몽글이의 규칙을 지키고 지정된 JSON 스키마로만 응답해.",
        ].join("\n"),
      },
    ];

    const completion = await getOpenAI().chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages,
      temperature: 0.6,
      max_tokens: 350,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "mongle_chat_response",
          strict: true,
          schema: CHAT_RESPONSE_SCHEMA,
        },
      },
    });

    const outputText = completion.choices?.[0]?.message?.content;
    if (!outputText) {
      throw new Error("OpenAI returned empty output");
    }

    const result = JSON.parse(outputText);

    if (result.riskLevel === "crisis") {
      return Response.json({
        message: SAFE_CRISIS_MESSAGE,
        riskLevel: "crisis",
        shouldOfferTTS: false,
        contentCategory: "self_harm",
        conversationSummary:
          result.conversationSummary || "사용자에게 즉각적인 안전 지원이 필요할 수 있음",
      });
    }

    return Response.json({
      message: result.message,
      riskLevel: result.riskLevel,
      shouldOfferTTS: result.shouldOfferTTS,
      contentCategory: result.contentCategory,
      conversationSummary: result.conversationSummary,
    });
  } catch (error) {
    console.error("POST /api/chat failed", {
      name: error?.name,
      message: error?.message,
      status: error?.status,
    });

    const status = error?.status === 429 ? 429 : 500;
    const message =
      error?.status === 429
        ? "요청이 잠시 몰렸어요. 조금 뒤에 다시 이야기해줘."
        : "잠깐 연결이 매끄럽지 않은가 봐. 네가 적어준 이야기는 그대로 남아 있어.";

    return Response.json(
      {
        message,
        riskLevel: "normal",
        shouldOfferTTS: false,
        contentCategory: "safe",
        conversationSummary: "",
        error: error?.status === 429 ? "RATE_LIMITED" : "CHAT_API_ERROR",
      },
      { status }
    );
  }
}
