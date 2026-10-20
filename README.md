# React Hooks Midterm Practical Exam (Exams 1–6)

**Student:** Carlo Jose R. Labagala, Cebu Institute of Technology, University

One Vite + React app. Use the top menu (Home, then Exams 1–6) or the dashes at the bottom to switch between exams. Only React Hooks are used for state (no state management library). The page uses the Poppins font from Google Fonts and falls back to system fonts when offline.

## Run

```bash
npm install
npm run dev     # open the printed local URL
npm test        # Exam 6 reducer tests
```

## Completed requirements

| Exam | Hook(s) | Completed |
|---|---|---|
| 1 Task Counter | `useState` | count/target state, Increment/Decrement/Reset (never negative), +2 with two functional updates, derived status, buttons disabled at target |
| 2 Live Search | `useEffect` | delayed search with cancel cleanup, 1 s timer with unmount cleanup, document title shows result count |
| 3 Form Toolkit | `useRef`, `useState` | controlled fields, three refs, validation messages, focus on first invalid field, previous email kept in a ref |
| 4 Preferences | `useContext` | one context + provider, theme and 14/16/18 font size without prop drilling, `usePreferences` throws outside the provider |
| 5 Product Explorer | `useMemo`, `useCallback` | 600 products, search/category/sort, memoized list and callback, `React.memo` list, complete dependency arrays |
| 6 Issue Tracker | `useReducer`, custom Hook | pure reducer with 5 actions, `usePersistentReducer` (localStorage), All/Open/Done views, 8 reducer tests |

## Test steps

1. **Exam 1:** use the validation-case buttons (target 5/count 0, count 4 then +2, count 0 then Decrement, target reached then Reset).
2. **Exam 2:** type quickly and confirm only the final results show; unmount/mount the timer and confirm one timer runs; check the tab title.
3. **Exam 3:** submit with empty or invalid fields and confirm focus order name → email → password; submit twice to see the previous email.
4. **Exam 4:** toggle the theme and font size; Dashboard and article change together.
5. **Exam 5:** open the console; typing in search logs a recompute and a list render, the unrelated counter logs neither.
6. **Exam 6:** add, toggle, filter, delete and clear issues, then refresh to confirm persistence; run `npm test`.

## Debugging cases fixed

- **Exam 1:** `setCount(count + 1)` twice reads the same captured snapshot, so only +1 happens. `setCount(c => c + 1)` gets the latest queued value.
- **Exam 2:** an effect must not depend on the state it updates; the timer uses `setSeconds(s => s + 1)` to avoid a stale value. Cleanups (`clearTimeout`, `clearInterval`) cancel stale work and stop the timer on unmount.
- **Exam 3:** mutating `ref.current` never schedules a render, so visible data uses state.
- **Exam 4:** the provider must wrap the consumer, and the provider and consumer must import the same context object. Shared state in the provider removes the intermediate props.
- **Exam 5:** added the missing `query` and `selectedId` dependencies; moved the analytics call from `useMemo` to `useEffect`.
- **Exam 6:** no state mutation (new state and issue objects), dispatch sends `payload: { title }`, and the default branch returns `state`.

## Memoization that would be unnecessary (Exam 5)

Filtering a list of about 10 items. The work takes microseconds, so the cost of `useMemo` (storing the value and comparing dependencies) outweighs the benefit.

## Known limitations

- Exam 1: +2 always adds exactly two, so it can pass the target (4 + 2 = 6 with target 5); status still shows "Target reached".
- Exam 2: search is simulated with a timer over local data.
- Exam 3: validation runs on submit only; no data is sent anywhere.
- Exam 5: render evidence is console-only.
