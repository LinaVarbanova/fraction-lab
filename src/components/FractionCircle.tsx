import { motion } from 'motion/react';
export function FractionCircle({ parts, selected }: { parts: number; selected: number[] }) {
  const point = (angle: number) => `${50 + 43 * Math.cos(angle)},${50 + 43 * Math.sin(angle)}`;
  return <svg className="fraction-circle" viewBox="0 0 100 100" role="img" aria-label={`${selected.length} от ${parts} равни части в кръг`}>
    {parts === 1 ? <circle cx="50" cy="50" r="43" fill={selected.includes(0) ? '#6599f5' : '#e7eef9'} stroke="#fff" strokeWidth="2"/> : Array.from({ length: parts }, (_, i) => {
      const start = i * Math.PI * 2 / parts - Math.PI / 2;
      const end = (i + 1) * Math.PI * 2 / parts - Math.PI / 2;
      return <motion.path key={i} d={`M50,50 L${point(start)} A43,43 0 ${end - start > Math.PI ? 1 : 0},1 ${point(end)} Z`} animate={{ fill: selected.includes(i) ? '#6599f5' : '#e7eef9' }} transition={{ duration: 0.2 }} stroke="#fff" strokeWidth="2"/>;
    })}
  </svg>;
}
