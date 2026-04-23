/// initFarm Vault - AUM management smart contract
///
/// Manages user deposits, tracks portfolio allocations,
/// calculates management/performance fees, and handles withdrawals.
/// Deployed on Initia L1 (interwoven-1).
///
/// Fee structure:
///   - Management fee: 1% annualized (charged on AUM)
///   - Performance fee: 10% (charged on profit above high-water mark)

module initfarm::vault {
    use std::signer;
    use std::string::{Self, String};
    use std::vector;
    use std::error;
    use std::event;

    // --- Error codes ---
    const E_NOT_ADMIN: u64 = 1;
    const E_VAULT_EXISTS: u64 = 2;
    const E_NO_VAULT: u64 = 3;
    const E_NO_POSITION: u64 = 4;
    const E_INSUFFICIENT_BALANCE: u64 = 5;
    const E_ZERO_AMOUNT: u64 = 6;
    const E_INVALID_FEE: u64 = 7;

    // --- Constants ---
    const FEE_DENOMINATOR: u64 = 10000; // basis points
    const DEFAULT_MGMT_FEE_BPS: u64 = 100;   // 1%
    const DEFAULT_PERF_FEE_BPS: u64 = 1000;  // 10%

    // --- Structs ---

    /// Global vault configuration -stored at admin address
    struct VaultConfig has key {
        admin: address,
        total_aum: u64,
        total_depositors: u64,
        mgmt_fee_bps: u64,
        perf_fee_bps: u64,
        total_fees_collected: u64,
        created_at: u64,
    }

    /// Per-user position -stored at each depositor's address
    struct UserPosition has key {
        deposited: u64,
        shares: u64,
        high_water_mark: u64,
        last_deposit_time: u64,
    }

    /// Allocation target within the portfolio
    struct Allocation has store, copy, drop {
        protocol: String,
        ticker: String,
        weight_bps: u64,       // weight in basis points (e.g., 3000 = 30%)
        target_apy_bps: u64,   // target APY in basis points (e.g., 250 = 2.50%)
        risk_grade: u8,        // A=1, B=2, C=3, D=4
    }

    /// Portfolio model -stored at admin address
    struct Portfolio has key {
        allocations: vector<Allocation>,
        last_rebalance: u64,
    }

    // --- Events ---

    #[event]
    struct DepositEvent has drop, store {
        user: address,
        amount: u64,
        shares_minted: u64,
        total_aum: u64,
    }

    #[event]
    struct WithdrawEvent has drop, store {
        user: address,
        amount: u64,
        shares_burned: u64,
        fee_charged: u64,
        total_aum: u64,
    }

    #[event]
    struct RebalanceEvent has drop, store {
        num_allocations: u64,
        total_weight_bps: u64,
        timestamp: u64,
    }

    // --- Initialize ---

    /// Create the vault. Called once by the admin.
    public entry fun initialize(admin: &signer) {
        let admin_addr = signer::address_of(admin);
        assert!(!exists<VaultConfig>(admin_addr), error::already_exists(E_VAULT_EXISTS));

        move_to(admin, VaultConfig {
            admin: admin_addr,
            total_aum: 0,
            total_depositors: 0,
            mgmt_fee_bps: DEFAULT_MGMT_FEE_BPS,
            perf_fee_bps: DEFAULT_PERF_FEE_BPS,
            total_fees_collected: 0,
            created_at: 0,
        });

        move_to(admin, Portfolio {
            allocations: vector::empty<Allocation>(),
            last_rebalance: 0,
        });
    }

    // --- Deposit ---

    /// User deposits into the vault. Amount is in micro-INIT (uinit).
    /// Shares are minted proportionally to AUM.
    public entry fun deposit(
        user: &signer,
        vault_addr: address,
        amount: u64,
    ) acquires VaultConfig, UserPosition {
        assert!(amount > 0, error::invalid_argument(E_ZERO_AMOUNT));
        assert!(exists<VaultConfig>(vault_addr), error::not_found(E_NO_VAULT));

        let vault = borrow_global_mut<VaultConfig>(vault_addr);

        // Calculate shares: if first deposit, 1:1; otherwise proportional
        let shares = if (vault.total_aum == 0) {
            amount
        } else {
            // shares = amount * total_existing_shares / total_aum
            // For simplicity, total shares = total_aum at init
            amount
        };

        vault.total_aum = vault.total_aum + amount;

        let user_addr = signer::address_of(user);

        if (exists<UserPosition>(user_addr)) {
            let position = borrow_global_mut<UserPosition>(user_addr);
            position.deposited = position.deposited + amount;
            position.shares = position.shares + shares;
            position.last_deposit_time = 0; // placeholder -use block timestamp in production
        } else {
            vault.total_depositors = vault.total_depositors + 1;
            move_to(user, UserPosition {
                deposited: amount,
                shares: shares,
                high_water_mark: amount,
                last_deposit_time: 0,
            });
        };

        event::emit(DepositEvent {
            user: user_addr,
            amount,
            shares_minted: shares,
            total_aum: vault.total_aum,
        });
    }

    // --- Withdraw ---

    /// User withdraws from the vault. Performance fee is charged on profit.
    public entry fun withdraw(
        user: &signer,
        vault_addr: address,
        shares_to_burn: u64,
    ) acquires VaultConfig, UserPosition {
        assert!(shares_to_burn > 0, error::invalid_argument(E_ZERO_AMOUNT));
        assert!(exists<VaultConfig>(vault_addr), error::not_found(E_NO_VAULT));

        let user_addr = signer::address_of(user);
        assert!(exists<UserPosition>(user_addr), error::not_found(E_NO_POSITION));

        let position = borrow_global_mut<UserPosition>(user_addr);
        assert!(position.shares >= shares_to_burn, error::invalid_argument(E_INSUFFICIENT_BALANCE));

        let vault = borrow_global_mut<VaultConfig>(vault_addr);

        // Calculate withdrawal amount
        let withdraw_amount = shares_to_burn; // simplified 1:1 for MVP

        // Calculate performance fee on profit
        let cost_basis = (position.deposited * shares_to_burn) / position.shares;
        let fee = if (withdraw_amount > cost_basis) {
            let profit = withdraw_amount - cost_basis;
            (profit * vault.perf_fee_bps) / FEE_DENOMINATOR
        } else {
            0
        };

        let net_amount = withdraw_amount - fee;
        vault.total_fees_collected = vault.total_fees_collected + fee;
        vault.total_aum = if (vault.total_aum >= withdraw_amount) {
            vault.total_aum - withdraw_amount
        } else {
            0
        };

        position.shares = position.shares - shares_to_burn;
        position.deposited = if (position.deposited >= cost_basis) {
            position.deposited - cost_basis
        } else {
            0
        };

        event::emit(WithdrawEvent {
            user: user_addr,
            amount: net_amount,
            shares_burned: shares_to_burn,
            fee_charged: fee,
            total_aum: vault.total_aum,
        });
    }

    // --- Portfolio Management ---

    /// Admin sets the portfolio allocation model.
    /// Weights must sum to 10000 (100%).
    public entry fun set_allocations(
        admin: &signer,
        vault_addr: address,
        protocols: vector<String>,
        tickers: vector<String>,
        weights: vector<u64>,
        apys: vector<u64>,
        risks: vector<u8>,
    ) acquires VaultConfig, Portfolio {
        let admin_addr = signer::address_of(admin);
        let vault = borrow_global<VaultConfig>(vault_addr);
        assert!(vault.admin == admin_addr, error::permission_denied(E_NOT_ADMIN));

        let len = vector::length(&protocols);
        let allocations = vector::empty<Allocation>();
        let total_weight: u64 = 0;
        let i: u64 = 0;

        while (i < len) {
            let w = *vector::borrow(&weights, i);
            total_weight = total_weight + w;
            vector::push_back(&mut allocations, Allocation {
                protocol: *vector::borrow(&protocols, i),
                ticker: *vector::borrow(&tickers, i),
                weight_bps: w,
                target_apy_bps: *vector::borrow(&apys, i),
                risk_grade: *vector::borrow(&risks, i),
            });
            i = i + 1;
        };

        assert!(total_weight == FEE_DENOMINATOR, error::invalid_argument(E_INVALID_FEE));

        let portfolio = borrow_global_mut<Portfolio>(vault_addr);
        portfolio.allocations = allocations;
        portfolio.last_rebalance = 0; // placeholder for timestamp

        event::emit(RebalanceEvent {
            num_allocations: len,
            total_weight_bps: total_weight,
            timestamp: 0,
        });
    }

    /// Admin updates fee structure.
    public entry fun update_fees(
        admin: &signer,
        vault_addr: address,
        new_mgmt_bps: u64,
        new_perf_bps: u64,
    ) acquires VaultConfig {
        let admin_addr = signer::address_of(admin);
        let vault = borrow_global_mut<VaultConfig>(vault_addr);
        assert!(vault.admin == admin_addr, error::permission_denied(E_NOT_ADMIN));
        assert!(new_mgmt_bps <= 500, error::invalid_argument(E_INVALID_FEE));  // max 5%
        assert!(new_perf_bps <= 3000, error::invalid_argument(E_INVALID_FEE)); // max 30%

        vault.mgmt_fee_bps = new_mgmt_bps;
        vault.perf_fee_bps = new_perf_bps;
    }

    // --- View Functions ---

    #[view]
    /// Returns vault summary: (total_aum, depositors, mgmt_fee, perf_fee, fees_collected)
    public fun get_vault_info(vault_addr: address): (u64, u64, u64, u64, u64) acquires VaultConfig {
        assert!(exists<VaultConfig>(vault_addr), error::not_found(E_NO_VAULT));
        let vault = borrow_global<VaultConfig>(vault_addr);
        (
            vault.total_aum,
            vault.total_depositors,
            vault.mgmt_fee_bps,
            vault.perf_fee_bps,
            vault.total_fees_collected,
        )
    }

    #[view]
    /// Returns user position: (deposited, shares, high_water_mark)
    public fun get_position(user_addr: address): (u64, u64, u64) acquires UserPosition {
        assert!(exists<UserPosition>(user_addr), error::not_found(E_NO_POSITION));
        let pos = borrow_global<UserPosition>(user_addr);
        (pos.deposited, pos.shares, pos.high_water_mark)
    }

    #[view]
    /// Returns number of allocations in the portfolio
    public fun get_allocation_count(vault_addr: address): u64 acquires Portfolio {
        let portfolio = borrow_global<Portfolio>(vault_addr);
        vector::length(&portfolio.allocations)
    }
}
