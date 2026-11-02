// Line icons used by the state views and forms, drawn like the design's (currentColor,
// round caps). Decorative only: the text beside each one carries the meaning.
import type { ReactNode } from 'react'

function Icon({ size, strokeWidth = 2.2, children }: { size: number; strokeWidth?: number; children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className="shrink-0"
    >
      {children}
    </svg>
  )
}

export function LockIcon({ size = 24 }: { size?: number }) {
  return (
    <Icon size={size}>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </Icon>
  )
}

export function AlertCircleIcon({ size = 24 }: { size?: number }) {
  return (
    <Icon size={size}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5M12 16.5h.01" />
    </Icon>
  )
}

export function WifiOffIcon({ size = 24 }: { size?: number }) {
  return (
    <Icon size={size}>
      <path d="m3 3 18 18" />
      <path d="M8.5 16.4a5 5 0 0 1 7 0M5 12.9a10 10 0 0 1 4.2-2.5M14.8 10.4A10 10 0 0 1 19 12.9M2 9a15 15 0 0 1 4.5-2.8M11 5.1A15 15 0 0 1 22 9" />
      <path d="M12 20h.01" />
    </Icon>
  )
}

export function RefreshIcon({ size = 24 }: { size?: number }) {
  return (
    <Icon size={size}>
      <path d="M20 11a8 8 0 0 0-14.3-4.9L4 8" />
      <path d="M4 4v4h4" />
      <path d="M4 13a8 8 0 0 0 14.3 4.9L20 16" />
      <path d="M20 20v-4h-4" />
    </Icon>
  )
}

export function ListIcon({ size = 24 }: { size?: number }) {
  return (
    <Icon size={size}>
      <path d="M9 6h11M9 12h11M9 18h11" />
      <path d="M4.5 6h.01M4.5 12h.01M4.5 18h.01" />
    </Icon>
  )
}

export function EyeIcon({ size = 20 }: { size?: number }) {
  return (
    <Icon size={size} strokeWidth={2}>
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </Icon>
  )
}

export function EyeOffIcon({ size = 20 }: { size?: number }) {
  return (
    <Icon size={size} strokeWidth={2}>
      <path d="M10.6 5.1A10 10 0 0 1 12 5c6 0 10 7 10 7a17 17 0 0 1-2.6 3.4M6.6 6.6C3.8 8.4 2 12 2 12s4 7 10 7a9.6 9.6 0 0 0 5.4-1.6" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
      <path d="m3 3 18 18" />
    </Icon>
  )
}

export function CheckIcon({ size = 20 }: { size?: number }) {
  return (
    <Icon size={size} strokeWidth={2.6}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </Icon>
  )
}

export function ChevronLeftIcon({ size = 18 }: { size?: number }) {
  return (
    <Icon size={size} strokeWidth={2.6}>
      <path d="m15 18-6-6 6-6" />
    </Icon>
  )
}

export function PhotoIcon({ size = 30 }: { size?: number }) {
  return (
    <Icon size={size} strokeWidth={1.8}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="10" r="2" />
      <path d="m21 16-5-5L5 20" />
    </Icon>
  )
}

export function PlusIcon({ size = 20 }: { size?: number }) {
  return (
    <Icon size={size} strokeWidth={2.4}>
      <path d="M12 5v14M5 12h14" />
    </Icon>
  )
}
