import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalizeFirstLetter(str: string) {
  return str.trim().charAt(0).toUpperCase() + str.trim().slice(1)
};

export function dateConvert(date: Date) {
  return new Date(2025, 1, (date.getDate() - 1) % 3 + 4, date.getHours(), date.getMinutes())
}

export function shortenMessage(msg: string) {
  let temp: string = msg.includes(':') ? msg.split(':')[1].trim() : msg

  return temp
}