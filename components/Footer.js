// components/Footer.js
import { useState } from 'react';

function ImageWithFallback({ sources = [], alt, style, fallback }) {
  const [idx, setIdx] = useState(0);
  const current = sources[idx];

  if (!current && fallback) return fallback;

  return (
    <img
      src={current}
      alt={alt}
      style={style}
      onError={() => setIdx((i) => i + 1)}
    />
  );
}

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
    borderRadius: 6,
    objectFit: 'cover',
    display: 'block',
    background: 'rgba(255,255,255,0.08)',
  };

  const hoverHandlers = {
    onMouseEnter: (e) => (e.currentTarget.style.opacity = 1),
    onMouseLeave: (e) => (e.currentTarget.style.opacity = 0.9),
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
        title="Base Discord"
        style={linkStyle}
        {...hoverHandlers}
      >
        <img src="/discord.png?v=3" alt="Discord" style={imgStyle} />
        <span style={{ fontSize: 12, fontWeight: 600 }}>Discord</span>
      </a>

      {/* X (Twitter) with resilient fallbacks */}
      <a
        href="https://x.com/base"
        target="_blank"
        rel="noreferrer"
        title="Base on X"
        style={linkStyle}
        {...hoverHandlers}
      >
        <ImageWithFallback
          alt="X"
          style={imgStyle}
          sources={[
            '/X.jpg?v=3',
            '/x.jpg?v=3',
            '/x.png?v=3',
            '/x.svg?v=3',
          ]}
          fallback={
            <div
              style={{
                ...imgStyle,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: 0.5,
              }}
              aria-label="X"
              title="X"
            >
              X
            </div>
          }
        />
        <span style={{ fontSize: 12, fontWeight: 600 }}>X</span>
      </a>

      {/* Guild */}
      <a
        href="https://guild.xyz/base"
        target="_blank"
        rel="noreferrer"
        title="Guild"
        style={linkStyle}
        {...hoverHandlers}
      >
        <img src="/guild.jpg?v=3" alt="Guild" style={imgStyle} />
        <span style={{ fontSize: 12, fontWeight: 600 }}>Guild</span>
      </a>
    </footer>
  );
}

