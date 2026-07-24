function EmptyState({ icon: Icon, title, description, children }) {
  return (
    <div className="flex flex-col items-center rounded-xl bg-kindred-cream/60 px-4 py-10 text-center">
      {Icon && (
        <div className="mb-4 rounded-full bg-white p-3 text-kindred-orange-dark shadow-sm">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
      )}
      <h3 className="font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        {description}
      </p>
      {children && <div className="mt-5">{children}</div>}
    </div>
  )
}

export default EmptyState
