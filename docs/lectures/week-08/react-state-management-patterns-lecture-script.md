# **Week 8 Monday: React State Management Patterns**

## **Course Information**

**Course:** ACCTMIS 4630 - Foundations of Business Systems
**Duration:** 45 minutes
**Date:** March 2, 2026
**Instructor:** Chad Thomas

**Strategic Note:** Students have used `useState` since Week 5 and have built increasingly complex UIs through Week 7 (data fetching, API integration). They've likely felt the pain of prop drilling and complex state updates but haven't had formal tools to address them. This lecture introduces `useReducer` and Context API as solutions to real problems students have already encountered. The evolving demo (useState pain → useReducer → Context) is designed to make the _why_ obvious before the _how_.

Teaching domain continues with **Buckeye Lending** from Weeks 5–6. Students will build a loan application dashboard with status updates, filters, and notification counts — state management patterns that transfer directly to their M4 shopping cart. The lecture does NOT use Marketplace examples; students must make the transfer independently.

**M4 Connection:** M4 requires `useReducer` or Context API for cart state management. This lecture teaches both patterns. Wednesday (forms & validation) and Friday (cart UI workshop) complete the Week 8 arc.

**Class Structure:** Full 45-min lecture (no quiz or assessment)

---

## **PRE-CLASS SETUP (5 minutes before start)**

**Do BEFORE students arrive:**

- Open VS Code with a Vite React + TypeScript project (`buckeye-lending-dashboard`)
- Have browser with React app running (http://localhost:5173)
- Terminal showing `npm run dev` output
- Presentation slides loaded
- **Pre-written files** (saves typing during demo):
  - `data/loanApplications.ts` — array of 5–6 loan applications (reuse from Week 6 if available)
  - `types/LoanApplication.ts` — type definition
  - `components/LoanCard.tsx` — basic card component from Week 5/6
- React DevTools extension installed in browser (for showing state inspection)

---

## **SLIDE 1: Title Slide**

**Slide Title:** State Management Patterns

**Subtitle:** useReducer, Context API & Knowing When to Use What

**Content:**

- ACCTMIS 4630
- Week 8 Monday
- March 2, 2026

**Speaker Notes:** "Welcome to Week 8. Quick check-in: how did M3 go? If it was rough, you're in good company — connecting a full-stack system is hard. The patterns we learn this week and next will make your M4 work significantly smoother.

Today we're talking about state management. You've been using `useState` since Week 5. It works great for simple things — toggling a filter, tracking an input value. But some of you probably ran into situations in M3 where state got messy. Maybe you were passing props through three or four components. Maybe you had multiple pieces of state that needed to update together and things got out of sync.

Today I'll show you two tools that solve those problems: `useReducer` for complex state logic, and Context API for avoiding prop drilling. We'll build both live, starting from a point you already know."

**Timing:** 2 minutes

---

## **SLIDE 2: Week 8 Overview**

**Slide Title:** This Week's Journey

**Content:**

- **Monday (Today):** State Management Patterns — useReducer & Context API
- **Wednesday:** React Forms & User Input — controlled components, validation
- **Friday Lab:** Cart UI Workshop — build cart component with add/remove/totals

**Coming Up:**

- **Week 9:** Cart Backend (API endpoints, validation, error handling)
- **Week 10:** Spring Break
- **Week 11:** Integration + **M4 Due** (Shopping Cart)

**Speaker Notes:** "This week is all about the frontend patterns you need for M4. Today: state management. Wednesday: forms and user input. Friday: you start building the cart UI.

Week 9 flips to the backend — cart API endpoints and error handling. Then spring break, then Week 11 is integration and M4 is due.

So you have three weeks of class time to build the shopping cart. Today's patterns are the foundation."

**Timing:** 1 minute

---

## **SLIDE 3: Today's Learning Objectives**

**Slide Title:** What You'll Understand Today

**Content:**

1. **Why `useState` breaks down** for complex state logic
2. **`useReducer`** — managing state transitions with actions and a reducer function
3. **Context API** — sharing state across components without prop drilling
4. **When to use which** — decision framework for choosing state patterns

**Speaker Notes:** "Four things. First, we'll see where `useState` falls short — because if you don't feel the pain, the solutions won't make sense. Then we'll learn `useReducer`, which handles complex state transitions. Then Context API, which solves prop drilling. And finally, a decision framework for when to use what.

All of this builds live in one evolving example."

**Timing:** 1 minute

---

## **SLIDE 4: Where We've Been**

**Slide Title:** Your State Management Journey So Far

**Content:**

```
Week 4: Static props              → Data flows down
Week 5: useState + lifting state  → Components react to changes
Week 6: .map() + filtering        → Derived state from arrays
Week 7: useEffect + fetch         → Async state from APIs
Week 8: useReducer + Context      → Complex state, shared state
```

**Key Insight:**
Each week added complexity. `useState` handled Weeks 5–7. But M4 (shopping cart) requires managing **multiple related operations** (add, remove, update quantity, clear) across **multiple components** (product listing, cart page, header count). That's where today's patterns come in.

**Speaker Notes:** "Look at the arc. Week 5 you learned `useState` — a toggle, a counter, a filter selection. Week 6 you used state to filter arrays. Week 7 you loaded state from an API.

Each step was a little more complex, but `useState` held up. The shopping cart is where it starts to crack. You've got add-to-cart, remove-from-cart, update quantity, clear cart, calculate totals — and those operations need to be available from the product page, the cart page, and the header. That's the problem we solve today."

**Timing:** 2 minutes

---

## **SLIDE 5: The useState Pain Point**

**Slide Title:** When useState Gets Messy

**Content:**

**Scenario:** Loan application dashboard with status management

```tsx
function LoanDashboard() {
  const [loans, setLoans] = useState<LoanApplication[]>(initialLoans);
  const [filter, setFilter] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("date");
  const [notificationCount, setNotificationCount] = useState(0);

  // Approve a loan
  const approveLoan = (id: number) => {
    setLoans((prev) =>
      prev.map((loan) =>
        loan.id === id ? { ...loan, status: "Approved" } : loan,
      ),
    );
    setNotificationCount((prev) => prev + 1);
  };

  // Deny a loan
  const denyLoan = (id: number) => {
    setLoans((prev) =>
      prev.map((loan) =>
        loan.id === id ? { ...loan, status: "Denied" } : loan,
      ),
    );
    setNotificationCount((prev) => prev + 1);
  };

  // Flag for review
  const flagLoan = (id: number) => {
    setLoans((prev) =>
      prev.map((loan) =>
        loan.id === id ? { ...loan, status: "Flagged" } : loan,
      ),
    );
    setNotificationCount((prev) => prev + 1);
  };

  // ...and more handlers for reset, bulk actions, etc.
}
```

**Problems:**

1. **No guarantee of consistency** — `setLoans` and `setNotificationCount` are two independent calls. Every handler must remember to call both. Forget one? State is silently wrong.
2. **Repetitive logic** — every handler does almost the same thing, copy-pasted with minor changes
3. **Scales by copy-paste** — adding a sixth action means copying a handler, changing one string, and hoping you remembered every step
4. **Untestable in isolation** — you can't test this logic without rendering the component

**The core issue:** `useState` gives you **no way to enforce that related state updates always happen together.** It's correct only as long as every developer remembers the rules. That's not a system — that's a hope.

**Speaker Notes:** "This code works. I want to be clear about that — there's nothing _broken_ here. The problem is what happens next.

Look at `approveLoan`, `denyLoan`, `flagLoan`. Each one updates the loan array AND increments the notification count. Two separate `setState` calls every time. Now: what if I ask you to add a `holdLoan` handler? You'd copy one of these, change the status string, and... did you remember the notification count? Probably. But what about the next person? What about three months from now when you're adding the eighth handler at 11 PM before a deadline?

The real question isn't 'does this work today?' It's 'can I guarantee it works every time someone touches it?' With `useState`, the answer is no. There's no mechanism that forces `setLoans` and `setNotificationCount` to happen together. It's correct by convention — and convention breaks.

What if you could make it correct by _design_? That's `useReducer`."

**Timing:** 3 minutes

---

## **SLIDE 6: Introducing useReducer**

**Slide Title:** useReducer — Correctness by Design

**Content:**

**The promise:** Every loan status change _always_ updates the notification count — not because you remembered, but because it's **impossible not to.**

**Mental Model:**
`useReducer` works like a state machine. Instead of directly setting state, you **dispatch actions** that describe _what happened_. A **reducer function** decides _how state changes_ in response.

```
Component → dispatches ACTION → Reducer → returns NEW STATE → Component re-renders
```

**The Pattern:**

```tsx
const [state, dispatch] = useReducer(reducer, initialState);
```

**Three pieces:**

1. **State** — the current data (same as useState)
2. **Dispatch** — a function that sends actions (replaces setState)
3. **Reducer** — a pure function: (currentState, action) → newState

**Why this is better (not just different):**
| | useState | useReducer |
|---|---|---|
| Consistency | Hope every handler calls all the right setters | Reducer **guarantees** related updates happen together |
| Adding actions | Copy a handler, remember the rules | Add a switch case — all the rules are already there |
| Testing | Render the component, trigger UI events | Call a plain function: `reducer(state, action)` → assert |
| New team member | Must read every handler to learn the rules | Reads one reducer to see all possible state transitions |

**Analogy:** Think of a bank teller. You don't reach into the vault and move money yourself (setState). You hand the teller a **deposit slip** (action) and the teller follows **bank procedures** (reducer) to update your balance (state). The procedures _guarantee_ that every withdrawal also logs a transaction. You can't withdraw without the log — it's the same operation.

**Speaker Notes:** "I know what you're thinking: this looks like more code. And it is — for now. But here's the thing: `useState` is easier to _write_. `useReducer` is easier to _trust_.

With `useState`, you're telling React exactly what state should be — manually, every time, in every handler. With `useReducer`, you say 'a loan was approved' and the reducer handles all the consequences. The notification count, the status change, anything else you add later — it all lives in one function.

This matters in business systems. Think about accounting: you don't let every employee reach into the ledger and change numbers directly. You submit transactions, and the system applies rules consistently. Same concept.

The comparison table is the key point. It's not that `useReducer` can do things `useState` can't — they're equivalent in power. It's that `useReducer` makes the _correct behavior automatic_ instead of relying on the developer remembering the rules.

The bank teller analogy: you hand over a deposit slip, the teller follows procedure. The procedure guarantees the deposit gets recorded, your balance updates, and a receipt prints. You can't deposit without those steps happening — they're part of the same operation. That's what a reducer does for your state."

**Timing:** 3 minutes

---

## **SLIDE 7: Anatomy of a Reducer**

**Slide Title:** Writing a Reducer Function

**Content:**

**Action Type:**

```tsx
type LoanAction =
  | { type: "APPROVE_LOAN"; loanId: number }
  | { type: "DENY_LOAN"; loanId: number }
  | { type: "FLAG_LOAN"; loanId: number }
  | { type: "SET_FILTER"; filter: string }
  | { type: "CLEAR_NOTIFICATIONS" };
```

**State Type:**

```tsx
type LoanDashboardState = {
  loans: LoanApplication[];
  filter: string;
  notificationCount: number;
};
```

**Reducer Function:**

```tsx
function loanReducer(
  state: LoanDashboardState,
  action: LoanAction,
): LoanDashboardState {
  switch (action.type) {
    case "APPROVE_LOAN":
      return {
        ...state,
        loans: state.loans.map((loan) =>
          loan.id === action.loanId ? { ...loan, status: "Approved" } : loan,
        ),
        notificationCount: state.notificationCount + 1,
      };
    case "DENY_LOAN":
      return {
        ...state,
        loans: state.loans.map((loan) =>
          loan.id === action.loanId ? { ...loan, status: "Denied" } : loan,
        ),
        notificationCount: state.notificationCount + 1,
      };
    case "SET_FILTER":
      return { ...state, filter: action.filter };
    case "CLEAR_NOTIFICATIONS":
      return { ...state, notificationCount: 0 };
  }
}
```

**Key Rules:**

- Reducer must be a **pure function** — no side effects, no API calls, no mutations
- Always return a **new state object** (use spread operator)
- No `default` case — TypeScript's exhaustive checking ensures every action is handled at compile time

**Speaker Notes:** "Let's break this down. The action type is a TypeScript discriminated union — each action has a `type` string and optionally carries data. TypeScript knows: if the type is `APPROVE_LOAN`, there must be a `loanId`. This is compile-time safety.

The reducer is a switch statement. Each case takes the current state, applies the change, and returns a new state object. Notice: every loan status change _also_ increments the notification count. That logic is in ONE place now. You can't forget it.

The spread operator `...state` is critical — you return a new object with everything unchanged except what you're updating. React uses this to know what changed and what to re-render."

**Timing:** 4 minutes

---

## **SLIDE 8: Using useReducer in a Component**

**Slide Title:** Dispatching Actions

**Content:**

```tsx
function LoanDashboard() {
  const [state, dispatch] = useReducer(loanReducer, {
    loans: initialLoans,
    filter: "All",
    notificationCount: 0,
  });

  // Compare: instead of complex setState calls...
  // Before: setLoans(prev => prev.map(...)); setNotificationCount(prev => prev + 1);
  // After:
  const handleApprove = (id: number) => {
    dispatch({ type: "APPROVE_LOAN", loanId: id });
  };

  const handleDeny = (id: number) => {
    dispatch({ type: "DENY_LOAN", loanId: id });
  };

  return (
    <div>
      <Header notificationCount={state.notificationCount} />
      <FilterBar
        currentFilter={state.filter}
        onFilterChange={(f) => dispatch({ type: "SET_FILTER", filter: f })}
      />
      <LoanList
        loans={state.loans}
        filter={state.filter}
        onApprove={handleApprove}
        onDeny={handleDeny}
      />
    </div>
  );
}
```

**Before vs. After:**
| | useState | useReducer |
|---|---|---|
| State updates | Multiple setState calls | Single dispatch call |
| Logic location | Scattered in handlers | Centralized in reducer |
| Adding new action | Write new handler, remember all steps | Add case to switch, all steps co-located |
| Testing | Mock component, trigger handler | Call reducer directly with state + action |

**Speaker Notes:** "Look at how clean the component becomes. `handleApprove` is one line: dispatch an action. The component doesn't know _how_ state changes — it just says what happened.

The comparison table is important. With `useState`, adding a new action means writing a new handler and remembering every step. With `useReducer`, you add a case to the switch. All the related logic is right there.

And testing — this is huge. You can test the reducer as a plain function. Pass in a state, pass in an action, assert the output. No component rendering needed."

**Timing:** 3 minutes

---

## **SLIDE 9: The Prop Drilling Problem**

**Slide Title:** When Props Pass Through Too Many Layers

**Content:**

```
App
├── Header                    ← needs notificationCount
│   └── NotificationBadge     ← needs notificationCount
├── Sidebar                   ← needs filter, onFilterChange
│   └── FilterBar             ← needs filter, onFilterChange
└── MainContent
    └── LoanList              ← needs loans, onApprove, onDeny
        └── LoanCard          ← needs loan, onApprove, onDeny
            └── ActionButtons ← needs onApprove, onDeny
```

**The Problem:**
`MainContent` doesn't USE `onApprove` — it just passes it through to `LoanList`, which passes it to `LoanCard`, which passes it to `ActionButtons`.

Every intermediate component must accept and forward props it doesn't care about.

**Consequences:**

- Components get cluttered with pass-through props
- Refactoring is painful (rename a prop → update every layer)
- Adding a new action means threading it through every level

**Speaker Notes:** "This is prop drilling. Raise your hand if you've written a component that takes a prop just to pass it to a child. That's prop drilling.

In this tree, the action handlers are defined in `App` but used in `ActionButtons` — four levels deep. `MainContent` and `LoanList` don't use those handlers themselves; they just forward them.

With two or three props, it's fine. But a shopping cart might have add, remove, updateQuantity, clear, getTotal — that's five handlers drilling through your component tree. It gets ugly fast."

**Timing:** 2 minutes

---

## **SLIDE 10: Introducing Context API**

**Slide Title:** Context API — Shared State Without Prop Drilling

**Content:**

**Mental Model:**
Context creates a "broadcast channel" that any component in the tree can tune into — without props passing through intermediate components.

```
                  Context Provider (holds state)
                  /          |            \
        Header          Sidebar         MainContent
          |                |                |
   NotificationBadge   FilterBar        LoanList
                                           |
                                        LoanCard
                                           |
                                      ActionButtons ← reads from Context directly
```

**Three Steps:**

1. **Create** the context
2. **Provide** it (wrap your component tree)
3. **Consume** it (use the hook in any child)

**Speaker Notes:** "Context solves prop drilling. Instead of threading props through every layer, you create a provider at the top of the tree. Any component anywhere in that tree can read the context value directly.

Think of it like a radio broadcast. The provider is the radio station. Any component with a receiver — the `useContext` hook — picks up the signal. No wires needed between each layer."

**Timing:** 2 minutes

---

## **SLIDE 11: Building a Context (Code)**

**Slide Title:** Creating a Context with useReducer

**Content:**

```tsx
// contexts/LoanContext.tsx

import { createContext, useContext, useReducer, ReactNode } from "react";

// 1. CREATE the context
type LoanContextType = {
  state: LoanDashboardState;
  dispatch: React.Dispatch<LoanAction>;
};

const LoanContext = createContext<LoanContextType | null>(null);

// 2. PROVIDE it (wrapper component)
export function LoanProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(loanReducer, {
    loans: initialLoans,
    filter: "All",
    notificationCount: 0,
  });

  return (
    <LoanContext.Provider value={{ state, dispatch }}>
      {children}
    </LoanContext.Provider>
  );
}

// 3. CONSUME it (custom hook)
export function useLoanContext() {
  const context = useContext(LoanContext);
  if (!context) {
    throw new Error("useLoanContext must be used within a LoanProvider");
  }
  return context;
}
```

**Speaker Notes:** "This is the full pattern. Three pieces.

First, `createContext` — this creates the broadcast channel. The type says: this context holds our state and a dispatch function.

Second, `LoanProvider` — this is a wrapper component. It uses `useReducer` internally and provides the state and dispatch to all children. You wrap your app (or part of your app) with this.

Third, `useLoanContext` — a custom hook. Any component calls this to get the state and dispatch. The error check is a safety net — if someone uses the hook outside the provider, they get a clear error message instead of a mysterious `undefined`."

**Timing:** 3 minutes

---

## **SLIDE 12: Using Context in Components**

**Slide Title:** Consuming Context — Clean Components

**Content:**

**Wrap the app:**

```tsx
// App.tsx
function App() {
  return (
    <LoanProvider>
      <Header />
      <Sidebar />
      <MainContent />
    </LoanProvider>
  );
}
```

**Any nested component can access state directly:**

```tsx
// components/NotificationBadge.tsx — deep in the tree
function NotificationBadge() {
  const { state } = useLoanContext();
  return <span className="badge">{state.notificationCount}</span>;
}

// components/ActionButtons.tsx — also deep in the tree
function ActionButtons({ loanId }: { loanId: number }) {
  const { dispatch } = useLoanContext();
  return (
    <div>
      <button onClick={() => dispatch({ type: "APPROVE_LOAN", loanId })}>
        Approve
      </button>
      <button onClick={() => dispatch({ type: "DENY_LOAN", loanId })}>
        Deny
      </button>
    </div>
  );
}
```

**What changed:**

- `App` no longer passes handlers through every layer
- `MainContent` no longer accepts props it doesn't use
- `ActionButtons` reads directly from context — clean and self-contained
- `NotificationBadge` reads the count directly — no prop chain

**Speaker Notes:** "Look at how simple these components become. `NotificationBadge` calls `useLoanContext()`, grabs the count, displays it. It doesn't care where it sits in the tree.

`ActionButtons` calls the same hook, grabs `dispatch`, and sends actions. No handler functions passed through four levels of props.

The intermediate components — `MainContent`, `LoanList` — they're free. They don't carry props they don't use. If you add a new action, you add it to the reducer and dispatch it from wherever you need it. No threading required."

**Timing:** 2 minutes

---

## **SLIDE 13: LIVE DEMO**

**Slide Title:** Let's Build This Together

**Content:**

- Starting point: Loan dashboard with useState (the messy version)
- Step 1: Refactor to useReducer
- Step 2: Extract to Context
- Watch the component code get cleaner at each step

**[INSTRUCTOR: Switch to VS Code]**

**Speaker Notes:** "Alright, let's do this live. I've got a loan dashboard already built with `useState` — it works but it's messy. We'll refactor it step by step."

**[See LIVE CODING SCRIPT below]**

**Timing:** 12 minutes

---

## **LIVE CODING SCRIPT (12 minutes)**

### Starting Point (Pre-built, just walk through — 1 min)

Show the existing `LoanDashboard.tsx` with multiple `useState` calls, repetitive handlers, and props being drilled through `LoanList` → `LoanCard` → `ActionButtons`.

**Narrate:** "Here's our starting point. A working loan dashboard. I've got four `useState` calls, five handler functions that all look similar, and I'm passing `onApprove`, `onDeny`, and `onFlag` through three levels of components. It works, but let's make it better."

**[Show the app running in browser — click approve/deny, show it working]**

### Step 1: Define the Action Types and State Type (1 min)

Create `types/loanActions.ts`:

```tsx
export type LoanDashboardState = {
  loans: LoanApplication[];
  filter: string;
  notificationCount: number;
};

export type LoanAction =
  | { type: "APPROVE_LOAN"; loanId: number }
  | { type: "DENY_LOAN"; loanId: number }
  | { type: "FLAG_LOAN"; loanId: number }
  | { type: "SET_FILTER"; filter: string }
  | { type: "CLEAR_NOTIFICATIONS" };
```

**Narrate:** "First, I define what my state looks like and what actions can happen. This is like writing a contract: here are the only things that can change state in my dashboard. TypeScript will enforce this — if I try to dispatch an action that doesn't match, I get a compile error."

### Step 2: Write the Reducer (2 min)

Create `reducers/loanReducer.ts`:

```tsx
export function loanReducer(
  state: LoanDashboardState,
  action: LoanAction,
): LoanDashboardState {
  switch (action.type) {
    case "APPROVE_LOAN":
      return {
        ...state,
        loans: state.loans.map((loan) =>
          loan.id === action.loanId ? { ...loan, status: "Approved" } : loan,
        ),
        notificationCount: state.notificationCount + 1,
      };
    case "DENY_LOAN":
      return {
        ...state,
        loans: state.loans.map((loan) =>
          loan.id === action.loanId ? { ...loan, status: "Denied" } : loan,
        ),
        notificationCount: state.notificationCount + 1,
      };
    case "FLAG_LOAN":
      return {
        ...state,
        loans: state.loans.map((loan) =>
          loan.id === action.loanId ? { ...loan, status: "Flagged" } : loan,
        ),
        notificationCount: state.notificationCount + 1,
      };
    case "SET_FILTER":
      return { ...state, filter: action.filter };
    case "CLEAR_NOTIFICATIONS":
      return { ...state, notificationCount: 0 };
  }
}
```

**Narrate:** "The reducer is a switch on the action type. Each case returns a new state object. Notice — every loan status change also bumps the notification count. This logic is all in one place. If I want to add logging, analytics, or validation later, I add it here once.

Also notice: I'm not using a `default` case. TypeScript's exhaustive checking means if I add a new action type and forget to handle it here, I get a compile error. That's by design."

### Step 3: Replace useState with useReducer in the Component (2 min)

Refactor `LoanDashboard.tsx`:

```tsx
// Before: four useState calls + five handlers
// After:
function LoanDashboard() {
  const [state, dispatch] = useReducer(loanReducer, {
    loans: initialLoans,
    filter: "All",
    notificationCount: 0,
  });

  const filteredLoans =
    state.filter === "All"
      ? state.loans
      : state.loans.filter((loan) => loan.status === state.filter);

  return (
    <div>
      <Header
        notificationCount={state.notificationCount}
        onClearNotifications={() => dispatch({ type: "CLEAR_NOTIFICATIONS" })}
      />
      <FilterBar
        currentFilter={state.filter}
        onFilterChange={(f) => dispatch({ type: "SET_FILTER", filter: f })}
      />
      <LoanList
        loans={filteredLoans}
        onApprove={(id) => dispatch({ type: "APPROVE_LOAN", loanId: id })}
        onDeny={(id) => dispatch({ type: "DENY_LOAN", loanId: id })}
        onFlag={(id) => dispatch({ type: "FLAG_LOAN", loanId: id })}
      />
    </div>
  );
}
```

**Narrate:** "Four `useState` calls become one `useReducer`. Five handler functions become inline dispatches. The component is now focused on _what to render_, not _how state changes_. That logic is in the reducer.

But — we still have prop drilling. `onApprove`, `onDeny`, `onFlag` are being passed to `LoanList` just so it can pass them to `LoanCard`. Let's fix that."

**[Save, show browser still works — approve a loan, check notification count increments]**

### Step 4: Extract to Context (3 min)

Create `contexts/LoanContext.tsx`:

```tsx
import { createContext, useContext, useReducer, ReactNode } from "react";
import { loanReducer } from "../reducers/loanReducer";
import { LoanDashboardState, LoanAction } from "../types/loanActions";
import { initialLoans } from "../data/loanApplications";

type LoanContextType = {
  state: LoanDashboardState;
  dispatch: React.Dispatch<LoanAction>;
};

const LoanContext = createContext<LoanContextType | null>(null);

export function LoanProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(loanReducer, {
    loans: initialLoans,
    filter: "All",
    notificationCount: 0,
  });

  return (
    <LoanContext.Provider value={{ state, dispatch }}>
      {children}
    </LoanContext.Provider>
  );
}

export function useLoanContext() {
  const context = useContext(LoanContext);
  if (!context) {
    throw new Error("useLoanContext must be used within a LoanProvider");
  }
  return context;
}
```

**Narrate:** "Now I'm moving the useReducer into a context provider. This component holds the state and makes it available to any child. The custom hook `useLoanContext` is the API — any component calls it to access state or dispatch."

### Step 5: Simplify the Components (2 min)

Update `App.tsx`:

```tsx
function App() {
  return (
    <LoanProvider>
      <Header />
      <Sidebar />
      <MainContent />
    </LoanProvider>
  );
}
```

Update `ActionButtons.tsx`:

```tsx
function ActionButtons({ loanId }: { loanId: number }) {
  const { dispatch } = useLoanContext();
  return (
    <div>
      <button onClick={() => dispatch({ type: "APPROVE_LOAN", loanId })}>
        Approve
      </button>
      <button onClick={() => dispatch({ type: "DENY_LOAN", loanId })}>
        Deny
      </button>
    </div>
  );
}
```

**Narrate:** "Look at `App` now — no handler props at all. Clean. And `ActionButtons` reads directly from context. The intermediate components — `MainContent`, `LoanList` — no longer carry props they don't use.

Let me remove those pass-through props from `LoanList` and `LoanCard`..."

**[Remove the onApprove/onDeny/onFlag props from LoanList and LoanCard]**
**[Save, show browser, verify everything still works]**

### Step 6: Show React DevTools (1 min)

**Narrate:** "One more thing — open React DevTools, Components tab. See the LoanProvider? Click it. You can see the current state right here: loans array, filter value, notification count. This is great for debugging. When something's wrong, check the provider's state first."

**BACKUP PLAN:** If live coding breaks, have a pre-written `completed/` directory with the final version. Switch to it and walk through the diff.

---

## **SLIDE 14: Key Takeaways from Demo**

**Slide Title:** What Just Happened

**Content:**

**Evolution:**

```
Step 1: useState (works, but messy)
  ↓  Problem: repetitive logic, multiple setState calls
Step 2: useReducer (clean logic, centralized)
  ↓  Problem: still prop drilling
Step 3: Context + useReducer (clean logic + no drilling)
```

**Result:**

- State logic lives in ONE file (reducer)
- Any component can access state (context)
- Adding new actions = add a case to the switch + dispatch from wherever

**Speaker Notes:** "Three steps. Each solved a specific problem. You don't always need all three — sometimes `useReducer` alone is enough. The decision framework coming up will help you choose."

**Timing:** 1 minute

---

## **SLIDE 15: When to Use What**

**Slide Title:** Decision Framework

**Content:**

**Use `useState` when:**

- Single value (toggle, input, counter)
- Independent pieces of state
- Simple updates (set directly, no derived logic)
- State used in one component or parent-child

**Use `useReducer` when:**

- Multiple related values that update together
- Complex update logic (conditionals, calculations)
- Next state depends on previous state in non-trivial ways
- You want testable state logic separate from components

**Add Context when:**

- Multiple components at different tree levels need the same state
- You're passing props through components that don't use them
- The state represents a "feature" (cart, auth, theme, notifications)

**Don't use Context for:**

- Everything — it's not a replacement for props
- Frequently changing values that only one or two components need (performance)
- Server state (use `useEffect` + fetch or a library like React Query)

**Speaker Notes:** "This is the slide to bookmark. Not everything needs `useReducer`. Not everything needs Context.

A search input value? `useState`. A theme toggle shared across the app? Context. A shopping cart with add, remove, update, and clear? `useReducer` + Context.

The rule of thumb: if you find yourself writing multiple `setState` calls that must stay in sync, consider `useReducer`. If you find yourself passing props through components that don't use them, consider Context."

**Timing:** 3 minutes

---

## **SLIDE 16: Common Mistakes**

**Slide Title:** Pitfalls to Avoid

**Content:**

**Mistake 1: Mutating state in the reducer**

```tsx
// ❌ WRONG — mutates the array
case "APPROVE_LOAN":
  state.loans[index].status = "Approved";
  return state;

// ✅ CORRECT — returns new object
case "APPROVE_LOAN":
  return {
    ...state,
    loans: state.loans.map(loan =>
      loan.id === action.loanId ? { ...loan, status: "Approved" } : loan
    ),
  };
```

**Mistake 2: Using Context for everything**

```tsx
// ❌ Overkill — this is just a local toggle
const ThemeContext = createContext(...);
// Only used in one component's child

// ✅ Just use useState or pass a prop
```

**Mistake 3: Forgetting the Provider**

```
Error: useLoanContext must be used within a LoanProvider
```

Fix: Make sure the component using the hook is inside the `<LoanProvider>` wrapper.

**Mistake 4: Putting side effects in the reducer**

```tsx
// ❌ WRONG — reducers must be pure
case "APPROVE_LOAN":
  fetch(`/api/loans/${action.loanId}/approve`);  // NO!
  return { ... };

// ✅ Side effects go in components (useEffect) or event handlers
```

**Speaker Notes:** "Four common mistakes. The most dangerous is mutating state — if you modify the existing state object instead of returning a new one, React won't re-render because it thinks nothing changed. Always spread.

The second most common: putting Context around everything. Context is for shared, cross-cutting state — not every piece of data. If only one component uses it, just use `useState`.

And never put API calls or side effects in a reducer. Reducers are pure functions: same input, same output, every time."

**Timing:** 2 minutes

---

## **SLIDE 17: Connection to M4**

**Slide Title:** Applying This to Your Shopping Cart

**Content:**

**M4 requires:**

- Cart state managed with `useReducer` or Context API
- Add, remove, update quantity, clear cart
- Cart count visible in header
- Totals calculated correctly

**The pattern you learned today maps directly:**

| Loan Dashboard               | Shopping Cart             |
| ---------------------------- | ------------------------- |
| `APPROVE_LOAN` action        | `ADD_TO_CART` action      |
| `DENY_LOAN` action           | `REMOVE_FROM_CART` action |
| `SET_FILTER` action          | `UPDATE_QUANTITY` action  |
| `CLEAR_NOTIFICATIONS` action | `CLEAR_CART` action       |
| `notificationCount`          | `cartItemCount`           |
| `LoanProvider` context       | `CartProvider` context    |

**Friday's Lab:**
You'll start building the cart UI using these exact patterns.

**Speaker Notes:** "The loan dashboard we built today is structurally identical to what you need for M4. Replace loan actions with cart actions. Replace the loan array with a cart items array. The reducer pattern, the context pattern, the custom hook — all the same.

Friday's lab is your head start. You'll build the cart component using `useReducer` and Context. Wednesday we cover forms and validation — which you'll need for quantity inputs and checkout."

**Timing:** 2 minutes

---

## **SLIDE 18: Summary**

**Slide Title:** What You Learned Today

**Content:**

**Core Concepts:**

1. **`useReducer`** centralizes state logic into a pure reducer function
2. **Actions** describe what happened; the reducer decides how state changes
3. **Context API** shares state across the component tree without prop drilling
4. **useReducer + Context** is a powerful combination for feature-level state (cart, auth, theme)
5. **Choose the right tool** — `useState` for simple, `useReducer` for complex, Context for shared

**Next Steps:**

- **Wednesday:** React Forms & User Input (controlled components, validation)
- **Friday Lab:** Cart UI Workshop (build cart with useReducer + Context)

**Resources:**

- React docs — useReducer: https://react.dev/reference/react/useReducer
- React docs — Context: https://react.dev/learn/passing-data-deeply-with-context
- Code from today: [Carmen > Week 8 > Resources]

**Speaker Notes:** "Three takeaways. One: `useReducer` is for complex state logic — all transitions in one place, testable, predictable. Two: Context eliminates prop drilling for shared state. Three: you don't always need both — use the decision framework.

Wednesday we cover forms. Friday you start building the cart. See you then."

**Timing:** 1.5 minutes

---

## **SLIDE 19: Questions?**

**Slide Title:** Questions?

**Content:**

- Questions about useReducer?
- Questions about Context API?
- Questions about when to use what?
- Questions about how this connects to M4?

**Speaker Notes:** "State management is one of those topics that clicks with practice. If it feels abstract right now, that's normal. Friday's lab will make it concrete.

If you're already thinking about your cart — good. Start sketching your action types. What actions can a user take on a cart? That's your action type. The reducer writes itself from there."

**Timing:** 2–3 minutes

---

## **END OF SLIDE DECK**

**Total Duration:** ~45 minutes

**Estimated Timing Breakdown:**

- Introduction & Overview: 4 minutes (Slides 1–3)
- Progression & useState Pain: 5 minutes (Slides 4–5)
- useReducer Concepts: 10 minutes (Slides 6–8)
- Context API Concepts: 4 minutes (Slides 9–10)
- Context Code: 5 minutes (Slides 11–12)
- Live Demo: 12 minutes (Slide 13)
- Wrap-up & Application: 5 minutes (Slides 14–18)
- Questions: 2–3 minutes (Slide 19)

---

## **ADDITIONAL INSTRUCTOR NOTES**

### **Key Teaching Points**

1. **Motivation first** — Don't introduce useReducer until students feel the useState pain (Slide 5)
2. **Pure functions** — Hammer this for reducers. No side effects. Same input = same output.
3. **Spread operator mastery** — Students will struggle with immutable updates. Show the pattern repeatedly.
4. **Context is not global state** — It's scoped to the provider. You can have multiple contexts.
5. **TypeScript discriminated unions** — The action type pattern is powerful. Point out how TypeScript narrows the type inside each switch case.

### **Classroom Engagement**

- **Slide 5:** "Raise your hand if you had a component in M3 that accepted a prop just to pass it to a child." (Validates prop drilling problem)
- **Slide 6:** "Who's heard of Redux? useReducer is the same idea, built into React, no library needed."
- **Slide 9:** Draw the component tree on the whiteboard and trace prop flow with a marker to make drilling visible
- **Live Demo:** Have students predict what the state will look like after each dispatch

### **Time Management**

- **If running behind:** Compress Slides 11–12 into the live demo (build context during demo rather than showing code on slides first)
- **If running ahead:** Spend more time on the decision framework (Slide 15) with student scenarios — "You're building X, what would you use?"
- **Live demo is the priority** — if you need to cut something, cut slides, not the demo

### **Common Student Questions (Prepare Answers)**

1. **"When should I use Redux vs. useReducer + Context?"** — For this course, useReducer + Context is sufficient. Redux adds middleware, dev tools, and ecosystem. You'd reach for it in larger apps with async logic, time-travel debugging needs, etc. Don't worry about Redux for M4.
2. **"Does Context cause everything to re-render?"** — When context value changes, all consumers re-render. For this course, that's fine. In production, you'd split contexts or use memoization. Don't optimize prematurely.
3. **"Can I use useState instead of useReducer for M4?"** — Technically yes, but the rubric specifically mentions useReducer or Context. And your cart will be cleaner with a reducer.
4. **"What's the difference between useReducer and Redux?"** — Same concept (actions, reducer, dispatch). Redux is an external library with middleware, dev tools, and a global store. useReducer is built into React and scoped to a component/context.

### **Materials Needed**

- VS Code with pre-built loan dashboard (useState version)
- Browser with React DevTools installed
- Completed version in `completed/` directory (backup)
- Whiteboard/markers for drawing component trees

### **Post-Class Follow-Up**

- Upload demo code (both starting and final versions) to GitHub
- Post slide deck to Carmen
- Post link to React docs for useReducer and Context
- Reminder: Wednesday covers forms — bring your laptops

---

**Last Updated:** March 1, 2026
**Next Review:** After Monday, Mar 2 lecture (revise based on student feedback)
