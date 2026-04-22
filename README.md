# initFarm

**AI-powered DeFi yield farming portfolio engine** built for the [Initia Hackathon](https://initia.xyz).

initFarm verifies on-chain yields independently, scores protocol risk across six factors, and lets an AI agent construct a diversified portfolio matched to your risk tolerance.

---

## Problem

DeFi protocols advertise APYs that rarely reflect what depositors actually earn. Fees, token inflation, impermanent loss, and lock-up costs silently erode returns. There is no standardized way to compare real yields across protocols or to quantify how much of an advertised rate is a risk premium.

## Solution

initFarm introduces a transparent yield verification engine:

1. **Collect** — Pull real-time TVL, fee revenue, token distribution, and staking flow data from on-chain sources (DeFiLlama, Dune Analytics, StakingRewards).
2. **Decompose** — Break each protocol's yield into primitives: rebase, reward distribution, fee sharing, lending interest, and AUM performance. Compute an independent APY.
3. **Quantify** — Calculate `Risk(δ) = Nominal APY − Own APY` to measure the risk premium. Score every protocol across all six risk parameters with weighted analysis.
4. **Construct** — The AI agent assembles a portfolio matching your investment policy, balancing target yields with acceptable risk levels and lock-up preferences.

## 6-Factor Risk Model

Every protocol is scored across:

| Factor | What it measures |
|---|---|
| TVL Stability | Size, trend, and concentration (Herfindahl Index) |
| APY Consistency | Historical volatility (σ) and 30/90-day deviation |
| Revenue Coverage | What portion of yield is backed by actual protocol revenue |
| Whale Concentration | Top-wallet share and exit risk |
| Token Price Trend | 30d/90d price momentum and daily volatility |
| Lock-up Risk | Unbonding period and liquidity constraints |

Combined into a single risk grade: **A** (Lowest) through **D** (High).

## Yield Probability Distribution

For each pool, initFarm renders a normal distribution chart showing:

- **68% probability range** (1σ) — the most likely yield outcome
- **95% probability range** (2σ) — extended confidence interval
- **Risk Delta (δ)** — gap between nominal and real APY

## Pool Coverage

| Pool | Ticker | Nominal APY | Real APY | TVL | Risk |
|---|---|---|---|---|---|
| Lido ETH Staking | ETH | 2.51% | 2.31% | $19.6B | A |
| Binance ETH Staking | WBETH | 2.61% | 2.38% | $7.3B | A |
| EtherFi ETH Staking | weETH | 2.43% | 2.10% | $6.3B | B |
| Sky USD Fee Sharing | USDS | 4.00% | 3.65% | $5.5B | A |
| Aave ETH Lending | weETH | 1.82% | 1.82% | $5.0B | B |
| Ethena USD Yield | USDe | 3.54% | 2.90% | $3.5B | B |
| Polkadot Staking | DOT | 12.00% | 5.50% | $4.8B | C |
| Solana Staking | SOL | 7.20% | 5.80% | $12.4B | B |
| Celestia Staking | TIA | 14.20% | 7.80% | $3.2B | C |

## AI Chat Agent

Chat with the initFarm AI agent to:

- Get personalized portfolio construction based on risk tolerance
- Run protocol-level risk assessments (6-factor breakdown)
- Verify APY sustainability with on-chain evidence
- Explore Initia ecosystem staking opportunities

## Pricing

All payments are converted as **iUSD** (Initia stablecoin) to be used as token.

| Plan | Price | Highlights |
|---|---|---|
| Explorer | Free | Pool table, basic verification, 3 AI chats/day |
| Starter | $9.90/mo | Unlimited AI chat, 1 portfolio, risk delta monitoring |
| Pro | $29/mo | 5 portfolios, whale alerts, backtesting, priority support |
| Institutional | $99/mo | Unlimited portfolios, API access, on-chain audit reports |

## Tech Stack

- **Frontend**: React (single-component architecture)
- **Styling**: Inline CSS with design tokens, glassmorphism
- **Charts**: SVG-based normal distribution rendering
- **Wallet**: MetaMask, Phantom integration (demo)
- **Deployment**: Vercel

## Project Structure

```
├── initFarm.jsx              # Main application (single React component)
├── APY_Factor_Research.xlsx   # APY verification research data
└── README.md
```

## Getting Started

```bash
# Clone the repository
git clone https://github.com/Comingtoyouliv2/Crypto_APY_Portfoliomaker.git
cd Crypto_APY_Portfoliomaker

# The app is a single React component — import it into your React project
# or deploy directly via Vercel
```

## License

MIT

---

Built for the **Initia Hackathon 2025**
