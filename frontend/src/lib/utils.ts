import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRandomItems<T>(arr: T[], count: number): T[] {
  return arr.sort(() => Math.random() - 0.5).slice(0, count);
}
