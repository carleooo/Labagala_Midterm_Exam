import { useEffect, useReducer } from 'react';

function loadState(storageKey, fallback, isValid) {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (raw === null) return fallback;
    const parsed = JSON.parse(raw);
    return isValid(parsed) ? parsed : fallback;
  } catch {
    // Unavailable storage or invalid JSON: start from the fallback.
    return fallback;
  }
}

/**
 * useReducer + localStorage.
 *  - loads ONCE, through useReducer's lazy initializer (not on every render)
 *  - saves after every state change, in an effect
 */
export function usePersistentReducer(reducer, initialState, storageKey, isValid = () => true) {
  const [state, dispatch] = useReducer(reducer, storageKey, (key) =>
    loadState(key, initialState, isValid)
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      // Storage may be full or blocked; the app keeps working without saving.
    }
  }, [storageKey, state]);

  return [state, dispatch];
}
