# React basics — 2-day focused plan (recreated 2026-11-19)

This version replaces the earlier general plan. We now focus on five pillars only:

1. **React basics** — components, JSX, props, state, conditional rendering
2. **Hooks** — rules, `useState`, and a guided tour of the others
3. **Higher-order functions (HOF)** — `map`/`filter`/`reduce`, callbacks, updater functions
4. **Lifecycle** — mount → update → unmount, class methods vs `useEffect`
5. **Lists → keys** — reconciliation and why stable `id` keys matter

The last sections map these onto **our LMS project** and give you a **practice lab**.

---

## Honest goal

Two days gives you a solid foundation and the ability to explain the project.
It does not give mastery. Track every topic as **introduced → practised → can explain**,
and only tick "can explain" after saying it out loud without notes.

> Your project uses only `useState` because the brief forbids other hooks and
> `useEffect`. So you will learn `useEffect` and the other hooks in a **scratch
> project** (StackBlitz / CodeSandbox / a throwaway folder outside this repo).
> Never add them to the LMS branch.

---

## Tracker (pick one)

- [ ] **Notion** — paste this file; the `- [ ]` boxes become checkboxes.
- [ ] **GitHub** — commit this `.md`; GitHub renders the boxes as a task list.
- [ ] **roadmap.sh/react** — free long-term 2026 roadmap after these 2 days.

⭐ = minimum path if you only have 3 hours that day.

---

# PART 1 — THE 2-DAY PROGRAM

## DAY 1 — Basics · Lists & keys · Higher-order functions

### Morning — React basics

- [ ] ⭐ **1. The mental model (30 min).** Read react.dev/learn → "Describing the UI".
      Memorise: **UI = f(state)**. A component is a function; React calls it with
      props and it returns JSX.

- [ ] ⭐ **2. JSX + props (40 min).** JSX is syntax that becomes `React.createElement`
      calls. Rules: one root element, `className` not `class`, `{}` for JS
      expressions. Exercise: open `src/components/common/FormField.jsx` and list
      all 9 props; write one sentence per prop. **Props are read-only.**

- [ ] ⭐ **3. `useState` first contact (40 min).** `const [value, setValue] = useState(initial)`.
      Calling `setValue` schedules a re-render. Exercise: count the `useState`
      calls in `src/components/auth/LoginForm.jsx` and name what each stores.

- [ ] **4. Conditional rendering (40 min).** `condition ? <A/> : <B/>` and
      `condition && <A/>`. Exercise: find the role switch in `src/App.jsx`
      (`admin` / `learner` / unsupported) and the `activeView` switch in
      `AdminLayout.jsx`.

### Afternoon — Lists/keys + HOF

- [ ] ⭐ **5. Lists and keys (50 min).** `array.map(item => <li key={item.id}>…</li>)`.
      A `key` tells React which item is which between renders (reconciliation).
      Exercise: find `key=` in `CourseList.jsx` and `UserList.jsx`. In scratch,
      delete an item from a list using the **array index** as key, then using a
      **stable id** — compare what the browser shows.

- [ ] ⭐ **6. HOF part 1 — array methods (50 min).** A higher-order function takes
      a function as an argument or returns a function. `map`, `filter`, `reduce`,
      `sort` are HOFs. Exercise: rewrite the filter logic of
      `CoursesPage.jsx` (`courses.filter(course => matchesCourseFilters(course, filters))`)
      in scratch, and do the same for `filteredUsers` in `UsersPage.jsx`.

- [ ] ⭐ **7. HOF part 2 — callbacks as props + updater functions (40 min).**
      A callback prop (`onKeywordChange={setKeywordFilter}`) is a function passed
      down so a child can report changes. A state updater
      (`setUsers(current => [...current, createdUser])`) is a function passed
      *into* a setter. Both are HOF patterns. Exercise: find 3 callback props
      in `CourseFilters.jsx` and one updater function in `UsersPage.jsx`.

- [ ] ⭐ **8. CHECKPOINT 1 — teach-back (20 min).** Record 3 minutes, no notes:
      component, props, state, key, higher-order function.

## DAY 2 — Hooks · Lifecycle

### Morning

- [ ] ⭐ **9. Rules of Hooks + `useState` deep dive (50 min).** Rules: call hooks
      only at the top level of a component or custom hook, never in loops,
      conditions or nested functions. `useState` can hold objects/arrays; always
      replace, never mutate. Exercise: explain why
      `setValues(current => ({ ...current, [name]: value }))` in `LoginForm` uses
      a spread and a functional updater.

- [ ] ⭐ **10. Lifecycle concept (40 min).** Every component has three phases:
      **mount** (created), **update** (props/state changed), **unmount** (removed).
      Class components used `componentDidMount`, `componentDidUpdate`,
      `componentWillUnmount`. Function components use `useEffect` for the same
      side effects. Draw the three phases on paper.

- [ ] ⭐ **11. `useEffect` in scratch (50 min).** `useEffect(() => { … }, [deps])`
      runs after render; the returned function is the **cleanup** on unmount or
      before re-run. Build a tiny component that fetches on mount, add a cleanup,
      and change the dependency array to see when it re-runs. Note: `main.jsx`
      wraps App in `StrictMode`, which double-invokes effects in development.
      **Why our LMS avoids it:** no mount-time network calls, explicit buttons
      make loading states testable.

### Afternoon

- [ ] ⭐ **12. The other hooks — guided tour (50 min).** In scratch only:
      `useRef` (a mutable value that does not cause re-render),
      `useMemo` (cache a computed value), `useCallback` (cache a function),
      `useReducer` (state + reducer for complex logic),
      `useContext` (avoid prop drilling), and a **custom hook** (a function
      starting with `use` that composes other hooks).

- [ ] ⭐ **13. Trace one full flow in our project (40 min).** On paper, follow:
      login submit → `handleLogin` → `api/auth.js` → `client.request` →
      `setSession` → layout chosen by role → click "Charger les cours" →
      `handleLoadCourses` → `getAdminCourses` → `setCourses` → derived
      `filteredCourses` → `<CourseList>` → `key={course.id}`.

- [ ] **14. Practice lab (40 min).** Do the first 3 exercises in Part 3 below.

- [ ] ⭐ **15. CHECKPOINT 2 — teach-back (20 min).** Record 3 minutes: "how
      hooks work, what lifecycle means, and why keys matter."

---

# PART 2 — UNDERSTANDING OUR PROJECT WORKFLOW

## The one-sentence summary

`App` owns the session and the current view; it renders a layout by role; the
layout renders a page by view; the page owns its data + filter state and calls an
`App` callback that talks to the API layer; results come back as props/state and
render as keyed lists.

## The layers

| Layer | Files | Job |
|---|---|---|
| Entry | `main.jsx`, `App.jsx`, `App.css`, `index.css` | mount React; own session + view; route by role |
| API | `api/client.js`, `auth.js`, `adminUsers.js`, `adminCourses.js`, `enrollments.js` | `fetch`, headers, Bearer token, errors, response validation |
| Layout | `components/layout/*` | shell, sidebar, header, nav; switch the page by `activeView` |
| Feature pages | `components/auth`, `courses`, `users`, `learner` | controlled forms, load states, local filters, keyed lists |
| Shared | `components/common/*`, `label` files | reusable input, logo, labels/formatters |

## Concept → where it lives in our code

| Concept | File to open | What to notice |
|---|---|---|
| Component / JSX | `common/BrandLogo.jsx` | a function returning JSX, no state |
| Props | `common/FormField.jsx` | 9 props, all read-only |
| `useState` | `auth/LoginForm.jsx` | values, errors, submitting, password visibility, submit error |
| Lifting state up | `layout/LearnerLayout.jsx` | enrollment state owned by the parent of two views |
| Conditional rendering | `App.jsx` | login / admin / learner / unsupported role |
| Lists + keys | `courses/CourseList.jsx`, `users/UserList.jsx` | `key={course.id}`, `key={user.id}` |
| HOF — `filter` | `courses/CoursesPage.jsx`, `users/UsersPage.jsx` | visible list derived during render |
| HOF — `map` | every `*.jsx` that renders an array | JSX built from data |
| HOF — callback props | `courses/CourseFilters.jsx` | child reports changes to parent |
| HOF — updater function | `users/UsersPage.jsx` | `setUsers(current => …)` immutably |
| Lifecycle idea | `CoursesPage.jsx`, `UsersPage.jsx` | "load" = mount-like action; explicit instead of automatic |
| Error handling | `api/client.js`, `App.jsx` | `ApiError`; 401 purges session, 403 keeps it |

## The API chain (say it out loud)

```
form submit / button click
  → App handler (role guard + 401 handling)
    → api/<feature>.js adapter (validate response shape)
      → client.request() (headers, Bearer token, JSON, ApiError)
        → fetch → backend /api/...
```

Endpoints used: `POST /auth/login`, `GET /auth/me`, `GET /enrollments/me`,
`GET|POST|PATCH /admin/users`, `GET /admin/courses`.

## Rules that are true in this project

- Only `useState`; no Router, Redux, `useEffect` or other hooks in the LMS.
- No fetch on render or mount — only in explicit event handlers.
- Token and certified profile live in App memory only (no browser storage).
- 401 → logout and purge; 403 → keep session and show "Accès refusé".
- Forms are controlled, validate synchronously, and keep input on server errors.
- Updates are immutable; filtered lists are derived during render (never stored).
- No success message before a real successful server response.

---

# PART 3 — PRACTICE LAB (scratch only)

Do these in order. Do **not** edit the LMS branch for practice.

- [ ] **1. Keys.** Build a 5-item list. Delete item 2. First use `key={index}`,
      then `key={item.id}`. Type into an input inside each row before deleting —
      with index keys the value jumps to the wrong row. Explain why.

- [ ] **2. `filter` as HOF.** Take an array of 6 courses. Write
      `courses.filter(c => c.status === 'published' && c.title.includes('Node'))`
      then extract the predicate into a named function like our
      `matchesCourseFilters`.

- [ ] **3. Callback prop.** Make a `<FilterBar keyword={...} onChange={...} />`
      that owns no state. The parent owns the value. Explain why the child cannot
      mutate the prop.

- [ ] **4. Functional updater.** Write `setCount(count + 1)` three times in one
      handler, then `setCount(c => c + 1)` three times. Compare the results.

- [ ] **5. Lifecycle → effect.** Write a class component with
      `componentDidMount`/`componentWillUnmount`, then the same as a function with
      `useEffect` + cleanup.

- [ ] **6. `useReducer`.** Recreate the five `useState` calls of `LoginForm` as
      one reducer in scratch.

- [ ] **7. Custom hook.** Extract the load/status/error pattern of `CoursesPage`
      into `useLoad(fn)` in scratch.

- [ ] **8. Trace exercise.** Print `App.jsx`; draw arrows for every prop passed
      to `AdminLayout`, then to `CoursesPage`, then to `CourseFilters`.

## Personal tracker

| Concept | Introduced | Practised | Can explain |
|---|---|---|---|
| Components / JSX | [ ] | [ ] | [ ] |
| Props | [ ] | [ ] | [ ] |
| useState | [ ] | [ ] | [ ] |
| Conditional rendering | [ ] | [ ] | [ ] |
| Lists & keys | [ ] | [ ] | [ ] |
| HOF: map/filter/reduce | [ ] | [ ] | [ ] |
| HOF: callbacks / updaters | [ ] | [ ] | [ ] |
| Lifting state up | [ ] | [ ] | [ ] |
| Lifecycle phases | [ ] | [ ] | [ ] |
| useEffect + cleanup | [ ] | [ ] | [ ] |
| Other hooks + custom hook | [ ] | [ ] | [ ] |
| Project API chain | [ ] | [ ] | [ ] |

## Suggested order from here

1. Finish reading Part 2 (project workflow) — I will walk you through it file by file.
2. Do practice exercises 1–4 (they cover lists/keys, HOF, callbacks, updaters).
3. Then exercises 5–7 for lifecycle and hooks.
4. Re-read the tracker aloud at the end of each day.
