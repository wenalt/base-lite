// components/Card.js
export default function Card({ isDark, title, description, children }) {
  const cardStyle = {
    width: '100%',
    maxWidth: 1100,
    margin: '10px auto 0',
    padding: '18px 14px',
    borderRadius: 16,
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.16)'}`,
    background: isDark ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.20)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.20)',
    backdropFilter: 'blur(8px)',
    textAlign: 'center'
  };

  return (
    <section style={{ width: '100%' }}>
      <div style={cardStyle}>
        {title && <div style={{ fontWeight: 800, marginBottom: 6 }}>{title}</div>}
        {description && <div style={{ opacity: 0.9, marginBottom: 12 }}>{description}</div>}
        {children}
      </div>
    </section>
  );
}
