'use client'

import { FiMenu } from 'react-icons/fi'

export default function TopBar({ onMenuClick, showMenu = true }) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-4 flex justify-between items-center">
      {/* Logo */}
      <div className="flex-1">
        <img
          src="/main_logo.png"
          alt="goKab"
          className="h-8 object-contain"
        />
      </div>

      {/* Menu Button */}
      {showMenu && (
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
          aria-label="Open menu"
        >
          <FiMenu size={24} className="text-gray-800" />
        </button>
      )}
    </div>
  )
}
