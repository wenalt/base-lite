// Minimal stub so pages/index.js can import appKit without errors.
// Replace later with your real wallet/connect logic.

export const appKit = {
  open: () => {
    if (typeof window !== 'undefined') {
      alert('Connect coming soon');
    }
  }
};
