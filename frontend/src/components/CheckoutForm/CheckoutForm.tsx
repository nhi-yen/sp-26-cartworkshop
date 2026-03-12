import { useState } from "react";
import styles from "./CheckoutForm.module.css";
import { useCartContext } from "../../contexts/CartContext";

// US States list (abbreviated)
const US_STATES = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
];

interface FormData {
  fullName: string;
  email: string;
  shippingAddress: string;
  city: string;
  state: string;
  zipCode: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  shippingAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export function CheckoutForm() {
  const { cartTotal, cartItemCount, dispatch } = useCartContext();

  // Form data state (controlled component)
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    shippingAddress: "",
    city: "",
    state: "",
    zipCode: "",
  });

  // Validation state
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Validate individual field (Wednesday, Slide 7)
  const validateField = (name: keyof FormData, value: string): string | undefined => {
    switch (name) {
      case "fullName":
        if (!value.trim()) return "Full name is required";
        if (value.trim().length < 2) return "Full name must be at least 2 characters";
        return undefined;

      case "email":
        if (!value.trim()) return "Email is required";
        if (!value.includes("@")) return "Email must contain @";
        return undefined;

      case "shippingAddress":
        if (!value.trim()) return "Shipping address is required";
        if (value.trim().length < 5) return "Shipping address must be at least 5 characters";
        return undefined;

      case "city":
        if (!value.trim()) return "City is required";
        return undefined;

      case "state":
        if (!value.trim()) return "State is required";
        return undefined;

      case "zipCode":
        if (!value.trim()) return "Zip code is required";
        if (!/^\d{5}$/.test(value)) return "Zip code must be exactly 5 digits";
        return undefined;

      default:
        return undefined;
    }
  };

  // Handle input change (generic, Wednesday Slide 6)
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.currentTarget;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle blur - validate and mark as touched (Wednesday, Slide 7)
  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name } = e.currentTarget;
    const fieldName = name as keyof FormData;
    const fieldValue = formData[fieldName];

    // Add to touched set
    setTouched((prev) => new Set(prev).add(name));

    // Validate field
    const error = validateField(fieldName, fieldValue);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  // Validate all fields (Wednesday, Slide 9)
  const validateAllFields = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    (Object.keys(formData) as Array<keyof FormData>).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    // If there are errors, mark all fields as touched
    if (!isValid) {
      setTouched(new Set(Object.keys(formData)));
      setErrors(newErrors);
    } else {
      setErrors({});
    }

    return isValid;
  };

  // Handle form submission (Wednesday, Slide 9)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate all fields
    if (!validateAllFields()) {
      return;
    }

    // Show processing state
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Dispatch CLEAR_CART action
    dispatch({ type: "CLEAR_CART" });

    // Show success message
    setShowSuccess(true);
    setIsSubmitting(false);

    // Reset form after a delay
    setTimeout(() => {
      setFormData({
        fullName: "",
        email: "",
        shippingAddress: "",
        city: "",
        state: "",
        zipCode: "",
      });
      setTouched(new Set());
      setShowSuccess(false);
    }, 2000);
  };

  if (showSuccess) {
    return (
      <div className={styles.successMessage} role="alert">
        <p>✓ Order placed successfully!</p>
        <p>Thank you for your purchase.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h3>Shipping Information</h3>

      {/* Full Name */}
      <div className={styles.formGroup}>
        <label htmlFor="fullName">Full Name *</label>
        <input
          id="fullName"
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={touched.has("fullName") && !!errors.fullName}
          aria-describedby={
            touched.has("fullName") && errors.fullName ? "fullName-error" : undefined
          }
        />
        {touched.has("fullName") && errors.fullName && (
          <span id="fullName-error" className={styles.error} role="alert">
            {errors.fullName}
          </span>
        )}
      </div>

      {/* Email */}
      <div className={styles.formGroup}>
        <label htmlFor="email">Email *</label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={touched.has("email") && !!errors.email}
          aria-describedby={touched.has("email") && errors.email ? "email-error" : undefined}
        />
        {touched.has("email") && errors.email && (
          <span id="email-error" className={styles.error} role="alert">
            {errors.email}
          </span>
        )}
      </div>

      {/* Shipping Address */}
      <div className={styles.formGroup}>
        <label htmlFor="shippingAddress">Shipping Address *</label>
        <input
          id="shippingAddress"
          type="text"
          name="shippingAddress"
          value={formData.shippingAddress}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={touched.has("shippingAddress") && !!errors.shippingAddress}
          aria-describedby={
            touched.has("shippingAddress") && errors.shippingAddress
              ? "shippingAddress-error"
              : undefined
          }
        />
        {touched.has("shippingAddress") && errors.shippingAddress && (
          <span id="shippingAddress-error" className={styles.error} role="alert">
            {errors.shippingAddress}
          </span>
        )}
      </div>

      {/* City and State Row */}
      <div className={styles.row}>
        {/* City */}
        <div className={styles.formGroup}>
          <label htmlFor="city">City *</label>
          <input
            id="city"
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={touched.has("city") && !!errors.city}
            aria-describedby={touched.has("city") && errors.city ? "city-error" : undefined}
          />
          {touched.has("city") && errors.city && (
            <span id="city-error" className={styles.error} role="alert">
              {errors.city}
            </span>
          )}
        </div>

        {/* State */}
        <div className={styles.formGroup}>
          <label htmlFor="state">State *</label>
          <select
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={touched.has("state") && !!errors.state}
            aria-describedby={touched.has("state") && errors.state ? "state-error" : undefined}
          >
            <option value="">— Select State —</option>
            {US_STATES.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name} ({s.code})
              </option>
            ))}
          </select>
          {touched.has("state") && errors.state && (
            <span id="state-error" className={styles.error} role="alert">
              {errors.state}
            </span>
          )}
        </div>
      </div>

      {/* Zip Code */}
      <div className={styles.formGroup}>
        <label htmlFor="zipCode">Zip Code *</label>
        <input
          id="zipCode"
          type="text"
          name="zipCode"
          value={formData.zipCode}
          onChange={handleChange}
          onBlur={handleBlur}
          maxLength={5}
          aria-invalid={touched.has("zipCode") && !!errors.zipCode}
          aria-describedby={
            touched.has("zipCode") && errors.zipCode ? "zipCode-error" : undefined
          }
        />
        {touched.has("zipCode") && errors.zipCode && (
          <span id="zipCode-error" className={styles.error} role="alert">
            {errors.zipCode}
          </span>
        )}
      </div>

      {/* Order Summary */}
      <div className={styles.orderSummary}>
        <p>
          <strong>Items:</strong> {cartItemCount}
        </p>
        <p>
          <strong>Total:</strong> ${cartTotal.toFixed(2)}
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className={styles.submitButton}
        disabled={isSubmitting || cartItemCount === 0}
        aria-label="Place order"
      >
        {isSubmitting ? "Processing..." : "Place Order"}
      </button>
    </form>
  );
}
