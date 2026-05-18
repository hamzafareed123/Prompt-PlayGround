import { useState } from "react";
import Groq from "groq-sdk";
import "./App.css";

const TECHNIQUES = {
  "Zero-shot": {
    description: "Ask directly with no examples or guidance",
    systemPrompt: "Answer the user directly and concisely.",
    prefixPrompt: "",
  },
  "Few-shot": {
    description: "Provide examples before asking your question",
    systemPrompt: "Learn from the examples and follow the same pattern.",
    prefixPrompt: "Example:\nQ: Capital of Japan?\nA: Tokyo.\n\nNow answer:\n",
  },
  "Chain-of-thought": {
    description: "Model thinks step by step before answering",
    systemPrompt: "Think step by step before giving your final answer.",
    prefixPrompt: "Think step by step:\n\n",
  },
  "ReAct": {
    description: "Model reasons, acts, observes, then concludes",
    systemPrompt: `Use this format:
Thought: reason about the question
Action: what you decide to do
Observation: what you find
Final answer: your conclusion`,
    prefixPrompt: "",
  },
};

function App() {
  const [technique, setTechnique] = useState("Zero-shot");
  const [prompt, setPrompt] = useState("");
  const [temperature, setTemperature] = useState(0.7);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

   const handleRun = async () => {
    if (!prompt.trim()) { setError("Please enter a prompt first."); return; }
    setLoading(true); setError(""); setOutput("");

    try {
      const client = new Groq({
        apiKey: process.env.REACT_APP_GROQ_API_KEY,
        dangerouslyAllowBrowser: true,
      });
      const t = TECHNIQUES[technique];
      const res = await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: t.systemPrompt },
          { role: "user", content: t.prefixPrompt + prompt },
        ],
        temperature,
      });
      setOutput(res.choices[0].message.content);
    } catch (e) {
      setError("Error: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };



  return (
    <div className="app">
      <div className="top">
        <h1>Prompt Playground</h1>
         <p>Test prompting techniques and compare outputs</p>
      </div>
       <div className="card">
        <span className="label">Technique</span>
        <div className="tabs">
          {Object.keys(TECHNIQUES).map((t) => (
            <button
              key={t}
              className={`tab ${technique === t ? "active" : ""}`}
              onClick={() => setTechnique(t)}
            >{t}</button>
          ))}
        </div>
        <p className="hint">{TECHNIQUES[technique].description}</p>
      </div>

      {/* System prompt */}
      <div className="card">
        <span className="label">System prompt</span>
        <div className="sys-box">{TECHNIQUES[technique].systemPrompt}</div>
      </div>

      {/* Prompt + temperature */}
      <div className="card">
        <span className="label">Your prompt</span>
        <textarea
          rows={4}
          placeholder="e.g. How many r's are in the word strawberry?"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <hr className="divider" />
        <span className="label">Temperature: {temperature.toFixed(1)}</span>
        <input
          type="range" min="0" max="1" step="0.1"
          value={temperature}
          onChange={(e) => setTemperature(parseFloat(e.target.value))}
          className="slider"
        />
        <div className="slider-ends"><span>Precise</span><span>Creative</span></div>
      </div>

      <button className="run-btn" onClick={handleRun} disabled={loading}>
        {loading ? "Thinking…" : "Run prompt"}
      </button>

      {error && <div className="error">{error}</div>}

      {output && (
        <div className="card" style={{ marginTop: "1rem" }}>
          <span className="label">Output</span>
          <div className="output-box">{output}</div>
          <div className="bottom-row">
            <button className="copy-btn" onClick={handleCopy}>
              {copied ? "Copied" : "Copy"}
            </button>
            <span className="word-count">
              ~{output.trim().split(/\s+/).length} words
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default App;