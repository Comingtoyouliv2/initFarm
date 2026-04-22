# AUM Vault (Initia Move)

A minimal AUM vault module for Initia Move rollups.

## What this module does

- `initialize`: create vault with admin + fee bps.
- `deposit`: user deposits token to admin custody and receives vault shares.
- `request_redeem`: user burns shares and creates pending redeem amount.
- `settle_redeem`: admin executes pending redeem payout to user.
- `update_aum`: admin updates AUM and accrues performance fee.
- `collect_fees`: admin claims accrued fee.
- `set_paused`: emergency pause for deposit/redeem requests.

> This is a custody model for hackathon speed. Production use should add stronger controls, audits, and formal accounting.

---

## 1) Configure address

Replace `0xYOUR_HEX_ADDRESS` in `Move.toml` with your parsed hex address.

```bash
initiad keys parse <your_initia_address>
# use `bytes:` output in Move.toml
```

## 2) Build

```bash
initiad move build --path ./move/aum_vault
```

## 3) Deploy

```bash
export NODE_URL=<your_rollup_or_initia_rpc>
export CHAIN_ID=<your_chain_id>
export ACCOUNT_NAME=<your_key_name>

initiad move deploy \
  --path ./move/aum_vault \
  --upgrade-policy COMPATIBLE \
  --from $ACCOUNT_NAME \
  --gas auto --gas-adjustment 1.5 \
  --gas-prices 0.015uinit \
  --node $NODE_URL \
  --chain-id $CHAIN_ID
```

## 4) Example execute calls

> Replace `<MODULE_ADDR>` with your deployed module address and adjust `--args` with your token metadata object.

Initialize:

```bash
initiad tx move execute <MODULE_ADDR> aum_vault initialize \
  --args '["u64:1000"]' \
  --from $ACCOUNT_NAME \
  --gas auto --gas-adjustment 1.5 --gas-prices 0.015uinit \
  --node $NODE_URL --chain-id $CHAIN_ID
```

Query vault state:

```bash
initiad query move view <MODULE_ADDR> aum_vault vault_state \
  --args '["address:<MODULE_ADDR>"]' \
  --node $NODE_URL
```

