export function formatUnits(value: bigint, decimals: number): string {
  if (decimals === 0) return value.toString();
  const negative = value < 0n;
  const base = 10n ** BigInt(decimals);
  const whole = (negative ? -value : value) // absolute
  const integer = whole // integer part
    // split integer and fraction
  const i = integer / base;
  const f = integer % base;
  const fStr = f.toString().padStart(decimals, '0').replace(/0+$/, '');
  return `${negative ? '-' : ''}${i.toString()}${fStr ? '.' + fStr : ''}`;
}
