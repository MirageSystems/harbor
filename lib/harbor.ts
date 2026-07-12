import { createPublicClient, formatEther, http, parseAbi, parseAbiItem } from "viem";
import { polygonAmoy, foundry } from "viem/chains";

// viem's foundry chain doesn't declare Multicall3; anvil gets the canonical
// deployment injected via anvil_setCode (see contracts/README.md).
const localChain = {
  ...foundry,
  contracts: {
    multicall3: {
      address: "0xcA11bde05977b3631167028862bE2a173976CA11",
    },
  },
} as const;

export const chain =
  process.env.NEXT_PUBLIC_CHAIN === "amoy" ? polygonAmoy : localChain;

export const nativeSymbol = chain.nativeCurrency.symbol;

export const LOC_ADDRESS = (process.env.NEXT_PUBLIC_LOC_ADDRESS ??
  "0x5FbDB2315678afecb367f032d93F642f64180aa3") as `0x${string}`;

export const LOC_ABI = parseAbi([
  "function openLC(address seller, string memo) payable returns (uint256)",
  "function markDelivered(uint256 id)",
  "function cancelLC(uint256 id)",
  "function nextId() view returns (uint256)",
  "function getLC(uint256 id) view returns ((address buyer, address seller, uint256 amount, uint64 openedAt, uint64 settledAt, uint8 status, string memo))",
]);

export const LC_SETTLED_EVENT = parseAbiItem(
  "event LCSettled(uint256 indexed id, address indexed seller, uint256 amount, uint64 settledAt)"
);

export const publicClient = createPublicClient({
  chain,
  transport: http(undefined, { batch: true }),
  batch: { multicall: true },
});

export type LCStatus = "none" | "open" | "settled" | "cancelled";
export const STATUS: LCStatus[] = ["none", "open", "settled", "cancelled"];

export type LC = {
  id: bigint;
  buyer: `0x${string}`;
  seller: `0x${string}`;
  amount: bigint;
  openedAt: number;
  settledAt: number;
  status: LCStatus;
  memo: string;
};

export function explorerTxUrl(hash: string): string | null {
  const base = chain.blockExplorers?.default?.url;
  return base ? `${base}/tx/${hash}` : null;
}

export function shortHex(hex: string, head = 6, tail = 4): string {
  return `${hex.slice(0, head)}…${hex.slice(-tail)}`;
}

export function explorerTokenUrl(id: bigint): string | null {
  const base = chain.blockExplorers?.default?.url;
  return base ? `${base}/token/${LOC_ADDRESS}?a=${id}` : null;
}

/** mm:ss for live tickers ("1:07") */
export function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.max(0, seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** One-line user-facing message for a write failure; raw detail kept separately. */
export function humanizeError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("insufficient funds")) return "Not enough POL in your wallet for this amount plus gas.";
  if (m.includes("rejected") || m.includes("denied")) return "Signature request was declined.";
  if (m.includes("invalidseller")) return "That seller address isn't valid for this LC.";
  if (m.includes("fetch") || m.includes("network") || m.includes("timeout"))
    return "Can't reach the network — check your connection and try again.";
  return "Transaction failed.";
}

export function formatPol(wei: bigint): string {
  return Number(formatEther(wei)).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });
}
