import { createPublicClient, http, parseAbi } from "viem";
import { polygonAmoy, foundry } from "viem/chains";

export const chain =
  process.env.NEXT_PUBLIC_CHAIN === "amoy" ? polygonAmoy : foundry;

export const LOC_ADDRESS = (process.env.NEXT_PUBLIC_LOC_ADDRESS ??
  "0x5FbDB2315678afecb367f032d93F642f64180aa3") as `0x${string}`;

export const LOC_ABI = parseAbi([
  "function openLC(address seller, string memo) payable returns (uint256)",
  "function markDelivered(uint256 id)",
  "function cancelLC(uint256 id)",
  "function nextId() view returns (uint256)",
  "function getLC(uint256 id) view returns ((address buyer, address seller, uint256 amount, uint64 openedAt, uint64 settledAt, uint8 status, string memo))",
  "event LCOpened(uint256 indexed id, address indexed buyer, address indexed seller, uint256 amount, string memo)",
  "event LCSettled(uint256 indexed id, address indexed seller, uint256 amount, uint64 settledAt)",
]);

export const publicClient = createPublicClient({
  chain,
  transport: http(),
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

export function shortAddress(addr: string): string {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}
