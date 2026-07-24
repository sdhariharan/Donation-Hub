export function formatDate(value, fallback = 'Not available') {
  if (!value) return fallback

  let date
  if (typeof value.toDate === 'function') date = value.toDate()
  else if (value instanceof Date) date = value
  else date = new Date(value)

  if (Number.isNaN(date.getTime())) return fallback
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

export function getTimestampMillis(value) {
  if (!value) return 0
  if (typeof value.toMillis === 'function') return value.toMillis()
  if (typeof value.toDate === 'function') return value.toDate().getTime()
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? 0 : date.getTime()
}
