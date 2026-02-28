'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, FolderKanban, ListTodo, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/tasks', label: 'Tasks', icon: ListTodo },
  { href: '/reports', label: 'Reports', icon: FileText },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Sidebar />
      <main className="p-8 max-w-6xl">{children}</main>
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
    <aside className="bg-sidebar-background text-sidebar-foreground flex flex-col sticky top-0 h-screen overflow-y-auto">
      <div className="px-5 py-5 text-lg font-bold tracking-tight text-sidebar-primary border-b border-white/[0.08]">
        Inpro PM
      </div>
      <nav className="p-2 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 text-sm rounded-md transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-primary font-medium'
                  : 'text-sidebar-foreground/70 hover:bg-white/[0.06] hover:text-sidebar-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
