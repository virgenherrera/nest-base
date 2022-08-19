export function byteLengthHumanize(byteLength: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let idx = 0;

  while (byteLength >= 1024) {
    byteLength /= 1024;
    idx++;
  }

  const roundedSize = Math.round(byteLength * 100) / 100;
  const fixedSize = roundedSize.toFixed(2);

  return `${fixedSize} ${units[idx]}`;
}
