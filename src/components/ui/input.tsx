// Input
// Owner: Muizz
//
// Done when:
// - [x] Works inside FormField
// - [x] Forwards ref (React Hook Form)
// - [x] One edge, no layout shift (checked from code and generated CSS 2026-10-25): 1px
//       --color-border-input; invalid 2px --color-danger; focused 2px --color-focus drawn on
//       the edge, which wins over invalid
// - [ ] States viewed in a browser: normal, focused, invalid, invalid and focused
// - [ ] Keyboard-only test passed, screen reader checked once
// - [x] Typed props, no `any`, colours from tokens.css
// - [ ] Reviewed by one other interface engineer
//
// Use inside FormField so it gets its label, hint and error wiring:
//   <FormField label="Quantity" required>
//     {(field) => <Input type="number" {...field} {...register("quantity")} />}
//   </FormField>
//
// forwardRef makes it work with React Hook Form's register().
// Error styling switches on automatically from aria-invalid, which FormField sets.
// The border is always 1px, so the field never changes size: the invalid edge adds a 1px
// inset shadow, and the focus ring is an outline drawn inward over the edge (no offset).

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, type = "text", ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "h-10 w-full rounded-[var(--radius-md)] px-3 text-sm",
        "bg-[var(--color-bg)] text-[var(--color-text)] font-[family-name:var(--font-sans)]",
        "border border-[var(--color-border-input)]",
        "placeholder:text-[var(--color-text-muted)]",
        "aria-[invalid=true]:border-[var(--color-danger)]",
        "aria-[invalid=true]:[box-shadow:inset_0_0_0_1px_var(--color-danger)]",
        // Outlines paint above borders and shadows, so focus covers the invalid edge
        // (one ring, never two). At least 2px, so it always covers the 1px inset too.
        "focus-visible:[outline:max(2px,var(--focus-ring-width))_solid_var(--color-focus)]",
        "focus-visible:[outline-offset:calc(-1*max(2px,var(--focus-ring-width)))]",
        "disabled:cursor-not-allowed disabled:bg-[var(--color-surface)] disabled:opacity-60",
        className,
      )}
      {...rest}
    />
  );
});
