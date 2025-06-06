export function formatDate(date: string | Date | undefined): string {
  if (!date) return ''

  return new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatBalance(value: number): string {
  return value.toLocaleString()
}