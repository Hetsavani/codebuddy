// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vitejs.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }
// export default App
import { useState, useEffect } from "react";

const GEMINI_MODELS = [
  { value: "gemini-3.1-pro-preview", label: "Gemini 3.1 Pro" },
  { value: "gemini-3.1-flash-preview", label: "Gemini 3.1 Flash" },
  { value: "gemini-2.5-pro", label: "Gemini 2.5 Pro" },
  { value: "gemini-2.0-flash", label: "Gemini 2.0 Flash" },
  { value: "gemini-2.0-flash-lite", label: "Gemini 2.0 Flash-Lite" },
  { value: "gemini-3-flash", label: "Gemini 3 Flash" }, // try
  { value: "gemini-3.1-flash-lite", label: "Gemini 3.1 Flash Lite" }, // try
  { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash" }, // used in portfolio
  { value: "gemini-2.5-flash-lite", label: "Gemini 2.5 Flash Lite" }, // try
  { value: "gemini-2.5-flash-preview-tts", label: "Gemini 2.5 Flash Preview TTS" }, // try
  { value: "gemini-2.0-flash-thinking-exp", label: "Gemini 2.0 Flash Thinking" }
];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Syne:wght@400;600;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:         #0d0f14;
    --surface:    #151820;
    --border:     #1f2433;
    --border-hi:  #2e3650;
    --accent:     #4f8ef7;
    --accent-dim: #1e3566;
    --accent-glow:rgba(79,142,247,0.18);
    --green:      #3dffa0;
    --red:        #ff5b5b;
    --text:       #e8eaf0;
    --muted:      #5c6480;
    --radius:     10px;
  }

  body {
    background: var(--bg);
    font-family: 'Syne', sans-serif;
    color: var(--text);
    margin: 0;
    padding: 0;
  }

  .popup {
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    padding: 20px;
    gap: 18px;
    position: relative;
    background: var(--bg);
  }

  /* ambient glow orb */
  .popup::before {
    content: '';
    position: absolute;
    top: -60px; right: -60px;
    width: 220px; height: 220px;
    background: radial-gradient(circle, rgba(79,142,247,0.12) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  .popup > * {
    position: relative;
    z-index: 1;
  }

  /* ── Header ── */
  .header {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .logo-wrap {
    width: 36px; height: 36px;
    background: linear-gradient(135deg, #1a2a5e 0%, #0d1630 100%);
    border: 1px solid var(--accent-dim);
    border-radius: 9px;
    display: grid;
    place-items: center;
    flex-shrink: 0;
    box-shadow: 0 0 16px var(--accent-glow);
  }

  .logo-wrap svg { width: 20px; height: 20px; }

  .brand { line-height: 1; }
  .brand-name {
    font-size: 17px;
    font-weight: 800;
    letter-spacing: -0.3px;
    background: linear-gradient(90deg, #fff 0%, #8ab4ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .brand-sub {
    font-size: 10px;
    font-family: 'JetBrains Mono', monospace;
    color: var(--muted);
    letter-spacing: 0.08em;
    margin-top: 1px;
  }

  .status-dot {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    font-family: 'JetBrains Mono', monospace;
    color: var(--muted);
    flex-shrink: 0;
  }
  .dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: var(--muted);
    transition: background 0.3s, box-shadow 0.3s;
  }
  .dot.active {
    background: var(--green);
    box-shadow: 0 0 6px var(--green);
  }

  /* ── Divider ── */
  .divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--border-hi) 40%, var(--border-hi) 60%, transparent);
    flex-shrink: 0;
  }

  /* ── Form Card ── */
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    flex-shrink: 0;
  }

  .card-title {
    font-size: 11px;
    font-family: 'JetBrains Mono', monospace;
    color: var(--muted);
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  /* ── Field ── */
  .field { display: flex; flex-direction: column; gap: 6px; }

  label {
    font-size: 12px;
    font-weight: 600;
    color: var(--text);
    letter-spacing: 0.02em;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  label span.required {
    color: var(--accent);
    font-size: 10px;
  }

  .input-wrap { position: relative; }

  input[type="password"], input[type="text"] {
    width: 100%;
    background: var(--bg);
    border: 1px solid var(--border-hi);
    border-radius: 7px;
    padding: 9px 38px 9px 12px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    color: var(--text);
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    letter-spacing: 0.04em;
    box-sizing: border-box;
  }

  input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-glow);
  }

  input::placeholder { color: var(--muted); }

  input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .eye-btn {
    position: absolute;
    right: 10px; top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: var(--muted);
    padding: 2px;
    display: grid;
    place-items: center;
    transition: color 0.2s;
  }
  .eye-btn:hover { color: var(--text); }

  /* ── Select ── */
  .select-wrap { position: relative; }

  select {
    width: 100%;
    background: var(--bg);
    border: 1px solid var(--border-hi);
    border-radius: 7px;
    padding: 9px 34px 9px 12px;
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: var(--text);
    outline: none;
    appearance: none;
    cursor: pointer;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
  }

  select:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-glow);
  }

  select:disabled { opacity: 0.5; cursor: not-allowed; }

  .select-arrow {
    position: absolute;
    right: 11px; top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: var(--muted);
  }

  /* ── Key preview badge ── */
  .key-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(61,255,160,0.06);
    border: 1px solid rgba(61,255,160,0.2);
    border-radius: 6px;
    padding: 7px 10px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: var(--green);
    word-break: break-all;
  }
  .key-badge svg { flex-shrink: 0; }

  /* ── Actions row ── */
  .actions {
    display: flex;
    gap: 8px;
  }

  button {
    font-family: 'Syne', sans-serif;
    font-weight: 600;
    font-size: 12px;
    border: none;
    border-radius: 7px;
    cursor: pointer;
    padding: 9px 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition: all 0.18s;
    letter-spacing: 0.02em;
  }

  .btn-save {
    flex: 1;
    background: linear-gradient(135deg, #2a4fa8 0%, #1a3080 100%);
    color: #fff;
    border: 1px solid var(--accent-dim);
    box-shadow: 0 2px 12px rgba(79,142,247,0.25);
  }
  .btn-save:hover {
    background: linear-gradient(135deg, #3a62c8 0%, #2040a8 100%);
    box-shadow: 0 4px 18px rgba(79,142,247,0.4);
    transform: translateY(-1px);
  }
  .btn-save:active { transform: translateY(0); }

  .btn-update {
    flex: 1;
    background: rgba(79,142,247,0.1);
    color: var(--accent);
    border: 1px solid var(--accent-dim);
  }
  .btn-update:hover {
    background: rgba(79,142,247,0.2);
    border-color: var(--accent);
  }

  .btn-delete {
    background: rgba(255,91,91,0.08);
    color: var(--red);
    border: 1px solid rgba(255,91,91,0.2);
    padding: 9px 12px;
  }
  .btn-delete:hover {
    background: rgba(255,91,91,0.18);
    border-color: var(--red);
  }

  button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }


  /* ── Toast ── */
  .toast {
    position: fixed;
    bottom: 16px; left: 50%;
    transform: translateX(-50%) translateY(20px);
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
    pointer-events: none;
    z-index: 99;
  }
  .toast.show {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  .toast-inner {
    background: var(--surface);
    border-radius: 8px;
    padding: 8px 14px;
    font-size: 12px;
    font-family: 'JetBrains Mono', monospace;
    display: flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
  }
  .toast.success .toast-inner { border: 1px solid rgba(61,255,160,0.3); color: var(--green); }
  .toast.error   .toast-inner { border: 1px solid rgba(255,91,91,0.3);  color: var(--red);   }
  .toast.info    .toast-inner { border: 1px solid var(--accent-dim);    color: var(--accent);}

  /* ── Footer ── */
  .footer {
    margin-top: auto;
    text-align: center;
    font-size: 10px;
    font-family: 'JetBrains Mono', monospace;
    color: var(--muted);
    letter-spacing: 0.06em;
    flex-shrink: 0;
  }
  .footer a { color: var(--accent); text-decoration: none; }
  .footer a:hover { text-decoration: underline; }
`;

function maskKey(key) {
  if (!key || key.length < 8) return "••••••••";
  return key.slice(0, 6) + "••••••••" + key.slice(-4);
}

export default function App() {
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState(GEMINI_MODELS[0].value);
  const [savedKey, setSavedKey] = useState("");
  const [savedModel, setSavedModel] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "", type: "success" });

  const hasSaved = Boolean(savedKey);

  // Load from chrome.storage on mount
  useEffect(() => {
    const load = () => {
      if (typeof chrome !== "undefined" && chrome.storage) {
        chrome.storage.local.get(["codebuddy_api_key", "codebuddy_model"], (res) => {
          if (res.codebuddy_api_key) {
            setSavedKey(res.codebuddy_api_key);
            setApiKey(res.codebuddy_api_key);
          }
          if (res.codebuddy_model) {
            setSavedModel(res.codebuddy_model);
            setModel(res.codebuddy_model);
          }
        });
      }
    };
    load();
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 2800);
  };

  const handleSave = () => {
    if (!apiKey.trim()) { showToast("API key cannot be empty", "error"); return; }
    setLoading(true);
    const store = (resolve) => {
      if (typeof chrome !== "undefined" && chrome.storage) {
        chrome.storage.local.set(
          { codebuddy_api_key: apiKey.trim(), codebuddy_model: model },
          () => { resolve(); }
        );
      } else {
        // fallback for dev preview
      }
      localStorage.setItem("codebuddy_api_key", apiKey.trim());
      localStorage.setItem("codebuddy_model", model);
      resolve();
    };
    store(() => {
      setSavedKey(apiKey.trim());
      setSavedModel(model);
      setLoading(false);
      showToast("Configuration saved ✓. Please refresh the page.", "success");
    });
  };


  const handleUpdate = () => {
    if (!apiKey.trim()) { showToast("Enter a new API key first", "error"); return; }
    handleSave();
  };

  const handleDelete = () => {
    setLoading(true);
    const clear = (resolve) => {
      if (typeof chrome !== "undefined" && chrome.storage) {
        chrome.storage.local.remove(["codebuddy_api_key", "codebuddy_model"], () => resolve());
      } else {
        localStorage.removeItem("codebuddy_api_key");
        localStorage.removeItem("codebuddy_model");
        resolve();
      }
    };
    clear(() => {
      setSavedKey("");
      setSavedModel("");
      setApiKey("");
      setModel(GEMINI_MODELS[0].value);
      setLoading(false);
      showToast("Configuration deleted. Please refresh the page.", "error");
    });
  };

  return (
    <>
      <style>{styles}</style>

      <div className="popup">
        {/* ── Header ── */}
        <div className="header">
          <div className="logo-wrap">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 6l-6 6 6 6" stroke="#4f8ef7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 6l6 6-6 6" stroke="#4f8ef7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M13 3l-2 18" stroke="#8ab4ff" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div className="brand">
            <div className="brand-name">CodeBuddy</div>
            <div className="brand-sub">AI · CHROME EXT</div>
          </div>
          <div className="status-dot">
            <span className={`dot ${hasSaved ? "active" : ""}`} />
            {hasSaved ? "READY" : "SETUP"}
          </div>
        </div>

        <div className="divider" />

        {/* ── Config Card ── */}
        <div className="card">
          <span className="card-title">⚙ Gemini Configuration</span>

          {/* API Key field */}
          <div className="field">
            <label>
              API Key
              <span className="required">required</span>
            </label>
            <div className="input-wrap">
              <input
                type={showKey ? "text" : "password"}
                placeholder="AIzaSy••••••••••••••••••••••••••"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                disabled={loading}
                spellCheck={false}
                autoComplete="off"
              />
              <button className="eye-btn" onClick={() => setShowKey(v => !v)} type="button" tabIndex={-1}>
                {showKey
                  ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                  : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                }
              </button>
            </div>
          </div>

          {/* Saved key badge */}
          {hasSaved && (
            <div className="key-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" /></svg>
              {maskKey(savedKey)}
              &nbsp;·&nbsp;
              {GEMINI_MODELS.find(m => m.value === savedModel)?.label ?? savedModel}
            </div>
          )}

          {/* Model selector */}
          <div className="field">
            <label>Model</label>
            <div className="select-wrap">
              <select
                value={model}
                onChange={e => setModel(e.target.value)}
                disabled={loading}
              >
                {GEMINI_MODELS.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
              <span className="select-arrow">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="actions">
            {!hasSaved ? (
              <button className="btn-save" onClick={handleSave} disabled={loading || !apiKey.trim()}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
                Save Configuration
              </button>
            ) : (
              <>
                <button className="btn-update" onClick={handleUpdate} disabled={loading || !apiKey.trim()}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
                  Update
                </button>
                <button className="btn-delete" onClick={handleDelete} disabled={loading}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── Toast ── */}
        <div className={`toast ${toast.show ? "show" : ""} ${toast.type}`}>
          <div className="toast-inner">
            {toast.type === "success" && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
            {toast.type === "error" && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            )}
            {toast.type === "info" && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            )}
            {toast.msg}
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="footer">
          Built for LeetCode · Powered by Gemini ⚡
        </div>
      </div>
      
      </>
  );
}