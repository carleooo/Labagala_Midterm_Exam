import { useState } from 'react';

/**
 * Exam 1 — Smart Task Counter (useState)
 *
 * Only two pieces of state exist: `count` and `target`.
 * `status` and `targetReached` are DERIVED during render, so they can never
 * get out of sync with the state they come from.
 */
export default function Exam1SmartTaskCounter() {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(5);

  // Derived values (no extra useState)
  const targetReached = count >= target;
  const status = targetReached ? 'Target reached' : count === 0 ? 'Not started' : 'In progress';
  const statusClass = targetReached ? 'reached' : count === 0 ? '' : 'in-progress';

  const increment = () => setCount((c) => c + 1);
  const decrement = () => setCount((c) => Math.max(0, c - 1)); // never negative
  const reset = () => setCount(0);

  // Plus two: two QUEUED functional updates. Each updater receives the result
  // of the previous queued update, so the click adds exactly two.
  const addTwo = () => {
    setCount((c) => c + 1);
    setCount((c) => c + 1);
  };

  // REQUIRED DEBUGGING CASE (kept for the demo — this is the broken version).
  // Both calls read the same captured `count` from this render, so they both
  // queue "set count to count + 1" and the result is only +1.
  const buggyAddTwo = () => {
    setCount(count + 1);
    setCount(count + 1);
  };

  const changeTarget = (event) => {
    const next = Math.floor(Number(event.target.value));
    if (next >= 1) setTarget(next); // target must stay a positive whole number
  };

  const loadCase = (nextTarget, nextCount) => {
    setTarget(nextTarget);
    setCount(nextCount);
  };

  return (
    <section aria-labelledby="exam1-title">
      <h2 id="exam1-title">Smart Task Counter</h2>

      <div className="card">
        <div className="big-number" aria-live="polite">
          {count} <span className="muted">/ {target}</span>
        </div>
        <span className={`status ${statusClass}`} data-testid="status">
          {status}
        </span>
      </div>

      <div className="row">
        <label htmlFor="target-input">Target tasks:</label>
        <input
          id="target-input"
          type="number"
          min="1"
          step="1"
          value={target}
          onChange={changeTarget}
        />
      </div>

      <div className="row">
        <button className="btn" type="button" onClick={increment} disabled={targetReached}>
          Increment
        </button>
        <button className="btn secondary" type="button" onClick={decrement} disabled={count === 0}>
          Decrement
        </button>
        <button className="btn" type="button" onClick={addTwo} disabled={targetReached}>
          +2
        </button>
        <button className="btn danger" type="button" onClick={reset}>
          Reset
        </button>
      </div>

      <h3>Validation cases</h3>
      <div className="row">
        <button className="btn secondary" type="button" onClick={() => loadCase(5, 0)}>
          Target 5, count 0
        </button>
        <button className="btn secondary" type="button" onClick={() => loadCase(5, 4)}>
          Count 4 (then press +2)
        </button>
        <button className="btn secondary" type="button" onClick={() => loadCase(5, 0)}>
          Count 0 (then press Decrement)
        </button>
        <button className="btn secondary" type="button" onClick={() => loadCase(5, 5)}>
          Target reached (then press Reset)
        </button>
      </div>

      <details>
        <summary>Debugging case: why the old handler only adds one</summary>
        <pre>
          <code>{`const addTwo = () => {
  setCount(count + 1);
  setCount(count + 1);
};`}</code>
        </pre>
        <p>
          React gives each render a <strong>snapshot</strong> of state. Inside this render{' '}
          <code>count</code> is a fixed number (say 0), so both calls queue "set the count to 1". The
          second call does not see the first. The fix is the functional form,{' '}
          <code>setCount(c =&gt; c + 1)</code>, because React feeds each queued updater the result of
          the previous one.
        </p>
        <div className="row">
          <button className="btn secondary" type="button" onClick={buggyAddTwo} disabled={targetReached}>
            Buggy +2 (demo: adds only 1)
          </button>
        </div>
      </details>
    </section>
  );
}
