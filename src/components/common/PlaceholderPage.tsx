// TEMPORARY: what each route shows until its screen is built. Only the page heading and
// the page component's name, so the routes can be clicked through.
export function PlaceholderPage({ title, component }: { title: string; component: string }) {
  return (
    <>
      <h1 className="text-[clamp(1.75rem,2.2vw,1.9rem)] leading-[1.15] font-extrabold tracking-[-0.6px] text-text">
        {title}
      </h1>
      <p className="mt-2 text-text-muted">{component}</p>
    </>
  )
}
