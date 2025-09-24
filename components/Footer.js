// components/Footer.js
export default function Footer() {
  const linkStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 10px',
    borderRadius: 10,
    textDecoration: 'none',
    color: 'inherit',
    opacity: 0.9,
    border: '1px solid rgba(255,255,255,0.15)',
    background: 'rgba(255,255,255,0.06)',
  };

  const imgStyle = {
    width: 20,
    height: 20,
    borderRadius: 6,          // soft round so JPG/PNG feel consistent
    objectFit: 'cover',
    display: 'block',
  };

  return (
    <footer
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        gap: 10,
        padding: 14,
      }}
    >
      <a
        href="https://discord.gg/buildonbase"
        target="_blank"
        rel="noreferrer"
        title="Base Discord"
        style={linkStyle}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.9)}
      >
        <img src="/discord.png?v=2" alt="Discord" style={imgStyle} />
        <span style={{ fontSize: 12, fontWeight: 600 }}>Discord</span>
      </a>

      <a
        href="https://x.com/base"
        target="_blank"
        rel="noreferrer"
        title="Base on X"
        style={linkStyle}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.9)}
      >
        <img src="/X.jpg?v=2" alt="X" style={imgStyle} />
        <span style={{ fontSize: 12, fontWeight: 600 }}>X</span>
      </a>

      <a
        href="https://guild.xyz/base"
        target="_blank"
        rel="noreferrer"
        title="Guild"
        style={linkStyle}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.9)}
      >
        <img src="/guild.jpg?v=2" alt="Guild" style={imgStyle} />
        <span style={{ fontSize: 12, fontWeight: 600 }}>Guild</span>
      </a>
    </footer>
  );
}
