// The demo accounts (SignIn.dc.html "Demo accounts"), laid out like FoodBridge's: three
// columns, Resident | Operator | Ward office, a button per account showing its name.
// Choosing one fills in the email and password and moves focus to Sign in; the user
// still signs in themselves. The accounts come from constants/demoAccounts.ts only.
import { DEMO_ACCOUNT_GROUPS, type DemoAccount } from '@/constants/demoAccounts'

type DemoAccountsProps = { onPick: (account: DemoAccount) => void }

export function DemoAccounts({ onPick }: DemoAccountsProps) {
  return (
    <section aria-labelledby="demo-accounts" className="border-t border-skeleton pt-3 short:pt-2.5">
      <h2 id="demo-accounts" className="font-extrabold">
        Demo accounts
      </h2>
      <p className="text-sm text-text-muted">Choose an account to fill in the email and password.</p>
      <div className="mt-2 flex">
        {DEMO_ACCOUNT_GROUPS.map((group) => {
          const headingId = `demo-${group.role.toLowerCase().replace(' ', '-')}`
          return (
            <section
              key={group.role}
              aria-labelledby={headingId}
              className="min-w-0 flex-1 basis-0 border-l border-border px-2 first:border-l-0 first:pl-0 last:pr-0"
            >
              <h3 id={headingId} className="text-xs font-extrabold tracking-wide text-text-muted uppercase">
                {group.role}
              </h3>
              <ul className="mt-1.5 flex flex-col gap-1.5">
                {group.accounts.map((account) => (
                  <li key={account.email}>
                    <button
                      type="button"
                      onClick={() => onPick(account)}
                      className="min-h-9 w-full rounded-md border border-border-input bg-bg px-2 text-left text-sm font-bold whitespace-nowrap text-primary hover:bg-primary-light short:min-h-8"
                    >
                      {account.label}
                      <span className="sr-only">: fill in {account.email}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>
    </section>
  )
}
