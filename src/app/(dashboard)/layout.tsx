/**
 * Dashboard Layout
 *
 * Protected layout for authenticated users.
 * Pages in this group handle their own navigation.
 */

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
