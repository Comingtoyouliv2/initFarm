# initFarm

**AI-powered DeFi yield farming portfolio engine built on Initia**

initFarm verifies on-chain yields independently, scores protocol risk across six factors, and lets an AI agent construct a diversified portfolio matched to your risk tolerance. Built for the INITIATE Hackathon.

---

## Problem

DeFi protocols advertise APYs that rarely reflect what depositors actually earn. Fees, token inflation, impermanent loss, and lock-up costs silently erode returns. There is no standardized way to compare real yields across protocols or to quantify how much of an advertised rate is a risk premium.

## Solution

initFarm introduces a transparent yield verification engine:

1. **Collect** -- Pull real-time TVL, fee revenue, token distribution, and staking flow data from on-chain sources (DeFiLlama, Dune Analytics, StakingRewards).
2. **Decompose** -- Break each protocol's yield into primitives: rebase, reward distribution, fee sharing, lending interest, and AUM performance. Compute an independent APY.
3. **Quantify** -- Calculate `Risk(delta) = Nominal APY - Own APY` to measure the risk premium. Score every protocol across all six risk parameters with weighted analysis.
4. **Construct** -- The AI agent assembles a portfolio matching your investment policy, balancing target yields with acceptable risk levels and lock-up preferences.

## APY Verification

initFarm independently verifies every protocol's yield using real-time on-chain data from DeFiLlama, Dune Analytics, and StakingRewards. Each yield is decomposed into primitives (rebase, fee sharing, lending interest, reward distribution) to compute a true APY, then compared against the advertised rate to measure the risk premium: `Risk(delta) = Nominal APY - Verified APY`.

### Multi-Factor Risk Model

Every protocol is scored across six on-chain factors:

| Factor | Data Source |
|---|---|
| TVL Stability | Real-time TVL size, trend, and concentration (Herfindahl Index) |
| APY Consistency | Historical volatility and 30/90-day deviation from mean |
| Revenue Coverage | On-chain fee revenue vs. yield payout ratio |
| Whale Concentration | Top-wallet share and exit risk from holder distribution |
| Token Price Trend | 30d/90d price momentum and daily volatility |
| Lock-up Risk | Unbonding period, withdrawal delay, and liquidity depth |

Each factor produces a weighted score, combined into a single risk grade: **A** (Lowest) through **D** (High).

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

## Smart Contract (Move on Initia)

The on-chain vault contract manages user deposits, portfolio allocations, and fee collection.

**Module**: `vault` at `init1qu96ezv2xmtwfzpyhupz8lu7u5rg562kns6kju`

Features:
- User deposits with proportional share minting
- Withdrawals with performance fee on profit (high-water mark)
- Configurable portfolio allocations (protocol, ticker, weight, APY target, risk grade)
- Admin fee management (1% management + 10% performance)

### Testnet Deployment (initiation-2)

| Transaction | TxHash |
|---|---|
| Contract Deploy | `361C29A465E8DD2AC2CBEF1FB7A546FC3BB1B76F06B0C338FD134D7595544E26` |
| Initialize | `0B360D5B1FF931D7676BE4BFA6EB4163A2E72E7ED59D90BE6FC4B6547C5548A8` |
| Set Allocations | `D05C54B9B134215293FFC2F8A19323AB3D4D8971C736FA99038E9B30B5E8E8BD` |

## Initia-Native Features

- **InterwovenKit** -- Wallet connection via `@initia/interwovenkit-react` with Privy social login, MetaMask, and Keplr support
- **Auto-Sign Session UX** -- Enabled for `/cosmos.bank.v1beta1.MsgSend` and `/initia.move.v1.MsgExecute` transactions

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Wallet | @initia/interwovenkit-react v2.8.0 |
| Smart Contract | Move (Initia) |
| Chain | Initia Testnet (initiation-2) |
| Deployment | Vercel |

## Project Structure

```
initfarmClaude/
├── src/
│   ├── main.jsx              # Entry point with InterwovenKit provider
│   └── App.jsx               # Main application component
├── contracts/
│   └── initfarm/
│       ├── Move.toml          # Move package config
│       └── sources/
│           └── vault.move     # AUM management contract
├── .initia/
│   └── submission.json        # Hackathon submission metadata
├── index.html
├── vite.config.js
└── package.json
```

## Getting Started

### Frontend

```bash
npm install
npm run dev
```

### Smart Contract

```bash
# Build
initiad move build --path ./contracts/initfarm

# Deploy
initiad move deploy \
  --path ./contracts/initfarm \
  --upgrade-policy COMPATIBLE \
  --from <your-key> \
  --gas auto --gas-adjustment 1.5 \
  --gas-prices 0.015uinit \
  --node https://rpc.testnet.initia.xyz:443 \
  --chain-id initiation-2
```

## AI Chat Agent

Chat with the initFarm AI agent to:

- Get personalized portfolio construction based on risk tolerance
- Run protocol-level risk assessments (6-factor breakdown)
- Verify APY sustainability with on-chain evidence
- Explore Initia ecosystem staking opportunities

## Fee Structure

No subscriptions. We earn only when you earn. All fees are settled in iUSD (Initia stablecoin).

| Fee | Rate | Description |
|---|---|---|
| Management Fee | 1.0% | of AUM per year |
| Performance Fee | 10% | of net profits (above high-water mark) |

## Team

- **Noah** -- Builder

## License

MIT

---

Built for the **INITIATE Hackathon** on Initia
