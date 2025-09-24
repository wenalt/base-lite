// components/Footer.js
export default function Footer() {
  return (
    <div style={{ textAlign: 'center', padding: 16, opacity: 0.98 }}>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
        {/* X */}
        <a
          href="https://x.com/base"
          target="_blank"
          rel="noreferrer"
          title="X / Base"
          style={chip}
        >
          <XIcon />
        </a>

        {/* Discord */}
        <a
          href="https://discord.gg/buildonbase"
          target="_blank"
          rel="noreferrer"
          title="Discord"
          style={chip}
        >
          <DiscordIcon />
        </a>

        {/* Guild (uses /public/guild.jpg) */}
        <a
          href="https://guild.xyz/base"
          target="_blank"
          rel="noreferrer"
          title="Guild — Base"
          style={{ ...chip, padding: 0, overflow: 'hidden' }}
        >
          <img
            src="/guild.jpg"
            alt="Guild — Base"
            width={36}
            height={36}
            style={{ display: 'block', width: 36, height: 36, objectFit: 'cover' }}
          />
        </a>
      </div>

      <div style={{ fontSize: 13, opacity: 0.85 }}>
        Built on Base. Questions or ideas? Hop into Discord or ping on X.
      </div>
    </div>
  )
}

const chip = {
  width: 36,
  height: 36,
  borderRadius: 10,
  border: '1px solid rgba(0,0,0,0.12)',
  background: 'rgba(255,255,255,0.92)',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  textDecoration: 'none',
  color: '#0A0D14', // icon color (currentColor)
};

/* ===== Inline SVG Icons (no /public assets needed) ===== */
function XIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      style={{ display: 'block' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.94 10.39L20.51 3H18.95L13.23 9.47L8.65 3H3.5L10.38 12.77L3.5 21H5.06L11.13 14.17L16.01 21H21.16L13.94 10.39ZM11.94 13.23L11.23 12.24L5.62 4.3H7.94L12.47 10.6L13.18 11.59L19.18 19.7H16.86L11.94 13.23Z"
        fill="currentColor"
      />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 245 240"
      fill="none"
      style={{ display: 'block' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M104.4 103.9c-5.7 0-10.2 5-10.2 11.1 0 6.1 4.6 11.1 10.2 11.1 5.7 0 10.2-5 10.2-11.1 0-6.1-4.6-11.1-10.2-11.1zm36.2 0c-5.7 0-10.2 5-10.2 11.1 0 6.1 4.6 11.1 10.2 11.1 5.7 0 10.2-5 10.2-11.1 0-6.1-4.6-11.1-10.2-11.1z"
        fill="currentColor"
      />
      <path
        d="M189.5 20h-134C41.1 20 30 31.1 30 44.6v130.7c0 13.5 11.1 24.6 25.5 24.6h109.2l-5.1-17.7 12.3 11.4 11.6 10.7 20.9 18.7V44.6C204.9 31.1 193.8 20 179.4 20h10.1zM163 146.1s-3.4-4.1-6.2-7.7c12.3-3.5 17-11.4 17-11.4-3.8 2.5-7.4 4.3-10.6 5.5-4.6 1.9-9 3.1-13.3 3.8-8.8 1.6-16.9 1.2-23.8-.1-5.2-1-9.7-2.3-13.4-3.8-2.1-.8-4.4-1.8-6.7-3.1-.3-.2-.6-.3-.9-.5-.2-.1-.4-.2-.5-.3-.2-.1-.3-.2-.4-.2-.2-.1-.3-.2-.3-.2s4.5 7.6 16.5 11.2c-2.8 3.6-6.3 7.9-6.3 7.9-21-0.7-28.9-14.5-28.9-14.5 0-30.7 13.7-55.6 13.7-55.6 13.7-10.3 26.7-10 26.7-10l0.9 1.1c-17.1 4.9-25 12.3-25 12.3s2.1-1.2 5.7-2.8c10.4-4.6 18.6-5.9 22-6.2 0.6-0.1 1.2-0.2 1.8-0.2 6.4-0.8 13.6-1 21.1-0.2 9.9 1.1 20.5 3.9 31.3 9.6 0 0-7.5-7.1-23.7-12l1.3-1.5s13 0 26.7 10c0 0 13.7 24.9 13.7 55.6 0 0-8 13.8-29 14.5z"
        fill="currentColor"
      />
    </svg>
  );
}
