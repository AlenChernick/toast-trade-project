import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { date } from 'zod';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFormattedDateTimeString(date: Date) {
  return `${date.toDateString()} ${date.getHours()}:${date.getMinutes()}`;
}
