import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bot as BotIcon,
  Dice6,
  Pencil,
  Trash2,
  Send,
  X,
  User,
  Settings,
} from "lucide-react";
import Sheet from "../../components/ui/sheet";

export type ChatSessionInfo = {
  roomTitle: string;
  botName: string;
  personaName: string;
};

type Message = {
  id: string;
  role: "user" | "bot";
  name: string;
  avatar: string; // emoji or initial
  content: string;
  createdAt: string;
};

const useAutoResize = (
  ref: React.RefObject<HTMLTextAreaElement | null>,
  value: string
) => {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 240) + "px"; // max 240px
  }, [ref, value]);
};

const OptionToggle = ({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) => {
  return (
    <div className="inline-flex rounded-lg border bg-secondary p-1">
      {options.map((opt) => (
        <button
          key={opt}
          className={`px-3 h-8 rounded-md text-sm transition-colors ${
            value === opt ? "bg-background" : "hover:bg-background/50"
          }`}
          onClick={() => onChange(opt)}
          type="button"
        >
          {opt}
        </button>
      ))}
    </div>
  );
};

const ChatSession = ({ info }: { info: ChatSessionInfo }) => {
  const [sending, setSending] = useState(false);
  const [mode, setMode] = useState("일반");
  const [model, setModel] = useState("gpt-4o");
  const [template, setTemplate] = useState("default");
  const [persona, setPersona] = useState("기본 페르소나");
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useAutoResize(textareaRef, input);

  const [openSettings, setOpenSettings] = useState(false);

  const messages: Message[] = useMemo(
    () => [
      {
        id: "m1",
        role: "bot",
        name: info.botName,
        avatar: "🤖",
        content: "안녕하세요! 무엇을 도와드릴까요?",
        createdAt: "오전 10:01",
      },
      {
        id: "m2",
        role: "user",
        name: "나",
        avatar: "🙂",
        content: "오늘 저녁 식단 추천해줘.",
        createdAt: "오전 10:02",
      },
      {
        id: "m3",
        role: "bot",
        name: info.botName,
        avatar: "🤖",
        content: "영양 균형을 고려해 3가지 옵션을 추천드릴게요...",
        createdAt: "오전 10:02",
      },
    ],
    [info.botName]
  );

  return (
    <div className="h-full flex flex-col min-h-0">
      {/* Header */}
      <div className="border-b px-3 md:px-4 h-12 shrink-0 flex items-center justify-between bg-background/60">
        <div className="min-w-0">
          <div className="font-medium truncate">{info.roomTitle}</div>
          <div className="text-xs text-muted-foreground truncate">
            {info.botName} • {info.personaName}
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="h-8 rounded-md bg-secondary px-2 text-sm"
          >
            <option value="gpt-4o">GPT‑4o</option>
            <option value="gpt-4.1-mini">GPT‑4.1 mini</option>
            <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
          </select>
          <select
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            className="h-8 rounded-md bg-secondary px-2 text-sm"
          >
            <option value="default">기본 템플릿</option>
            <option value="code-helper">코딩 도우미</option>
            <option value="writer">크리에이티브 라이터</option>
          </select>
          <select
            value={persona}
            onChange={(e) => setPersona(e.target.value)}
            className="h-8 rounded-md bg-secondary px-2 text-sm"
          >
            <optgroup label="기본 페르소나">
              <option value="기본 페르소나">기본 페르소나</option>
            </optgroup>
            <optgroup label="빌트인 페르소나">
              <option value="Junior Developer">Junior Developer</option>
              <option value="Project Manager">Project Manager</option>
              <option value="Creative Writer">Creative Writer</option>
            </optgroup>
          </select>
          <button
            className="h-8 px-2 rounded-md bg-secondary text-sm"
            onClick={() => setOpenSettings(true)}
          >
            <Settings size={16} /> 세션 설정
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-auto p-3 md:p-4 space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3 ${
              m.role === "user" ? "flex-row-reverse text-right" : ""
            }`}
          >
            {/* Avatar */}
            <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-base shrink-0">
              {m.avatar}
            </div>
            {/* Bubble */}
            <div
              className={`max-w-[75%] md:max-w-[65%] ${
                m.role === "user" ? "items-end" : ""
              }`}
            >
              <div className="text-xs text-muted-foreground mb-1">
                {m.name} · {m.createdAt}
              </div>
              <div
                className={`rounded-lg p-3 leading-relaxed ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary"
                }`}
              >
                {m.content}
              </div>
            </div>
            {/* Actions */}
            <div className="self-center opacity-0 hover:opacity-100 transition-opacity flex items-center gap-1">
              {m.role === "bot" && (
                <button
                  className="h-8 w-8 rounded-md hover:bg-muted flex items-center justify-center"
                  title="리롤"
                >
                  <Dice6 size={16} />
                </button>
              )}
              <button
                className="h-8 w-8 rounded-md hover:bg-muted flex items-center justify-center"
                title="수정"
              >
                <Pencil size={16} />
              </button>
              <button
                className="h-8 w-8 rounded-md hover:bg-muted flex items-center justify-center"
                title="삭제"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t p-3 md:p-4 bg-background/60 sticky bottom-0 left-0 z-10 pb-[env(safe-area-inset-bottom)]">
        <div className="mb-2 flex items-center gap-2 md:hidden">
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="h-9 rounded-md bg-secondary px-2 text-sm flex-1"
          >
            <option value="gpt-4o">GPT‑4o</option>
            <option value="gpt-4.1-mini">GPT‑4.1 mini</option>
            <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
          </select>
          <select
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            className="h-9 rounded-md bg-secondary px-2 text-sm flex-1"
          >
            <option value="default">기본 템플릿</option>
            <option value="code-helper">코딩 도우미</option>
            <option value="writer">크리에이티브 라이터</option>
          </select>
          <select
            value={persona}
            onChange={(e) => setPersona(e.target.value)}
            className="h-9 rounded-md bg-secondary px-2 text-sm flex-1"
          >
            <optgroup label="기본 페르소나">
              <option value="기본 페르소나">기본 페르소나</option>
            </optgroup>
            <optgroup label="빌트인 페르소나">
              <option value="Junior Developer">Junior Developer</option>
              <option value="Project Manager">Project Manager</option>
              <option value="Creative Writer">Creative Writer</option>
            </optgroup>
          </select>
        </div>

        <div className="mb-2 flex items-center gap-2">
          <OptionToggle
            options={["일반", "요약", "번역"]}
            value={mode}
            onChange={setMode}
          />
        </div>

        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="메시지를 입력하세요..."
            className="flex-1 resize-none rounded-md bg-secondary p-3 outline-none focus:ring-2 focus:ring-ring min-h-10 max-h-60"
          />
          {!sending ? (
            <button
              onClick={() => setSending(true)}
              className="h-10 px-3 rounded-md bg-primary text-primary-foreground inline-flex items-center gap-2"
            >
              <Send size={16} /> 전송
            </button>
          ) : (
            <button
              onClick={() => setSending(false)}
              className="h-10 px-3 rounded-md bg-destructive/90 text-white inline-flex items-center gap-2"
            >
              <X size={16} /> 취소
            </button>
          )}
        </div>
      </div>

      <Sheet
        open={openSettings}
        onClose={() => setOpenSettings(false)}
        title="세션 설정"
      >
        <div className="grid gap-4">
          <div>
            <h4 className="text-sm font-semibold mb-2">임포트</h4>
            <div className="grid gap-2">
              <label className="grid gap-1 text-sm">
                <span>설정</span>
              </label>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-2">런타임 옵션</h4>
            <div className="grid md:grid-cols-2 gap-3">
              <label className="grid gap-1 text-sm">
                <span>모델</span>
                <select
                  className="h-9 rounded-md bg-secondary px-2"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                >
                  <option value="gpt-4o">GPT‑4o</option>
                  <option value="gpt-4.1-mini">GPT‑4.1 mini</option>
                  <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
                </select>
              </label>
              <label className="grid gap-1 text-sm">
                <span>프롬프트 템플릿</span>
                <select
                  className="h-9 rounded-md bg-secondary px-2"
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                >
                  <option value="default">기본 템플릿</option>
                  <option value="code-helper">코딩 도우미</option>
                  <option value="writer">크리에이티브 라이터</option>
                </select>
              </label>
            </div>
          </div>
        </div>
      </Sheet>
    </div>
  );
};

export default ChatSession;
