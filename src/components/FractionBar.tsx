import { motion } from "motion/react";
export function FractionBar({
  parts,
  selected,
  tone = "blue",
  onToggle,
  label,
}: {
  parts: number;
  selected: number[];
  tone?: "blue" | "teal" | "violet";
  onToggle?: (index: number) => void;
  label: string;
}) {
  return (
    <div
      className={`fraction-bar ${tone}`}
      role="group"
      aria-label={label}
      style={{ gridTemplateColumns: `repeat(${parts}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: parts }, (_, i) =>
        onToggle ? (
          <motion.button
            layout
            key={i}
            className={selected.includes(i) ? "piece filled" : "piece"}
            aria-label={`Част ${i + 1} от ${parts}`}
            aria-pressed={selected.includes(i)}
            onClick={() => onToggle(i)}
            whileTap={{ scale: 0.94 }}
            transition={{ duration: 0.3 }}
          >
            <span />
            {parts <= 12 && (
              <span className="piece-index" aria-hidden="true">
                {i + 1}
              </span>
            )}
          </motion.button>
        ) : (
          <motion.div
            layout
            key={i}
            className={selected.includes(i) ? "piece filled" : "piece"}
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
          >
            <span />
          </motion.div>
        ),
      )}
    </div>
  );
}
export const first = (count: number) =>
  Array.from({ length: count }, (_, i) => i);
