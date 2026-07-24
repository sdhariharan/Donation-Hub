function Card({ children, padded = true, className = '', ...props }) {
  return (
    <section
      className={`rounded-2xl border border-orange-100 bg-white shadow-sm shadow-orange-900/[0.03] ${
        padded ? 'p-5 sm:p-6' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </section>
  )
}

export default Card
