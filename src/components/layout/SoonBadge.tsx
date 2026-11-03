// The small "Soon" badge on a menu link whose page isn't built yet. Screen readers hear
// ", coming soon" after the link name instead of the badge text.
import { cn } from '@/lib/cn'

export function SoonBadge({ className }: { className?: string }) {
  return (
    <>
      <span
        aria-hidden="true"
        className={cn(
          'rounded-full bg-warning-light px-1.5 py-px text-[11px] leading-4 font-extrabold whitespace-nowrap text-warning-dark',
          className,
        )}
      >
        Soon
      </span>
      <span className="sr-only">, coming soon</span>
    </>
  )
}
