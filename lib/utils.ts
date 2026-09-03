import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      fractionalSecondDigits: 3,
    });
  } catch {
    return isoString;
  }
}

export function formatFullDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "medium",
    });
  } catch {
    return isoString;
  }
}

export function truncate(str: string, maxLength: number = 40): string {
  if (!str) return "N/A";
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "...";
}
