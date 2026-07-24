function Select({
  label,
  name,
  options,
  placeholder,
  helperText,
  error,
  className = '',
  ...props
}) {
  const helperId = `${name}-helper`
  const errorId = `${name}-error`

  return (
    <div className={className}>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        {label}
      </label>
      <select
        id={name}
        name={name}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : helperText ? helperId : undefined}
        className={`w-full rounded-xl border bg-white px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 ${
          error
            ? 'border-red-400 focus:border-red-600 focus:ring-red-600/20'
            : 'border-slate-300 focus:border-kindred-orange focus:ring-kindred-orange/25'
        }`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <p id={errorId} className="mt-1.5 text-sm text-red-700">
          {error}
        </p>
      ) : (
        helperText && (
          <p id={helperId} className="mt-1.5 text-sm text-slate-500">
            {helperText}
          </p>
        )
      )}
    </div>
  )
}

export default Select
