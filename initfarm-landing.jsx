import { useState, useRef, useEffect } from "react";

/* ─── Design Tokens ─── */
const T = {
  bg: "#FAFAF8",
  bgWarm: "#F5F3EE",
  bgDark: "#1A1A1A",
  bgDarkCard: "#242424",
  bgDarkHover: "#2E2E2E",
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
  red: "#EF4444",
  cyan: "#06B6D4",
  radius: 12,
  radiusLg: 20,
};

/* ─── SVG Icons ─── */
const Icons = {
  verify: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  ),
  chart: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18"/>
      <path d="m19 9-5 5-4-4-3 3"/>
    </svg>
  ),
  bot: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="10" rx="2"/>
      <circle cx="12" cy="5" r="2"/>
      <path d="M12 7v4"/>
      <line x1="8" y1="16" x2="8" y2="16"/>
      <line x1="16" y1="16" x2="16" y2="16"/>
    </svg>
  ),
  monitor: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20v-6"/>
      <path d="M12 14a7 7 0 1 0 0-14 7 7 0 0 0 0 14z"/>
      <path d="M12 10V6"/>
      <path d="M12 6l3 3"/>
      <circle cx="12" cy="20" r="2"/>
    </svg>
  ),
  arrow: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8h10m-4-4 4 4-4 4"/>
    </svg>
  ),
  send: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
    </svg>
  ),
  close: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M18 6 6 18M6 6l12 12"/>
    </svg>
  ),
  wallet: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/>
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/>
      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>
    </svg>
  ),
};

/* ─── Wallet Logos ─── */
const WALLETS = [
  {
    name: "MetaMask",
    icon: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMjkuNC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogOS4wMyBCdWlsZCAwKSAgLS0+CjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiCgkgdmlld0JveD0iMCAwIDE0MiAxMzYuODc4IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxNDIgMTM2Ljg3ODsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8cGF0aCBzdHlsZT0iZmlsbDojRkY1QzE2OyIgZD0iTTEzMi42ODIsMTMyLjE5MmwtMzAuNTgzLTkuMTA2bC0yMy4wNjMsMTMuNzg3bC0xNi4wOTItMC4wMDdsLTIzLjA3Ny0xMy43OGwtMzAuNTY5LDkuMTA2TDAsMTAwLjgwMQoJbDkuMjk5LTM0LjgzOUwwLDM2LjUwN0w5LjI5OSwwbDQ3Ljc2NiwyOC41MzhoMjcuODVMMTMyLjY4MiwwbDkuMjk5LDM2LjUwN2wtOS4yOTksMjkuNDU1bDkuMjk5LDM0LjgzOUwxMzIuNjgyLDEzMi4xOTIKCUwxMzIuNjgyLDEzMi4xOTJ6Ii8+CjxwYXRoIHN0eWxlPSJmaWxsOiNGRjVDMTY7IiBkPSJNOS4zMDUsMGw0Ny43NjcsMjguNTU4bC0xLjg5OSwxOS41OTlMOS4zMDUsMHogTTM5Ljg3NSwxMDAuODE0bDIxLjAxNywxNi4wMWwtMjEuMDE3LDYuMjYxCglDMzkuODc1LDEyMy4wODUsMzkuODc1LDEwMC44MTQsMzkuODc1LDEwMC44MTR6IE01OS4yMTIsNzQuMzQ1bC00LjAzOS0yNi4xNzRMMjkuMzE3LDY1Ljk3bC0wLjAxNC0wLjAwN3YwLjAxM2wwLjA4LDE4LjMyMQoJbDEwLjQ4NS05Ljk1MUw1OS4yMTIsNzQuMzQ1TDU5LjIxMiw3NC4zNDV6IE0xMzIuNjgyLDBMODQuOTE1LDI4LjU1OGwxLjg5MywxOS41OTlMMTMyLjY4MiwweiBNMTAyLjExMywxMDAuODE0bC0yMS4wMTgsMTYuMDEKCWwyMS4wMTgsNi4yNjFWMTAwLjgxNHogTTExMi42NzgsNjUuOTc1aDAuMDA3SDExMi42Nzh2LTAuMDEzbC0wLjAwNiwwLjAwN0w4Ni44MTUsNDguMTcxbC00LjAzOSwyNi4xNzRoMTkuMzM2bDEwLjQ5Miw5Ljk1CglDMTEyLjYwNCw4NC4yOTUsMTEyLjY3OCw2NS45NzUsMTEyLjY3OCw2NS45NzV6Ii8+CjxwYXRoIHN0eWxlPSJmaWxsOiNFMzQ4MDc7IiBkPSJNMzkuODY4LDEyMy4wODVsLTMwLjU2OSw5LjEwNkwwLDEwMC44MTRoMzkuODY4QzM5Ljg2OCwxMDAuODE0LDM5Ljg2OCwxMjMuMDg1LDM5Ljg2OCwxMjMuMDg1egoJIE01OS4yMDUsNzQuMzM4bDUuODM5LDM3Ljg0bC04LjA5My0yMS4wNEwyOS4zNyw4NC4yOTVsMTAuNDkxLTkuOTU2aDE5LjM0NEw1OS4yMDUsNzQuMzM4eiBNMTAyLjExMiwxMjMuMDg1bDMwLjU3LDkuMTA2CglsOS4yOTktMzEuMzc4aC0zOS44NjlDMTAyLjExMiwxMDAuODE0LDEwMi4xMTIsMTIzLjA4NSwxMDIuMTEyLDEyMy4wODV6IE04Mi43NzYsNzQuMzM4bC01LjgzOSwzNy44NGw4LjA5Mi0yMS4wNGwyNy41ODMtNi44NDMKCWwtMTAuNDk4LTkuOTU2SDgyLjc3NlY3NC4zMzh6Ii8+CjxwYXRoIHN0eWxlPSJmaWxsOiNGRjhENUQ7IiBkPSJNMCwxMDAuODAxbDkuMjk5LTM0LjgzOWgxOS45OTdsMC4wNzMsMTguMzI3bDI3LjU4NCw2Ljg0M2w4LjA5MiwyMS4wMzlsLTQuMTYsNC42MzNsLTIxLjAxNy0xNi4wMUgwCglWMTAwLjgwMXogTTE0MS45ODEsMTAwLjgwMWwtOS4yOTktMzQuODM5aC0xOS45OThsLTAuMDczLDE4LjMyN2wtMjcuNTgyLDYuODQzbC04LjA5MywyMS4wMzlsNC4xNTksNC42MzNsMjEuMDE4LTE2LjAxaDM5Ljg2OAoJVjEwMC44MDF6IE04NC45MTUsMjguNTM4aC0yNy44NWwtMS44OTEsMTkuNTk5bDkuODcyLDY0LjAxM2gxMS44OTFsOS44NzgtNjQuMDEzTDg0LjkxNSwyOC41Mzh6Ii8+CjxwYXRoIHN0eWxlPSJmaWxsOiM2NjE4MDA7IiBkPSJNOS4yOTksMEwwLDM2LjUwN2w5LjI5OSwyOS40NTVoMTkuOTk3bDI1Ljg3LTE3LjgwNEw5LjI5OSwweiBNNTMuNDI2LDgxLjkzOGgtOS4wNTlsLTQuOTMyLDQuODM1CglsMTcuNTI0LDQuMzQ0bC0zLjUzMy05LjE4NlY4MS45Mzh6IE0xMzIuNjgyLDBsOS4yOTksMzYuNTA3bC05LjI5OSwyOS40NTVoLTE5Ljk5OEw4Ni44MTUsNDguMTU4TDEzMi42ODIsMHogTTg4LjU2OCw4MS45MzhoOS4wNzIKCWw0LjkzMiw0Ljg0MWwtMTcuNTQ0LDQuMzUzbDMuNTQtOS4yMDFWODEuOTM4eiBNNzkuMDI5LDEyNC4zODVsMi4wNjctNy41NjdsLTQuMTYtNC42MzNoLTExLjlsLTQuMTU5LDQuNjMzbDIuMDY2LDcuNTY3Ii8+CjxwYXRoIHN0eWxlPSJmaWxsOiNDMEM0Q0Q7IiBkPSJNNzkuMDI5LDEyNC4zODR2MTIuNDk1SDYyLjk0NXYtMTIuNDk1TDc5LjAyOSwxMjQuMzg0TDc5LjAyOSwxMjQuMzg0eiIvPgo8cGF0aCBzdHlsZT0iZmlsbDojRTdFQkY2OyIgZD0iTTM5Ljg3NSwxMjMuMDcybDIzLjA4MywxMy44di0xMi40OTVsLTIuMDY3LTcuNTY2QzYwLjg5MSwxMTYuODExLDM5Ljg3NSwxMjMuMDcyLDM5Ljg3NSwxMjMuMDcyegoJIE0xMDIuMTEzLDEyMy4wNzJsLTIzLjA4NCwxMy44di0xMi40OTVsMi4wNjctNy41NjZDODEuMDk2LDExNi44MTEsMTAyLjExMywxMjMuMDcyLDEwMi4xMTMsMTIzLjA3MnoiLz4KPC9zdmc+Cg==",
    desc: "Connect with MetaMask browser extension",
    color: "#F6851B",
  },
  {
    name: "Phantom",
    icon: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiB2aWV3Qm94PSIwIDAgMTI4IDEyOCIgZmlsbD0ibm9uZSI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiBmaWxsPSIjQUI5RkYyIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNTUuNjQxNiA4Mi4xNDc3QzUwLjg3NDQgODkuNDUyNSA0Mi44ODYyIDk4LjY5NjYgMzIuMjU2OCA5OC42OTY2QzI3LjIzMiA5OC42OTY2IDIyLjQwMDQgOTYuNjI4IDIyLjQwMDQgODcuNjQyNEMyMi40MDA0IDY0Ljc1ODQgNTMuNjQ0NSAyOS4zMzM1IDgyLjYzMzkgMjkuMzMzNUM5OS4xMjU3IDI5LjMzMzUgMTA1LjY5NyA0MC43NzU1IDEwNS42OTcgNTMuNzY4OUMxMDUuNjk3IDcwLjQ0NzEgOTQuODczOSA4OS41MTcxIDg0LjExNTYgODkuNTE3MUM4MC43MDEzIDg5LjUxNzEgNzkuMDI2NCA4Ny42NDI0IDc5LjAyNjQgODQuNjY4OEM3OS4wMjY0IDgzLjg5MzEgNzkuMTU1MiA4My4wNTI3IDc5LjQxMjkgODIuMTQ3N0M3NS43NDA5IDg4LjQxODIgNjguNjU0NiA5NC4yMzYxIDYyLjAxOTIgOTQuMjM2MUM1Ny4xODc3IDk0LjIzNjEgNTQuNzM5NyA5MS4xOTc5IDU0LjczOTcgODYuOTMxNEM1NC43Mzk3IDg1LjM3OTkgNTUuMDYxOCA4My43NjM4IDU1LjY0MTYgODIuMTQ3N1pNODAuNjEzMyA1My4zMTgyQzgwLjYxMzMgNTcuMTA0NCA3OC4zNzk1IDU4Ljk5NzUgNzUuODgwNiA1OC45OTc1QzczLjM0MzggNTguOTk3NSA3MS4xNDc5IDU3LjEwNDQgNzEuMTQ3OSA1My4zMTgyQzcxLjE0NzkgNDkuNTMyIDczLjM0MzggNDcuNjM4OSA3NS44ODA2IDQ3LjYzODlDNzguMzc5NSA0Ny42Mzg5IDgwLjYxMzMgNDkuNTMyIDgwLjYxMzMgNTMuMzE4MlpNOTQuODEwMiA1My4zMTg0Qzk0LjgxMDIgNTcuMTA0NiA5Mi41NzYzIDU4Ljk5NzcgOTAuMDc3NSA1OC45OTc3Qzg3LjU0MDcgNTguOTk3NyA4NS4zNDQ3IDU3LjEwNDYgODUuMzQ0NyA1My4zMTg0Qzg1LjM0NDcgNDkuNTMyMyA4Ny41NDA3IDQ3LjYzOTIgOTAuMDc3NSA0Ny42MzkyQzkyLjU3NjMgNDcuNjM5MiA5NC44MTAyIDQ5LjUzMjMgOTQuODEwMiA1My4zMTg0WiIgZmlsbD0iI0ZGRkRGOCIvPgo8L3N2Zz4=",
    desc: "Connect with Phantom wallet",
    color: "#AB9FF2",
  },
];

/* ─── Demo Chat Responses ─── */
const DEMO_RESPONSES = [
  {
    trigger: "portfolio",
    response: `Based on your risk profile, here's a recommended allocation:

Conservative (60%)
  Ethereum Staking (Lido) — 30%, APY 3.8%, Risk 2/10
  USDC Lending (Aave) — 30%, APY 5.2%, Risk 1/10

Growth (30%)
  Osmosis LP (ATOM/OSMO) — 15%, APY 18.4%, Risk 5/10
  Initia Staking — 15%, APY 14.2%, Risk 4/10

High-Yield (10%)
  DYM Staking — 10%, APY 17.05%, Risk 7/10

Portfolio Summary
  Blended APY: ~9.8%  |  Risk Score: 3.4/10
  Avg Lock-up: 21 days`,
  },
  {
    trigger: "risk",
    response: `Risk Assessment — 6-Factor Analysis

1. TVL — $2.4B locked, trending +12% (30d)
   Herfindahl Index: 0.08, Whale Risk: 3.2%

2. APY Stability — 90d volatility σ = 2.1%
   Coverage Ratio: 0.72 (revenue-backed)

3. Token Price — 30d: +8.4%, 90d: +22.1%
   Daily σ: 3.8%

4. Lock-up — 14 days, Risk Score: 4/10

Risk Delta
  Risk(δ) = 14.2% − 11.8% = 2.4%
  This gap is the risk premium in the advertised rate.`,
  },
  {
    trigger: "initia",
    response: `Initia Network — Yield Opportunity

Initia provides infrastructure for interwoven rollups with native staking support.

Metrics
  Staking APY: ~14.2%
  TVL Trend: Stable growth post-mainnet
  Unbonding: 7–21 days (flexible)

Why Initia?
  Native token integration with initFarm agent
  Transparent on-chain data for APY verification
  Multi-chain rollup architecture reduces single-point risk

APY Verification
  Own APY = f(TVL, Period, Concentration, Price, Lock-up)
  We independently verify actual vs. advertised yield.`,
  },
];

function getAIResponse(msg) {
  const l = msg.toLowerCase();
  for (const d of DEMO_RESPONSES) if (l.includes(d.trigger)) return d.response;
  return `I can analyze that for you using live on-chain data.

Current Market Snapshot
  Total DeFi TVL: $187.3B
  Avg Staking APY (Top 50): ~13.2%
  Min recommended lock-up: 7 days

I can help with:
  — Personalized portfolio construction
  — Protocol-level risk assessment
  — APY verification & sustainability
  — Initia ecosystem opportunities

Try asking about portfolio allocation, risk analysis, or Initia staking.`;
}

/* ─── Connect Wallet Side Panel ─── */
function WalletPanel({ onClose }) {
  const [connecting, setConnecting] = useState(null);
  const [connected, setConnected] = useState(null);

  const handleConnect = (walletName) => {
    setConnecting(walletName);
    setTimeout(() => {
      setConnecting(null);
      setConnected(walletName);
    }, 1800);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(26,26,26,0.25)", backdropFilter: "blur(16px)",
      display: "flex", justifyContent: "flex-end",
    }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        width: 400, height: "100%",
        background: T.bg,
        boxShadow: "-16px 0 48px rgba(0,0,0,0.08)",
        display: "flex", flexDirection: "column",
        animation: "slideIn 0.25s ease-out",
      }}>
        {/* Header */}
        <div style={{
          padding: "24px 28px 20px",
          borderBottom: `1px solid ${T.cardBorder}`,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: T.text, margin: 0 }}>
              Connect Wallet
            </h3>
            <p style={{ fontSize: 13, color: T.textMuted, margin: "4px 0 0" }}>
              Sign in to access your portfolio
            </p>
          </div>
          <button onClick={onClose} style={{
            width: 34, height: 34, borderRadius: 10,
            border: `1px solid ${T.cardBorder}`, background: "transparent",
            color: T.textMuted, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {Icons.close}
          </button>
        </div>

        {/* Wallet Options */}
        <div style={{ padding: 28, flex: 1 }}>
          {connected ? (
            <div style={{ textAlign: "center", paddingTop: 40 }}>
              <div style={{
                width: 64, height: 64, borderRadius: 20,
                background: T.greenSoft, border: `2px solid ${T.greenBorder}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 20px", fontSize: 28,
              }}>
                ✓
              </div>
              <h4 style={{ fontSize: 18, fontWeight: 600, color: T.text, margin: "0 0 8px" }}>
                Connected
              </h4>
              <p style={{ fontSize: 14, color: T.textSoft, margin: "0 0 8px" }}>
                {connected}
              </p>
              <p style={{
                fontSize: 13, color: T.textMuted,
                fontFamily: "'SF Mono', 'Fira Code', monospace",
                background: T.bgWarm, padding: "8px 14px", borderRadius: 8,
                display: "inline-block", marginTop: 8,
              }}>
                0x7a3F...e92B
              </p>
              <button onClick={() => { setConnected(null); }} style={{
                marginTop: 32, padding: "12px 28px", borderRadius: 100,
                border: `1px solid ${T.cardBorder}`, background: "transparent",
                color: T.textSoft, fontSize: 14, fontWeight: 500, cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
              }}>
                Disconnect
              </button>
            </div>
          ) : (
            <>
              <p style={{ fontSize: 13, color: T.textMuted, marginBottom: 20, fontWeight: 500, textTransform: "uppercase", letterSpacing: "1px" }}>
                Choose wallet
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {WALLETS.map((w) => (
                  <button
                    key={w.name}
                    onClick={() => handleConnect(w.name)}
                    disabled={!!connecting}
                    style={{
                      display: "flex", alignItems: "center", gap: 16,
                      padding: "18px 20px", borderRadius: 16,
                      border: `1px solid ${T.cardBorder}`,
                      background: connecting === w.name ? T.bgWarm : T.card,
                      cursor: connecting ? "default" : "pointer",
                      transition: "all 0.15s",
                      textAlign: "left", width: "100%",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    <div style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: T.bgWarm,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      overflow: "hidden", flexShrink: 0,
                    }}>
                      <img
                        src={w.icon} alt={w.name}
                        style={{ width: 28, height: 28, objectFit: "contain" }}
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.parentElement.style.background = w.color;
                          e.target.parentElement.innerHTML = `<span style="color:#fff;font-weight:700;font-size:16px">${w.name[0]}</span>`;
                        }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: T.text }}>{w.name}</div>
                      <div style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>{w.desc}</div>
                    </div>
                    {connecting === w.name ? (
                      <div style={{
                        width: 20, height: 20, border: `2px solid ${T.cardBorder}`,
                        borderTopColor: T.text, borderRadius: "50%",
                        animation: "spin 0.8s linear infinite",
                      }}/>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={T.textMuted} strokeWidth="1.5" strokeLinecap="round">
                        <path d="M6 4l4 4-4 4"/>
                      </svg>
                    )}
                  </button>
                ))}
              </div>

              <div style={{
                marginTop: 32, padding: "16px 20px", borderRadius: 12,
                background: T.bgWarm, border: `1px solid ${T.cardBorder}`,
              }}>
                <p style={{ fontSize: 13, color: T.textSoft, lineHeight: 1.6, margin: 0 }}>
                  By connecting your wallet, you agree to our Terms of Service and acknowledge that you have read our Privacy Policy.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Navbar ─── */
function Navbar({ onDemo, onWallet }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: "0 48px", height: 72,
      display: "flex", justifyContent: "space-between", alignItems: "center",
      background: scrolled ? "rgba(250,250,248,0.85)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(0,0,0,0.06)" : "1px solid transparent",
      transition: "all 0.3s ease",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 22, fontWeight: 700, color: T.text, letterSpacing: "-0.5px" }}>
          init<span style={{ fontWeight: 300 }}>Farm</span>
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        {["Features", "Pools", "Process"].map((t) => (
          <a key={t} href={`#${t.toLowerCase()}`} style={{
            color: T.textSoft, textDecoration: "none", fontSize: 14, fontWeight: 450,
            transition: "color 0.2s",
          }}>{t}</a>
        ))}
        <button onClick={onDemo} style={{
          padding: "10px 24px", borderRadius: 100, border: "none",
          background: T.accent, color: "#fff",
          fontWeight: 500, fontSize: 14, cursor: "pointer",
          transition: "opacity 0.2s",
        }}>
          Try Demo
        </button>
        <button onClick={onWallet} style={{
          padding: "10px 20px", borderRadius: 100,
          border: "1px solid rgba(255,255,255,0.45)",
          background: "rgba(245,243,238,0.45)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          color: T.text, fontWeight: 500, fontSize: 14, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 6,
          boxShadow: "0 1px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.5)",
          transition: "all 0.2s",
        }}>
          {Icons.wallet}
          Connect Wallet
        </button>
      </div>
    </nav>
  );
}

/* ─── Hero (with inline Pool Table below) ─── */
function Hero({ onDemo, onWallet }) {
  return (
    <section style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", textAlign: "center",
      padding: "140px 48px 80px", position: "relative",
      background: `linear-gradient(180deg, ${T.bg} 0%, ${T.bgWarm} 50%, #EDE8E0 100%)`,
    }}>
      {/* Subtle grid background */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.4,
        backgroundImage: `
          linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)
        `,
        backgroundSize: "64px 64px",
      }}/>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 720 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "6px 14px 6px 8px", borderRadius: 100,
          background: T.greenSoft, border: `1px solid ${T.greenBorder}`,
          marginBottom: 40,
        }}>
          <span style={{
            width: 20, height: 20, borderRadius: 100,
            background: T.green, color: "#fff",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 600,
          }}>
            ✓
          </span>
          <span style={{ fontSize: 13, fontWeight: 500, color: "#15803D" }}>
            Built on Initia Network
          </span>
        </div>

        <h1 style={{
          fontSize: 60, fontWeight: 600, lineHeight: 1.1,
          color: T.text, letterSpacing: "-2px", margin: "0 0 24px",
          fontFamily: "'Inter', sans-serif",
        }}>
          Smarter yield,<br/>verified on-chain
        </h1>

        <p style={{
          fontSize: 18, color: T.textSoft, lineHeight: 1.7,
          margin: "0 auto 48px", maxWidth: 520, fontWeight: 400,
        }}>
          initFarm analyzes DeFi protocols with on-chain data to verify APY claims,
          quantify risk, and build portfolios tailored to you.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button onClick={onDemo} style={{
            padding: "14px 32px", borderRadius: 100, border: "none",
            background: T.accent, color: "#fff",
            fontWeight: 500, fontSize: 15, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 8,
            transition: "transform 0.2s, box-shadow 0.2s",
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          }}>
            Launch Demo
            {Icons.arrow}
          </button>
          <button onClick={onWallet} style={{
            padding: "14px 32px", borderRadius: 100,
            border: "1px solid rgba(255,255,255,0.5)",
            background: "rgba(245,243,238,0.5)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            color: T.text, fontWeight: 500, fontSize: 15,
            cursor: "pointer",
            display: "flex", alignItems: "center", gap: 8,
            boxShadow: "0 2px 12px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.6)",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}>
            {Icons.wallet}
            Connect Wallet
          </button>
        </div>
      </div>
    </section>
  );
}

/* ─── Features ─── */
function Features() {
  const items = [
    {
      icon: Icons.verify, title: "APY Verification",
      desc: "We independently compute yields from on-chain data — TVL, revenue, fees — and compare against what protocols advertise. No more guessing.",
      tag: "Core Engine",
    },
    {
      icon: Icons.chart, title: "6-Factor Risk Model",
      desc: "Every protocol is scored across TVL stability, APY consistency, revenue coverage, whale concentration, token trends, and lock-up risk.",
      tag: "Risk Analysis",
    },
    {
      icon: Icons.bot, title: "AI Portfolio Agent",
      desc: "Describe your risk tolerance and goals in natural language. Our agent builds a diversified yield farming portfolio matched to your profile.",
      tag: "Intelligence",
    },
    {
      icon: Icons.monitor, title: "Continuous Monitoring",
      desc: "Track APY shifts, TVL outflows, and whale movements in real-time. Get alerts when risk thresholds change for your positions.",
      tag: "Monitoring",
    },
  ];

  return (
    <section id="features" style={{ padding: "100px 48px", maxWidth: 1120, margin: "0 auto", background: "transparent" }}>
      <div style={{ marginBottom: 64 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 12 }}>
          Capabilities
        </p>
        <h2 style={{ fontSize: 36, fontWeight: 600, color: T.text, letterSpacing: "-1px", margin: 0, maxWidth: 400 }}>
          What makes initFarm different
        </h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {items.map((item) => (
          <div key={item.title} style={{
            padding: 36, borderRadius: T.radiusLg,
            border: `1px solid ${T.cardBorder}`, background: T.card,
            transition: "box-shadow 0.3s ease",
          }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginBottom: 20,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: T.bgWarm, color: T.text,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {item.icon}
              </div>
              <span style={{
                fontSize: 11, fontWeight: 500, color: T.textMuted,
                padding: "4px 10px", borderRadius: 100,
                border: "1px solid rgba(0,0,0,0.08)",
              }}>
                {item.tag}
              </span>
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: T.text, margin: "0 0 10px" }}>
              {item.title}
            </h3>
            <p style={{ fontSize: 15, color: T.textSoft, lineHeight: 1.65, margin: 0 }}>
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Yield Distribution (Normal Distribution via SVG) ─── */
function normalPDF(x, mean, stddev) {
  const exp = -0.5 * Math.pow((x - mean) / stddev, 2);
  return (1 / (stddev * Math.sqrt(2 * Math.PI))) * Math.pow(Math.E, exp);
}

function generateDistPoints(mean, stddev, steps = 200) {
  const lo = mean - 4 * stddev;
  const hi = mean + 4 * stddev;
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const x = lo + (hi - lo) * (i / steps);
    pts.push({ x, y: normalPDF(x, mean, stddev) });
  }
  return pts;
}

function YieldDistChart({ nominal, real, stddev }) {
  const W = 520, H = 220, pad = { t: 20, r: 30, b: 50, l: 30 };
  const iw = W - pad.l - pad.r, ih = H - pad.t - pad.b;
  const pts = generateDistPoints(real, stddev);
  const maxY = Math.max(...pts.map(p => p.y));
  const minX = pts[0].x, maxX = pts[pts.length - 1].x;

  const sx = (x) => pad.l + ((x - minX) / (maxX - minX)) * iw;
  const sy = (y) => pad.t + ih - (y / maxY) * ih;

  const pathD = pts.map((p, i) => `${i === 0 ? "M" : "L"}${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)}`).join(" ");

  const prob68 = { lo: real - stddev, hi: real + stddev };
  const prob95 = { lo: real - 2 * stddev, hi: real + 2 * stddev };

  const fill95 = pts.filter(p => p.x >= prob95.lo && p.x <= prob95.hi);
  const fill95D = fill95.map((p, i) => `${i === 0 ? "M" : "L"}${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)}`).join(" ")
    + ` L${sx(prob95.hi).toFixed(1)},${sy(0).toFixed(1)} L${sx(prob95.lo).toFixed(1)},${sy(0).toFixed(1)} Z`;

  const fill68 = pts.filter(p => p.x >= prob68.lo && p.x <= prob68.hi);
  const fill68D = fill68.map((p, i) => `${i === 0 ? "M" : "L"}${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)}`).join(" ")
    + ` L${sx(prob68.hi).toFixed(1)},${sy(0).toFixed(1)} L${sx(prob68.lo).toFixed(1)},${sy(0).toFixed(1)} Z`;

  const ticks = [];
  const step = stddev;
  for (let v = real - 3 * stddev; v <= real + 3 * stddev + 0.001; v += step) {
    ticks.push(v);
  }

  return (
    <svg width={W} height={H} style={{ display: "block" }}>
      <path d={fill95D} fill="rgba(34,197,94,0.08)" />
      <path d={fill68D} fill="rgba(34,197,94,0.18)" />
      <path d={pathD} fill="none" stroke={T.green} strokeWidth="2" />
      <line x1={pad.l} y1={sy(0)} x2={W - pad.r} y2={sy(0)} stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
      {ticks.map((v, i) => (
        <g key={i}>
          <line x1={sx(v)} y1={sy(0)} x2={sx(v)} y2={sy(0) + 4} stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
          <text x={sx(v)} y={sy(0) + 18} textAnchor="middle" fontSize="10" fill={T.textMuted} fontFamily="Inter, sans-serif">
            {v.toFixed(1)}%
          </text>
        </g>
      ))}
      <line x1={sx(real)} y1={pad.t} x2={sx(real)} y2={sy(0)} stroke={T.green} strokeWidth="1.5" strokeDasharray="4,3" />
      <text x={sx(real)} y={pad.t - 6} textAnchor="middle" fontSize="11" fill={T.green} fontWeight="600" fontFamily="Inter, sans-serif">
        Real {real.toFixed(1)}%
      </text>
      {Math.abs(nominal - real) > 0.2 && (
        <>
          <line x1={sx(nominal)} y1={pad.t + 10} x2={sx(nominal)} y2={sy(0)} stroke={T.orange} strokeWidth="1.5" strokeDasharray="4,3" />
          <text x={sx(nominal)} y={pad.t + 4} textAnchor="middle" fontSize="11" fill={T.orange} fontWeight="600" fontFamily="Inter, sans-serif">
            Nominal {nominal.toFixed(1)}%
          </text>
        </>
      )}
      <text x={sx(real)} y={sy(0) + 38} textAnchor="middle" fontSize="10" fill={T.textSoft} fontFamily="Inter, sans-serif">
        68% → [{prob68.lo.toFixed(1)}%, {prob68.hi.toFixed(1)}%]  ·  95% → [{prob95.lo.toFixed(1)}%, {prob95.hi.toFixed(1)}%]
      </text>
    </svg>
  );
}

/* ─── Token Logo URLs (CoinGecko CDN) ─── */
const LOGO = {
  ETH: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4KPCEtLSBDcmVhdG9yOiBDb3JlbERSQVcgMjAxOSAoNjQtQml0KSAtLT4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZlcnNpb249IjEuMSIgc2hhcGUtcmVuZGVyaW5nPSJnZW9tZXRyaWNQcmVjaXNpb24iIHRleHQtcmVuZGVyaW5nPSJnZW9tZXRyaWNQcmVjaXNpb24iIGltYWdlLXJlbmRlcmluZz0ib3B0aW1pemVRdWFsaXR5IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIKdmlld0JveD0iMCAwIDc4NC4zNyAxMjc3LjM5IgogeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiCiB4bWxuczp4b2RtPSJodHRwOi8vd3d3LmNvcmVsLmNvbS9jb3JlbGRyYXcvb2RtLzIwMDMiPgogPGcgaWQ9IkxheWVyX3gwMDIwXzEiPgogIDxtZXRhZGF0YSBpZD0iQ29yZWxDb3JwSURfMENvcmVsLUxheWVyIi8+CiAgPGcgaWQ9Il8xNDIxMzk0MzQyNDAwIj4KICAgPGc+CiAgICA8cG9seWdvbiBmaWxsPSIjMzQzNDM0IiBmaWxsLXJ1bGU9Im5vbnplcm8iIHBvaW50cz0iMzkyLjA3LDAgMzgzLjUsMjkuMTEgMzgzLjUsODczLjc0IDM5Mi4wNyw4ODIuMjkgNzg0LjEzLDY1MC41NCAiLz4KICAgIDxwb2x5Z29uIGZpbGw9IiM4QzhDOEMiIGZpbGwtcnVsZT0ibm9uemVybyIgcG9pbnRzPSIzOTIuMDcsMCAtMCw2NTAuNTQgMzkyLjA3LDg4Mi4yOSAzOTIuMDcsNDcyLjMzICIvPgogICAgPHBvbHlnb24gZmlsbD0iIzNDM0MzQiIgZmlsbC1ydWxlPSJub256ZXJvIiBwb2ludHM9IjM5Mi4wNyw5NTYuNTIgMzg3LjI0LDk2Mi40MSAzODcuMjQsMTI2My4yOCAzOTIuMDcsMTI3Ny4zOCA3ODQuMzcsNzI0Ljg5ICIvPgogICAgPHBvbHlnb24gZmlsbD0iIzhDOEM4QyIgZmlsbC1ydWxlPSJub256ZXJvIiBwb2ludHM9IjM5Mi4wNywxMjc3LjM4IDM5Mi4wNyw5NTYuNTIgLTAsNzI0Ljg5ICIvPgogICAgPHBvbHlnb24gZmlsbD0iIzE0MTQxNCIgZmlsbC1ydWxlPSJub256ZXJvIiBwb2ludHM9IjM5Mi4wNyw4ODIuMjkgNzg0LjEzLDY1MC41NCAzOTIuMDcsNDcyLjMzICIvPgogICAgPHBvbHlnb24gZmlsbD0iIzM5MzkzOSIgZmlsbC1ydWxlPSJub256ZXJvIiBwb2ludHM9IjAsNjUwLjU0IDM5Mi4wNyw4ODIuMjkgMzkyLjA3LDQ3Mi4zMyAiLz4KICAgPC9nPgogIDwvZz4KIDwvZz4KPC9zdmc+Cg==",
  WBETH: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4KPCEtLSBDcmVhdG9yOiBDb3JlbERSQVcgMjAxOSAoNjQtQml0KSAtLT4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZlcnNpb249IjEuMSIgc2hhcGUtcmVuZGVyaW5nPSJnZW9tZXRyaWNQcmVjaXNpb24iIHRleHQtcmVuZGVyaW5nPSJnZW9tZXRyaWNQcmVjaXNpb24iIGltYWdlLXJlbmRlcmluZz0ib3B0aW1pemVRdWFsaXR5IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIKdmlld0JveD0iMCAwIDc4NC4zNyAxMjc3LjM5IgogeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiCiB4bWxuczp4b2RtPSJodHRwOi8vd3d3LmNvcmVsLmNvbS9jb3JlbGRyYXcvb2RtLzIwMDMiPgogPGcgaWQ9IkxheWVyX3gwMDIwXzEiPgogIDxtZXRhZGF0YSBpZD0iQ29yZWxDb3JwSURfMENvcmVsLUxheWVyIi8+CiAgPGcgaWQ9Il8xNDIxMzk0MzQyNDAwIj4KICAgPGc+CiAgICA8cG9seWdvbiBmaWxsPSIjMzQzNDM0IiBmaWxsLXJ1bGU9Im5vbnplcm8iIHBvaW50cz0iMzkyLjA3LDAgMzgzLjUsMjkuMTEgMzgzLjUsODczLjc0IDM5Mi4wNyw4ODIuMjkgNzg0LjEzLDY1MC41NCAiLz4KICAgIDxwb2x5Z29uIGZpbGw9IiM4QzhDOEMiIGZpbGwtcnVsZT0ibm9uemVybyIgcG9pbnRzPSIzOTIuMDcsMCAtMCw2NTAuNTQgMzkyLjA3LDg4Mi4yOSAzOTIuMDcsNDcyLjMzICIvPgogICAgPHBvbHlnb24gZmlsbD0iIzNDM0MzQiIgZmlsbC1ydWxlPSJub256ZXJvIiBwb2ludHM9IjM5Mi4wNyw5NTYuNTIgMzg3LjI0LDk2Mi40MSAzODcuMjQsMTI2My4yOCAzOTIuMDcsMTI3Ny4zOCA3ODQuMzcsNzI0Ljg5ICIvPgogICAgPHBvbHlnb24gZmlsbD0iIzhDOEM4QyIgZmlsbC1ydWxlPSJub256ZXJvIiBwb2ludHM9IjM5Mi4wNywxMjc3LjM4IDM5Mi4wNyw5NTYuNTIgLTAsNzI0Ljg5ICIvPgogICAgPHBvbHlnb24gZmlsbD0iIzE0MTQxNCIgZmlsbC1ydWxlPSJub256ZXJvIiBwb2ludHM9IjM5Mi4wNyw4ODIuMjkgNzg0LjEzLDY1MC41NCAzOTIuMDcsNDcyLjMzICIvPgogICAgPHBvbHlnb24gZmlsbD0iIzM5MzkzOSIgZmlsbC1ydWxlPSJub256ZXJvIiBwb2ludHM9IjAsNjUwLjU0IDM5Mi4wNyw4ODIuMjkgMzkyLjA3LDQ3Mi4zMyAiLz4KICAgPC9nPgogIDwvZz4KIDwvZz4KPC9zdmc+Cg==",
  weETH: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4KPCEtLSBDcmVhdG9yOiBDb3JlbERSQVcgMjAxOSAoNjQtQml0KSAtLT4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZlcnNpb249IjEuMSIgc2hhcGUtcmVuZGVyaW5nPSJnZW9tZXRyaWNQcmVjaXNpb24iIHRleHQtcmVuZGVyaW5nPSJnZW9tZXRyaWNQcmVjaXNpb24iIGltYWdlLXJlbmRlcmluZz0ib3B0aW1pemVRdWFsaXR5IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIKdmlld0JveD0iMCAwIDc4NC4zNyAxMjc3LjM5IgogeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiCiB4bWxuczp4b2RtPSJodHRwOi8vd3d3LmNvcmVsLmNvbS9jb3JlbGRyYXcvb2RtLzIwMDMiPgogPGcgaWQ9IkxheWVyX3gwMDIwXzEiPgogIDxtZXRhZGF0YSBpZD0iQ29yZWxDb3JwSURfMENvcmVsLUxheWVyIi8+CiAgPGcgaWQ9Il8xNDIxMzk0MzQyNDAwIj4KICAgPGc+CiAgICA8cG9seWdvbiBmaWxsPSIjMzQzNDM0IiBmaWxsLXJ1bGU9Im5vbnplcm8iIHBvaW50cz0iMzkyLjA3LDAgMzgzLjUsMjkuMTEgMzgzLjUsODczLjc0IDM5Mi4wNyw4ODIuMjkgNzg0LjEzLDY1MC41NCAiLz4KICAgIDxwb2x5Z29uIGZpbGw9IiM4QzhDOEMiIGZpbGwtcnVsZT0ibm9uemVybyIgcG9pbnRzPSIzOTIuMDcsMCAtMCw2NTAuNTQgMzkyLjA3LDg4Mi4yOSAzOTIuMDcsNDcyLjMzICIvPgogICAgPHBvbHlnb24gZmlsbD0iIzNDM0MzQiIgZmlsbC1ydWxlPSJub256ZXJvIiBwb2ludHM9IjM5Mi4wNyw5NTYuNTIgMzg3LjI0LDk2Mi40MSAzODcuMjQsMTI2My4yOCAzOTIuMDcsMTI3Ny4zOCA3ODQuMzcsNzI0Ljg5ICIvPgogICAgPHBvbHlnb24gZmlsbD0iIzhDOEM4QyIgZmlsbC1ydWxlPSJub256ZXJvIiBwb2ludHM9IjM5Mi4wNywxMjc3LjM4IDM5Mi4wNyw5NTYuNTIgLTAsNzI0Ljg5ICIvPgogICAgPHBvbHlnb24gZmlsbD0iIzE0MTQxNCIgZmlsbC1ydWxlPSJub256ZXJvIiBwb2ludHM9IjM5Mi4wNyw4ODIuMjkgNzg0LjEzLDY1MC41NCAzOTIuMDcsNDcyLjMzICIvPgogICAgPHBvbHlnb24gZmlsbD0iIzM5MzkzOSIgZmlsbC1ydWxlPSJub256ZXJvIiBwb2ludHM9IjAsNjUwLjU0IDM5Mi4wNyw4ODIuMjkgMzkyLjA3LDQ3Mi4zMyAiLz4KICAgPC9nPgogIDwvZz4KIDwvZz4KPC9zdmc+Cg==",
  USDS: "data:image/svg+xml;base64,PHN2ZyBkYXRhLW5hbWU9Ijg2OTc3Njg0LTEyZGItNDg1MC04ZjMwLTIzM2E3YzI2N2QxMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMjAwMCAyMDAwIj4KICA8cGF0aCBkPSJNMTAwMCAyMDAwYzU1NC4xNyAwIDEwMDAtNDQ1LjgzIDEwMDAtMTAwMFMxNTU0LjE3IDAgMTAwMCAwIDAgNDQ1LjgzIDAgMTAwMHM0NDUuODMgMTAwMCAxMDAwIDEwMDB6IiBmaWxsPSIjMjc3NWNhIi8+CiAgPHBhdGggZD0iTTEyNzUgMTE1OC4zM2MwLTE0NS44My04Ny41LTE5NS44My0yNjIuNS0yMTYuNjYtMTI1LTE2LjY3LTE1MC01MC0xNTAtMTA4LjM0czQxLjY3LTk1LjgzIDEyNS05NS44M2M3NSAwIDExNi42NyAyNSAxMzcuNSA4Ny41IDQuMTcgMTIuNSAxNi42NyAyMC44MyAyOS4xNyAyMC44M2g2Ni42NmMxNi42NyAwIDI5LjE3LTEyLjUgMjkuMTctMjkuMTZ2LTQuMTdjLTE2LjY3LTkxLjY3LTkxLjY3LTE2Mi41LTE4Ny41LTE3MC44M3YtMTAwYzAtMTYuNjctMTIuNS0yOS4xNy0zMy4zMy0zMy4zNGgtNjIuNWMtMTYuNjcgMC0yOS4xNyAxMi41LTMzLjM0IDMzLjM0djk1LjgzYy0xMjUgMTYuNjctMjA0LjE2IDEwMC0yMDQuMTYgMjA0LjE3IDAgMTM3LjUgODMuMzMgMTkxLjY2IDI1OC4zMyAyMTIuNSAxMTYuNjcgMjAuODMgMTU0LjE3IDQ1LjgzIDE1NC4xNyAxMTIuNXMtNTguMzQgMTEyLjUtMTM3LjUgMTEyLjVjLTEwOC4zNCAwLTE0NS44NC00NS44NC0xNTguMzQtMTA4LjM0LTQuMTYtMTYuNjYtMTYuNjYtMjUtMjkuMTYtMjVoLTcwLjg0Yy0xNi42NiAwLTI5LjE2IDEyLjUtMjkuMTYgMjkuMTd2NC4xN2MxNi42NiAxMDQuMTYgODMuMzMgMTc5LjE2IDIyMC44MyAyMDB2MTAwYzAgMTYuNjYgMTIuNSAyOS4xNiAzMy4zMyAzMy4zM2g2Mi41YzE2LjY3IDAgMjkuMTctMTIuNSAzMy4zNC0zMy4zM3YtMTAwYzEyNS0yMC44NCAyMDguMzMtMTA4LjM0IDIwOC4zMy0yMjAuODR6IiBmaWxsPSIjZmZmIi8+CiAgPHBhdGggZD0iTTc4Ny41IDE1OTUuODNjLTMyNS0xMTYuNjYtNDkxLjY3LTQ3OS4xNi0zNzAuODMtODAwIDYyLjUtMTc1IDIwMC0zMDguMzMgMzcwLjgzLTM3MC44MyAxNi42Ny04LjMzIDI1LTIwLjgzIDI1LTQxLjY3VjMyNWMwLTE2LjY3LTguMzMtMjkuMTctMjUtMzMuMzMtNC4xNyAwLTEyLjUgMC0xNi42NyA0LjE2LTM5NS44MyAxMjUtNjEyLjUgNTQ1Ljg0LTQ4Ny41IDk0MS42NyA3NSAyMzMuMzMgMjU0LjE3IDQxMi41IDQ4Ny41IDQ4Ny41IDE2LjY3IDguMzMgMzMuMzQgMCAzNy41LTE2LjY3IDQuMTctNC4xNiA0LjE3LTguMzMgNC4xNy0xNi42NnYtNTguMzRjMC0xMi41LTEyLjUtMjkuMTYtMjUtMzcuNXpNMTIyOS4xNyAyOTUuODNjLTE2LjY3LTguMzMtMzMuMzQgMC0zNy41IDE2LjY3LTQuMTcgNC4xNy00LjE3IDguMzMtNC4xNyAxNi42N3Y1OC4zM2MwIDE2LjY3IDEyLjUgMzMuMzMgMjUgNDEuNjcgMzI1IDExNi42NiA0OTEuNjcgNDc5LjE2IDM3MC44MyA4MDAtNjIuNSAxNzUtMjAwIDMwOC4zMy0zNzAuODMgMzcwLjgzLTE2LjY3IDguMzMtMjUgMjAuODMtMjUgNDEuNjdWMTcwMGMwIDE2LjY3IDguMzMgMjkuMTcgMjUgMzMuMzMgNC4xNyAwIDEyLjUgMCAxNi42Ny00LjE2IDM5NS44My0xMjUgNjEyLjUtNTQ1Ljg0IDQ4Ny41LTk0MS42Ny03NS0yMzcuNS0yNTguMzQtNDE2LjY3LTQ4Ny41LTQ5MS42N3oiIGZpbGw9IiNmZmYiLz4KPC9zdmc+Cg==",
  USDe: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI0LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCAzOTcuMSAzOTcuMSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMzk3LjEgMzk3LjE7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCS5zdDB7ZmlsbDojMTExMTExO3N0cm9rZTojMTExMTExO3N0cm9rZS13aWR0aDo3LjA1MzY7fQoJLnN0MXtmaWxsOnVybCgjU1ZHSURfMV8pO2ZpbGwtb3BhY2l0eTowLjc7fQoJLnN0MntmaWxsOm5vbmU7c3Ryb2tlOnVybCgjU1ZHSURfMl8pO3N0cm9rZS13aWR0aDo3LjE0Mjk7fQoJLnN0M3tmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDtmaWxsOiNGRkZGRkY7fQoJLnN0NHtmaWxsOiNGRkZGRkY7fQo8L3N0eWxlPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTk4LjYsNy4xTDE5OC42LDcuMWMxMDUuOCwwLDE5MS41LDg1LjcsMTkxLjUsMTkxLjV2MGMwLDEwNS43LTg1LjcsMTkxLjUtMTkxLjUsMTkxLjVoMAoJQzkyLjgsMzkwLjEsNy4xLDMwNC4zLDcuMSwxOTguNnYwQzcuMSw5Mi44LDkyLjgsNy4xLDE5OC42LDcuMXoiLz4KPHJhZGlhbEdyYWRpZW50IGlkPSJTVkdJRF8xXyIgY3g9Ii0xMDUuOTQ4NyIgY3k9IjU5NS45Mzc3IiByPSIxIiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDIuNTE3NTc0ZS0xNCA0MTEuMTUxIDI4OS40MDkgLTEuNzcyMTE5ZS0xNCAtMTcyMjcwLjc1IDQzNjIxLjQxOCkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KCTxzdG9wICBvZmZzZXQ9IjMuMTI1MDAwZS0wMiIgc3R5bGU9InN0b3AtY29sb3I6IzNBM0EzQSIvPgoJPHN0b3AgIG9mZnNldD0iMSIgc3R5bGU9InN0b3AtY29sb3I6IzFDMUMxQyIvPgo8L3JhZGlhbEdyYWRpZW50Pgo8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTk4LjYsMy42TDE5OC42LDMuNmMtMTA3LjcsMC0xOTUsODcuMy0xOTUsMTk1djBjMCwxMDcuNyw4Ny4zLDE5NSwxOTUsMTk1aDBjMTA3LjcsMCwxOTUtODcuMywxOTUtMTk1djAKCUMzOTMuNiw5MC45LDMwNi4zLDMuNiwxOTguNiwzLjZ6Ii8+CjxsaW5lYXJHcmFkaWVudCBpZD0iU1ZHSURfMl8iIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4MT0iMTk4LjU3NDUiIHkxPSIzOTkuMTQyOSIgeDI9IjE5OC41NzQ1IiB5Mj0iMS45OTQiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMSAwIDAgLTEgMCAzOTkuMTQyOSkiPgoJPHN0b3AgIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6I0ZGRkZGRiIvPgoJPHN0b3AgIG9mZnNldD0iMSIgc3R5bGU9InN0b3AtY29sb3I6IzExMTExMSIvPgo8L2xpbmVhckdyYWRpZW50Pgo8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMTk4LjYsMy42TDE5OC42LDMuNmMtMTA3LjcsMC0xOTUsODcuMy0xOTUsMTk1djBjMCwxMDcuNyw4Ny4zLDE5NSwxOTUsMTk1aDBjMTA3LjcsMCwxOTUtODcuMywxOTUtMTk1djAKCUMzOTMuNiw5MC45LDMwNi4zLDMuNiwxOTguNiwzLjZ6Ii8+CjxwYXRoIGNsYXNzPSJzdDMiIGQ9Ik0xNjcuNCwzOC4xQzkyLjEsNTIuNiwzNS4yLDExOC45LDM1LjIsMTk4LjRzNTYuOSwxNDUuOCwxMzIuMiwxNjAuM3YtMTUuM2MtNjctMTQuMy0xMTcuMi03My44LTExNy4yLTE0NQoJczUwLjItMTMwLjcsMTE3LjItMTQ1VjM4LjF6IE0yMjkuOCw1My41VjM4LjJjNzUuMiwxNC42LDEzMS45LDgwLjgsMTMxLjksMTYwLjJzLTU2LjcsMTQ1LjYtMTMxLjksMTYwLjJ2LTE1LjMKCWM2Ni44LTE0LjQsMTE2LjktNzMuOCwxMTYuOS0xNDQuOVMyOTYuNiw2Ny45LDIyOS44LDUzLjV6Ii8+CjxwYXRoIGNsYXNzPSJzdDQiIGQ9Ik0yMjEuNywxOTNjMTIuNSwyLjQsMjIuMSw3LDI5LDEzLjdjNi45LDYuNiwxMC4zLDE1LjEsMTAuMywyNS40djE2LjNjMCwxMi40LTQuNSwyMi40LTEzLjQsMzAKCWMtOC45LDcuNS0yMC43LDExLjItMzUuMiwxMS4yaC01djI1LjloLTE3LjJ2LTI1LjloLTUuM2MtOS42LDAtMTgtMi4xLTI1LjQtNi40Yy03LjMtNC40LTEzLjEtMTAuNS0xNy4yLTE4LjNjLTQtOC02LTE3LjEtNi0yNy41CgloMTcuMmMwLDEwLjUsMi45LDE5LjEsOC42LDI1LjdjNS45LDYuNCwxMy43LDkuNywyMy4yLDkuN2gyNi42YzkuNCwwLDE3LTIuMiwyMi44LTYuNmM1LjctNC42LDguNi0xMC41LDguNi0xNy44di0xNi4zCgljMC01LjgtMi4yLTEwLjctNi41LTE0LjhjLTQuMi00LjEtOS45LTYuNy0xNy4yLTcuOWwtNDMuMS03LjZjLTEyLjEtMi4yLTIxLjYtNi44LTI4LjMtMTMuN2MtNi43LTctMTAuMS0xNS43LTEwLjEtMjYuMnYtMTMuNwoJYzAtMTIuNCw0LjMtMjIuMiwxMi45LTI5LjVjOC44LTcuNSwyMC40LTExLjIsMzQuNy0xMS4yaDQuM1Y4MS42aDE3LjJ2MjUuOWg1LjVjMTMuNiwwLDI0LjUsNC40LDMyLjgsMTMuMgoJYzguMyw4LjYsMTIuNSwyMC4xLDEyLjUsMzQuM2gtMTcuMmMwLTkuMy0yLjYtMTYuOC03LjctMjIuNGMtNS4xLTUuNi0xMS45LTguNC0yMC40LTguNGgtMjcuMWMtOS4xLDAtMTYuNCwyLjItMjEuOCw2LjYKCWMtNS40LDQuMi04LjEsMTAtOC4xLDE3LjN2MTMuN2MwLDUuOSwyLDEwLjksNiwxNWM0LjIsNC4xLDkuOCw2LjgsMTcsOC4xTDIyMS43LDE5M3oiLz4KPC9zdmc+Cg==",
  USDC: "data:image/svg+xml;base64,PHN2ZyBkYXRhLW5hbWU9Ijg2OTc3Njg0LTEyZGItNDg1MC04ZjMwLTIzM2E3YzI2N2QxMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMjAwMCAyMDAwIj4KICA8cGF0aCBkPSJNMTAwMCAyMDAwYzU1NC4xNyAwIDEwMDAtNDQ1LjgzIDEwMDAtMTAwMFMxNTU0LjE3IDAgMTAwMCAwIDAgNDQ1LjgzIDAgMTAwMHM0NDUuODMgMTAwMCAxMDAwIDEwMDB6IiBmaWxsPSIjMjc3NWNhIi8+CiAgPHBhdGggZD0iTTEyNzUgMTE1OC4zM2MwLTE0NS44My04Ny41LTE5NS44My0yNjIuNS0yMTYuNjYtMTI1LTE2LjY3LTE1MC01MC0xNTAtMTA4LjM0czQxLjY3LTk1LjgzIDEyNS05NS44M2M3NSAwIDExNi42NyAyNSAxMzcuNSA4Ny41IDQuMTcgMTIuNSAxNi42NyAyMC44MyAyOS4xNyAyMC44M2g2Ni42NmMxNi42NyAwIDI5LjE3LTEyLjUgMjkuMTctMjkuMTZ2LTQuMTdjLTE2LjY3LTkxLjY3LTkxLjY3LTE2Mi41LTE4Ny41LTE3MC44M3YtMTAwYzAtMTYuNjctMTIuNS0yOS4xNy0zMy4zMy0zMy4zNGgtNjIuNWMtMTYuNjcgMC0yOS4xNyAxMi41LTMzLjM0IDMzLjM0djk1LjgzYy0xMjUgMTYuNjctMjA0LjE2IDEwMC0yMDQuMTYgMjA0LjE3IDAgMTM3LjUgODMuMzMgMTkxLjY2IDI1OC4zMyAyMTIuNSAxMTYuNjcgMjAuODMgMTU0LjE3IDQ1LjgzIDE1NC4xNyAxMTIuNXMtNTguMzQgMTEyLjUtMTM3LjUgMTEyLjVjLTEwOC4zNCAwLTE0NS44NC00NS44NC0xNTguMzQtMTA4LjM0LTQuMTYtMTYuNjYtMTYuNjYtMjUtMjkuMTYtMjVoLTcwLjg0Yy0xNi42NiAwLTI5LjE2IDEyLjUtMjkuMTYgMjkuMTd2NC4xN2MxNi42NiAxMDQuMTYgODMuMzMgMTc5LjE2IDIyMC44MyAyMDB2MTAwYzAgMTYuNjYgMTIuNSAyOS4xNiAzMy4zMyAzMy4zM2g2Mi41YzE2LjY3IDAgMjkuMTctMTIuNSAzMy4zNC0zMy4zM3YtMTAwYzEyNS0yMC44NCAyMDguMzMtMTA4LjM0IDIwOC4zMy0yMjAuODR6IiBmaWxsPSIjZmZmIi8+CiAgPHBhdGggZD0iTTc4Ny41IDE1OTUuODNjLTMyNS0xMTYuNjYtNDkxLjY3LTQ3OS4xNi0zNzAuODMtODAwIDYyLjUtMTc1IDIwMC0zMDguMzMgMzcwLjgzLTM3MC44MyAxNi42Ny04LjMzIDI1LTIwLjgzIDI1LTQxLjY3VjMyNWMwLTE2LjY3LTguMzMtMjkuMTctMjUtMzMuMzMtNC4xNyAwLTEyLjUgMC0xNi42NyA0LjE2LTM5NS44MyAxMjUtNjEyLjUgNTQ1Ljg0LTQ4Ny41IDk0MS42NyA3NSAyMzMuMzMgMjU0LjE3IDQxMi41IDQ4Ny41IDQ4Ny41IDE2LjY3IDguMzMgMzMuMzQgMCAzNy41LTE2LjY3IDQuMTctNC4xNiA0LjE3LTguMzMgNC4xNy0xNi42NnYtNTguMzRjMC0xMi41LTEyLjUtMjkuMTYtMjUtMzcuNXpNMTIyOS4xNyAyOTUuODNjLTE2LjY3LTguMzMtMzMuMzQgMC0zNy41IDE2LjY3LTQuMTcgNC4xNy00LjE3IDguMzMtNC4xNyAxNi42N3Y1OC4zM2MwIDE2LjY3IDEyLjUgMzMuMzMgMjUgNDEuNjcgMzI1IDExNi42NiA0OTEuNjcgNDc5LjE2IDM3MC44MyA4MDAtNjIuNSAxNzUtMjAwIDMwOC4zMy0zNzAuODMgMzcwLjgzLTE2LjY3IDguMzMtMjUgMjAuODMtMjUgNDEuNjdWMTcwMGMwIDE2LjY3IDguMzMgMjkuMTcgMjUgMzMuMzMgNC4xNyAwIDEyLjUgMCAxNi42Ny00LjE2IDM5NS44My0xMjUgNjEyLjUtNTQ1Ljg0IDQ4Ny41LTk0MS42Ny03NS0yMzcuNS0yNTguMzQtNDE2LjY3LTQ4Ny41LTQ5MS42N3oiIGZpbGw9IiNmZmYiLz4KPC9zdmc+Cg==",
  DOT: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI2LjAuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxvZ28iIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCAxMzI2LjEgMTQxMC4zIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxMzI2LjEgMTQxMC4zOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGw6I0U2MDA3QTt9Cjwvc3R5bGU+CjxlbGxpcHNlIGNsYXNzPSJzdDAiIGN4PSI2NjMiIGN5PSIxNDcuOSIgcng9IjI1NC4zIiByeT0iMTQ3LjkiLz4KPGVsbGlwc2UgY2xhc3M9InN0MCIgY3g9IjY2MyIgY3k9IjEyNjIuMyIgcng9IjI1NC4zIiByeT0iMTQ3LjkiLz4KPGVsbGlwc2UgdHJhbnNmb3JtPSJtYXRyaXgoMC41IC0wLjg2NiAwLjg2NiAwLjUgLTI3OS4xNTEyIDM2OS41OTE2KSIgY2xhc3M9InN0MCIgY3g9IjE4MC41IiBjeT0iNDI2LjUiIHJ4PSIyNTQuMyIgcnk9IjE0OCIvPgo8ZWxsaXBzZSB0cmFuc2Zvcm09Im1hdHJpeCgwLjUgLTAuODY2IDAuODY2IDAuNSAtMjc5LjE1NTIgMTQ4My45NTE3KSIgY2xhc3M9InN0MCIgY3g9IjExNDUuNiIgY3k9Ijk4My43IiByeD0iMjU0LjMiIHJ5PSIxNDcuOSIvPgo8ZWxsaXBzZSB0cmFuc2Zvcm09Im1hdHJpeCgwLjg2NiAtMC41IDAuNSAwLjg2NiAtNDY3LjY3OTggMjIyLjA0NCkiIGNsYXNzPSJzdDAiIGN4PSIxODAuNSIgY3k9Ijk4My43IiByeD0iMTQ4IiByeT0iMjU0LjMiLz4KPGVsbGlwc2UgdHJhbnNmb3JtPSJtYXRyaXgoMC44NjYgLTAuNSAwLjUgMC44NjYgLTU5LjgwMDcgNjI5LjkyNTQpIiBjbGFzcz0ic3QwIiBjeD0iMTE0NS42IiBjeT0iNDI2LjYiIHJ4PSIxNDcuOSIgcnk9IjI1NC4zIi8+Cjwvc3ZnPgo=",
  SOL: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI0LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCAzOTcuNyAzMTEuNyIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMzk3LjcgMzExLjc7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCS5zdDB7ZmlsbDp1cmwoI1NWR0lEXzFfKTt9Cgkuc3Qxe2ZpbGw6dXJsKCNTVkdJRF8yXyk7fQoJLnN0MntmaWxsOnVybCgjU1ZHSURfM18pO30KPC9zdHlsZT4KPGxpbmVhckdyYWRpZW50IGlkPSJTVkdJRF8xXyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHgxPSIzNjAuODc5MSIgeTE9IjM1MS40NTUzIiB4Mj0iMTQxLjIxMyIgeTI9Ii02OS4yOTM2IiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDEgMCAwIC0xIDAgMzE0KSI+Cgk8c3RvcCAgb2Zmc2V0PSIwIiBzdHlsZT0ic3RvcC1jb2xvcjojMDBGRkEzIi8+Cgk8c3RvcCAgb2Zmc2V0PSIxIiBzdHlsZT0ic3RvcC1jb2xvcjojREMxRkZGIi8+CjwvbGluZWFyR3JhZGllbnQ+CjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik02NC42LDIzNy45YzIuNC0yLjQsNS43LTMuOCw5LjItMy44aDMxNy40YzUuOCwwLDguNyw3LDQuNiwxMS4xbC02Mi43LDYyLjdjLTIuNCwyLjQtNS43LDMuOC05LjIsMy44SDYuNQoJYy01LjgsMC04LjctNy00LjYtMTEuMUw2NC42LDIzNy45eiIvPgo8bGluZWFyR3JhZGllbnQgaWQ9IlNWR0lEXzJfIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjI2NC44MjkxIiB5MT0iNDAxLjYwMTQiIHgyPSI0NS4xNjMiIHkyPSItMTkuMTQ3NSIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxIDAgMCAtMSAwIDMxNCkiPgoJPHN0b3AgIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6IzAwRkZBMyIvPgoJPHN0b3AgIG9mZnNldD0iMSIgc3R5bGU9InN0b3AtY29sb3I6I0RDMUZGRiIvPgo8L2xpbmVhckdyYWRpZW50Pgo8cGF0aCBjbGFzcz0ic3QxIiBkPSJNNjQuNiwzLjhDNjcuMSwxLjQsNzAuNCwwLDczLjgsMGgzMTcuNGM1LjgsMCw4LjcsNyw0LjYsMTEuMWwtNjIuNyw2Mi43Yy0yLjQsMi40LTUuNywzLjgtOS4yLDMuOEg2LjUKCWMtNS44LDAtOC43LTctNC42LTExLjFMNjQuNiwzLjh6Ii8+CjxsaW5lYXJHcmFkaWVudCBpZD0iU1ZHSURfM18iIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4MT0iMzEyLjU0ODQiIHkxPSIzNzYuNjg4IiB4Mj0iOTIuODgyMiIgeTI9Ii00NC4wNjEiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMSAwIDAgLTEgMCAzMTQpIj4KCTxzdG9wICBvZmZzZXQ9IjAiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMEZGQTMiLz4KCTxzdG9wICBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiNEQzFGRkYiLz4KPC9saW5lYXJHcmFkaWVudD4KPHBhdGggY2xhc3M9InN0MiIgZD0iTTMzMy4xLDEyMC4xYy0yLjQtMi40LTUuNy0zLjgtOS4yLTMuOEg2LjVjLTUuOCwwLTguNyw3LTQuNiwxMS4xbDYyLjcsNjIuN2MyLjQsMi40LDUuNywzLjgsOS4yLDMuOGgzMTcuNAoJYzUuOCwwLDguNy03LDQuNi0xMS4xTDMzMy4xLDEyMC4xeiIvPgo8L3N2Zz4K",
  TIA: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI0LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGw6IzdCMkJGOTt9Cgkuc3Qxe2ZpbGw6I0ZGRkZGRjt9Cjwvc3R5bGU+CjxnIGlkPSJDSVJDTEVfT1VUTElORV9CTEFDSyI+Cgk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMjUwLjEsMGgxMS44YzAuNCwwLjEsMC44LDAuMiwxLjIsMC4zYzIuMywwLjEsNC42LDAuMSw2LjksMC4zYzUuOSwwLjUsMTEuOCwwLjgsMTcuNywxLjYKCQljNy40LDEsMTQuOSwyLjIsMjIuMywzLjdjMTYuMiwzLjQsMzIsOC40LDQ3LjIsMTVjNzIuNiwzMS4zLDEyNi43LDk0LjMsMTQ2LjYsMTcwLjhjMi40LDkuMSw0LjIsMTguNCw1LjYsMjcuNwoJCWMwLjgsNS41LDEuNCwxMS4xLDEuOCwxNi42YzAuNCw0LjMsMC40LDguNywwLjYsMTNjMC4xLDAuNCwwLjIsMC43LDAuMywxLjF2MTEuOGMtMC4xLDAuMi0wLjIsMC40LTAuMywwLjdjLTAuMSwyLjUtMC4xLDUtMC4zLDcuNQoJCWMtMC40LDUuMS0wLjYsMTAuMi0xLjMsMTUuM2MtMS4xLDguMi0yLjMsMTYuMy0zLjksMjQuNGMtNC4xLDE5LjUtMTAuNSwzOC40LTE5LjEsNTYuM2MtMTcuMywzNi4zLTQyLjgsNjcuOS03NC42LDkyLjQKCQljLTI3LjEsMjEuMS01OC4xLDM2LjQtOTEuMyw0NWMtMTQuMywzLjgtMjguOCw2LjMtNDMuNiw3LjRjLTYuMywwLjUtMTIuNiwwLjctMTguOSwxYy0zLjIsMC4xLTYuNSwwLTkuNy0wLjIKCQljLTUuOC0wLjMtMTEuNy0wLjUtMTcuNS0xLjFjLTUuOS0wLjYtMTEuOC0xLjQtMTcuNy0yLjNjLTEyLjUtMi0yNC44LTQuOS0zNi44LTguOUM5NS4yLDQ3MywzMi4zLDQwNy4yLDkuMywzMjQuNAoJCUM1LDMwOS4xLDIuMiwyOTMuNSwxLDI3Ny42Yy0wLjQtNS45LTAuOC0xMS45LTEtMTcuOGMtMC4xLTMuNSwwLTcuMSwwLjItMTAuNmMwLjQtNi44LDAuNy0xMy41LDEuMy0yMC4yCgkJYzAuNi02LjMsMS41LTEyLjcsMi42LTE4LjljMi43LTE1LjMsNi45LTMwLjMsMTIuNS00NC44YzI5LjUtNzcuNSw5NC43LTEzNiwxNzUtMTU2LjljOS4xLTIuNCwxOC40LTQuMiwyNy43LTUuNgoJCWM1LjUtMC44LDExLjEtMS40LDE2LjYtMS44YzQuNC0wLjQsOC44LTAuNCwxMy4xLTAuNkMyNDkuNSwwLjIsMjQ5LjgsMC4xLDI1MC4xLDB6IE0yNTUuOSw0NDQuNGMxMDQsMC41LDE4Ny45LTg0LjUsMTg4LjYtMTg2LjIKCQljMC43LTEwNS44LTg0LTE4OS4zLTE4Ni4yLTE5MC40Yy0xMDcuMS0xLjEtMTg5LjUsODQuNS0xOTAuNiwxODZDNjYuNSwzNjAuNiwxNTMuMiw0NDQuOCwyNTUuOSw0NDQuNHoiLz4KCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0yNTUuOSw0NDQuNGMtMTAyLjcsMC41LTE4OS40LTgzLjctMTg4LjMtMTkwLjZjMS4xLTEwMS40LDgzLjUtMTg3LjEsMTkwLjYtMTg2CgkJYzEwMi4yLDEuMSwxODYuOSw4NC42LDE4Ni4yLDE5MC40QzQ0My45LDM1OS45LDM2MCw0NDQuOCwyNTUuOSw0NDQuNHogTTM1Ny4xLDE5OS4yYy0wLjYtMC41LTEtMC45LTEuNC0xLjIKCQljLTIuMS0xLjYtNC4xLTMuMy02LjItNC45Yy0zMC41LTIzLjYtNjUuMy00MS4yLTEwMi40LTUxLjhjLTE2LjYtNC45LTMzLjctNy44LTUwLjktOC43Yy02LjQtMC4zLTEyLjgsMC0xOS4yLDAuMgoJCWMtNi4zLDAuMi0xMi42LDEtMTguOCwyLjNjLTEwLjcsMi4yLTIwLjksNS43LTMwLjIsMTEuNWMtOC44LDUuNC0xNiwxMy4xLTIwLjcsMjIuNGMtNSw5LjktNiwyMC42LTQuOSwzMS41YzAuOSw3LjksMywxNS43LDYsMjMKCQljNS4yLDEzLjEsMTIuNiwyNC45LDIxLjIsMzYuMWM5LjEsMTEuNywxOS4zLDIyLjQsMzAuNSwzMmMzLjEsMi44LDcuOCwzLDExLDAuM2MxNi45LTEzLjMsMzQuNi0yNS40LDUzLjEtMzYuMwoJCWM0LjItMi4zLDYuOC02LjYsNi45LTExLjNjMC40LTYuMywwLjgtMTIuNywxLjMtMTljMC40LTQuOSwwLjktOS44LDEuNi0xNC43YzEuMi03LjksMi41LTE1LjksNC4xLTIzLjdjMi4yLTExLjMsNS4yLTIyLjUsOS0zMy40CgkJYzAuNi0yLjUsMy4yLTQsNS43LTMuNGMwLjIsMC4xLDAuNCwwLjEsMC42LDAuMmMxLjgsMC42LDMuNywxLjIsNS41LDEuOGMzLjQsMS4xLDQuNiwzLjQsMy40LDYuOGMtNS43LDE3LjMtOS44LDM1LjEtMTIuMSw1My4xCgkJYy0xLjEsOC41LTEuOSwxNy0yLjYsMjUuNWMtMC41LDcuMi0wLjYsMTQuNS0wLjgsMjEuN2MtMC4xLDQuMSwwLjEsOC4zLDAuMiwxMi40YzAsMi4zLDAuMSw0LjUsMC4yLDYuOGMwLjUsNy41LDAuOSwxNSwxLjYsMjIuNAoJCWMwLjUsNS43LDEuMiwxMS40LDIuMSwxNy4xYzEuMyw3LjksMywxNS44LDQuNiwyMy43YzAuOSw0LjItMC44LDcuNi00LjgsOS4zYy0yLjksMS4yLTUuOCwyLjMtOC43LDMuNWMtNC4xLDEuNy04LjgsMS42LTEyLjctMC40CgkJYy0xNC43LTYuOC0yOC45LTE0LjQtNDIuNy0yMi45Yy0yNS43LTE2LjMtNDguOS0zNS41LTY4LTU5LjRjLTkuNy0xMi4yLTE4LTI1LjMtMjQtMzkuN2MtMS41LTMuNy0yLjgtNy41LTQuMS0xMS4zCgkJYy0wLjMtMC45LTAuOC0xLjctMS44LTEuNGMtMC42LDAuMi0xLjIsMC43LTEuNCwxLjNjLTIuMSw5LTMuMywxOC4xLTMuNiwyNy4zYy0wLjIsNy42LDAsMTUuMywwLjUsMjIuOWMwLjQsNi4xLDEuMiwxMi4xLDIuNCwxOC4xCgkJYzIuNCwxMy4xLDYuNCwyNS45LDExLjksMzhjMy44LDguMyw4LjIsMTYuMywxMy4yLDIzLjljMC43LDEuNSwyLjMsMi4zLDMuOSwyLjFjMS41LTAuMiwyLjgtMS4zLDMuMi0yLjhjMC42LTEuMywxLjItMi42LDEuOS0zLjkKCQljNi4zLTExLjQsMTQuNi0yMS4zLDIzLjgtMzAuNWMyLjItMi4xLDUuNy0yLjMsOC4xLTAuNGMxLDAuNywxLjksMS41LDIuOCwyLjJjMi43LDIsMy4zLDUuOCwxLjMsOC41Yy0wLjIsMC4zLTAuNSwwLjYtMC44LDAuOQoJCWMtNi4zLDYuMi0xMiwxMy0xNywyMC4yYy0zLjYsNS40LTYuOSwxMS04LjMsMTcuNGMtMS41LDYuNiwwLjUsMTAuOCw2LjYsMTMuNmM0LjYsMiw5LjUsMy4xLDE0LjUsMy4yYzQuNSwwLjIsOSwwLjIsMTMuNC0wLjIKCQljNy4xLTAuNywxNC4zLTEuNSwyMS4zLTIuOWMxNi43LTMuNCwzMy4yLTguMSw0OS4xLTE0LjJjMjIuNy04LjUsNDQuOC0xOC41LDY2LjItMzBjMjUuNC0xMy41LDQ5LjUtMjkuMSw3Mi4xLTQ2LjgKCQljMS4yLTAuOCwxLjktMi4yLDEuOS0zLjZjMC4zLTUuOCwwLjgtMTEuNiwxLTE3LjNjMC4yLTUsMC4yLTEwLDAuMy0xNWMwLTIuMi0wLjEtNC40LTAuMi02LjZjLTAuMi00LjktMC4yLTkuOC0wLjUtMTQuNwoJCWMtMC40LTYtMC45LTEyLTEuNi0xNy45Yy0wLjgtNi44LTEuNy0xMy43LTIuOC0yMC41Yy0yLjQtMTQuOC02LjItMjkuMy0xMS4zLTQzLjRjLTQtMTEuMS05LTIxLjctMTUuOC0zMS4zCgkJYy00LjQtNi4zLTkuNS0xMi4xLTE2LjEtMTYuMmMtNy41LTQuNy0xNS40LTYtMjMuOS0yLjhjLTQuOSwyLTkuNCw0LjktMTMuMiw4LjZjLTYuNiw2LjItMTEuNywxMy42LTE2LjIsMjEuNQoJCWMtMS42LDIuOS0wLjgsNS4yLDIuMyw2LjRjMjguNCwxMSw1NS4yLDI1LjksNzkuNSw0NC4zYzMuOCwyLjgsNi40LDYuOSw3LjMsMTEuNWMwLjgsNCwxLjUsNy45LDIsMTEuOWMwLjgsNi41LTIuNiwxMS43LTguNSwxMy4yCgkJYy0xOC4yLDQuNi0zNiwxMC41LTUzLjMsMTcuNmMtMTUuNyw2LjQtMzEuMSwxMy42LTQ2LjEsMjEuNWMtMywxLjUtNS4yLDAuMS01LjItMy4yYzAuMS0yLjYsMC4zLTUuMSwwLjMtNy43CgkJYzAtMy41LDEuNS01LjcsNC44LTcuMmM5LjYtNC40LDE5LTkuMSwyOC42LTEzLjNjMTkuMy04LjYsMzkuMi0xNS43LDU5LjYtMjEuM0MzNTAuMiwyMDAuOSwzNTMuNSwyMDAuMSwzNTcuMSwxOTkuMnogTTI1NS44LDQyOC42CgkJYzcuMy0wLjEsMTQuNi0wLjYsMjEuOS0xLjZjMS4yLDAsMi4yLTAuOCwyLjYtMS45YzAuMy0xLjEtMC4yLTIuMy0xLjEtMi45Yy03LjctNi41LTEzLjYtMTQuNC0xOC43LTIzYy0zLjctNi40LTctMTMtOS44LTE5LjgKCQljLTEtMi40LTIuNy0zLjEtNS4xLTIuMmMtMTguNSw3LjEtMzcuNSwxMi44LTU2LjksMTYuOGMtNy45LDEuNi0xNS44LDIuNy0yMy45LDMuMmMtMS4zLDAuMS0yLjMsMC40LTIuNywxLjcKCQljLTAuNCwxLjMsMC40LDIuMSwxLjUsMi43YzMuMywyLDYuNSw0LDkuOSw1LjljMTkuOCwxMC45LDQxLjYsMTcuNyw2NCwyMEMyNDMuNiw0MjguMSwyNDkuNyw0MjguMiwyNTUuOCw0MjguNnogTTI1My4yLDEyNS45CgkJYzMuOCwwLDYuMS0xLjQsNy42LTQuMWMzLjYtNi43LDcuOS0xMywxMi42LTE4LjljMy42LTQuNSw3LjYtOC41LDEyLjEtMTIuMWMwLjktMC42LDEuMy0xLjcsMS0yLjhjLTAuMi0xLTEuMS0xLjgtMi4xLTIKCQljLTAuNi0wLjEtMS4yLTAuMi0xLjgtMC4zYy02LjktMC43LTEzLjctMS41LTIwLjYtMS45Yy00LjktMC4yLTkuOC0wLjItMTQuNywwLjJjLTYuNiwwLjUtMTMuMSwxLjEtMTkuNiwyCgkJYy0xNS4yLDIuNC0zMC4xLDYuOS00NC4xLDEzLjRjLTkuNiw0LjQtMTguNyw5LjctMjcuMywxNS44Yy0wLjgsMC42LTEuNSwxLjItMS4xLDIuM2MwLjQsMSwxLjMsMS4xLDIuMiwwLjkKCQljNy42LTEuNCwxNS4yLTIuMiwyMi45LTIuNGM2LjUtMC4xLDEzLDAuMSwxOS41LDAuNGM2LjEsMC40LDEyLjIsMSwxOC4zLDEuOGMxMC4yLDEuNCwyMC4zLDMuNSwzMC4yLDYuMwoJCUMyNTAuMywxMjUuMywyNTIsMTI1LjcsMjUzLjIsMTI1Ljl6IE0zMDkuNSw0MTguNWMyLTAuMyw0LjEtMC41LDYtMWM2LjQtMS42LDExLjYtNS4xLDE2LjMtOS41YzguMi03LjcsMTQuMS0xNywxOS4xLTI3CgkJYzAuNy0xLjMsMC4yLTMtMS4xLTMuN2MtMC41LTAuMi0xLTAuNC0xLjUtMC4zYy0zLjMsMC4xLTYuNiwwLjQtOS45LDAuNGMtNS4zLDAtMTAuNi0wLjEtMTUuOC0wLjVjLTUuNC0wLjMtMTAuOS0wLjctMTYuMi0xLjYKCQljLTgtMS4yLTE1LjktMi43LTIzLjgtNC4zYy00LTAuOC04LTItMTItM2MtMS41LTAuNS0zLjItMC4xLTQuMywxLjFjLTEsMS4yLTEuMiwyLjktMC40LDQuMmMzLDUuOSw1LjcsMTIsOC45LDE3LjgKCQljNC4yLDcuOSwxMCwxNC44LDE3LjEsMjAuNEMyOTcsNDE1LjcsMzAyLjcsNDE4LjMsMzA5LjUsNDE4LjV6IE0yMzAuNywyNzAuNWMtNi44LDIuNy00OSwzMi4xLTUxLjcsMzYKCQljMTguNiwxMy40LDM4LjYsMjQuNiw1OS43LDMzLjZDMjMzLjcsMzE3LjIsMjMxLjEsMjkzLjksMjMwLjcsMjcwLjV6IE0zMzQsMzYxLjZjMy41LTAuMSw3LTAuMiwxMC41LTAuNGMzLjUtMC4yLDYuOS0wLjgsMTAuNC0xCgkJYzMuOS0wLjIsNi0yLjIsNy4yLTUuOGM0LjQtMTMuNiw3LjgtMjcuNSwxMC4xLTQxLjZjMC4yLTEsMC4yLTEuOS0wLjctMi41Yy0wLjktMC41LTEuNy0wLjEtMi41LDAuNWMtMi45LDIuMS01LjgsNC4yLTguOCw2LjIKCQljLTIwLjIsMTMuOC00MS4zLDI2LjMtNjMuMSwzNy40Yy0wLjksMC40LTEuNiwxLTEuNSwyYzAuMSwxLjEsMSwxLjUsMiwxLjdDMzA5LjYsMzYwLjMsMzIxLjgsMzYxLjUsMzM0LDM2MS42eiBNNDE5LjQsMzAxCgkJYy0wLjItMi45LTAuMy01LjktMC44LTguOGMtMC44LTQuNi0xLjctOS4xLTIuOS0xMy42Yy0wLjgtMy00LjItMy43LTYuNS0xLjZjLTQuOSw0LjYtOS45LDkuMi0xNC44LDEzLjhjLTEuOCwxLjUtMywzLjUtMy42LDUuOAoJCWMtMC41LDIuMi0wLjgsNC41LTEuMSw2LjhjLTEuMSw2LjctMS45LDEzLjQtMy4zLDIwYy0xLjYsOC4xLTMuNywxNi4xLTUuNiwyNC4xYy0wLjYsMS44LDAuNCwzLjgsMi4yLDQuNGMwLjksMC4zLDEuOSwwLjIsMi44LTAuMwoJCWMwLjgtMC40LDEuNS0wLjgsMi4zLTEuMWM4LjItNC4zLDE1LjQtOS44LDIwLjktMTcuM0M0MTUuOSwzMjMuOSw0MTkuNiwzMTIuNiw0MTkuNCwzMDF6IE00MTIuOSwxOTVjMi4zLDAuMSwzLjUtMS41LDIuOC0zLjcKCQljLTAuMS0wLjQtMC4zLTAuOC0wLjUtMS4yYy03LjItMTcuMy0xNy4yLTMzLjMtMjkuNi00Ny40Yy0zLjUtNC03LjMtNy43LTExLTExLjRjLTAuNS0wLjQtMS4yLTAuNS0xLjktMC4zCgkJYy0wLjcsMC4zLTEuMSwxLjEtMC44LDEuOGMwLDAuMSwwLDAuMSwwLjEsMC4yYzAuMywwLjYsMC41LDEuMywwLjcsMS45YzYuNywxNi42LDExLjYsMzMuOSwxNC43LDUxLjZjMC42LDQuNCw0LjQsNy43LDguOSw3LjUKCQljMi45LDAsNS45LDAuMSw4LjgsMC4zQzQwNy43LDE5NC40LDQxMC4zLDE5NC43LDQxMi45LDE5NUw0MTIuOSwxOTV6IE00MDAuMywyMDkuOGMtMC42LDAtMS4xLDAtMS43LDBjLTEuMy0wLjItMi41LDAuNS0zLDEuNwoJCWMtMC42LDEuMywwLDIuMywwLjgsMy4yYzIsMi40LDQuMSw0LjcsNS45LDcuMmM0LDUuNCw3LjksMTAuOSwxMS44LDE2LjRjMS42LDIuMiw0LjUsMi4yLDUuOS0wLjFjMi4xLTMuNSwzLjYtNy40LDQuNS0xMS4zCgkJYzEuNS02LjgtMC43LTExLjEtNi45LTEzLjhjLTAuMS0wLjEtMC4yLTAuMS0wLjQtMC4xQzQxMS44LDIxMC42LDQwNi4xLDIxMCw0MDAuMywyMDkuOHogTTM5MywyNjYuMWwtMC4yLDBjMCwwLjEsMCwwLjMsMCwwLjQKCQljMCwwLjktMC4xLDEuOCwwLjksMi4yYzEsMC40LDEuNy0wLjEsMi4zLTAuOGMyLjctMi44LDUuNC01LjUsOC04LjNjMi0yLjEsMi4yLTMuNiwwLjctNmMtMi43LTQuNC01LjUtOC42LTguMy0xMi45CgkJYy0wLjYtMC45LTEuMy0xLjQtMi4zLTEuMWMtMSwwLjMtMS4yLDEuMi0xLjIsMi4yQzM5MywyNDkuOSwzOTMsMjU4LDM5MywyNjYuMUwzOTMsMjY2LjF6IE0zNjkuOSwzODVjMC40LTAuMiwwLjctMC40LDEtMC42CgkJYzAuOS0wLjgsMS45LTEuNiwyLjctMi41YzIuNy0yLjYsNS40LTUuMiw4LTcuOWMwLjQtMC41LDAuNi0xLjIsMC40LTEuOWMtMC4yLTAuOS0xLTEuMS0xLjktMWMtMC4yLDAtMC4zLDAtMC41LDAuMQoJCWMtMi4yLDAuNi00LjQsMS4zLTYuNiwyYy0wLjUsMC4yLTEsMC41LTEuMywxYy0xLjMsMi45LTIuNiw1LjctMy44LDguN0MzNjcuNiwzODMuOSwzNjguNCwzODUsMzY5LjksMzg1eiBNNDI4LjUsMjU4LjgKCQlMNDI4LjUsMjU4LjhjLTAuMS0wLjUtMC4xLTEtMC4xLTEuNWMwLTAuMy0wLjItMC43LTAuNC0wLjhjLTAuMywwLTAuNiwwLjEtMC45LDAuM2MtMS40LDEuMS0xLjYsMy4xLTAuNSw0LjUKCQljMCwwLjEsMC4xLDAuMSwwLjEsMC4yYzAuNSwwLjYsMS4yLDAuNSwxLjQtMC4zQzQyOC4zLDI2MC40LDQyOC40LDI1OS43LDQyOC41LDI1OC44TDQyOC41LDI1OC44eiIvPgoJPHBhdGggY2xhc3M9InN0MCIgZD0iTTM1Ny4xLDE5OS4yYy0zLjYsMC45LTcsMS43LTEwLjMsMi42Yy0yMC40LDUuNi00MC4zLDEyLjctNTkuNiwyMS4zYy05LjYsNC4zLTE5LDktMjguNiwxMy4zCgkJYy0zLjIsMS41LTQuOCwzLjctNC44LDcuMmMwLDIuNi0wLjIsNS4xLTAuMyw3LjdjLTAuMSwzLjMsMi4yLDQuOCw1LjIsMy4yYzE1LTcuOSwzMC40LTE1LjEsNDYuMS0yMS41YzE3LjMtNy4yLDM1LjEtMTMsNTMuMy0xNy42CgkJYzUuOS0xLjUsOS4zLTYuNyw4LjUtMTMuMmMtMC41LTQtMS4yLTgtMi0xMS45Yy0wLjktNC42LTMuNS04LjctNy4zLTExLjVjLTI0LjMtMTguNC01MS4xLTMzLjMtNzkuNS00NC4zCgkJYy0zLjEtMS4yLTMuOS0zLjYtMi4zLTYuNGM0LjUtNy45LDkuNi0xNS4yLDE2LjItMjEuNWMzLjgtMy43LDguMy02LjYsMTMuMi04LjZjOC40LTMuMywxNi40LTIsMjMuOSwyLjgKCQljNi42LDQuMiwxMS43LDkuOSwxNi4xLDE2LjJjNi44LDkuNywxMS43LDIwLjMsMTUuOCwzMS4zYzUuMSwxNC4xLDguOSwyOC42LDExLjMsNDMuNGMxLjEsNi44LDIsMTMuNiwyLjgsMjAuNQoJCWMwLjcsNiwxLjIsMTEuOSwxLjYsMTcuOWMwLjMsNC45LDAuNCw5LjgsMC41LDE0LjdjMC4xLDIuMiwwLjIsNC40LDAuMiw2LjZjMCw1LTAuMSwxMC0wLjMsMTVjLTAuMiw1LjgtMC43LDExLjYtMSwxNy4zCgkJYzAsMS40LTAuNywyLjgtMS45LDMuNmMtMjIuNiwxNy43LTQ2LjgsMzMuMy03Mi4xLDQ2LjhjLTIxLjMsMTEuNS00My41LDIxLjUtNjYuMiwzMGMtMTYsNi4xLTMyLjQsMTAuOC00OS4xLDE0LjIKCQljLTcsMS40LTE0LjIsMi4yLTIxLjMsMi45Yy00LjUsMC40LTguOSwwLjUtMTMuNCwwLjJjLTUtMC4xLTkuOS0xLjItMTQuNS0zLjJjLTYuMS0yLjktOC4xLTcuMS02LjYtMTMuNmMxLjUtNi40LDQuNy0xMiw4LjMtMTcuNAoJCWM1LjEtNy4yLDEwLjgtMTQsMTctMjAuMmMyLjUtMi4zLDIuNy02LjEsMC40LTguNmMtMC4zLTAuMy0wLjYtMC42LTAuOS0wLjhjLTAuOS0wLjgtMS44LTEuNS0yLjgtMi4yYy0yLjQtMS45LTUuOS0xLjctOC4xLDAuNAoJCWMtOS4xLDkuMi0xNy41LDE5LTIzLjgsMzAuNWMtMC43LDEuMy0xLjQsMi42LTEuOSwzLjljLTAuNSwxLjUtMS43LDIuNS0zLjIsMi44Yy0xLjYsMC4yLTMuMi0wLjYtMy45LTIuMQoJCWMtNS03LjYtOS40LTE1LjYtMTMuMi0yMy45Yy01LjUtMTIuMS05LjUtMjQuOS0xMS45LTM4Yy0xLjEtNi0xLjktMTItMi40LTE4LjFjLTAuNS03LjYtMC43LTE1LjMtMC41LTIyLjkKCQljMC4zLTkuMiwxLjUtMTguMywzLjYtMjcuM2MwLjItMC42LDAuOC0xLjEsMS40LTEuM2MxLTAuMywxLjUsMC41LDEuOCwxLjRjMS40LDMuOCwyLjYsNy42LDQuMSwxMS4zYzYsMTQuNCwxNC4zLDI3LjUsMjQsMzkuNwoJCWMxOS4xLDIzLjksNDIuMiw0My4xLDY4LDU5LjRjMTMuNyw4LjUsMjgsMTYuMiw0Mi43LDIyLjljNCwyLDguNiwyLjEsMTIuNywwLjRjMi45LTEuMiw1LjgtMi4zLDguNy0zLjVjNC0xLjcsNS43LTUuMSw0LjgtOS4zCgkJYy0xLjYtNy45LTMuMi0xNS43LTQuNi0yMy43Yy0xLTUuNy0xLjYtMTEuNC0yLjEtMTcuMWMtMC43LTcuNS0xLjEtMTQuOS0xLjYtMjIuNGMtMC4xLTIuMy0wLjItNC41LTAuMi02LjgKCQljLTAuMS00LjEtMC4zLTguMy0wLjItMTIuNGMwLjItNy4yLDAuMy0xNC41LDAuOC0yMS43YzAuNi04LjUsMS40LTE3LDIuNi0yNS41YzIuMy0xOC4xLDYuNC0zNS45LDEyLjEtNTMuMWMxLjItMy40LDAtNS43LTMuNC02LjgKCQljLTEuOC0wLjYtMy42LTEuMi01LjUtMS44Yy0yLjQtMS01LjEsMC4yLTYuMSwyLjZjLTAuMSwwLjItMC4xLDAuNC0wLjIsMC42Yy0zLjcsMTAuOS02LjcsMjIuMS05LDMzLjRjLTEuNSw3LjktMi45LDE1LjgtNC4xLDIzLjcKCQljLTAuNyw0LjktMS4yLDkuOC0xLjYsMTQuN2MtMC41LDYuMy0wLjksMTIuNi0xLjMsMTljLTAuMSw0LjctMi44LDkuMS02LjksMTEuM2MtMTguNSwxMC45LTM2LjIsMjMtNTMuMSwzNi4zCgkJYy0zLjMsMi42LTgsMi41LTExLTAuM2MtMTEuMi05LjYtMjEuNC0yMC4zLTMwLjUtMzJjLTguNi0xMS4xLTE1LjktMjMtMjEuMi0zNi4xYy0zLTcuNC01LjEtMTUuMS02LTIzCgkJYy0xLjItMTAuOS0wLjEtMjEuNiw0LjktMzEuNWM0LjctOS4yLDExLjgtMTcsMjAuNy0yMi40YzkuMy01LjgsMTkuNS05LjMsMzAuMi0xMS41YzYuMi0xLjMsMTIuNS0yLjEsMTguOC0yLjMKCQljNi40LTAuMiwxMi44LTAuNSwxOS4yLTAuMmMxNy4zLDAuOSwzNC40LDMuOCw1MC45LDguN2MzNy4xLDEwLjYsNzEuOSwyOC4yLDEwMi40LDUxLjhjMi4xLDEuNiw0LjEsMy4zLDYuMiw0LjkKCQlDMzU2LjIsMTk4LjMsMzU2LjUsMTk4LjYsMzU3LjEsMTk5LjJ6Ii8+Cgk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMjU1LjgsNDI4LjZjLTYuMS0wLjQtMTIuMi0wLjUtMTguMi0xLjFjLTIyLjUtMi4zLTQ0LjItOS4xLTY0LTIwYy0zLjQtMS44LTYuNi0zLjktOS45LTUuOQoJCWMtMS0wLjYtMS44LTEuNC0xLjUtMi43YzAuNC0xLjMsMS40LTEuNiwyLjctMS43YzgtMC41LDE2LTEuNiwyMy45LTMuMmMxOS40LTQsMzguNC05LjYsNTYuOS0xNi44YzIuNC0wLjksNC4xLTAuMiw1LjEsMi4yCgkJYzIuOCw2LjgsNi4xLDEzLjQsOS44LDE5LjhjNS4xLDguNiwxMSwxNi41LDE4LjcsMjNjMSwwLjYsMS40LDEuOCwxLjEsMi45Yy0wLjQsMS4xLTEuNCwxLjktMi42LDEuOQoJCUMyNzAuNCw0MjcuOSwyNjMuMSw0MjguNSwyNTUuOCw0MjguNnoiLz4KCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0yNTMuMiwxMjUuOWMtMS4xLTAuMy0yLjktMC42LTQuNy0xLjFjLTkuOS0yLjctMjAtNC44LTMwLjItNi4zYy02LjEtMC44LTEyLjItMS41LTE4LjMtMS44CgkJYy02LjUtMC40LTEzLTAuNi0xOS41LTAuNGMtNy43LDAuMi0xNS40LDEtMjIuOSwyLjRjLTEsMC4yLTEuOCwwLjEtMi4yLTAuOWMtMC40LTEuMSwwLjMtMS43LDEuMS0yLjNjOC42LTYuMSwxNy43LTExLjQsMjcuMy0xNS44CgkJYzE0LTYuNSwyOC44LTExLjEsNDQuMS0xMy40YzYuNS0xLDEzLjEtMS42LDE5LjYtMmM0LjktMC40LDkuOC0wLjQsMTQuNy0wLjJjNi45LDAuNCwxMy43LDEuMiwyMC42LDEuOWMwLjYsMC4xLDEuMiwwLjIsMS44LDAuMwoJCWMxLjEsMC4xLDEuOSwwLjksMi4xLDJjMC4zLDEuMS0wLjEsMi4yLTEsMi44Yy00LjUsMy42LTguNSw3LjYtMTIuMSwxMi4xYy00LjgsNS45LTksMTIuMy0xMi42LDE4LjkKCQlDMjU5LjMsMTI0LjYsMjU3LDEyNS45LDI1My4yLDEyNS45eiIvPgoJPHBhdGggY2xhc3M9InN0MCIgZD0iTTMwOS41LDQxOC41Yy02LjgtMC4yLTEyLjUtMi45LTE3LjctNi45Yy03LTUuNi0xMi44LTEyLjUtMTcuMS0yMC40Yy0zLjMtNS44LTYtMTEuOS04LjktMTcuOAoJCWMtMC44LTEuMy0wLjctMywwLjQtNC4yYzEuMS0xLjIsMi44LTEuNyw0LjMtMS4xYzQsMSw4LDIuMiwxMiwzYzcuOSwxLjYsMTUuOSwzLjEsMjMuOCw0LjNjNS40LDAuOCwxMC44LDEuMiwxNi4yLDEuNgoJCWM1LjMsMC4zLDEwLjYsMC40LDE1LjgsMC41YzMuMywwLDYuNi0wLjMsOS45LTAuNGMxLjUtMC4xLDIuOCwxLDMsMi41YzAsMC41LTAuMSwxLTAuMywxLjVjLTUsMTAtMTEsMTkuMy0xOS4xLDI3CgkJYy00LjcsNC40LTkuOSw4LTE2LjMsOS41QzMxMy42LDQxOCwzMTEuNSw0MTguMiwzMDkuNSw0MTguNXoiLz4KCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0yMzAuNywyNzAuNWMwLjMsMjMuNCwzLDQ2LjgsOCw2OS43Yy0yMS4xLTktNDEuMS0yMC4zLTU5LjctMzMuNkMxODEuNywzMDIuNiwyMjMuOSwyNzMuMiwyMzAuNywyNzAuNXoiLz4KCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0zMzQsMzYxLjZjLTEyLjItMC4xLTI0LjQtMS4zLTM2LjQtMy41Yy0xLTAuMi0xLjktMC42LTItMS43Yy0wLjEtMSwwLjYtMS41LDEuNS0yCgkJYzIxLjgtMTEuMSw0Mi45LTIzLjYsNjMuMS0zNy40YzIuOS0yLDUuOS00LjEsOC44LTYuMmMwLjgtMC41LDEuNS0xLDIuNS0wLjVjMSwwLjYsMC45LDEuNCwwLjcsMi41Yy0yLjMsMTQuMS01LjcsMjgtMTAuMSw0MS42CgkJYy0xLjIsMy42LTMuMyw1LjYtNy4yLDUuOGMtMy41LDAuMi02LjksMC43LTEwLjQsMUMzNDEsMzYxLjQsMzM3LjUsMzYxLjUsMzM0LDM2MS42eiIvPgoJPHBhdGggY2xhc3M9InN0MCIgZD0iTTQxOS40LDMwMWMwLjEsMTEuNi0zLjUsMjIuOS0xMC40LDMyLjJjLTUuNSw3LjUtMTIuNywxMy0yMC45LDE3LjNjLTAuOCwwLjQtMS41LDAuOC0yLjMsMS4xCgkJYy0xLjcsMC45LTMuOCwwLjMtNC43LTEuM2MtMC41LTAuOS0wLjYtMS45LTAuMy0yLjhjMS45LTgsMy45LTE2LDUuNi0yNC4xYzEuMy02LjYsMi4yLTEzLjMsMy4zLTIwYzAuNC0yLjMsMC42LTQuNiwxLjEtNi44CgkJYzAuNi0yLjIsMS45LTQuMywzLjYtNS44YzQuOS00LjYsOS45LTkuMiwxNC44LTEzLjhjMi4yLTIuMSw1LjctMS40LDYuNSwxLjZjMS4yLDQuNSwyLjEsOSwyLjksMTMuNgoJCUM0MTkuMiwyOTUuMSw0MTkuMiwyOTguMSw0MTkuNCwzMDF6Ii8+Cgk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDEyLjksMTk1Yy0yLjYtMC4yLTUuMi0wLjYtNy45LTAuN2MtMi45LTAuMi01LjktMC4yLTguOC0wLjNjLTQuNSwwLjItOC4zLTMuMS04LjktNy41CgkJYy0zLjEtMTcuNy04LTM0LjktMTQuNy01MS42Yy0wLjMtMC42LTAuNS0xLjMtMC43LTEuOWMtMC40LTAuNy0wLjEtMS42LDAuNi0xLjljMC4xLDAsMC4xLTAuMSwwLjItMC4xYzAuNy0wLjIsMS40LTAuMSwxLjksMC4zCgkJYzMuNywzLjcsNy41LDcuNCwxMSwxMS40YzEyLjQsMTQsMjIuNSwzMCwyOS42LDQ3LjRjMC4yLDAuNCwwLjMsMC44LDAuNSwxLjJDNDE2LjUsMTkzLjUsNDE1LjIsMTk1LjEsNDEyLjksMTk1eiIvPgoJPHBhdGggY2xhc3M9InN0MCIgZD0iTTQwMC4zLDIwOS44YzUuOCwwLjIsMTEuNSwwLjgsMTcsM2MwLjEsMCwwLjIsMC4xLDAuNCwwLjFjNi4yLDIuNyw4LjQsNyw2LjksMTMuOGMtMC45LDQtMi40LDcuOC00LjUsMTEuMwoJCWMtMS40LDIuNC00LjMsMi40LTUuOSwwLjFjLTMuOS01LjUtNy44LTExLTExLjgtMTYuNGMtMS44LTIuNS0zLjktNC44LTUuOS03LjJjLTAuOC0xLTEuNS0xLjktMC44LTMuMmMwLjUtMS4yLDEuOC0xLjgsMy0xLjcKCQlDMzk5LjIsMjA5LjgsMzk5LjcsMjA5LjgsNDAwLjMsMjA5Ljh6Ii8+Cgk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMzkzLDI2Ni4xYzAtOC4xLDAtMTYuMiwwLTI0LjNjMC0xLDAuMS0xLjgsMS4yLTIuMmMxLjEtMC40LDEuOCwwLjIsMi4zLDEuMWMyLjgsNC4zLDUuNiw4LjYsOC4zLDEyLjkKCQljMS41LDIuNCwxLjIsMy45LTAuNyw2Yy0yLjYsMi44LTUuMyw1LjUtOCw4LjNjLTAuNywwLjctMS40LDEuMi0yLjMsMC44Yy0xLTAuNC0wLjktMS4zLTAuOS0yLjJjMC0wLjEsMC0wLjMsMC0wLjRMMzkzLDI2Ni4xeiIvPgoJPHBhdGggY2xhc3M9InN0MCIgZD0iTTM2OS45LDM4NWMtMS41LDAtMi4zLTEuMS0xLjgtMi4zYzEuMi0yLjksMi41LTUuOCwzLjgtOC43YzAuMy0wLjUsMC43LTAuOCwxLjMtMWMyLjItMC43LDQuNC0xLjMsNi42LTIKCQljMC4yLDAsMC4zLTAuMSwwLjUtMC4xYzAuOC0wLjEsMS43LDAuMSwxLjksMWMwLjEsMC43LDAsMS40LTAuNCwxLjljLTIuNiwyLjctNS4zLDUuMy04LDcuOWMtMC45LDAuOS0xLjgsMS43LTIuNywyLjUKCQlDMzcwLjYsMzg0LjYsMzcwLjIsMzg0LjgsMzY5LjksMzg1eiIvPgoJPHBhdGggY2xhc3M9InN0MCIgZD0iTTQyOC41LDI1OC44Yy0wLjEsMC44LTAuMiwxLjYtMC4zLDIuNGMtMC4yLDAuOC0wLjksMC45LTEuNCwwLjNjLTEuMi0xLjMtMS4xLTMuMywwLjItNC41CgkJYzAuMS0wLjEsMC4xLTAuMSwwLjItMC4xYzAuMi0wLjIsMC42LTAuMywwLjktMC4zYzAuMiwwLjEsMC40LDAuNSwwLjQsMC44QzQyOC40LDI1Ny44LDQyOC40LDI1OC4zLDQyOC41LDI1OC44TDQyOC41LDI1OC44eiIvPgo8L2c+Cjwvc3ZnPgo=",
  BNB: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI2LjAuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCAyNDk2IDI0OTYiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDI0OTYgMjQ5NjsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8Zz4KCTxwYXRoIHN0eWxlPSJmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDtmaWxsOiNGMEI5MEI7IiBkPSJNMTI0OCwwYzY4OS4zLDAsMTI0OCw1NTguNywxMjQ4LDEyNDhzLTU1OC43LDEyNDgtMTI0OCwxMjQ4CgkJUzAsMTkzNy4zLDAsMTI0OFM1NTguNywwLDEyNDgsMEwxMjQ4LDB6Ii8+Cgk8cGF0aCBzdHlsZT0iZmlsbDojRkZGRkZGOyIgZD0iTTY4NS45LDEyNDhsMC45LDMzMGwyODAuNCwxNjV2MTkzLjJsLTQ0NC41LTI2MC43di01MjRMNjg1LjksMTI0OEw2ODUuOSwxMjQ4eiBNNjg1LjksOTE4djE5Mi4zCgkJbC0xNjMuMy05Ni42VjgyMS40bDE2My4zLTk2LjZsMTY0LjEsOTYuNkw2ODUuOSw5MThMNjg1LjksOTE4eiBNMTA4NC4zLDgyMS40bDE2My4zLTk2LjZsMTY0LjEsOTYuNkwxMjQ3LjYsOTE4TDEwODQuMyw4MjEuNAoJCUwxMDg0LjMsODIxLjR6Ii8+Cgk8cGF0aCBzdHlsZT0iZmlsbDojRkZGRkZGOyIgZD0iTTgwMy45LDE1MDkuNnYtMTkzLjJsMTYzLjMsOTYuNnYxOTIuM0w4MDMuOSwxNTA5LjZMODAzLjksMTUwOS42eiBNMTA4NC4zLDE4MTIuMmwxNjMuMyw5Ni42CgkJbDE2NC4xLTk2LjZ2MTkyLjNsLTE2NC4xLDk2LjZsLTE2My4zLTk2LjZWMTgxMi4yTDEwODQuMywxODEyLjJ6IE0xNjQ1LjksODIxLjRsMTYzLjMtOTYuNmwxNjQuMSw5Ni42djE5Mi4zbC0xNjQuMSw5Ni42VjkxOAoJCUwxNjQ1LjksODIxLjRMMTY0NS45LDgyMS40TDE2NDUuOSw4MjEuNHogTTE4MDkuMiwxNTc4bDAuOS0zMzBsMTYzLjMtOTYuNnY1MjRsLTQ0NC41LDI2MC43di0xOTMuMkwxODA5LjIsMTU3OEwxODA5LjIsMTU3OAoJCUwxODA5LjIsMTU3OHoiLz4KCTxwb2x5Z29uIHN0eWxlPSJmaWxsOiNGRkZGRkY7IiBwb2ludHM9IjE2OTIuMSwxNTA5LjYgMTUyOC44LDE2MDUuMyAxNTI4LjgsMTQxMyAxNjkyLjEsMTMxNi40IDE2OTIuMSwxNTA5LjYgCSIvPgoJPHBhdGggc3R5bGU9ImZpbGw6I0ZGRkZGRjsiIGQ9Ik0xNjkyLjEsOTg2LjRsMC45LDE5My4ybC0yODEuMiwxNjV2MzMwLjhsLTE2My4zLDk1LjdsLTE2My4zLTk1Ljd2LTMzMC44bC0yODEuMi0xNjVWOTg2LjQKCQlMOTY4LDg4OS44bDI3OS41LDE2NS44bDI4MS4yLTE2NS44bDE2NC4xLDk2LjZIMTY5Mi4xTDE2OTIuMSw5ODYuNHogTTgwMy45LDY1Ni41bDQ0My43LTI2MS42bDQ0NC41LDI2MS42bC0xNjMuMyw5Ni42CgkJbC0yODEuMi0xNjUuOEw5NjcuMiw3NTMuMUw4MDMuOSw2NTYuNUw4MDMuOSw2NTYuNXoiLz4KPC9nPgo8L3N2Zz4K",
};

/* ─── Pool Data ─── */
const POOL_DATA = [
  { pool: "Lido ETH Staking", ticker: "ETH", logo: LOGO.ETH, nominal: 2.51, real: 2.31, stddev: 0.35, tvl: "$19.6B", risk: "A", riskLabel: "Lowest", lockup: "None" },
  { pool: "Binance ETH Staking", ticker: "WBETH", logo: LOGO.WBETH, nominal: 2.61, real: 2.38, stddev: 0.32, tvl: "$7.3B", risk: "A", riskLabel: "Lowest", lockup: "None" },
  { pool: "EtherFi ETH Staking", ticker: "weETH", logo: LOGO.weETH, nominal: 2.43, real: 2.10, stddev: 0.42, tvl: "$6.3B", risk: "B", riskLabel: "Low", lockup: "None" },
  { pool: "Sky USD Fee Sharing", ticker: "USDS", logo: LOGO.USDS, nominal: 4.00, real: 3.65, stddev: 0.55, tvl: "$5.5B", risk: "A", riskLabel: "Lowest", lockup: "None" },
  { pool: "Aave ETH Lending", ticker: "weETH", logo: LOGO.weETH, nominal: 1.82, real: 1.82, stddev: 0.90, tvl: "$5.0B", risk: "B", riskLabel: "Low", lockup: "None" },
  { pool: "Ethena USD Yield", ticker: "USDe", logo: LOGO.USDe, nominal: 3.54, real: 2.90, stddev: 0.72, tvl: "$3.5B", risk: "B", riskLabel: "Low", lockup: "7 days" },
  { pool: "Polkadot Staking", ticker: "DOT", logo: LOGO.DOT, nominal: 12.00, real: 5.50, stddev: 1.80, tvl: "$4.8B", risk: "C", riskLabel: "Medium", lockup: "28 days" },
  { pool: "Solana Staking", ticker: "SOL", logo: LOGO.SOL, nominal: 7.20, real: 5.80, stddev: 1.20, tvl: "$12.4B", risk: "B", riskLabel: "Low", lockup: "~2 days" },
  { pool: "Celestia Staking", ticker: "TIA", logo: LOGO.TIA, nominal: 14.20, real: 7.80, stddev: 2.80, tvl: "$3.2B", risk: "C", riskLabel: "Medium", lockup: "21 days" },
];

const RISK_COLORS = {
  A: { bg: "#F0FDF4", text: "#15803D", border: "#BBF7D0" },
  B: { bg: "#F0FDF4", text: "#22863A", border: "#BBF7D0" },
  C: { bg: "#FFFBEB", text: "#B45309", border: "#FDE68A" },
  D: { bg: "#FEF2F2", text: "#DC2626", border: "#FECACA" },
};

function PoolTable() {
  const [expanded, setExpanded] = useState(null);
  const [sortCol, setSortCol] = useState("tvl");
  const [sortAsc, setSortAsc] = useState(false);

  const parseTVL = (s) => {
    const n = parseFloat(s.replace(/[$B]/g, ""));
    return isNaN(n) ? 0 : n;
  };

  const sorted = [...POOL_DATA].sort((a, b) => {
    let va, vb;
    if (sortCol === "tvl") { va = parseTVL(a.tvl); vb = parseTVL(b.tvl); }
    else if (sortCol === "nominal") { va = a.nominal; vb = b.nominal; }
    else if (sortCol === "real") { va = a.real; vb = b.real; }
    else if (sortCol === "risk") { va = a.risk; vb = b.risk; }
    else { va = a.pool; vb = b.pool; }
    if (va < vb) return sortAsc ? -1 : 1;
    if (va > vb) return sortAsc ? 1 : -1;
    return 0;
  });

  const handleSort = (col) => {
    if (sortCol === col) setSortAsc(!sortAsc);
    else { setSortCol(col); setSortAsc(false); }
  };

  const SortArrow = ({ col }) => (
    <span style={{ marginLeft: 4, fontSize: 10, color: sortCol === col ? T.text : T.textMuted }}>
      {sortCol === col ? (sortAsc ? "↑" : "↓") : "↕"}
    </span>
  );

  return (
    <section id="pools" style={{
      padding: "40px 48px 100px", position: "relative", overflow: "hidden",
      background: `linear-gradient(180deg, #EDE8E0 0%, #E8E3DA 60%, ${T.bgWarm} 100%)`,
    }}>
      {/* Floating warm orbs */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{
          position: "absolute", top: "10%", left: "8%", width: 220, height: 220, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(34,197,94,0.18) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}/>
        <div style={{
          position: "absolute", top: "50%", right: "5%", width: 280, height: 280, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}/>
        <div style={{
          position: "absolute", bottom: "5%", left: "30%", width: 200, height: 200, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(249,115,22,0.10) 0%, transparent 70%)",
          filter: "blur(45px)",
        }}/>
        <div style={{
          position: "absolute", top: "25%", left: "55%", width: 160, height: 160, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%)",
          filter: "blur(35px)",
        }}/>
      </div>

      <div style={{ maxWidth: 1120, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 12 }}>
              Live Data
            </p>
            <h2 style={{ fontSize: 36, fontWeight: 600, color: T.text, letterSpacing: "-1px", margin: 0 }}>
              Yield verification table
            </h2>
          </div>
          <p style={{ fontSize: 13, color: T.textMuted }}>
            Click any row to see yield distribution
          </p>
        </div>

        <div style={{
          background: "rgba(245,243,238,0.55)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderRadius: T.radiusLg,
          border: "1px solid rgba(255,255,255,0.5)",
          overflow: "hidden",
          boxShadow: "0 8px 40px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.7)",
        }}>
          {/* Header */}
          <div style={{
            display: "grid", gridTemplateColumns: "2.5fr 1fr 1fr 1fr 0.8fr",
            padding: "14px 28px",
            borderBottom: "1px solid rgba(255,255,255,0.45)",
            background: "rgba(245,243,238,0.4)",
          }}>
            {[
              { label: "Pool", col: "pool" },
              { label: "Nominal Yield", col: "nominal" },
              { label: "Real Yield", col: "real" },
              { label: "TVL", col: "tvl" },
              { label: "Risk", col: "risk" },
            ].map(({ label, col }) => (
              <div key={col}
                onClick={() => handleSort(col)}
                style={{
                  fontSize: 12, fontWeight: 600, color: T.textMuted, cursor: "pointer",
                  textTransform: "uppercase", letterSpacing: "0.5px",
                  display: "flex", alignItems: "center", userSelect: "none",
                }}>
                {label}<SortArrow col={col} />
              </div>
            ))}
          </div>

          {/* Rows */}
          {sorted.map((p, idx) => {
            const isOpen = expanded === idx;
            const rc = RISK_COLORS[p.risk] || RISK_COLORS.B;
            const delta = p.nominal - p.real;

            return (
              <div key={idx}>
                <div
                  onClick={() => setExpanded(isOpen ? null : idx)}
                  style={{
                    display: "grid", gridTemplateColumns: "2.5fr 1fr 1fr 1fr 0.8fr",
                    padding: "18px 28px", cursor: "pointer",
                    borderBottom: "1px solid rgba(255,255,255,0.35)",
                    background: isOpen ? "rgba(245,243,238,0.5)" : "transparent",
                    transition: "background 0.15s",
                  }}
                >
                  {/* Pool */}
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: "50%",
                      background: "rgba(255,255,255,0.5)",
                      border: "1px solid rgba(255,255,255,0.6)",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      overflow: "hidden", flexShrink: 0,
                    }}>
                      {p.logo ? (
                        <img
                          src={p.logo}
                          alt={p.ticker}
                          style={{ width: ["ETH","WBETH","weETH"].includes(p.ticker) ? 22 : 32, height: ["ETH","WBETH","weETH"].includes(p.ticker) ? 22 : 32, borderRadius: "50%", objectFit: "contain" }}
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.parentElement.style.background = "linear-gradient(135deg, #D4C8B8, #BFB5A5)";
                            e.target.parentElement.innerHTML = `<span style="font-size:14px;font-weight:700;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,0.15)">${p.ticker.charAt(0)}</span>`;
                          }}
                        />
                      ) : (
                        <div style={{
                          width: 40, height: 40, borderRadius: "50%",
                          background: "linear-gradient(135deg, #D4C8B8, #BFB5A5)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: "#fff", textShadow: "0 1px 2px rgba(0,0,0,0.15)" }}>{p.ticker.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <span style={{ fontSize: 14, fontWeight: 500, color: T.text }}>{p.pool}</span>
                      <span style={{ display: "block", fontSize: 12, color: T.textMuted, marginTop: 2 }}>{p.ticker}</span>
                    </div>
                  </div>

                  {/* Nominal */}
                  <div style={{ display: "flex", alignItems: "center", fontSize: 14, fontWeight: 500, color: T.text }}>
                    {p.nominal.toFixed(2)}%
                  </div>

                  {/* Real */}
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: T.green }}>{p.real.toFixed(2)}%</span>
                    {delta > 0.3 && (
                      <span style={{ fontSize: 11, color: T.orange, fontWeight: 500 }}>
                        −{delta.toFixed(1)}%
                      </span>
                    )}
                  </div>

                  {/* TVL */}
                  <div style={{ display: "flex", alignItems: "center", fontSize: 14, color: T.textSoft }}>
                    {p.tvl}
                  </div>

                  {/* Risk */}
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 5,
                      padding: "4px 10px", borderRadius: 100,
                      background: rc.bg, border: `1px solid ${rc.border}`,
                      fontSize: 12, fontWeight: 500, color: rc.text,
                    }}>
                      {p.risk}
                      <span style={{ fontWeight: 400 }}>{p.riskLabel}</span>
                    </span>
                  </div>
                </div>

                {/* Expanded distribution panel */}
                {isOpen && (
                  <div style={{
                    padding: "28px 28px 32px",
                    background: "rgba(245,243,238,0.45)",
                    borderBottom: "1px solid rgba(255,255,255,0.35)",
                  }}>
                    <div style={{ display: "flex", gap: 40, alignItems: "flex-start" }}>
                      {/* Chart */}
                      <div style={{
                        background: "rgba(245,243,238,0.55)", borderRadius: 16,
                        border: "1px solid rgba(255,255,255,0.5)", padding: "20px 16px 12px",
                        flexShrink: 0, backdropFilter: "blur(12px)",
                      }}>
                        <YieldDistChart nominal={p.nominal} real={p.real} stddev={p.stddev} />
                      </div>

                      {/* Stats */}
                      <div style={{ flex: 1, paddingTop: 4 }}>
                        <h4 style={{ fontSize: 16, fontWeight: 600, color: T.text, margin: "0 0 20px" }}>
                          Yield Probability Breakdown
                        </h4>

                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                          <div style={{
                            padding: "14px 18px", borderRadius: 12,
                            background: "rgba(245,243,238,0.55)", border: "1px solid rgba(255,255,255,0.5)",
                          }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                              <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>68% Probability</span>
                              <span style={{ fontSize: 12, color: T.green, fontWeight: 500 }}>1σ range</span>
                            </div>
                            <div style={{ fontSize: 20, fontWeight: 600, color: T.text, letterSpacing: "-0.5px" }}>
                              {(p.real - p.stddev).toFixed(2)}% — {(p.real + p.stddev).toFixed(2)}%
                            </div>
                          </div>

                          <div style={{
                            padding: "14px 18px", borderRadius: 12,
                            background: "rgba(245,243,238,0.55)", border: "1px solid rgba(255,255,255,0.5)",
                          }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                              <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>95% Probability</span>
                              <span style={{ fontSize: 12, color: T.blue, fontWeight: 500 }}>2σ range</span>
                            </div>
                            <div style={{ fontSize: 20, fontWeight: 600, color: T.text, letterSpacing: "-0.5px" }}>
                              {(p.real - 2 * p.stddev).toFixed(2)}% — {(p.real + 2 * p.stddev).toFixed(2)}%
                            </div>
                          </div>

                          <div style={{ display: "flex", gap: 12 }}>
                            <div style={{
                              flex: 1, padding: "14px 18px", borderRadius: 12,
                              background: "rgba(245,243,238,0.55)", border: "1px solid rgba(255,255,255,0.5)",
                            }}>
                              <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 4 }}>Risk Delta (δ)</div>
                              <div style={{ fontSize: 18, fontWeight: 600, color: delta > 1 ? T.orange : T.text }}>
                                {delta.toFixed(2)}%
                              </div>
                            </div>
                            <div style={{
                              flex: 1, padding: "14px 18px", borderRadius: 12,
                              background: "rgba(245,243,238,0.55)", border: "1px solid rgba(255,255,255,0.5)",
                            }}>
                              <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 4 }}>Lock-up</div>
                              <div style={{ fontSize: 18, fontWeight: 600, color: T.text }}>
                                {p.lockup}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── Process ─── */
function Process() {
  const steps = [
    { n: "01", t: "Collect", d: "Pull real-time TVL, fee revenue, token distribution, and staking flow data from on-chain sources including DeFiLlama, Dune Analytics, and StakingRewards." },
    { n: "02", t: "Decompose", d: "Break each protocol's yield into primitives — rebase, reward distribution, fee sharing, lending interest, and AUM performance — then compute an independent APY." },
    { n: "03", t: "Quantify", d: "Calculate Risk(δ) = Nominal APY − Own APY to measure the risk premium. Score every protocol across all six risk parameters with weighted analysis." },
    { n: "04", t: "Construct", d: "The AI agent assembles a portfolio matching your investment policy — balancing target yields with acceptable risk levels and lock-up preferences." },
  ];

  return (
    <section id="process" style={{
      padding: "120px 48px", background: T.bgDark, color: "#fff",
    }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <div style={{ marginBottom: 64 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 12 }}>
            Process
          </p>
          <h2 style={{ fontSize: 36, fontWeight: 600, letterSpacing: "-1px", margin: 0, color: "#fff" }}>
            From on-chain data to your portfolio
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1 }}>
          {steps.map((s, i) => (
            <div key={i} style={{
              padding: "36px 28px",
              background: T.bgDarkCard,
              borderRadius: i === 0 ? "16px 0 0 16px" : i === 3 ? "0 16px 16px 0" : 0,
            }}>
              <div style={{
                fontSize: 48, fontWeight: 700, color: "rgba(255,255,255,0.06)",
                lineHeight: 1, marginBottom: 24,
                fontFamily: "'Inter', monospace",
              }}>
                {s.n}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 12px", color: "#fff" }}>
                {s.t}
              </h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: 0 }}>
                {s.d}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA ─── */
function CTA({ onDemo }) {
  return (
    <section style={{
      padding: "120px 48px", textAlign: "center",
      background: T.bg,
    }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <h2 style={{ fontSize: 36, fontWeight: 600, color: T.text, letterSpacing: "-1px", margin: "0 0 16px" }}>
          Ready to verify your yield?
        </h2>
        <p style={{ fontSize: 16, color: T.textSoft, lineHeight: 1.7, marginBottom: 36 }}>
          Chat with our AI agent to explore on-chain verified yields and build a risk-adjusted portfolio.
        </p>
        <button onClick={onDemo} style={{
          padding: "16px 40px", borderRadius: 100, border: "none",
          background: T.accent, color: "#fff",
          fontWeight: 500, fontSize: 16, cursor: "pointer",
          display: "inline-flex", alignItems: "center", gap: 8,
          boxShadow: "0 2px 16px rgba(0,0,0,0.1)",
        }}>
          Try the Demo
          {Icons.arrow}
        </button>
      </div>
    </section>
  );
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer style={{
      padding: "32px 48px", borderTop: `1px solid rgba(0,0,0,0.06)`,
      display: "flex", justifyContent: "space-between", alignItems: "center",
      background: T.bg,
    }}>
      <span style={{ fontSize: 15, fontWeight: 600, color: T.text, letterSpacing: "-0.3px" }}>
        init<span style={{ fontWeight: 300 }}>Farm</span>
      </span>
      <span style={{ fontSize: 13, color: T.textMuted }}>
        Initia Hackathon {new Date().getFullYear()}
      </span>
    </footer>
  );
}

/* ─── Chat Components ─── */
function ChatMessage({ role, content }) {
  const isUser = role === "user";
  return (
    <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", marginBottom: 20 }}>
      <div style={{
        maxWidth: "78%", display: "flex", gap: 10,
        flexDirection: isUser ? "row-reverse" : "row", alignItems: "flex-start",
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8, flexShrink: 0,
          background: isUser ? T.bgWarm : T.accent,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 12, color: isUser ? T.text : "#fff", fontWeight: 600,
          border: isUser ? `1px solid ${T.cardBorder}` : "none",
        }}>
          {isUser ? "W" : "iF"}
        </div>
        <div style={{
          background: isUser ? T.bgWarm : T.card,
          borderRadius: 14, padding: "14px 18px",
          fontSize: 14, color: T.text, lineHeight: 1.7,
          whiteSpace: "pre-wrap",
          border: `1px solid ${T.cardBorder}`,
        }}>
          {content}
        </div>
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 20 }}>
      <div style={{
        width: 30, height: 30, borderRadius: 8,
        background: T.accent, display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 12, color: "#fff", fontWeight: 600,
      }}>iF</div>
      <div style={{
        background: T.card, borderRadius: 14, padding: "14px 18px",
        display: "flex", gap: 5, border: `1px solid ${T.cardBorder}`,
      }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            width: 7, height: 7, borderRadius: "50%",
            background: T.textMuted,
            animation: `dotPulse 1.4s ${i * 0.16}s infinite ease-in-out`,
          }}/>
        ))}
      </div>
    </div>
  );
}

/* ─── Chat Panel ─── */
function ChatPanel({ onClose }) {
  const [messages, setMessages] = useState([{
    role: "assistant",
    content: `Welcome to initFarm. I'm your on-chain yield advisor.

I verify DeFi APY claims, assess protocol risk, and build portfolios matched to your profile.

A few things to try:
  "Build me a yield farming portfolio"
  "Risk assessment for DeFi protocols"
  "Tell me about Initia staking"`,
  }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  const send = () => {
    if (!input.trim() || typing) return;
    const msg = input.trim();
    setInput("");
    setMessages((p) => [...p, { role: "user", content: msg }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((p) => [...p, { role: "assistant", content: getAIResponse(msg) }]);
    }, 1200 + Math.random() * 800);
  };

  const chips = ["Build me a portfolio", "Risk analysis", "About Initia"];

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(26,26,26,0.25)", backdropFilter: "blur(16px)",
      display: "flex", justifyContent: "center", alignItems: "center",
      padding: 24,
    }}>
      <div style={{
        width: "100%", maxWidth: 680, height: "82vh",
        background: T.bg, borderRadius: 24,
        display: "flex", flexDirection: "column", overflow: "hidden",
        boxShadow: "0 32px 80px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)",
      }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "18px 24px", borderBottom: `1px solid ${T.cardBorder}`,
          background: T.card,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: T.accent, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, color: "#fff", fontWeight: 700,
            }}>iF</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>initFarm Agent</div>
              <div style={{ fontSize: 12, color: T.green, display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 5, height: 5, borderRadius: 100, background: T.green }}/>
                Analyzing on-chain data
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 34, height: 34, borderRadius: 10,
            border: `1px solid ${T.cardBorder}`, background: "transparent",
            color: T.textMuted, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {Icons.close}
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: 24, background: T.bg }}>
          {messages.map((m, i) => <ChatMessage key={i} role={m.role} content={m.content}/>)}
          {typing && <TypingDots/>}
          <div ref={endRef}/>
        </div>

        {messages.length <= 1 && (
          <div style={{ padding: "0 24px 12px", display: "flex", gap: 8, background: T.bg }}>
            {chips.map((c) => (
              <button key={c} onClick={() => {
                setMessages((p) => [...p, { role: "user", content: c }]);
                setTyping(true);
                setTimeout(() => {
                  setTyping(false);
                  setMessages((p) => [...p, { role: "assistant", content: getAIResponse(c) }]);
                }, 1200 + Math.random() * 800);
              }} style={{
                padding: "8px 14px", borderRadius: 100,
                border: `1px solid ${T.cardBorder}`, background: T.card,
                color: T.textSoft, fontSize: 13, cursor: "pointer",
                transition: "all 0.15s", fontFamily: "'Inter', sans-serif",
              }}>
                {c}
              </button>
            ))}
          </div>
        )}

        <div style={{
          padding: "16px 24px", borderTop: `1px solid ${T.cardBorder}`,
          display: "flex", gap: 10, background: T.card,
        }}>
          <input
            type="text" value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask about yield farming..."
            style={{
              flex: 1, padding: "13px 16px", borderRadius: 12,
              border: `1px solid ${T.cardBorder}`, background: T.bgWarm,
              color: T.text, fontSize: 14, outline: "none",
              fontFamily: "'Inter', sans-serif",
            }}
          />
          <button onClick={send} disabled={!input.trim() || typing} style={{
            width: 46, height: 46, borderRadius: 12,
            border: "none", cursor: input.trim() && !typing ? "pointer" : "default",
            background: input.trim() && !typing ? T.accent : T.bgWarm,
            color: input.trim() && !typing ? "#fff" : T.textMuted,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.15s",
          }}>
            {Icons.send}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── App ─── */
export default function App() {
  const [chat, setChat] = useState(false);
  const [wallet, setWallet] = useState(false);

  return (
    <div style={{ background: T.bg, minHeight: "100vh", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;450;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; scroll-padding-top: 80px; -webkit-font-smoothing: antialiased; }
        body { background: ${T.bg}; }
        ::selection { background: rgba(26,26,26,0.12); }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 10px; }
        @keyframes dotPulse {
          0%, 80%, 100% { transform: scale(0.4); opacity: 0.3; }
          40% { transform: scale(1); opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        a { transition: color 0.15s ease; }
        a:hover { color: ${T.text} !important; }
        button { font-family: inherit; }
      `}</style>

      <Navbar onDemo={() => setChat(true)} onWallet={() => setWallet(true)} />
      <Hero onDemo={() => setChat(true)} onWallet={() => setWallet(true)} />
      <PoolTable />
      <Features />
      <Process />
      <CTA onDemo={() => setChat(true)} />
      <Footer />
      {chat && <ChatPanel onClose={() => setChat(false)} />}
      {wallet && <WalletPanel onClose={() => setWallet(false)} />}
    </div>
  );
}
