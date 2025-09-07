import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w\-]+/g, "") // Remove all non-word characters
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

export function capitalize(val: string) {
  return (
    String(val).charAt(0).toUpperCase() + String(val).slice(1).toLowerCase()
  );
}

export const getInitialsFromName = (text: string) => {
  if (!text || typeof text !== "string") return ""; // Handle empty or invalid input

  const words = text.trim().split(/\s+/); // Trim and split by whitespace
  if (words.length === 1) {
    // If it's a one-word name
    return words[0].substring(0, 2).toUpperCase();
  }

  // Return the first letter of the first two words
  return (words[0][0] + (words[1]?.[0] || "")).toUpperCase();
};
