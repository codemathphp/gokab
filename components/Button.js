'use client'

export default function Button({ children, variant = 'primary', size = 'md', ...props }) {
  const baseStyles = 'font-semibold rounded-xl transition-colors focus:outline-none'

  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark',
    secondary: 'bg-secondary text-white hover:bg-gray-700',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    light: 'bg-gray-100 text-secondary hover:bg-gray-200',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'w-full py-4 text-lg',
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]}`}
      {...props}
    >
      {children}
    </button>
  )
}
