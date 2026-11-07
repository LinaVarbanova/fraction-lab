import katex from 'katex';
export function MathText({ value }: { value: string }) {
  return <span className="math" dangerouslySetInnerHTML={{ __html: katex.renderToString(value, { throwOnError: false, output: 'htmlAndMathml' }) }} />;
}
export function Frac({ n, d }: { n: number | bigint; d: number | bigint }) {
  return <MathText value={`\\frac{${n}}{${d}}`} />;
}
