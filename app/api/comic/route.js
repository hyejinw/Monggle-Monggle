export async function POST(request) {
  const { history, theme } = await request.json();

  // TODO: /api/chat에서 쌓인 대화 히스토리를 요약·재구성해 4컷 대사 생성
  // theme: "더글로리" 우선 구현, 이미지는 고정 에셋(public/characters) 사용
  return Response.json({
    theme: theme ?? "더글로리",
    panels: ["(임시) 대사 1", "(임시) 대사 2", "(임시) 대사 3", "(임시) 대사 4"],
  });
}
