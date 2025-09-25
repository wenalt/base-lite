// components/DailyCheckin.jsx
import { useMemo } from 'react'
import { useAccount, useChainId, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'

// Adresse du contrat déployé (fallback sur l'ENV si tu l'ajoutes plus tard sur Vercel)
const CHECKIN_ADDRESS =
  process.env.NEXT_PUBLIC_CHECKIN_ADDRESS ||
  '0xfE482b020d5B3f87b72b493f2d7EDddcAC123613'

// ABI minimal du contrat BaseDailyCheckin (version 0.8.24)
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

  const { data: userData, refetch: refetchUser } = useReadContract({
    ...((contract || {}) ),
    functionName: 'getUser',
    args: address ? [address] : undefined,
    query: { enabled: Boolean(contract && isConnected && address) }
  })

  const { data: hash, isPending, writeContract } = useWriteContract()
  const { isLoading: isMining, isSuccess } = useWaitForTransactionReceipt({ hash })

  const disabled = !isConnected || !onBase || !contract || isPending || isMining || canDo === false

  const handleCheckIn = () => {
    if (!contract) return
    try {
      // pas de note -> on envoie une chaîne vide
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

  // Quand la tx est minée, on rafraîchit les lectures
  if (isSuccess) {
    Promise.resolve().then(() => refetchUser?.())
  }

  const label =
    !isConnected ? 'Connect your wallet'
    : !onBase ? 'Switch to Base / Base Sepolia'
    : canDo === false ? 'Already checked-in today'
    : 'Daily check-in'

  const streak = userData?.[1] ?? 0
  // const total = userData?.[2] ?? 0 // on ne l'affiche plus

  if (!CHECKIN_ADDRESS) {
    return (
      <div style={{ marginTop: 10, fontSize: 14, opacity: 0.95 }}>
        <strong>Daily check-in</strong><br/>
        <span style={{ opacity: 0.8 }}>
          Configure <code>NEXT_PUBLIC_CHECKIN_ADDRESS</code> (ou mets l’adresse en dur) puis recharge la page.
        </span>
      </div>
    )
  }

  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>Daily check-in</div>

      {/* bouton seul */}
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
            fontWeight: 700
          }}
          title={label}
          aria-label="Daily check-in"
        >
          {isPending || isMining ? 'Confirming…' : label}
        </button>
      </div>

      {/* état minimal : streak uniquement */}
      {isConnected && onBase && (
        <div style={{ fontSize: 14, opacity: 0.95 }}>
          Streak: <strong>{Number(streak)}</strong>
          {canDo === false && <span> — déjà fait aujourd’hui ✅</span>}
        </div>
      )}
    </div>
  )
}
