export function getParallaxOffset(progress: number, distance: number) {
  return (progress - 0.5) * distance;
}
