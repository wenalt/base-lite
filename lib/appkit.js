// lib/appkit.js
// Safe, SSR-friendly stub (no @reown/*, no wagmi/viem).

export const wagmiConfig = null;

export const appKit = {
  open: () => {
    if (typeof window !== 'undefined') {
      console.warn('AppKit not initialized on this build.');
      alert('Connect is not available yet.');
    }
  }
};

export function initAppKit() {
  // intentionally empty for now
}
