import { TIME_AGO, getTimeAgoMessage } from '@/constants/gujaratiStrings';

export function timeAgo(dateString: string): string {
  const now = new Date();
  const past = new Date(dateString);

  const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (seconds < 60) return TIME_AGO.JUST_NOW;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return getTimeAgoMessage(minutes, 'MINUTES_AGO');

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return getTimeAgoMessage(hours, 'HOURS_AGO');

  const days = Math.floor(hours / 24);
  if (days < 7) return getTimeAgoMessage(days, 'DAYS_AGO');

  const weeks = Math.floor(days / 7);
  if (weeks < 4) return getTimeAgoMessage(weeks, 'WEEKS_AGO');

  const months = Math.floor(days / 30);
  if (months < 12) return getTimeAgoMessage(months, 'MONTHS_AGO');

  const years = Math.floor(months / 12);
  return getTimeAgoMessage(years, 'YEARS_AGO');
}