# initFarm Vault — Initia 배포 가이드

## 1. initiad CLI 설치

```bash
git clone https://github.com/initia-labs/initia.git
cd initia
make install
```

또는 바이너리 직접 다운로드: https://github.com/initia-labs/initia/releases

## 2. 지갑 설정

```bash
# 새 키 생성
initiad keys add initfarm

# 기존 키 복구
initiad keys add initfarm --recover

# 주소 확인
initiad keys show initfarm -a

# HEX 주소 확인 (Move.toml에 사용)
initiad keys parse $(initiad keys show initfarm -a)
```

## 3. Move.toml 주소 설정

HEX 주소를 복사해서 `contracts/initfarm/Move.toml`의 `initfarm` 주소를 교체:

```toml
[addresses]
std = "0x1"
initia_std = "0x1"
initfarm = "0x여기에_HEX주소_입력"
```

## 4. 빌드

```bash
initiad move build --path ./contracts/initfarm
```

## 5. 배포 (Mainnet: interwoven-1)

```bash
initiad move deploy \
  --path ./contracts/initfarm \
  --upgrade-policy COMPATIBLE \
  --from initfarm \
  --gas auto \
  --gas-adjustment 1.5 \
  --gas-prices 0.015uinit \
  --node https://rpc.initia.xyz:443 \
  --chain-id interwoven-1
```

## 6. 초기화

```bash
initiad tx move execute \
  $YOUR_ADDRESS initfarm vault initialize \
  --from initfarm \
  --gas auto --gas-adjustment 1.5 \
  --gas-prices 0.015uinit \
  --node https://rpc.initia.xyz:443 \
  --chain-id interwoven-1
```

## 7. 포트폴리오 설정

```bash
initiad tx move execute \
  $YOUR_ADDRESS initfarm vault set_allocations \
  --args 'string_array:["Lido ETH","Aave USDC","Initia Staking"]' \
  --args 'string_array:["ETH","USDC","INIT"]' \
  --args 'u64_array:[3000,3000,4000]' \
  --args 'u64_array:[250,520,1420]' \
  --args 'u8_array:[1,1,2]' \
  --from initfarm \
  --gas auto --gas-adjustment 1.5 \
  --gas-prices 0.015uinit \
  --node https://rpc.initia.xyz:443 \
  --chain-id interwoven-1
```

## 8. 조회

```bash
# Vault 정보 조회
initiad query move view \
  $YOUR_ADDRESS initfarm vault get_vault_info \
  --args "address:$YOUR_ADDRESS" \
  --node https://rpc.initia.xyz:443

# 유저 포지션 조회
initiad query move view \
  $YOUR_ADDRESS initfarm vault get_position \
  --args "address:$USER_ADDRESS" \
  --node https://rpc.initia.xyz:443
```

## 9. submission.json 업데이트

배포 후 txn hash를 `.initia/submission.json`의 `links` 필드에 추가.
