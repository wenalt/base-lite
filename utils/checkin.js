// utils/checkin.js
//
// Simple, timezone-safe daily check-in with streak tracking.
// Uses UTC calendar days to avoid "24h vs midnight" issues.

const STORAGE_KEY = 'base-lite:checkin:v1';

// --- helpers -------------------------------------------------------------

function todayUTC() {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

function toKey(dateObj) {
  // YYYY-MM-DD (UTC)
  const y = dateObj.getUTCFullYear();
  const m = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function fromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // little guardrails
    if (typeof parsed.streak !== 'number' || typeof parsed.total !== 'number') return null;
    return parsed;
  } catch {
    return null;
  }
}

function toStorage(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// --- public API ----------------------------------------------------------

/**
 * Inspect the current state and return a normalized snapshot.
 * If data is missing, this returns sensible defaults (no writes).
 */
export function getCheckinState() {
  const tKey = toKey(todayUTC());
  const state = fromStorage() || {
    last: null,       // 'YYYY-MM-DD'
    streak: 0,        // consecutive days
    total: 0,         // lifetime check-ins
    history: []       // array of 'YYYY-MM-DD'
  };

  // derive convenience booleans
  const last = state.last;
  const didToday = last === tKey;

  return {
    ...state,
    todayKey: tKey,
    didToday,
  };
}

/**
 * Whether the user can check in now, and what the resulting streak would be.
 * Does not write to storage.
 */
export function canCheckIn() {
  const s = getCheckinState();

  if (s.didToday) {
    return { ok: false, reason: 'already_checked_today', previewStreak: s.streak };
  }

  if (!s.last) {
    // first ever check-in
    return { ok: true, previewStreak: 1 };
  }

  // compute distance between last day and today (in calendar days, UTC)
  const lastParts = s.last.split('-').map(n => parseInt(n, 10));
  const lastDate = new Date(Date.UTC(lastParts[0], lastParts[1] - 1, lastParts[2]));
  const oneDayMs = 24 * 60 * 60 * 1000;
  const deltaDays = Math.round((todayUTC() - lastDate) / oneDayMs);

  if (deltaDays === 1) {
    // consecutive day -> streak + 1
    return { ok: true, previewStreak: s.streak + 1 };
  }

  if (deltaDays > 1) {
    // missed at least one day -> reset to 1
    return { ok: true, previewStreak: 1, missedDays: deltaDays - 1 };
  }

  // deltaDays === 0 would have been caught by didToday
  // negative? clock skew; still allow, but treat as today done
  return { ok: false, reason: 'clock_skew', previewStreak: s.streak };
}

/**
 * Perform the daily check-in (writes storage). Returns the new state.
 * Safe to call multiple times per day (idempotent).
 */
export function doCheckIn() {
  const base = getCheckinState();
  const tKey = base.todayKey;

  // Already done today: return unchanged.
  if (base.didToday) return base;

  const verdict = canCheckIn();

  if (!verdict.ok) {
    return base; // no write if not ok
  }

  const next = {
    last: tKey,
    streak: verdict.previewStreak,
    total: base.total + 1,
    history: Array.isArray(base.history) ? [...new Set([...base.history, tKey])] : [tKey],
  };

  toStorage(next);
  return { ...next, todayKey: tKey, didToday: true };
}

/**
 * Hard reset (for debugging)
 */
export function resetCheckin() {
  localStorage.removeItem(STORAGE_KEY);
}
