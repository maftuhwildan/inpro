'use client'

import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/dashboard', label: '📊 Dashboard' },
  { href: '/projects', label: '🏗️ Projects' },
  { href: '/tasks', label: '📋 Tasks' },
  { href: '/reports', label: '📝 Reports' },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">{children}</main>
    </div>
  )
}

function Sidebar() {
  let pathname = '/'
  try {
    pathname = usePathname() ?? '/'
  } catch {
    // SSR fallback
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">Inpro PM</div>
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <a
              key={item.href}
              href={item.href}
              className={`sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
            >
              {item.label}
            </a>
          )
        })}
      </nav>
    </aside>
  )
}
