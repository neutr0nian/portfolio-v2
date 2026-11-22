import type { ButtonHTMLAttributes, ReactNode } from 'react'
import './Button.scss'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: 'outline' | 'primary' | 'text'
}

export default function Button({ children, className = '', type = 'button', variant = 'outline', onPointerEnter, onPointerLeave, ...props }: ButtonProps) {
  return (
    <button {...props} className={`button button--${variant} ${className}`.trim()} type={type}
      onPointerEnter={event => {
        const button = event.currentTarget
        const bounds = button.getBoundingClientRect()
        button.style.setProperty('--ink-x', `${event.clientX - bounds.left}px`)
        button.style.setProperty('--ink-y', `${event.clientY - bounds.top}px`)
        onPointerEnter?.(event)
      }}
      onPointerLeave={event => {
        const button = event.currentTarget
        const bounds = button.getBoundingClientRect()
        button.style.setProperty('--ink-x', `${Math.max(0, Math.min(bounds.width, event.clientX - bounds.left))}px`)
        button.style.setProperty('--ink-y', `${Math.max(0, Math.min(bounds.height, event.clientY - bounds.top))}px`)
        onPointerLeave?.(event)
      }}>
      {children}
    </button>
  )
}
