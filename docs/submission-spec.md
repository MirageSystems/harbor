# Harbor — Submission Spec (final brush-up)

The single file that, when fully implemented, makes Harbor submission-ready.
Everything below is decided; no open questions. Scope beyond this file is
frozen — if it isn't here, it doesn't happen before submission.

Judge's-eye principle behind every decision: **nothing on screen may be fake,
dead, or unexplained.** The demo's credibility = real tx + provable timing +
zero broken affordances.

---

## 1. UI changes (app/, components/, hooks/)

### 1.1 Kill dead chrome
- Header nav: remove `Letters of Credit`, `Settlements`, `Counterparties`
  links. Keep logo + `Dashboard` only.
- QuickActions: remove "Add a counterparty" and "View settlement history".
  The open-LC action remains the only quick action.
- Accept: no element on the page navigates nowhere or ignores a click.

### 1.2 Account chip (header)
- Replace the bare email + sign-out with a chip: email · shortened wallet
  address · chain badge (`Local` / `Amoy testnet`).
- Click on address copies the FULL address to clipboard with a "copied"
  confirmation.
- Accept: a new user can find, understand, and copy their wallet address in
  under 10 seconds without documentation.

### 1.3 Two-role status copy
- Open LC, viewer is buyer: secondary line "waiting for seller to confirm
  delivery".
- Open LC, viewer is seller: secondary line "you're the seller — confirm
  delivery to get paid" (next to the Mark delivered button).
- Accept: neither role can wonder "what happens next" while an LC is open.

### 1.4 Elapsed-time truth (THE demo moment)
- Open LCs: live ticking elapsed time since `openedAt` ("open 0:42").
- Settled LCs / settlement card: "**Settled in Ns**" where
  N = `settledAt - openedAt`, straight from on-chain timestamps.
- SplitCompare's "90 seconds" side shows the real measured figure of the
  latest settlement.
- No countdowns, no animation theater: every number on screen must be
  derivable from chain data a judge can check.
- Accept: settlement card shows a real elapsed figure that matches the two
  explorer timestamps.

### 1.5 Humanized errors
- Map to one-liners: invalid seller address (pre-submit validation),
  insufficient balance, user rejected signature, wrong chain, RPC
  unreachable. Everything else: "Transaction failed" + collapsible raw
  detail.
- Accept: no raw hex/stack text visible by default anywhere.

### 1.6 Open-LC success feedback
- On confirmation: form closes, new row highlighted briefly, inline note
  "LC #N opened — funds locked" (with tx hash on Amoy).
- Accept: a successful open is visually unmissable within 2s.

### 1.7 Honest balance card
- Kill fabricated "Down from X after Y settled" and the decorative "Paid"
  pill.
- Subtext becomes chain-derived: "X POL locked in open LCs · Y POL settled
  to date" (viewer-relevant figures).
- Accept: every number on the card is reproducible from contract state.

### 1.8 Receivable evidence (one line, no more)
- Settlement card: "Receivable #N minted to seller", linking to the token on
  the explorer when on Amoy.
- Accept: the NFT claim is clickable-verifiable; no other NFT UI exists.

### 1.9 Seamless signing
- Privy config: `showWalletUIs: false` — no signing popups; the "no wallet
  visible" pitch must hold during the demo.
- Accept: open→settle happens with zero Privy modals after login.

### 1.10 First-load state
- Until the first poll resolves: neutral loading state, never "No letters of
  credit yet" on a chain that has LCs.

### Explicitly NOT doing (UI)
- Faucet/onramp flow (pre-funded accounts + how-to-use.md cover it)
- Per-row explorer links, LC detail views, settlement history page
- cancelLC UI (contract escape hatch only)
- Any new pages/routes; any nav beyond Dashboard
- Dual-login live demo (second window is pre-authenticated before filming)

## 2. Docs truth-pass

- README + whitepaper: escrow asset is native POL on testnet; "USDC on
  mainnet" appears once as roadmap narrative, never as a description of the
  current contract. Remove/replace any sentence a judge could falsify by
  clicking the explorer (mock-USDC claims, "contract verifies" if
  verification not yet done).
- demo-script.md: reword "port signal fires" beat to match deliver=settle
  reality (seller confirms delivery; settlement is the same transaction).
  Timer beats reference the real elapsed figure (1.4), not a staged
  countdown.
- README: add 3-line quickstart pointing at docs/how-to-use.md and the
  local-vs-Amoy env switch.
- Accept: every checkable claim in README/whitepaper/demo-script is true at
  submission time.

## 3. Chain/ops

- **Polygonscan verification** (blocked on Pushkar: free API key from
  polygonscan.com → contracts/.env). Then `forge verify-contract` for
  `0x5b1959F4a1542C72aD6a6f78e4F93a89BE947b35`. Accept: explorer shows
  verified source + decoded `markDelivered` calls.
- **Demo accounts**: two Privy email logins (buyer & seller personas),
  wallets funded on Amoy from deployer. Addresses recorded in
  docs/deployments.md (private note, not README).
- Deployer top-up via faucet if below ~0.05 POL on demo day.

## 4. Pre-demo runbook (run start-to-finish twice before filming)

1. `.env.local`: flip to `NEXT_PUBLIC_CHAIN=amoy` + Amoy contract address;
   restart dev server.
2. Window A (buyer persona) logged in; Window B (seller persona) logged in —
   both BEFORE filming; balances confirmed non-zero.
3. Dry run: open small LC (A) → Mark delivered (B) → settlement card shows
   "Settled in Ns" + explorer link works + NFT link works.
4. Backup path if UI write fails mid-demo: settle via
   `cast send <LOC> "markDelivered(uint256)" <id>` with seller key
   (contracts/.env / deployments.md).
5. Screen layout per docs/demo-script.md; explorer tab pre-opened on the
   contract page (verified source visible).

## 5. Order of execution

1. 1.1 dead chrome + 1.10 first-load (minutes, do first)
2. 1.2 account chip + 1.9 seamless signing
3. 1.4 elapsed-time truth (the big one)
4. 1.5 errors + 1.6 success feedback
5. 1.7 honest balance + 1.3 role copy + 1.8 NFT line
6. Section 2 docs truth-pass
7. Section 3 verification + demo accounts (parallel, needs Pushkar's key)
8. Section 4 runbook rehearsal — twice

Definition of done: every Accept line above holds, `forge test` green,
`next build` clean, and one full Amoy rehearsal recorded end-to-end.
