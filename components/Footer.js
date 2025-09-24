// components/Footer.js
export default function Footer() {
  const btn = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.15)',
    background: 'rgba(255,255,255,0.06)',
    backdropFilter: 'blur(6px)',
    cursor: 'pointer',
    transition: 'opacity .2s ease',
    opacity: 0.95,
  };

  const img = {
    width: 20,
    height: 20,
    display: 'block',
    objectFit: 'cover',
    borderRadius: 6,
    background: 'rgba(255,255,255,0.08)',
  };

  const hoverHandlers = {
    onMouseEnter: (e) => (e.currentTarget.style.opacity = 1),
    onMouseLeave: (e) => (e.currentTarget.style.opacity = 0.95),
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
      {/* Discord */}
      <a
        href="https://discord.gg/buildonbase"
        target="_blank"
        rel="noreferrer"
        style={btn}
        aria-label="Discord"
        {...hoverHandlers}
      >
        <img src="/discord.png?v=4" alt="Discord" style={img} />
      </a>

      {/* X */}
      <a
        href="https://x.com/base"
        target="_blank"
        rel="noreferrer"
        style={btn}
        aria-label="X"
        {...hoverHandlers}
      >
        <img src="/x.jpg?v=4" alt="X" style={img} />
      </a>

      {/* Guild */}
      <a
        href="https://guild.xyz/base"
        target="_blank"
        rel="noreferrer"
        style={btn}
        aria-label="Guild"
        {...hoverHandlers}
      >
        <img src="/guild.jpg?v=4" alt="Guild" style={img} />
      </a>
    </footer>
  );
}
