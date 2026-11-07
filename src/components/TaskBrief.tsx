import type { ReactNode } from "react";
export default function TaskBrief({
  action,
  detail,
  target,
  targetLabel = "ТВОЯТА ЦЕЛ",
}: {
  action: ReactNode;
  detail: ReactNode;
  target: ReactNode;
  targetLabel?: string;
}) {
  return (
    <div className="task-brief">
      <div className="task-copy">
        <span className="task-kicker">ТВОЯТА ЗАДАЧА</span>
        <h3 className="task-action">{action}</h3>
      </div>
      <div className="task-target">
        <span>{targetLabel}</span>
        <div>{target}</div>
      </div>
      <p className="task-detail">{detail}</p>
    </div>
  );
}
export function TaskSteps({
  steps,
  current,
  done,
}: {
  steps: string[];
  current: number;
  done: boolean;
}) {
  return (
    <ol className="task-steps" aria-label="Стъпки на задачата">
      {steps.map((step, i) => (
        <li
          key={step}
          className={
            done || i < current ? "finished" : i === current ? "current" : ""
          }
          aria-current={!done && i === current ? "step" : undefined}
        >
          <span>{done || i < current ? "✓" : i + 1}</span>
          {step}
        </li>
      ))}
    </ol>
  );
}
