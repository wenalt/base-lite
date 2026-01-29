// components/DailyCheckin.jsx
import { useMemo, useEffect } from 'react'
import { useAccount, useChainId, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { openConnectModal } from '../lib/appkit' 

const CHECKIN_ADDRESS =
  process.env.NEXT_PUBLIC_CHECKIN_ADDRESS ||
  '0xfE482b020d5B3f87b72b493f2d7EDddcAC123613'

const ABI = [
  // write
  { "type":"function","name":"checkIn","stateMutability":"nonpayable","inputs":[{"name":"note","type":"string"}],"outputs":[{"name":"day","type":"uint256"},{"name":"streak","type":"uint256"},{"name":"userTotal","type":"uint256"}]},
  // reads
  { "type":"function","name":"getUser","stateMutability":"view","inputs":[{"name":"a","type":"address"}],"outputs":[{"name":"lastDay","type":"uint64"},{"name":"streak","type":"uint32"},{"name":"total","type":"uint32"}]},
  { "type":"function","name":"canCheckIn","stateMutability":"view","inputs":[{"name":"a","type":"address"}],"outputs":[{"type":"bool"}]},
  { "type":"function","name":"currentDay","stateMutability":"view","inputs":[],"outputs":[{"type":"uint256"}]},
  { "type":"function","name":"totalCheckins","stateMutability":"view","inputs":[],"outputs":[{"type":"uint256"}]}
]

export default function DailyCheckin() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()

  const onBase = chainId === 8453 || chainId === 84532
  const contract = useMemo(
    () => (CHECKIN_ADDRESS && onBase ? { address: CHECKIN_ADDRESS, abi: ABI, chainId } : null),
    [onBase, chainId]
  )

  const { data: canDo } = useReadContract({
    ...((contract || {}) ),
    functionName: 'canCheckIn',
    args: address ? [address] : undefined,
    query: { enabled: Boolean(contract && isConnected && address) }
  })

  // FIX: Fetch currentDay to validate streak accuracy
  const { data: currentDay } = useReadContract({
    ...((contract || {}) ),
    functionName: 'currentDay',
    query: { enabled: Boolean(contract && onBase) }
  })

  const { data: userData, refetch: refetchUser } = useReadContract({
    ...((contract || {}) ),
    functionName: 'getUser',
    args: address ? [address] : undefined,
    query: { enabled: Boolean(contract && isConnected && address) }
  })

  const { data: hash, isPending, writeContract } = useWriteContract()
  const { isLoading: isMining, isSuccess } = useWaitForTransactionReceipt({ hash })

  // FIX: Improve button logic (enabled for disconnected users to allow connection)
  const isWrongNetwork = isConnected && !onBase;
  const disabled = isConnected && (isWrongNetwork || !contract || isPending || isMining || canDo === false);

  const handleAction = () => {
    if (!isConnected) {
      openConnectModal(); 
      return;
    }
    if (isWrongNetwork) {
        openConnectModal(); 
        return;
    }
    if (!contract) return
    try {
      writeContract({
        address: contract.address,
        abi: ABI,
        functionName: 'checkIn',
        args: [''],
        chainId
      })
    } catch (e) {
      console.error(e)
      alert('Failed to send transaction')
    }
  }

  // FIX: Use useEffect for refetch to prevent render loops
  useEffect(() => {
    if (isSuccess) {
      refetchUser?.()
    }
  }, [isSuccess, refetchUser])

  const label =
    !isConnected ? 'Connect to check-in'
    : isWrongNetwork ? 'Switch to Base'
    : canDo === false ? 'Already checked-in today'
    : 'Daily check-in'

  // FIX: Calculate Real Visual Streak
  // If the gap between currentDay and lastDay > 1, the streak is broken visually.
  const rawStreak = userData?.[1] ? Number(userData[1]) : 0;
  const lastDay = userData?.[0] ? Number(userData[0]) : 0;
  const today = currentDay ? Number(currentDay) : 0;
  
  const isStreakBroken = canDo && (today - lastDay > 1);
  const displayStreak = isStreakBroken ? 0 : rawStreak;

  if (!CHECKIN_ADDRESS) {
    return (
      <div style={{ marginTop: 10, fontSize: 14, opacity: 0.95 }}>
        <strong>Daily check-in</strong><br/>
        <span style={{ opacity: 0.8 }}>
          Configure <code>NEXT_PUBLIC_CHECKIN_ADDRESS</code>
        </span>
      </div>
    )
  }

  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>Daily check-in</div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 8 }}>
        <button
          onClick={handleAction}
          disabled={disabled}
          style={{
            height: 36,
            padding: '0 14px',
            borderRadius: 12,
            border: '1px solid rgba(0,0,0,0.14)',
            background: (!isConnected || !disabled) ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.08)',
            cursor: disabled ? 'not-allowed' : 'pointer',
            fontWeight: 700,
            color: 'inherit'
          }}
          title={label}
          aria-label="Daily check-in"
        >
          {isPending || isMining ? 'Confirming…' : label}
        </button>
      </div>

      {isConnected && onBase && (
        <div style={{ fontSize: 14, opacity: 0.95 }}>
          Streak: <strong>{displayStreak}</strong>
          {canDo === false && <span> — Done for today ✅</span>}
        </div>
      )}
    </div>
  )
}
