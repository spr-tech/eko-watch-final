import { Link } from 'react-router'
import { PageHeader } from '@/components/common/PageHeader'
import { DemoNotice } from '@/components/layout/DemoNotice'
import { ROUTES } from '@/constants/routes'

export function NotFoundPage() {
  return (
    <div className="mx-auto flex w-full max-w-295 flex-1 flex-col px-4 py-6 md:px-8">
      <PageHeader title="Page not found" subtitle="This address doesn't match any page in EkoWatch." />
      <Link to={ROUTES.home} className="self-start font-bold text-primary underline underline-offset-4">
        Go to the EkoWatch home page
      </Link>
      <DemoNotice className="mt-auto pt-6" />
    </div>
  )
}
