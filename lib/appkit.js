// lib/appkit.js
// Safe, SSR-friendly stub. No @reown/*, no wagmi/viem imports.
// Keeps the UI working until we wire the real client-only init.

export const wagmiConfig = null;

export const appKit = {
  open: () => {
    if (typeof window !== 'undefined') {
      console.warn('AppKit not initialized on this build.');
      alert('Connect is not available yet.');
    }
  },
};

// Optional: exported no-op you can call from pages if desired
export function initAppKit() {
  // Intentionally empty for now; we’ll replace with a client-only init later
}
