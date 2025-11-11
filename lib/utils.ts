export function formatNumber(num: number): string {
  return new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: 'short',
  }).format(date);
}

export function formatWeekLabel(year: number, week: number): string {
  return `${year}-KW${week}`;
}

