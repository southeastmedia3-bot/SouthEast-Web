export function splitWords(value: string) {
  return value.trim().split(/\s+/).filter(Boolean);
}

export function splitCharacters(value: string) {
  return Array.from(value);
}
