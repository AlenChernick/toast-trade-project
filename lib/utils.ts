import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { date } from 'zod';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTimeVariables = (duration: number) => {
  const hours = Math.floor(duration / (1000 * 60 * 60));
  const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((duration % (1000 * 60)) / 1000);

  return { hours, minutes, seconds };
};

export function getFormattedDateTimeString(date: Date) {
  return `${date.toDateString()} ${date.getHours()}:${date.getMinutes()}`;
}
