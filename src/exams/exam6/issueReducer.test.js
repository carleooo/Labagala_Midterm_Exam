import { describe, expect, it } from 'vitest';
import { getCounts, getVisibleIssues, initialState, issueReducer } from './issueReducer.js';

// Freezing the input makes any accidental mutation throw (ES modules run in strict mode).
function deepFreeze(value) {
  Object.values(value).forEach((item) => {
    if (item && typeof item === 'object') deepFreeze(item);
  });
  return Object.freeze(value);
}

const sampleState = () =>
  deepFreeze({
    issues: [
      { id: 1, title: 'Fix login bug', done: false },
      { id: 2, title: 'Write docs', done: true },
      { id: 3, title: 'Refactor header', done: false },
    ],
    filter: 'all',
    nextId: 4,
  });

describe('issueReducer', () => {
  it('ADD_ISSUE appends an open issue, trims the title and increments nextId', () => {
    const before = deepFreeze({ ...initialState, issues: [] });
    const after = issueReducer(before, { type: 'ADD_ISSUE', payload: { title: '  New issue  ' } });

    expect(after).not.toBe(before);
    expect(after.issues).toEqual([{ id: 1, title: 'New issue', done: false }]);
    expect(after.nextId).toBe(2);
    expect(before.issues).toHaveLength(0); // original untouched
  });

  it('ADD_ISSUE ignores a blank title', () => {
    const before = sampleState();
    expect(issueReducer(before, { type: 'ADD_ISSUE', payload: { title: '   ' } })).toBe(before);
  });

  it('TOGGLE_ISSUE flips only the matching issue and keeps other objects', () => {
    const before = sampleState();
    const after = issueReducer(before, { type: 'TOGGLE_ISSUE', payload: { id: 1 } });

    expect(after.issues[0]).toEqual({ id: 1, title: 'Fix login bug', done: true });
    expect(after.issues[0]).not.toBe(before.issues[0]); // new object
    expect(after.issues[1]).toBe(before.issues[1]); // untouched issue reused
    expect(before.issues[0].done).toBe(false); // old object unchanged
  });

  it('CLEAR_DONE removes completed issues and keeps filter and nextId', () => {
    const before = sampleState();
    const after = issueReducer(before, { type: 'CLEAR_DONE' });

    expect(after.issues.map((issue) => issue.id)).toEqual([1, 3]);
    expect(after.filter).toBe('all');
    expect(after.nextId).toBe(4);
  });

  it('DELETE_ISSUE removes only the matching issue', () => {
    const after = issueReducer(sampleState(), { type: 'DELETE_ISSUE', payload: { id: 2 } });
    expect(after.issues.map((issue) => issue.id)).toEqual([1, 3]);
  });

  it('SET_FILTER changes the filter and rejects unknown values', () => {
    const before = sampleState();
    expect(issueReducer(before, { type: 'SET_FILTER', payload: { filter: 'done' } }).filter).toBe('done');
    expect(issueReducer(before, { type: 'SET_FILTER', payload: { filter: 'bogus' } })).toBe(before);
  });

  it('returns the existing state for unknown actions (never undefined)', () => {
    const before = sampleState();
    const after = issueReducer(before, { type: 'SOMETHING_ELSE' });
    expect(after).toBe(before);
    expect(after).not.toBeUndefined();
  });
});

describe('selectors', () => {
  it('filters visible issues and keeps counts accurate', () => {
    const state = sampleState();
    expect(getVisibleIssues({ ...state, filter: 'open' }).map((i) => i.id)).toEqual([1, 3]);
    expect(getVisibleIssues({ ...state, filter: 'done' }).map((i) => i.id)).toEqual([2]);
    expect(getCounts(state)).toEqual({ all: 3, open: 2, done: 1 });
  });
});
