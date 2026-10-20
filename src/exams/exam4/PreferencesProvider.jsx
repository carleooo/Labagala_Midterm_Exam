import { useCallback, useMemo, useState } from 'react';
import { FONT_SIZES, PreferencesContext } from './PreferencesContext.js';

export function PreferencesProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [fontSize, setFontSize] = useState(16);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'));
  }, []);

  const changeFontSize = useCallback((size) => {
    if (FONT_SIZES.includes(size)) setFontSize(size);
  }, []);

  // Memoized so consumers only re-render when a preference really changes.
  const value = useMemo(
    () => ({ theme, fontSize, toggleTheme, setFontSize: changeFontSize }),
    [theme, fontSize, toggleTheme, changeFontSize]
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}
