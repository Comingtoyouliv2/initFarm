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
    icon: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMjkuNC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogOS4wMyBCdWlsZCAwKSAgLS0+CjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiCgkgdmlld0JveD0iMCAwIDE0MiAxMzYuODc4IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxNDIgMTM2Ljg3ODsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8cGF0aCBzdHlsZT0iZmlsbDojRkY1QzE2OyIgZD0iTTEzMi42ODIsMTMyLjE5MmwtMzAuNTgzLTkuMTA2bC0yMy4wNjMsMTMuNzg3bC0xNi4wOTItMC4wMDdsLTIzLjA3Ny0xMy43OGwtMzAuNTY5LDkuMTA2TDAsMTAwLjgwMQoJbDkuMjk5LTM0LjgzOUwwLDM2LjUwN0w5LjI5OSwwbDQ3Ljc2NiwyOC41MzhoMjcuODVMMTMyLjY4MiwwbDkuMjk5LDM2LjUwN2wtOS4yOTksMjkuNDU1bDkuMjk5LDM0LjgzOUwxMzIuNjgyLDEzMi4xOTIKCUwxMzIuNjgyLDEzMi4xOTJ6Ii8+Cjwvc3ZnPgo=",
    desc: "Connect with MetaMask browser extension",
    color: "#F6851B",
  },
  {
    name: "Phantom",
    icon: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiB2aWV3Qm94PSIwIDAgMTI4IDEyOCIgZmlsbD0ibm9uZSI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiBmaWxsPSIjQUI5RkYyIi8+Cjwvc3ZnPgo=",
    desc: "Connect with Phantom wallet",
    color: "#AB9FF2",
  },
];
/* ─── Demo Chat Responses ─── */
const DEMO_RESPONSES = [
  {
    trigger: "portfolio",
    response: "Based on your risk profile, here's a recommended allocation:\nConservative (60%)\n  Ethereum Staking (Lido) \u2014 30%, APY 3.8%, Risk 2/10\n  USDC Lending (Aave) \u2014 30%, APY 5.2%, Risk 1/10\nGrowth (30%)\n  Osmosis LP (ATOM/OSMO) \u2014 15%, APY 18.4%, Risk 5/10\n  Initia Staking \u2014 15%, APY 14.2%, Risk 4/10\nHigh-Yield (10%)\n  DYM Staking \u2014 10%, APY 17.05%, Risk 7/10\nPortfolio Summary\n  Blended APY: ~9.8%  |  Risk Score: 3.4/10\n  Avg Lock-up: 21 days",
  },
  {
    trigger: "risk",
    response: "Risk Assessment \u2014 6-Factor Analysis\n1. TVL \u2014 $2.4B locked, trending +12% (30d)\n   Herfindahl Index: 0.08, Whale Risk: 3.2%\n2. APY Stability \u2014 90d volatility \u03c3 = 2.1%\n   Coverage Ratio: 0.72 (revenue-backed)\n3. Token Price \u2014 30d: +8.4%, 90d: +22.1%\n   Daily \u03c3: 3.8%\n4. Lock-up \u2014 14 days, Risk Score: 4/10\nRisk Delta\n  Risk(\u03b4) = 14.2% \u2212 11.8% = 2.4%\n  This gap is the risk premium in the advertised rate.",
  },
  {
    trigger: "initia",
    response: "Initia Network \u2014 Yield Opportunity\nInitia provides infrastructure for interwoven rollups with native staking support.\nMetrics\n  Staking APY: ~14.2%\n  TVL Trend: Stable growth post-mainnet\n  Unbonding: 7\u201321 days (flexible)\nWhy Initia?\n  Native token integration with initFarm agent\n  Transparent on-chain data for APY verification\n  Multi-chain rollup architecture reduces single-point risk\nAPY Verification\n  Own APY = f(TVL, Period, Concentration, Price, Lock-up)\n  We independently verify actual vs. advertised yield.",
  },
];
function getAIResponse(msg) {
  const l = msg.toLowerCase();
  for (const d of DEMO_RESPONSES) if (l.includes(d.trigger)) return d.response;
  return "I can analyze that for you using live on-chain data.\nCurrent Market Snapshot\n  Total DeFi TVL: $187.3B\n  Avg Staking APY (Top 50): ~13.2%\n  Min recommended lock-up: 7 days\nI can help with:\n  \u2014 Personalized portfolio construction\n  \u2014 Protocol-level risk assessment\n  \u2014 APY verification & sustainability\n  \u2014 Initia ecosystem opportunities\nTry asking about portfolio allocation, risk analysis, or Initia staking.";
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
        <div style={{
          padding: "24px 28px 20px",
          borderBottom: `1px solid ${T.cardBorder}`,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: T.text, margin: 0 }}>Connect Wallet</h3>
            <p style={{ fontSize: 13, color: T.textMuted, margin: "4px 0 0" }}>Sign in to access your portfolio</p>
          </div>
          <button onClick={onClose} style={{
            width: 34, height: 34, borderRadius: 10,
            border: `1px solid ${T.cardBorder}`, background: "transparent",
            color: T.textMuted, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>{Icons.close}</button>
        </div>
        <div style={{ padding: 28, flex: 1 }}>
          {connected ? (
            <div style={{ textAlign: "center", paddingTop: 40 }}>
              <div style={{
                width: 64, height: 64, borderRadius: 20,
                background: T.greenSoft, border: `2px solid ${T.greenBorder}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 20px", fontSize: 28,
              }}>{"\u2713"}</div>
              <h4 style={{ fontSize: 18, fontWeight: 600, color: T.text, margin: "0 0 8px" }}>Connected</h4>
              <p style={{ fontSize: 14, color: T.textSoft, margin: "0 0 8px" }}>{connected}</p>
              <p style={{
                fontSize: 13, color: T.textMuted,
                fontFamily: "'SF Mono', 'Fira Code', monospace",
                background: T.bgWarm, padding: "8px 14px", borderRadius: 8,
                display: "inline-block", marginTop: 8,
              }}>0x7a3F...e92B</p>
              <button onClick={() => { setConnected(null); }} style={{
                marginTop: 32, padding: "12px 28px", borderRadius: 100,
                border: `1px solid ${T.cardBorder}`, background: "transparent",
                color: T.textSoft, fontSize: 14, fontWeight: 500, cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
              }}>Disconnect</button>
            </div>
          ) : (
            <>
              <p style={{ fontSize: 13, color: T.textMuted, marginBottom: 20, fontWeight: 500, textTransform: "uppercase", letterSpacing: "1px" }}>Choose wallet</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {WALLETS.map((w) => (
                  <button key={w.name} onClick={() => handleConnect(w.name)} disabled={!!connecting}
                    style={{
                      display: "flex", alignItems: "center", gap: 16,
                      padding: "18px 20px", borderRadius: 16,
                      border: `1px solid ${T.cardBorder}`,
                      background: connecting === w.name ? T.bgWarm : T.card,
                      cursor: connecting ? "default" : "pointer",
                      transition: "all 0.15s", textAlign: "left", width: "100%",
                      fontFamily: "'Inter', sans-serif",
                    }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12, background: w.color,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      overflow: "hidden", flexShrink: 0,
                    }}>
                      <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>{w.name[0]}</span>
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
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={T.textMuted} strokeWidth="1.5" strokeLinecap="round"><path d="M6 4l4 4-4 4"/></svg>
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
    let ticking = false;
    const h = () => {
      if (!ticking) {
        requestAnimationFrame(() => { setScrolled(window.scrollY > 40); ticking = false; });
        ticking = true;
      }
    };
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  const links = [
    { label: "Features", href: "#features" },
    { label: "Pools", href: "#pools" },
    { label: "Process", href: "#process" },
    { label: "Pricing", href: "#pricing" },
  ];
  return (
    <>
      {/* ── Full-width bar (default, top) ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        height: 72,
        display: "flex", justifyContent: "center", alignItems: "center",
        background: "transparent",
        transition: "opacity 0.4s ease, transform 0.4s ease",
        opacity: scrolled ? 0 : 1,
        pointerEvents: scrolled ? "none" : "auto",
        transform: scrolled ? "translateY(-10px)" : "translateY(0)",
      }}>
        <div style={{
          width: "100%", maxWidth: 1200, padding: "0 32px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <a href="#" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10, background: T.text,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ color: "#fff", fontSize: 13, fontWeight: 700, letterSpacing: "-0.5px" }}>iF</span>
            </div>
            <span style={{ fontSize: 20, fontWeight: 700, color: T.text, letterSpacing: "-0.6px" }}>
              init<span style={{ fontWeight: 300, color: T.textSoft }}>Farm</span>
            </span>
          </a>
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            {links.map((l) => (
              <a key={l.label} href={l.href} className="nav-link-hover" style={{
                color: T.textSoft, textDecoration: "none", fontSize: 14, fontWeight: 450,
                transition: "color 0.2s ease",
              }}>{l.label}</a>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={onDemo} className="nav-btn-primary" style={{
              padding: "9px 22px", borderRadius: 100, border: "none",
              background: T.accent, color: "#fff", fontWeight: 500, fontSize: 14,
              cursor: "pointer", fontFamily: "inherit",
              transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            }}>Try Demo</button>
            <button onClick={onWallet} className="nav-btn-secondary" style={{
              padding: "9px 18px", borderRadius: 100,
              border: "1px solid rgba(0,0,0,0.08)",
              background: "rgba(245,243,238,0.5)",
              color: T.text, fontWeight: 500, fontSize: 14,
              cursor: "pointer", fontFamily: "inherit",
              display: "flex", alignItems: "center", gap: 6,
              transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
              boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
            }}>{Icons.wallet} Connect</button>
          </div>
        </div>
      </nav>

      {/* ── Floating pill (appears on scroll) ── */}
      <div style={{
        position: "fixed",
        top: scrolled ? 16 : -80,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 101,
        opacity: scrolled ? 1 : 0,
        transition: "all 0.5s cubic-bezier(0.32, 0.72, 0, 1)",
        pointerEvents: scrolled ? "auto" : "none",
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "8px 8px 8px 20px",
          borderRadius: 100,
          background: "rgba(255, 255, 255, 0.65)",
          backdropFilter: "blur(24px) saturate(1.8)",
          WebkitBackdropFilter: "blur(24px) saturate(1.8)",
          border: "1px solid rgba(255,255,255,0.5)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.6)",
        }}>
          {/* Logo mark in pill */}
          <a href="#" style={{
            width: 28, height: 28, borderRadius: 8, background: T.text,
            display: "flex", alignItems: "center", justifyContent: "center",
            textDecoration: "none", flexShrink: 0, marginRight: 8,
          }}>
            <span style={{ color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "-0.5px" }}>iF</span>
          </a>

          {/* Separator */}
          <div style={{ width: 1, height: 20, background: "rgba(0,0,0,0.08)", flexShrink: 0 }} />

          {/* Nav links */}
          <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "0 4px" }}>
            {links.map((l) => (
              <a key={l.label} href={l.href} className="pill-link" style={{
                color: T.textSoft, textDecoration: "none",
                fontSize: 13, fontWeight: 500,
                padding: "6px 14px", borderRadius: 100,
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
              }}>{l.label}</a>
            ))}
          </div>

          {/* Separator */}
          <div style={{ width: 1, height: 20, background: "rgba(0,0,0,0.08)", flexShrink: 0 }} />

          {/* CTA buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button onClick={onDemo} className="pill-btn-primary" style={{
              padding: "7px 18px", borderRadius: 100, border: "none",
              background: T.text, color: "#fff",
              fontWeight: 500, fontSize: 13, cursor: "pointer",
              fontFamily: "inherit", whiteSpace: "nowrap",
              transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
              boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            }}>Try Demo</button>
            <button onClick={onWallet} className="pill-btn-wallet" style={{
              padding: "7px 14px", borderRadius: 100,
              border: "1px solid rgba(0,0,0,0.06)",
              background: "rgba(245,243,238,0.6)",
              color: T.text, fontWeight: 500, fontSize: 13,
              cursor: "pointer", fontFamily: "inherit",
              display: "flex", alignItems: "center", gap: 5,
              whiteSpace: "nowrap",
              transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
            }}>{Icons.wallet} Connect</button>
          </div>
        </div>
      </div>
    </>
  );
}
/* ─── Hero ─── */
function Hero({ onDemo, onWallet }) {
  return (
    <section style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", textAlign: "center",
      padding: "140px 48px 80px", position: "relative",
      background: `linear-gradient(180deg, ${T.bg} 0%, ${T.bgWarm} 50%, #EDE8E0 100%)`,
    }}>
      <div style={{
        position: "absolute", inset: 0, opacity: 0.4,
        backgroundImage: "linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)",
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
          }}>{"\u2713"}</span>
          <span style={{ fontSize: 13, fontWeight: 500, color: "#15803D" }}>Built on Initia Network</span>
        </div>
        <h1 style={{
          fontSize: 60, fontWeight: 600, lineHeight: 1.1,
          color: T.text, letterSpacing: "-2px", margin: "0 0 24px",
          fontFamily: "'Inter', sans-serif",
        }}>Smarter yield,<br/>verified on-chain</h1>
        <p style={{
          fontSize: 18, color: T.textSoft, lineHeight: 1.7,
          margin: "0 auto 48px", maxWidth: 520, fontWeight: 400,
        }}>initFarm analyzes DeFi protocols with on-chain data to verify APY claims, quantify risk, and build portfolios tailored to you.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button onClick={onDemo} style={{
            padding: "14px 32px", borderRadius: 100, border: "none",
            background: T.accent, color: "#fff",
            fontWeight: 500, fontSize: 15, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 8,
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          }}>Launch Demo {Icons.arrow}</button>
          <button onClick={onWallet} style={{
            padding: "14px 32px", borderRadius: 100,
            border: "1px solid rgba(255,255,255,0.5)",
            background: "rgba(245,243,238,0.5)",
            backdropFilter: "blur(16px)",
            color: T.text, fontWeight: 500, fontSize: 15, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 8,
            boxShadow: "0 2px 12px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.6)",
          }}>{Icons.wallet} Connect Wallet</button>
        </div>
      </div>
    </section>
  );
}
/* ─── Features ─── */
function Features() {
  const items = [
    { icon: Icons.verify, title: "APY Verification", desc: "We independently compute yields from on-chain data \u2014 TVL, revenue, fees \u2014 and compare against what protocols advertise.", tag: "Core Engine" },
    { icon: Icons.chart, title: "6-Factor Risk Model", desc: "Every protocol is scored across TVL stability, APY consistency, revenue coverage, whale concentration, token trends, and lock-up risk.", tag: "Risk Analysis" },
    { icon: Icons.bot, title: "AI Portfolio Agent", desc: "Describe your risk tolerance and goals in natural language. Our agent builds a diversified yield farming portfolio matched to your profile.", tag: "Intelligence" },
    { icon: Icons.monitor, title: "Continuous Monitoring", desc: "Track APY shifts, TVL outflows, and whale movements in real-time. Get alerts when risk thresholds change.", tag: "Monitoring" },
  ];
  return (
    <section id="features" style={{ padding: "100px 48px", maxWidth: 1120, margin: "0 auto" }}>
      <div style={{ marginBottom: 64 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 12 }}>Capabilities</p>
        <h2 style={{ fontSize: 36, fontWeight: 600, color: T.text, letterSpacing: "-1px", margin: 0, maxWidth: 400 }}>What makes initFarm different</h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {items.map((item) => (
          <div key={item.title} style={{
            padding: 36, borderRadius: T.radiusLg,
            border: `1px solid ${T.cardBorder}`, background: T.card,
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: T.bgWarm, color: T.text,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>{item.icon}</div>
              <span style={{
                fontSize: 11, fontWeight: 500, color: T.textMuted,
                padding: "4px 10px", borderRadius: 100,
                border: "1px solid rgba(0,0,0,0.08)",
              }}>{item.tag}</span>
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: T.text, margin: "0 0 10px" }}>{item.title}</h3>
            <p style={{ fontSize: 15, color: T.textSoft, lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
/* ─── Yield Distribution Chart ─── */
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
  for (let v = real - 3 * stddev; v <= real + 3 * stddev + 0.001; v += stddev) ticks.push(v);
  return (
    <svg width={W} height={H} style={{ display: "block" }}>
      <path d={fill95D} fill="rgba(34,197,94,0.08)" />
      <path d={fill68D} fill="rgba(34,197,94,0.18)" />
      <path d={pathD} fill="none" stroke={T.green} strokeWidth="2" />
      <line x1={pad.l} y1={sy(0)} x2={W - pad.r} y2={sy(0)} stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
      {ticks.map((v, i) => (
        <g key={i}>
          <line x1={sx(v)} y1={sy(0)} x2={sx(v)} y2={sy(0) + 4} stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
          <text x={sx(v)} y={sy(0) + 18} textAnchor="middle" fontSize="10" fill={T.textMuted} fontFamily="Inter, sans-serif">{v.toFixed(1)}%</text>
        </g>
      ))}
      <line x1={sx(real)} y1={pad.t} x2={sx(real)} y2={sy(0)} stroke={T.green} strokeWidth="1.5" strokeDasharray="4,3" />
      <text x={sx(real)} y={pad.t - 6} textAnchor="middle" fontSize="11" fill={T.green} fontWeight="600" fontFamily="Inter, sans-serif">Real {real.toFixed(1)}%</text>
      {Math.abs(nominal - real) > 0.2 && (
        <>
          <line x1={sx(nominal)} y1={pad.t + 10} x2={sx(nominal)} y2={sy(0)} stroke={T.orange} strokeWidth="1.5" strokeDasharray="4,3" />
          <text x={sx(nominal)} y={pad.t + 4} textAnchor="middle" fontSize="11" fill={T.orange} fontWeight="600" fontFamily="Inter, sans-serif">Nominal {nominal.toFixed(1)}%</text>
        </>
      )}
      <text x={sx(real)} y={sy(0) + 38} textAnchor="middle" fontSize="10" fill={T.textSoft} fontFamily="Inter, sans-serif">
        {`68% \u2192 [${prob68.lo.toFixed(1)}%, ${prob68.hi.toFixed(1)}%]  \u00b7  95% \u2192 [${prob95.lo.toFixed(1)}%, ${prob95.hi.toFixed(1)}%]`}
      </text>
    </svg>
  );
}
/* ─── Pool Data ─── */
const POOL_DATA = [
  { pool: "Lido ETH Staking", ticker: "ETH", nominal: 2.51, real: 2.31, stddev: 0.35, tvl: "$19.6B", risk: "A", riskLabel: "Lowest", lockup: "None" },
  { pool: "Binance ETH Staking", ticker: "WBETH", nominal: 2.61, real: 2.38, stddev: 0.32, tvl: "$7.3B", risk: "A", riskLabel: "Lowest", lockup: "None" },
  { pool: "EtherFi ETH Staking", ticker: "weETH", nominal: 2.43, real: 2.10, stddev: 0.42, tvl: "$6.3B", risk: "B", riskLabel: "Low", lockup: "None" },
  { pool: "Sky USD Fee Sharing", ticker: "USDS", nominal: 4.00, real: 3.65, stddev: 0.55, tvl: "$5.5B", risk: "A", riskLabel: "Lowest", lockup: "None" },
  { pool: "Aave ETH Lending", ticker: "weETH", nominal: 1.82, real: 1.82, stddev: 0.90, tvl: "$5.0B", risk: "B", riskLabel: "Low", lockup: "None" },
  { pool: "Ethena USD Yield", ticker: "USDe", nominal: 3.54, real: 2.90, stddev: 0.72, tvl: "$3.5B", risk: "B", riskLabel: "Low", lockup: "7 days" },
  { pool: "Polkadot Staking", ticker: "DOT", nominal: 12.00, real: 5.50, stddev: 1.80, tvl: "$4.8B", risk: "C", riskLabel: "Medium", lockup: "28 days" },
  { pool: "Solana Staking", ticker: "SOL", nominal: 7.20, real: 5.80, stddev: 1.20, tvl: "$12.4B", risk: "B", riskLabel: "Low", lockup: "~2 days" },
  { pool: "Celestia Staking", ticker: "TIA", nominal: 14.20, real: 7.80, stddev: 2.80, tvl: "$3.2B", risk: "C", riskLabel: "Medium", lockup: "21 days" },
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
  const parseTVL = (s) => { const n = parseFloat(s.replace(/[$B]/g, "")); return isNaN(n) ? 0 : n; };
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
  const handleSort = (col) => { if (sortCol === col) setSortAsc(!sortAsc); else { setSortCol(col); setSortAsc(false); } };
  const SortArrow = ({ col }) => (
    <span style={{ marginLeft: 4, fontSize: 10, color: sortCol === col ? T.text : T.textMuted }}>
      {sortCol === col ? (sortAsc ? "\u2191" : "\u2193") : "\u2195"}
    </span>
  );
  return (
    <section id="pools" style={{
      padding: "40px 48px 100px", position: "relative", overflow: "hidden",
      background: `linear-gradient(180deg, #EDE8E0 0%, #E8E3DA 60%, ${T.bgWarm} 100%)`,
    }}>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "10%", left: "8%", width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,197,94,0.18) 0%, transparent 70%)", filter: "blur(40px)" }}/>
        <div style={{ position: "absolute", top: "50%", right: "5%", width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)", filter: "blur(50px)" }}/>
      </div>
      <div style={{ maxWidth: 1120, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 12 }}>Live Data</p>
            <h2 style={{ fontSize: 36, fontWeight: 600, color: T.text, letterSpacing: "-1px", margin: 0 }}>Yield verification table</h2>
          </div>
          <p style={{ fontSize: 13, color: T.textMuted }}>Click any row to see yield distribution</p>
        </div>
        <div style={{
          background: "rgba(245,243,238,0.55)", backdropFilter: "blur(24px)",
          borderRadius: T.radiusLg, border: "1px solid rgba(255,255,255,0.5)", overflow: "hidden",
          boxShadow: "0 8px 40px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.7)",
        }}>
          <div style={{
            display: "grid", gridTemplateColumns: "2.5fr 1fr 1fr 1fr 0.8fr",
            padding: "14px 28px", borderBottom: "1px solid rgba(255,255,255,0.45)",
            background: "rgba(245,243,238,0.4)",
          }}>
            {[{ label: "Pool", col: "pool" }, { label: "Nominal Yield", col: "nominal" }, { label: "Real Yield", col: "real" }, { label: "TVL", col: "tvl" }, { label: "Risk", col: "risk" }].map(({ label, col }) => (
              <div key={col} onClick={() => handleSort(col)} style={{
                fontSize: 12, fontWeight: 600, color: T.textMuted, cursor: "pointer",
                textTransform: "uppercase", letterSpacing: "0.5px",
                display: "flex", alignItems: "center", userSelect: "none",
              }}>{label}<SortArrow col={col} /></div>
            ))}
          </div>
          {sorted.map((p, idx) => {
            const isOpen = expanded === idx;
            const rc = RISK_COLORS[p.risk] || RISK_COLORS.B;
            const delta = p.nominal - p.real;
            return (
              <div key={idx}>
                <div onClick={() => setExpanded(isOpen ? null : idx)} style={{
                  display: "grid", gridTemplateColumns: "2.5fr 1fr 1fr 1fr 0.8fr",
                  padding: "18px 28px", cursor: "pointer",
                  borderBottom: "1px solid rgba(255,255,255,0.35)",
                  background: isOpen ? "rgba(245,243,238,0.5)" : "transparent",
                  transition: "background 0.15s",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: "50%",
                      background: "linear-gradient(135deg, #D4C8B8, #BFB5A5)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      border: "1px solid rgba(255,255,255,0.6)", boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                      flexShrink: 0,
                    }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#fff", textShadow: "0 1px 2px rgba(0,0,0,0.15)" }}>{p.ticker.charAt(0)}</span>
                    </div>
                    <div>
                      <span style={{ fontSize: 14, fontWeight: 500, color: T.text }}>{p.pool}</span>
                      <span style={{ display: "block", fontSize: 12, color: T.textMuted, marginTop: 2 }}>{p.ticker}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", fontSize: 14, fontWeight: 500, color: T.text }}>{p.nominal.toFixed(2)}%</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: T.green }}>{p.real.toFixed(2)}%</span>
                    {delta > 0.3 && <span style={{ fontSize: 11, color: T.orange, fontWeight: 500 }}>{"\u2212"}{delta.toFixed(1)}%</span>}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", fontSize: 14, color: T.textSoft }}>{p.tvl}</div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 5,
                      padding: "4px 10px", borderRadius: 100,
                      background: rc.bg, border: `1px solid ${rc.border}`,
                      fontSize: 12, fontWeight: 500, color: rc.text,
                    }}>{p.risk} <span style={{ fontWeight: 400 }}>{p.riskLabel}</span></span>
                  </div>
                </div>
                {isOpen && (
                  <div style={{ padding: "28px 28px 32px", background: "rgba(245,243,238,0.45)", borderBottom: "1px solid rgba(255,255,255,0.35)" }}>
                    <div style={{ display: "flex", gap: 40, alignItems: "flex-start" }}>
                      <div style={{ background: "rgba(245,243,238,0.55)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.5)", padding: "20px 16px 12px", flexShrink: 0 }}>
                        <YieldDistChart nominal={p.nominal} real={p.real} stddev={p.stddev} />
                      </div>
                      <div style={{ flex: 1, paddingTop: 4 }}>
                        <h4 style={{ fontSize: 16, fontWeight: 600, color: T.text, margin: "0 0 20px" }}>Yield Probability Breakdown</h4>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                          <div style={{ padding: "14px 18px", borderRadius: 12, background: "rgba(245,243,238,0.55)", border: "1px solid rgba(255,255,255,0.5)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                              <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>68% Probability</span>
                              <span style={{ fontSize: 12, color: T.green, fontWeight: 500 }}>{`1\u03c3 range`}</span>
                            </div>
                            <div style={{ fontSize: 20, fontWeight: 600, color: T.text, letterSpacing: "-0.5px" }}>
                              {`${(p.real - p.stddev).toFixed(2)}% \u2014 ${(p.real + p.stddev).toFixed(2)}%`}
                            </div>
                          </div>
                          <div style={{ padding: "14px 18px", borderRadius: 12, background: "rgba(245,243,238,0.55)", border: "1px solid rgba(255,255,255,0.5)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                              <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>95% Probability</span>
                              <span style={{ fontSize: 12, color: T.blue, fontWeight: 500 }}>{`2\u03c3 range`}</span>
                            </div>
                            <div style={{ fontSize: 20, fontWeight: 600, color: T.text, letterSpacing: "-0.5px" }}>
                              {`${(p.real - 2 * p.stddev).toFixed(2)}% \u2014 ${(p.real + 2 * p.stddev).toFixed(2)}%`}
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: 12 }}>
                            <div style={{ flex: 1, padding: "14px 18px", borderRadius: 12, background: "rgba(245,243,238,0.55)", border: "1px solid rgba(255,255,255,0.5)" }}>
                              <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 4 }}>{`Risk Delta (\u03b4)`}</div>
                              <div style={{ fontSize: 18, fontWeight: 600, color: delta > 1 ? T.orange : T.text }}>{delta.toFixed(2)}%</div>
                            </div>
                            <div style={{ flex: 1, padding: "14px 18px", borderRadius: 12, background: "rgba(245,243,238,0.55)", border: "1px solid rgba(255,255,255,0.5)" }}>
                              <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 4 }}>Lock-up</div>
                              <div style={{ fontSize: 18, fontWeight: 600, color: T.text }}>{p.lockup}</div>
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
    { n: "02", t: "Decompose", d: "Break each protocol's yield into primitives \u2014 rebase, reward distribution, fee sharing, lending interest, and AUM performance \u2014 then compute an independent APY." },
    { n: "03", t: "Quantify", d: "Calculate Risk(\u03b4) = Nominal APY \u2212 Own APY to measure the risk premium. Score every protocol across all six risk parameters with weighted analysis." },
    { n: "04", t: "Construct", d: "The AI agent assembles a portfolio matching your investment policy \u2014 balancing target yields with acceptable risk levels and lock-up preferences." },
  ];
  return (
    <section id="process" style={{ padding: "120px 48px", background: T.bgDark, color: "#fff" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <div style={{ marginBottom: 64 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 12 }}>Process</p>
          <h2 style={{ fontSize: 36, fontWeight: 600, letterSpacing: "-1px", margin: 0, color: "#fff" }}>From on-chain data to your portfolio</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1 }}>
          {steps.map((s, i) => (
            <div key={i} style={{
              padding: "36px 28px", background: T.bgDarkCard,
              borderRadius: i === 0 ? "16px 0 0 16px" : i === 3 ? "0 16px 16px 0" : 0,
            }}>
              <div style={{ fontSize: 48, fontWeight: 700, color: "rgba(255,255,255,0.06)", lineHeight: 1, marginBottom: 24, fontFamily: "'Inter', monospace" }}>{s.n}</div>
              <h3 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 12px", color: "#fff" }}>{s.t}</h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: 0 }}>{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
/* ─── Pricing ─── */
function Pricing() {
  const [hovered, setHovered] = useState(null);
  const plans = [
    {
      name: "Explorer",
      tag: null,
      desc: "Get started for free",
      price: "0",
      period: "forever",
      highlight: false,
      features: [
        "Pool table with live yield data",
        "Basic yield verification",
        "AI chat \u2014 3 messages / day",
        "Risk grade overview (A\u2013D)",
        "View-only portfolio mode",
      ],
      cta: "Start Free",
    },
    {
      name: "Starter",
      tag: "Recommended",
      desc: "For individual DeFi investors",
      price: "9.90",
      originalPrice: "19.90",
      discount: "50% OFF",
      period: "/mo",
      highlight: true,
      features: [
        "Everything in Explorer",
        "Unlimited AI chat",
        "Full 6-Factor Risk Score",
        "1 active portfolio",
        "Weekly rebalancing alerts",
        "Yield decomposition breakdown",
        "Risk Delta monitoring",
        "Lock-up schedule optimization",
      ],
      cta: "Get Started",
    },
    {
      name: "Pro",
      tag: "Popular",
      desc: "Advanced research & multi-portfolio",
      price: "29",
      originalPrice: "59",
      discount: "51% OFF",
      period: "/mo",
      highlight: false,
      features: [
        "Everything in Starter",
        "Protocol comparison analysis",
        "Historical yield backtesting",
        "Up to 5 portfolios",
        "Real-time rebalancing signals",
        "Whale movement alerts",
        "Custom risk parameter tuning",
        "Priority support",
      ],
      cta: "Get Started",
    },
    {
      name: "Institutional",
      tag: "Enterprise",
      desc: "For funds & DAO treasuries",
      price: "99",
      originalPrice: "199",
      discount: "50% OFF",
      period: "/mo",
      highlight: false,
      features: [
        "Everything in Pro",
        "API access",
        "CSV / JSON data export",
        "Unlimited portfolios",
        "Custom risk frameworks",
        "Multi-sig wallet support",
        "Dedicated account manager",
        "On-chain audit reports",
      ],
      cta: "Contact Sales",
    },
  ];

  const CARD_MIN_H = 620;

  return (
    <section id="pricing" style={{
      padding: "120px 48px", background: T.bg, position: "relative",
    }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 12 }}>Pricing</p>
          <h2 style={{ fontSize: 36, fontWeight: 600, color: T.text, letterSpacing: "-1px", margin: "0 0 14px" }}>Choose your plan</h2>
          <p style={{ fontSize: 14, color: T.textMuted, lineHeight: 1.7, margin: 0 }}>
            {"All payments are converted as "}
            <span style={{ fontWeight: 600, color: T.text }}>iUSD</span>
            {" (Initia stablecoin) to be used as token"}
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, borderRadius: T.radiusLg, overflow: "hidden", background: "rgba(0,0,0,0.04)" }}>
          {plans.map((plan, i) => {
            const isHover = hovered === i;
            return (
              <div
                key={plan.name}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  minHeight: CARD_MIN_H,
                  padding: "32px 28px 28px",
                  background: plan.highlight
                    ? (isHover ? "#F0EDE7" : T.bgWarm)
                    : (isHover ? "rgba(250,250,248,1)" : "rgba(255,255,255,0.95)"),
                  display: "flex",
                  flexDirection: "column",
                  transition: "background 0.25s ease",
                  position: "relative",
                }}
              >
                {plan.tag && (
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0,
                    height: 2,
                    background: plan.highlight ? T.accent : "transparent",
                  }} />
                )}

                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 600, color: T.text, margin: 0, letterSpacing: "-0.3px" }}>{plan.name}</h3>
                    {plan.tag && (
                      <span style={{
                        fontSize: 10, fontWeight: 600, color: T.textMuted,
                        textTransform: "uppercase", letterSpacing: "0.5px",
                        padding: "2px 8px", borderRadius: 100,
                        border: `1px solid ${T.cardBorder}`,
                        background: plan.highlight ? "rgba(0,0,0,0.04)" : "transparent",
                      }}>{plan.tag}</span>
                    )}
                  </div>
                  <p style={{ fontSize: 13, color: T.textMuted, margin: 0 }}>{plan.desc}</p>
                </div>

                <div style={{ marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
                    <span style={{ fontSize: 40, fontWeight: 600, color: T.text, letterSpacing: "-2px", lineHeight: 1 }}>
                      {plan.price === "0" ? "Free" : `$${plan.price}`}
                    </span>
                    {plan.period !== "forever" && (
                      <span style={{ fontSize: 14, color: T.textMuted, fontWeight: 400, marginLeft: 2 }}>{plan.period}</span>
                    )}
                  </div>
                </div>

                {plan.originalPrice ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, height: 22 }}>
                    <span style={{ fontSize: 13, color: T.textMuted, textDecoration: "line-through" }}>${plan.originalPrice}</span>
                    <span style={{
                      fontSize: 11, fontWeight: 600, color: T.accent,
                      background: "rgba(0,0,0,0.04)", padding: "2px 8px", borderRadius: 100,
                    }}>{plan.discount}</span>
                  </div>
                ) : (
                  <div style={{ height: 22, marginBottom: 24 }} />
                )}

                <div style={{ width: "100%", height: 1, background: "rgba(0,0,0,0.06)", marginBottom: 24 }} />

                <div style={{ flex: 1, marginBottom: 24 }}>
                  {plan.features.map((item, j) => (
                    <div key={j} style={{
                      display: "flex", alignItems: "flex-start", gap: 10,
                      marginBottom: 12, fontSize: 13, color: T.textSoft, lineHeight: 1.5,
                    }}>
                      <span style={{
                        width: 16, height: 16, borderRadius: "50%", flexShrink: 0, marginTop: 1,
                        background: "rgba(0,0,0,0.04)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 9, color: T.textMuted, fontWeight: 700,
                      }}>{"\u2713"}</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <button style={{
                  width: "100%", padding: "13px 0", borderRadius: 10,
                  fontSize: 13, fontWeight: 600, cursor: "pointer",
                  transition: "all 0.2s ease",
                  border: plan.highlight ? "none" : `1px solid ${T.cardBorder}`,
                  background: plan.highlight ? T.accent : "transparent",
                  color: plan.highlight ? "#fff" : T.text,
                }}>
                  {plan.cta}
                </button>
              </div>
            );
          })}
        </div>

        <p style={{ textAlign: "center", marginTop: 28, fontSize: 13, color: T.textMuted }}>
          Cancel anytime. No lock-up on your subscription.
        </p>
      </div>
    </section>
  );
}
/* ─── CTA ─── */
function CTA({ onDemo }) {
  return (
    <section style={{ padding: "120px 48px", textAlign: "center", background: T.bg }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <h2 style={{ fontSize: 36, fontWeight: 600, color: T.text, letterSpacing: "-1px", margin: "0 0 16px" }}>Ready to verify your yield?</h2>
        <p style={{ fontSize: 16, color: T.textSoft, lineHeight: 1.7, marginBottom: 36 }}>Chat with our AI agent to explore on-chain verified yields and build a risk-adjusted portfolio.</p>
        <button onClick={onDemo} style={{
          padding: "16px 40px", borderRadius: 100, border: "none",
          background: T.accent, color: "#fff",
          fontWeight: 500, fontSize: 16, cursor: "pointer",
          display: "inline-flex", alignItems: "center", gap: 8,
          boxShadow: "0 2px 16px rgba(0,0,0,0.1)",
        }}>Try the Demo {Icons.arrow}</button>
      </div>
    </section>
  );
}
/* ─── Footer ─── */
function Footer() {
  return (
    <footer style={{
      padding: "32px 48px", borderTop: "1px solid rgba(0,0,0,0.06)",
      display: "flex", justifyContent: "space-between", alignItems: "center", background: T.bg,
    }}>
      <span style={{ fontSize: 15, fontWeight: 600, color: T.text, letterSpacing: "-0.3px" }}>init<span style={{ fontWeight: 300 }}>Farm</span></span>
      <span style={{ fontSize: 13, color: T.textMuted }}>Initia Hackathon {new Date().getFullYear()}</span>
    </footer>
  );
}
/* ─── Chat Components ─── */
function ChatMessage({ role, content }) {
  const isUser = role === "user";
  return (
    <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", marginBottom: 20 }}>
      <div style={{ maxWidth: "78%", display: "flex", gap: 10, flexDirection: isUser ? "row-reverse" : "row", alignItems: "flex-start" }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8, flexShrink: 0,
          background: isUser ? T.bgWarm : T.accent,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 12, color: isUser ? T.text : "#fff", fontWeight: 600,
          border: isUser ? `1px solid ${T.cardBorder}` : "none",
        }}>{isUser ? "W" : "iF"}</div>
        <div style={{
          background: isUser ? T.bgWarm : T.card,
          borderRadius: 14, padding: "14px 18px",
          fontSize: 14, color: T.text, lineHeight: 1.7,
          whiteSpace: "pre-wrap", border: `1px solid ${T.cardBorder}`,
        }}>{content}</div>
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
      <div style={{ background: T.card, borderRadius: 14, padding: "14px 18px", display: "flex", gap: 5, border: `1px solid ${T.cardBorder}` }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            width: 7, height: 7, borderRadius: "50%", background: T.textMuted,
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
    content: "Welcome to initFarm. I'm your on-chain yield advisor.\nI verify DeFi APY claims, assess protocol risk, and build portfolios matched to your profile.\nA few things to try:\n  \"Build me a yield farming portfolio\"\n  \"Risk assessment for DeFi protocols\"\n  \"Tell me about Initia staking\"",
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
      display: "flex", justifyContent: "center", alignItems: "center", padding: 24,
    }}>
      <div style={{
        width: "100%", maxWidth: 680, height: "82vh",
        background: T.bg, borderRadius: 24,
        display: "flex", flexDirection: "column", overflow: "hidden",
        boxShadow: "0 32px 80px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)",
      }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "18px 24px", borderBottom: `1px solid ${T.cardBorder}`, background: T.card,
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
          }}>{Icons.close}</button>
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
                fontFamily: "'Inter', sans-serif",
              }}>{c}</button>
            ))}
          </div>
        )}
        <div style={{
          padding: "16px 24px", borderTop: `1px solid ${T.cardBorder}`,
          display: "flex", gap: 10, background: T.card,
        }}>
          <input type="text" value={input}
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
          }}>{Icons.send}</button>
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
        /* ── Navbar link & button hovers ── */
        .nav-link-hover:hover { color: ${T.text} !important; }
        .nav-btn-primary:hover { background: #333 !important; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important; }
        .nav-btn-secondary:hover { background: rgba(245,243,238,0.85) !important; border-color: rgba(0,0,0,0.12) !important; transform: translateY(-1px); }
        .pill-link:hover { background: rgba(0,0,0,0.05) !important; color: ${T.text} !important; }
        .pill-btn-primary:hover { background: #333 !important; transform: translateY(-0.5px); box-shadow: 0 3px 10px rgba(0,0,0,0.15) !important; }
        .pill-btn-wallet:hover { background: rgba(245,243,238,0.9) !important; border-color: rgba(0,0,0,0.1) !important; }
      `}</style>
      <Navbar onDemo={() => setChat(true)} onWallet={() => setWallet(true)} />
      <Hero onDemo={() => setChat(true)} onWallet={() => setWallet(true)} />
      <PoolTable />
      <Features />
      <Process />
      <Pricing />
      <CTA onDemo={() => setChat(true)} />
      <Footer />
      {chat && <ChatPanel onClose={() => setChat(false)} />}
      {wallet && <WalletPanel onClose={() => setWallet(false)} />}
    </div>
  );
}