import { usePreferences } from './usePreferences.js';

export function ArticlePreview() {
  const { theme, fontSize } = usePreferences();

  return (
    <article className={`article theme-${theme}`} style={{ fontSize: `${fontSize}px` }}>
      <h3 style={{ marginTop: 0 }}>Why context beats prop drilling</h3>
      <p>
        This preview reads the theme and font size straight from context. No intermediate component
        passes preference props down, yet changing a preference anywhere updates this article instantly
        ({theme} theme, {fontSize}px).
      </p>
    </article>
  );
}
