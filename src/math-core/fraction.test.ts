import { describe, expect, it } from 'vitest';
import { fraction as f, gcd, lcm, add, subtract, multiply, divide, compare, equal, mixed, fromMixed, commonDenominator, parseFraction } from './fraction';
describe('exact rational arithmetic', () => {
  it('normalizes signs and zero', () => {
    expect(f(6, -8)).toEqual({ n: -3n, d: 4n });
    expect(f(0, -20)).toEqual(f(0));
    expect(gcd(-12n, 18n)).toBe(6n);
    expect(lcm(-6n, 8n)).toBe(24n);
    expect(lcm(0n, 0n)).toBe(0n);
  });
  it('rejects undefined fractions and unsafe number inputs', () => {
    expect(() => f(1, 0)).toThrow();
    expect(() => f(0.5)).toThrow();
    expect(() => f(Number.MAX_SAFE_INTEGER + 1)).toThrow();
    expect(() => divide(f(1), f(0))).toThrow();
  });
  it('calculates all four operations exactly', () => {
    expect(add(f(1, 3), f(1, 6))).toEqual(f(1, 2));
    expect(subtract(f(1, 3), f(1, 2))).toEqual(f(-1, 6));
    expect(multiply(f(6, 7), f(14, 9))).toEqual(f(4, 3));
    expect(divide(f(3, 4), f(2, 5))).toEqual(f(15, 8));
  });
  it('compares huge products without floating point loss', () => {
    const huge = 900719925474099312345n;
    expect(compare(f(huge + 1n, huge), f(huge, huge - 1n))).toBe(-1);
    expect(equal(f(4, 6), f(2, 3))).toBe(true);
  });
  it('converts signed mixed numbers and finds least common partitions', () => {
    expect(mixed(f(-11, 4))).toEqual({ sign: -1, whole: 2n, remainder: 3n, denominator: 4n });
    expect(fromMixed(2n, 3n, 4n, -1)).toEqual(f(-11, 4));
    expect(() => fromMixed(1n, 4n, 4n)).toThrow();
    expect(commonDenominator(f(2, 3), f(1, 4))).toEqual({ a: 8n, b: 3n, d: 12n });
  });
  it('accepts equivalent answers and rejects malformed input', () => {
    expect(parseFraction(' 6 / 8 ')).toEqual(f(3, 4));
    for (const value of ['1/0', '1/2/3', '0.5', '', 'NaN']) expect(parseFraction(value)).toBeNull();
  });
  it('preserves value through splitting, combining, and operation inverses', () => {
    for (let d = 1; d <= 12; d++) for (let n = 0; n <= d; n++) {
      const a = f(n, d);
      for (let k = 1; k <= 6; k++) {
        expect(equal(a, f(n * k, d * k))).toBe(true);
        expect(subtract(add(a, f(k, 7)), f(k, 7))).toEqual(a);
        expect(divide(multiply(a, f(k, 7)), f(k, 7))).toEqual(a);
      }
    }
  });
});
