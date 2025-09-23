import Link from "next/link";
import { BADGES } from "../lib/badges";

export default function BadgesSection() {
  return (
    <div className="card" style={{ marginTop: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ fontWeight: 600 }}>Badges</div>
        <Link href="/badges" legacyBehavior><a className="btn">Open</a></Link>
      </div>
      <p style={{ marginTop: 6, color: "var(--muted)" }}>
        Explore Base-friendly badges. Each card links to a short guide.
      </p>
    </div>
  );
}
