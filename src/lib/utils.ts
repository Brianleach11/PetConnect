import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function chatHrefConstructor(id1: string | null, id2: string | null, id3: number | null) {
  if(id1 && id2 && id3){
    const sortedIds = [id1, id2].sort()
    return `${sortedIds[0]}--${sortedIds[1]}--${id3}`
  }
}