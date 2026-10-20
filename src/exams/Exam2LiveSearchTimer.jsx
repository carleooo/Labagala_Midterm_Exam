import { useEffect, useState } from 'react';

export const USERS = [
  { id: 1, name: 'Ana Cruz', role: 'Developer' },
  { id: 2, name: 'Ben Lim', role: 'Designer' },
  { id: 3, name: 'Cara Yu', role: 'Tester' },
  { id: 4, name: 'Dan Go', role: 'Developer' },
];

const SEARCH_DELAY_MS = 400;

/** Session timer — interval is cleaned up when the component unmounts. */
function SessionTimer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    // DEBUG FIX: use the functional updater. `setSeconds(seconds + 1)` would
    // capture seconds === 0 from the first render (the effect only runs once),
    // so the timer would be stuck at 1.
    const intervalId = setInterval(() => setSeconds((s) => s + 1), 1000);

    // Cleanup: stop the interval on unmount (and before StrictMode remounts),
    // so no duplicate timer keeps running after navigation.
    return () => clearInterval(intervalId);
  }, []);

  return (
    <p className="card" aria-live="off">
      Session elapsed: <strong>{seconds}</strong> second{seconds === 1 ? '' : 's'}
    </p>
  );
}

/** Searchable list with a simulated, cancellable search request. */
function UserSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(USERS);
  const [searching, setSearching] = useState(false);

  // Remember the original title and restore it when this component unmounts.
  // Declared BEFORE the title effect so it captures the untouched title.
  useEffect(() => {
    const originalTitle = document.title;
    return () => {
      document.title = originalTitle;
    };
  }, []);

  // Delayed "search request". Depends ONLY on `query` and writes to a different
  // state (`results`), so it cannot retrigger itself.
  useEffect(() => {
    setSearching(true);

    const timeoutId = setTimeout(() => {
      const q = query.trim().toLowerCase();
      setResults(
        USERS.filter(
          (user) => user.name.toLowerCase().includes(q) || user.role.toLowerCase().includes(q)
        )
      );
      setSearching(false);
    }, SEARCH_DELAY_MS);

    // Cleanup: runs before the next effect and on unmount. It cancels the
    // previous pending search so an outdated result can never appear.
    return () => clearTimeout(timeoutId);
  }, [query]);

  // Synchronize an external system (the document title) with the result count.
  useEffect(() => {
    document.title = `${results.length} result${results.length === 1 ? '' : 's'} visible`;
  }, [results.length]);

  return (
    <div>
      <div className="field">
        <label htmlFor="user-query">Search users (name or role)</label>
        <input
          id="user-query"
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try “dev” or “ana”"
        />
      </div>

      <p className="muted" role="status">
        {searching ? 'Searching…' : `${results.length} result${results.length === 1 ? '' : 's'}`}
      </p>

      <ul className="list">
        {results.map((user) => (
          <li key={user.id}>
            <span className="grow">{user.name}</span>
            <span className="muted">{user.role}</span>
          </li>
        ))}
        {!searching && results.length === 0 && <li className="muted">No users match.</li>}
      </ul>
    </div>
  );
}

export default function Exam2LiveSearchTimer() {
  const [showTimer, setShowTimer] = useState(true);

  return (
    <section aria-labelledby="exam2-title">
      <h2 id="exam2-title">Live Search and Timer</h2>

      <div className="row">
        <button className="btn secondary" type="button" onClick={() => setShowTimer((v) => !v)}>
          {showTimer ? 'Unmount timer' : 'Mount timer'}
        </button>
        <span className="muted">Unmounting runs the interval cleanup; mounting again restarts at 0.</span>
      </div>
      {showTimer && <SessionTimer />}

      <UserSearch />

      <details>
        <summary>Debugging cases and cleanup explanation</summary>
        <ol>
          <li>
            <strong>Effect that updates its own dependency.</strong> An effect like{' '}
            <code>{'useEffect(() => setResults(f(results)), [results])'}</code> changes{' '}
            <code>results</code>, which reruns the effect forever. Fix: depend only on the true input
            (<code>query</code>) and compute the output from it, never from the state being written.
          </li>
          <li>
            <strong>Timer stuck at 1.</strong> The interval callback closed over the first-render value{' '}
            <code>seconds = 0</code>. Fix: <code>setSeconds(s =&gt; s + 1)</code>.
          </li>
          <li>
            <strong>Cleanup functions.</strong> The search effect returns{' '}
            <code>clearTimeout(timeoutId)</code>; React calls it before the next run (when the query
            changes) and on unmount, cancelling the stale search. The timer effect returns{' '}
            <code>clearInterval(intervalId)</code>, so the interval stops on unmount and a remount never
            leaves two timers running.
          </li>
        </ol>
      </details>
    </section>
  );
}
