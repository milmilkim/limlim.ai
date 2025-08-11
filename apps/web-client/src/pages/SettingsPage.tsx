import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Save } from "lucide-react";
import { getGlobalSettings, upsertGlobalSettings } from "../storage/repositories/globals";

type ContextTrim = 'auto' | 'head' | 'tail';

const Card = ({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) => (
  <section className="rounded-xl border bg-secondary/30">
    <div className="p-4 border-b">
      <h2 className="text-lg font-semibold">{title}</h2>
      {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
    </div>
    <div className="p-4 grid gap-4">{children}</div>
  </section>
);

const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
  <label className="grid gap-2">
    <div className="text-sm font-medium text-foreground/90">{label}</div>
    {children}
    {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
  </label>
);

const SettingsPage = () => {
  // Model Settings
  const [mainModel, setMainModel] = useState("gpt-4o");
  const [assistantModel, setAssistantModel] = useState("none");

  // Token Limits
  const [maxContext, setMaxContext] = useState(128000);
  const [maxInput, setMaxInput] = useState(32000);
  const [maxOutput, setMaxOutput] = useState(4096);
  const [contextTrim, setContextTrim] = useState<ContextTrim>("auto");

  // Generation Params
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(0.9);
  const [freqPenalty, setFreqPenalty] = useState(0);
  const [presencePenalty, setPresencePenalty] = useState(0);

  // API Keys
  const [openaiApiKey, setOpenaiApiKey] = useState("");
  const [openaiBaseUrl, setOpenaiBaseUrl] = useState("");
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [testMsg, setTestMsg] = useState<string>("");

  const [isSaving, setIsSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const g = await getGlobalSettings();
      if (g) {
        setMainModel(g.model ?? "gpt-4o");
        setAssistantModel(g.assistantModel ?? "none");
        setMaxContext(g.maxContext ?? 128000);
        setMaxInput(g.maxInput ?? 32000);
        setMaxOutput(g.maxOutput ?? 4096);
        setContextTrim((g.contextTrim as ContextTrim) ?? "auto");
        setTemperature(g.temperature ?? 0.7);
        setTopP(g.topP ?? 0.9);
        setFreqPenalty(g.freqPenalty ?? 0);
        setPresencePenalty(g.presencePenalty ?? 0);
        setOpenaiApiKey(g.openaiApiKey ?? "");
        setOpenaiBaseUrl(g.openaiBaseUrl ?? "");
        setGeminiApiKey(g.geminiApiKey ?? "");
      } else {
        await upsertGlobalSettings({
          model: mainModel,
          assistantModel,
          maxContext,
          maxInput,
          maxOutput,
          contextTrim,
          temperature,
          topP,
          freqPenalty,
          presencePenalty,
          openaiApiKey,
          openaiBaseUrl,
          geminiApiKey,
        });
      }
      setLoaded(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function saveAll() {
    setIsSaving(true);
    try {
      await upsertGlobalSettings({
        model: mainModel,
        assistantModel,
        maxContext,
        maxInput,
        maxOutput,
        contextTrim,
        temperature,
        topP,
        freqPenalty,
        presencePenalty,
        openaiApiKey,
        openaiBaseUrl,
        geminiApiKey,
      });
      setTestMsg("저장 완료");
    } finally {
      setIsSaving(false);
    }
  }

  async function testConnection(provider: 'openai' | 'gemini') {
    const hasKey = provider === 'openai' ? !!openaiApiKey : !!geminiApiKey;
    if (!hasKey) { setTestMsg(`${provider} API 키가 없습니다.`); return; }
    // 실제 호출은 추후 연결. 지금은 키 존재 여부만 확인.
    setTestMsg(`${provider} 설정이 유효해 보입니다.`);
  }

  return (
    <div className="h-full w-full">
      <div className="mx-auto max-w-[1000px] px-4 py-6 md:py-8 grid gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">설정</h1>
          <Button onClick={saveAll} isLoading={isSaving} leftIcon={<Save size={16} />}>저장</Button>
        </div>

        <Card title="API Keys">
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="OpenAI API Key" hint="sk-로 시작 (프록시 사용 시 Base URL도 지정)">
              <input value={openaiApiKey} onChange={(e)=>setOpenaiApiKey(e.target.value)} type="password" className="h-10 rounded-md bg-secondary px-3" placeholder="sk-..." />
            </Field>
            <Field label="OpenAI Base URL" hint="선택 사항">
              <input value={openaiBaseUrl} onChange={(e)=>setOpenaiBaseUrl(e.target.value)} className="h-10 rounded-md bg-secondary px-3" placeholder="https://api.openai.com/v1" />
            </Field>
            <Field label="Gemini API Key">
              <input value={geminiApiKey} onChange={(e)=>setGeminiApiKey(e.target.value)} type="password" className="h-10 rounded-md bg-secondary px-3" placeholder="AIza..." />
            </Field>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={()=>testConnection('openai')}>OpenAI 연결 테스트</Button>
            <Button variant="outline" onClick={()=>testConnection('gemini')}>Gemini 연결 테스트</Button>
            {testMsg && <span className="text-sm text-muted-foreground">{testMsg}</span>}
          </div>
        </Card>

        <Card title="Model Settings">
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Default Main Model">
              <select
                value={mainModel}
                onChange={(e) => setMainModel(e.target.value)}
                className="h-10 rounded-md bg-secondary px-3"
              >
                <option value="gpt-4o">GPT‑4o</option>
                <option value="gpt-4.1-mini">GPT‑4.1 mini</option>
                <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
                <option value="none">None</option>
              </select>
            </Field>
            <Field label="Assistant Model" hint="Used for lighter tasks like summarization">
              <select
                value={assistantModel}
                onChange={(e) => setAssistantModel(e.target.value)}
                className="h-10 rounded-md bg-secondary px-3"
              >
                <option value="none">None</option>
                <option value="gpt-4.1-mini">GPT‑4.1 mini</option>
                <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
              </select>
            </Field>
          </div>
        </Card>

        <Card title="Token Limits">
          <div className="grid md:grid-cols-2 gap-6">
            <Field label="Max Context Tokens">
              <input
                type="number"
                min={4096}
                step={1024}
                value={maxContext}
                onChange={(e) => setMaxContext(Number(e.target.value))}
                className="h-10 rounded-md bg-secondary px-3"
              />
              <p className="text-xs text-muted-foreground">Total conversation context</p>
            </Field>
            <Field label="Max Input Tokens">
              <input
                type="number"
                min={1024}
                step={512}
                value={maxInput}
                onChange={(e) => setMaxInput(Number(e.target.value))}
                className="h-10 rounded-md bg-secondary px-3"
              />
              <p className="text-xs text-muted-foreground">Single message input limit</p>
            </Field>
            <Field label="Max Output Tokens">
              <input
                type="number"
                min={256}
                step={256}
                value={maxOutput}
                onChange={(e) => setMaxOutput(Number(e.target.value))}
                className="h-10 rounded-md bg-secondary px-3"
              />
              <p className="text-xs text-muted-foreground">AI response length limit</p>
            </Field>
            <Field label="Context Trimming">
              <select
                value={contextTrim}
                onChange={(e) => setContextTrim(e.target.value as ContextTrim)}
                className="h-10 rounded-md bg-secondary px-3"
              >
                <option value="auto">Auto (Smart)</option>
                <option value="head">Trim Oldest</option>
                <option value="tail">Trim Latest</option>
              </select>
              <p className="text-xs text-muted-foreground">How to handle context overflow</p>
            </Field>
          </div>
        </Card>

        <Card title="Generation Parameters">
          <div className="grid gap-5">
            <div className="grid gap-2">
              <div className="flex items-center justify-between text-sm">
                <span>Temperature <span className="opacity-70">{temperature}</span></span>
                <span className="opacity-70">Precise — Creative</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between text-sm">
                <span>Top P <span className="opacity-70">{topP}</span></span>
                <span className="opacity-70">Focused — Diverse</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={topP}
                onChange={(e) => setTopP(Number(e.target.value))}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="grid gap-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Frequency Penalty <span className="opacity-70">{freqPenalty}</span></span>
                  <span className="opacity-70">Repetitive — Varied</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={2}
                  step={0.1}
                  value={freqPenalty}
                  onChange={(e) => setFreqPenalty(Number(e.target.value))}
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Presence Penalty <span className="opacity-70">{presencePenalty}</span></span>
                  <span className="opacity-70">On‑topic — Exploratory</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={2}
                  step={0.1}
                  value={presencePenalty}
                  onChange={(e) => setPresencePenalty(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage; 