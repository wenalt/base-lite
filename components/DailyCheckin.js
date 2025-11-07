// components/DailyCheckin.js
import { useMemo, useState, useEffect } from 'react';
import {
  useAccount,
  useChainId,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi';

// --- CONFIGURATION (UNCHANGED) ---
// Address of the deployed contract
const CHECKIN_ADDRESS =
  process.env.NEXT_PUBLIC_CHECKIN_ADDRESS || '0xfE482b020d5B3f87b72b493f2d7EDddcAC123613';

// Minimal ABI of the BaseDailyCheckin contract
const ABI = [
  { type: 'function', name: 'checkIn', stateMutability: 'nonpayable', inputs: [{ name: 'note', type: 'string' }], outputs: [{ name: 'day', type: 'uint256' }, { name: 'streak', type: 'uint256' }, { name: 'userTotal', type: 'uint256' }] },
  { type: 'function', name: 'getUser', stateMutability: 'view', inputs: [{ name: 'a', type: 'address' }], outputs: [{ name: 'lastDay', type: 'uint64' }, { name: 'streak', type: 'uint32' }, { name: 'total', type: 'uint32' }] },
  { type: 'function', name: 'canCheckIn', stateMutability: 'view', inputs: [{ name: 'a', type: 'address' }], outputs: [{ type: 'bool' }] },
  { type: 'function', name: 'currentDay', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { type: 'function', name: 'totalCheckins', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
];

// --- CACHING LOGIC ---
// Unique key prefix for local storage cache
const CACHE_KEY_PREFIX = 'base-lite:onchain-checkin:v1:';

export default function DailyCheckin() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const onBase = chainId === 8453 || chainId === 84532;

  // --- LOCAL STATE FOR CACHED DATA ---
  // This state provides an instant UI feedback while fresh data is fetched.
  const [cachedState, setCachedState] = useState({ streak: 0, canCheckIn: null });
  const cacheKey = useMemo(() => (address ? `${CACHE_KEY_PREFIX}${address.toLowerCase()}` : null), [address]);

  // Load initial state from cache when the component mounts or user changes
  useEffect(() => {
    if (cacheKey) {
      try {
        const raw = localStorage.getItem(cacheKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (typeof parsed.streak === 'number' && typeof parsed.canCheckIn === 'boolean') {
            setCachedState(parsed);
          }
        }
      } catch (e) {
        console.error('Failed to read check-in state from cache.', e);
      }
    }
  }, [cacheKey]);

  // --- WAGMI HOOKS FOR ON-CHAIN INTERACTION ---
  const contractConfig = useMemo(
    () => (CHECKIN_ADDRESS && onBase ? { address: CHECKIN_ADDRESS, abi: ABI, chainId } : null),
    [onBase, chainId]
  );

  const { data: canDoResult, refetch: refetchCanDo } = useReadContract({
    ...contractConfig,
    functionName: 'canCheckIn',
    args: address ? [address] : undefined,
    query: { enabled: !!(contractConfig && isConnected && address) },
  });

  const { data: userDataResult, refetch: refetchUser } = useReadContract({
    ...contractConfig,
    functionName: 'getUser',
    args: address ? [address] : undefined,
    query: { enabled: !!(contractConfig && isConnected && address) },
  });

  const { data: hash, isPending, writeContract } = useWriteContract();
  const { isLoading: isMining, isSuccess } = useWaitForTransactionReceipt({ hash });

  // --- CACHE AND STATE SYNCHRONIZATION ---
  // When fresh on-chain data arrives, update both the UI state and the local storage cache.
  useEffect(() => {
    if (userDataResult !== undefined && canDoResult !== undefined) {
      const newState = {
        streak: Number(userDataResult[1] ?? 0),
        canCheckIn: canDoResult,
      };
      setCachedState(newState);
      if (cacheKey) {
        localStorage.setItem(cacheKey, JSON.stringify(newState));
      }
    }
  }, [userDataResult, canDoResult, cacheKey]);

  // After a successful transaction, refetch the on-chain data to get the latest state.
  useEffect(() => {
    if (isSuccess) {
      // A small delay helps ensure the RPC node has indexed the new state.
      setTimeout(() => {
        refetchUser();
        refetchCanDo();
      }, 1500);
    }
  }, [isSuccess, refetchUser, refetchCanDo]);


  // --- EVENT HANDLER ---
  const handleCheckIn = () => {
    if (!contractConfig) return;
    writeContract(
      { ...contractConfig, functionName: 'checkIn', args: [''] },
      { onError: (e) => console.error('Failed to send transaction:', e) }
    );
  };

  // --- RENDER LOGIC ---
  // Prioritize live data, but fall back to the cache for an instant UI.
  const streak = userDataResult !== undefined ? Number(userDataResult[1]) : cachedState.streak;
  const canDo = canDoResult !== undefined ? canDoResult : cachedState.canCheckIn;

  const disabled = !isConnected || !onBase || !contractConfig || isPending || isMining || canDo === false;
  const label =
    !isConnected ? 'Connect your wallet'
    : !onBase ? 'Switch to Base / Base Sepolia'
    : isPending ? 'Check wallet...'
    : isMining ? 'Confirming...'
    : canDo === false ? 'Already checked-in today'
    : 'Daily check-in';

  // Fallback for when the contract address is not configured
  if (!CHECKIN_ADDRESS) {
    return (
      <div style={{ marginTop: 10, fontSize: 14, opacity: 0.95 }}>
        <strong>Daily check-in</strong>
        <br />
        <span style={{ opacity: 0.8 }}>
          Contract address not configured. Set <code>NEXT_PUBLIC_CHECKIN_ADDRESS</code>.
        </span>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>Daily check-in</div>
      
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 8 }}>
        <button
          onClick={handleCheckIn}
          disabled={disabled}
          style={{
            height: 36,
            padding: '0 14px',
            borderRadius: 12,
            border: '1px solid rgba(0,0,0,0.14)',
            background: disabled ? 'rgba(0,0,0,0.08)' : 'rgba(0,0,0,0.12)',
            cursor: disabled ? 'not-allowed' : 'pointer',
            fontWeight: 700,
          }}
          title={label}
          aria-label="Daily check-in"
        >
          {label}
        </button>
      </div>

      {isConnected && onBase && (
        <div style={{ fontSize: 14, opacity: 0.95 }}>
          Streak: <strong>{streak}</strong>
          {canDo === false && <span> — come back tomorrow! ✅</span>}
        </div>
      )}
    </div>
  );
}
