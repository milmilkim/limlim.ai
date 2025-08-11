import { useMemo, useState } from "react";
import { Button } from "../components/ui/button";
import { GripVertical, Plus, Trash2, Save } from "lucide-react";

type PromptPreset = {
  id: string;
  name: string;
  description?: string;
  prompt: string;
  persona: string;
  botDescription: string;
  options: {
    stream: boolean;
    toolsEnabled: boolean;
    temperature?: number;
  };
};

type SectionKind = "prompt" | "persona" | "botDescription" | "options";

type Section = { id: string; kind: SectionKind };

const PromptsPage = () => {
  const initialPresets: PromptPreset[] = useMemo(
    () => [
      {
        id: "default",
        name: "기본 프리셋",
        description: "가벼운 작업용",
        prompt: "당신은 도움이 되는 어시스턴트입니다.",
        persona: "기본 페르소나",
        botDescription: "친절하고 간결하게 답변합니다.",
        options: { stream: true, toolsEnabled: false, temperature: 0.7 },
      },
      {
        id: "coder",
        name: "코딩 도우미",
        description: "개발자 보조",
        prompt: "코드 예시와 함께 설명하세요. 타입 안전성을 우선합니다.",
        persona: "Junior Developer",
        botDescription: "TypeScript 선호. 간결한 예제 제공.",
        options: { stream: true, toolsEnabled: true, temperature: 0.4 },
      },
    ],
    []
  );

  const [presets, setPresets] = useState<PromptPreset[]>(initialPresets);
  const [selectedId, setSelectedId] = useState<string>(initialPresets[0].id);

  const selected = presets.find((p) => p.id === selectedId)!;
  const [draft, setDraft] = useState<PromptPreset>(selected);
  const [sections, setSections] = useState<Section[]>([
    { id: "sec_prompt", kind: "prompt" },
    { id: "sec_persona", kind: "persona" },
    { id: "sec_botdesc", kind: "botDescription" },
    { id: "sec_options", kind: "options" },
  ]);
  const [addKind, setAddKind] = useState<SectionKind>("prompt");

  function hasSection(kind: SectionKind) {
    return sections.some((s) => s.kind === kind);
  }

  // 선택 변경 시 draft/sections 동기화
  function selectPreset(id: string) {
    setSelectedId(id);
    const p = presets.find((x) => x.id === id)!;
    setDraft({ ...p, options: { ...p.options } });
    // 섹션은 기본 순서를 유지 (없으면 추가)
    const base: Section[] = [];
    ([("prompt" as const), ("persona" as const), ("botDescription" as const), ("options" as const)]).forEach(
      (k, idx) => {
        if (!sections.find((s) => s.kind === k)) base.push({ id: `sec_${k}_${idx}`, kind: k });
      }
    );
    if (base.length) setSections((prev) => [...prev, ...base]);
  }

  function createPreset() {
    const id = `preset_${Date.now()}`;
    const p: PromptPreset = {
      id,
      name: "새 프리셋",
      description: "",
      prompt: "",
      persona: "",
      botDescription: "",
      options: { stream: true, toolsEnabled: false, temperature: 0.7 },
    };
    setPresets((prev) => [p, ...prev]);
    setSections([
      { id: "sec_prompt", kind: "prompt" },
      { id: "sec_persona", kind: "persona" },
      { id: "sec_botdesc", kind: "botDescription" },
      { id: "sec_options", kind: "options" },
    ]);
    selectPreset(id);
  }

  function savePreset() {
    setPresets((prev) => prev.map((p) => (p.id === draft.id ? draft : p)));
  }

  function deletePreset(id: string) {
    const next = presets.filter((p) => p.id !== id);
    setPresets(next);
    if (next.length > 0) selectPreset(next[0].id);
  }

  function addSection(kind: SectionKind) {
    if (hasSection(kind)) return; // 중복 방지
    setSections((prev) => [...prev, { id: `sec_${kind}_${Date.now()}`, kind }]);
  }

  function removeSection(id: string, kind: SectionKind) {
    setSections((prev) => prev.filter((s) => s.id !== id));
    // 내용 초기화(숨김과 동일 효과)
    if (kind === "prompt") setDraft((d) => ({ ...d, prompt: "" }));
    if (kind === "persona") setDraft((d) => ({ ...d, persona: "" }));
    if (kind === "botDescription") setDraft((d) => ({ ...d, botDescription: "" }));
    // options 삭제 시 표시만 제거 (값 유지 가능)
  }

  const sectionTitle: Record<SectionKind, string> = {
    prompt: "일반 프롬프트",
    persona: "페르소나",
    botDescription: "봇 디스크립션",
    options: "옵션",
  };

  return (
    <div className="h-full w-full">
      <div className="mx-auto max-w-[1200px] px-4 py-6 md:py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Preset list */}
          <aside className="md:w-[320px] shrink-0">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold">프리셋</h2>
              <Button size="sm" leftIcon={<Plus size={16} />} onClick={createPreset}>
                추가
              </Button>
            </div>
            <div className="rounded-lg border divide-y">
              {presets.map((p) => (
                <button
                  key={p.id}
                  className={`w-full text-left p-3 transition-colors ${selectedId === p.id ? "bg-secondary" : "hover:bg-secondary/70"}`}
                  onClick={() => selectPreset(p.id)}
                >
                  <div className="font-medium text-sm truncate">{p.name}</div>
                  {p.description && (
                    <div className="text-xs text-muted-foreground truncate mt-0.5">{p.description}</div>
                  )}
                </button>
              ))}
            </div>
          </aside>

          {/* Editor */}
          <section className="flex-1 min-w-0 grid gap-4">
            <div className="flex items-center gap-2">
              <input
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                placeholder="프리셋 이름"
                className="h-10 rounded-md bg-secondary px-3 flex-1"
              />
              <Button variant="secondary" size="sm" leftIcon={<Save size={16} />} onClick={savePreset}>
                저장
              </Button>
              <Button variant="outline" size="sm" leftIcon={<Trash2 size={16} />} onClick={() => deletePreset(draft.id)}>
                삭제
              </Button>
            </div>
            <input
              value={draft.description || ""}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              placeholder="설명 (선택)"
              className="h-10 rounded-md bg-secondary px-3"
            />

            {/* 섹션 추가 */}
            <div className="flex items-center gap-2">
              <select
                value={addKind}
                onChange={(e) => setAddKind(e.target.value as SectionKind)}
                className="h-10 rounded-md bg-secondary px-3"
              >
                <option value="prompt">일반 프롬프트</option>
                <option value="persona">페르소나</option>
                <option value="botDescription">봇 디스크립션</option>
                <option value="options">옵션</option>
              </select>
              <Button size="sm" onClick={() => addSection(addKind)} leftIcon={<Plus size={16} />}>섹션 추가</Button>
            </div>

            {/* Sections (dynamic) */}
            {sections.map((s) => (
              <div key={s.id} className="rounded-xl border bg-secondary/30">
                <div className="p-3 border-b flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <GripVertical className="opacity-70" size={16} />
                    <h3 className="text-sm font-semibold">{sectionTitle[s.kind]}</h3>
                  </div>
                  <Button size="sm" variant="outline" leftIcon={<Trash2 size={14} />} onClick={() => removeSection(s.id, s.kind)}>
                    섹션 삭제
                  </Button>
                </div>
                <div className="p-3">
                  {s.kind === "prompt" && (
                    <textarea
                      value={draft.prompt}
                      onChange={(e) => setDraft({ ...draft, prompt: e.target.value })}
                      placeholder="시스템/작업 지시 등 일반 프롬프트"
                      className="w-full min-h-28 rounded-md bg-secondary p-3 resize-y"
                    />
                  )}
                  {s.kind === "persona" && (
                    <textarea
                      value={draft.persona}
                      onChange={(e) => setDraft({ ...draft, persona: e.target.value })}
                      placeholder="말투/전문성/행동 가이드 등"
                      className="w-full min-h-24 rounded-md bg-secondary p-3 resize-y"
                    />
                  )}
                  {s.kind === "botDescription" && (
                    <textarea
                      value={draft.botDescription}
                      onChange={(e) => setDraft({ ...draft, botDescription: e.target.value })}
                      placeholder="봇 소개/사용법/제약사항"
                      className="w-full min-h-24 rounded-md bg-secondary p-3 resize-y"
                    />
                  )}
                
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
};

export default PromptsPage; 