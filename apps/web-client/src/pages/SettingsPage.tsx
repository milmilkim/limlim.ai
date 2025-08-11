import { useState } from "react";

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
  const [contextTrim, setContextTrim] = useState("auto");

  // Generation Params
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(0.9);
  const [freqPenalty, setFreqPenalty] = useState(0);
  const [presencePenalty, setPresencePenalty] = useState(0);

  return (
    <div className="h-full w-full">
      <div className="mx-auto max-w-[1000px] px-4 py-6 md:py-8 grid gap-6">
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
                onChange={(e) => setContextTrim(e.target.value)}
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