const VARIANTS = {
  primary:
    'bg-kindred-orange text-slate-950 shadow-sm hover:bg-kindred-orange-dark hover:text-white',
  secondary: 'bg-kindred-cream text-slate-900 hover:bg-kindred-cream-deep',
  outline:
    'border border-kindred-orange bg-white text-kindred-orange-dark hover:bg-kindred-cream',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  ghost: 'text-slate-700 hover:bg-kindred-cream hover:text-slate-950',
}

const SIZES = {
  small: 'px-3 py-2 text-sm',
  medium: 'px-4 py-2.5 text-sm',
  large: 'px-5 py-3 text-base',
}

function Button({
  variant = 'primary',
  size = 'medium',
  loading = false,
  loadingText = 'Please wait...',
  disabled,
  className = '',
  children,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center rounded-xl font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kindred-orange focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant] || VARIANTS.primary} ${SIZES[size] || SIZES.medium} ${className}`}
      {...props}
    >
      {loading ? loadingText : children}
    </button>
  )
}

export default Button
