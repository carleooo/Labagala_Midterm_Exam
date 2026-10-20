import { useState } from 'react';
import { FILTERS, getCounts, getVisibleIssues, initialState, isValidIssueState, issueReducer } from './issueReducer.js';
import { usePersistentReducer } from './usePersistentReducer.js';

const STORAGE_KEY = 'issue-tracker-state-v1';
const FILTER_LABELS = { all: 'All', open: 'Open', done: 'Done' };

export default function Exam6IssueTracker() {
  const [state, dispatch] = usePersistentReducer(issueReducer, initialState, STORAGE_KEY, isValidIssueState);
  const [title, setTitle] = useState('');

  const visibleIssues = getVisibleIssues(state);
  const counts = getCounts(state);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!title.trim()) return;
    // DEBUG FIX: the title must be sent inside `payload` to match what the
    // reducer reads (action.payload.title), not as action.title.
    dispatch({ type: 'ADD_ISSUE', payload: { title } });
    setTitle('');
  };

  return (
    <section aria-labelledby="exam6-title">
      <h2 id="exam6-title">Issue Tracker State Engine</h2>

      <form className="row" onSubmit={handleSubmit}>
        <label htmlFor="issue-title">New issue</label>
        <input
          id="issue-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Describe the issue"
        />
        <button className="btn" type="submit">
          Add issue
        </button>
      </form>

      <div className="row" role="group" aria-label="Filter issues">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            type="button"
            className="btn secondary"
            aria-pressed={state.filter === filter}
            onClick={() => dispatch({ type: 'SET_FILTER', payload: { filter } })}
          >
            {FILTER_LABELS[filter]} ({counts[filter]})
          </button>
        ))}
        <button
          type="button"
          className="btn danger"
          onClick={() => dispatch({ type: 'CLEAR_DONE' })}
          disabled={counts.done === 0}
        >
          Clear done
        </button>
      </div>

      <ul className="list">
        {visibleIssues.map((issue) => (
          <li key={issue.id}>
            <input
              id={`issue-${issue.id}`}
              type="checkbox"
              checked={issue.done}
              onChange={() => dispatch({ type: 'TOGGLE_ISSUE', payload: { id: issue.id } })}
            />
            <label htmlFor={`issue-${issue.id}`} className={issue.done ? 'grow done-title' : 'grow'}>
              #{issue.id} {issue.title}
            </label>
            <button
              type="button"
              className="btn secondary"
              onClick={() => dispatch({ type: 'DELETE_ISSUE', payload: { id: issue.id } })}
              aria-label={`Delete issue ${issue.id}`}
            >
              Delete
            </button>
          </li>
        ))}
        {visibleIssues.length === 0 && <li className="muted">No issues in this view.</li>}
      </ul>

      <details>
        <summary>Debugging cases</summary>
        <ol>
          <li>
            <strong>Direct mutation.</strong> <code>issue.done = !issue.done</code> changes the existing
            object, so React (and tests comparing old and new state) cannot see a change. The reducer
            returns a new <code>issues</code> array and a new issue object where something changed.
          </li>
          <li>
            <strong>Mismatched action shape.</strong> The reducer reads <code>action.payload.title</code>,
            so dispatch must send <code>{'{ type: "ADD_ISSUE", payload: { title } }'}</code>, not{' '}
            <code>action.title</code>.
          </li>
          <li>
            <strong>Default returns undefined.</strong> A reducer returning <code>undefined</code>{' '}
            destroys the state for any unknown action. The default branch returns <code>state</code>.
          </li>
        </ol>
      </details>
    </section>
  );
}
