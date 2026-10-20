import { Dashboard } from './Dashboard.jsx';
import { PreferencesProvider } from './PreferencesProvider.jsx';

/**
 * Component tree required by the exam:
 *   (App) -> PreferencesProvider -> Dashboard -> Toolbar, PreferencesPanel, ArticlePreview
 * In this tabbed project this component plays the role of "App" for Exam 4.
 */
export default function Exam4Preferences() {
  return (
    <section aria-labelledby="exam4-title">
      <h2 id="exam4-title">Application Preferences</h2>

      <PreferencesProvider>
        <Dashboard />
      </PreferencesProvider>

      <details>
        <summary>Debugging cases and explanation</summary>
        <ol>
          <li>
            <strong>Consumer gets only the default value.</strong> The consumer was rendered outside{' '}
            <code>&lt;PreferencesProvider&gt;</code>, so <code>useContext</code> falls back to the
            default. Fix: wrap the tree with the provider. The default is <code>null</code> and{' '}
            <code>usePreferences</code> throws a clear error, so this mistake is caught immediately.
          </li>
          <li>
            <strong>Two separate context objects.</strong> Context matching is by object identity. A
            provider using one <code>createContext()</code> result and a consumer using another never
            connect. Fix: create it once in <code>PreferencesContext.js</code> and import it everywhere.
          </li>
          <li>
            <strong>Why intermediate props disappear.</strong> The shared state lives in the provider.
            Any descendant, at any depth, reads it with <code>useContext</code> directly, so components
            in between no longer need to accept and forward the props.
          </li>
        </ol>
      </details>
    </section>
  );
}
