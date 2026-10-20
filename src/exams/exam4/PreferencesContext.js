import { createContext } from 'react';

/**
 * The ONE context object for the whole exam. Every consumer reaches it through
 * usePreferences, and the provider imports it from this same module.
 *
 * Debug note: if the provider and a consumer each called createContext() in
 * their own file, they would be two unrelated contexts and the consumer would
 * only ever see the default value. Creating it once here and importing it
 * everywhere prevents that.
 *
 * The default is `null` (not a fake preferences object) so that a missing
 * provider is detected instead of silently using wrong defaults.
 */
export const PreferencesContext = createContext(null);

export const FONT_SIZES = [14, 16, 18];
