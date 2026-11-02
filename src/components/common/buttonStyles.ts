// The design's three button looks, for <button> and <Link> alike:
// green (main action), navy (secondary action) and line (quiet action).
const base =
  'inline-flex items-center justify-center gap-2 rounded-md font-extrabold disabled:cursor-not-allowed disabled:opacity-60'

export const buttonStyles = {
  green: `${base} min-h-11.5 bg-action px-5 text-base text-text hover:bg-action-hover`,
  navy: `${base} min-h-11 bg-text px-4 text-white hover:bg-primary-hover`,
  line: `${base} min-h-11 border border-border-input bg-bg px-4 text-text hover:bg-surface-hover`,
} as const
