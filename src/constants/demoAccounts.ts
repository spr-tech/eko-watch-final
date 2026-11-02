// The demo accounts shown on the sign-in page, grouped Resident | Operator | Ward office.
// Every account is fictional and seeded in the deployed backend. This is the only file
// in src/ that names them: change or remove accounts here (docs/decisions.md, 2026-11-02).
// demo3, demo6 and demo7 are left out until their passwords work on the backend.

// Shared password for the fictional demo accounts. It ships in the bundle on purpose.
export const DEMO_PASSWORD = 'DEMO@123'

export type DemoAccount = { label: string; email: string; password: string }

export type DemoAccountGroup = { role: 'Resident' | 'Operator' | 'Ward office'; accounts: DemoAccount[] }

function group(role: DemoAccountGroup['role'], accounts: Omit<DemoAccount, 'password'>[]): DemoAccountGroup {
  return { role, accounts: accounts.map((account) => ({ ...account, password: DEMO_PASSWORD })) }
}

export const DEMO_ACCOUNT_GROUPS: DemoAccountGroup[] = [
  group('Resident', [
    { label: 'Resident 1', email: 'demo1@example.invalid' },
    { label: 'Resident 2', email: 'demo2@example.invalid' },
  ]),
  group('Operator', [
    { label: 'Operator 1', email: 'demo4@example.invalid' },
    { label: 'Operator 2', email: 'demo8@example.invalid' },
  ]),
  group('Ward office', [{ label: 'Ward office', email: 'demo5@example.invalid' }]),
]
