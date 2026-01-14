// components/ConnectButton.jsx
export default function ConnectButton() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <appkit-network-button />
      <appkit-account-button />
    </span>
  )
}
