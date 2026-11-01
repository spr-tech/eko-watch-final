// What the top bars show about the signed-in account.
import { ROLE_LABELS } from '@/constants/status'
import type { Role } from '@/types/ekowatch'

// "Demo resident", "Demo operator", "Demo authority", as in the design. Every account is
// a demonstration account.
export function demoRoleLabel(role: Role): string {
  return `Demo ${ROLE_LABELS[role].toLowerCase()}`
}

// Up to two initials from the display name, for the avatar.
export function initials(displayName: string): string {
  return displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('')
}
