import { useRef, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowRight,
  Check,
  Lightbulb,
  Minus,
  Plus,
  RotateCcw,
  MoveHorizontal,
} from "lucide-react";
import TaskBrief, { TaskSteps } from "../components/TaskBrief";
import { FractionCircle } from "../components/FractionCircle";
import { Frac, MathText } from "../components/Math";
import { FractionBar, first } from "../components/FractionBar";
import { commonDenominator, equal, fraction, lcm } from "../math-core/fraction";
import { activityIds, type Activity } from "../storage/progress";
export const activities: Record<
  Activity,
  { name: string; short: string; description: string; color: string }
> = {
  split: {
    name: "От цялото към частите",
    short: "Разделяне",
    description: "Раздели. Избери. Открий дробта.",
    color: "blue",
  },
  equivalence: {
    name: "Различни части. Една стойност.",
    short: "Равни дроби",
    description: "Промени частите, запази количеството.",
    color: "teal",
  },
  line: {
    name: "Всяка дроб има място",
    short: "Числова ос",
    description: "Премести дробта до нейното място.",
    color: "violet",
  },
  common: {
    name: "На една и съща вълна",
    short: "Общ знаменател",
    description: "Направи частите съпоставими.",
    color: "amber",
  },
};
type Props = {
  activity: Activity;
  completed: Activity[];
  onComplete: (id: Activity) => void;
  onChange: (id: Activity) => void;
};
export default function Lab({
  activity,
  completed,
  onComplete,
  onChange,
}: Props) {
  const [hint, setHint] = useState(false);
  const next = activityIds[activityIds.indexOf(activity) + 1];
  const done = completed.includes(activity);
  return (
    <section
      className="lab section"
      id="laboratory"
      aria-labelledby="lab-title"
    >
      <div className="lab-page-heading">
        <h1 id="lab-title" tabIndex={-1}>
          Свободна лаборатория
        </h1>
        <span>Опитай с ръцете си.</span>
      </div>
      <div className="lab-shell">
        <div
          className="lab-tabs"
          role="tablist"
          aria-label="Лаборатории"
          onKeyDown={(e) => {
            const offset =
              e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
            if (offset) {
              e.preventDefault();
              const id =
                activityIds[(activityIds.indexOf(activity) + offset + 4) % 4];
              onChange(id);
              document.getElementById(`tab-${id}`)?.focus();
            }
          }}
        >
          {activityIds.map((id, i) => (
            <button
              id={`tab-${id}`}
              role="tab"
              aria-selected={activity === id}
              aria-controls="activity-panel"
              tabIndex={activity === id ? 0 : -1}
              key={id}
              className={activity === id ? "active" : ""}
              onClick={() => {
                onChange(id);
                setHint(false);
              }}
            >
              <span
                className={`tab-number ${completed.includes(id) ? "done" : ""}`}
              >
                {completed.includes(id) ? <Check size={15} /> : `0${i + 1}`}
              </span>
              <span>{activities[id].short}</span>
            </button>
          ))}
        </div>
        <div
          role="tabpanel"
          id="activity-panel"
          aria-labelledby={`tab-${activity}`}
          tabIndex={0}
          className="activity-panel"
        >
          <div className="activity-heading">
            <div>
              <p className="eyebrow">ИЗСЛЕДВАЙ И ОПИТАЙ</p>
              <h2>{activities[activity].name}</h2>
            </div>
            <span className="activity-pill">
              {done ? (
                <>
                  <Check size={14} /> Открито
                </>
              ) : (
                "Без ограничение във времето"
              )}
            </span>
          </div>
          <motion.div
            key={activity}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activity === "split" && (
              <Split onComplete={() => onComplete("split")} />
            )}
            {activity === "equivalence" && (
              <Equivalence onComplete={() => onComplete("equivalence")} />
            )}
            {activity === "line" && (
              <NumberLine onComplete={() => onComplete("line")} />
            )}
            {activity === "common" && (
              <Common onComplete={() => onComplete("common")} />
            )}
          </motion.div>
          <div className="lab-footer">
            <button
              className="text-button"
              onClick={() => setHint(!hint)}
              aria-expanded={hint}
            >
              <Lightbulb size={17} />
              {hint ? "Скрий насоката" : "Малка насока"}
            </button>
            <button
              className="text-button next"
              onClick={() => {
                if (next) {
                  onChange(next);
                  setHint(false);
                } else
                  document
                    .getElementById("worlds")
                    ?.scrollIntoView({ behavior: "instant" });
              }}
            >
              {next
                ? `Следва: ${activities[next].short}`
                : "Разгледай световете"}
              <ArrowRight size={17} />
            </button>
          </div>
          {hint && (
            <p className="hint" role="status">
              {activity === "split"
                ? "Знаменателят показва броя на всички равни части. Числителят — колко от тях си избрал."
                : activity === "equivalence"
                  ? "Когато умножиш числителя и знаменателя по едно и също число, стойността не се променя."
                  : activity === "line"
                    ? "Разстоянието от 0 до 1 е едно цяло. Раздели го на 4 равни части и преброй 3 от тях."
                    : "Потърси най-малкото число, което се дели и на 3, и на 4. То е 12."}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
function Feedback({
  success,
  children,
}: {
  success: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`feedback ${success ? "success" : ""}`} role="status">
      {success ? <Check size={18} /> : <MoveHorizontal size={18} />}
      <span>{children}</span>
    </div>
  );
}
function Split({ onComplete }: { onComplete: () => void }) {
  const [parts, setParts] = useState(1);
  const [selected, setSelected] = useState<number[]>([]);
  const success = parts === 4 && selected.length === 3;
  function toggle(index: number) {
    const next = selected.includes(index)
      ? selected.filter((i) => i !== index)
      : [...selected, index];
    setSelected(next);
    if (parts === 4 && next.length === 3) onComplete();
  }
  return (
    <>
      <TaskBrief
        action={
          success ? (
            <>Построи три четвърти!</>
          ) : parts === 4 ? (
            <>
              Оцвети <em>3</em> от четирите части.
            </>
          ) : (
            <>
              Раздели цялото на <em>4</em> равни части.
            </>
          )
        }
        detail={
          parts === 4
            ? "Докосни частите в лентата. Три от тях трябва да са сини."
            : "Натискай +, докато получиш 4 части. После ще оцветиш 3 от тях."
        }
        target={<Frac n={3} d={4} />}
      />
      <TaskSteps
        steps={["Раздели на 4", "Оцвети 3 части"]}
        current={parts === 4 ? 1 : 0}
        done={success}
      />
      <div className="controls split-controls">
        <label htmlFor="parts">Раздели на</label>
        <div className="stepper">
          <button
            aria-label="По-малко части"
            disabled={parts === 1}
            onClick={() => {
              setParts(parts - 1);
              setSelected([]);
            }}
          >
            <Minus size={16} />
          </button>
          <output id="parts">{parts}</output>
          <button
            aria-label="Повече части"
            disabled={parts === 12}
            onClick={() => {
              setParts(parts + 1);
              setSelected([]);
            }}
          >
            <Plus size={16} />
          </button>
        </div>
        <span className="muted">равни части</span>
        <button
          className="reset"
          onClick={() => {
            setParts(1);
            setSelected([]);
          }}
          aria-label="Започни разделянето отначало"
        >
          <RotateCcw size={17} />
        </button>
      </div>
      <div className="experiment split-experiment">
        <div className="whole-caption">
          <span>ЕДНО ЦЯЛО</span>
          <span>
            {parts} {parts === 1 ? "част" : "равни части"}
          </span>
        </div>
        <FractionBar
          parts={parts}
          selected={selected}
          onToggle={toggle}
          label="Избери части от цялото"
        />
        <div className="under-bar">
          <span>
            Всяка част е <Frac n={1} d={parts} />
          </span>
          <span className="big-result">
            <FractionCircle parts={parts} selected={selected} />
            <Frac n={selected.length} d={parts} />
          </span>
        </div>
      </div>

      <Feedback success={success}>
        {success
          ? "Точно така! Три от четири равни части са три четвърти."
          : parts !== 4
            ? "Първо направи 4 равни части с бутоните − и +."
            : selected.length > 3
              ? "Оцветена е една част повече. Докосни я, за да я премахнеш."
              : `Оцветени са ${selected.length} от нужните 3 части. Докосни още части в лентата.`}
      </Feedback>
    </>
  );
}
function Equivalence({ onComplete }: { onComplete: () => void }) {
  const [factor, setFactor] = useState(1);
  const [visited, setVisited] = useState(false);
  const change = (value: number) => {
    setFactor(value);
    if (value >= 2) {
      setVisited(true);
      onComplete();
    }
  };
  return (
    <>
      <TaskBrief
        action={
          <>
            Направи повече части.
            <br />
            Запази същото количество.
          </>
        }
        detail="Плъзни регулатора. Наблюдавай как се променят двете числа на дробта."
        target={<Frac n={2} d={3} />}
      />
      <div className="experiment equivalence-experiment">
        <div className="bar-equation">
          <FractionBar
            parts={3}
            selected={first(2)}
            tone="teal"
            label="Две трети"
          />
          <Frac n={2} d={3} />
        </div>
        <div className="transform-indicator">
          <span />× {factor}
          <span />
        </div>
        <div className="bar-equation">
          <FractionBar
            parts={3 * factor}
            selected={first(2 * factor)}
            tone="teal"
            label={`${2 * factor} от ${3 * factor} части`}
          />
          <Frac n={2 * factor} d={3 * factor} />
        </div>
      </div>
      <div className="controls">
        <label htmlFor="factor">Раздели всяка част на</label>
        <input
          id="factor"
          type="range"
          min={1}
          max={4}
          value={factor}
          onChange={(e) => change(Number(e.target.value))}
        />
        <output>{factor}</output>
        <button
          className="reset"
          aria-label="Върни първоначалните части"
          onClick={() => {
            setFactor(1);
            setVisited(false);
          }}
        >
          <RotateCcw size={17} />
        </button>
      </div>
      <Feedback success={visited}>
        {visited ? (
          <>
            <Frac n={2} d={3} /> = <Frac n={2 * factor} d={3 * factor} /> —
            повече части, същото количество!
          </>
        ) : (
          "Плъзни регулатора. Оцветената дължина остава същата."
        )}
      </Feedback>
    </>
  );
}
function NumberLine({ onComplete }: { onComplete: () => void }) {
  const [position, setPosition] = useState(2);
  const [checked, setChecked] = useState(false);
  const track = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const target = fraction(3, 4);
  const success = equal(fraction(position, 8), target);
  function setFromPointer(clientX: number) {
    const rect = track.current?.getBoundingClientRect();
    if (rect) {
      setPosition(
        Math.max(
          0,
          Math.min(8, Math.round(((clientX - rect.left) / rect.width) * 8)),
        ),
      );
      setChecked(false);
    }
  }
  return (
    <>
      <TaskBrief
        action={
          <>
            Премести точката на <Frac n={3} d={4} />.
          </>
        }
        detail="Хвани синята точка и я плъзни. Можеш да използваш и стрелките на клавиатурата."
        target={<Frac n={3} d={4} />}
      />
      <div className="experiment line-experiment">
        <div className="line-readout">
          <span>ТВОЯТА ПОЗИЦИЯ</span>
          <Frac n={position} d={8} />
        </div>
        <div
          className="number-track"
          ref={track}
          onPointerDown={(e) => {
            isDragging.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            setFromPointer(e.clientX);
          }}
          onPointerMove={(e) => {
            if (isDragging.current) setFromPointer(e.clientX);
          }}
          onPointerUp={() => {
            isDragging.current = false;
          }}
          onPointerCancel={() => {
            isDragging.current = false;
          }}
        >
          <div
            className="line-fill"
            style={{ width: `${(position / 8) * 100}%` }}
          />
          {first(9).map((i) => (
            <div
              className={`tick ${i % 4 === 0 ? "major" : ""}`}
              key={i}
              style={{ left: `${(i / 8) * 100}%` }}
            >
              <span>
                {i === 0 ? (
                  "0"
                ) : i === 8 ? (
                  "1"
                ) : i === 4 ? (
                  <Frac n={1} d={2} />
                ) : (
                  ""
                )}
              </span>
            </div>
          ))}
          <motion.div
            className="line-thumb"
            role="slider"
            tabIndex={0}
            aria-label="Позиция на дробта"
            aria-valuemin={0}
            aria-valuemax={8}
            aria-valuenow={position}
            aria-valuetext={`${position} осми`}
            animate={{ left: `${(position / 8) * 100}%` }}
            transition={{ duration: 0.12 }}
            onKeyDown={(e) => {
              let next = position;
              if (e.key === "ArrowRight" || e.key === "ArrowUp") next++;
              else if (e.key === "ArrowLeft" || e.key === "ArrowDown") next--;
              else if (e.key === "Home") next = 0;
              else if (e.key === "End") next = 8;
              else return;
              e.preventDefault();
              setPosition(Math.max(0, Math.min(8, next)));
              setChecked(false);
            }}
          >
            <span />
          </motion.div>
        </div>
      </div>
      <div className="controls">
        <span className="muted">Едно цяло · 8 равни стъпки</span>
        <button
          className="button small"
          onClick={() => {
            setChecked(true);
            if (success) onComplete();
          }}
        >
          Провери позицията
          <ArrowRight size={16} />
        </button>
      </div>
      <Feedback success={checked && success}>
        {checked ? (
          success ? (
            <>
              <Frac n={6} d={8} /> = <Frac n={3} d={4} />. Намери точното място!
            </>
          ) : (
            "Още малко! Три четвърти са вдясно от една втора. Опитай пак."
          )
        ) : (
          "Дробта показва разстоянието от нулата до синята точка."
        )}
      </Feedback>
    </>
  );
}
function Common({ onComplete }: { onComplete: () => void }) {
  const [denominator, setDenominator] = useState(4);
  const [checked, setChecked] = useState(false);
  const a = fraction(2, 3),
    b = fraction(1, 4);
  const common = commonDenominator(a, b);
  const validA = BigInt(denominator) % a.d === 0n;
  const validB = BigInt(denominator) % b.d === 0n;
  const success = BigInt(denominator) === lcm(a.d, b.d);
  const shownA = validA ? denominator : 3,
    shownB = validB ? denominator : 4;
  return (
    <>
      <TaskBrief
        action={<>Направи частите еднакви.</>}
        detail={
          <>
            Намери най-малкия общ знаменател за <Frac n={2} d={3} /> и{" "}
            <Frac n={1} d={4} />. Плъзни регулатора и провери.
          </>
        }
        target={<span className="target-question">?</span>}
        targetLabel="ОБЩ ЗНАМЕНАТЕЛ"
      />
      <div className="experiment common-experiment">
        <div className="bar-equation">
          <FractionBar
            parts={shownA}
            selected={first((shownA / 3) * 2)}
            tone="blue"
            label="Представяне на две трети"
          />
          <Frac n={(shownA / 3) * 2} d={shownA} />
        </div>
        <div className="bar-equation">
          <FractionBar
            parts={shownB}
            selected={first(shownB / 4)}
            tone="violet"
            label="Представяне на една четвърт"
          />
          <Frac n={shownB / 4} d={shownB} />
        </div>
        <div className="partition-status">
          <span className={validA ? "valid" : ""}>
            {validA ? <Check size={14} /> : <Minus size={14} />}Дели се на 3
          </span>
          <span className={validB ? "valid" : ""}>
            {validB ? <Check size={14} /> : <Minus size={14} />}Дели се на 4
          </span>
        </div>
      </div>
      <div className="controls">
        <label htmlFor="denominator">Общ знаменател</label>
        <input
          id="denominator"
          type="range"
          min={4}
          max={24}
          value={denominator}
          onChange={(e) => {
            setDenominator(Number(e.target.value));
            setChecked(false);
          }}
        />
        <output>{denominator}</output>
        <button
          className="button small"
          onClick={() => {
            setChecked(true);
            if (success) onComplete();
          }}
        >
          Провери
          <Check size={16} />
        </button>
      </div>
      <Feedback success={checked && success}>
        {checked ? (
          success ? (
            <>
              <MathText
                value={`\\frac{2}{3}=\\frac{${common.a}}{${common.d}},\\quad\\frac{1}{4}=\\frac{${common.b}}{${common.d}}`}
              />
              . Вече сравняваш еднакви части!
            </>
          ) : validA && validB ? (
            "Това е общ знаменател. Можеш ли да намериш по-малък?"
          ) : (
            "Двете дроби още нямат еднакви деления. Потърси число, което се дели и на 3, и на 4."
          )
        ) : (
          "Когато избраното число се дели на знаменателя, лентата се преобразува."
        )}
      </Feedback>
    </>
  );
}
