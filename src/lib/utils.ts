import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatter = (date: Date) => {
  const formatter = new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'short',
  })

  return formatter.format(date)
}
