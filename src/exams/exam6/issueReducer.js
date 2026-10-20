export const FILTERS = ['all', 'open', 'done'];

export const initialState = {
  issues: [],
  filter: 'all',
  nextId: 1,
};

/**
 * Pure, immutable reducer.
 *  - never mutates `state` or any issue object
 *  - unknown actions return the existing state (never undefined)
 *
 * Action shapes (every action with data carries it in `payload`):
 *   { type: 'ADD_ISSUE',    payload: { title } }
 *   { type: 'TOGGLE_ISSUE', payload: { id } }
 *   { type: 'DELETE_ISSUE', payload: { id } }
 *   { type: 'SET_FILTER',   payload: { filter } }
 *   { type: 'CLEAR_DONE' }
 */
export function issueReducer(state, action) {
  switch (action.type) {
    case 'ADD_ISSUE': {
      const title = (action.payload?.title ?? '').trim();
      if (!title) return state; // ignore blank titles
      return {
        ...state,
        issues: [...state.issues, { id: state.nextId, title, done: false }],
        nextId: state.nextId + 1,
      };
    }

    case 'TOGGLE_ISSUE':
      return {
        ...state,
        // new array AND a new object for the changed issue; others are reused
        issues: state.issues.map((issue) =>
          issue.id === action.payload.id ? { ...issue, done: !issue.done } : issue
        ),
      };

    case 'DELETE_ISSUE':
      return {
        ...state,
        issues: state.issues.filter((issue) => issue.id !== action.payload.id),
      };

    case 'SET_FILTER': {
      const { filter } = action.payload;
      if (!FILTERS.includes(filter) || filter === state.filter) return state;
      return { ...state, filter };
    }

    case 'CLEAR_DONE':
      return { ...state, issues: state.issues.filter((issue) => !issue.done) };

    default:
      // DEBUG FIX: a missing/undefined default would wipe the whole state.
      return state;
  }
}

/** Issues to display for the current filter. */
export function getVisibleIssues(state) {
  if (state.filter === 'open') return state.issues.filter((issue) => !issue.done);
  if (state.filter === 'done') return state.issues.filter((issue) => issue.done);
  return state.issues;
}

/** Counts for the All / Open / Done tabs (always based on all issues). */
export function getCounts(state) {
  const done = state.issues.filter((issue) => issue.done).length;
  return { all: state.issues.length, open: state.issues.length - done, done };
}

/** Guards against corrupted or old data coming back from localStorage. */
export function isValidIssueState(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    Array.isArray(value.issues) &&
    value.issues.every(
      (issue) =>
        issue &&
        typeof issue.id === 'number' &&
        typeof issue.title === 'string' &&
        typeof issue.done === 'boolean'
    ) &&
    FILTERS.includes(value.filter) &&
    typeof value.nextId === 'number'
  );
}
