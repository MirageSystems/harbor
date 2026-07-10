"use client";

import { useCallback, useEffect, useState } from "react";
import { useWallets, type ConnectedWallet } from "@privy-io/react-auth";
import {
  createWalletClient,
  custom,
  parseAbiItem,
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
  STATUS,
  type LC,
} from "@/lib/harbor";

const POLL_MS = 2000;

const LC_SETTLED_EVENT = parseAbiItem(
  "event LCSettled(uint256 indexed id, address indexed seller, uint256 amount, uint64 settledAt)"
);

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

  const refresh = useCallback(async () => {
    try {
      const nextId = await publicClient.readContract({
        address: LOC_ADDRESS,
        abi: LOC_ABI,
        functionName: "nextId",
      });
      const ids = Array.from({ length: Number(nextId) - 1 }, (_, i) => BigInt(i + 1));
      const raw = await Promise.all(
        ids.map((id) =>
          publicClient.readContract({
            address: LOC_ADDRESS,
            abi: LOC_ABI,
            functionName: "getLC",
            args: [id],
          })
        )
      );
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

      if (address) setBalance(await publicClient.getBalance({ address }));

      const settledLogs = await publicClient.getLogs({
        address: LOC_ADDRESS,
        event: LC_SETTLED_EVENT,
        fromBlock: 0n,
      });
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
      submit(async (client) => {
        const hash = await client.writeContract({
          address: LOC_ADDRESS,
          abi: LOC_ABI,
          functionName: "markDelivered",
          args: [id],
        });
        setLastSettledTx(hash);
        return hash;
      }),
    [submit]
  );

  return { address, lcs, balance, lastSettledTx, pending, error, openLC, markDelivered };
}
