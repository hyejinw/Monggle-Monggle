export const WORD_CLOUD_WIDTH = 200;
export const WORD_CLOUD_HEIGHT = 98;

// 낙하하는 단어 칩의 구름 모양. 색상 카테고리를 드러내면 안 되므로 항상 동일한 중립 스타일만 사용한다.
export default function WordCloud({ word }) {
  return (
    <span
      className="relative flex items-center justify-center"
      style={{ width: WORD_CLOUD_WIDTH, height: WORD_CLOUD_HEIGHT }}
    >
      <svg
        viewBox="0 0 150 75"
        width={WORD_CLOUD_WIDTH}
        height={WORD_CLOUD_HEIGHT}
        className="absolute inset-0 drop-shadow-sm"
      >
        <path
          d="M52 68c-17 0-29-12-29-27s12-26 29-26c5-9 15-14 27-14 15 0 27 9 30 21 14 2 24 12 24 24 0 14-12 22-27 22H52Z"
          fill="white"
          stroke="#DDEBFF"
          strokeWidth="3"
        />
      </svg>
      <span className="relative z-10 px-5 text-center text-[19px] font-bold leading-tight text-zinc-700">
        {word}
      </span>
    </span>
  );
}
