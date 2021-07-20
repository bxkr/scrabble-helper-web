export default function generateAlphabeticalArray(start: string, end: string): string[] {
  return Array.from(
    String.fromCharCode(
      ...[...Array(end.charCodeAt(0) - start.charCodeAt(0) + 1).keys()].map(
        (i) => i + start.charCodeAt(0),
      ),
    ),
  );
}
