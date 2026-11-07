import type { Mission, Rational } from '../content/missions';
import { add, divide, equal, fraction, gcd, lcm, multiply, subtract, compare, type Fraction } from '../math-core/fraction';
export type Draft = { value: number; secondary: number; order: number[]; hints: boolean; attempts: number };
export const rational = ([n,d]: Rational) => fraction(n,d);
export const operationSymbol = { add: '+', subtract: '−', multiply: '×', divide: '÷' };
export function operationResult(m: Extract<Mission, { kind: 'operation' }>) {
  return ({ add, subtract, multiply, divide })[m.operation](rational(m.a), rational(m.b));
}
export function initialDraft(m: Mission): Draft {
  return { value: m.kind === 'equivalent' || m.kind === 'simplify' ? 1 : m.kind === 'denominator' ? 4 : 0, secondary: 0, order: m.kind === 'order' ? m.fractions.map((_,i) => i) : [1,0], hints: false, attempts: 0 };
}
export function remainderValues(m: Extract<Mission, { kind: 'remainder' }>) {
  const first = multiply(fraction(m.total), rational(m.first));
  const remaining = subtract(fraction(m.total), first);
  const second = multiply(remaining, rational(m.second));
  return { first, second, remaining, final: subtract(remaining, second) };
}
export function balanceValue(m: Extract<Mission, { kind: 'balance' }>, value: number) {
  return add(multiply(rational(m.coefficient), fraction(value)), rational(m.offset));
}
export function solution(m: Mission): Fraction {
  switch (m.kind) {
    case 'pieces': return rational(m.target);
    case 'equivalent': case 'simplify': return rational(m.source);
    case 'denominator': return fraction(lcm(rational(m.a).d, rational(m.b).d));
    case 'order': return fraction(0);
    case 'operation': return operationResult(m);
    case 'balance': return divide(subtract(rational(m.target), rational(m.offset)), rational(m.coefficient));
    case 'remainder': return remainderValues(m).final;
    case 'reverse': return divide(fraction(m.final + m.deduction), rational(m.multiplier));
  }
}
export function validateMission(m: Mission, draft: Draft): boolean {
  if (![draft.value, draft.secondary].every(Number.isSafeInteger)) return false;
  const answer = solution(m);
  switch (m.kind) {
    case 'pieces': return equal(fraction(draft.value, m.parts), answer);
    case 'equivalent': return m.source[1] * draft.value === m.targetDenominator;
    case 'simplify': return draft.value === Number(gcd(BigInt(m.source[0]), BigInt(m.source[1])));
    case 'denominator': return equal(fraction(draft.value), answer);
    case 'order': return draft.order.length === m.fractions.length && new Set(draft.order).size === m.fractions.length && draft.order.every(i => Number.isInteger(i) && i >= 0 && i < m.fractions.length) && draft.order.every((i,j) => j === 0 || compare(rational(m.fractions[draft.order[j-1]]), rational(m.fractions[i])) <= 0);
    case 'operation': return equal(fraction(draft.value, m.partitions), answer);
    case 'balance': return equal(balanceValue(m, draft.value), rational(m.target));
    case 'remainder': { const r = remainderValues(m); return equal(fraction(draft.value), r.first) && equal(fraction(draft.secondary), r.second); }
    case 'reverse': return draft.order.length === 2 && draft.order[0] === 0 && draft.order[1] === 1 && equal(fraction(draft.value), answer);
  }
}
