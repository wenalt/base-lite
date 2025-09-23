// components/Footer.js
export default function Footer() {
  return (
    <div style={{
      marginTop: 28,
      padding: '18px 0 26px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 12
    }}>
      <div style={{ display: 'flex', gap: 10 }}>
        <a href="https://x.com/base" target="_blank" rel="noreferrer"
           title="X / Base"
           style={iconStyle}>𝕏</a>
        <a href="https://discord.gg/buildonbase" target="_blank" rel="noreferrer"
           title="Discord / Build on Base"
           style={iconStyle}>💬</a>
      </div>
      <div style={{ opacity: 0.8, fontSize: 13, textAlign: 'center' }}>
        Questions or suggestions? Ping me on Farcaster or join Base Discord.
      </div>
    </div>
  )
}

const iconStyle = {
  width: 36,
  height: 36,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 10,
  background: 'rgba(0,0,0,0.08)',
  border: '1px solid rgba(0,0,0,0.12)',
  textDecoration: 'none',
  color: 'inherit',
  fontWeight: 700
}

