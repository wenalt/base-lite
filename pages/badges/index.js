import Link from "next/link";
import { BADGES } from "../../lib/badges";

export default function BadgesPage() {
  return (
    <div className="card" style={{ marginTop: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: 600 }}>Badges</div>
        <div style={{ color: "var(--muted)", fontSize: 12 }}>Guides for each badge</div>
      </div>

      <div style={{ marginTop: 12 }}>
        {BADGES.map((b) => (
          <Link key={b.id} href={`/badges/${b.id}`} legacyBehavior>
            <a className="card" style={{ display: "block", marginTop: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <img src={b.image} alt="" width={40} height={40} style={{ borderRadius: 8 }} />
                <div>
                  <div style={{ fontWeight: 600 }}>{b.title}</div>
                  <div style={{ color: "var(--muted)", fontSize: 12 }}>{b.chain}</div>
                </div>
              </div>
              <p style={{ marginTop: 8, color: "var(--muted)" }}>{b.summary}</p>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}
