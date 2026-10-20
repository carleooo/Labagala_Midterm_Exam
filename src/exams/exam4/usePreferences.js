import { useContext } from 'react';
import { PreferencesContext } from './PreferencesContext.js';

/** Custom access Hook: returns the preferences or throws a clear error. */
export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (context === null) {
    throw new Error(
      'usePreferences must be used inside <PreferencesProvider>. Wrap the component tree with the provider.'
    );
  }
  return context;
}
