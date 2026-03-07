# **Week 8 Wednesday: React Forms & User Input**

## **Course Information**

**Course:** ACCTMIS 4630 - Foundations of Business Systems
**Duration:** 45 minutes
**Date:** March 4, 2026
**Instructor:** Chad Thomas

**Strategic Note:** Students learned `useReducer` and Context API on Monday. Today shifts to the UI input side: how do you _collect_ data from users in React? Controlled components are the core pattern — they've likely seen uncontrolled HTML forms before, and this lecture explains why React does it differently and why the controlled approach is worth the extra code.

Teaching domain stays with **Buckeye Lending** — a loan application form with text inputs, number inputs, selects, and validation. The emphasis tilts toward **number inputs and quantity patterns** that transfer directly to M4's cart (quantity selectors, price display, input constraints). Students should leave knowing how to build a form that validates, displays errors inline, and submits cleanly.

**M4 Connection:** The cart needs quantity inputs (number type, min/max constraints), form-like interactions (update quantity, confirm removal), and inline feedback. Wednesday's patterns are the building blocks. Friday's lab combines Monday's state management with today's form handling to build the cart UI.

**Class Structure:** Full 45-min lecture (no quiz or assessment)

---

## **PRE-CLASS SETUP (5 minutes before start)**

**Do BEFORE students arrive:**

- Open VS Code with the Buckeye Lending project from Monday (or a fresh Vite React + TS project)
- Have browser with React app running (http://localhost:5173)
- Terminal showing `npm run dev` output
- Presentation slides loaded
- **Pre-written files:**
  - `types/LoanApplication.ts` — reuse from Monday
  - `components/LoanForm.tsx` — skeleton with empty return (students see it built live)
  - A simple CSS Module file for form styling (`LoanForm.module.css`)
- React DevTools open in browser

---

## **SLIDE 1: Title Slide**

**Slide Title:** React Forms & User Input

**Subtitle:** Controlled Components, Validation & Handling Submission

**Content:**

- ACCTMIS 4630
- Week 8 Wednesday
- March 4, 2026

**Speaker Notes:** "Monday we learned how to _manage_ state with `useReducer` and share it with Context. Today we learn how to _collect_ state from users — forms, inputs, validation.

Forms are everywhere in business systems. Loan applications, checkout flows, search bars, settings pages. In React, forms work differently than plain HTML. There's a pattern called 'controlled components' that gives you full control over every keystroke. Let's see why that matters and how to use it."

**Timing:** 1.5 minutes

---

## **SLIDE 2: Week 8 Progress**

**Slide Title:** Where We Are This Week

**Content:**

- **Monday:** ✅ State Management Patterns — useReducer & Context
- **Wednesday (Today):** React Forms & User Input
- **Friday Lab:** Cart UI Workshop — combine state management + forms into cart

**The arc:**

```
Monday: How to MANAGE complex state
Wednesday: How to COLLECT user input
Friday: PUT THEM TOGETHER → Cart UI
```

**Speaker Notes:** "Monday gave you the state management toolkit. Today gives you the input toolkit. Friday you combine them. By end of Friday, you'll have a cart component that uses `useReducer` for state and controlled inputs for quantity changes."

**Timing:** 1 minute

---

## **SLIDE 3: Today's Learning Objectives**

**Slide Title:** What You'll Understand Today

**Content:**

1. **Controlled vs. uncontrolled components** — why React prefers controlled
2. **Input types** — text, number, select, checkbox and when to use each
3. **Form validation** — inline errors, submit-time validation, disabling submit
4. **Handling submission** — preventing default, collecting form data, providing feedback
5. **Number input patterns** — constraints, clamping, and quantity selectors (M4 preview)

**Speaker Notes:** "Five things. Controlled components are the foundation — everything else builds on that concept. We'll cover the major input types, validation patterns, and submission handling. I'm putting extra emphasis on number inputs because you'll need quantity selectors for the cart."

**Timing:** 1 minute

---

## **SLIDE 4: HTML Forms vs. React Forms**

**Slide Title:** Why React Forms Are Different

**Content:**

**Traditional HTML Form:**

```html
<form action="/submit-loan" method="POST">
  <input name="applicantName" type="text" />
  <input name="amount" type="number" />
  <button type="submit">Submit</button>
</form>
```

- Browser owns the input values
- Submit does a full page reload
- Validation happens on submit (or with HTML5 attributes)
- You can't easily access values _while the user types_

**React Controlled Form:**

```tsx
const [name, setName] = useState("");

<input
  value={name}
  onChange={(e) => setName(e.target.value)}
/>
```

- **React owns the input values** (stored in state)
- You see every keystroke in real time
- Validation can happen on every change
- No page reload — you decide what happens on submit

**The tradeoff:** More code upfront, but full control over the user experience.

**Speaker Notes:** "In traditional HTML, the browser manages form state. You type into an input, the browser tracks the value, and when you hit submit, the browser sends everything to the server. You don't really know what the user typed until submit.

In React, you flip that. React state holds the value. The input _displays_ whatever's in state. When the user types, the `onChange` handler updates state, which updates the input. It's a loop: state → input → onChange → state.

Why bother? Because now you can validate on every keystroke, show character counts live, disable the submit button until the form is valid, format numbers as the user types. All the things that make business forms feel professional."

**Timing:** 3 minutes

---

## **SLIDE 5: The Controlled Component Pattern**

**Slide Title:** Anatomy of a Controlled Input

**Content:**

```tsx
function LoanAmountInput() {
  const [amount, setAmount] = useState<number | "">("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty string (user clearing field) or valid numbers
    if (value === "") {
      setAmount("");
    } else {
      const num = Number(value);
      if (!isNaN(num)) {
        setAmount(num);
      }
    }
  };

  return (
    <label>
      Loan Amount ($)
      <input
        type="number"
        value={amount}
        onChange={handleChange}
        min={1000}
        max={500000}
        step={1000}
      />
    </label>
  );
}
```

**Two required attributes for a controlled input:**

1. **`value`** — ties the input's display to React state
2. **`onChange`** — updates React state when the user types

If you have `value` without `onChange`, the input is **read-only** (React will warn you).

**Speaker Notes:** "Every controlled input needs these two things: `value` and `onChange`. `value` makes React the source of truth. `onChange` keeps state in sync with what the user types.

Notice the type for amount: `number | ""`. That empty string handles the case where the user clears the field — you can't store `NaN` or `undefined` in a number input cleanly. This is a common gotcha with number inputs.

The `min`, `max`, and `step` attributes on the number input are HTML5 constraints. They help — the browser won't let the user type letters — but they're not enough on their own. We'll add proper validation shortly."

**Timing:** 3 minutes

---

## **SLIDE 6: Building a Complete Form**

**Slide Title:** Loan Application Form — Multiple Input Types

**Content:**

```tsx
type LoanFormData = {
  applicantName: string;
  email: string;
  loanAmount: number | "";
  loanType: string;
  employmentVerified: boolean;
};

function LoanApplicationForm() {
  const [formData, setFormData] = useState<LoanFormData>({
    applicantName: "",
    email: "",
    loanAmount: "",
    loanType: "",
    employmentVerified: false,
  });

  // Generic handler for text/number/select inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? "" : Number(value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <form>
      <label>
        Applicant Name
        <input
          type="text"
          name="applicantName"
          value={formData.applicantName}
          onChange={handleChange}
        />
      </label>

      <label>
        Email
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </label>

      <label>
        Loan Amount ($)
        <input
          type="number"
          name="loanAmount"
          value={formData.loanAmount}
          onChange={handleChange}
          min={1000}
          max={500000}
        />
      </label>

      <label>
        Loan Type
        <select
          name="loanType"
          value={formData.loanType}
          onChange={handleChange}
        >
          <option value="">Select a type...</option>
          <option value="personal">Personal</option>
          <option value="auto">Auto</option>
          <option value="home">Home</option>
          <option value="business">Business</option>
        </select>
      </label>

      <label>
        <input
          type="checkbox"
          name="employmentVerified"
          checked={formData.employmentVerified}
          onChange={handleChange}
        />
        Employment verified
      </label>

      <button type="submit">Submit Application</button>
    </form>
  );
}
```

**Input Type Quick Reference:**

| Type | `value` prop | `onChange` extracts | Notes |
|---|---|---|---|
| text | `string` | `e.target.value` | Most common |
| number | `number \| ""` | `Number(e.target.value)` | Handle empty string |
| email | `string` | `e.target.value` | Browser adds basic validation |
| select | `string` | `e.target.value` | Include empty option as placeholder |
| checkbox | — | `e.target.checked` | Uses `checked` not `value` |

**Speaker Notes:** "This is the full pattern for a multi-field form. A few things to notice.

First: I'm using a single `formData` state object instead of five separate `useState` calls. This keeps related data together. The generic `handleChange` function uses the input's `name` attribute to know which field to update — `[name]: value` is a computed property key.

Second: checkboxes are different. They use `checked` instead of `value`. The handler checks the input type and branches accordingly.

Third: the select element works just like a text input in React — `value` and `onChange`. The first option with an empty value acts as a placeholder.

This is a pattern you'll use over and over. For M4, your cart won't have a traditional form, but quantity inputs, remove buttons, and any checkout flow will use these same controlled patterns."

**Timing:** 4 minutes

---

## **SLIDE 7: Form Validation — When and How**

**Slide Title:** Validation Patterns

**Content:**

**Three validation strategies:**

| Strategy | When it runs | User experience | Complexity |
|---|---|---|---|
| **On change** | Every keystroke | Immediate feedback (can feel aggressive) | Medium |
| **On blur** | When user leaves a field | Balanced — feedback after intent is clear | Medium |
| **On submit** | When form is submitted | Traditional — all errors at once | Simple |

**Best practice for business forms:** Validate on blur for individual fields, validate on submit for the full form. Show errors inline next to each field.

**Speaker Notes:** "You have options for when to validate. On every change is aggressive — it shows an error while the user is still typing. On blur is smoother — the user finishes typing, tabs away, and then sees the error. On submit is the simplest but delays feedback.

For business apps, the sweet spot is usually on-blur for fields plus on-submit for the full form. The user gets feedback as they move through the form, and a final check catches anything they missed."

**Timing:** 2 minutes

---

## **SLIDE 8: Implementing Validation**

**Slide Title:** Adding Validation to the Loan Form

**Content:**

```tsx
type FormErrors = {
  applicantName?: string;
  email?: string;
  loanAmount?: string;
  loanType?: string;
};

function validateField(
  name: keyof LoanFormData,
  value: string | number | boolean,
): string | undefined {
  switch (name) {
    case "applicantName":
      if (typeof value === "string" && value.trim().length < 2)
        return "Name must be at least 2 characters";
      break;
    case "email":
      if (typeof value === "string" && !value.includes("@"))
        return "Enter a valid email address";
      break;
    case "loanAmount":
      if (value === "" || value === 0) return "Loan amount is required";
      if (typeof value === "number" && value < 1000)
        return "Minimum loan amount is $1,000";
      if (typeof value === "number" && value > 500000)
        return "Maximum loan amount is $500,000";
      break;
    case "loanType":
      if (typeof value === "string" && !value)
        return "Select a loan type";
      break;
  }
  return undefined;
}
```

**Using it in the component:**

```tsx
const [errors, setErrors] = useState<FormErrors>({});
const [touched, setTouched] = useState<Set<string>>(new Set());

const handleBlur = (
  e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>,
) => {
  const { name } = e.target;
  setTouched((prev) => new Set(prev).add(name));
  const error = validateField(
    name as keyof LoanFormData,
    formData[name as keyof LoanFormData],
  );
  setErrors((prev) => ({ ...prev, [name]: error }));
};

// In JSX — show error only after field has been touched
<input
  type="text"
  name="applicantName"
  value={formData.applicantName}
  onChange={handleChange}
  onBlur={handleBlur}
  aria-invalid={touched.has("applicantName") && !!errors.applicantName}
  aria-describedby={errors.applicantName ? "name-error" : undefined}
/>
{touched.has("applicantName") && errors.applicantName && (
  <span id="name-error" className="error" role="alert">
    {errors.applicantName}
  </span>
)}
```

**Key patterns:**

- **`touched` set** — tracks which fields the user has interacted with (don't show errors on fields they haven't visited yet)
- **`onBlur` handler** — validates when the user leaves a field
- **`aria-invalid`** — tells screen readers the field has an error
- **`aria-describedby`** — links the error message to the input
- **`role="alert"`** — announces the error to screen readers

**Speaker Notes:** "Two important patterns here. First: the `touched` set. You don't want to show an error on the name field before the user has even clicked into it. The `touched` set tracks which fields the user has visited. Only touched fields show errors.

Second: the accessibility attributes. `aria-invalid` tells assistive technology that a field has an error. `aria-describedby` links the error message to the field so a screen reader can announce it. `role='alert'` makes the error announcement happen immediately.

Accessibility isn't extra credit — it's a professional standard. Every form you build should have these attributes. Your M4 cart should too."

**Timing:** 4 minutes

---

## **SLIDE 9: Handling Form Submission**

**Slide Title:** Submit, Validate, Respond

**Content:**

```tsx
const [isSubmitting, setIsSubmitting] = useState(false);
const [submitResult, setSubmitResult] = useState<string | null>(null);

const handleSubmit = (e: React.FormEvent) => {
  // 1. Prevent page reload
  e.preventDefault();

  // 2. Validate all fields
  const newErrors: FormErrors = {};
  for (const [key, value] of Object.entries(formData)) {
    const error = validateField(key as keyof LoanFormData, value);
    if (error) newErrors[key as keyof FormErrors] = error;
  }

  // 3. If errors exist, show them and stop
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    setTouched(new Set(Object.keys(formData))); // Mark all fields touched
    return;
  }

  // 4. Submit
  setIsSubmitting(true);
  setSubmitResult(null);

  // In a real app, this would be a fetch() call to your API
  setTimeout(() => {
    setIsSubmitting(false);
    setSubmitResult("Application submitted successfully!");
  }, 1000);
};
```

**In the JSX:**

```tsx
<form onSubmit={handleSubmit}>
  {/* ...inputs... */}

  <button type="submit" disabled={isSubmitting}>
    {isSubmitting ? "Submitting..." : "Submit Application"}
  </button>

  {submitResult && (
    <p className="success" role="status">{submitResult}</p>
  )}
</form>
```

**The submission flow:**

1. **`e.preventDefault()`** — stops the browser from reloading the page
2. **Validate all fields** — run every field through validation
3. **Show errors or submit** — if errors, display them and stop; if clean, proceed
4. **Loading state** — disable the button, show "Submitting..."
5. **Feedback** — show success or error message

**Speaker Notes:** "`e.preventDefault()` is critical. Without it, the browser submits the form the old-fashioned way — full page reload, data sent as URL parameters. You always want to prevent default in React forms.

The validation loop runs every field. If any errors exist, it marks all fields as touched (so errors show everywhere) and returns early. No submission.

The loading state is important for UX. Disable the button so the user can't double-submit. Show 'Submitting...' so they know something's happening. When the response comes back, show success or error.

Right now we're faking the API call with `setTimeout`. In M4, this would be a real `fetch()` to your cart API — same pattern, real endpoint."

**Timing:** 3 minutes

---

## **SLIDE 10: Number Inputs & Quantity Patterns**

**Slide Title:** Number Inputs — Cart Preview

**Content:**

**Basic number input:**

```tsx
<input
  type="number"
  value={quantity}
  onChange={(e) => setQuantity(Number(e.target.value))}
  min={1}
  max={99}
/>
```

**Problem:** Users can type `-5`, `0`, `999`, or even `abc` (on some browsers). HTML `min`/`max` only validate on form submit, not on every keystroke.

**Clamped quantity input (what you'll need for M4):**

```tsx
function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
}: {
  value: number;
  onChange: (newValue: number) => void;
  min?: number;
  max?: number;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = parseInt(e.target.value, 10);
    if (isNaN(raw)) return; // Ignore non-numeric input
    const clamped = Math.min(max, Math.max(min, raw));
    onChange(clamped);
  };

  return (
    <div className="quantity-selector">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        −
      </button>
      <input
        type="number"
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
        aria-label="Quantity"
      />
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
```

**Why this pattern matters for M4:**

- Cart items need quantity selectors (min 1, max stock)
- Increment/decrement buttons are standard e-commerce UX
- `Math.min`/`Math.max` clamping prevents invalid quantities
- `type="button"` on +/− buttons prevents accidental form submission
- `aria-label` on buttons provides screen reader context
- `disabled` on min/max boundaries prevents impossible actions

**Speaker Notes:** "This is the component pattern you'll use in M4 for cart item quantities. Let me walk through why each piece matters.

The +/− buttons give users a quick way to adjust quantity. But notice: they're `type='button'`, not `type='submit'`. If you leave off the type, the browser defaults to `submit`, and clicking − would submit whatever form they're inside. Subtle bug, common mistake.

The clamping logic — `Math.min(max, Math.max(min, raw))` — ensures the value always stays in range. If the user types 200 and max is 99, it clamps to 99. If they type 0 and min is 1, it clamps to 1.

The disabled attribute on the buttons is both UX and logic — you can't go below 1 or above the max. The aria-labels tell screen readers what the buttons do.

This is a reusable component. Build it once, use it for every cart item."

**Timing:** 4 minutes

---

## **SLIDE 11: Connecting Forms to useReducer**

**Slide Title:** Forms + State Management — Full Pattern

**Content:**

**Monday's pattern + Today's pattern:**

```tsx
// In a component that uses Context from Monday
function AddToCartButton({ productId }: { productId: number }) {
  const { dispatch } = useCartContext();

  const handleClick = () => {
    dispatch({ type: "ADD_TO_CART", productId, quantity: 1 });
  };

  return <button onClick={handleClick}>Add to Cart</button>;
}

// Cart item with quantity input
function CartItemRow({ item }: { item: CartItem }) {
  const { dispatch } = useCartContext();

  const handleQuantityChange = (newQuantity: number) => {
    dispatch({
      type: "UPDATE_QUANTITY",
      cartItemId: item.id,
      quantity: newQuantity,
    });
  };

  return (
    <div className="cart-item">
      <span>{item.productName}</span>
      <QuantitySelector
        value={item.quantity}
        onChange={handleQuantityChange}
        min={1}
        max={item.maxStock}
      />
      <span>${(item.price * item.quantity).toFixed(2)}</span>
      <button
        onClick={() => dispatch({ type: "REMOVE_FROM_CART", cartItemId: item.id })}
        aria-label={`Remove ${item.productName} from cart`}
      >
        Remove
      </button>
    </div>
  );
}
```

**The connection:**

- **Monday:** `useReducer` + Context = how state is managed and shared
- **Today:** Controlled inputs = how user actions enter the system
- **Together:** User changes quantity → controlled input calls `onChange` → component dispatches action → reducer updates cart state → all consumers re-render

**Speaker Notes:** "This is Friday's lab in miniature. The `QuantitySelector` from Slide 10 is a controlled component. When the user changes the quantity, it calls `onChange`. The parent component — `CartItemRow` — dispatches an `UPDATE_QUANTITY` action to the cart reducer. The reducer computes the new state. Every component reading from cart context re-renders: the header badge updates, the totals update, the line item updates.

Monday's tools manage state. Today's tools collect input. Together, they're the full frontend pattern for M4."

**Timing:** 3 minutes

---

## **SLIDE 12: LIVE DEMO**

**Slide Title:** Let's Build a Loan Application Form

**Content:**

- Start with an empty form component
- Add controlled inputs one at a time
- Add validation with onBlur
- Add submission handling
- Build a quantity selector component

**[INSTRUCTOR: Switch to VS Code]**

**Speaker Notes:** "Let's build this live. I'll start with an empty component and add inputs one at a time so you can see the controlled pattern build up."

**[See LIVE CODING SCRIPT below]**

**Timing:** 12 minutes

---

## **LIVE CODING SCRIPT (12 minutes)**

### Step 1: Basic Controlled Input (2 min)

Start with `LoanForm.tsx`:

```tsx
import { useState } from "react";

function LoanForm() {
  const [applicantName, setApplicantName] = useState("");

  return (
    <form>
      <label>
        Applicant Name
        <input
          type="text"
          value={applicantName}
          onChange={(e) => setApplicantName(e.target.value)}
        />
      </label>
      <p>You typed: {applicantName}</p>
    </form>
  );
}

export default LoanForm;
```

**Narrate:** "Simplest possible controlled input. State holds the value, input displays it, onChange updates it. See the paragraph below — it updates with every keystroke. That's the power of controlled components: React always knows the current value."

**[Type in the field, show the paragraph updating live]**

### Step 2: Consolidate to Form Object (2 min)

Refactor to use a single state object:

```tsx
type LoanFormData = {
  applicantName: string;
  email: string;
  loanAmount: number | "";
  loanType: string;
};

function LoanForm() {
  const [formData, setFormData] = useState<LoanFormData>({
    applicantName: "",
    email: "",
    loanAmount: "",
    loanType: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  return (
    <form>
      <label>
        Applicant Name
        <input
          type="text"
          name="applicantName"
          value={formData.applicantName}
          onChange={handleChange}
        />
      </label>

      <label>
        Email
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </label>

      <label>
        Loan Amount ($)
        <input
          type="number"
          name="loanAmount"
          value={formData.loanAmount}
          onChange={handleChange}
          min={1000}
          max={500000}
        />
      </label>

      <label>
        Loan Type
        <select name="loanType" value={formData.loanType} onChange={handleChange}>
          <option value="">Select a type...</option>
          <option value="personal">Personal</option>
          <option value="auto">Auto</option>
          <option value="home">Home</option>
        </select>
      </label>
    </form>
  );
}
```

**Narrate:** "Now one state object holds all form data. The generic `handleChange` uses the input's `name` attribute — notice every input has a `name` that matches the key in our state. The computed property `[name]: value` updates the right field. Number inputs get special treatment — we convert the string to a number.

This scales. Add a fifth field? Add a key to the type, add an initial value, add an input with a matching `name`. The handler just works."

### Step 3: Add Validation (3 min)

Add error state, touched state, and `onBlur`:

```tsx
const [errors, setErrors] = useState<Record<string, string | undefined>>({});
const [touched, setTouched] = useState<Set<string>>(new Set());

const validateField = (name: string, value: string | number | ""): string | undefined => {
  switch (name) {
    case "applicantName":
      if (typeof value === "string" && value.trim().length < 2)
        return "Name must be at least 2 characters";
      break;
    case "email":
      if (typeof value === "string" && value.length > 0 && !value.includes("@"))
        return "Enter a valid email";
      break;
    case "loanAmount":
      if (value === "") return "Loan amount is required";
      if (typeof value === "number" && value < 1000) return "Minimum $1,000";
      if (typeof value === "number" && value > 500000) return "Maximum $500,000";
      break;
    case "loanType":
      if (!value) return "Select a loan type";
      break;
  }
  return undefined;
};

const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name } = e.target;
  setTouched(prev => new Set(prev).add(name));
  const error = validateField(name, formData[name as keyof LoanFormData]);
  setErrors(prev => ({ ...prev, [name]: error }));
};
```

Add to each input:

```tsx
<input
  type="text"
  name="applicantName"
  value={formData.applicantName}
  onChange={handleChange}
  onBlur={handleBlur}
  aria-invalid={touched.has("applicantName") && !!errors.applicantName}
/>
{touched.has("applicantName") && errors.applicantName && (
  <span className="error" role="alert">{errors.applicantName}</span>
)}
```

**Narrate:** "I add `onBlur` to every input. When the user leaves a field, we validate it and add the field name to the `touched` set. The error only shows if the field has been touched AND has an error.

Watch — I'll click into the name field, type one letter, then tab out. Error appears: 'Name must be at least 2 characters'. I add another letter, tab out again — error clears. That's the on-blur pattern.

The `aria-invalid` attribute is important — it tells screen readers the field has a problem."

**[Demo: type one character, tab away, show error; type more, tab away, error clears]**

### Step 4: Handle Submission (2 min)

```tsx
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  // Validate all
  const newErrors: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(formData)) {
    newErrors[key] = validateField(key, value);
  }

  const hasErrors = Object.values(newErrors).some(Boolean);
  setErrors(newErrors);
  setTouched(new Set(Object.keys(formData)));

  if (hasErrors) return;

  alert(`Submitted: ${JSON.stringify(formData, null, 2)}`);
};
```

**Narrate:** "On submit: prevent default first — always. Then validate every field. If any errors exist, show them all and return. If clean, submit. I'm using `alert()` for now — in a real app this would be a `fetch()` to your API."

**[Demo: click submit with empty fields — all errors appear at once]**

### Step 5: Build a Quantity Selector (3 min)

Create `QuantitySelector.tsx`:

```tsx
type QuantitySelectorProps = {
  value: number;
  onChange: (newValue: number) => void;
  min?: number;
  max?: number;
};

function QuantitySelector({ value, onChange, min = 1, max = 99 }: QuantitySelectorProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = parseInt(e.target.value, 10);
    if (isNaN(raw)) return;
    onChange(Math.min(max, Math.max(min, raw)));
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        −
      </button>
      <input
        type="number"
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
        style={{ width: "60px", textAlign: "center" }}
        aria-label="Quantity"
      />
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
```

Add a test usage to the form:

```tsx
const [testQuantity, setTestQuantity] = useState(1);

// Inside the form JSX:
<div>
  <p>Test quantity: {testQuantity}</p>
  <QuantitySelector value={testQuantity} onChange={setTestQuantity} />
</div>
```

**Narrate:** "Last piece — the quantity selector. This is the component you'll reuse in M4 for every cart item. Plus and minus buttons, a number input in the middle, clamped to min and max.

Notice: `type='button'` on the +/− so they don't accidentally submit a form. `disabled` when at boundaries. `aria-label` for accessibility.

And it's a fully controlled component — the parent owns the value and the onChange. You can drop this into any component and it just works."

**[Demo: click +/−, type a number directly, show clamping at boundaries]**

**BACKUP PLAN:** Pre-written completed version in `completed/` directory.

---

## **SLIDE 13: Key Takeaways from Demo**

**Slide Title:** What You Just Saw

**Content:**

1. **Controlled inputs** = `value` + `onChange`, always
2. **Generic handler** with `[name]: value` scales to any number of fields
3. **Validation on blur** with a `touched` set = good UX
4. **Submission** = `preventDefault()` + validate all + submit or show errors
5. **Quantity selector** = reusable controlled component for M4 cart

**Speaker Notes:** "Five patterns. You'll use all five on Friday and in M4. The quantity selector in particular — build it once, use it for every cart item."

**Timing:** 1 minute

---

## **SLIDE 14: Accessibility Checklist**

**Slide Title:** Form Accessibility — Non-Negotiable

**Content:**

Every form input should have:

- **`<label>` element** wrapping or linked to the input (via `htmlFor`)
- **`aria-invalid`** when the field has an error
- **`aria-describedby`** pointing to the error message element
- **`role="alert"`** on error messages (announces to screen readers)
- **`aria-label`** on icon-only buttons (like +/−)
- **`disabled`** on buttons that can't be used (submit while loading, −  at min)

**Why this matters:**

- ~15% of users rely on assistive technology
- It's a legal requirement for many business applications
- It makes your app more usable for _everyone_ (keyboard navigation, voice control)

**Speaker Notes:** "I'm not going to spend a lot of time on this because you saw the attributes in the demo. But I want to be clear: these aren't optional. In a business application — banking, insurance, government — accessibility is a legal requirement.

For M4, I'll be looking for `aria-label` on your cart buttons and labels on your inputs. It's a small amount of extra code that makes a big difference."

**Timing:** 1.5 minutes

---

## **SLIDE 15: Common Mistakes**

**Slide Title:** Form Pitfalls

**Content:**

**Mistake 1: Missing `name` attribute**

```tsx
// ❌ Generic handler won't work without name
<input type="text" value={formData.applicantName} onChange={handleChange} />

// ✅ name matches the state key
<input type="text" name="applicantName" value={formData.applicantName} onChange={handleChange} />
```

**Mistake 2: Forgetting `preventDefault()`**

```tsx
// ❌ Page reloads on submit
const handleSubmit = () => { /* ... */ };

// ✅ Prevent browser default behavior
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  // ...
};
```

**Mistake 3: Showing errors before user interacts**

```tsx
// ❌ Error shows immediately — field hasn't been touched
{errors.applicantName && <span>{errors.applicantName}</span>}

// ✅ Only show after user has visited the field
{touched.has("applicantName") && errors.applicantName && (
  <span>{errors.applicantName}</span>
)}
```

**Mistake 4: Using `type="submit"` on non-submit buttons**

```tsx
// ❌ Clicking this submits the form!
<button onClick={() => onChange(value - 1)}>−</button>

// ✅ Explicitly mark as type="button"
<button type="button" onClick={() => onChange(value - 1)}>−</button>
```

**Speaker Notes:** "Four mistakes I see constantly. The `type='button'` one is the sneakiest — you'll add a button inside a form, click it, and the form submits. You'll stare at it for twenty minutes before you realize the default type is `submit`. Save yourself the pain: always be explicit about button types inside forms."

**Timing:** 2 minutes

---

## **SLIDE 16: Friday Lab Preview**

**Slide Title:** Cart UI Workshop — What You'll Build

**Content:**

**Friday you'll combine Monday + Wednesday:**

- `CartProvider` with `useReducer` (Monday's pattern)
- `CartPage` component displaying cart items
- `QuantitySelector` (today's component) for each item
- Add-to-cart button on product cards
- Cart total calculation
- Remove item with confirmation

**What to prepare:**

- Review Monday's Context + useReducer code
- Review today's controlled component patterns
- Think about your cart action types: `ADD_TO_CART`, `REMOVE_FROM_CART`, `UPDATE_QUANTITY`, `CLEAR_CART`

**Speaker Notes:** "Friday is the payoff. Everything from this week comes together. You'll have a working cart UI by end of lab — that's a huge head start on M4.

Think about your action types before Friday. What can a user do to a cart? Add an item, remove an item, change a quantity, clear everything. Those are your actions. The reducer writes itself from there."

**Timing:** 1.5 minutes

---

## **SLIDE 17: Summary**

**Slide Title:** What You Learned Today

**Content:**

**Core Concepts:**

1. **Controlled components** keep React as the single source of truth for input values
2. **Generic handlers** with `[name]: value` scale to any number of fields
3. **Validation** on blur + on submit gives the best user experience
4. **Number inputs** need explicit clamping — HTML min/max aren't enough
5. **Accessibility** attributes (`aria-invalid`, `aria-label`, `role="alert"`) are required, not optional

**Next Steps:**

- **Friday Lab:** Cart UI Workshop — combine useReducer + Context + controlled inputs
- **Week 9:** Cart Backend — API endpoints for cart operations

**Resources:**

- React docs — Forms: https://react.dev/reference/react-dom/components/input
- MDN — ARIA forms: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/forms
- Code from today: [Carmen > Week 8 > Resources]

**Speaker Notes:** "Controlled components, validation, number inputs, accessibility. You have the full toolkit for building professional forms in React. Friday you apply it to the cart. See you then."

**Timing:** 1.5 minutes

---

## **SLIDE 18: Questions?**

**Slide Title:** Questions?

**Content:**

- Questions about controlled components?
- Questions about validation patterns?
- Questions about the quantity selector?
- Questions about Friday's lab?

**Speaker Notes:** "Forms can feel like a lot of boilerplate. That's fair. But the patterns are consistent — once you've built one controlled form, you've built them all. The quantity selector from today will save you an hour on M4.

See you Friday."

**Timing:** 2–3 minutes

---

## **END OF SLIDE DECK**

**Total Duration:** ~45 minutes

**Estimated Timing Breakdown:**

- Introduction & Overview: 3.5 minutes (Slides 1–3)
- HTML vs. React Forms: 3 minutes (Slide 4)
- Controlled Components & Form Building: 7 minutes (Slides 5–6)
- Validation: 6 minutes (Slides 7–8)
- Submission & Number Inputs: 7 minutes (Slides 9–10)
- Forms + State Management: 3 minutes (Slide 11)
- Live Demo: 12 minutes (Slide 12)
- Wrap-up & Application: 5 minutes (Slides 13–17)
- Questions: 2–3 minutes (Slide 18)

---

## **ADDITIONAL INSTRUCTOR NOTES**

### **Key Teaching Points**

1. **Controlled = value + onChange** — say this multiple times. It's the one rule students need to internalize.
2. **`name` attribute matters** — the generic handler pattern depends on it. Students will forget it and wonder why state doesn't update.
3. **`type="button"` inside forms** — this will bite them. Say it in lecture, say it again in lab.
4. **Number inputs are trickier than text** — the empty string handling (`number | ""`) and clamping are patterns they won't guess on their own.
5. **Accessibility is part of the code, not an afterthought** — show `aria-*` attributes as part of the core pattern, not a separate "accessibility slide."

### **Classroom Engagement**

- **Slide 4:** "Who's built a form in HTML before? What happened when you clicked submit?" (Connects to prior knowledge)
- **Slide 7:** "When do you want to see an error — while you're typing or after you've finished?" (Leads to on-blur discussion)
- **Slide 10:** Ask students to list cart interactions that need inputs (quantity, search, checkout fields)
- **Live Demo:** Pause after Step 3 (validation) — ask students to predict what happens when you submit with empty fields

### **Time Management**

- **If running behind:** Skip Slide 14 (Accessibility Checklist) — the attributes are already shown in the demo and code slides
- **If running ahead:** Add a live refactoring of the form to use `useReducer` instead of `useState` for form state — bridges Monday and Wednesday more explicitly
- **Live demo is the priority** — especially the quantity selector (Step 5), since it maps directly to M4

### **Common Student Questions (Prepare Answers)**

1. **"Why not just use HTML5 validation (required, min, max)?"** — HTML5 validation is all-or-nothing (shows browser-native error bubbles, can't style them, no inline errors). React validation gives you full control over when and how errors display.
2. **"Do I need a form library like Formik or React Hook Form?"** — For M4, no. Those libraries help with large forms (10+ fields). Your cart has simple inputs. Learn the fundamentals first.
3. **"Can I use uncontrolled components?"** — Technically yes (with `useRef`), but controlled components are the React standard and what I recommend. Uncontrolled is for rare cases like file inputs.
4. **"Why `number | ""` instead of just `number`?"** — When the user clears the field, the value is an empty string. If you try to convert that to a number, you get `NaN` or `0`, which looks wrong in the input. The union type handles this cleanly.

### **Materials Needed**

- VS Code with Buckeye Lending project
- Browser with React DevTools
- Completed version in `completed/` directory (backup)
- Screen reader demo (optional): show VoiceOver or NVDA reading a form with and without aria attributes

### **Post-Class Follow-Up**

- Upload demo code (starting and completed) to GitHub
- Post slide deck to Carmen
- Post QuantitySelector component as a standalone file students can reference
- Reminder: Friday lab — bring laptops, review Monday and Wednesday code

---

**Last Updated:** March 3, 2026
**Next Review:** After Wednesday, Mar 4 lecture (revise based on student feedback)
