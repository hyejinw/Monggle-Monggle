# 체크인 기능 — 비 내리는 단어 선택 게임 스펙

> CLI 코딩 에이전트(Claude Code 등) 참조용. `project-spec.md`의 3-1(초기 체크인) 기능 상세 설계.

---

## 1. 색상 팔레트 (고정, 5색)

메인 컬러와 앱 외곽 경계 컬러를 한 쌍으로 관리한다. 경계 컬러는 `image/앱 경계 컬러예시.png`처럼 현재 마음색상에 맞춰 앱 프레임 외곽에 적용한다.

```js
export const COLORS = {
  blue:   { hex: "#6698FF", borderHex: "#DDEBFF", label: "파란색",   state: "이성·긍정회로" },
  yellow: { hex: "#FBE7A1", borderHex: "#FFF7DD", label: "노란색",   state: "비움·평온" },
  orange: { hex: "#FFA500", borderHex: "#FED8B1", label: "주황색",   state: "불안·심란" },
  red:    { hex: "#E42217", borderHex: "#FFCCCC", label: "용암빨강", state: "과부하·탈출욕구" },
  black:  { hex: "#000000", borderHex: "#D3D3D3", label: "검정색",   state: "소멸·리셋" },
};
```

> 입력값 `#FFCCC`는 5자리라 CSS 색상으로 유효하지 않으므로 `#FFCCCC`로 보정한다.

## 2. 단어 뱅크

원본 PPT 기준 색상당 20개씩.

- `black`: 지구멸망, 리셋하고파, 숨고 싶다, 이불 속 탈출 불가, 영혼 가출, 나 좀 가만히 둬, 사라지고 싶다, 침대와 물아일체, 다 부질없다, 의미 상실, 통째로 로그아웃, 그냥 눈 감을래, 깜깜함, 먹구름 가득, 움직이기 싫어, 에너지 0%, 세상과의 단절, 나 왜 이러지, 무소유 상태, 의욕 증발
- `red`(용암빨강): 차에 치이고파, 다 때려쳐, 자체 휴강/휴무, 퇴사각, 홧김에 결제, 폭발 직전, 건들지 마라, 가슴이 답답, 때려치우고 싶다, 멘탈 바사삭, 유리멘탈, 과부하, 이 갈림, 울컥함, 짜증 폭발, 다 싫어, 이머전시(비상), 도망치고파, 때려 부수고 싶다, 화딱지
- `orange`: 막막함, 내일이 오는 게 두려워, 싱숭생숭, 눈치 보임, 조급함, 한숨만 푹푹, 가슴 두근거림, 어쩌지, 겉도는 느낌, 걱정 인형, 찌든 냄새, 심란함, 꼬여버린 생각, 뒤처지는 기분, 억울함, 소외감, 눈물 찔끔, 막다른 길, 나만 힘든가, 삐딱선
- `yellow`: 잔잔함, 마음 비우기, 한숨 돌림, 멍하니 하늘 보기, 토닥토닥, 그럴 수 있지, 충전 중, 한 고비 넘김, 무난무난, 그럭저럭, 버틸 만해, 조금 풀림, 평온하려고 노력 중, 힐링 필요, 나쁘지 않아, 생각 멈춤, 무자극 상태, 가만히 쉬기, 한갓짐, 마음 안심
- `blue`: 맛있는 거 생각남, 소소한 행복 찾기, 시작이 반, 괜찮아지겠지, 바람 쐬고파, 정신이 번쩍, 슬슬 움직여볼까, 힘내보자고, 맑은 정신, 할 수 있어, 기분 전환, 긍정 회로 가동, 생산적인 하루, 자신감 충전, 의욕 뿜뿜, 다음 단계로, 해낼 수 있어, 홀가분함, 한 걸음 앞으로, 좋은 예감

## 3. 세션 파라미터 (확정)

| 항목 | 값 | 근거 |
|---|---|---|
| 색상 수 | 5 | 위 팔레트 |
| 색상당 세션 풀 | 8개 (해당 색 20개 중 랜덤 추출) | 종료 임계값(5) 대비 여유 62.5% |
| 세션 전체 풀 | 40개 (5색 × 8개) | |
| 종료 임계값 | 같은 색 **5개** 선택 시 즉시 종료 | 풀 8개 중 5개면 신뢰 가능한 신호, 완벽 포착 강요 안 함 |
| 전체 세션 제한시간 | 60초 (하드 캡) | |
| 스폰 간격 | 1.5초 | 60초 ÷ 40개 = 1.5초, 시간 내 풀 전량 소진되도록 역산 |
| 단어 낙하 시간 | 4~5초 (상단→하단) | 화면에 2~3개 동시 노출, 몰입감 있는 속도 |
| 저참여 폴백 | 60초간 3개 미만 선택 시 → 결과 `black`으로 자동 처리 | "자기 상태도 모를 때"라는 컨셉과 자연스럽게 부합 |
| 동점 처리 | tally 최댓값이 여러 색일 경우 → 마지막으로 선택한 색 우선 | |

## 4. 종료 로직 (의사코드)

```js
const tally = { blue: 0, yellow: 0, orange: 0, red: 0, black: 0 };
let lastPickedColor = null;
const THRESHOLD = 5;
const SESSION_LIMIT_MS = 60_000;

function onWordTap(color) {
  tally[color] += 1;
  lastPickedColor = color;
  if (tally[color] >= THRESHOLD) {
    endSession(color);
  }
}

function onTimeUp() {
  const totalPicks = Object.values(tally).reduce((a, b) => a + b, 0);
  if (totalPicks < 3) {
    endSession("black"); // 저참여 폴백
    return;
  }
  const max = Math.max(...Object.values(tally));
  const winners = Object.keys(tally).filter((c) => tally[c] === max);
  endSession(winners.length === 1 ? winners[0] : lastPickedColor);
}
```

## 5. 세션 단어 큐 생성

```js
function buildSessionQueue(wordBank) {
  const colors = ["blue", "yellow", "orange", "red", "black"];
  let queue = [];
  for (const color of colors) {
    const words = shuffle(wordBank[color]).slice(0, 8); // 색상당 8개 랜덤 추출
    queue.push(...words.map((w) => ({ word: w, color })));
  }
  return shuffle(queue); // 색상 순서 섞어서 스폰 순서로 사용
}
```

## 6. 낙하 애니메이션 (Framer Motion)

```jsx
// 단어 1개 스폰 시
<motion.div
  initial={{ y: 0, opacity: 1 }}
  animate={{ y: SCREEN_HEIGHT, opacity: [1, 1, 0] }}
  transition={{ duration: 4.5, ease: "linear" }}
  onAnimationComplete={() => removeWordIfNotTapped(id)}
  onTap={() => onWordTap(color)}
  style={{ left: randomX() }}
>
  {word}
</motion.div>
```

- `setInterval(spawnNextWord, 1500)` 로 큐에서 순차 스폰
- 화면 밖으로 벗어나면 자동 제거 (탭 안 된 단어는 tally에 영향 없음)

## 7. 실시간 색 블렌딩 (선택 기능, 권장)

탭할 때마다 현재 tally 비율로 배경/캐릭터 색을 가중평균 보간하여 실시간 반영. "물들다" 컨셉과 직접 연결되는 시각 피드백.

```js
function getBlendedColor(tally) {
  const total = Object.values(tally).reduce((a, b) => a + b, 0) || 1;
  return Object.entries(tally).reduce((acc, [color, count]) => {
    const weight = count / total;
    return blendHex(acc, COLORS[color].hex, weight);
  }, "#CCCCCC"); // 초기 중립색
}
```

## 8. 결과 처리

세션 종료 시 `endSession(color)` 호출 → `colorLogic.js`의 캐릭터 상태 갱신 함수로 전달, 이후 3-2(대화) 화면으로 진입 시 해당 색상 톤의 질문 세트 사용.
