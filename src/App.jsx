import { useState } from 'react';
import Exam1SmartTaskCounter from './exams/Exam1SmartTaskCounter.jsx';
import Exam2LiveSearchTimer from './exams/Exam2LiveSearchTimer.jsx';
import Exam3AccessibleForm from './exams/Exam3AccessibleForm.jsx';
import Exam4Preferences from './exams/exam4/Exam4Preferences.jsx';
import Exam5ProductExplorer from './exams/Exam5ProductExplorer.jsx';
import Exam6IssueTracker from './exams/exam6/IssueTracker.jsx';

const EXAMS = [
  { id: 1, nav: 'Counter', title: 'Smart Task Counter', hook: 'useState', Component: Exam1SmartTaskCounter },
  { id: 2, nav: 'Search', title: 'Live Search and Timer', hook: 'useEffect', Component: Exam2LiveSearchTimer },
  { id: 3, nav: 'Form', title: 'Accessible Form Toolkit', hook: 'useRef + useState', Component: Exam3AccessibleForm },
  { id: 4, nav: 'Preferences', title: 'Application Preferences', hook: 'useContext', Component: Exam4Preferences },
  { id: 5, nav: 'Products', title: 'Product Explorer', hook: 'useMemo + useCallback', Component: Exam5ProductExplorer },
  { id: 6, nav: 'Issues', title: 'Issue Tracker', hook: 'useReducer + custom Hook', Component: Exam6IssueTracker },
];

/** Thin dash indicators at the bottom of the page, one per exam. */
function Pager({ activeId, onSelect }) {
  return (
    <nav className="pager" aria-label="Exam pager">
      {EXAMS.map((exam) => (
        <button
          key={exam.id}
          type="button"
          className={exam.id === activeId ? 'pager-dash active' : 'pager-dash'}
          aria-label={`Exam ${exam.id}: ${exam.title}`}
          aria-current={exam.id === activeId ? 'page' : undefined}
          onClick={() => onSelect(exam.id)}
        />
      ))}
    </nav>
  );
}

export default function App() {
  const [activeId, setActiveId] = useState(null); // null = Home
  const active = EXAMS.find((exam) => exam.id === activeId) ?? null;
  const ActiveExam = active ? active.Component : null;

  const go = (id) => {
    setActiveId(id);
    window.scrollTo(0, 0);
  };

  return (
    <div className="page">
      <header className="site-header">
        <button type="button" className="brand" onClick={() => go(null)}>
          React Hooks
        </button>

        <nav className="site-nav" aria-label="Main">
          <button
            type="button"
            className={activeId === null ? 'nav-link active' : 'nav-link'}
            aria-current={activeId === null ? 'page' : undefined}
            onClick={() => go(null)}
          >
            Home
          </button>
          {EXAMS.map((exam) => (
            <button
              key={exam.id}
              type="button"
              className={exam.id === activeId ? 'nav-link active' : 'nav-link'}
              aria-current={exam.id === activeId ? 'page' : undefined}
              onClick={() => go(exam.id)}
            >
              {exam.id}. {exam.nav}
            </button>
          ))}
        </nav>

        <span className="header-note">Midterm Practical</span>
      </header>

      {active === null ? (
        <main className="home-wrap">
          <section className="hero" aria-labelledby="hero-title">
            <div className="hero-copy">
              <h1 id="hero-title">
                <span>React Hooks</span>
                <span>practical exam</span>
              </h1>
              <p>
                Six exams in one app. Each one focuses on a single hook, from useState to useReducer.
                Pick an exam from the menu to begin.
              </p>
              <button className="btn" type="button" onClick={() => go(1)}>
                Start exam 1
              </button>
            </div>

            <ol className="hero-index" aria-label="All exams">
              {EXAMS.map((exam) => (
                <li key={exam.id}>
                  <button type="button" onClick={() => go(exam.id)}>
                    <span className="idx">{String(exam.id).padStart(2, '0')}</span>
                    <span className="idx-title">{exam.title}</span>
                    <span className="idx-hook">{exam.hook}</span>
                  </button>
                </li>
              ))}
            </ol>
          </section>
        </main>
      ) : (
        <main className="exam-wrap">
          <div className="exam-panel">
            <p className="eyebrow">
              Exam {active.id} · {active.hook}
            </p>
            <ActiveExam />
          </div>
        </main>
      )}

      <Pager activeId={activeId} onSelect={go} />
    </div>
  );
}
