/**
 * Generates numeric range (from <em>start</em> to <em>end</em>)
 */
export function numberRange(start: number, end: number): number[] {
  return new Array(end - start).fill(0).map((d, i) => i + start);
}
