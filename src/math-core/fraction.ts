/** Exact, immutable rational arithmetic. BigInt keeps intermediate products exact. */
export type Fraction = Readonly<{ n: bigint; d: bigint }>;
const integer = (value: bigint | number): bigint => {
  if (typeof value === 'number' && !Number.isSafeInteger(value)) throw new RangeError('Expected a safe integer');
  return BigInt(value);
};
export function gcd(a: bigint, b: bigint): bigint {
  a = a < 0n ? -a : a; b = b < 0n ? -b : b;
  while (b !== 0n) [a, b] = [b, a % b];
  return a;
}
export function lcm(a: bigint, b: bigint): bigint {
  if (!a || !b) return 0n;
  const value = (a / gcd(a, b)) * b;
  return value < 0n ? -value : value;
}
export function fraction(n: bigint | number, d: bigint | number = 1): Fraction {
  n = integer(n); d = integer(d);
  if (!d) throw new RangeError('Zero denominator');
  if (d < 0n) { n = -n; d = -d; }
  const divisor = gcd(n, d);
  return Object.freeze({ n: n / divisor, d: d / divisor });
}
export const add = (a: Fraction, b: Fraction) => fraction(a.n * b.d + b.n * a.d, a.d * b.d);
export const subtract = (a: Fraction, b: Fraction) => fraction(a.n * b.d - b.n * a.d, a.d * b.d);
export const multiply = (a: Fraction, b: Fraction) => fraction(a.n * b.n, a.d * b.d);
export const divide = (a: Fraction, b: Fraction) => fraction(a.n * b.d, a.d * b.n);
export function compare(a: Fraction, b: Fraction): -1 | 0 | 1 {
  const delta = a.n * b.d - b.n * a.d;
  return delta < 0n ? -1 : delta > 0n ? 1 : 0;
}
export const equal = (a: Fraction, b: Fraction) => compare(a, b) === 0;
export function mixed(a: Fraction) {
  const magnitude = a.n < 0n ? -a.n : a.n;
  return { sign: a.n < 0n ? -1 : 1, whole: magnitude / a.d, remainder: magnitude % a.d, denominator: a.d };
}
export function fromMixed(whole: bigint, remainder: bigint, denominator: bigint, sign: 1 | -1 = 1) {
  if (whole < 0n || remainder < 0n || denominator <= 0n || remainder >= denominator) throw new RangeError('Invalid mixed number');
  return fraction(BigInt(sign) * (whole * denominator + remainder), denominator);
}
export function commonDenominator(a: Fraction, b: Fraction) {
  const d = lcm(a.d, b.d);
  return { a: a.n * (d / a.d), b: b.n * (d / b.d), d };
}
export function parseFraction(value: string): Fraction | null {
  const match = value.trim().match(/^([+-]?\d+)(?:\s*\/\s*([+-]?\d+))?$/);
  if (!match) return null;
  try { return fraction(BigInt(match[1]), BigInt(match[2] ?? '1')); } catch { return null; }
}
