import WalletCard from "../components/WalletCard";
import BadgesSection from "../components/BadgesSection";

export default function Home() {
  return (
    <div className="space-y">
      <WalletCard />

      <div className="card" style={{ marginTop: 12 }}>
        <div style={{ fontWeight: 600 }}>Zora daily drip (WIP)</div>
        <p style={{ marginTop: 6, color: "var(--muted)" }}>
          Connect on Base (8453). This section will handle your small daily ZORA distribution.
        </p>
        <button className="btn" style={{ marginTop: 10 }} disabled>Claim — coming soon</button>
      </div>

      <BadgesSection />
    </div>
  );
}
