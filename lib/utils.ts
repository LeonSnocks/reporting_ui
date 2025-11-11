export function formatNumber(num: number): string {
  return new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

export function formatDate(dateString: string | null | undefined): string {
  // Handle null, undefined, or empty strings
  if (!dateString) {
    return '';
  }
  const date = new Date(dateString);
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return dateString; // Return original string if date is invalid
  }
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: 'short',
  }).format(date);
}

export function formatWeekLabel(year: number, week: number): string {
  return `${year}-KW${week}`;
}

