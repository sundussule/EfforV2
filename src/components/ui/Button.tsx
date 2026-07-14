import { type ButtonHTMLAttributes, type AnchorHTMLAttributes, forwardRef } from 'react'
import { Link, type LinkProps } from 'react-router-dom'

const VARIANTS = {
  primary: 'bg-ink-950 text-white hover:bg-ink-800 disabled:bg-ink-300',
  secondary: 'bg-white text-ink-950 border border-ink-950 hover:bg-ink-50',
  ghost: 'bg-transparent text-ink-950 hover:bg-ink-100',
  accent: 'bg-accent-600 text-white hover:bg-accent-500 disabled:bg-ink-300',
  danger: 'bg-transparent text-red-600 hover:bg-red-50',
  // For use on dark backgrounds (e.g. the homepage hero) — kept as their own
  // variants rather than className overrides, since Tailwind's generated
  // stylesheet order — not className string order — decides which
  // same-property utility wins, which silently broke bg/text overrides here.
  light: 'bg-white text-ink-950 hover:bg-white/90 disabled:bg-white/50',
  outlineLight: 'bg-transparent text-white border border-white/40 hover:bg-white/10',
} as const

const SIZES = {
  sm: 'text-sm px-3.5 py-2',
  md: 'text-sm px-5 py-3',
  lg: 'text-base px-7 py-3.5',
} as const

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60 whitespace-nowrap'

type Variant = keyof typeof VARIANTS
type Size = keyof typeof SIZES

interface CommonProps {
  variant?: Variant
  size?: Size
  className?: string
}

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    as?: 'button'
  }

type ButtonAsLink = CommonProps &
  LinkProps & {
    as: 'link'
  }

type ButtonAsAnchor = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    as: 'a'
  }

type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsAnchor

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { variant = 'primary', size = 'md', className = '', ...rest } = props
  const classes = `${base} ${VARIANTS[variant]} ${SIZES[size]} ${className}`

  if (props.as === 'link') {
    const { as: _as, ...linkProps } = rest as ButtonAsLink
    return <Link className={classes} {...linkProps} />
  }

  if (props.as === 'a') {
    const { as: _as, ...anchorProps } = rest as ButtonAsAnchor
    return <a className={classes} {...anchorProps} />
  }

  const { as: _as, ...buttonProps } = rest as ButtonAsButton
  return <button ref={ref} className={classes} type={buttonProps.type ?? 'button'} {...buttonProps} />
})

Button.displayName = 'Button'
