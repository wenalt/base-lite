"use client";
import { appKit } from "../lib/appkit";
import { useAccount, useDisconnect } from "wagmi";

export default function WalletCard() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ fontWeight: 600 }}>Wallet</div>
        {!isConnected ? (
          <button className="btn" onClick={() => appKit.open()}>Connect</button>
        ) : (
          <button className="btn" onClick={() => disconnect()}>Disconnect</button>
        )}
      </div>

      {isConnected && (
        <div style={{ marginTop: 8, color: "var(--muted)", wordBreak: "break-all" }}>
          {address}
        </div>
      )}
    </div>
  );
}
