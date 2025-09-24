// lib/appkit.js
// Minimal stub so the app builds without wagmi/viem/AppKit.
// You can swap this out later when we wire AppKit for real.

export const wagmiConfig = null;

export const appKit = {
  open: () => {
    if (typeof window !== 'undefined') {
      console.warn('AppKit not initialized yet.');
      alert('Connect is not available yet.');
    }
  }
};

// Optional helper to keep callsites neat
export const connectWallet = () => appKit.open();
