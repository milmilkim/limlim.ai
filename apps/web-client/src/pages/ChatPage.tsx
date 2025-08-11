import { Bot, Plus, Search, Clock, MessagesSquare } from "lucide-react";
import { useMemo, useState } from "react";
import ChatSession from "./chat/ChatSession";
import { Button } from "../components/ui/button";

type ChatBot = {
  id: string;
  name: string;
  description: string;
  emoji: string;
};

type RecentChat = {
  id: string;
  title: string;
  botName: string;
  updatedAt: string;
};

const ChatPage = () => {
  const bots: ChatBot[] = useMemo(
    () => [
      {
        id: "code",
        name: "코딩 도우미",
        description: "코드 리뷰와 문제 해결을 도와줘요.",
        emoji: "💻",
      },
      {
        id: "writer",
        name: "소설가",
        description: "아이디어를 확장하고 줄거리를 다듬어요.",
        emoji: "✍️",
      },
      {
        id: "diet",
        name: "영양사",
        description: "식단 추천과 칼로리 가이드를 제공해요.",
        emoji: "🥗",
      },
      {
        id: "teacher",
        name: "튜터",
        description: "개념을 설명하고 연습문제를 준비해요.",
        emoji: "📚",
      },
      {
        id: "product",
        name: "PM 코치",
        description: "요구사항 정의와 우선순위 잡기.",
        emoji: "🧭",
      },
      {
        id: "design",
        name: "디자인 메이트",
        description: "카피/레이아웃 아이디어 브레인스토밍.",
        emoji: "🎨",
      },
    ],
    []
  );

  const recent: RecentChat[] = useMemo(
    () => [
      {
        id: "r1",
        title: "UI 아이디어 스케치",
        botName: "디자인 메이트",
        updatedAt: "오늘",
      },
      {
        id: "r2",
        title: "타입스크립트 유틸 함수를 리팩터",
        botName: "코딩 도우미",
        updatedAt: "어제",
      },
      {
        id: "r3",
        title: "저녁 식단 추천",
        botName: "영양사",
        updatedAt: "2일 전",
      },
    ],
    []
  );

  // 봇별 세션 데이터 (샘플)
  const sessionsByBot = useMemo(() => ({
    code: [
      { id: "c1", title: "유틸 함수 리팩터", botName: "코딩 도우미", updatedAt: "어제" },
      { id: "c2", title: "테스트코드 작성 가이드", botName: "코딩 도우미", updatedAt: "3일 전" },
    ],
    writer: [
      { id: "w1", title: "SF 단편 플롯", botName: "소설가", updatedAt: "1주 전" },
    ],
    diet: [
      { id: "d1", title: "지방 감량 식단", botName: "영양사", updatedAt: "오늘" },
    ],
    teacher: [],
    product: [],
    design: [
      { id: "ds1", title: "Landing 카피 브레인스토밍", botName: "디자인 메이트", updatedAt: "오늘" },
    ],
  } as Record<string, RecentChat[]>), []);

  const [session, setSession] = useState<null | { botName: string }>(null);
  const [selectedBot, setSelectedBot] = useState<string>("all");

  const visibleSessions: RecentChat[] = useMemo(() => {
    if (selectedBot === "all") return recent;
    return sessionsByBot[selectedBot] ?? [];
  }, [recent, sessionsByBot, selectedBot]);

  const selectedBotName = useMemo(() => {
    if (selectedBot === "all") return "모든 봇";
    return bots.find((b) => b.id === selectedBot)?.name ?? "";
  }, [selectedBot, bots]);

  if (session) {
    return (
      <ChatSession
        info={{ roomTitle: `${session.botName}와의 새 대화`, botName: session.botName, personaName: "기본 페르소나" }}
      />
    );
  }

  return (
    <div className="h-full w-full">
      <div className="mx-auto max-w-[1200px] h-full px-4 py-6 md:py-8">
        {/* 액션 바 */}
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-2">
          <div className="flex items-center gap-2">
            <Button onClick={() => setSession({ botName: "코딩 도우미" })} leftIcon={<Plus size={18} />}>
              새 채팅
            </Button>
            <select
              value={selectedBot}
              onChange={(e) => setSelectedBot(e.target.value)}
              className="h-10 rounded-md bg-secondary px-2 text-sm"
            >
              <option value="all">모든 봇</option>
              {bots.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
          <div className="relative md:ml-auto w-full md:w-[360px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="세션 검색"
              className="w-full h-10 pl-9 pr-3 rounded-md bg-secondary text-foreground placeholder:opacity-70 outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* 세션 리스트 */}
        <div className="mt-6">
          {selectedBot === "all" ? (
            <div className="space-y-6">
              {bots.map((b) => {
                const list = sessionsByBot[b.id] ?? [];
                if (list.length === 0) return null;
                return (
                  <section key={b.id}>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-2">{b.name}</h4>
                    <div className="rounded-lg border divide-y">
                      {list.map((c) => (
                        <button
                          key={c.id}
                          className="w-full text-left p-3 hover:bg-secondary/70 transition-colors"
                          onClick={() => setSession({ botName: c.botName })}
                        >
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-md bg-background flex items-center justify-center">
                              <Bot size={16} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="truncate font-medium text-sm">{c.title}</div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                <span className="truncate">{c.botName}</span>
                                <span className="opacity-50">•</span>
                                <span className="inline-flex items-center gap-1">
                                  <Clock size={12} />
                                  {c.updatedAt}
                                </span>
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </section>
                );
              })}
              {/* 최근(모든 봇) 섹션: 필요 시 유지 */}
              {recent.length > 0 && (
                <section>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-2">최근</h4>
                  <div className="rounded-lg border divide-y">
                    {recent.map((c) => (
                      <button
                        key={c.id}
                        className="w-full text-left p-3 hover:bg-secondary/70 transition-colors"
                        onClick={() => setSession({ botName: c.botName })}
                      >
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-md bg-background flex items-center justify-center">
                            <Bot size={16} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="truncate font-medium text-sm">{c.title}</div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                              <span className="truncate">{c.botName}</span>
                              <span className="opacity-50">•</span>
                              <span className="inline-flex items-center gap-1">
                                <Clock size={12} />
                                {c.updatedAt}
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              )}
            </div>
          ) : (
            <div className="rounded-lg border divide-y">
              {visibleSessions.length === 0 && (
                <div className="p-4 text-sm text-muted-foreground">세션이 없습니다.</div>
              )}
              {visibleSessions.map((c) => (
                <button
                  key={c.id}
                  className="w-full text-left p-3 hover:bg-secondary/70 transition-colors"
                  onClick={() => setSession({ botName: c.botName })}
                >
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-md bg-background flex items-center justify-center">
                      <Bot size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium text-sm">{c.title}</div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <span className="truncate">{c.botName}</span>
                        <span className="opacity-50">•</span>
                        <span className="inline-flex items-center gap-1">
                          <Clock size={12} />
                          {c.updatedAt}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
