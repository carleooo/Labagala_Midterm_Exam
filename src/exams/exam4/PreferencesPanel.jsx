import { FONT_SIZES } from './PreferencesContext.js';
import { usePreferences } from './usePreferences.js';

export function PreferencesPanel() {
  const { theme, fontSize, toggleTheme, setFontSize } = usePreferences();

  return (
    <div className="panel">
      <h3 style={{ marginTop: 0 }}>Preferences</h3>
      <div className="row">
        <span>Theme:</span>
        <button className="btn secondary" type="button" onClick={toggleTheme} aria-pressed={theme === 'dark'}>
          Dark mode {theme === 'dark' ? 'on' : 'off'}
        </button>
      </div>
      <div className="row" role="group" aria-label="Font size">
        <span>Font size:</span>
        {FONT_SIZES.map((size) => (
          <button
            key={size}
            className="btn secondary"
            type="button"
            aria-pressed={fontSize === size}
            onClick={() => setFontSize(size)}
          >
            {size}px
          </button>
        ))}
      </div>
    </div>
  );
}
