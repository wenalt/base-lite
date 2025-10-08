// components/BadgesSection.js
import React, { useMemo, useState } from "react";


const BADGES = [
  {
    id: "creator-score",
    title: "Creator Score",
    chain: "Superchain",
    image: "/badges/csbadge.png",
    summary:
      "Grow a public reputation signal built from your onchain activity, identity links, and contributions verified by Talent Protocol.",
    why:
      "Creator Score helps others quickly assess the credibility and consistency of a wallet across ecosystems. A stronger score can unlock discovery, opportunities and program eligibility.",
    how: [
      "Create or log in to your Talent Protocol profile and connect your wallet(s).",
      "Complete your profile (bio, socials) and link relevant onchain identities (e.g., Base name).",
      "Keep building: ship public work, participate onchain, and maintain activity—your score updates over time.",
    ],
    tiers: [
      { label: "Reach 20+ Creator Score" },
      { label: "Reach 40+ Creator Score" },
      { label: "Reach 60+ Creator Score" },
      { label: "Reach 80+ Creator Score" },
      { label: "Reach 100+ Creator Score" },
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
];

// ---------- UI helpers ----------
const btnStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "10px 14px",
  borderRadius: 12,
  border: 0,
  cursor: "pointer",
  textDecoration: "none",
};

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
  border: "1px solid var(--ring)",
  background: "var(--card)",
  fontSize: 12,
  marginLeft: 8,
};
const summary = { margin: "4px 0 0", color: "var(--muted)", fontSize: 14, textAlign: "center" };
const actions = { display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginTop: 8 };

const modalRoot = {
  position: "fixed",
  inset: 0,
  zIndex: 80,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 16,
};
const backdrop = { position: "absolute", inset: 0, background: "rgba(0,0,0,.42)" };
const dialog = {
  position: "relative",
  width: "100%",
  maxWidth: 680,
  background: "var(--card)",
  border: "1px solid var(--ring)",
  borderRadius: 16,
  boxShadow: "0 10px 30px rgba(0,0,0,.3)",
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
const meta = { color: "var(--muted)", fontSize: 13 };

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
              <button className="btn" onClick={() => setOpenId(b.id)}>Details</button>
              {b.external?.map((x) => (
                <a key={x.href} className="btn" href={x.href} target="_blank" rel="noreferrer">
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
                            <span style={{ color: "var(--muted)", fontSize: 12 }}>
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
                      <a key={x.href} className="btn" href={x.href} target="_blank" rel="noreferrer">
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
