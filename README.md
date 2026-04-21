# initFarm

AI-powered crypto yield portfolio builder.

initFarm helps users analyze yield opportunities across crypto protocols and build portfolios based on yield quality, sustainability, and risk-adjusted return rather than headline APY alone.

## Overview

Crypto yield products often show attractive APYs, but it is difficult to understand:

- where the yield comes from
- whether the yield is sustainable
- how much risk is embedded in the strategy
- how to compare multiple protocols objectively

initFarm is being built to make crypto yield more transparent and easier to reason about through AI-assisted analysis and portfolio construction.

## Goals

- Analyze the source of yield across DeFi protocols
- Evaluate whether advertised APY is realistic or temporary
- Model yield sustainability using protocol and market data
- Help users construct diversified yield portfolios
- Present the logic in a simple AI chat interface

## Core Ideas

### 1. Yield decomposition
Break yield into understandable components such as:
- protocol fees
- token incentives
- emissions
- staking rewards
- market-dependent return sources

### 2. Risk-aware portfolio construction
Instead of maximizing APY only, initFarm aims to consider:
- TVL stability
- token volatility
- dependency on emissions
- liquidity risk
- protocol concentration risk

### 3. AI-assisted decision making
Users interact with the system through a chat-style interface to:
- ask about yield opportunities
- compare protocols
- understand risk factors
- generate portfolio suggestions

## Planned Features

- Landing page
- AI chat interface
- Yield source analysis
- Risk scoring framework
- Portfolio allocation visualization
- Protocol comparison dashboard
- Wallet integration
- Execution support

## Example Questions initFarm Should Answer

- Is this 25% APY sustainable?
- How much of this yield comes from token emissions?
- Which protocols offer the best risk-adjusted yield?
- How should I allocate across multiple yield strategies?
- What happens to my expected return if token incentives drop?

## Tech Stack

Planned stack:

- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js / Python
- **AI Layer:** OpenAI API
- **Data Sources:** DeFiLlama, Dune, on-chain APIs

## Project Status

This project is currently in early MVP development.

## Vision

Build a more transparent and data-driven interface for crypto yield investing.

## Author

Wonjae Choi