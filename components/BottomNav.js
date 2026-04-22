'use client'

import Link from 'next/link'
import { FiHome, FiStar, FiMessageCircle, FiUser } from 'react-icons/fi'

export default function BottomNav({ currentPath }) {
  const items = [
    { icon: FiHome, label: 'Home', href: '/rider/home' },
    { icon: FiStar, label: 'Saved', href: '/rider/saved' },
    { icon: FiMessageCircle, label: 'Messages', href: '/rider/messages' },
    { icon: FiUser, label: 'Profile', href: '/rider/profile' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 max-w-md mx-auto">
      <div className="flex justify-around">
        {items.map((item) => {
          const IconComponent = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center py-4 text-xs font-semibold transition-colors ${
                currentPath === item.href
                  ? 'text-primary border-t-2 border-primary'
                  : 'text-gray-600 hover:text-secondary'
              }`}
            >
              <IconComponent size={24} className="mb-1" />
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
