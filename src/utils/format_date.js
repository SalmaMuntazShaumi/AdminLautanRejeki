// utils/formatDate.js

export function formatDate(date) {
  return new Intl.DateTimeFormat(
    'id-ID',
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }
  ).format(new Date(date));
}