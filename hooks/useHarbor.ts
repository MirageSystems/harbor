"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useWallets, type ConnectedWallet } from "@privy-io/react-auth";
import {
  createWalletClient,
  custom,
  parseEther,
  type Address,
  type Hash,
  type WalletClient,
  type Transport,
  type Chain,
  type Account,
} from "viem";
import {
  chain,
  publicClient,
  LOC_ADDRESS,
  LOC_ABI,
  LC_SETTLED_EVENT,
  STATUS,
  type LC,
} from "@/lib/harbor";

const POLL_MS = 2000;

type HarborWalletClient = WalletClient<Transport, Chain, Account>;

async function walletClientFor(
  wallet: ConnectedWallet
): Promise<HarborWalletClient> {
  await wallet.switchChain(chain.id);
  const provider = await wallet.getEthereumProvider();
  return createWalletClient({
    chain,
    transport: custom(provider),
    account: wallet.address as Address,
  });
}

export function useHarbor() {
  const { wallets } = useWallets();
  const wallet: ConnectedWallet | undefined = wallets[0];
  const address = wallet?.address as Address | undefined;

  const [lcs, setLcs] = useState<LC[]>([]);
  const [balance, setBalance] = useState<bigint | null>(null);
  const [lastSettledTx, setLastSettledTx] = useState<Hash | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cursor so each poll only scans blocks it hasn't seen yet.
  const nextLogBlock = useRef(0n);

  const refresh = useCallback(async () => {
    try {
      const [nextId, latestBlock] = await Promise.all([
        publicClient.readContract({
          address: LOC_ADDRESS,
          abi: LOC_ABI,
          functionName: "nextId",
        }),
        publicClient.getBlockNumber(),
      ]);

      const ids = Array.from({ length: Number(nextId) - 1 }, (_, i) => BigInt(i + 1));
      const [raw, bal, settledLogs] = await Promise.all([
        publicClient.multicall({
          contracts: ids.map((id) => ({
            address: LOC_ADDRESS,
            abi: LOC_ABI,
            functionName: "getLC" as const,
            args: [id] as const,
          })),
          allowFailure: false,
        }),
        address ? publicClient.getBalance({ address }) : Promise.resolve(null),
        nextLogBlock.current <= latestBlock
          ? publicClient.getLogs({
              address: LOC_ADDRESS,
              event: LC_SETTLED_EVENT,
              fromBlock: nextLogBlock.current,
              toBlock: latestBlock,
            })
          : Promise.resolve([]),
      ]);
      nextLogBlock.current = latestBlock + 1n;

      setLcs(
        raw.map((lc, i) => ({
          id: ids[i],
          buyer: lc.buyer,
          seller: lc.seller,
          amount: lc.amount,
          openedAt: Number(lc.openedAt),
          settledAt: Number(lc.settledAt),
          status: STATUS[lc.status],
          memo: lc.memo,
        }))
      );
      setBalance(bal);
      const last = settledLogs.at(-1);
      if (last) setLastSettledTx(last.transactionHash);

      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, [address]);

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, POLL_MS);
    return () => clearInterval(t);
  }, [refresh]);

  const submit = useCallback(
    async (send: (client: HarborWalletClient) => Promise<Hash>): Promise<Hash> => {
      if (!wallet) throw new Error("No wallet connected");
      setPending(true);
      setError(null);
      try {
        const client = await walletClientFor(wallet);
        const hash = await send(client);
        await publicClient.waitForTransactionReceipt({ hash });
        await refresh();
        return hash;
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
        throw e;
      } finally {
        setPending(false);
      }
    },
    [wallet, refresh]
  );

  const openLC = useCallback(
    (seller: string, memo: string, amountPol: string) =>
      submit((client) =>
        client.writeContract({
          address: LOC_ADDRESS,
          abi: LOC_ABI,
          functionName: "openLC",
          args: [seller as Address, memo],
          value: parseEther(amountPol),
        })
      ),
    [submit]
  );

  const markDelivered = useCallback(
    (id: bigint) =>
      submit((client) =>
        client.writeContract({
          address: LOC_ADDRESS,
          abi: LOC_ABI,
          functionName: "markDelivered",
          args: [id],
        })
      ),
    [submit]
  );

  return { address, lcs, balance, lastSettledTx, pending, error, openLC, markDelivered };
}
