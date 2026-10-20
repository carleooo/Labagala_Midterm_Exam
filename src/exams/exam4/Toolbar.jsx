import { usePreferences } from './usePreferences.js';

export function Toolbar() {
  const { theme, toggleTheme } = usePreferences();

  return (
    <div className="toolbar">
      <strong>Dashboard ({theme} theme)</strong>
      <button className="btn secondary" type="button" onClick={toggleTheme}>
        Switch to {theme === 'light' ? 'dark' : 'light'} theme
      </button>
    </div>
  );
}
