import { useState, useEffect, useCallback } from "react";

// ─── STYLES ───────────────────────────────────────────────────────────────────
const style = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #080c14;
    --surface: #0d1520;
    --surface2: #111d2e;
    --border: #1e3a5f;
    --accent: #00d4ff;
    --accent2: #ff6b35;
    --warn: #ffd166;
    --ok: #06d6a0;
    --danger: #ef476f;
    --text: #e2eaf4;
    --muted: #5a7a99;
    --font-display: 'Syne', sans-serif;
    --font-mono: 'Space Mono', monospace;
  }

  body { background: var(--bg); color: var(--text); font-family: var(--font-display); }

  .dash { min-height: 100vh; display: flex; flex-direction: column; }

  /* HEADER */
  .header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 18px 32px; border-bottom: 1px solid var(--border);
    background: linear-gradient(90deg, #080c14 0%, #0a1628 100%);
    position: sticky; top: 0; z-index: 100;
  }
  .header-logo { display: flex; align-items: center; gap: 10px; }
  .logo-mark {
    width: 34px; height: 34px; background: var(--accent);
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    display: flex; align-items: center; justify-content: center;
    animation: pulse-hex 3s ease-in-out infinite;
  }
  @keyframes pulse-hex { 0%,100% { box-shadow: 0 0 0 0 rgba(0,212,255,0.3); } 50% { box-shadow: 0 0 0 8px rgba(0,212,255,0); } }
  .logo-text { font-size: 1.15rem; font-weight: 800; letter-spacing: 0.08em; color: var(--text); }
  .logo-text span { color: var(--accent); }
  .header-status { font-family: var(--font-mono); font-size: 0.7rem; color: var(--muted); display: flex; gap: 16px; }
  .status-dot { display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--ok); margin-right: 5px; animation: blink 2s infinite; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

  /* MAIN LAYOUT */
  .main { display: flex; flex: 1; }

  /* SIDEBAR */
  .sidebar {
    width: 280px; min-width: 280px; background: var(--surface);
    border-right: 1px solid var(--border); padding: 24px 16px;
    display: flex; flex-direction: column; gap: 8px;
  }
  .sidebar-section { font-family: var(--font-mono); font-size: 0.65rem; color: var(--muted); letter-spacing: 0.15em; text-transform: uppercase; padding: 16px 8px 6px; }
  .nav-item {
    display: flex; align-items: center; gap: 10px; padding: 10px 12px;
    border-radius: 6px; cursor: pointer; transition: all 0.15s;
    font-size: 0.875rem; font-weight: 600; color: var(--muted);
    border: 1px solid transparent;
  }
  .nav-item:hover { background: var(--surface2); color: var(--text); }
  .nav-item.active { background: rgba(0,212,255,0.08); color: var(--accent); border-color: rgba(0,212,255,0.2); }
  .nav-icon { font-size: 1rem; width: 20px; text-align: center; }
  .nav-badge { margin-left: auto; background: var(--danger); color: white; font-family: var(--font-mono); font-size: 0.6rem; padding: 2px 6px; border-radius: 10px; }
  .nav-badge.warn { background: var(--warn); color: #000; }
  .nav-badge.ok { background: var(--ok); color: #000; }

  /* CONNECT PANEL in sidebar */
  .connect-panel { padding: 12px; background: var(--surface2); border-radius: 8px; border: 1px solid var(--border); margin-top: 8px; }
  .connect-panel label { font-family: var(--font-mono); font-size: 0.65rem; color: var(--muted); display: block; margin-bottom: 4px; letter-spacing: 0.1em; }
  .connect-panel input {
    width: 100%; background: var(--bg); border: 1px solid var(--border); color: var(--text);
    padding: 7px 10px; border-radius: 5px; font-family: var(--font-mono); font-size: 0.72rem;
    margin-bottom: 10px; outline: none; transition: border 0.2s;
  }
  .connect-panel input:focus { border-color: var(--accent); }
  .btn-connect {
    width: 100%; padding: 9px; background: var(--accent); color: var(--bg);
    border: none; border-radius: 5px; font-family: var(--font-display); font-weight: 700;
    font-size: 0.8rem; cursor: pointer; letter-spacing: 0.05em; transition: all 0.2s;
  }
  .btn-connect:hover { background: #33ddff; transform: translateY(-1px); }
  .btn-connect:disabled { background: var(--muted); cursor: not-allowed; transform: none; }

  /* CONTENT */
  .content { flex: 1; padding: 28px 32px; overflow-y: auto; }

  .page-title {
    font-size: 1.6rem; font-weight: 800; margin-bottom: 4px;
    background: linear-gradient(135deg, var(--text) 30%, var(--accent) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .page-sub { font-family: var(--font-mono); font-size: 0.72rem; color: var(--muted); margin-bottom: 24px; }

  /* STAT CARDS */
  .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
  .stat-card {
    background: var(--surface); border: 1px solid var(--border); border-radius: 10px;
    padding: 18px 20px; position: relative; overflow: hidden; transition: border 0.2s;
  }
  .stat-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: var(--card-color, var(--accent));
  }
  .stat-card:hover { border-color: var(--card-color, var(--accent)); }
  .stat-label { font-family: var(--font-mono); font-size: 0.65rem; color: var(--muted); letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 8px; }
  .stat-value { font-size: 2rem; font-weight: 800; color: var(--card-color, var(--text)); line-height: 1; }
  .stat-sub { font-family: var(--font-mono); font-size: 0.68rem; color: var(--muted); margin-top: 6px; }
  .stat-icon { position: absolute; bottom: 12px; right: 14px; font-size: 1.4rem; opacity: 0.15; }

  /* PROGRESS BAR */
  .sprint-progress { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 20px 24px; margin-bottom: 24px; }
  .progress-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
  .progress-title { font-weight: 700; font-size: 0.9rem; }
  .progress-pct { font-family: var(--font-mono); font-size: 0.8rem; color: var(--accent); }
  .progress-bar-bg { height: 8px; background: var(--surface2); border-radius: 4px; overflow: hidden; }
  .progress-bar-fill { height: 100%; border-radius: 4px; background: linear-gradient(90deg, var(--ok), var(--accent)); transition: width 1s ease; }

  /* TICKET TABLE */
  .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
  .section-title { font-size: 1rem; font-weight: 700; }
  .btn-ai {
    display: flex; align-items: center; gap: 6px;
    padding: 7px 14px; background: linear-gradient(135deg, #1a0533, #0a1628);
    border: 1px solid rgba(138,43,226,0.5); color: #bf7fff;
    border-radius: 6px; font-family: var(--font-display); font-size: 0.78rem; font-weight: 600;
    cursor: pointer; transition: all 0.2s; letter-spacing: 0.03em;
  }
  .btn-ai:hover { background: linear-gradient(135deg, #2d0d4e, #0d1f3c); border-color: #bf7fff; box-shadow: 0 0 16px rgba(138,43,226,0.3); }
  .btn-ai:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn-sm {
    padding: 5px 12px; background: var(--surface2); border: 1px solid var(--border);
    color: var(--text); border-radius: 5px; font-size: 0.75rem; font-family: var(--font-display);
    font-weight: 600; cursor: pointer; transition: all 0.15s;
  }
  .btn-sm:hover { border-color: var(--accent); color: var(--accent); }

  .ticket-table { width: 100%; border-collapse: collapse; }
  .ticket-table th { font-family: var(--font-mono); font-size: 0.62rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.12em; padding: 8px 12px; text-align: left; border-bottom: 1px solid var(--border); }
  .ticket-table td { padding: 11px 12px; border-bottom: 1px solid rgba(30,58,95,0.4); font-size: 0.82rem; vertical-align: middle; }
  .ticket-table tr:hover td { background: rgba(0,212,255,0.03); }
  .ticket-table tr.stale td { background: rgba(255,107,53,0.04); }

  .badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 4px; font-family: var(--font-mono); font-size: 0.62rem; font-weight: 700; }
  .badge-done { background: rgba(6,214,160,0.12); color: var(--ok); border: 1px solid rgba(6,214,160,0.2); }
  .badge-active { background: rgba(0,212,255,0.1); color: var(--accent); border: 1px solid rgba(0,212,255,0.2); }
  .badge-new { background: rgba(255,209,102,0.1); color: var(--warn); border: 1px solid rgba(255,209,102,0.2); }
  .badge-blocked { background: rgba(239,71,111,0.1); color: var(--danger); border: 1px solid rgba(239,71,111,0.2); }
  .badge-stale { background: rgba(255,107,53,0.12); color: var(--accent2); border: 1px solid rgba(255,107,53,0.25); }

  .type-tag { font-family: var(--font-mono); font-size: 0.62rem; color: var(--muted); background: var(--surface2); padding: 2px 6px; border-radius: 3px; }

  /* AI CARD */
  .ai-card { background: linear-gradient(135deg, #0d0820 0%, #0a1628 100%); border: 1px solid rgba(138,43,226,0.3); border-radius: 10px; padding: 20px 22px; margin-bottom: 16px; }
  .ai-card-header { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
  .ai-spark { font-size: 1rem; }
  .ai-card-title { font-size: 0.85rem; font-weight: 700; color: #bf7fff; }
  .ai-card-ticket { font-family: var(--font-mono); font-size: 0.65rem; color: var(--muted); margin-left: auto; }
  .ai-content { font-size: 0.82rem; line-height: 1.65; color: var(--text); }
  .ai-content ul { padding-left: 18px; }
  .ai-content li { margin-bottom: 5px; }
  .ai-content strong { color: var(--accent); }

  /* EMPTY STATE */
  .empty-state { text-align: center; padding: 60px 20px; }
  .empty-icon { font-size: 3rem; margin-bottom: 12px; opacity: 0.4; }
  .empty-title { font-weight: 700; margin-bottom: 6px; color: var(--muted); }
  .empty-sub { font-family: var(--font-mono); font-size: 0.72rem; color: var(--muted); opacity: 0.7; }

  /* LOADING */
  .loading-bar { height: 3px; background: var(--border); border-radius: 2px; overflow: hidden; margin: 12px 0; }
  .loading-fill { height: 100%; background: linear-gradient(90deg, var(--accent), #bf7fff, var(--accent)); background-size: 200%; animation: shimmer 1.5s linear infinite; }
  @keyframes shimmer { 0%{background-position:200%} 100%{background-position:-200%} }
  .loading-text { font-family: var(--font-mono); font-size: 0.7rem; color: var(--muted); }

  /* FOLLOW-UP TICKET PREVIEW */
  .followup-card { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 16px 18px; margin-bottom: 12px; }
  .followup-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 8px; }
  .followup-title { font-size: 0.85rem; font-weight: 700; }
  .followup-meta { font-family: var(--font-mono); font-size: 0.65rem; color: var(--muted); margin-top: 2px; }
  .followup-desc { font-size: 0.78rem; color: var(--muted); line-height: 1.5; }
  .btn-create { padding: 5px 12px; background: rgba(0,212,255,0.1); border: 1px solid rgba(0,212,255,0.3); color: var(--accent); border-radius: 5px; font-size: 0.72rem; font-weight: 700; cursor: pointer; white-space: nowrap; transition: all 0.2s; }
  .btn-create:hover { background: rgba(0,212,255,0.2); }

  .divider { height: 1px; background: var(--border); margin: 24px 0; }

  .toast { position: fixed; bottom: 24px; right: 24px; background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; padding: 12px 18px; font-size: 0.82rem; z-index: 999; animation: slideIn 0.3s ease; box-shadow: 0 8px 32px rgba(0,0,0,0.5); }
  @keyframes slideIn { from{transform: translateX(20px); opacity:0} to{transform:translateX(0); opacity:1} }
  .toast.success { border-color: rgba(6,214,160,0.4); color: var(--ok); }
  .toast.error { border-color: rgba(239,71,111,0.4); color: var(--danger); }

  .scroll-fade { overflow-y: auto; max-height: 520px; padding-right: 4px; }
  .scroll-fade::-webkit-scrollbar { width: 4px; }
  .scroll-fade::-webkit-scrollbar-track { background: var(--surface); }
  .scroll-fade::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

  @media (max-width: 900px) {
    .stat-grid { grid-template-columns: repeat(2,1fr); }
    .sidebar { width: 220px; min-width: 220px; }
  }
`;

// ─── AZURE DEVOPS API ──────────────────────────────────────────────────────────
const ado = {
  headers(pat) {
    return {
      Authorization: `Basic ${btoa(":" + pat)}`,
      "Content-Type": "application/json",
    };
  },
  async getCurrentSprint(org, project, team, pat) {
    const url = `https://dev.azure.com/${org}/${project}/${team}/_apis/work/teamsettings/iterations?$timeframe=current&api-version=7.0`;
    const r = await fetch(url, { headers: this.headers(pat) });
    if (!r.ok) throw new Error(`ADO error ${r.status}: ${r.statusText}`);
    const d = await r.json();
    return d.value?.[0] || null;
  },
  async getSprintWorkItems(org, project, team, iterationId, pat) {
    const url = `https://dev.azure.com/${org}/${project}/${team}/_apis/work/teamsettings/iterations/${iterationId}/workitems?api-version=7.0`;
    const r = await fetch(url, { headers: this.headers(pat) });
    if (!r.ok) throw new Error(`ADO error ${r.status}`);
    const d = await r.json();
    return d.workItemRelations?.map((w) => w.target?.id).filter(Boolean) || [];
  },
  async getWorkItemDetails(org, ids, pat) {
    if (!ids.length) return [];
    const fields =
      "System.Id,System.Title,System.WorkItemType,System.State,System.AssignedTo,System.ChangedDate,System.Description,Microsoft.VSTS.Common.Priority,System.Tags,System.AreaPath";
    const url = `https://dev.azure.com/${org}/_apis/wit/workitems?ids=${ids.join(",")}&fields=${fields}&api-version=7.0`;
    const r = await fetch(url, { headers: this.headers(pat) });
    if (!r.ok) throw new Error(`ADO error ${r.status}`);
    const d = await r.json();
    return d.value || [];
  },
  async createWorkItem(org, project, type, fields, pat) {
    const url = `https://dev.azure.com/${org}/${project}/_apis/wit/workitems/$${encodeURIComponent(type)}?api-version=7.0`;
    const body = Object.entries(fields).map(([k, v]) => ({
      op: "add",
      path: `/fields/${k}`,
      value: v,
    }));
    const r = await fetch(url, {
      method: "POST",
      headers: { ...this.headers(pat), "Content-Type": "application/json-patch+json" },
      body: JSON.stringify(body),
    });
    if (!r.ok) throw new Error(`Create failed ${r.status}`);
    return await r.json();
  },
};

// ─── CLAUDE AI ────────────────────────────────────────────────────────────────
async function analyzeWithClaude(prompt, systemPrompt) {
  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await resp.json();
  return data.content?.map((b) => b.text || "").join("") || "";
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const daysSince = (dateStr) => {
  if (!dateStr) return 999;
  return Math.floor((Date.now() - new Date(dateStr)) / 86400000);
};
const getStatusBadge = (state) => {
  const s = (state || "").toLowerCase();
  if (
    s.includes("done") ||
    s.includes("closed") ||
    s.includes("resolved") ||
    s.includes("completed")
  )
    return "badge-done";
  if (s.includes("active") || s.includes("in progress") || s.includes("committed"))
    return "badge-active";
  if (s.includes("blocked")) return "badge-blocked";
  return "badge-new";
};
const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-CA", { month: "short", day: "numeric" }) : "—";
const assigneeName = (a) => {
  if (!a) return "Unassigned";
  if (typeof a === "string") return a;
  return a.displayName || a.uniqueName || "Unknown";
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function SprintDash() {
  const [tab, setTab] = useState("overview");
  const [config, setConfig] = useState({ org: "", project: "", team: "", pat: "" });
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadMsg, setLoadMsg] = useState("");
  const [sprint, setSprint] = useState(null);
  const [items, setItems] = useState([]);
  const [aiAnalysis, setAiAnalysis] = useState({});
  const [followUps, setFollowUps] = useState([]);
  const [toast, setToast] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [creatingId, setCreatingId] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const pullData = async () => {
    setLoading(true);
    try {
      setLoadMsg("Fetching current sprint…");
      const sprintData = await ado.getCurrentSprint(
        config.org,
        config.project,
        config.team || `${config.project} Team`,
        config.pat
      );
      if (!sprintData) throw new Error("No active sprint found");
      setSprint(sprintData);
      setLoadMsg("Fetching work item IDs…");
      const ids = await ado.getSprintWorkItems(
        config.org,
        config.project,
        config.team || `${config.project} Team`,
        sprintData.id,
        config.pat
      );
      setLoadMsg(`Loading ${ids.length} work items…`);
      const details = await ado.getWorkItemDetails(config.org, ids, config.pat);
      setItems(details.map((d) => ({ ...d.fields, id: d.id })));
      setConnected(true);
      showToast(`Loaded ${details.length} items from sprint "${sprintData.name}"`);
    } catch (e) {
      showToast(e.message, "error");
    }
    setLoading(false);
    setLoadMsg("");
  };

  const runAiAnalysis = async () => {
    if (!items.length) return;
    setAiLoading(true);
    const summary = items.map((i) => ({
      id: i.id,
      title: i["System.Title"],
      type: i["System.WorkItemType"],
      state: i["System.State"],
      assignee: assigneeName(i["System.AssignedTo"]),
      daysSinceUpdate: daysSince(i["System.ChangedDate"]),
      desc: (i["System.Description"] || "").replace(/<[^>]+>/g, "").slice(0, 200),
    }));

    const sys = `You are a senior engineering project manager. Analyze sprint work items and return ONLY valid JSON with this exact structure:
{
  "staleFlags": [{"id": <number>, "reason": "<string>"}],
  "testPoints": [{"id": <number>, "title":"<string>", "points": ["<string>","<string>","<string>"]}],
  "followUpTickets": [{"title":"<string>","type":"Task","description":"<string>","linkedTo":<number>}],
  "summary": {"insight":"<string>","risk":"<string>","recommendation":"<string>"}
}
Return ONLY the JSON object, no markdown, no explanation.`;

    try {
      const raw = await analyzeWithClaude(
        `Sprint items: ${JSON.stringify(summary)}\n\nFlag items not updated in 3+ days as stale, suggest 3 test points per incomplete item, suggest follow-up tickets for incomplete/blocked work, and give an overall sprint health summary.`,
        sys
      );
      const cleaned = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      const staleMap = {};
      (parsed.staleFlags || []).forEach((s) => {
        staleMap[s.id] = s.reason;
      });
      const testMap = {};
      (parsed.testPoints || []).forEach((t) => {
        testMap[t.id] = t;
      });
      setAiAnalysis({ staleMap, testMap, summary: parsed.summary });
      setFollowUps(parsed.followUpTickets || []);
      showToast("AI analysis complete");
      setTab("ai");
    } catch (e) {
      showToast("AI parse error — try again", "error");
    }
    setAiLoading(false);
  };

  const createFollowUpTicket = async (ticket, idx) => {
    setCreatingId(idx);
    try {
      await ado.createWorkItem(
        config.org,
        config.project,
        ticket.type,
        {
          "System.Title": ticket.title,
          "System.Description": ticket.description,
        },
        config.pat
      );
      const updated = [...followUps];
      updated[idx] = { ...updated[idx], created: true };
      setFollowUps(updated);
      showToast(`Ticket "${ticket.title}" created in Azure DevOps`);
    } catch (e) {
      showToast(e.message, "error");
    }
    setCreatingId(null);
  };

  // ── Derived stats
  const done = items.filter((i) => getStatusBadge(i["System.State"]) === "badge-done").length;
  const blocked = items.filter(
    (i) => getStatusBadge(i["System.State"]) === "badge-blocked"
  ).length;
  const staleCount = Object.keys(aiAnalysis.staleMap || {}).length;
  const pct = items.length ? Math.round((done / items.length) * 100) : 0;

  // ── Nav items
  const navItems = [
    { id: "overview", icon: "⬡", label: "Sprint Overview", badge: null },
    { id: "tickets", icon: "◈", label: "All Tickets", badge: items.length || null, badgeType: "ok" },
    { id: "stale", icon: "⚠", label: "Stale Tickets", badge: staleCount || null, badgeType: "warn" },
    { id: "ai", icon: "✦", label: "AI Insights", badge: null },
    {
      id: "followup",
      icon: "＋",
      label: "Follow-up Tickets",
      badge: followUps.length || null,
      badgeType: "",
    },
  ];

  return (
    <>
      <style>{style}</style>
      <div className="dash">
        {/* HEADER */}
        <header className="header">
          <div className="header-logo">
            <div className="logo-mark" />
            <span className="logo-text">
              Sprint<span>Intel</span>
            </span>
          </div>
          <div className="header-status">
            {connected ? (
              <>
                <span>
                  <span className="status-dot" />
                  CONNECTED
                </span>
                <span>
                  {config.org} / {config.project}
                </span>
                <span>{sprint?.name || "—"}</span>
              </>
            ) : (
              <span style={{ color: "var(--muted)" }}>
                NOT CONNECTED — configure sidebar
              </span>
            )}
          </div>
        </header>

        <div className="main">
          {/* SIDEBAR */}
          <aside className="sidebar">
            <div className="sidebar-section">Navigation</div>
            {navItems.map((n) => (
              <div
                key={n.id}
                className={`nav-item ${tab === n.id ? "active" : ""}`}
                onClick={() => setTab(n.id)}
              >
                <span className="nav-icon">{n.icon}</span>
                {n.label}
                {n.badge ? (
                  <span className={`nav-badge ${n.badgeType}`}>{n.badge}</span>
                ) : null}
              </div>
            ))}

            <div className="sidebar-section">Azure DevOps</div>
            <div className="connect-panel">
              {[
                { key: "org", label: "ORGANIZATION", ph: "mycompany" },
                { key: "project", label: "PROJECT", ph: "MyProject" },
                { key: "team", label: "TEAM (optional)", ph: "defaultTeam" },
                { key: "pat", label: "PERSONAL ACCESS TOKEN", ph: "••••••••••••" },
              ].map(({ key, label, ph }) => (
                <div key={key}>
                  <label>{label}</label>
                  <input
                    type={key === "pat" ? "password" : "text"}
                    placeholder={ph}
                    value={config[key]}
                    onChange={(e) => setConfig({ ...config, [key]: e.target.value })}
                  />
                </div>
              ))}
              <button
                className="btn-connect"
                onClick={pullData}
                disabled={loading || !config.org || !config.project || !config.pat}
              >
                {loading ? "Connecting…" : "⬡ Pull Sprint Data"}
              </button>
              {loading && (
                <div style={{ marginTop: 10 }}>
                  <div className="loading-bar">
                    <div className="loading-fill" />
                  </div>
                  <div className="loading-text">{loadMsg}</div>
                </div>
              )}
            </div>
          </aside>

          {/* CONTENT */}
          <main className="content">
            {/* ── OVERVIEW ── */}
            {tab === "overview" && (
              <>
                <div className="page-title">Sprint Overview</div>
                <div className="page-sub">
                  {sprint
                    ? `${sprint.name} · ${fmtDate(sprint.attributes?.startDate)} → ${fmtDate(sprint.attributes?.finishDate)}`
                    : "Connect to Azure DevOps to load sprint data"}
                </div>

                {!connected ? (
                  <div className="empty-state">
                    <div className="empty-icon">⬡</div>
                    <div className="empty-title">No data yet</div>
                    <div className="empty-sub">
                      Enter your Azure DevOps credentials in the sidebar and click Pull Sprint Data
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="stat-grid">
                      {[
                        {
                          label: "Total Items",
                          value: items.length,
                          sub: "in this sprint",
                          color: "var(--accent)",
                          icon: "◈",
                        },
                        {
                          label: "Completed",
                          value: done,
                          sub: `${pct}% done`,
                          color: "var(--ok)",
                          icon: "✓",
                        },
                        {
                          label: "Blocked",
                          value: blocked,
                          sub: "need attention",
                          color: "var(--danger)",
                          icon: "⚠",
                        },
                        {
                          label: "Stale Tickets",
                          value: staleCount,
                          sub: "not updated 3+ days",
                          color: "var(--warn)",
                          icon: "⏱",
                        },
                      ].map((s) => (
                        <div
                          className="stat-card"
                          key={s.label}
                          style={{ "--card-color": s.color }}
                        >
                          <div className="stat-label">{s.label}</div>
                          <div className="stat-value">{s.value}</div>
                          <div className="stat-sub">{s.sub}</div>
                          <div className="stat-icon">{s.icon}</div>
                        </div>
                      ))}
                    </div>

                    <div className="sprint-progress">
                      <div className="progress-header">
                        <span className="progress-title">Sprint Completion</span>
                        <span className="progress-pct">{pct}%</span>
                      </div>
                      <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
                      </div>
                    </div>

                    {aiAnalysis.summary && (
                      <div className="ai-card">
                        <div className="ai-card-header">
                          <span className="ai-spark">✦</span>
                          <span className="ai-card-title">AI Sprint Health Assessment</span>
                        </div>
                        <div className="ai-content">
                          <p>
                            <strong>Insight:</strong> {aiAnalysis.summary.insight}
                          </p>
                          <p style={{ marginTop: 8 }}>
                            <strong>Risk:</strong> {aiAnalysis.summary.risk}
                          </p>
                          <p style={{ marginTop: 8 }}>
                            <strong>Recommendation:</strong> {aiAnalysis.summary.recommendation}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="section-header">
                      <span className="section-title">Run AI Analysis</span>
                      <button className="btn-ai" onClick={runAiAnalysis} disabled={aiLoading}>
                        {aiLoading ? "⟳ Analysing…" : "✦ Analyse Sprint with AI"}
                      </button>
                    </div>
                    {aiLoading && (
                      <div>
                        <div className="loading-bar">
                          <div className="loading-fill" />
                        </div>
                        <div className="loading-text">
                          Sending sprint data to Claude AI — flagging stale tickets, generating
                          test points &amp; follow-ups…
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            )}

            {/* ── ALL TICKETS ── */}
            {tab === "tickets" && (
              <>
                <div className="page-title">All Tickets</div>
                <div className="page-sub">{items.length} work items · current sprint</div>
                {!items.length ? (
                  <div className="empty-state">
                    <div className="empty-icon">◈</div>
                    <div className="empty-title">No tickets loaded</div>
                  </div>
                ) : (
                  <div className="scroll-fade">
                    <table className="ticket-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Title</th>
                          <th>Type</th>
                          <th>State</th>
                          <th>Assignee</th>
                          <th>Last Update</th>
                          <th>Days Idle</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((i) => {
                          const idle = daysSince(i["System.ChangedDate"]);
                          const isStale = aiAnalysis.staleMap?.[i.id];
                          return (
                            <tr key={i.id} className={isStale ? "stale" : ""}>
                              <td>
                                <span
                                  style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.7rem",
                                    color: "var(--muted)",
                                  }}
                                >
                                  #{i.id}
                                </span>
                              </td>
                              <td style={{ maxWidth: 260 }}>
                                <div
                                  style={{
                                    fontWeight: 600,
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {i["System.Title"]}
                                </div>
                                {isStale && (
                                  <div
                                    style={{
                                      fontSize: "0.68rem",
                                      color: "var(--accent2)",
                                      marginTop: 2,
                                    }}
                                  >
                                    ⚠ {aiAnalysis.staleMap[i.id]}
                                  </div>
                                )}
                              </td>
                              <td>
                                <span className="type-tag">{i["System.WorkItemType"]}</span>
                              </td>
                              <td>
                                <span className={`badge ${getStatusBadge(i["System.State"])}`}>
                                  {i["System.State"]}
                                </span>
                              </td>
                              <td style={{ fontSize: "0.78rem" }}>
                                {assigneeName(i["System.AssignedTo"])}
                              </td>
                              <td
                                style={{
                                  fontFamily: "var(--font-mono)",
                                  fontSize: "0.72rem",
                                  color: "var(--muted)",
                                }}
                              >
                                {fmtDate(i["System.ChangedDate"])}
                              </td>
                              <td>
                                <span
                                  style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.72rem",
                                    color: idle >= 3 ? "var(--warn)" : "var(--ok)",
                                  }}
                                >
                                  {idle >= 999 ? "—" : `${idle}d`}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}

            {/* ── STALE TICKETS ── */}
            {tab === "stale" && (
              <>
                <div className="page-title">Stale Tickets</div>
                <div className="page-sub">Items flagged by AI as inactive or at risk</div>
                {!Object.keys(aiAnalysis.staleMap || {}).length ? (
                  <div className="empty-state">
                    <div className="empty-icon">⚠</div>
                    <div className="empty-title">No stale flags yet</div>
                    <div className="empty-sub">Run AI Analysis from the Overview tab first</div>
                  </div>
                ) : (
                  <div className="scroll-fade">
                    <table className="ticket-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Title</th>
                          <th>Assignee</th>
                          <th>State</th>
                          <th>Days Idle</th>
                          <th>AI Reason</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items
                          .filter((i) => aiAnalysis.staleMap?.[i.id])
                          .map((i) => (
                            <tr key={i.id} className="stale">
                              <td>
                                <span
                                  style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.7rem",
                                    color: "var(--muted)",
                                  }}
                                >
                                  #{i.id}
                                </span>
                              </td>
                              <td style={{ fontWeight: 600 }}>{i["System.Title"]}</td>
                              <td style={{ fontSize: "0.78rem" }}>
                                {assigneeName(i["System.AssignedTo"])}
                              </td>
                              <td>
                                <span className={`badge ${getStatusBadge(i["System.State"])}`}>
                                  {i["System.State"]}
                                </span>
                              </td>
                              <td>
                                <span
                                  style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.72rem",
                                    color: "var(--warn)",
                                  }}
                                >
                                  {daysSince(i["System.ChangedDate"])}d
                                </span>
                              </td>
                              <td style={{ fontSize: "0.75rem", color: "var(--accent2)" }}>
                                {aiAnalysis.staleMap[i.id]}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}

            {/* ── AI INSIGHTS ── */}
            {tab === "ai" && (
              <>
                <div className="page-title">AI Insights</div>
                <div className="page-sub">Test point suggestions per incomplete ticket</div>
                {!Object.keys(aiAnalysis.testMap || {}).length ? (
                  <div className="empty-state">
                    <div className="empty-icon">✦</div>
                    <div className="empty-title">No AI insights yet</div>
                    <div className="empty-sub">
                      Run "Analyse Sprint with AI" from the Overview tab
                    </div>
                  </div>
                ) : (
                  <div className="scroll-fade">
                    {Object.values(aiAnalysis.testMap).map((t) => (
                      <div className="ai-card" key={t.id}>
                        <div className="ai-card-header">
                          <span className="ai-spark">✦</span>
                          <span className="ai-card-title">{t.title}</span>
                          <span className="ai-card-ticket">#{t.id}</span>
                        </div>
                        <div className="ai-content">
                          <strong
                            style={{
                              fontSize: "0.72rem",
                              color: "var(--muted)",
                              display: "block",
                              marginBottom: 6,
                              fontFamily: "var(--font-mono)",
                            }}
                          >
                            SUGGESTED TEST POINTS
                          </strong>
                          <ul>
                            {t.points.map((p, idx) => (
                              <li key={idx}>{p}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* ── FOLLOW-UP TICKETS ── */}
            {tab === "followup" && (
              <>
                <div className="page-title">Follow-up Tickets</div>
                <div className="page-sub">
                  AI-generated tickets for incomplete or blocked work — create directly in Azure
                  DevOps
                </div>
                {!followUps.length ? (
                  <div className="empty-state">
                    <div className="empty-icon">＋</div>
                    <div className="empty-title">No follow-up suggestions yet</div>
                    <div className="empty-sub">Run AI Analysis to generate follow-up tickets</div>
                  </div>
                ) : (
                  <div className="scroll-fade">
                    {followUps.map((t, i) => (
                      <div className="followup-card" key={i}>
                        <div className="followup-header">
                          <div>
                            <div className="followup-title">{t.title}</div>
                            <div className="followup-meta">
                              <span className="type-tag">{t.type}</span>
                              {t.linkedTo && (
                                <span style={{ marginLeft: 8, color: "var(--muted)" }}>
                                  linked to #{t.linkedTo}
                                </span>
                              )}
                            </div>
                          </div>
                          {t.created ? (
                            <span className="badge badge-done">Created</span>
                          ) : (
                            <button
                              className="btn-create"
                              onClick={() => createFollowUpTicket(t, i)}
                              disabled={creatingId === i}
                            >
                              {creatingId === i ? "Creating…" : "+ Create in ADO"}
                            </button>
                          )}
                        </div>
                        <div className="followup-desc">{t.description}</div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
    </>
  );
}
