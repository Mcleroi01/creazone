export function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(dateString: string | Date): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC'
  };
  
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return new Intl.DateTimeFormat('en-US', options).format(date);
}
