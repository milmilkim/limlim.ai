import { useMemo, useState } from "react";
import { Button } from "../components/ui/button";
import { Plus, Save, Trash2, GripVertical, Bot, MessagesSquare, Folder, FileText, ChevronRight, ChevronDown, ArrowLeft } from "lucide-react";
import { useIsMobile } from "../hooks/useIsMobile";

type LoreType = "character" | "world" | "misc";

type LoreEntry = {
  id: string;
  title: string;
  type: LoreType;
  tags: string[];
  content: string;
};

type LoreSet = {
  id: string;
  name: string;
  description?: string;
  entries: LoreEntry[];
  collapsed?: boolean;
};

type Row =
  | { kind: "set"; id: string; name: string; description?: string; count: number; collapsed?: boolean }
  | { kind: "entry"; id: string; parentId: string; title: string; type: LoreType; tags: string[] };

const LorebookPage = () => {
  const initial: LoreSet[] = useMemo(
    () => [
      {
        id: "set_world",
        name: "세계관: 네오시티",
        description: "사이버펑크 도시 배경",
        collapsed: false,
        entries: [
          {
            id: "e1",
            title: "아르카디아 타워",
            type: "world",
            tags: ["건물", "요충지"],
            content: "네오시티 중심의 메가타워. 상위층은 거대 기업 본사들로 구성되어 있다.",
          },
          {
            id: "e2",
            title: "레드라인 구역",
            type: "world",
            tags: ["치안불량"],
            content: "무법지대. 갱단의 활동이 활발하다.",
          },
        ],
      },
      {
        id: "set_chars",
        name: "캐릭터: 핵심 인물",
        description: "주요 등장인물",
        collapsed: false,
        entries: [
          {
            id: "e3",
            title: "라이라",
            type: "character",
            tags: ["해커", "주인공"],
            content: "전설적인 넷러너. 침착하고 관찰력이 뛰어나다.",
          },
        ],
      },
    ],
    []
  );

  const [sets, setSets] = useState<LoreSet[]>(initial);
  const isMobile = useIsMobile();

  // 편집 대상(세트 또는 엔트리)
  const [selected, setSelected] = useState<{ kind: "set" | "entry"; setId: string; entryId?: string } | null>(
    sets[0] ? { kind: "entry", setId: sets[0].id, entryId: sets[0].entries[0]?.id } : null
  );

  const selectedSet = selected ? sets.find((s) => s.id === selected.setId) ?? null : null;
  const selectedEntry = selected?.kind === "entry" && selectedSet ? selectedSet.entries.find((e) => e.id === selected.entryId) ?? null : null;

  function flatten(): Row[] {
    const rows: Row[] = [];
    for (const s of sets) {
      rows.push({ kind: "set", id: s.id, name: s.name, description: s.description, count: s.entries.length, collapsed: s.collapsed });
      if (!s.collapsed) {
        for (const e of s.entries) {
          rows.push({ kind: "entry", id: e.id, parentId: s.id, title: e.title, type: e.type, tags: e.tags });
        }
      }
    }
    return rows;
  }

  function toggleCollapse(setId: string) {
    setSets((prev) => prev.map((s) => (s.id === setId ? { ...s, collapsed: !s.collapsed } : s)));
  }

  function addSet() {
    const id = `set_${Date.now()}`;
    const next: LoreSet = { id, name: "새 로어북 세트", description: "", entries: [], collapsed: false };
    setSets((prev) => [next, ...prev]);
    setSelected({ kind: "set", setId: id });
  }

  function removeSet(id: string) {
    setSets((prev) => prev.filter((s) => s.id !== id));
    setSelected(null);
  }

  function updateSet(setId: string, patch: Partial<LoreSet>) {
    setSets((prev) => prev.map((s) => (s.id === setId ? { ...s, ...patch } : s)));
  }

  function addEntry(parentId: string) {
    const id = `entry_${Date.now()}`;
    const entry: LoreEntry = { id, title: "새 조각", type: "misc", tags: [], content: "" };
    setSets((prev) => prev.map((s) => (s.id === parentId ? { ...s, entries: [entry, ...s.entries] } : s)));
    setSelected({ kind: "entry", setId: parentId, entryId: id });
  }

  function removeEntry(parentId: string, id: string) {
    setSets((prev) => prev.map((s) => (s.id === parentId ? { ...s, entries: s.entries.filter((e) => e.id !== id) } : s)));
    setSelected({ kind: "set", setId: parentId });
  }

  function updateEntry(parentId: string, entryId: string, patch: Partial<LoreEntry>) {
    setSets((prev) =>
      prev.map((s) =>
        s.id !== parentId
          ? s
          : { ...s, entries: s.entries.map((e) => (e.id === entryId ? { ...e, ...patch } : e)) }
      )
    );
  }

  const rows = flatten();

  // 모바일 전환: 목록 ↔ 편집
  const [mobileView, setMobileView] = useState<"list" | "editor">("list");
  const goEdit = (sel: { kind: "set" | "entry"; setId: string; entryId?: string }) => {
    setSelected(sel);
    if (isMobile) setMobileView("editor");
  };

  const goList = () => setMobileView("list");

  return (
    <div className="h-full w-full">
      <div className="mx-auto max-w-[1200px] px-4 py-6 md:py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* List */}
          <section className={isMobile ? (mobileView === "list" ? "block" : "hidden") : "md:w-[420px] shrink-0"}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold">로어북</h2>
              <div className="flex items-center gap-2">
                <Button size="sm" leftIcon={<Plus size={16} />} onClick={addSet}>세트</Button>
                {selected?.kind === "set" && (
                  <Button size="sm" variant="secondary" leftIcon={<Plus size={16} />} onClick={() => addEntry(selected.setId)}>
                    조각
                  </Button>
                )}
              </div>
            </div>
            <div className="rounded-lg border divide-y">
              {rows.map((r) => (
                <div key={(r.kind === "set" ? `set:${r.id}` : `e:${r.id}`)} className="p-2">
                  {r.kind === "set" ? (
                    <div className="flex items-center gap-2">
                      <button className="h-7 w-7 rounded-md hover:bg-secondary flex items-center justify-center" onClick={() => toggleCollapse(r.id)}>
                        {r.collapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
                      </button>
                      <Folder size={16} className="opacity-80" />
                      <button className="flex-1 text-left" onClick={() => goEdit({ kind: "set", setId: r.id })}>
                        <div className="font-medium text-sm truncate">{r.name}</div>
                        {r.description && <div className="text-xs text-muted-foreground truncate">{r.description}</div>}
                      </button>
                      <span className="text-xs opacity-70 mr-1">{r.count}</span>
                      <Button size="sm" variant="outline" leftIcon={<Trash2 size={14} />} onClick={() => removeSet(r.id)}>삭제</Button>
                    </div>
                  ) : (
                    <div className="pl-9 flex items-center gap-2">
                      <GripVertical size={14} className="opacity-60" />
                      <FileText size={16} className="opacity-80" />
                      <button className="flex-1 text-left" onClick={() => goEdit({ kind: "entry", setId: r.parentId, entryId: r.id })}>
                        <div className="font-medium text-sm truncate">{r.title}</div>
                        <div className="text-xs text-muted-foreground truncate">{r.type} · {r.tags.join(", ")}</div>
                      </button>
                      <Button size="sm" variant="outline" leftIcon={<Trash2 size={14} />} onClick={() => removeEntry(r.parentId, r.id)}>삭제</Button>
                    </div>
                  )}
                </div>
              ))}
              {rows.length === 0 && <div className="p-4 text-sm text-muted-foreground">로어가 없습니다.</div>}
            </div>
          </section>

          {/* Editor */}
          <section className={isMobile ? (mobileView === "editor" ? "block" : "hidden") : "flex-1 min-w-0"}>
            {isMobile && (
              <div className="mb-3">
                <Button variant="outline" size="sm" leftIcon={<ArrowLeft size={14} />} onClick={goList}>목록으로</Button>
              </div>
            )}
            {!selected && <div className="h-full grid place-items-center text-sm text-muted-foreground">항목을 선택하거나 추가하세요.</div>}
            {selected && selected.kind === "set" && selectedSet && (
              <div className="grid gap-3">
                <div className="flex items-center gap-2">
                  <input className="h-10 rounded-md bg-secondary px-3 flex-1" value={selectedSet.name} onChange={(e) => updateSet(selectedSet.id, { name: e.target.value })} placeholder="세트명" />
                </div>
                <textarea className="w-full min-h-40 rounded-md bg-secondary p-3 resize-y" value={selectedSet.description ?? ""} onChange={(e) => updateSet(selectedSet.id, { description: e.target.value })} placeholder="세트 설명" />
                <div className="flex items-center gap-2">
                  <Button variant="secondary" leftIcon={<Save size={16} />}>저장</Button>
                  <Button variant="outline" leftIcon={<Trash2 size={16} />} onClick={() => removeSet(selectedSet.id)}>삭제</Button>
                </div>
              </div>
            )}
            {selected && selected.kind === "entry" && selectedEntry && (
              <div className="grid gap-3">
                <div className="flex items-center gap-2">
                  <input className="h-10 rounded-md bg-secondary px-3 flex-1" value={selectedEntry.title} onChange={(e) => updateEntry(selected.setId, selectedEntry.id, { title: e.target.value })} placeholder="제목" />
                  <select className="h-10 rounded-md bg-secondary px-3" value={selectedEntry.type} onChange={(e) => updateEntry(selected.setId, selectedEntry.id, { type: e.target.value as LoreType })}>
                    <option value="character">캐릭터</option>
                    <option value="world">세계관</option>
                    <option value="misc">기타</option>
                  </select>
                </div>
                <input className="h-10 rounded-md bg-secondary px-3" value={selectedEntry.tags.join(", ")} onChange={(e) => updateEntry(selected.setId, selectedEntry.id, { tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })} placeholder="태그 (쉼표로 구분)" />
                <textarea className="w-full min-h-56 rounded-md bg-secondary p-3 resize-y" value={selectedEntry.content} onChange={(e) => updateEntry(selected.setId, selectedEntry.id, { content: e.target.value })} placeholder="로어 상세 내용" />
                <div className="flex items-center gap-2">
                  <Button variant="secondary" leftIcon={<Save size={16} />}>저장</Button>
                  <Button variant="outline" leftIcon={<Trash2 size={16} />} onClick={() => removeEntry(selected.setId, selectedEntry.id)}>삭제</Button>
                  <div className="ml-auto flex items-center gap-2">
                    <Button variant="outline" size="sm" leftIcon={<Bot size={14} />}>봇에 임포트</Button>
                    <Button variant="outline" size="sm" leftIcon={<MessagesSquare size={14} />}>세션에 임포트</Button>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default LorebookPage; 