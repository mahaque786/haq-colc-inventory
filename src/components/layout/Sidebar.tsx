'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { BarChart2, List, Plus, GitCompare, Settings, Coins, CreditCard, Package2 } from 'lucide-react'

const sidebarGroups = [
  {
    label: 'Overview',
    items: [
      { href: '/', label: 'Dashboard', icon: BarChart2 },
      { href: '/inventory', label: 'All Items', icon: List },
    ],
  },
  {
    label: 'Actions',
    items: [
      { href: '/wizard', label: 'Add Item', icon: Plus },
      { href: '/compare', label: 'Compare Items', icon: GitCompare },
    ],
  },
  {
    label: 'Categories',
    items: [
      { href: '/inventory?type=coin', label: 'Coins', icon: Coins },
      { href: '/inventory?type=currency', label: 'Currency', icon: CreditCard },
      { href: '/inventory?type=tcg', label: 'TCG Cards', icon: Package2 },
    ],
  },
  {
    label: 'System',
    items: [
      { href: '/settings', label: 'Settings', icon: Settings },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 min-h-screen bg-white border-r border-gray-200 py-4">
      {sidebarGroups.map((group) => (
        <div key={group.label} className="mb-4">
          <p className="px-4 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {group.label}
          </p>
          {group.items.map((item) => {
            const Icon = item.icon
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 text-sm transition-colors',
                  active
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </div>
      ))}
    </aside>
  )
}
