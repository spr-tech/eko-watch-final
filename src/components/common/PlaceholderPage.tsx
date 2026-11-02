// TEMPORARY: what each signed-in route shows until its screen is built. Only the page
// heading and the page component's name, so the routes can be clicked through.
import { PageHeader } from '@/components/common/PageHeader'

export function PlaceholderPage({ title, component }: { title: string; component: string }) {
  return <PageHeader title={title} subtitle={component} />
}
