export function getAriaCurrent(isActive: boolean) {
  return isActive ? "page" : undefined;
}

export function isModifiedEvent(event: MouseEvent | KeyboardEvent) {
  return event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
}
