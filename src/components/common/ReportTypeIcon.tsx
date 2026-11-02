// The tile beside each report (Reports and ReportDetail boards): waves for a flooded road,
// a grate for a blocked drain, a crossed-out bin for a missed pickup, a heap for dumping.
// Decorative only: the report type is always written beside it.
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import type { ReportType } from '@/types/ekowatch'

const ICONS: Record<ReportType, { tone: string; paths: ReactNode }> = {
  FLOODED_ROAD: {
    tone: 'bg-primary-light text-primary',
    paths: <path d="M3 9q3-3 6 0t6 0t6 0M3 14q3-3 6 0t6 0t6 0M3 19q3-3 6 0t6 0t6 0" />,
  },
  BLOCKED_DRAIN: {
    tone: 'bg-primary-light text-primary',
    paths: (
      <>
        <rect x="3" y="5" width="18" height="10" rx="2" />
        <path d="M7 5v10M11 5v10M15 5v10M19 5v10M6 19h4M14 19h4" />
      </>
    ),
  },
  MISSED_PICKUP: {
    tone: 'bg-danger-light text-danger',
    paths: <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11l4 4M14 11l-4 4" />,
  },
  ILLEGAL_DUMPING: {
    tone: 'bg-warning-light text-warning',
    paths: <path d="M3 20h18M5 20l2-6h4l2 6M12 20l2.5-8h4L21 20M9 14V9l2-2" />,
  },
}

const SIZES = {
  xs: { box: 'size-8 rounded-[9px]', px: 18 },
  sm: { box: 'size-9 rounded-md', px: 20 },
  md: { box: 'size-11 rounded-xl', px: 22 },
  lg: { box: 'size-13 rounded-card', px: 26 },
}

export function ReportTypeIcon({ reportType, size = 'md' }: { reportType: ReportType; size?: keyof typeof SIZES }) {
  const { tone, paths } = ICONS[reportType]
  const { box, px } = SIZES[size]
  return (
    <span aria-hidden="true" className={cn('flex shrink-0 items-center justify-center', box, tone)}>
      <svg width={px} height={px} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {paths}
      </svg>
    </span>
  )
}
