import React, { useState, useRef, useEffect, Component } from "react";
import { useNavigate } from "react-router-dom";
import { useInterwovenKit } from "@initia/interwovenkit-react";

/* ─── Error Boundary ─── */
class ChatErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 48, textAlign: "center", fontFamily: "Inter, sans-serif" }}>
          <h2 style={{ fontSize: 18, marginBottom: 12 }}>Something went wrong</h2>
          <p style={{ fontSize: 14, color: "#555", marginBottom: 16 }}>{this.state.error.message}</p>
          <button onClick={() => {
            try { localStorage.removeItem("initfarm_conversations"); localStorage.removeItem("initfarm_active_convo"); } catch {}
            window.location.reload();
          }} style={{
            padding: "10px 24px", borderRadius: 8, border: "none",
            background: "#1A1A1A", color: "#fff", fontSize: 14, cursor: "pointer",
          }}>Reset &amp; Reload</button>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ─── Design Tokens (shared with App) ─── */
const T = {
  bg: "#FAFAF8",
  bgWarm: "#F5F3EE",
  card: "#FFFFFF",
  cardBorder: "rgba(0,0,0,0.06)",
  text: "#1A1A1A",
  textSoft: "#555555",
  textMuted: "#999999",
  accent: "#1A1A1A",
  green: "#22C55E",
  greenSoft: "#F0FDF4",
  greenBorder: "#BBF7D0",
  blue: "#3B82F6",
  purple: "#8B5CF6",
  orange: "#F97316",
  radius: 12,
};

/* ─── Icons ─── */
const ChatIcons = {
  send: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
  ),
  back: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
    </svg>
  ),
  plus: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 5v14" /><path d="M5 12h14" />
    </svg>
  ),
  chat: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  portfolio: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" />
    </svg>
  ),
  risk: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" />
    </svg>
  ),
  verify: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
    </svg>
  ),
  initia: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  sidebar: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18" />
    </svg>
  ),
};

/* Icon lookup for serialization-safe suggestions (string key → JSX) */
const ICON_MAP = {
  portfolio: ChatIcons.portfolio,
  risk: ChatIcons.risk,
  verify: ChatIcons.verify,
  initia: ChatIcons.initia,
};
function getIcon(key) { return ICON_MAP[key] || ChatIcons.portfolio; }

/* ─── IPS (Investment Policy Statement) Definition ─── */
const IPS_STEPS = [
  {
    step: 1,
    intro: "Welcome to initFarm. Before I build your portfolio, let's define your Investment Policy Statement (IPS). This helps me understand your goals and constraints.\n\nLet's start with the basics.",
    fields: [
      {
        key: "returnObjective",
        label: "Return Objective",
        description: "What annualized return range are you targeting?",
        options: [
          { value: 1, label: "Conservative", desc: "2% ~ 5% APY" },
          { value: 2, label: "Balanced", desc: "5% ~ 8% APY" },
          { value: 3, label: "Growth", desc: "8% ~ 11% APY" },
          { value: 4, label: "Aggressive", desc: "11% ~ 13% APY" },
        ],
      },
      {
        key: "maxDrawdown",
        label: "Max Drawdown Tolerance",
        description: "How much portfolio loss can you tolerate?",
        options: [
          { value: 1, label: "Very Low Risk", desc: "Up to -5%" },
          { value: 2, label: "Low Risk", desc: "Up to -10%" },
          { value: 3, label: "Medium Risk", desc: "Up to -20%" },
          { value: 4, label: "High Risk", desc: "Up to -35%" },
          { value: 5, label: "Very High Risk", desc: "Up to -50%" },
        ],
      },
      {
        key: "timeHorizon",
        label: "Investment Time Horizon",
        description: "How long do you plan to stay invested?",
        options: [
          { value: 1, label: "Short-term", desc: "0 ~ 3 months" },
          { value: 2, label: "Medium-term", desc: "3 ~ 12 months" },
          { value: 3, label: "Long-term", desc: "1+ year" },
        ],
      },
      {
        key: "lockup",
        label: "Lock-up Tolerance",
        description: "Are you okay with funds being locked for a period?",
        options: [
          { value: 1, label: "No Lock-up", desc: "Instant withdrawal only" },
          { value: 2, label: "Short", desc: "Up to 7 days" },
          { value: 3, label: "Medium", desc: "Up to 30 days" },
          { value: 4, label: "Long", desc: "30+ days" },
        ],
      },
    ],
  },
  {
    step: 2,
    intro: "Great choices. Now let's define your allocation preferences and strategy mix.",
    fields: [
      {
        key: "stablecoinWeight",
        label: "Stablecoin Allocation",
        description: "What portion of your portfolio should be in stablecoins?",
        options: [
          { value: 1, label: "Capital Preservation", desc: "70% ~ 100% stablecoins" },
          { value: 2, label: "Balanced", desc: "40% ~ 70% stablecoins" },
          { value: 3, label: "Growth", desc: "10% ~ 40% stablecoins" },
          { value: 4, label: "Aggressive", desc: "Less than 10% stablecoins" },
        ],
      },
    ],
    strategyField: {
      key: "strategyPreference",
      label: "Strategy Preference",
      description: "Set your preferred exposure level for each strategy type.",
      strategies: [
        { key: "staking", label: "Staking" },
        { key: "lending", label: "Lending" },
        { key: "lp", label: "Liquidity Providing" },
        { key: "farming", label: "Yield Farming" },
        { key: "deltaNeutral", label: "Delta-Neutral" },
      ],
      levels: ["Off", "Low", "Medium", "High"],
    },
  },
  {
    step: 3,
    intro: "Almost there. Now let's fine-tune your risk profile across three key dimensions.",
    fields: [
      {
        key: "smartContractRisk",
        label: "Smart Contract Risk",
        description: "Which protocol tiers are you comfortable with?",
        options: [
          { value: 1, label: "Very Conservative", desc: "Audited, top protocols only" },
          { value: 2, label: "Conservative", desc: "Top-tier protocols only" },
          { value: 3, label: "Moderate", desc: "Mid-tier protocols allowed" },
          { value: 4, label: "Aggressive", desc: "New protocols allowed" },
        ],
      },
      {
        key: "tokenVolatility",
        label: "Token Volatility",
        description: "What level of token price volatility is acceptable?",
        options: [
          { value: 1, label: "Stablecoins Only", desc: "No volatile asset exposure" },
          { value: 2, label: "Low Volatility", desc: "BTC/ETH focused" },
          { value: 3, label: "Medium", desc: "Large cap alts included" },
          { value: 4, label: "High", desc: "Small cap tokens included" },
        ],
      },
      {
        key: "liquidityRisk",
        label: "Liquidity Risk",
        description: "How important is instant access to your funds?",
        options: [
          { value: 1, label: "Instant Only", desc: "Must have instant liquidity" },
          { value: 2, label: "Minor Lock-up", desc: "Short delays acceptable" },
          { value: 3, label: "Moderate Lock-up", desc: "Moderate delays acceptable" },
          { value: 4, label: "Illiquid OK", desc: "Illiquid strategies allowed" },
        ],
      },
    ],
  },
  {
    step: 4,
    intro: "Final step. How would you like the portfolio to be managed over time?",
    fields: [
      {
        key: "rebalancing",
        label: "Rebalancing Preference",
        description: "How frequently should the portfolio be rebalanced?",
        options: [
          { value: 1, label: "Passive", desc: "No rebalancing" },
          { value: 2, label: "Monthly", desc: "Rebalance once per month" },
          { value: 3, label: "Bi-weekly", desc: "Rebalance every two weeks" },
          { value: 4, label: "Weekly", desc: "Rebalance every week" },
          { value: 5, label: "Dynamic", desc: "AI auto-rebalancing" },
        ],
      },
    ],
  },
];

/* ─── IPS Dropdown Component ─── */
function IPSDropdown({ field, value, onChange }) {
  const [open, setOpen] = useState(false);
  const selected = field.options.find((o) => o.value === value);

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 4 }}>{field.label}</div>
      <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 8 }}>{field.description}</div>
      <div style={{ position: "relative" }}>
        <button onClick={() => setOpen(!open)} style={{
          width: "100%", padding: "10px 14px", borderRadius: 10,
          border: `1px solid ${value ? T.green : T.cardBorder}`,
          background: value ? "rgba(34,197,94,0.04)" : T.bgWarm,
          cursor: "pointer", fontFamily: "inherit",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          transition: "all 0.15s ease",
        }}>
          <span style={{ fontSize: 13, color: selected ? T.text : T.textMuted, fontWeight: selected ? 500 : 400 }}>
            {selected ? `${selected.label} — ${selected.desc}` : "Select..."}
          </span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.textMuted} strokeWidth="2" strokeLinecap="round"
            style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.15s ease" }}>
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        {open && (
          <>
            <div style={{ position: "fixed", inset: 0, zIndex: 10 }} onClick={() => setOpen(false)} />
            <div style={{
              position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
              background: T.card, border: `1px solid ${T.cardBorder}`, borderRadius: 10,
              boxShadow: "0 8px 24px rgba(0,0,0,0.1)", zIndex: 11, overflow: "hidden",
            }}>
              {field.options.map((o) => (
                <button key={o.value} onClick={() => { onChange(o.value); setOpen(false); }}
                  style={{
                    width: "100%", padding: "10px 14px",
                    background: o.value === value ? "rgba(34,197,94,0.06)" : "transparent",
                    border: "none", cursor: "pointer", fontFamily: "inherit",
                    textAlign: "left", display: "flex", alignItems: "center", gap: 10,
                    transition: "background 0.1s ease",
                  }}
                  onMouseEnter={(e) => { if (o.value !== value) e.currentTarget.style.background = T.bgWarm; }}
                  onMouseLeave={(e) => { if (o.value !== value) e.currentTarget.style.background = "transparent"; }}
                >
                  <div style={{
                    width: 16, height: 16, borderRadius: "50%",
                    border: o.value === value ? `5px solid ${T.green}` : `1.5px solid ${T.textMuted}`,
                    flexShrink: 0, transition: "all 0.1s ease",
                  }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: T.text }}>{o.label}</div>
                    <div style={{ fontSize: 11, color: T.textMuted }}>{o.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── IPS Strategy Multi-Select Component ─── */
function IPSStrategySelect({ config, values, onChange }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 4 }}>{config.label}</div>
      <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 10 }}>{config.description}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {config.strategies.map((s) => {
          const current = values[s.key] || 0;
          return (
            <div key={s.key} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "8px 12px", borderRadius: 8,
              background: current > 0 ? "rgba(34,197,94,0.04)" : T.bgWarm,
              border: `1px solid ${current > 0 ? "rgba(34,197,94,0.15)" : T.cardBorder}`,
              transition: "all 0.15s ease",
            }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: T.text, width: 130, flexShrink: 0 }}>{s.label}</div>
              <div style={{ display: "flex", gap: 4, flex: 1 }}>
                {config.levels.map((lvl, idx) => (
                  <button key={lvl} onClick={() => onChange(s.key, idx)}
                    style={{
                      flex: 1, padding: "5px 0", borderRadius: 6, fontSize: 11, fontWeight: 500,
                      border: current === idx ? "none" : `1px solid ${T.cardBorder}`,
                      background: current === idx
                        ? idx === 0 ? T.textMuted : idx === 1 ? "#3B82F6" : idx === 2 ? T.orange : T.green
                        : "transparent",
                      color: current === idx ? "#fff" : T.textMuted,
                      cursor: "pointer", fontFamily: "inherit",
                      transition: "all 0.12s ease",
                    }}
                  >{lvl}</button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── IPS Dropdown (disabled version for submitted steps) ─── */
function IPSDropdownDisabled({ field, value }) {
  const selected = field.options.find((o) => o.value === value);
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 4 }}>{field.label}</div>
      <div style={{
        padding: "9px 14px", borderRadius: 10,
        border: `1px solid rgba(34,197,94,0.2)`,
        background: "rgba(34,197,94,0.04)",
        fontSize: 13, color: T.text, fontWeight: 500,
        opacity: 0.85,
      }}>
        {selected ? `${selected.label} — ${selected.desc}` : "—"}
      </div>
    </div>
  );
}

/* ─── IPS Strategy Disabled ─── */
function IPSStrategyDisabled({ config, values }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 8 }}>{config.label}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {config.strategies.map((s) => {
          const current = values[s.key] || 0;
          return (
            <div key={s.key} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "6px 12px", borderRadius: 8,
              background: "rgba(34,197,94,0.04)",
              border: `1px solid rgba(34,197,94,0.12)`,
              opacity: 0.85,
            }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: T.text, width: 130, flexShrink: 0 }}>{s.label}</div>
              <div style={{ display: "flex", gap: 4, flex: 1 }}>
                {config.levels.map((lvl, idx) => (
                  <div key={lvl} style={{
                    flex: 1, padding: "4px 0", borderRadius: 6, fontSize: 10, fontWeight: 500,
                    textAlign: "center",
                    background: current === idx
                      ? idx === 0 ? T.textMuted : idx === 1 ? "#3B82F6" : idx === 2 ? T.orange : T.green
                      : "transparent",
                    color: current === idx ? "#fff" : "rgba(0,0,0,0.15)",
                    border: current === idx ? "none" : `1px solid rgba(0,0,0,0.04)`,
                  }}>{lvl}</div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── IPS Form Message (rendered inside chat) ─── */
function IPSFormMessage({ stepData, ipsValues, onFieldChange, onStrategyChange, onSubmit, disabled }) {
  const allDropdownsFilled = stepData.fields.every((f) => ipsValues[f.key] !== undefined && ipsValues[f.key] !== null);
  const strategyFilled = !stepData.strategyField || Object.keys(ipsValues.strategyPreference || {}).length === stepData.strategyField.strategies.length;
  const allFilled = allDropdownsFilled && strategyFilled;

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div style={{
          width: 32, height: 32, borderRadius: 10, flexShrink: 0,
          background: T.accent, display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, color: "#fff", fontWeight: 700, marginTop: 2,
        }}>iF</div>
        <div style={{
          maxWidth: "85%",
          background: T.card,
          borderRadius: "18px 18px 18px 4px",
          padding: "18px 20px",
          border: `1px solid ${T.cardBorder}`,
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}>
          {/* Step intro text */}
          <div style={{ fontSize: 14, lineHeight: 1.75, color: T.text, whiteSpace: "pre-wrap", marginBottom: 20 }}>
            {stepData.intro}
          </div>

          {/* Step indicator */}
          <div style={{
            display: "flex", alignItems: "center", gap: 6, marginBottom: 18,
            padding: "6px 10px", borderRadius: 8, background: T.bgWarm, width: "fit-content",
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: T.accent }}>STEP {stepData.step}</span>
            <span style={{ fontSize: 11, color: T.textMuted }}>of 4</span>
            <div style={{ display: "flex", gap: 3, marginLeft: 4 }}>
              {[1,2,3,4].map((s) => (
                <div key={s} style={{
                  width: 16, height: 3, borderRadius: 2,
                  background: s <= stepData.step ? T.accent : "rgba(0,0,0,0.08)",
                }} />
              ))}
            </div>
          </div>

          {/* Disabled state — show locked selections */}
          {disabled ? (
            <>
              {stepData.fields.map((f) => (
                <IPSDropdownDisabled key={f.key} field={f} value={ipsValues[f.key]} />
              ))}
              {stepData.strategyField && (
                <IPSStrategyDisabled config={stepData.strategyField} values={ipsValues.strategyPreference || {}} />
              )}
              <div style={{
                fontSize: 12, color: T.green, fontWeight: 500, marginTop: 4,
                display: "flex", alignItems: "center", gap: 5,
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={T.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                Submitted
              </div>
            </>
          ) : (
            <>
              {stepData.fields.map((f) => (
                <IPSDropdown key={f.key} field={f} value={ipsValues[f.key]} onChange={(v) => onFieldChange(f.key, v)} />
              ))}
              {stepData.strategyField && (
                <IPSStrategySelect
                  config={stepData.strategyField}
                  values={ipsValues.strategyPreference || {}}
                  onChange={onStrategyChange}
                />
              )}
              {allFilled && (
                <button onClick={onSubmit} style={{
                  width: "100%", padding: "12px", borderRadius: 10, marginTop: 4,
                  border: "none", background: T.accent, color: "#fff",
                  fontSize: 14, fontWeight: 600, cursor: "pointer",
                  fontFamily: "inherit", transition: "all 0.15s ease",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#333"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = T.accent; }}
                >
                  {stepData.step < 4 ? "Continue" : "Generate Portfolio"}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </>
          )}
        </div>
      </div>
      <TokenUsageTag usage={estimateTokenUsage(stepData.fields.length * 80 + (stepData.strategyField ? 200 : 0))} />
    </div>
  );
}

/* ─── Generate IPS summary for user message ─── */
function ipsStepSummary(stepData, ipsValues) {
  const lines = [];
  for (const f of stepData.fields) {
    const sel = f.options.find((o) => o.value === ipsValues[f.key]);
    if (sel) lines.push(`${f.label}: ${sel.label} (${sel.desc})`);
  }
  if (stepData.strategyField) {
    const strats = ipsValues.strategyPreference || {};
    const lvls = stepData.strategyField.levels;
    const parts = stepData.strategyField.strategies.map((s) => `${s.label}: ${lvls[strats[s.key] || 0]}`);
    lines.push(`Strategy: ${parts.join(", ")}`);
  }
  return lines.join("\n");
}

/* ─── Portfolio color palette ─── */
const PORTFOLIO_COLORS = ["#1A1A1A", "#22C55E", "#3B82F6", "#F97316", "#8B5CF6", "#EC4899"];

/* ─── Generate portfolio recommendation from IPS (structured) ─── */
function generateIPSPortfolio(ipsValues) {
  const ret = ipsValues.returnObjective || 1;
  const dd = ipsValues.maxDrawdown || 1;
  const stable = ipsValues.stablecoinWeight || 1;
  const scRisk = ipsValues.smartContractRisk || 1;
  const vol = ipsValues.tokenVolatility || 1;
  const rebal = ipsValues.rebalancing || 1;
  const rebalLabels = ["Passive", "Monthly", "Bi-weekly", "Weekly", "Dynamic (AI)"];

  if (ret <= 2 && dd <= 2) {
    return {
      type: "conservative",
      subtitle: "Conservative portfolio optimized for capital preservation with steady yield generation.",
      items: [
        { name: "Lido ETH Staking", weight: 30, apy: 2.31, grade: "A", note: "Highest liquidity, no lock-up" },
        { name: "Sky USD Fee Sharing", weight: 30, apy: 3.65, grade: "A", note: "Revenue-backed stablecoin yield" },
        { name: "Aave ETH Lending", weight: 25, apy: 1.82, grade: "B", note: "No lock-up, fully revenue-backed" },
        { name: "Binance ETH Staking", weight: 15, apy: 2.38, grade: "A", note: "Institutional-grade, high liquidity" },
      ],
      summary: {
        blendedApy: "2.62%",
        riskGrade: "A",
        stablecoinExposure: stable <= 2 ? "High" : "Moderate",
        maxDrawdown: "-3.5%",
        rebalancing: rebalLabels[rebal - 1],
      },
      footer: "All yields independently verified via initFarm's on-chain decomposition engine.",
    };
  }

  if (ret >= 3 || dd >= 3) {
    return {
      type: "aggressive",
      subtitle: "Growth-oriented portfolio balancing yield opportunity with managed risk.",
      items: [
        { name: "Solana Staking", weight: 20, apy: 5.80, grade: "B", note: "Strong ecosystem momentum" },
        { name: "Celestia Staking", weight: 15, apy: 7.80, grade: "C", note: "High yield, modular DA layer" },
        { name: "Lido ETH Staking", weight: 20, apy: 2.31, grade: "A", note: "Portfolio anchor, deepest liquidity" },
        { name: "Ethena USDe Yield", weight: 15, apy: 2.90, grade: "B", note: "Delta-neutral strategy" },
        { name: "Sky USD Fee Sharing", weight: 15, apy: 3.65, grade: "A", note: "Stablecoin stability" },
        { name: "EtherFi ETH Staking", weight: 15, apy: 2.10, grade: "B", note: "Liquid restaking" },
      ],
      summary: {
        blendedApy: "4.26%",
        riskGrade: "B+",
        stablecoinExposure: stable <= 2 ? "Moderate" : "Low",
        maxDrawdown: "-12%",
        rebalancing: rebalLabels[rebal - 1],
        smartContractRisk: scRisk <= 2 ? "Conservative (Top-tier only)" : "Moderate (Mid-tier included)",
        tokenVolatility: vol <= 2 ? "Low (Majors only)" : "Medium-High",
      },
      warning: "Celestia's nominal APY (14.2%) includes 6.4% inflation premium. The verified 7.80% reflects actual purchasing-power returns.",
      footer: "All allocations backed by initFarm's multi-factor risk model and on-chain yield verification.",
    };
  }

  return {
    type: "balanced",
    subtitle: "Balanced portfolio matching your risk-return preferences.",
    items: [
      { name: "Lido ETH Staking", weight: 25, apy: 2.31, grade: "A", note: "Deepest liquidity" },
      { name: "Sky USD Fee Sharing", weight: 20, apy: 3.65, grade: "A", note: "Stablecoin stability" },
      { name: "Solana Staking", weight: 20, apy: 5.80, grade: "B", note: "Ecosystem growth" },
      { name: "Aave ETH Lending", weight: 15, apy: 1.82, grade: "B", note: "Revenue-backed" },
      { name: "Ethena USDe Yield", weight: 10, apy: 2.90, grade: "B", note: "Delta-neutral" },
      { name: "EtherFi ETH Staking", weight: 10, apy: 2.10, grade: "B", note: "Liquid restaking" },
    ],
    summary: {
      blendedApy: "3.18%",
      riskGrade: "B+",
      stablecoinExposure: "Balanced",
      maxDrawdown: "-8%",
      rebalancing: rebalLabels[rebal - 1],
    },
    footer: "All yields independently verified. Portfolio balances stability with growth across verified protocols.",
  };
}

/* ─── SVG Pie Chart (pure component, no external deps) ─── */
function PieChart({ items, size = 180 }) {
  const cx = size / 2, cy = size / 2, r = size / 2 - 4;
  let cumAngle = -90; // start from top

  const slices = items.map((item, i) => {
    const angle = (item.weight / 100) * 360;
    const startAngle = cumAngle;
    const endAngle = cumAngle + angle;
    cumAngle = endAngle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);
    const largeArc = angle > 180 ? 1 : 0;

    const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    return (
      <path key={i} d={d} fill={PORTFOLIO_COLORS[i % PORTFOLIO_COLORS.length]}
        stroke="#FAFAF8" strokeWidth="2" />
    );
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {slices}
    </svg>
  );
}

/* ─── Portfolio Chart Message ─── */
function PortfolioChartMessage({ data, onNewIPS, onApply, walletConnected }) {
  if (!data || !data.items) return null;
  const { subtitle, items, summary, warning, footer } = data;
  const gradeColors = { A: "#22C55E", "B+": "#84CC16", B: "#3B82F6", C: "#F97316" };

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        {/* Avatar */}
        <div style={{
          width: 32, height: 32, borderRadius: 10, flexShrink: 0,
          background: T.accent, display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, color: "#fff", fontWeight: 700, marginTop: 2,
        }}>iF</div>

        {/* Card */}
        <div style={{
          maxWidth: "85%", flex: 1,
          background: T.card, borderRadius: 18,
          border: `1px solid ${T.cardBorder}`,
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          overflow: "hidden",
        }}>
          {/* Header */}
          <div style={{
            padding: "16px 20px 12px",
            borderBottom: `1px solid ${T.cardBorder}`,
          }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 4 }}>
              Investment Policy Statement — Analysis Complete
            </div>
            <div style={{ fontSize: 13, color: T.textSoft, lineHeight: 1.5 }}>{subtitle}</div>
          </div>

          {/* Pie + Legend */}
          <div style={{
            padding: "20px 20px 16px",
            display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap",
          }}>
            <PieChart items={items} size={160} />
            <div style={{ flex: 1, minWidth: 180 }}>
              {items.map((item, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  marginBottom: i < items.length - 1 ? 8 : 0,
                }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: 3, flexShrink: 0,
                    background: PORTFOLIO_COLORS[i % PORTFOLIO_COLORS.length],
                  }} />
                  <span style={{ fontSize: 13, color: T.text, flex: 1 }}>{item.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{item.weight}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Detail rows */}
          <div style={{ padding: "0 20px 16px" }}>
            {items.map((item, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 12px",
                borderRadius: 10,
                background: i % 2 === 0 ? T.bgWarm : "transparent",
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: 2,
                  background: PORTFOLIO_COLORS[i % PORTFOLIO_COLORS.length], flexShrink: 0,
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{item.name}</div>
                  <div style={{ fontSize: 11, color: T.textMuted }}>{item.note}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.green }}>{item.apy}% APY</div>
                  <div style={{
                    fontSize: 11, fontWeight: 600,
                    color: gradeColors[item.grade] || T.textSoft,
                  }}>Grade {item.grade}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div style={{
            margin: "0 20px", padding: "14px 16px",
            background: T.bgWarm, borderRadius: 12,
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 24px",
          }}>
            <SummaryRow label="Blended APY" value={summary.blendedApy} highlight />
            <SummaryRow label="Risk Grade" value={summary.riskGrade} />
            <SummaryRow label="Stablecoin Exposure" value={summary.stablecoinExposure} />
            <SummaryRow label="Max Drawdown" value={summary.maxDrawdown} />
            <SummaryRow label="Rebalancing" value={summary.rebalancing} />
            {summary.smartContractRisk && <SummaryRow label="Smart Contract Risk" value={summary.smartContractRisk} />}
            {summary.tokenVolatility && <SummaryRow label="Token Volatility" value={summary.tokenVolatility} />}
          </div>

          {/* Warning */}
          {warning && (
            <div style={{
              margin: "12px 20px 0", padding: "10px 14px",
              background: "#FFFBEB", borderRadius: 10,
              border: "1px solid #FDE68A",
              fontSize: 12, color: "#92400E", lineHeight: 1.5,
            }}>
              <span style={{ fontWeight: 600 }}>Risk Delta Warning: </span>{warning}
            </div>
          )}

          {/* Footer */}
          <div style={{
            padding: "14px 20px 0",
            fontSize: 12, color: T.textMuted, lineHeight: 1.5,
          }}>
            {footer}
          </div>

          {/* Action buttons */}
          {(onNewIPS || onApply) && (
            <div style={{
              padding: "12px 20px 16px",
              display: "flex", gap: 10, flexWrap: "wrap",
            }}>
              {onNewIPS && (
                <button onClick={onNewIPS}
                  onMouseEnter={(e) => { e.currentTarget.style.background = T.bgWarm; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = T.card; }}
                  style={{
                    flex: 1, minWidth: 160, padding: "12px 16px",
                    borderRadius: 10, border: `1px solid ${T.cardBorder}`,
                    background: T.card, cursor: "pointer", fontFamily: "inherit",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    fontSize: 13, fontWeight: 600, color: T.text,
                    transition: "all 0.15s ease",
                  }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
                  Generate New IPS
                </button>
              )}
              {onApply && (
                <button onClick={onApply}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
                  style={{
                    flex: 1, minWidth: 160, padding: "12px 16px",
                    borderRadius: 10, border: "none",
                    background: T.accent, cursor: "pointer", fontFamily: "inherit",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    fontSize: 13, fontWeight: 600, color: "#fff",
                    transition: "all 0.15s ease",
                  }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  {walletConnected ? "Apply to Portfolio" : "Connect Wallet & Apply"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <TokenUsageTag usage={estimateTokenUsage(items.length * 120 + 300)} />
    </div>
  );
}

function SummaryRow({ label, value, highlight }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 2 }}>{label}</div>
      <div style={{
        fontSize: 13, fontWeight: 600,
        color: highlight ? T.green : T.text,
      }}>{value}</div>
    </div>
  );
}

/* ─── Contract constants ─── */
const VAULT_HEX = "0x070bac898a36d6e48824bf0223ff9ee5068a6956";
const VAULT_BECH32 = "init1qu96ezv2xmtwfzpyhupz8lu7u5rg562kns6kju";

/* ─── BCS encoding helpers ─── */
function bcsAddress(hexAddr) {
  const hex = hexAddr.replace(/^0x/, "").padStart(64, "0");
  const bytes = new Uint8Array(32);
  for (let i = 0; i < 32; i++) bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return bytes;
}
function bcsU64(num) {
  const bytes = new Uint8Array(8);
  let n = BigInt(num);
  for (let i = 0; i < 8; i++) { bytes[i] = Number(n & 0xffn); n >>= 8n; }
  return bytes;
}

/* ─── Deposit Form Message ─── */
function DepositFormMessage({ portfolioData, onConfirm, onCancel, walletConnected }) {
  const [amount, setAmount] = React.useState("");
  const [period, setPeriod] = React.useState(12); // months

  const numAmount = parseFloat(amount) || 0;
  const apyNum = parseFloat(portfolioData?.summary?.blendedApy) || 0;
  const apyRate = apyNum / 100;

  const projections = [
    { label: "1 Month", months: 1 },
    { label: "3 Months", months: 3 },
    { label: "6 Months", months: 6 },
    { label: "1 Year", months: 12 },
  ];

  const presets = [0.1, 0.5, 1, 5];

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div style={{
          width: 32, height: 32, borderRadius: 10, flexShrink: 0,
          background: T.accent, display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, color: "#fff", fontWeight: 700, marginTop: 2,
        }}>iF</div>

        <div style={{
          maxWidth: "85%", flex: 1,
          background: T.card, borderRadius: 18,
          border: `1px solid ${T.cardBorder}`,
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          overflow: "hidden",
        }}>
          {/* Header */}
          <div style={{ padding: "16px 20px 12px", borderBottom: `1px solid ${T.cardBorder}` }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 4 }}>
              Deposit to initFarm Vault
            </div>
            <div style={{ fontSize: 13, color: T.textSoft, lineHeight: 1.5 }}>
              Enter the amount of INIT to deposit. Your funds will be allocated according to the recommended portfolio.
            </div>
          </div>

          {/* Amount input */}
          <div style={{ padding: "16px 20px" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: T.textSoft, marginBottom: 8 }}>Deposit Amount</div>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              border: `2px solid ${numAmount > 0 ? T.green : T.cardBorder}`,
              borderRadius: 10, padding: "10px 14px",
              transition: "border-color 0.15s ease",
            }}>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                style={{
                  flex: 1, border: "none", outline: "none", background: "transparent",
                  fontSize: 20, fontWeight: 700, color: T.text, fontFamily: "inherit",
                  width: "100%",
                }}
                min="0"
                step="0.1"
              />
              <span style={{ fontSize: 14, fontWeight: 600, color: T.textMuted }}>INIT</span>
            </div>

            {/* Preset buttons */}
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              {presets.map((p) => (
                <button key={p} onClick={() => setAmount(String(p))}
                  style={{
                    flex: 1, padding: "6px 0", borderRadius: 8,
                    border: `1px solid ${parseFloat(amount) === p ? T.green : T.cardBorder}`,
                    background: parseFloat(amount) === p ? T.greenSoft : "transparent",
                    cursor: "pointer", fontSize: 12, fontWeight: 600,
                    color: parseFloat(amount) === p ? T.green : T.textSoft,
                    fontFamily: "inherit", transition: "all 0.15s ease",
                  }}>
                  {p} INIT
                </button>
              ))}
            </div>
          </div>

          {/* Projected Earnings */}
          {numAmount > 0 && (
            <div style={{ padding: "0 20px 16px" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: T.textSoft, marginBottom: 10 }}>
                Projected Earnings (Blended APY: {portfolioData.summary.blendedApy})
              </div>
              <div style={{
                borderRadius: 10, overflow: "hidden",
                border: `1px solid ${T.cardBorder}`,
              }}>
                {projections.map((p, i) => {
                  const earned = numAmount * apyRate * (p.months / 12);
                  const total = numAmount + earned;
                  return (
                    <div key={p.months} style={{
                      display: "flex", alignItems: "center", padding: "10px 14px",
                      background: i % 2 === 0 ? T.bgWarm : "transparent",
                      borderBottom: i < projections.length - 1 ? `1px solid ${T.cardBorder}` : "none",
                    }}>
                      <div style={{ flex: 1, fontSize: 13, color: T.text }}>{p.label}</div>
                      <div style={{ textAlign: "right" }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: T.green }}>
                          +{earned.toFixed(4)} INIT
                        </span>
                        <span style={{ fontSize: 11, color: T.textMuted, marginLeft: 8 }}>
                          ({total.toFixed(4)} total)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Portfolio breakdown */}
              <div style={{
                marginTop: 12, padding: "12px 14px",
                background: T.bgWarm, borderRadius: 10,
              }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: T.textSoft, marginBottom: 8 }}>
                  Allocation Breakdown
                </div>
                {portfolioData.items.map((item, i) => {
                  const alloc = numAmount * (item.weight / 100);
                  return (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: 8, marginBottom: 4,
                    }}>
                      <div style={{
                        width: 8, height: 8, borderRadius: 2,
                        background: PORTFOLIO_COLORS[i % PORTFOLIO_COLORS.length], flexShrink: 0,
                      }} />
                      <span style={{ flex: 1, fontSize: 12, color: T.text }}>{item.name}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: T.text }}>
                        {alloc.toFixed(4)} INIT ({item.weight}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div style={{
            padding: "12px 20px 16px",
            display: "flex", gap: 10,
          }}>
            <button onClick={onCancel}
              onMouseEnter={(e) => { e.currentTarget.style.background = T.bgWarm; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = T.card; }}
              style={{
                flex: 1, padding: "12px 16px", borderRadius: 10,
                border: `1px solid ${T.cardBorder}`, background: T.card,
                cursor: "pointer", fontFamily: "inherit",
                fontSize: 13, fontWeight: 600, color: T.textSoft,
                transition: "all 0.15s ease",
              }}>
              Cancel
            </button>
            <button
              onClick={() => numAmount > 0 && onConfirm(numAmount)}
              disabled={numAmount <= 0}
              onMouseEnter={(e) => { if (numAmount > 0) e.currentTarget.style.opacity = "0.85"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
              style={{
                flex: 2, padding: "12px 16px", borderRadius: 10,
                border: "none", background: numAmount > 0 ? T.green : T.cardBorder,
                cursor: numAmount > 0 ? "pointer" : "not-allowed", fontFamily: "inherit",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                fontSize: 13, fontWeight: 600, color: "#fff",
                transition: "all 0.15s ease",
              }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              {numAmount > 0
                ? (walletConnected ? `Deposit ${numAmount} INIT` : `Connect Wallet & Deposit ${numAmount} INIT`)
                : "Enter Amount"}
            </button>
          </div>
        </div>
      </div>
      <TokenUsageTag usage={estimateTokenUsage(350)} />
    </div>
  );
}

/* ─── Scenario Data ─── */
const SCENARIOS = {
  welcome: {
    message: null,
    suggestions: [
      { id: "portfolio", icon: "portfolio", label: "Build me a yield farming portfolio", description: "AI-optimized allocation based on your risk profile" },
      { id: "risk", icon: "risk", label: "Run a protocol risk assessment", description: "multi-factor on-chain risk analysis" },
      { id: "verify", icon: "verify", label: "Verify APY for a protocol", description: "Compare advertised vs. real yield" },
      { id: "initia", icon: "initia", label: "Explore Initia staking", description: "Yields, lock-ups, and ecosystem opportunities" },
    ],
  },
  portfolio: {
    message: `I'll construct a diversified portfolio based on verified on-chain data. Let me analyze current opportunities across risk tiers.

Scanning 9 verified pools across 6 protocols...

Recommended Portfolio Allocation

Conservative Tier (60%)
  Lido ETH Staking - 25% weight
  Verified APY: 2.31% | Risk Grade: A
  $19.6B TVL, highest liquidity in DeFi

  Sky USD Fee Sharing - 20% weight
  Verified APY: 3.65% | Risk Grade: A
  Revenue-backed yield, strong coverage ratio

  Aave ETH Lending - 15% weight
  Verified APY: 1.82% | Risk Grade: B
  Battle-tested lending protocol, no lock-up

Growth Tier (30%)
  Solana Staking - 15% weight
  Verified APY: 5.80% | Risk Grade: B
  $12.4B TVL, 3-day unbonding period

  Ethena USDe Yield - 15% weight
  Verified APY: 2.90% | Risk Grade: B
  Delta-neutral strategy, novel but growing

High-Yield Tier (10%)
  Celestia Staking - 10% weight
  Verified APY: 7.80% | Risk Grade: C
  Higher risk premium, 21-day unbonding

Portfolio Summary
  Blended APY: ~3.68% (verified, after fees)
  Weighted Risk Score: B+
  Avg Lock-up: 8 days
  Risk Delta: 1.2% (advertised rates exceed verified by this margin on average)

All APYs are independently verified using initFarm's decomposition engine. The risk premium (delta between nominal and verified APY) is factored into the allocation weights.`,
    suggestions: [
      { id: "risk", icon: "risk", label: "Deep-dive into risk factors", description: "See the multi-factor breakdown for any protocol" },
      { id: "portfolio_aggressive", icon: "portfolio", label: "Show me a more aggressive portfolio", description: "Higher yield, higher risk tolerance" },
      { id: "verify", icon: "verify", label: "Verify a specific pool's APY", description: "Pick any pool for detailed analysis" },
    ],
  },
  portfolio_aggressive: {
    message: `Shifting allocation toward higher-yield opportunities with increased risk tolerance.

Aggressive Portfolio Allocation

Growth Tier (50%)
  Solana Staking - 20% weight
  Verified APY: 5.80% | Risk Grade: B
  Strong ecosystem momentum, moderate lock-up

  Ethena USDe Yield - 15% weight
  Verified APY: 2.90% | Risk Grade: B
  Delta-neutral, growing TVL at $3.5B

  EtherFi ETH Staking - 15% weight
  Verified APY: 2.10% | Risk Grade: B
  Liquid restaking, weETH token utility

High-Yield Tier (35%)
  Celestia Staking - 20% weight
  Verified APY: 7.80% | Risk Grade: C
  Modular DA layer, strong narrative

  Polkadot Staking - 15% weight
  Verified APY: 5.50% | Risk Grade: C
  Note: Nominal 12% includes significant inflation premium
  Risk Delta: 6.5% - highest in our coverage

Stable Anchor (15%)
  Sky USD Fee Sharing - 15% weight
  Verified APY: 3.65% | Risk Grade: A
  Stablecoin exposure for portfolio stability

Portfolio Summary
  Blended APY: ~4.92% (verified)
  Weighted Risk Score: B-
  Avg Lock-up: 14 days
  Max Drawdown Risk: Moderate-High

Warning: Polkadot's risk delta of 6.5% indicates the largest gap between advertised and verified APY. The 12% nominal rate includes ~6.5% in token inflation that dilutes real returns.`,
    suggestions: [
      { id: "portfolio", icon: "portfolio", label: "Back to conservative portfolio", description: "Lower risk, stable returns" },
      { id: "risk_dot", icon: "risk", label: "Why is Polkadot's risk delta so high?", description: "Deep dive into DOT inflation dynamics" },
      { id: "initia", icon: "initia", label: "Add Initia staking to portfolio", description: "Explore Initia ecosystem yields" },
    ],
  },
  risk: {
    message: `Running multi-factor risk analysis across all verified protocols...

Protocol Risk Assessment - 6 Factor Model

Lido ETH Staking (Grade: A)
  TVL Stability:        9.2/10  $19.6B, +3% trend, low concentration
  APY Consistency:      9.0/10  30d sigma: 0.12%, highly stable
  Revenue Coverage:     8.8/10  Fee revenue covers 92% of yield
  Whale Concentration:  7.5/10  Top 10 wallets hold 18% - moderate
  Token Price Trend:    8.5/10  stETH/ETH peg: 0.9998, minimal deviation
  Lock-up Risk:         9.5/10  Liquid staking, no lock-up period
  Composite Score: 8.75/10

Sky USD Fee Sharing (Grade: A)
  TVL Stability:        8.8/10  $5.5B, steady inflows
  APY Consistency:      8.5/10  Fee-based, predictable revenue
  Revenue Coverage:     9.2/10  Fully revenue-backed yield
  Whale Concentration:  7.0/10  Some large holders present
  Token Price Trend:    9.0/10  USD-pegged, minimal volatility
  Lock-up Risk:         8.5/10  Short withdrawal period
  Composite Score: 8.50/10

Polkadot Staking (Grade: C)
  TVL Stability:        6.5/10  $4.8B but declining 90d trend
  APY Consistency:      5.0/10  High variance from inflation adjustments
  Revenue Coverage:     3.5/10  Most yield from inflation, not revenue
  Whale Concentration:  6.0/10  Validator concentration concerns
  Token Price Trend:    4.5/10  -15% over 90d, high daily volatility
  Lock-up Risk:         4.0/10  28-day unbonding period
  Composite Score: 4.92/10

Risk Delta Analysis
  Protocol with lowest delta: Aave ETH (0.00% - fully verifiable)
  Protocol with highest delta: Polkadot (6.50% - inflation-driven)
  Average delta across all pools: 1.18%

The risk delta measures how much of the advertised APY is a risk premium not backed by verifiable on-chain revenue.`,
    suggestions: [
      { id: "risk_dot", icon: "risk", label: "Explain Polkadot's low revenue coverage", description: "Why inflation-driven yields are risky" },
      { id: "portfolio", icon: "portfolio", label: "Build a portfolio avoiding C-grade pools", description: "Conservative allocation only" },
      { id: "verify", icon: "verify", label: "Verify Lido's APY breakdown", description: "See the yield decomposition" },
    ],
  },
  risk_dot: {
    message: `Deep Dive: Polkadot Risk Delta Analysis

Why does DOT show a 6.5% gap between nominal (12%) and verified (5.5%) APY?

Yield Decomposition
  Nominal APY: 12.00%
  Inflation component: -6.50%  (token supply expansion)
  Validator commission: -0.35%
  Slashing risk adjustment: -0.15%
  Verified Real APY: 5.00-5.50%

The Problem with Inflation-Driven Yields
  When a network mints new tokens to pay stakers, the yield is offset by dilution. If you stake 1000 DOT at "12% APY", you get 120 DOT after a year - but the total supply also grew, reducing each token's share of the network.

  Real yield only exists when the APY comes from:
  - Transaction fees collected by the network
  - MEV captured by validators
  - Protocol revenue shared with stakers

Revenue Coverage Ratio
  DOT: 0.35 (only 35% of yield is revenue-backed)
  Compare with Lido: 0.92 (92% revenue-backed)
  Compare with Aave: 1.00 (100% revenue-backed)

This is exactly why initFarm's verification engine exists - to cut through inflated APY marketing and show depositors what they'll actually earn in real purchasing-power terms.`,
    suggestions: [
      { id: "risk", icon: "risk", label: "View full risk comparison table", description: "All protocols side by side" },
      { id: "portfolio", icon: "portfolio", label: "Build an inflation-free portfolio", description: "Only revenue-backed yields" },
      { id: "initia", icon: "initia", label: "How does Initia handle staking inflation?", description: "Compare with DOT's model" },
    ],
  },
  verify: {
    message: `APY Verification Engine - Lido ETH Staking

Running independent yield decomposition...

On-Chain Data Sources
  DeFiLlama: TVL history, fee revenue, protocol metrics
  Dune Analytics: Validator performance, reward distribution
  StakingRewards: Consensus layer yield benchmarks

Yield Decomposition
  Consensus Layer Rewards:  1.85%
    Block proposals + attestations
    Source: Ethereum beacon chain direct

  Execution Layer Rewards:  0.42%
    Priority fees + MEV captured
    Source: Relay data (Flashbots/bloXroute)

  stETH Rebase Mechanism:   0.04%
    Daily balance updates reflecting rewards
    Verified via on-chain rebase events

  Gross Yield:             2.31%
  Lido Protocol Fee:      -0.23% (10% commission on rewards)
  Net to Depositor:        2.08%

Comparison
  Advertised APY:  2.51%
  Verified APY:    2.31%
  Risk Delta:      0.20%

  Delta Explanation: The 0.20% gap comes from Lido's advertised rate using a trailing 7-day average during a period of higher-than-usual MEV. Our 30-day weighted average gives a more stable picture.

Sustainability Score: 9.4/10
  Revenue fully covers yield payouts
  No inflation component
  Liquid staking (no lock-up risk)
  $19.6B TVL provides deep exit liquidity`,
    suggestions: [
      { id: "verify_ethena", icon: "verify", label: "Verify Ethena USDe yield next", description: "How does delta-neutral strategy hold up?" },
      { id: "portfolio", icon: "portfolio", label: "Build portfolio around verified yields", description: "Prioritize low-delta protocols" },
      { id: "risk", icon: "risk", label: "Compare risk scores across all pools", description: "Full multi-factor analysis" },
    ],
  },
  verify_ethena: {
    message: `APY Verification Engine - Ethena USDe

Running independent yield decomposition...

Yield Decomposition
  Funding Rate Revenue:    2.45%
    Short perpetual futures funding payments
    30-day average from major CEX venues

  Staked ETH Yield:        0.38%
    LST backing earns consensus rewards
    Proportional to collateral ratio

  Basis Spread:            0.07%
    Spot-futures price differential capture

  Gross Yield:             2.90%
  Protocol Fee:           -0.00% (currently waived)
  Net to Depositor:        2.90%

Comparison
  Advertised APY:  3.54%
  Verified APY:    2.90%
  Risk Delta:      0.64%

  Delta Explanation: Ethena's advertised rate uses peak funding periods. During negative funding events (historically ~15% of days), the yield can temporarily go negative. Our weighted average smooths these cycles.

Risk Considerations
  Funding rate dependency: Yield varies with market conditions
  Negative funding periods: ~15% of days historically
  Centralized exchange risk: Counterparty exposure
  De-peg scenarios: USDe has maintained peg but is relatively new

Sustainability Score: 6.8/10
  Novel mechanism with limited track record
  Revenue-backed but cyclical
  Growing but concentration risk present`,
    suggestions: [
      { id: "portfolio", icon: "portfolio", label: "How would you weight Ethena in a portfolio?", description: "Risk-adjusted allocation" },
      { id: "risk", icon: "risk", label: "Full risk comparison: all protocols", description: "Side-by-side multi-factor view" },
      { id: "initia", icon: "initia", label: "Explore Initia staking instead", description: "Native ecosystem opportunities" },
    ],
  },
  initia: {
    message: `Initia Network - Yield Opportunity Analysis

Initia is the interwoven rollup network providing infrastructure for modular L1 with native cross-chain capabilities.

Staking Overview
  Expected APY: ~14.2% (nominal)
  Verified Estimate: ~7.8-8.5% (after inflation adjustment)
  Unbonding Period: 14-21 days (flexible)
  Minimum Stake: No minimum
  Validator Set: Growing, decentralizing

Initia-Native Advantages for initFarm
  InterwovenKit Integration
    Direct wallet connection via Privy, MetaMask, Keplr
    Auto-Sign sessions for seamless UX
    .init username support

  On-Chain Transparency
    Move-based smart contracts for vault management
    All portfolio allocations recorded on-chain
    Fee collection via high-water mark mechanism

  Multi-Chain Architecture
    Interwoven rollups reduce single-point-of-failure risk
    Cross-chain yield opportunities as ecosystem grows
    Native IBC connectivity to Cosmos ecosystem

initFarm Vault Contract
  Deployed on Initia testnet (initiation-2)
  Module: vault at init1qu96ezv2xmtwfzpyhupz8lu7u5rg562kns6kju
  Features: deposit, withdraw (with performance fee), portfolio allocation management

  Fee Structure (settled in iUSD):
    Management: 1% of AUM/year
    Performance: 10% of profit above high-water mark

The Initia ecosystem is early-stage, which means higher potential yields but also higher uncertainty. As more data accumulates on-chain, initFarm's verification engine will provide increasingly accurate yield estimates.`,
    suggestions: [
      { id: "portfolio", icon: "portfolio", label: "Include Initia in my portfolio", description: "Allocate a portion to INIT staking" },
      { id: "risk", icon: "risk", label: "What are Initia's risk factors?", description: "Early-stage protocol analysis" },
      { id: "verify", icon: "verify", label: "How will you verify Initia yields?", description: "Data sources and methodology" },
    ],
  },
};

/* ─── Conversation Storage ─── */
const STORAGE_KEY = "initfarm_conversations";
const ACTIVE_KEY = "initfarm_active_convo";

function loadConversations() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Migrate old conversations to new IPS structure
    return parsed.map((c) => {
      const wasOldFormat = c.ipsStep === undefined;
      return {
        ...c,
        ipsStep: c.ipsStep || 0,
        ipsValues: c.ipsValues || {},
        // Old conversations (pre-IPS) are treated as complete so they work normally
        ipsComplete: wasOldFormat ? true : !!c.ipsComplete,
        messages: (c.messages || []).filter((m) => m && m.role).map((m, i) => ({
          ...m,
          id: m.id || `legacy_${c.id}_${i}`,
          content: m.content || "",
          // Fix serialized JSX icons in suggestions
          suggestions: m.suggestions ? m.suggestions.map((s) => ({
            ...s,
            icon: typeof s.icon === "string" ? s.icon : (s.id || "portfolio"),
          })) : undefined,
        })),
      };
    });
  } catch {
    // If anything goes wrong, clear corrupted data
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    return [];
  }
}

function saveConversations(convos) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(convos)); } catch {}
}

function loadActiveId() {
  try { return localStorage.getItem(ACTIVE_KEY) || null; } catch { return null; }
}

function saveActiveId(id) {
  try { localStorage.setItem(ACTIVE_KEY, id); } catch {}
}

function formatTime(ts) {
  const diff = Date.now() - ts;
  if (diff < 60000) return "Just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  if (diff < 172800000) return "Yesterday";
  return `${Math.floor(diff / 86400000)}d ago`;
}

function titleFromMessages(msgs) {
  const first = msgs.find((m) => m.role === "user");
  if (!first) return "New conversation";
  const t = first.content;
  return t.length > 32 ? t.slice(0, 32) + "..." : t;
}

/* ─── Typing Effect Hook ─── */
function useTypingEffect(text, speed = 12) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!text) { setDisplayed(""); setDone(true); return; }
    setDisplayed("");
    setDone(false);
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(iv); setDone(true); }
    }, speed);
    return () => clearInterval(iv);
  }, [text, speed]);

  return { displayed, done };
}

/* ─── Token usage estimator (deterministic) ─── */
const COST_PER_TOKEN = 0.0002; // INIT per token
function estimateTokenUsage(charLen) {
  const len = charLen || 100;
  const outputTokens = Math.max(12, Math.round(len / 3.8));
  const inputTokens = Math.round(outputTokens * 0.75);
  const total = inputTokens + outputTokens;
  const cost = total * COST_PER_TOKEN;
  const costMicro = Math.max(1, Math.round(cost * 1_000_000)); // uinit, minimum 1
  return { inputTokens, outputTokens, total, cost, costMicro };
}

/* ─── Token Usage Tag (reusable) ─── */
function TokenUsageTag({ usage, txHash, txStatus }) {
  if (!usage) return null;
  return (
    <div style={{
      marginTop: 6, marginLeft: 44,
      display: "flex", alignItems: "center", gap: 6,
      fontSize: 11, color: T.textMuted, flexWrap: "wrap",
    }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
      </svg>
      <span>{usage.total} tokens</span>
      <span style={{ color: T.cardBorder }}>·</span>
      <span>{usage.inputTokens} in / {usage.outputTokens} out</span>
      <span style={{ color: T.cardBorder }}>·</span>
      <span style={{ color: T.orange, fontWeight: 600 }}>{usage.cost.toFixed(4)} INIT</span>
      {txStatus === "pending" && (
        <>
          <span style={{ color: T.cardBorder }}>·</span>
          <span style={{ color: T.textMuted, fontStyle: "italic" }}>paying...</span>
        </>
      )}
      {txStatus === "failed" && (
        <>
          <span style={{ color: T.cardBorder }}>·</span>
          <span style={{ color: "#EF4444", fontWeight: 500 }}>unpaid</span>
        </>
      )}
      {txHash && (
        <>
          <span style={{ color: T.cardBorder }}>·</span>
          <a
            href={`https://scan.testnet.initia.xyz/initiation-2/txs/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              color: T.green, fontWeight: 600, textDecoration: "none",
              display: "inline-flex", alignItems: "center", gap: 3,
            }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            tx
          </a>
        </>
      )}
    </div>
  );
}

/* ─── Chat Message Component ─── */
function Message({ role, content, typing, onSuggestionClick, suggestions, showSuggestions, tokenUsage, txHash, txStatus }) {
  const isUser = role === "user";
  const { displayed, done } = useTypingEffect(typing ? content : null, 8);
  const show = typing ? displayed : content;

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{
        display: "flex", gap: 12, alignItems: "flex-start",
        justifyContent: isUser ? "flex-end" : "flex-start",
      }}>
        {!isUser && (
          <div style={{
            width: 32, height: 32, borderRadius: 10, flexShrink: 0,
            background: T.accent, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, color: "#fff", fontWeight: 700, marginTop: 2,
          }}>iF</div>
        )}
        <div style={{
          maxWidth: isUser ? "70%" : "85%",
          background: isUser ? T.accent : T.card,
          color: isUser ? "#fff" : T.text,
          borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          padding: "14px 18px",
          fontSize: 14, lineHeight: 1.75,
          whiteSpace: "pre-wrap",
          border: isUser ? "none" : `1px solid ${T.cardBorder}`,
          boxShadow: isUser ? "none" : "0 1px 3px rgba(0,0,0,0.04)",
        }}>
          {show}
          {typing && !done && (
            <span style={{
              display: "inline-block", width: 2, height: 16,
              background: T.textMuted, marginLeft: 1,
              animation: "cursorBlink 0.8s infinite",
              verticalAlign: "text-bottom",
            }} />
          )}
        </div>
        {isUser && (
          <div style={{
            width: 32, height: 32, borderRadius: 10, flexShrink: 0,
            background: T.bgWarm, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, color: T.text, fontWeight: 700,
            border: `1px solid ${T.cardBorder}`, marginTop: 2,
          }}>You</div>
        )}
      </div>

      {/* Token usage indicator for AI messages */}
      {!isUser && tokenUsage && (typing ? done : true) && (
        <TokenUsageTag usage={tokenUsage} txHash={txHash} txStatus={txStatus} />
      )}

      {/* Suggestion chips after AI message */}
      {!isUser && showSuggestions && suggestions && done && (
        <div style={{
          marginTop: 16, marginLeft: 44,
          display: "flex", flexDirection: "column", gap: 8,
        }}>
          {suggestions.map((s) => (
            <button key={s.id} onClick={() => onSuggestionClick(s)}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "12px 16px", borderRadius: 12,
                border: `1px solid ${T.cardBorder}`,
                background: T.card, cursor: "pointer",
                textAlign: "left", fontFamily: "inherit",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = T.bgWarm;
                e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)";
                e.currentTarget.style.transform = "translateX(4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = T.card;
                e.currentTarget.style.borderColor = T.cardBorder;
                e.currentTarget.style.transform = "translateX(0)";
              }}
            >
              <div style={{
                width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                background: T.bgWarm, display: "flex", alignItems: "center", justifyContent: "center",
                color: T.textSoft,
              }}>{getIcon(s.icon)}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 550, color: T.text }}>{s.label}</div>
                <div style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>{s.description}</div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.textMuted} strokeWidth="2" strokeLinecap="round" style={{ marginLeft: "auto", flexShrink: 0 }}>
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Main Chat Page ─── */
function ChatPageInner() {
  const navigate = useNavigate();
  const kit = useInterwovenKit();
  const walletConnected = !!kit.address;
  // Keep refs so async callbacks always see latest values
  const kitRef = useRef(kit);
  kitRef.current = kit;
  const walletRef = useRef(walletConnected);
  walletRef.current = walletConnected;
  /* ─── Multi-conversation state ─── */
  const [conversations, setConversations] = useState(() => loadConversations());
  const [activeConvoId, setActiveConvoId] = useState(() => loadActiveId());
  const [isTyping, setIsTyping] = useState(false);
  const [typingMsgId, setTypingMsgId] = useState(null);
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileMenu, setProfileMenu] = useState(false);
  const [editingTitleId, setEditingTitleId] = useState(null);
  const [editingTitleValue, setEditingTitleValue] = useState("");
  /* IPS live form state (not persisted — only for the active step being filled) */
  const [ipsFormValues, setIpsFormValues] = useState({});
  const endRef = useRef(null);
  const msgIdRef = useRef(0);

  /* Derive current conversation */
  const activeConvo = conversations.find((c) => c.id === activeConvoId) || null;
  const messages = activeConvo ? activeConvo.messages : [];
  const ipsStep = activeConvo ? (activeConvo.ipsStep || 0) : 0;
  const ipsValues = activeConvo ? (activeConvo.ipsValues || {}) : {};
  const ipsComplete = activeConvo ? !!activeConvo.ipsComplete : false;

  /* Persist conversations whenever they change */
  useEffect(() => {
    saveConversations(conversations);
  }, [conversations]);

  useEffect(() => {
    if (activeConvoId) saveActiveId(activeConvoId);
  }, [activeConvoId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, ipsStep]);

  /* Reset form values when switching conversations or IPS step changes */
  useEffect(() => {
    // Pre-fill strategy defaults for step 2
    if (ipsStep === 2) {
      const stepDef = IPS_STEPS.find((s) => s.step === 2);
      if (stepDef && stepDef.strategyField) {
        const defaults = {};
        stepDef.strategyField.strategies.forEach((s) => { defaults[s.key] = 0; });
        setIpsFormValues({ strategyPreference: defaults });
      }
    } else {
      setIpsFormValues({});
    }
  }, [activeConvoId, ipsStep]);

  const nextId = () => ++msgIdRef.current;

  /* ─── Conversation helpers ─── */
  const updateConvo = (convoId, updater) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === convoId ? { ...c, ...updater(c), updatedAt: Date.now() } : c))
    );
  };

  const pushToConvo = (convoId, ...msgs) => {
    updateConvo(convoId, (c) => {
      const updated = [...c.messages, ...msgs];
      return { messages: updated, title: titleFromMessages(updated) };
    });
  };

  const chargeTokenFee = async (convoId, msgId, usage) => {
    const k = kitRef.current;
    const connected = walletRef.current;
    console.log("[initFarm] chargeTokenFee:", { connected, address: k?.address, costMicro: usage.costMicro });
    if (!connected || !k?.address || usage.costMicro <= 0) return;

    try {
      console.log("[initFarm] Sending MsgSend:", usage.costMicro, "uinit to", VAULT_BECH32);
      const result = await k.requestTxBlock({
        messages: [{
          typeUrl: "/cosmos.bank.v1beta1.MsgSend",
          value: {
            fromAddress: k.address,
            toAddress: VAULT_BECH32,
            amount: [{ amount: String(usage.costMicro), denom: "uinit" }],
          },
        }],
      });
      console.log("[initFarm] Payment success:", result.transactionHash);
      updateConvo(convoId, (c) => ({
        messages: c.messages.map((m) =>
          m.id === msgId ? { ...m, txHash: result.transactionHash, txStatus: "paid" } : m
        ),
      }));
    } catch (err) {
      console.error("[initFarm] Payment failed:", err);
      updateConvo(convoId, (c) => ({
        messages: c.messages.map((m) =>
          m.id === msgId ? { ...m, txStatus: "failed", txError: err?.message || "Unknown error" } : m
        ),
      }));
    }
  };

  const addAIResponse = (convoId, aiMsg) => {
    const id = nextId();
    const charLen = typeof aiMsg.content === "string" ? aiMsg.content.length : 100;
    const usage = estimateTokenUsage(charLen);
    const isConnected = walletRef.current;
    const fullMsg = { ...aiMsg, id, tokenUsage: usage, txStatus: isConnected ? "pending" : null, txHash: null };
    setTypingMsgId(id);
    pushToConvo(convoId, fullMsg);
    setIsTyping(false);

    // Charge token fee after a short delay to ensure state is settled
    setTimeout(() => chargeTokenFee(convoId, id, usage), 500);
  };

  /* ─── Start new conversation with IPS ─── */
  const handleStartIPS = () => {
    const id = "c_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7);
    const newConvo = {
      id, title: "Investment Policy Statement",
      messages: [], createdAt: Date.now(), updatedAt: Date.now(),
      ipsStep: 1, ipsValues: {}, ipsComplete: false,
    };
    setConversations((prev) => [newConvo, ...prev]);
    setActiveConvoId(id);
    setIpsFormValues({});
    setIsTyping(false);
    setTypingMsgId(null);
    setInput("");
  };

  /* ─── Apply portfolio to wallet ─── */
  const [depositForm, setDepositForm] = useState(null); // { portfolioData }

  const handleApplyPortfolio = (portfolioData) => {
    // Always show deposit form — wallet check happens at confirm time
    setDepositForm({ portfolioData });
  };

  const handleCancelDeposit = () => {
    setDepositForm(null);
  };

  const handleConfirmDeposit = async (amountINIT) => {
    const cId = activeConvoId;
    if (!cId || !depositForm) return;

    // If wallet not connected, open connect modal first
    if (!walletConnected) {
      kit.openConnect();
      return;
    }

    const { portfolioData } = depositForm;
    setDepositForm(null);

    const amountMicro = Math.floor(amountINIT * 1_000_000);
    const userMsg = { id: nextId(), role: "user", content: `Deposit ${amountINIT} INIT to initFarm Vault` };
    updateConvo(cId, (c) => ({ messages: [...c.messages, userMsg] }));
    setIsTyping(true);

    try {
      // Build MsgExecute for vault::deposit
      const messages = [{
        typeUrl: "/initia.move.v1.MsgExecute",
        value: {
          sender: kit.address,
          moduleAddress: VAULT_BECH32,
          moduleName: "vault",
          functionName: "deposit",
          typeArgs: [],
          args: [
            bcsAddress(VAULT_HEX),
            bcsU64(amountMicro),
          ],
        },
      }];

      const { transactionHash } = await kit.requestTxBlock({ messages });

      const successMsg = {
        id: nextId(), role: "assistant",
        content: `Deposit successful!\n\nTransaction Hash:\n${transactionHash}\n\nAmount: ${amountINIT} INIT deposited to initFarm Vault\nWallet: ${kit.address.slice(0, 12)}...${kit.address.slice(-6)}\n\nYour funds are now being allocated across the portfolio:\n${portfolioData.items.map((it) => `  ${it.name}: ${(amountINIT * it.weight / 100).toFixed(4)} INIT (${it.weight}%)`).join("\n")}\n\nView on Explorer:\nhttps://testnet.scan.initia.xyz/tx/${transactionHash}`,
        suggestions: [
          { id: "portfolio", icon: "portfolio", label: "View portfolio status", description: "Check your current position" },
          { id: "risk", icon: "risk", label: "Run risk assessment", description: "multi-factor on-chain risk analysis" },
        ],
      };
      updateConvo(cId, (c) => ({ messages: [...c.messages, successMsg] }));
      setTypingMsgId(successMsg.id);
      setIsTyping(false);
    } catch (err) {
      const errorMsg = {
        id: nextId(), role: "assistant",
        content: `Transaction failed.\n\nError: ${err?.message || "Unknown error"}\n\nThis could be due to:\n  Insufficient INIT balance\n  Transaction was rejected in wallet\n  Network congestion\n\nPlease check your wallet balance and try again. You can get testnet INIT from the Initia faucet.`,
        suggestions: SCENARIOS.welcome.suggestions,
      };
      updateConvo(cId, (c) => ({ messages: [...c.messages, errorMsg] }));
      setTypingMsgId(errorMsg.id);
      setIsTyping(false);
    }
  };

  /* ─── IPS form field changes ─── */
  const handleIPSFieldChange = (key, value) => {
    setIpsFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleIPSStrategyChange = (stratKey, level) => {
    setIpsFormValues((prev) => ({
      ...prev,
      strategyPreference: { ...(prev.strategyPreference || {}), [stratKey]: level },
    }));
  };

  /* ─── IPS step submission ─── */
  const handleIPSSubmit = () => {
    if (!activeConvo || isTyping) return;
    const cId = activeConvoId;
    const currentStep = IPS_STEPS.find((s) => s.step === ipsStep);
    if (!currentStep) return;

    // Merge form values into conversation ipsValues
    const mergedValues = { ...ipsValues, ...ipsFormValues };

    // Save the completed form step as a message so it stays in chat history
    const formMsg = {
      id: nextId(), role: "ips_form",
      ipsStepNum: currentStep.step,
      ipsSnapshot: { ...mergedValues },
    };

    if (ipsStep < 4) {
      const nextStep = ipsStep + 1;
      updateConvo(cId, (c) => {
        const updated = [...c.messages, formMsg];
        return { messages: updated, ipsStep: nextStep, ipsValues: mergedValues, title: "Investment Policy Statement" };
      });
      setIpsFormValues({});
    } else {
      // IPS complete — generate portfolio
      setIsTyping(true);
      updateConvo(cId, (c) => {
        const updated = [...c.messages, formMsg];
        return { messages: updated, ipsValues: mergedValues, title: "Investment Policy Statement" };
      });

      setTimeout(() => {
        const portfolioData = generateIPSPortfolio(mergedValues);
        const chartMsg = {
          id: nextId(), role: "portfolio_chart",
          portfolioData: portfolioData,
        };
        const followUpContent = "Your portfolio is ready. You can explore more topics below — run a risk assessment, verify APY for any protocol, or dive into Initia staking opportunities.";
        const followUpUsage = estimateTokenUsage(followUpContent.length);
        const followUpId = nextId();
        const followUp = {
          id: followUpId, role: "assistant",
          content: followUpContent,
          suggestions: SCENARIOS.welcome.suggestions,
          tokenUsage: followUpUsage,
          txStatus: walletConnected ? "pending" : null,
          txHash: null,
        };
        updateConvo(cId, (c) => ({
          messages: [...c.messages, chartMsg, followUp],
          ipsComplete: true,
          title: "Portfolio - IPS Complete",
        }));
        setTypingMsgId(followUpId);
        setIsTyping(false);
        setIpsFormValues({});

        // Charge token fee
        if (walletConnected && followUpUsage.costMicro > 0) {
          (async () => {
            try {
              const { transactionHash } = await kit.requestTxBlock({
                messages: [{
                  typeUrl: "/cosmos.bank.v1beta1.MsgSend",
                  value: {
                    fromAddress: kit.address,
                    toAddress: VAULT_BECH32,
                    amount: [{ amount: String(followUpUsage.costMicro), denom: "uinit" }],
                  },
                }],
              });
              updateConvo(cId, (c) => ({
                messages: c.messages.map((m) =>
                  m.id === followUpId ? { ...m, txHash: transactionHash, txStatus: "paid" } : m
                ),
              }));
            } catch (err) {
              console.warn("Token fee payment failed:", err);
              updateConvo(cId, (c) => ({
                messages: c.messages.map((m) =>
                  m.id === followUpId ? { ...m, txStatus: "failed" } : m
                ),
              }));
            }
          })();
        }
      }, 800 + Math.random() * 400);
    }
  };

  /* ─── Post-IPS scenario chat ─── */
  const handleSuggestion = (suggestion) => {
    if (isTyping) return;
    const scenario = SCENARIOS[suggestion.id];
    if (!scenario) return;
    const cId = activeConvoId;
    if (!cId) return;

    const userMsg = { id: nextId(), role: "user", content: suggestion.label };
    const aiMsg = { role: "assistant", content: scenario.message, suggestions: scenario.suggestions };

    pushToConvo(cId, userMsg);
    setIsTyping(true);

    setTimeout(() => {
      addAIResponse(cId, aiMsg);
    }, 600 + Math.random() * 400);
  };

  const handleFreeInput = () => {
    if (!input.trim() || isTyping) return;
    const cId = activeConvoId;
    if (!cId || !ipsComplete) return;
    const msg = input.trim();
    setInput("");

    const lower = msg.toLowerCase();
    let matchedId = null;
    if (lower.includes("portfolio") || lower.includes("allocat")) matchedId = "portfolio";
    else if (lower.includes("risk") || lower.includes("assess")) matchedId = "risk";
    else if (lower.includes("verify") || lower.includes("apy") || lower.includes("yield")) matchedId = "verify";
    else if (lower.includes("initia") || lower.includes("init ") || lower.includes("staking")) matchedId = "initia";

    const scenario = matchedId ? SCENARIOS[matchedId] : null;

    pushToConvo(cId, { id: nextId(), role: "user", content: msg });
    setIsTyping(true);

    setTimeout(() => {
      if (scenario) {
        addAIResponse(cId, { role: "assistant", content: scenario.message, suggestions: scenario.suggestions });
      } else {
        addAIResponse(cId, {
          role: "assistant",
          content: `I can analyze that for you using live on-chain data.\n\nHere's what I can help with:\n\n  Portfolio Construction - AI-optimized allocations across risk tiers\n  Risk Assessment - multi-factor protocol scoring model\n  APY Verification - Independent yield decomposition\n  Initia Ecosystem - Staking and DeFi opportunities\n\nTry asking about any of these topics and I'll provide detailed, data-driven analysis backed by verified on-chain metrics.`,
          suggestions: SCENARIOS.welcome.suggestions,
        });
      }
    }, 600 + Math.random() * 400);
  };

  const handleNewChat = () => {
    setActiveConvoId(null);
    setIsTyping(false);
    setTypingMsgId(null);
    setInput("");
    setIpsFormValues({});
  };

  const handleSelectConvo = (id) => {
    if (id === activeConvoId) return;
    setActiveConvoId(id);
    setIsTyping(false);
    setTypingMsgId(null);
    setInput("");
    setIpsFormValues({});
  };

  const handleDeleteConvo = (e, id) => {
    e.stopPropagation();
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConvoId === id) {
      setActiveConvoId(null);
      setTypingMsgId(null);
      setIpsFormValues({});
    }
  };

  const isWelcomeState = !activeConvo;
  const currentIPSStep = IPS_STEPS.find((s) => s.step === ipsStep) || null;
  const sortedConvos = [...conversations].sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <div style={{
      display: "flex", height: "100vh",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      background: T.bg,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;450;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${T.bg}; }
        ::selection { background: rgba(26,26,26,0.12); }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes dotPulse {
          0%, 80%, 100% { transform: scale(0.4); opacity: 0.3; }
          40% { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .sidebar-item:hover { background: rgba(0,0,0,0.04) !important; }
        .sidebar-item:hover .convo-delete-btn { opacity: 1 !important; }
        .sidebar-item-active { background: rgba(0,0,0,0.06) !important; }
      `}</style>

      {/* ─── Sidebar ─── */}
      {sidebarOpen && (
        <div style={{
          width: 280, height: "100vh",
          background: T.bgWarm,
          borderRight: `1px solid ${T.cardBorder}`,
          display: "flex", flexDirection: "column",
          flexShrink: 0,
        }}>
          {/* Sidebar header */}
          <div style={{
            padding: "16px 16px 12px",
            borderBottom: `1px solid ${T.cardBorder}`,
          }}>
            <button onClick={handleNewChat} style={{
              width: "100%", padding: "10px 14px", borderRadius: 10,
              border: `1px solid ${T.cardBorder}`,
              background: T.card, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 10,
              fontFamily: "inherit", fontSize: 13, fontWeight: 500, color: T.text,
              transition: "all 0.15s ease",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = T.bg; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = T.card; }}
            >
              {ChatIcons.plus}
              New conversation
            </button>
          </div>

          {/* Conversation list */}
          <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
            {sortedConvos.length > 0 && (
              <div style={{ padding: "8px 8px 4px", fontSize: 11, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Recent
              </div>
            )}
            {sortedConvos.length === 0 && (
              <div style={{ padding: "24px 12px", textAlign: "center" }}>
                <div style={{ fontSize: 13, color: T.textMuted, lineHeight: 1.6 }}>
                  No conversations yet.<br />Start a new one above.
                </div>
              </div>
            )}
            {sortedConvos.map((c) => {
              const isActive = c.id === activeConvoId;
              return (
                <div key={c.id}
                  onClick={() => handleSelectConvo(c.id)}
                  className={isActive ? "sidebar-item sidebar-item-active" : "sidebar-item"}
                  style={{
                    padding: "10px 12px", borderRadius: 8,
                    cursor: "pointer", display: "flex", alignItems: "center", gap: 10,
                    background: isActive ? "rgba(0,0,0,0.06)" : "transparent",
                    transition: "background 0.15s ease",
                    marginBottom: 2, position: "relative",
                  }}
                >
                  <div style={{ color: T.textMuted, flexShrink: 0 }}>{ChatIcons.chat}</div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    {editingTitleId === c.id ? (
                      <input
                        autoFocus
                        value={editingTitleValue}
                        onChange={(e) => setEditingTitleValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") { e.target.blur(); }
                          if (e.key === "Escape") { setEditingTitleId(null); }
                        }}
                        onBlur={() => {
                          const trimmed = editingTitleValue.trim();
                          if (trimmed && trimmed !== c.title) {
                            updateConvo(c.id, () => ({ title: trimmed }));
                          }
                          setEditingTitleId(null);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          fontSize: 13, fontWeight: 550, color: T.text,
                          width: "100%", padding: "2px 4px", margin: "-2px -4px",
                          border: `1px solid ${T.green}`, borderRadius: 4,
                          outline: "none", background: "#fff",
                          fontFamily: "inherit",
                        }}
                      />
                    ) : (
                      <div
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          setEditingTitleId(c.id);
                          setEditingTitleValue(c.title);
                        }}
                        style={{
                          fontSize: 13, fontWeight: isActive ? 550 : 400,
                          color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                          cursor: "text",
                        }}
                        title="Double-click to rename"
                      >{c.title}</div>
                    )}
                    <div style={{ fontSize: 11, color: T.textMuted, marginTop: 2 }}>{formatTime(c.updatedAt)}</div>
                  </div>
                  {/* Delete button */}
                  <button onClick={(e) => handleDeleteConvo(e, c.id)}
                    className="convo-delete-btn"
                    style={{
                      width: 22, height: 22, borderRadius: 6,
                      border: "none", background: "transparent",
                      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                      color: T.textMuted, flexShrink: 0, opacity: 0,
                      transition: "opacity 0.1s ease, background 0.1s ease",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.06)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Sidebar footer - User profile */}
          <div style={{ position: "relative" }}>
            {/* Profile menu dropdown */}
            {profileMenu && (
              <>
                <div style={{ position: "fixed", inset: 0, zIndex: 299 }}
                  onClick={() => setProfileMenu(false)} />
                <div style={{
                  position: "absolute", bottom: "100%", left: 8, right: 8,
                  marginBottom: 4, borderRadius: 12,
                  background: T.card, border: `1px solid ${T.cardBorder}`,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
                  overflow: "hidden", zIndex: 300,
                  animation: "fadeUp 0.15s ease-out",
                }}>
                  {[
                    { icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                      </svg>
                    ), label: "My profile", sub: "noah@initfarm.xyz" },
                    { icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 10h20" /><path d="M12 4v16" />
                      </svg>
                    ), label: "Wallet", sub: walletConnected ? `${kit.address.slice(0, 10)}...${kit.address.slice(-4)}` : "Not connected", action: () => walletConnected ? kit.openWallet() : kit.openConnect() },
                    { icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
                      </svg>
                    ), label: "Portfolio", sub: "View vault & positions", action: () => window.open(`https://testnet.scan.initia.xyz/accounts/${walletConnected ? kit.address : VAULT_BECH32}`, "_blank") },
                    { icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                      </svg>
                    ), label: "Settings" },
                    { icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
                      </svg>
                    ), label: "Customize initFarm" },
                    { divider: true },
                    { icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                    ), label: "Log out" },
                  ].map((item, idx) =>
                    item.divider ? (
                      <div key={idx} style={{ height: 1, background: T.cardBorder, margin: "4px 0" }} />
                    ) : (
                      <button key={idx} onClick={() => { if (item.action) item.action(); setProfileMenu(false); }}
                        style={{
                          width: "100%", padding: "10px 14px",
                          display: "flex", alignItems: "center", gap: 12,
                          background: "transparent", border: "none",
                          cursor: "pointer", fontFamily: "inherit",
                          textAlign: "left", transition: "background 0.1s ease",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = T.bgWarm; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                      >
                        <div style={{ color: T.textMuted, flexShrink: 0 }}>{item.icon}</div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 450, color: T.text }}>{item.label}</div>
                          {item.sub && <div style={{ fontSize: 11, color: T.textMuted, marginTop: 1 }}>{item.sub}</div>}
                        </div>
                      </button>
                    )
                  )}
                </div>
              </>
            )}

            <button onClick={() => setProfileMenu(!profileMenu)} style={{
              width: "100%", padding: "12px 16px",
              borderTop: `1px solid ${T.cardBorder}`,
              display: "flex", alignItems: "center", gap: 10,
              background: "transparent", border: "none", borderTop: `1px solid ${T.cardBorder}`,
              cursor: "pointer", fontFamily: "inherit",
              transition: "background 0.1s ease",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.03)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              <div style={{
                width: 30, height: 30, borderRadius: "50%",
                background: "linear-gradient(135deg, #6B5CE7, #3B82F6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, color: "#fff", fontWeight: 700, flexShrink: 0,
              }}>NC</div>
              <div style={{ flex: 1, textAlign: "left" }}>
                <div style={{ fontSize: 13, fontWeight: 550, color: T.text }}>Noah Choi</div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.textMuted} strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="5" r="1" fill={T.textMuted} /><circle cx="12" cy="12" r="1" fill={T.textMuted} /><circle cx="12" cy="19" r="1" fill={T.textMuted} />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ─── Main Chat Area ─── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", minWidth: 0 }}>
        {/* Top bar */}
        <div style={{
          padding: "12px 20px",
          borderBottom: `1px solid ${T.cardBorder}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: T.card,
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
              width: 34, height: 34, borderRadius: 8,
              border: `1px solid ${T.cardBorder}`, background: "transparent",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              color: T.textMuted, transition: "all 0.15s ease",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = T.bgWarm; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >{ChatIcons.sidebar}</button>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 30, height: 30, borderRadius: 8,
                background: T.accent, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, color: "#fff", fontWeight: 700,
              }}>iF</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>initFarm Agent</div>
                <div style={{ fontSize: 11, color: T.green, display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: T.green }} />
                  Analyzing on-chain data
                </div>
              </div>
            </div>
          </div>
          <button onClick={() => navigate("/")} style={{
            padding: "7px 16px", borderRadius: 8,
            border: `1px solid ${T.cardBorder}`, background: "transparent",
            cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
            fontFamily: "inherit", fontSize: 13, fontWeight: 500, color: T.textSoft,
            transition: "all 0.15s ease",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = T.bgWarm; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            {ChatIcons.back}
            Back to Home
          </button>
        </div>

        {/* Messages area */}
        <div style={{
          flex: 1, overflowY: "auto",
          padding: "24px 0",
          display: "flex", flexDirection: "column",
        }}>
          <div style={{ maxWidth: 780, width: "100%", margin: "0 auto", padding: "0 24px" }}>
            {/* Welcome state — no active conversation */}
            {isWelcomeState && (
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center",
                paddingTop: "12vh",
                animation: "fadeUp 0.4s ease-out",
              }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 16,
                  background: T.accent, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18, color: "#fff", fontWeight: 700, marginBottom: 20,
                }}>iF</div>
                <h2 style={{ fontSize: 22, fontWeight: 600, color: T.text, marginBottom: 6 }}>
                  Build your investment policy
                </h2>
                <p style={{ fontSize: 14, color: T.textMuted, marginBottom: 32, textAlign: "center", maxWidth: 460, lineHeight: 1.7 }}>
                  I'll guide you through a quick Investment Policy Statement (IPS) to understand your goals, risk tolerance, and strategy preferences — then build a verified portfolio.
                </p>
                <button onClick={handleStartIPS} style={{
                  padding: "14px 32px", borderRadius: 12,
                  border: "none", background: T.accent, color: "#fff",
                  fontSize: 15, fontWeight: 600, cursor: "pointer",
                  fontFamily: "inherit", transition: "all 0.15s ease",
                  display: "flex", alignItems: "center", gap: 10,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#333"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = T.accent; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <path d="M14 2v6h6" /><path d="M12 18v-6" /><path d="M9 15h6" />
                  </svg>
                  Start New IPS
                </button>
              </div>
            )}

            {/* Message list (includes regular messages + submitted IPS forms) */}
            {messages.map((m, i) => {
              if (m.role === "ips_form") {
                // Render a disabled IPS form for previously submitted steps
                const stepDef = IPS_STEPS.find((s) => s.step === m.ipsStepNum);
                if (!stepDef) return null;
                return (
                  <IPSFormMessage
                    key={m.id}
                    stepData={stepDef}
                    ipsValues={m.ipsSnapshot}
                    onFieldChange={() => {}}
                    onStrategyChange={() => {}}
                    onSubmit={() => {}}
                    disabled={true}
                  />
                );
              }
              if (m.role === "portfolio_chart") {
                return (
                  <PortfolioChartMessage
                    key={m.id}
                    data={m.portfolioData}
                    onNewIPS={handleStartIPS}
                    onApply={() => handleApplyPortfolio(m.portfolioData)}
                    walletConnected={walletConnected}
                  />
                );
              }
              return (
                <Message
                  key={m.id}
                  role={m.role}
                  content={m.content}
                  typing={m.id === typingMsgId}
                  suggestions={m.suggestions}
                  showSuggestions={i === messages.length - 1 && ipsComplete}
                  onSuggestionClick={handleSuggestion}
                  tokenUsage={m.tokenUsage}
                  txHash={m.txHash}
                  txStatus={m.txStatus}
                />
              );
            })}

            {/* IPS Form (current active step — editable) */}
            {currentIPSStep && !ipsComplete && (
              <IPSFormMessage
                stepData={currentIPSStep}
                ipsValues={{ ...ipsValues, ...ipsFormValues }}
                onFieldChange={handleIPSFieldChange}
                onStrategyChange={handleIPSStrategyChange}
                onSubmit={handleIPSSubmit}
                disabled={false}
              />
            )}

            {/* Deposit form */}
            {depositForm && (
              <DepositFormMessage
                portfolioData={depositForm.portfolioData}
                onConfirm={handleConfirmDeposit}
                onCancel={handleCancelDeposit}
                walletConnected={walletConnected}
              />
            )}

            {/* Typing indicator */}
            {isTyping && (
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 24 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 10,
                  background: T.accent, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, color: "#fff", fontWeight: 700,
                }}>iF</div>
                <div style={{
                  background: T.card, borderRadius: 18, padding: "14px 18px",
                  display: "flex", gap: 5, border: `1px solid ${T.cardBorder}`,
                }}>
                  {[0, 1, 2].map((i) => (
                    <div key={i} style={{
                      width: 7, height: 7, borderRadius: "50%", background: T.textMuted,
                      animation: `dotPulse 1.4s ${i * 0.16}s infinite ease-in-out`,
                    }} />
                  ))}
                </div>
              </div>
            )}

            <div ref={endRef} />
          </div>
        </div>

        {/* Input area */}
        <div style={{
          padding: "16px 24px 20px",
          borderTop: `1px solid ${T.cardBorder}`,
          background: T.card,
          flexShrink: 0,
        }}>
          {(() => {
            const inputDisabled = !activeConvo || (!ipsComplete && ipsStep > 0);
            const canSend = input.trim() && !isTyping && !inputDisabled;
            return (
              <div style={{ maxWidth: 780, margin: "0 auto", display: "flex", gap: 10 }}>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && canSend && handleFreeInput()}
                  disabled={inputDisabled}
                  placeholder={inputDisabled ? "Complete your IPS to start chatting..." : "Ask about yield farming, risk analysis, or portfolio construction..."}
                  style={{
                    flex: 1, padding: "14px 18px", borderRadius: 14,
                    border: `1px solid ${T.cardBorder}`,
                    background: T.bgWarm, color: T.text,
                    fontSize: 14, outline: "none",
                    fontFamily: "'Inter', sans-serif",
                    transition: "border-color 0.15s ease",
                    opacity: inputDisabled ? 0.5 : 1,
                  }}
                  onFocus={(e) => { if (!inputDisabled) e.target.style.borderColor = "rgba(0,0,0,0.15)"; }}
                  onBlur={(e) => { e.target.style.borderColor = T.cardBorder; }}
                />
                <button
                  onClick={handleFreeInput}
                  disabled={!canSend}
                  style={{
                    width: 48, height: 48, borderRadius: 14,
                    border: "none", cursor: canSend ? "pointer" : "default",
                    background: canSend ? T.accent : T.bgWarm,
                    color: canSend ? "#fff" : T.textMuted,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.15s ease",
                    flexShrink: 0,
                  }}
                >{ChatIcons.send}</button>
              </div>
            );
          })()}
          <div style={{
            maxWidth: 780, margin: "8px auto 0",
            fontSize: 11, color: T.textMuted, textAlign: "center",
          }}>
            initFarm Agent uses verified on-chain data. This is a demo - no real transactions are executed.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <ChatErrorBoundary>
      <ChatPageInner />
    </ChatErrorBoundary>
  );
}
