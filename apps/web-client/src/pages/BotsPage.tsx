import { useMemo } from "react";

type BotCard = {
  id: string;
  name: string;
  description: string;
  emoji: string;
};

const BotsPage = () => {
  const bots: BotCard[] = useMemo(
    () => [
      { id: "code", name: "코딩 도우미", description: "코드 리뷰와 문제 해결을 도와줘요.", emoji: "💻" },
      { id: "writer", name: "소설가", description: "아이디어를 확장하고 줄거리를 다듬어요.", emoji: "✍️" },
      { id: "diet", name: "영양사", description: "식단 추천과 칼로리 가이드를 제공해요.", emoji: "🥗" },
      { id: "teacher", name: "튜터", description: "개념을 설명하고 연습문제를 준비해요.", emoji: "📚" },
      { id: "product", name: "PM 코치", description: "요구사항 정의와 우선순위 잡기.", emoji: "🧭" },
      { id: "design", name: "디자인 메이트", description: "카피/레이아웃 아이디어 브레인스토밍.", emoji: "🎨" },
    ],
    []
  );

  return (
    <div className="h-full w-full">
      <div className="mx-auto max-w-[1200px] h-full px-4 py-6 md:py-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">봇</h2>
          <button className="h-9 px-3 rounded-md bg-primary text-primary-foreground">봇 추가</button>
        </div>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {bots.map((bot) => (
            <button key={bot.id} className="group text-left rounded-lg border bg-secondary/50 hover:bg-secondary p-4 transition-colors">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 shrink-0 rounded-md bg-background flex items-center justify-center text-xl">
                  {bot.emoji}
                </div>
                <div className="min-w-0">
                  <div className="font-medium truncate">{bot.name}</div>
                  <div className="text-sm text-muted-foreground line-clamp-2 mt-1">{bot.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BotsPage; 