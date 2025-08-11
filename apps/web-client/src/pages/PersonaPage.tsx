import { useMemo, useRef, useState } from "react";
import { Button } from "../components/ui/button";
import { Plus, Save, Trash2, Upload, User2 } from "lucide-react";

export type Persona = {
  id: string;
  name: string;
  role: string; // 짧은 설명
  avatarUrl?: string; // data URL
  systemPrompt?: string; // 말투/행동 가이드
  isDefault?: boolean;
};

const PersonaPage = () => {
  const initial: Persona[] = useMemo(
    () => [
      { id: "default", name: "기본 페르소나", role: "깡통 유저", isDefault: true },
      { id: "junior-dev", name: "Junior Developer", role: "개발 보조" },
      { id: "pm", name: "Project Manager", role: "기획/관리" },
    ],
    []
  );

  const [items, setItems] = useState<Persona[]>(initial);
  const [selectedId, setSelectedId] = useState<string>(initial[0].id);
  const selected = items.find((p) => p.id === selectedId)!;
  const [draft, setDraft] = useState<Persona>(selected);
  const fileRef = useRef<HTMLInputElement>(null);

  function select(id: string) {
    setSelectedId(id);
    const p = items.find((x) => x.id === id)!;
    setDraft({ ...p });
  }

  function create() {
    const id = `persona_${Date.now()}`;
    const p: Persona = { id, name: "새 페르소나", role: "" };
    setItems((prev) => [p, ...prev]);
    select(id);
  }

  function save() {
    setItems((prev) => prev.map((p) => (p.id === draft.id ? draft : p)));
  }

  function remove(id: string) {
    const next = items.filter((p) => p.id !== id || p.isDefault);
    // 기본 페르소나는 삭제 불가
    setItems(next);
    if (!next.find((x) => x.id === selectedId)) {
      const fallback = next[0];
      if (fallback) select(fallback.id);
    }
  }

  function onPickAvatar() {
    fileRef.current?.click();
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setDraft((d) => ({ ...d, avatarUrl: String(reader.result) }));
    reader.readAsDataURL(file);
  }

  return (
    <div className="h-full w-full">
      <div className="mx-auto max-w-[1000px] px-4 py-6 md:py-8 flex flex-col md:flex-row gap-6">
        {/* 목록 */}
        <aside className="md:w-[320px] shrink-0">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold">페르소나</h2>
            <Button size="sm" leftIcon={<Plus size={16} />} onClick={create}>추가</Button>
          </div>
          <div className="rounded-lg border divide-y">
            {items.map((p) => (
              <button key={p.id} onClick={() => select(p.id)} className={`w-full text-left p-3 ${selectedId === p.id ? "bg-secondary" : "hover:bg-secondary/70"}`}>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                    {p.avatarUrl ? (
                      <img src={p.avatarUrl} alt={p.name} className="h-full w-full object-cover" />
                    ) : (
                      <User2 size={16} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-sm truncate">{p.name}{p.isDefault && " (기본)"}</div>
                    {p.role && <div className="text-xs text-muted-foreground truncate">{p.role}</div>}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* 에디터 */}
        <section className="flex-1 min-w-0 grid gap-4">
          <div className="flex items-center gap-3">
            <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
              {draft.avatarUrl ? (
                <img src={draft.avatarUrl} alt={draft.name} className="h-full w-full object-cover" />
              ) : (
                <User2 size={24} />
              )}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <input className="h-10 rounded-md bg-secondary px-3 flex-1" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="이름" />
                <Button size="sm" variant="secondary" leftIcon={<Upload size={14} />} onClick={onPickAvatar}>아바타 업로드</Button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
              </div>
              <input className="h-10 rounded-md bg-secondary px-3" value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value })} placeholder="역할/설명" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">시스템 프롬프트</label>
            <textarea className="w-full min-h-56 rounded-md bg-secondary p-3 resize-y mt-1" value={draft.systemPrompt ?? ""} onChange={(e) => setDraft({ ...draft, systemPrompt: e.target.value })} placeholder="말투/행동 가이드 등" />
          </div>

          <div className="flex items-center gap-2">
            <Button variant="secondary" leftIcon={<Save size={16} />} onClick={save}>저장</Button>
            <Button variant="outline" leftIcon={<Trash2 size={16} />} onClick={() => remove(draft.id)} disabled={draft.isDefault}>삭제</Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PersonaPage; 