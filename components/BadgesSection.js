// components/BadgesSection.js
import React, { useMemo, useState } from "react";

/**
 * Minimal, framework-safe version.
 * - No styled-jsx / next/image
 * - Uses Base Lite pill styles for buttons
 * - Opaque dialog so it's readable over the page
 */

// ---------- Data ----------
const BADGES = [
  {
    id: "creator-score",
    title: "Creator Score",
    chain: "Superchain",
    image: "/badges/csbadge.png",
    summary:
      "A reputation metric that quantifies your creative contributions across platforms using verified data.",
    why:
      "Creator Score is designed to recognize authentic creators by evaluating consistent quality output and engagement, not just popularity. It helps platforms and communities discover creators based on impact and consistency.",
    how: [
      "Complete your Talent Protocol profile and connect your primary wallet(s).",
      "Link your social & content accounts (GitHub, Farcaster/Twitter, blogs, etc.) so data points can be verified.",
      "Publish original work regularly (posts, articles, repos, media) to accumulate measurable creative signals.",
      "Earnings and attributions on creator platforms (e.g., mints/sales, tips) further strengthen your score.",
    ],
    tiers: [
      { label: "Reach Creator Score ≥ 10" },
      { label: "Reach Creator Score ≥ 40" },
      { label: "Reach Creator Score ≥ 80" },
      { label: "Reach Creator Score ≥ 120" },
    ],
    external: [
      { label: "Open Creator Score", href: "https://www.creatorscore.app/" },
      { label: "Open Talent Protocol", href: "https://app.talentprotocol.com/" },
      {
        label: "Creator Score (docs)",
        href: "https://docs.talentprotocol.com/docs/protocol-concepts/scoring-systems/creator-score",
      },
    ],
  },

  // NEW — Builder Score
  {
    id: "builder-score",
    title: "Builder Score",
    chain: "Superchain",
    image: "/badges/bsbadge.png",
    summary:
      "A public reputation signal for builders based on verifiable activity: code, onchain actions, contributions, identity links, and profile completeness.",
    why:
      "Builder Score helps others quickly assess a wallet’s credibility and consistency across ecosystems. A higher score unlocks discovery, opportunities, and eligibility in programs and leaderboards.",
    how: [
      "Create or log in to your Talent Protocol profile and connect your wallet(s).",
      "Complete your profile (bio, socials) and link relevant identities (e.g., Base name, GitHub).",
      "Build in public: ship code/products, participate onchain, and keep your profile updated—your score improves over time.",
    ],
    tiers: [
      { label: "Reach Builder Score ≥ 30" },
      { label: "Reach Builder Score ≥ 60" },
      { label: "Reach Builder Score ≥ 90" },
    ],
    external: [
      { label: "Open Talent Protocol", href: "https://app.talentprotocol.com/" },
    ],
  },
];

// ---------- UI helpers ----------
const wrap = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 10,
};

const item = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 12,
  flexWrap: "wrap",
};

const imgStyle = { borderRadius: 12, width: 64, height: 64, objectFit: "cover" };
const name = { margin: 0, fontSize: 16, fontWeight: 800 };
const chip = {
  display: "inline-flex",
  alignItems: "center",
  padding: "2px 8px",
  borderRadius: 999,
  border: "1px solid var(--card-border, rgba(255,255,255,0.18))",
  background: "var(--card-bg, rgba(16,24,48,0.30))",
  fontSize: 12,
  marginLeft: 8,
};
const summary = { margin: "4px 0 0", color: "var(--muted, #c9d1d9)", fontSize: 14, textAlign: "center" };

// pill buttons, cohérents avec Base Lite
const pillBtn = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  height: 36,
  padding: "0 12px",
  borderRadius: 12,
  fontSize: 14,
  fontWeight: 600,
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(255,255,255,0.10)",
  color: "inherit",
  textDecoration: "none",
  cursor: "pointer",
};

const actions = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
  justifyContent: "center",
  marginTop: 8,
};

// Modale: fond d’écran + boîte opaque
const modalRoot = {
  position: "fixed",
  inset: 0,
  zIndex: 999, // au-dessus du reste
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 16,
};
const backdrop = { position: "absolute", inset: 0, background: "rgba(0,0,0,.6)" };
const dialog = {
  position: "relative",
  width: "100%",
  maxWidth: 720,
  // OPAQUE + lisible en dark/blue
  background: "rgba(16,24,48,0.96)",
  color: "#fff",
  border: "1px solid rgba(255,255,255,0.18)",
  borderRadius: 16,
  boxShadow: "0 20px 50px rgba(0,0,0,.45)",
};
const dhead = { display: "flex", alignItems: "center", gap: 10, padding: "14px 16px 0" };
const dtitle = { margin: 0, fontSize: 18, fontWeight: 800 };
const closeBtn = {
  marginLeft: "auto",
  background: "transparent",
  border: 0,
  fontSize: 24,
  lineHeight: 1,
  cursor: "pointer",
  color: "inherit",
};
const dbody = { padding: "12px 16px 16px", fontSize: 15, lineHeight: 1.55 };
const meta = { color: "rgba(255,255,255,0.75)", fontSize: 13 };

// ---------- Component ----------
export default function BadgesSection() {
  const data = useMemo(() => BADGES, []);
  const [openId, setOpenId] = useState(null);
  const openSpec = useMemo(() => data.find((b) => b.id === openId) || null, [data, openId]);

  return (
    <div style={wrap}>
      {data.map((b) => (
        <div key={b.id} style={item}>
          <img src={b.image} alt={b.title} style={imgStyle} />
          <div style={{ maxWidth: 640 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <h3 style={name}>{b.title}</h3>
              <span style={chip}>{b.chain}</span>
            </div>
            <p style={summary}>{b.summary}</p>
            <div style={actions}>
              <button style={pillBtn} onClick={() => setOpenId(b.id)}>
                Details
              </button>
              {b.external?.map((x) => (
                <a
                  key={x.href}
                  href={x.href}
                  target="_blank"
                  rel="noreferrer"
                  style={pillBtn}
                >
                  {x.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      ))}

      {openSpec && (
        <div style={modalRoot} role="dialog" aria-modal="true">
          <div style={backdrop} onClick={() => setOpenId(null)} />
          <div style={dialog}>
            <div style={dhead}>
              <img src={openSpec.image} alt="" width={28} height={28} style={{ borderRadius: 8 }} />
              <h4 style={dtitle}>{openSpec.title}</h4>
              <button style={closeBtn} onClick={() => setOpenId(null)} aria-label="Close">
                ×
              </button>
            </div>

            <div style={dbody}>
              <div style={meta}>Chain: {openSpec.chain}</div>

              <section>
                <h5 style={{ margin: "12px 0 6px", fontSize: 15 }}>Why it matters</h5>
                <p style={{ margin: 0 }}>{openSpec.why}</p>
              </section>

              <section>
                <h5 style={{ margin: "12px 0 6px", fontSize: 15 }}>How to progress</h5>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {openSpec.how.map((li, i) => (
                    <li key={i}>{li}</li>
                  ))}
                </ul>
              </section>

              {openSpec.tiers && (
                <section>
                  <h5 style={{ margin: "12px 0 6px", fontSize: 15 }}>Tiers</h5>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {openSpec.tiers.map((t, i) => (
                      <li
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          margin: "6px 0",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-block",
                            width: 6,
                            height: 6,
                            borderRadius: 999,
                            background: "currentColor",
                            opacity: 0.75,
                          }}
                        />
                        <span>
                          {t.label}
                          {t.hint ? (
                            <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }}>
                              {" "}
                              – {t.hint}
                            </span>
                          ) : null}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {openSpec.external && openSpec.external.length > 0 && (
                <section>
                  <h5 style={{ margin: "12px 0 6px", fontSize: 15 }}>Links</h5>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
                    {openSpec.external.map((x) => (
                      <a key={x.href} href={x.href} target="_blank" rel="noreferrer" style={pillBtn}>
                        {x.label}
                      </a>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
