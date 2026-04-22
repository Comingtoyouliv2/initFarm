module aum_vault_addr::aum_vault {
    use std::signer;
    use initia_std::coin;
    use initia_std::fungible_asset::Metadata;
    use initia_std::object::Object;

    /// Error codes
    const E_NOT_ADMIN: u64 = 1;
    const E_ALREADY_INITIALIZED: u64 = 2;
    const E_NOT_INITIALIZED: u64 = 3;
    const E_INVALID_BPS: u64 = 4;
    const E_INVALID_AMOUNT: u64 = 5;
    const E_INSUFFICIENT_SHARES: u64 = 6;
    const E_NO_POSITION: u64 = 7;
    const E_NO_PENDING_REDEEM: u64 = 8;
    const E_PAUSED: u64 = 9;

    /// 10_000 bps = 100%
    const BPS_DENOMINATOR: u64 = 10000;

    /// Global vault state. Stored under admin address.
    struct Vault has key {
        admin: address,
        fee_bps: u64,
        total_aum: u64,
        total_shares: u64,
        fee_accumulator: u64,
        paused: bool,
    }

    /// User state. Stored under each investor address.
    struct Position has key {
        shares: u64,
        pending_redeem: u64,
    }

    /// Initialize vault once under admin account.
    public entry fun initialize(admin: &signer, fee_bps: u64) {
        let admin_addr = signer::address_of(admin);
        assert!(!exists<Vault>(admin_addr), E_ALREADY_INITIALIZED);
        assert!(fee_bps <= BPS_DENOMINATOR, E_INVALID_BPS);

        move_to(admin, Vault {
            admin: admin_addr,
            fee_bps,
            total_aum: 0,
            total_shares: 0,
            fee_accumulator: 0,
            paused: false,
        });
    }

    /// Deposit token to admin custody and mint shares to depositor.
    /// NOTE: This is a custody model (admin-controlled payout).
    public entry fun deposit(account: &signer, admin_addr: address, metadata: Object<Metadata>, amount: u64) acquires Vault, Position {
        assert!(amount > 0, E_INVALID_AMOUNT);
        assert!(exists<Vault>(admin_addr), E_NOT_INITIALIZED);

        let vault = borrow_global_mut<Vault>(admin_addr);
        assert!(!vault.paused, E_PAUSED);

        // Transfer funds from user -> admin custody
        let payment = coin::withdraw(account, metadata, amount);
        coin::deposit(vault.admin, payment);

        // Share minting
        let minted_shares = if (vault.total_shares == 0 || vault.total_aum == 0) {
            amount
        } else {
            amount * vault.total_shares / vault.total_aum
        };

        vault.total_aum = vault.total_aum + amount;
        vault.total_shares = vault.total_shares + minted_shares;

        let user = signer::address_of(account);
        if (!exists<Position>(user)) {
            move_to(account, Position { shares: 0, pending_redeem: 0 });
        };

        let pos = borrow_global_mut<Position>(user);
        pos.shares = pos.shares + minted_shares;
    }

    /// User requests redeem. Contract burns shares now and queues token payout.
    /// Admin settles later with `settle_redeem`.
    public entry fun request_redeem(account: &signer, admin_addr: address, share_amount: u64) acquires Vault, Position {
        assert!(share_amount > 0, E_INVALID_AMOUNT);
        assert!(exists<Vault>(admin_addr), E_NOT_INITIALIZED);

        let vault = borrow_global_mut<Vault>(admin_addr);
        assert!(!vault.paused, E_PAUSED);

        let user = signer::address_of(account);
        assert!(exists<Position>(user), E_NO_POSITION);
        let pos = borrow_global_mut<Position>(user);

        assert!(pos.shares >= share_amount, E_INSUFFICIENT_SHARES);
        assert!(vault.total_shares > 0, E_INSUFFICIENT_SHARES);

        let redeem_amount = share_amount * vault.total_aum / vault.total_shares;

        pos.shares = pos.shares - share_amount;
        pos.pending_redeem = pos.pending_redeem + redeem_amount;

        vault.total_shares = vault.total_shares - share_amount;
        vault.total_aum = vault.total_aum - redeem_amount;
    }

    /// Admin pays pending redemption from custody balance to user.
    public entry fun settle_redeem(admin: &signer, user: address, metadata: Object<Metadata>) acquires Vault, Position {
        let admin_addr = signer::address_of(admin);
        assert!(exists<Vault>(admin_addr), E_NOT_INITIALIZED);
        assert!(exists<Position>(user), E_NO_POSITION);

        let vault = borrow_global_mut<Vault>(admin_addr);
        assert!(vault.admin == admin_addr, E_NOT_ADMIN);

        let pos = borrow_global_mut<Position>(user);
        let amount = pos.pending_redeem;
        assert!(amount > 0, E_NO_PENDING_REDEEM);

        let payout = coin::withdraw(admin, metadata, amount);
        coin::deposit(user, payout);

        pos.pending_redeem = 0;
    }

    /// Admin updates independent NAV/AUM estimate and accrues performance fee.
    /// Fee = max(new_aum - old_aum, 0) * fee_bps / 10_000.
    public entry fun update_aum(admin: &signer, new_total_aum: u64) acquires Vault {
        let admin_addr = signer::address_of(admin);
        assert!(exists<Vault>(admin_addr), E_NOT_INITIALIZED);

        let vault = borrow_global_mut<Vault>(admin_addr);
        assert!(vault.admin == admin_addr, E_NOT_ADMIN);

        if (new_total_aum > vault.total_aum) {
            let gain = new_total_aum - vault.total_aum;
            let fee = gain * vault.fee_bps / BPS_DENOMINATOR;
            vault.fee_accumulator = vault.fee_accumulator + fee;
        };

        vault.total_aum = new_total_aum;
    }

    /// Admin claims accrued performance fee from custody account.
    public entry fun collect_fees(admin: &signer, to: address, metadata: Object<Metadata>, amount: u64) acquires Vault {
        assert!(amount > 0, E_INVALID_AMOUNT);

        let admin_addr = signer::address_of(admin);
        assert!(exists<Vault>(admin_addr), E_NOT_INITIALIZED);

        let vault = borrow_global_mut<Vault>(admin_addr);
        assert!(vault.admin == admin_addr, E_NOT_ADMIN);
        assert!(vault.fee_accumulator >= amount, E_INVALID_AMOUNT);

        let fee_coin = coin::withdraw(admin, metadata, amount);
        coin::deposit(to, fee_coin);

        vault.fee_accumulator = vault.fee_accumulator - amount;
        vault.total_aum = vault.total_aum - amount;
    }

    public entry fun set_paused(admin: &signer, paused: bool) acquires Vault {
        let admin_addr = signer::address_of(admin);
        assert!(exists<Vault>(admin_addr), E_NOT_INITIALIZED);

        let vault = borrow_global_mut<Vault>(admin_addr);
        assert!(vault.admin == admin_addr, E_NOT_ADMIN);
        vault.paused = paused;
    }

    #[view]
    public fun vault_state(admin_addr: address): (address, u64, u64, u64, u64, bool) acquires Vault {
        let v = borrow_global<Vault>(admin_addr);
        (v.admin, v.fee_bps, v.total_aum, v.total_shares, v.fee_accumulator, v.paused)
    }

    #[view]
    public fun user_state(user: address): (u64, u64) acquires Position {
        if (!exists<Position>(user)) {
            (0, 0)
        } else {
            let p = borrow_global<Position>(user);
            (p.shares, p.pending_redeem)
        }
    }
}
