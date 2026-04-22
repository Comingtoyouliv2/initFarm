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
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  chart: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
    </svg>
  ),
  bot: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v4" />
      <line x1="8" y1="16" x2="8" y2="16" />
      <line x1="16" y1="16" x2="16" y2="16" />
    </svg>
  ),
  monitor: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20v-6" />
      <path d="M12 14a7 7 0 1 0 0-14 7 7 0 0 0 0 14z" />
      <path d="M12 10V6" />
      <path d="M12 6l3 3" />
      <circle cx="12" cy="20" r="2" />
    </svg>
  ),
  arrow: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8h10m-4-4 4 4-4 4" />
    </svg>
  ),
  send: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
  ),
  close: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  ),
  wallet: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
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
/* ─── Wallet detection helpers ─── */
function detectWallets() {
  const results = [];
  /* MetaMask */
  const eth = typeof window !== "undefined" && window.ethereum;
  const hasMM = eth && (eth.isMetaMask || (eth.providers && eth.providers.some(p => p.isMetaMask)));
  results.push({
    ...WALLETS[0],
    installed: !!hasMM,
    async connect() {
      const provider = eth.providers ? eth.providers.find(p => p.isMetaMask) : eth;
      const accounts = await provider.request({ method: "eth_requestAccounts" });
      return accounts[0];
    },
  });
  /* Phantom */
  const phantom = typeof window !== "undefined" && (window.phantom?.solana || window.solana);
  const hasPH = phantom && phantom.isPhantom;
  results.push({
    ...WALLETS[1],
    installed: !!hasPH,
    async connect() {
      const resp = await phantom.connect();
      return resp.publicKey.toString();
    },
  });
  return results;
}
function shortenAddr(addr) {
  if (!addr) return "";
  if (addr.length > 20) return addr.slice(0, 6) + "\u2026" + addr.slice(-4);
  return addr;
}
/* ─── Connect Wallet Side Panel ─── */
function WalletPanel({ onClose }) {
  const [wallets, setWallets] = useState([]);
  const [connecting, setConnecting] = useState(null);
  const [connected, setConnected] = useState(null);
  const [address, setAddress] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => { setWallets(detectWallets()); }, []);

  const handleConnect = async (w) => {
    if (!w.installed) {
      /* Open install page */
      const urls = { MetaMask: "https://metamask.io/download/", Phantom: "https://phantom.app/download" };
      window.open(urls[w.name] || "#", "_blank");
      return;
    }
    setConnecting(w.name);
    setError(null);
    try {
      const addr = await w.connect();
      setAddress(addr);
      setConnected(w.name);
    } catch (err) {
      setError(err.code === 4001 ? "Connection rejected by user." : (err.message || "Connection failed."));
    } finally {
      setConnecting(null);
    }
  };

  const handleDisconnect = () => {
    setConnected(null);
    setAddress(null);
    setError(null);
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
                wordBreak: "break-all",
              }}>{shortenAddr(address)}</p>
              <button onClick={handleDisconnect} style={{
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
                {wallets.map((w) => (
                  <button key={w.name} onClick={() => handleConnect(w)} disabled={!!connecting}
                    style={{
                      display: "flex", alignItems: "center", gap: 16,
                      padding: "18px 20px", borderRadius: 16,
                      border: `1px solid ${connecting === w.name ? "rgba(0,0,0,0.12)" : T.cardBorder}`,
                      background: connecting === w.name ? T.bgWarm : T.card,
                      cursor: connecting ? "default" : "pointer",
                      transition: "all 0.15s", textAlign: "left", width: "100%",
                      fontFamily: "'Inter', sans-serif",
                      opacity: !w.installed && !connecting ? 0.7 : 1,
                    }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12, background: w.color,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      overflow: "hidden", flexShrink: 0,
                    }}>
                      <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>{w.name[0]}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 15, fontWeight: 600, color: T.text }}>{w.name}</span>
                        {w.installed ? (
                          <span style={{
                            fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 6,
                            background: T.greenSoft, color: T.green, letterSpacing: "0.5px",
                          }}>DETECTED</span>
                        ) : (
                          <span style={{
                            fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 6,
                            background: "rgba(0,0,0,0.04)", color: T.textMuted, letterSpacing: "0.5px",
                          }}>NOT INSTALLED</span>
                        )}
                      </div>
                      <div style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>
                        {w.installed ? w.desc : `Install ${w.name} to connect`}
                      </div>
                    </div>
                    {connecting === w.name ? (
                      <div style={{
                        width: 20, height: 20, border: `2px solid ${T.cardBorder}`,
                        borderTopColor: T.text, borderRadius: "50%",
                        animation: "spin 0.8s linear infinite",
                      }} />
                    ) : !w.installed ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={T.textMuted} strokeWidth="1.5" strokeLinecap="round"><path d="M6 4l4 4-4 4" /></svg>
                    )}
                  </button>
                ))}
              </div>

              {error && (
                <div style={{
                  marginTop: 16, padding: "12px 16px", borderRadius: 12,
                  background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.12)",
                }}>
                  <p style={{ fontSize: 13, color: "#DC2626", margin: 0 }}>{error}</p>
                </div>
              )}

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
      }} />
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
        }}>Smarter yield,<br />verified on-chain</h1>
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
/* ─── Pool Expanded Detail ─── */
function PoolExpanded({ p, delta }) {
  const cardBg = "rgba(245,243,238,0.55)";
  const cardBorder = "1px solid rgba(255,255,255,0.5)";
  return (
    <div style={{ padding: "28px 28px 32px", background: "rgba(245,243,238,0.45)", borderBottom: "1px solid rgba(255,255,255,0.35)" }}>
      <div style={{ display: "flex", gap: 40, alignItems: "flex-start" }}>
        <div style={{ background: cardBg, borderRadius: 16, border: cardBorder, padding: "20px 16px 12px", flexShrink: 0 }}>
          <YieldDistChart nominal={p.nominal} real={p.real} stddev={p.stddev} />
        </div>
        <div style={{ flex: 1, paddingTop: 4 }}>
          <h4 style={{ fontSize: 16, fontWeight: 600, color: T.text, margin: "0 0 20px" }}>Yield Probability Breakdown</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ padding: "14px 18px", borderRadius: 12, background: cardBg, border: cardBorder }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>68% Probability</span>
                <span style={{ fontSize: 12, color: T.green, fontWeight: 500 }}>{`1\u03c3 range`}</span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 600, color: T.text, letterSpacing: "-0.5px" }}>
                {`${(p.real - p.stddev).toFixed(2)}% \u2014 ${(p.real + p.stddev).toFixed(2)}%`}
              </div>
            </div>
            <div style={{ padding: "14px 18px", borderRadius: 12, background: cardBg, border: cardBorder }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>95% Probability</span>
                <span style={{ fontSize: 12, color: T.blue, fontWeight: 500 }}>{`2\u03c3 range`}</span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 600, color: T.text, letterSpacing: "-0.5px" }}>
                {`${(p.real - 2 * p.stddev).toFixed(2)}% \u2014 ${(p.real + 2 * p.stddev).toFixed(2)}%`}
              </div>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: 1, padding: "14px 18px", borderRadius: 12, background: cardBg, border: cardBorder }}>
                <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 4 }}>{`Risk Delta (\u03b4)`}</div>
                <div style={{ fontSize: 18, fontWeight: 600, color: delta > 1 ? T.orange : T.text }}>{delta.toFixed(2)}%</div>
              </div>
              <div style={{ flex: 1, padding: "14px 18px", borderRadius: 12, background: cardBg, border: cardBorder }}>
                <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 4 }}>Lock-up</div>
                <div style={{ fontSize: 18, fontWeight: 600, color: T.text }}>{p.lockup}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
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
        <div style={{ position: "absolute", top: "10%", left: "8%", width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,197,94,0.18) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", top: "50%", right: "5%", width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)", filter: "blur(50px)" }} />
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
                {isOpen && <PoolExpanded p={p} delta={delta} />}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
/* ─── Yield Comparison Dashboard ─── */
function YieldComparison() {
  const [amount, setAmount] = useState(10000);
  const [years, setYears] = useState(3);

  const strategies = [
    { name: "Bank Savings", apy: 3.5, color: "#BFBFBF", desc: "High-yield savings account" },
    { name: "US Treasury", apy: 4.25, color: "#93A3B1", desc: "10Y Treasury bond yield" },
    { name: "initFarm", apy: 10.0, color: T.green, desc: "AI-optimized DeFi portfolio", highlight: true },
  ];

  /* Compound growth: P * (1 + r)^t for each month */
  const months = years * 12;
  const dataPoints = [];
  for (let m = 0; m <= months; m++) {
    const pt = { month: m };
    strategies.forEach((s) => {
      pt[s.name] = amount * Math.pow(1 + s.apy / 100 / 12, m);
    });
    dataPoints.push(pt);
  }

  const finalValues = strategies.map((s) => ({
    ...s,
    final: amount * Math.pow(1 + s.apy / 100 / 12, months),
    gain: amount * Math.pow(1 + s.apy / 100 / 12, months) - amount,
  }));

  const maxVal = Math.max(...finalValues.map((v) => v.final));
  const fmt = (n) => n >= 1000 ? "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 }) : "$" + n.toFixed(2);

  /* Chart dimensions */
  const W = 720, H = 300, padL = 60, padR = 80, padT = 20, padB = 36;
  const chartW = W - padL - padR, chartH = H - padT - padB;
  const yMax = maxVal * 1.08;
  const yMin = amount * 0.98;
  const toX = (m) => padL + (m / months) * chartW;
  const toY = (v) => padT + chartH - ((v - yMin) / (yMax - yMin)) * chartH;

  /* Y-axis gridlines */
  const yTicks = [];
  const step = Math.pow(10, Math.floor(Math.log10((yMax - yMin) / 4)));
  const niceStep = step * (Math.ceil((yMax - yMin) / 4 / step));
  for (let v = Math.ceil(yMin / niceStep) * niceStep; v <= yMax; v += niceStep) {
    yTicks.push(v);
  }

  /* X-axis labels */
  const xLabels = [];
  const yearStep = years <= 3 ? 1 : years <= 7 ? 2 : 5;
  for (let y = 0; y <= years; y += yearStep) xLabels.push(y);

  const sliderStyle = {
    WebkitAppearance: "none", appearance: "none", width: "100%", height: 4,
    borderRadius: 4, outline: "none", cursor: "pointer",
  };

  return (
    <section style={{
      padding: "80px 48px 100px",
      background: `linear-gradient(180deg, ${T.bgWarm} 0%, #E8E3DA 50%, #EDE8E0 100%)`,
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", bottom: "10%", left: "15%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 70%)", filter: "blur(50px)" }} />
      </div>
      <div style={{ maxWidth: 1120, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 12 }}>Interactive</p>
          <h2 style={{ fontSize: 36, fontWeight: 600, color: T.text, letterSpacing: "-1px", margin: 0 }}>Portfolio growth comparison</h2>
        </div>

        <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
          {/* Chart Area */}
          <div style={{
            flex: 1,
            background: "rgba(245,243,238,0.55)", backdropFilter: "blur(24px)",
            borderRadius: T.radiusLg, border: "1px solid rgba(255,255,255,0.5)",
            padding: "32px 28px 24px",
            boxShadow: "0 8px 40px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.7)",
          }}>
            <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>
              {/* Grid lines */}
              {yTicks.map((v) => (
                <g key={v}>
                  <line x1={padL} y1={toY(v)} x2={W - padR} y2={toY(v)} stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
                  <text x={padL - 8} y={toY(v) + 4} textAnchor="end" fontSize="10" fill={T.textMuted} fontFamily="Inter, sans-serif">
                    {v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v.toFixed(0)}
                  </text>
                </g>
              ))}
              {/* X-axis labels */}
              {xLabels.map((y) => (
                <text key={y} x={toX(y * 12)} y={H - 8} textAnchor="middle" fontSize="10" fill={T.textMuted} fontFamily="Inter, sans-serif">
                  {y === 0 ? "Now" : `${y}y`}
                </text>
              ))}
              {/* Baseline */}
              <line x1={padL} y1={toY(amount)} x2={W - padR} y2={toY(amount)} stroke="rgba(0,0,0,0.12)" strokeWidth="1" strokeDasharray="4 3" />
              {/* Lines */}
              {strategies.map((s) => {
                const pts = dataPoints.map((d, i) => `${toX(i)},${toY(d[s.name])}`).join(" ");
                return (
                  <g key={s.name}>
                    <polyline points={pts} fill="none" stroke={s.color} strokeWidth={s.highlight ? 2.5 : 1.5} strokeLinejoin="round" opacity={s.highlight ? 1 : 0.6} />
                    {/* End dot */}
                    <circle cx={toX(months)} cy={toY(dataPoints[months][s.name])} r={s.highlight ? 4 : 3} fill={s.color} />
                    {/* End label */}
                    <text x={toX(months) + 8} y={toY(dataPoints[months][s.name]) + 4} fontSize="10" fontWeight={s.highlight ? 700 : 500} fill={s.color} fontFamily="Inter, sans-serif">
                      {fmt(dataPoints[months][s.name])}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Controls + Results */}
          <div style={{ width: 320, flexShrink: 0 }}>
            {/* Controls */}
            <div style={{
              background: "rgba(255,255,255,0.65)", backdropFilter: "blur(16px)",
              borderRadius: 20, border: "1px solid rgba(255,255,255,0.6)",
              padding: "24px", marginBottom: 16,
              boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
            }}>
              {/* Amount */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.5px" }}>Initial Deposit</span>
                  <span style={{ fontSize: 20, fontWeight: 700, color: T.text, letterSpacing: "-0.5px" }}>{fmt(amount)}</span>
                </div>
                <input type="range" min={1000} max={100000} step={500} value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  style={{ ...sliderStyle, background: `linear-gradient(90deg, ${T.text} ${((amount - 1000) / 99000) * 100}%, ${T.cardBorder} ${((amount - 1000) / 99000) * 100}%)` }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                  <span style={{ fontSize: 9, color: T.textMuted }}>$1,000</span>
                  <span style={{ fontSize: 9, color: T.textMuted }}>$100,000</span>
                </div>
              </div>
              {/* Years */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.5px" }}>Time Horizon</span>
                  <span style={{ fontSize: 20, fontWeight: 700, color: T.text, letterSpacing: "-0.5px" }}>{years}y</span>
                </div>
                <input type="range" min={1} max={10} step={1} value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  style={{ ...sliderStyle, background: `linear-gradient(90deg, ${T.text} ${((years - 1) / 9) * 100}%, ${T.cardBorder} ${((years - 1) / 9) * 100}%)` }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                  <span style={{ fontSize: 9, color: T.textMuted }}>1 year</span>
                  <span style={{ fontSize: 9, color: T.textMuted }}>10 years</span>
                </div>
              </div>
            </div>

            {/* Results cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {finalValues.map((s) => (
                <div key={s.name} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "14px 16px", borderRadius: 14,
                  background: s.highlight ? "rgba(34,197,94,0.06)" : "rgba(255,255,255,0.55)",
                  border: s.highlight ? "1px solid rgba(34,197,94,0.18)" : "1px solid rgba(255,255,255,0.5)",
                  backdropFilter: "blur(12px)",
                }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: "50%",
                    background: s.color, flexShrink: 0,
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: s.highlight ? 700 : 500, color: s.highlight ? T.green : T.text }}>{s.name}</div>
                    <div style={{ fontSize: 10, color: T.textMuted, marginTop: 1 }}>{s.desc}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: s.highlight ? T.green : T.text, letterSpacing: "-0.3px" }}>{fmt(s.final)}</div>
                    <div style={{ fontSize: 10, color: s.gain > 0 ? T.green : T.textMuted, fontWeight: 600, marginTop: 1 }}>+{fmt(s.gain)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Slider styles */}
      <style>{`
        input[type="range"] { -webkit-appearance: none; appearance: none; height: 4px; border-radius: 4px; outline: none; cursor: pointer; }
        input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: ${T.text}; border: 2px solid #fff; box-shadow: 0 1px 4px rgba(0,0,0,0.15); cursor: pointer; }
        input[type="range"]::-moz-range-thumb { width: 16px; height: 16px; border-radius: 50%; background: ${T.text}; border: 2px solid #fff; box-shadow: 0 1px 4px rgba(0,0,0,0.15); cursor: pointer; }
        input[type="range"]::-moz-range-progress { background: ${T.text}; height: 4px; border-radius: 4px; }
        input[type="range"]::-moz-range-track { background: ${T.cardBorder}; height: 4px; border-radius: 4px; }
      `}</style>
    </section>
  );
}
/* ─── Process ─── */
function Process() {
  const sectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const steps = [
    {
      n: "01", t: "Collect",
      d: "Pull real-time TVL, fee revenue, token distribution, and staking flow data from on-chain sources including DeFiLlama, Dune Analytics, and StakingRewards.",
      detail: "Real-time feeds from 12+ data providers",
    },
    {
      n: "02", t: "Decompose",
      d: "Break each protocol\u2019s yield into primitives \u2014 rebase, reward distribution, fee sharing, lending interest, and AUM performance \u2014 then compute an independent APY.",
      detail: "5 yield primitives analyzed per protocol",
    },
    {
      n: "03", t: "Quantify",
      d: "Calculate Risk(\u03b4) = Nominal APY \u2212 Own APY to measure the risk premium. Score every protocol across all six risk parameters with weighted analysis.",
      detail: "6-factor weighted risk scoring",
    },
    {
      n: "04", t: "Construct",
      d: "The AI agent assembles a portfolio matching your investment policy \u2014 balancing target yields with acceptable risk levels and lock-up preferences.",
      detail: "Personalized to your risk tolerance",
    },
  ];

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        if (!sectionRef.current) { ticking = false; return; }
        const rect = sectionRef.current.getBoundingClientRect();
        const sectionH = sectionRef.current.offsetHeight;
        const viewH = window.innerHeight;
        const scrollStart = -rect.top;
        const scrollRange = sectionH - viewH;
        const p = Math.max(0, Math.min(1, scrollStart / scrollRange));
        setScrollProgress(p);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const totalSteps = steps.length;
  const raw = scrollProgress * totalSteps;
  const activeIndex = Math.min(totalSteps - 1, Math.floor(raw));
  const stepFraction = raw - activeIndex;

  const getCardStyle = (i) => {
    const isActive = i === activeIndex;
    const isPast = i < activeIndex;
    const isFuture = i > activeIndex;

    let yOffset = 0;
    let scale = 1;
    let opacity = 0;
    let rotate = 0;
    let zIndex = i;

    if (isFuture) {
      if (i === activeIndex + 1) {
        const peekProgress = Math.max(0, stepFraction - 0.5) * 2;
        opacity = peekProgress * 0.3;
        yOffset = 80 - peekProgress * 20;
        scale = 0.9 + peekProgress * 0.02;
        rotate = 2.5 - peekProgress * 0.5;
      } else {
        opacity = 0;
        yOffset = 100;
        scale = 0.88;
        rotate = 3;
      }
    } else if (isActive) {
      const enter = Math.min(1, scrollProgress < 0.01 && i === 0 ? 0 : 1);
      opacity = i === 0 ? (scrollProgress < 0.02 ? scrollProgress * 50 : 1) : 1;
      yOffset = 0;
      scale = 1;
      rotate = 0;
      zIndex = 10;
      if (stepFraction > 0.6) {
        const exitProgress = (stepFraction - 0.6) / 0.4;
        yOffset = -20 * exitProgress;
        scale = 1 - 0.03 * exitProgress;
        opacity = 1 - 0.3 * exitProgress;
        rotate = -0.5 * exitProgress;
      }
    } else if (isPast) {
      const distance = activeIndex - i;
      opacity = Math.max(0.08, 0.4 - distance * 0.15);
      yOffset = -20 - 14 * distance;
      scale = 0.97 - distance * 0.03;
      rotate = -0.5 - 0.5 * distance;
      zIndex = 4 - distance;
    }

    return {
      position: "absolute",
      left: 0, right: 0,
      transform: `translateY(${yOffset}px) scale(${scale}) rotate(${rotate}deg)`,
      opacity,
      zIndex,
      transition: "transform 0.5s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.4s ease",
      pointerEvents: isActive ? "auto" : "none",
    };
  };

  return (
    <section id="process" ref={sectionRef} style={{
      minHeight: "300vh", position: "relative",
      background: T.bgDark,
    }}>
      <div style={{
        position: "sticky", top: 0, height: "100vh",
        display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
        padding: "0 48px", overflow: "hidden",
      }}>
        <div style={{ maxWidth: 1120, width: "100%", marginBottom: 48 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 12 }}>Process</p>
              <h2 style={{ fontSize: 36, fontWeight: 600, letterSpacing: "-1px", margin: 0, color: "#fff" }}>From on-chain data to your portfolio</h2>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {steps.map((_, i) => (
                <div key={i} style={{
                  width: i === activeIndex ? 28 : 8, height: 8, borderRadius: 100,
                  background: i === activeIndex ? "#fff" : "rgba(255,255,255,0.15)",
                  transition: "all 0.4s cubic-bezier(0.32, 0.72, 0, 1)",
                }} />
              ))}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1120, width: "100%", position: "relative", height: 380 }}>
          {steps.map((s, i) => (
            <div key={i} style={getCardStyle(i)}>
              <div style={{
                background: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(40px) saturate(1.4)",
                WebkitBackdropFilter: "blur(40px) saturate(1.4)",
                borderRadius: 20,
                border: "1px solid rgba(255,255,255,0.08)",
                padding: "48px 52px",
                display: "flex", gap: 52, alignItems: "flex-start",
                boxShadow: i === activeIndex
                  ? "0 24px 80px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)"
                  : "0 8px 32px rgba(0,0,0,0.2)",
                minHeight: 280,
              }}>
                <div style={{ flexShrink: 0 }}>
                  <div style={{
                    fontSize: 96, fontWeight: 700, lineHeight: 1,
                    color: "rgba(255,255,255,0.04)",
                    fontFamily: "'Inter', sans-serif",
                    letterSpacing: "-4px",
                  }}>{s.n}</div>
                  <div style={{
                    marginTop: 16, fontSize: 11, fontWeight: 600,
                    color: "rgba(255,255,255,0.3)",
                    textTransform: "uppercase", letterSpacing: "1.5px",
                  }}>{`Step ${s.n}`}</div>
                </div>

                <div style={{ flex: 1, paddingTop: 8 }}>
                  <h3 style={{
                    fontSize: 28, fontWeight: 600, color: "#fff",
                    margin: "0 0 16px", letterSpacing: "-0.5px",
                  }}>{s.t}</h3>
                  <p style={{
                    fontSize: 16, color: "rgba(255,255,255,0.5)",
                    lineHeight: 1.8, margin: "0 0 28px", maxWidth: 540,
                  }}>{s.d}</p>
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "8px 16px", borderRadius: 100,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}>
                    <div style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: T.green,
                    }} />
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>{s.detail}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
/* ─── Pricing ─── */
function Pricing() {
  return (
    <section id="pricing" style={{
      padding: "120px 48px", background: T.bg, position: "relative",
    }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ marginBottom: 72 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 12 }}>Fee Structure</p>
          <h2 style={{ fontSize: 36, fontWeight: 600, color: T.text, letterSpacing: "-1px", margin: "0 0 14px" }}>Aligned with your returns</h2>
          <p style={{ fontSize: 15, color: T.textSoft, lineHeight: 1.7, margin: 0 }}>
            {"No subscriptions. We earn only when you earn."}
          </p>
        </div>

        {/* ── Fee Cards ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 48 }}>
          <div style={{
            padding: "40px 36px", borderRadius: T.radiusLg,
            background: T.bgWarm, position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: 0, left: 36, right: 36, height: 1,
              background: "rgba(0,0,0,0.06)",
            }} />
            <p style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 24px" }}>Management Fee</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 8 }}>
              <span style={{ fontSize: 56, fontWeight: 600, color: T.text, letterSpacing: "-3px", lineHeight: 1 }}>1.0%</span>
            </div>
            <p style={{ fontSize: 14, color: T.textMuted, margin: 0 }}>of AUM per year</p>
          </div>

          <div style={{
            padding: "40px 36px", borderRadius: T.radiusLg,
            background: T.bgWarm, position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: 0, left: 36, right: 36, height: 1,
              background: "rgba(0,0,0,0.06)",
            }} />
            <p style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 24px" }}>Performance Fee</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 8 }}>
              <span style={{ fontSize: 56, fontWeight: 600, color: T.text, letterSpacing: "-3px", lineHeight: 1 }}>10%</span>
            </div>
            <p style={{ fontSize: 14, color: T.textMuted, margin: 0 }}>of net profits</p>
          </div>
        </div>

        {/* ── Flow Visualization ── */}
        <div style={{
          padding: "48px 40px 40px", borderRadius: T.radiusLg,
          border: `1px solid ${T.cardBorder}`, marginBottom: 24,
          background: `linear-gradient(160deg, ${T.bg} 0%, ${T.bgWarm} 50%, #F0EDE6 100%)`,
          position: "relative", overflow: "hidden",
        }}>
          {/* Decorative grid dots */}
          <div style={{
            position: "absolute", inset: 0, opacity: 0.025,
            backgroundImage: "radial-gradient(circle, #1A1A1A 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }} />
          {/* Decorative corner accent */}
          <div style={{
            position: "absolute", top: -60, right: -60, width: 180, height: 180,
            borderRadius: "50%", background: "rgba(34,197,94,0.03)",
          }} />

          {/* Flow title */}
          <p style={{
            fontSize: 10, fontWeight: 700, color: T.textMuted, textTransform: "uppercase",
            letterSpacing: "2px", margin: "0 0 32px", textAlign: "center", position: "relative",
          }}>How It Works</p>

          {(() => {
            const nodeSize = 56;
            const nodeRadius = 16;
            const labelStyle = { fontSize: 12, fontWeight: 600, color: T.text, margin: 0, letterSpacing: "-0.2px" };
            const subStyle = { fontSize: 10, color: T.textMuted, margin: "3px 0 0", opacity: 0.55, lineHeight: 1.3 };
            const nodeBase = {
              width: nodeSize, height: nodeSize, borderRadius: nodeRadius,
              background: "#fff", border: `1px solid ${T.cardBorder}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, position: "relative",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04), 0 0.5px 1px rgba(0,0,0,0.03)",
            };
            const badgeStyle = {
              position: "absolute", top: -6, right: -6,
              fontSize: 8, fontWeight: 700, padding: "2px 5px",
              borderRadius: 6, letterSpacing: "0.5px",
              lineHeight: 1,
            };

            /* Connector with label */
            const Connector = ({ label, green }) => {
              const c = green ? "rgba(34,197,94,0.3)" : "rgba(0,0,0,0.1)";
              const cArr = green ? "rgba(34,197,94,0.45)" : "rgba(0,0,0,0.2)";
              return (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", minWidth: 28, alignSelf: "center", marginBottom: 44, gap: 0 }}>
                  {label && <span style={{ fontSize: 8, fontWeight: 600, color: green ? "rgba(34,197,94,0.5)" : "rgba(0,0,0,0.18)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 4 }}>{label}</span>}
                  <div style={{ width: "100%", display: "flex", alignItems: "center", padding: "0 2px" }}>
                    <div style={{ flex: 1, height: 1, background: c, position: "relative" }}>
                      <div style={{ position: "absolute", top: -1, left: 0, right: 0, height: 3, background: c, opacity: 0.15, borderRadius: 2 }} />
                    </div>
                    <svg width="7" height="9" viewBox="0 0 7 9" fill="none" style={{ flexShrink: 0, marginLeft: -1 }}>
                      <path d="M1 1l4 3.5L1 8" stroke={cArr} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              );
            };

            return (
              <div style={{ display: "flex", alignItems: "flex-start", position: "relative" }}>
                {/* Step 1: Pay in Local Currency */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 68 }}>
                  <div style={{ ...nodeBase, background: T.bgWarm }}>
                    {/* Dollar/currency icon */}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={T.text} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="6" width="20" height="12" rx="2"/>
                      <circle cx="12" cy="12" r="3"/>
                      <path d="M2 10h2m16 0h2M2 14h2m16 0h2"/>
                    </svg>
                  </div>
                  <div style={{ textAlign: "center", marginTop: 10 }}>
                    <p style={labelStyle}>Pay</p>
                    <p style={subStyle}>Local Currency</p>
                  </div>
                </div>

                <Connector label="auto" />

                {/* Step 2: Convert to iUSD */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 68 }}>
                  <div style={{ ...nodeBase, borderRadius: nodeRadius, overflow: "hidden", background: "#222323" }}>
                    <div style={{ ...badgeStyle, background: "rgba(0,0,0,0.06)", color: T.textMuted }}>AUTO</div>
                    <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeD0iMC45Mzc1IiB5PSIwLjkzNzUiIHdpZHRoPSI1OC4xMjUiIGhlaWdodD0iNTguMTI1IiByeD0iMjkuMDYyNSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIxLjg3NSIvPgo8Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIzMCIgZmlsbD0iIzIyMjMyMyIvPgo8cGF0aCBkPSJNMjAuMzEyMiA5Ljg3NzQ3QzEyLjgzMjkgMTMuNDg1MyA3LjY3MTY5IDIxLjEzOTkgNy42NzE2OSAyOS45OTk5QzcuNjcyMDUgMzguODU5MyAxMi44MzM1IDQ2LjUxMjEgMjAuMzEyMiA1MC4xMjAxVjUyLjI3NjhDMTIuMDc4OSA0OC42OTE4IDYuMjE2MDUgNDAuNjgyOSA1LjczODA5IDMxLjI0ODRMNS43MDY1NCAyOS45OTk5QzUuNzA2NTQgMjAuMDI3NSAxMS43MTc1IDExLjQ2MTIgMjAuMzEyMiA3LjcxODUyVjkuODc3NDdaIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0zOS42ODg3IDcuNzIwNzdDNDguMjgyNSAxMS40NjM2IDU0LjI5MiAyMC4wMjc5IDU0LjI5MiAyOS45OTk5TDU0LjI2MDUgMzEuMjQ4NEM1My43ODI1IDQwLjY4MjQgNDcuOTIwOSA0OC42ODkzIDM5LjY4ODcgNTIuMjc0NlY1MC4xMjI0QzQ3LjE2ODEgNDYuNTE0NiA1Mi4zMjg4IDM4Ljg1OTggNTIuMzI5MSAyOS45OTk5QzUyLjMyOTEgMjEuMTM5NSA0Ny4xNjg3IDEzLjQ4MjggMzkuNjg4NyA5Ljg3NTIyVjcuNzIwNzdaIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0zNS41NTA2IDIxLjEwMjRDMzMuOTM1IDIwLjM5NTIgMzEuOTgxNCAyMC4yMDcgMzAuMTE2IDIwLjIwNjlIMjkuNzI3M0MyNy40ODcyIDIwLjIwNyAyNS40NDc1IDIwLjUwNDkgMjMuOTM4MyAyMS4zOTM1QzIyLjMzMDMgMjIuMzQwNSAyMS40Mzk0IDIzLjg5MDcgMjEuNDM5MyAyNi4wMjA0VjI2LjE0MjVDMjEuNDM5MyAyNy42MSAyMS44MjA4IDI4Ljk2NTkgMjIuOTk3OCAyOS45MzY0QzI0LjExMTkgMzAuODU0OSAyNS43NjEyIDMxLjI3MTYgMjcuOTA3MSAzMS4zNzJMMjcuOTE0OSAzMS4zNzI5TDMyLjIyNTQgMzEuNTQxOUMzNC4wMzY2IDMxLjYyNyAzNC45Mzc3IDMxLjg1MzQgMzUuMzkwNCAzMi4xNTEyQzM1LjY5MjQgMzIuMzUgMzUuOTAwMiAzMi42NDczIDM1LjkwMDIgMzMuNTQyOFYzMy43NjA2QzM1LjkwMDIgMzQuMzAxNCAzNS43ODQyIDM0LjY4MDEgMzUuNjEyMSAzNC45NTg5QzM1LjQ0IDM1LjIzNzUgMzUuMTY2OSAzNS40ODk0IDM0LjczNjEgMzUuNzA2QzMzLjgyOSAzNi4xNjE5IDMyLjM2NjYgMzYuMzkwNSAzMC4yNjE1IDM2LjM5MDVDMjguODE4MSAzNi4zOTA1IDI3LjQ1ODEgMzYuMjY5MyAyNi4zODY1IDM1LjkwNDJDMjUuMzM1OSAzNS41NDYyIDI0LjY4MDQgMzUuMDAwMSAyNC4zODk0IDM0LjIwMDFMMjQuMTM1NiAzMy41MDM4SDIwLjQ3NDRMMjAuNzg5OCAzNC44MDk0QzIxLjMwMTUgMzYuOTMxMyAyMi43NTk3IDM4LjIwMTcgMjQuNDk5OCAzOC45MTFDMjYuMTk4NyAzOS42MDM1IDI4LjIyMyAzOS43OTI5IDMwLjA5MTYgMzkuNzkyOUgzMC4zNTgyQzMyLjY5NTUgMzkuNzkyOSAzNC45NDM4IDM5LjU0ODEgMzYuNjM0NiAzOC42NTMyQzM3LjUwMiAzOC4xOTQgMzguMjQxIDM3LjU1NDIgMzguNzU1NyAzNi42ODI1QzM5LjI2OTEgMzUuODEyOCAzOS41MjAzIDM0Ljc3ODYgMzkuNTIwMyAzMy41OTA3VjMzLjM3MjlDMzkuNTIwMyAzMS44OTU2IDM5LjE0MDIgMzAuNTM2MiAzNy45NTk4IDI5LjU2NzNDMzYuODQ0NyAyOC42NTIxIDM1LjE5NDggMjguMjQyNyAzMy4wNTI1IDI4LjE0MjVIMzMuMDQ0N0wyOC43MzQyIDI3Ljk3MjZDMjYuOTIyNiAyNy44ODc0IDI2LjAyMTggMjcuNjYxMSAyNS41NjkxIDI3LjM2MzJDMjUuMjY3MSAyNy4xNjQ0IDI1LjA1OTQgMjYuODY3OSAyNS4wNTk0IDI1Ljk3MjZWMjUuODk5M0MyNS4wNTk0IDI1LjQzODcgMjUuMTQ5OCAyNS4xMTc0IDI1LjI4MiAyNC44ODI3QzI1LjQxMTggMjQuNjUyNSAyNS42MTg3IDI0LjQzOTkgMjUuOTYwNyAyNC4yNTE5QzI2LjY5MjMgMjMuODQ5NyAyNy45NDU1IDIzLjYwOTMgMjkuOTIxNyAyMy42MDkzQzMxLjUwMDYgMjMuNjA5MyAzMi43ODUzIDIzLjc1MDEgMzMuNzI3MyAyNC4xMTIyQzM0LjYxNzkgMjQuNDU0NiAzNS4xNDc3IDI0Ljk2NzEgMzUuMzg2NSAyNS43NjU1TDM1LjYxMjEgMjYuNTIwNEgzOS4yNTc2TDM4Ljk4ODEgMjUuMjQ0QzM4LjU0MjcgMjMuMTM1NiAzNy4yMjQ5IDIxLjgzNTQgMzUuNTUwNiAyMS4xMDI0WiIgZmlsbD0iI0Y1RjVGNSIvPgo8cGF0aCBkPSJNMzQuODgwNSA4LjY2NDEyQzMzLjEwNTcgOS4wMTI4MiAzMS44MDcxIDEwLjU2NjkgMzEuNzc3MiAxMi40MDk2VjE0LjE5SDI4LjIyNzhWMTIuNDAwNkMyOC4xOTc5IDEwLjU2NzYgMjYuODk3NCA5LjAxMzA0IDI1LjEyMjMgOC42NjQxMlY1LjA1ODM1QzI2Ljk0OTQgNS4yNDQzNCAyOC42NDIyIDYuMTA3NTcgMjkuODYzOSA3LjQ3ODcyTDMwLjAwMTQgNy42Mzg3M0wzMC4xNDExIDcuNDc4NzJDMzEuMzgwNiA2LjEwMzkxIDMzLjA2NiA1LjI0NzY3IDM0Ljg4MDUgNS4wNTgzNVY4LjY2NDEyWiIgZmlsbD0iI0Y1RjVGNSIvPgo8cGF0aCBkPSJNMzQuODgwNSA1MS4zMzZDMzMuMTA1OCA1MC45ODczIDMxLjgwNzEgNDkuNDMzMiAzMS43NzczIDQ3LjU5MDVWNDUuODEwMkgyOC4yMjc4VjQ3LjU5OTVDMjguMTk4IDQ5LjQzMjUgMjYuODk3NCA1MC45ODcxIDI1LjEyMjQgNTEuMzM2VjU0Ljk0MThDMjYuOTQ5NSA1NC43NTU4IDI4LjY0MjIgNTMuODkyNiAyOS44NjQgNTIuNTIxNEwzMC4wMDE0IDUyLjM2MTRMMzAuMTQxMiA1Mi41MjE0QzMxLjM4MDYgNTMuODk2MiAzMy4wNjYgNTQuNzUyNSAzNC44ODA1IDU0Ljk0MThWNTEuMzM2WiIgZmlsbD0iI0Y1RjVGNSIvPgo8L3N2Zz4K" alt="iUSD" width={36} height={36} style={{ display: "block" }} />
                  </div>
                  <div style={{ textAlign: "center", marginTop: 10 }}>
                    <p style={labelStyle}>iUSD</p>
                    <p style={subStyle}>Converted</p>
                  </div>
                </div>

                <Connector label="deposit" />

                {/* Step 3: AUM Custody */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 68 }}>
                  <div style={{ ...nodeBase }}>
                    <div style={{ ...badgeStyle, background: "rgba(0,0,0,0.05)", color: T.textMuted }}>MOVE</div>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={T.text} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      <path d="m9 12 2 2 4-4" stroke={T.green} />
                    </svg>
                  </div>
                  <div style={{ textAlign: "center", marginTop: 10 }}>
                    <p style={labelStyle}>Custody</p>
                    <p style={subStyle}>Smart Contract</p>
                  </div>
                </div>

                <Connector label="farm" />

                {/* Step 4: Yield */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 68 }}>
                  <div style={{ ...nodeBase }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={T.text} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3" stroke={T.green}/>
                    </svg>
                  </div>
                  <div style={{ textAlign: "center", marginTop: 10 }}>
                    <p style={labelStyle}>Yield</p>
                    <p style={subStyle}>AI-Optimized</p>
                  </div>
                </div>

                <Connector label="deduct" />

                {/* Step 5: Fees */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 68 }}>
                  <div style={{ ...nodeBase }}>
                    <div style={{ ...badgeStyle, background: "rgba(0,0,0,0.05)", color: T.textMuted }}>1%+10%</div>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={T.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 5L5 19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>
                    </svg>
                  </div>
                  <div style={{ textAlign: "center", marginTop: 10 }}>
                    <p style={labelStyle}>Fees</p>
                    <p style={subStyle}>Mgmt + Performance</p>
                  </div>
                </div>

                <Connector label="net" green />

                {/* Step 6: Net Returns */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 68 }}>
                  <div style={{
                    ...nodeBase,
                    background: "rgba(34,197,94,0.06)",
                    border: `1.5px solid rgba(34,197,94,0.2)`,
                    boxShadow: "0 2px 16px rgba(34,197,94,0.1), 0 1px 3px rgba(34,197,94,0.05)",
                  }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={T.green} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <path d="M22 4L12 14.01l-3-3"/>
                    </svg>
                  </div>
                  <div style={{ textAlign: "center", marginTop: 10 }}>
                    <p style={{ ...labelStyle, color: T.green }}>Returns</p>
                    <p style={subStyle}>To You</p>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* ── Bottom Details ── */}
        <div style={{ display: "flex", gap: 1, borderRadius: T.radius, overflow: "hidden", background: "rgba(0,0,0,0.04)" }}>
          {[
            { label: "High-Water Mark", value: "Yes" },
            { label: "Lock-up", value: "None" },
            { label: "Settlement", value: "Quarterly" },
            { label: "Custody", value: "Initia Move" },
            { label: "Currency", value: "iUSD" },
          ].map((item) => (
            <div key={item.label} style={{
              flex: 1, padding: "20px 12px", background: T.bg, textAlign: "center",
            }}>
              <p style={{ fontSize: 10, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 8px" }}>{item.label}</p>
              <p style={{ fontSize: 16, fontWeight: 600, color: T.text, margin: 0, letterSpacing: "-0.3px" }}>{item.value}</p>
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
      padding: "120px 48px 140px",
      background: `linear-gradient(180deg, ${T.bg} 0%, ${T.bgWarm} 50%, #EDE8E0 100%)`,
      textAlign: "center",
    }}>
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        <h2 style={{ fontSize: 32, fontWeight: 600, color: T.text, letterSpacing: "-1px", margin: "0 0 14px" }}>Ready to claim your yield?</h2>
        <p style={{ fontSize: 15, color: T.textMuted, lineHeight: 1.7, margin: "0 0 36px" }}>
          Chat with our AI agent to explore on-chain verified yields and build a risk-adjusted portfolio.
        </p>
        <button onClick={onDemo} style={{
          padding: "14px 36px", borderRadius: 100, border: "none",
          background: T.accent, color: "#fff",
          fontWeight: 500, fontSize: 15, cursor: "pointer",
          display: "inline-flex", alignItems: "center", gap: 8,
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
          }} />
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
                <div style={{ width: 5, height: 5, borderRadius: 100, background: T.green }} />
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
          {messages.map((m, i) => <ChatMessage key={i} role={m.role} content={m.content} />)}
          {typing && <TypingDots />}
          <div ref={endRef} />
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
      <YieldComparison />
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
