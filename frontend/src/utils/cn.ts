export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export const delay = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));
