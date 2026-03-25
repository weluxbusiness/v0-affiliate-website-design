import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Normalizes undefined to null for consistent type handling.
 * Use this for .find() results, optional chaining, and database responses.
 */
export function ensure<T>(value: T | undefined | null): T | null {
  return value ?? null
}
