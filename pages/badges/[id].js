import { useRouter } from "next/router";
import { BADGES } from "../../lib/badges";

export default function BadgeGuide() {
  const { query } = useRouter();
  const badge = BADGES.find((b) => b.id === query.id);

  if (!badge) return <div className="card">Badge not found.</div>;

  return (
    <div className="card" style={{ marginTop: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <img src={badge.image} alt="" width={48} height={48} style={{ borderRadius: 10 }} />
        <div>
          <div style={{ fontWeight: 700, fontSize: 20 }}>{badge.title}</div>
          <div style={{ color: "var(--muted)", fontSize: 12 }}>{badge.chain}</div>
        </div>
      </div>

      <p style={{ marginTop: 8 }}>{badge.summary}</p>

      <h3 style={{ marginTop: 14 }}>Why</h3>
      <p style={{ color: "var(--muted)" }}>{badge.why}</p>

      <h3 style={{ marginTop: 14 }}>How</h3>
      <ol style={{ paddingLeft: 20 }}>
        {badge.how.map((h, i) => <li key={i} style={{ marginTop: 6 }}>{h}</li>)}
      </ol>

      <h3 style={{ marginTop: 14 }}>Tiers</h3>
      <ul style={{ paddingLeft: 20 }}>
        {badge.tiers.map((t, i) => <li key={i} style={{ marginTop: 6 }}>{t.label}</li>)}
      </ul>

      {!!badge.external?.length && (
        <>
          <h3 style={{ marginTop: 14 }}>Links</h3>
          <ul style={{ paddingLeft: 20 }}>
            {badge.external.map((e, i) => (
              <li key={i} style={{ marginTop: 6 }}>
                <a href={e.href} target="_blank" rel="noreferrer">{e.label}</a>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
