import { ArticlePreview } from './ArticlePreview.jsx';
import { PreferencesPanel } from './PreferencesPanel.jsx';
import { Toolbar } from './Toolbar.jsx';
import { usePreferences } from './usePreferences.js';

/**
 * Dashboard has NO preference props. It only reads `theme` from context to
 * style itself; Toolbar, PreferencesPanel and ArticlePreview read their own.
 */
export function Dashboard() {
  const { theme } = usePreferences();

  return (
    <div className={`dashboard theme-${theme}`}>
      <Toolbar />
      <PreferencesPanel />
      <ArticlePreview />
    </div>
  );
}
