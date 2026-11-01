// "Skip to main content": the first stop for keyboard users, visible only when focused.
export function SkipLink({ targetId }: { targetId: string }) {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only rounded-md bg-bg px-4 py-2 font-bold text-primary focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50"
    >
      Skip to main content
    </a>
  )
}
