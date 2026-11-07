import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Check, Lightbulb, RotateCcw, Sparkles } from 'lucide-react';
import { missionById, missions, worldMissions, type Mission } from '../content/missions';
import type { GameState } from '../game-engine/progression';
import { unlockedWorld } from '../game-engine/progression';
import { Frac, MathText } from '../components/Math';
import { FractionBar, first } from '../components/FractionBar';
import { add, compare, divide, fraction, mixed } from '../math-core/fraction';
import { balanceValue, initialDraft, operationResult, operationSymbol, rational, remainderValues, validateMission, type Draft } from '../problem-engine/validate';
export const worldNames = ['Залата на частите', 'Огледалният лабиринт', 'Кулата на знаменателите', 'Машината на операциите', 'Лабораторията на неизвестното', 'Островът на логиката', 'Арената на математиците'];
type Props = { missionId: string; game: GameState; onSelect: (id: string) => void; onDraft: (id: string, draft: Draft) => void; onAttempt: (id: string, draft: Draft) => void; onBack: () => void };
export default function Quest(props: Props) {
  const mission = missionById(props.missionId)!;
  return <section className={`quest world-${mission.world}`} aria-labelledby="quest-world-title"><button className="text-button quest-back" onClick={props.onBack}><ArrowLeft size={16}/>Към академията</button>
    <div className="quest-world-heading"><div><p className="eyebrow">СВЯТ {String(mission.world).padStart(2,'0')} / 07</p><h1 id="quest-world-title" tabIndex={-1}>{worldNames[mission.world - 1]}</h1><p>{mission.world > unlockedWorld(props.game) ? 'Входно предизвикателство: реши мисия и отвори този свят.' : 'Една мисия отваря следващия свят. Втората е за още открития.'}</p></div><span className="quest-world-seal">{String(mission.world).padStart(2,'0')}</span></div>
    <div className="quest-layout"><aside className="mission-menu" aria-label="Мисии в света"><p className="eyebrow">ТВОЯТ МАРШРУТ</p>{worldMissions(mission.world).map((m,i) => <button key={m.id} aria-current={m.id === mission.id ? 'step' : undefined} onClick={() => props.onSelect(m.id)} className={m.id === mission.id ? 'selected' : ''}><span className={`mission-step ${props.game.results[m.id] ? 'done' : ''}`}>{props.game.results[m.id] ? <Check size={17}/> : i+1}</span><span><strong>{m.title}</strong><small>{m.difficulty} · {props.game.results[m.id] ? 'Завършена' : i === 0 ? 'Отваря следващия свят' : 'Допълнителна мисия'}</small></span></button>)}<div className="route-note"><Sparkles size={19}/><p>Няма нужда да решаваш всичко, за да продължиш. Върни се за още, когато пожелаеш.</p></div></aside>
      <MissionPlayer key={mission.id} {...props} mission={mission}/>
    </div>
  </section>;
}
function MissionPlayer({ mission: m, game, onDraft, onAttempt, onSelect, onBack }: Props & { mission: Mission }) {
  const draft = game.drafts[m.id] ?? initialDraft(m);
  const [checked, setChecked] = useState(false);
  const success = checked && validateMission(m, draft);
  const receipt = game.results[m.id];
  function change(patch: Partial<Draft>) { setChecked(false); onDraft(m.id, { ...draft, ...patch }); }
  function move(index: number, offset: number) {
    const order = [...draft.order];
    [order[index],order[index+offset]] = [order[index+offset],order[index]];
    change({ order });
  }
  function check() { const next = { ...draft, attempts: draft.attempts + 1 }; setChecked(true); onAttempt(m.id, next); }
  const nextWorld = m.world < 7 ? missions.find(other => other.world === m.world + 1) : missions.find(other => !game.results[other.id] && other.id !== m.id);
  return <div className="mission-player"><div className="mission-heading"><span className="mission-tag">МИСИЯ · {m.difficulty.toLocaleUpperCase('bg')}</span><span className="mission-reward">{receipt ? <><Check size={14}/>Завършена</> : <><Sparkles size={14}/>{draft.hints ? '30' : '50'} XP</>}</span></div><h2>{m.title}</h2><p className="mission-instruction">{m.instruction}</p>
    <div className="mission-workspace">
      {m.kind === 'pieces' && <><div className="quantity-equation"><span>ПОСТРОЙ</span><Frac n={m.target[0]} d={m.target[1]}/></div>{first(m.wholes).map(whole => <div className="whole-model" key={whole}><span>ЦЯЛО {whole + 1}</span><FractionBar parts={m.parts} selected={first(Math.max(0, Math.min(m.parts, draft.value - whole * m.parts)))} label={`Цяло ${whole+1}`} onToggle={index => change({ value: whole*m.parts+index+1 === draft.value ? draft.value - 1 : whole*m.parts+index+1 })}/></div>)}<div className="live-answer"><span>Твоят модел</span><Frac n={draft.value} d={m.parts}/>{draft.value >= m.parts && <><span>=</span><MixedValue value={fraction(draft.value,m.parts)}/></>}</div></>}
      {(m.kind === 'equivalent' || m.kind === 'simplify') && <Transformation mission={m} draft={draft} change={change}/>}
      {m.kind === 'denominator' && <><div className="quantity-equation"><Frac n={m.a[0]} d={m.a[1]}/><span>и</span><Frac n={m.b[0]} d={m.b[1]}/></div>{[m.a,m.b].map(([n,d],i) => { const partitions = draft.value >= d && draft.value % d === 0 ? draft.value : d; return <div className="bar-equation" key={i}><FractionBar parts={partitions} selected={first(n*partitions/d)} label={`Лента ${i+1}`} tone={i ? 'violet' : 'blue'}/><Frac n={n*partitions/d} d={partitions}/></div>; })}<Range label="Общ знаменател на мисията" min={4} max={24} value={draft.value} onChange={value => change({ value })}/></>}
      {m.kind === 'order' && <><p className="model-caption">НАЙ-МАЛКА <ArrowDown size={15}/> НАЙ-ГОЛЯМА</p><div className="order-list">{draft.order.map((index,i) => { const [n,d] = m.fractions[index]; return <div className="order-item" key={index}><Frac n={n} d={d}/><FractionBar parts={d} selected={first(n)} label={`${n} от ${d}`} tone="violet"/><div className="order-actions"><button aria-label={`Премести ${n}/${d} нагоре`} disabled={i === 0} onClick={() => move(i,-1)}><ArrowUp size={17}/></button><button aria-label={`Премести ${n}/${d} надолу`} disabled={i === draft.order.length - 1} onClick={() => move(i,1)}><ArrowDown size={17}/></button></div></div>; })}</div></>}
      {m.kind === 'operation' && <OperationMachine mission={m} draft={draft} change={change}/>}
      {m.kind === 'balance' && <Balance mission={m} draft={draft} change={change}/>}
      {m.kind === 'remainder' && <Remainder mission={m} draft={draft} change={change}/>}
      {m.kind === 'reverse' && <><div className="forward-pipeline"><span>?</span><ArrowRight size={17}/><MathText value={`\\times\\frac{${m.multiplier[0]}}{${m.multiplier[1]}}`}/><ArrowRight size={17}/><span>− {m.deduction}</span><ArrowRight size={17}/><strong>{m.final}</strong></div><p className="model-caption">ПОДРЕДИ ОБРАТНИЯ ПЪТ</p><div className="reverse-path"><span className="path-origin">{m.final}</span>{draft.order.map((index,i) => <div className="reverse-step" key={index}><span>{index === 0 ? `Прибави ${m.deduction}` : <><span>Раздели на </span><Frac n={m.multiplier[0]} d={m.multiplier[1]}/></>}</span><button aria-label="Размени обратните действия" onClick={() => move(i,i === 0 ? 1 : -1)}><RotateCcw size={16}/></button></div>)}</div><div className="path-result"><span>Резултат от твоя път</span><LiveReverse m={m} draft={draft}/></div><Range label="Тайното число" value={draft.value} min={0} max={60} onChange={value => change({ value })}/></>}
    </div>
    <div className="mission-actions"><button className="text-button" onClick={() => change({ hints: true })} aria-expanded={draft.hints}><Lightbulb size={17}/>{draft.hints ? 'Насоката е отворена' : 'Нуждая се от насока'}</button><button className="button" onClick={check} disabled={success}>Провери модела<Check size={16}/></button></div>
    {draft.hints && <p className="hint">{m.hint}</p>}
    {checked && <div className={`quest-feedback ${success ? 'success' : ''}`} role="status"><strong>{success ? 'Механизмът работи!' : 'Моделът още не съвпада.'}</strong><p>{success ? m.explanation : 'Промени построения модел и опитай отново. Можеш да използваш насоката — опитите не отнемат точки.'}</p>{success && <small>{receipt?.assisted ? 'Решено с насока · 30 XP' : 'Самостоятелно решение · 50 XP'} · Наградата се получава веднъж.</small>}</div>}
    {(success || receipt) && <div className="mission-next"><div><strong>{m.world < 7 ? 'Следващият свят те очаква.' : 'По следите на още открития.'}</strong><span>Познатото остава достъпно за преговор.</span></div><button className="button" onClick={() => nextWorld ? onSelect(nextWorld.id) : onBack()}>{m.world < 7 ? 'Към следващия свят' : nextWorld ? 'Още една мисия' : 'Към академията'}<ArrowRight size={17}/></button></div>}
    <div className="mission-bottom"><span>{m.skill}</span><span>Без ограничение във времето</span></div>
  </div>;
}
function Range({ label, min, max, value, onChange }: { label: string; min: number; max: number; value: number; onChange: (value: number) => void }) {
  return <label className="mission-range"><span>{label}</span><div><button aria-label={`${label}: намали`} disabled={value <= min} onClick={() => onChange(value-1)}>−</button><input type="range" aria-label={label} min={min} max={max} value={value} onChange={e => onChange(Number(e.target.value))}/><button aria-label={`${label}: увеличи`} disabled={value >= max} onClick={() => onChange(value+1)}>+</button><output>{value}</output></div></label>;
}
function MixedValue({ value }: { value: ReturnType<typeof fraction> }) {
  const m = mixed(value);
  return <MathText value={`${m.sign < 0 ? '-' : ''}${m.whole}${m.remainder ? `\\frac{${m.remainder}}{${m.denominator}}` : ''}`}/>;
}
function Transformation({ mission: m, draft, change }: { mission: Extract<Mission, { kind: 'equivalent' | 'simplify' }>; draft: Draft; change: (patch: Partial<Draft>) => void }) {
  const [n,d] = m.source;
  const divisorValid = m.kind === 'simplify' && n%draft.value === 0 && d%draft.value === 0;
  const newN = m.kind === 'equivalent' ? n * draft.value : divisorValid ? n / draft.value : n;
  const newD = m.kind === 'equivalent' ? d * draft.value : divisorValid ? d / draft.value : d;
  return <><div className="bar-equation"><FractionBar parts={d} selected={first(n)} tone="teal" label="Начално количество"/><Frac n={n} d={d}/></div><div className="transform-indicator">{m.kind === 'equivalent' ? '×' : '÷'} {draft.value} · числител и знаменател</div><div className="bar-equation"><FractionBar parts={newD} selected={first(newN)} tone="teal" label="Преобразувано количество"/><Frac n={newN} d={newD}/></div><Range label={m.kind === 'equivalent' ? 'Умножи двете числа по' : 'Раздели двете числа на'} min={1} max={m.kind === 'equivalent' ? 4 : 6} value={draft.value} onChange={value => change({ value })}/>{m.kind === 'simplify' && !divisorValid && <p className="invalid-partition">Избери общ делител на числителя и знаменателя.</p>}</>;
}
function OperationMachine({ mission: m, draft, change }: { mission: Extract<Mission, { kind: 'operation' }>; draft: Draft; change: (patch: Partial<Draft>) => void }) {
  const result = operationResult(m);
  const max = m.partitions === 1 ? Math.max(8,Number(result.n)+2) : m.partitions;
  return <><div className="operation-inputs"><div><FractionBar parts={m.a[1]} selected={first(m.a[0])} label="Първо количество"/><Frac n={m.a[0]} d={m.a[1]}/></div><span className="operation-gear">{operationSymbol[m.operation]}</span><div><FractionBar parts={m.b[1]} selected={first(m.b[0])} label="Второ количество" tone="teal"/><Frac n={m.b[0]} d={m.b[1]}/></div></div><div className="machine-connector"><ArrowDown size={22}/></div>{m.partitions === 1 ? <div className="portion-grid">{first(max).map(i => <button className={i < draft.value ? 'active' : ''} key={i} aria-label={`Построй ${i+1} порции`} onClick={() => change({ value: i+1 === draft.value ? i : i+1 })}><Frac n={m.b[0]} d={m.b[1]}/></button>)}</div> : <FractionBar parts={m.partitions} selected={first(draft.value)} label="Изход на машината" tone="violet" onToggle={index => change({ value: index+1 === draft.value ? index : index+1 })}/>}<div className="live-answer"><span>{m.partitions === 1 ? 'Брой порции' : 'Изход на машината'}</span><Frac n={draft.value} d={m.partitions}/></div></>;
}
function Balance({ mission: m, draft, change }: { mission: Extract<Mission, { kind: 'balance' }>; draft: Draft; change: (patch: Partial<Draft>) => void }) {
  const left = balanceValue(m,draft.value), right = rational(m.target);
  const direction = compare(left,right);
  return <><div className="balance-equation"><MathText value={`\\frac{${m.coefficient[0]}}{${m.coefficient[1]}}x${m.offset[0] ? `+${m.offset[0]}` : ''}=${m.target[0]}`}/></div><div className="balance-model" role="img" aria-label={direction === 0 ? 'Везната е в равновесие' : direction < 0 ? 'Лявата страна е по-лека' : 'Лявата страна е по-тежка'}><div className="balance-pivot"/><motion.div className="balance-beam" animate={{ rotate: direction === 0 ? 0 : direction < 0 ? 8 : -8 }} transition={{ duration: 0.4 }}><div className="balance-pan left"><span>ЛЯВА СТРАНА</span><Frac n={left.n} d={left.d}/></div><div className="balance-pan right"><span>ДЯСНА СТРАНА</span><Frac n={right.n} d={right.d}/></div></motion.div></div><p className="balance-description">{direction === 0 ? 'Двете страни са равни.' : direction < 0 ? 'Лявата страна е по-лека. Увеличи x.' : 'Лявата страна е по-тежка. Намали x.'}</p><Range label="Неизвестното x" min={0} max={m.maximum} value={draft.value} onChange={value => change({ value })}/></>;
}
function Remainder({ mission: m, draft, change }: { mission: Extract<Mission, { kind: 'remainder' }>; draft: Draft; change: (patch: Partial<Draft>) => void }) {
  const target = remainderValues(m);
  const remaining = m.total-draft.value;
  return <><div className="remainder-total"><span>ПЪРВОНАЧАЛНО КОЛИЧЕСТВО</span><strong>{m.total}</strong></div><div className="crystal-grid" role="img" aria-label={`Първа част ${draft.value}, втора част ${draft.secondary}, остатък ${m.total-draft.value-draft.secondary}`}>{first(m.total).map(i => <motion.span layout key={i} className={i < draft.value ? 'spent-first' : i < draft.value+draft.secondary ? 'spent-second' : 'remaining'}/>)}</div><div className="crystal-legend"><span>Първа част</span><span>Част от остатъка</span><span>Остава</span></div><div className="remainder-stages"><div><span>1. Вземи <Frac n={m.first[0]} d={m.first[1]}/> от {m.total}</span><Range label="Първи разход" min={0} max={m.total} value={draft.value} onChange={value => change({ value, secondary: Math.min(draft.secondary,m.total-value) })}/></div><div><span>2. Вземи <Frac n={m.second[0]} d={m.second[1]}/> от останалите <strong>{remaining}</strong></span><Range label="Втори разход от остатъка" min={0} max={remaining} value={draft.secondary} onChange={secondary => change({ secondary })}/></div></div><div className="live-answer"><span>След двата разхода остават</span><strong>{m.total-draft.value-draft.secondary}</strong></div><p className="model-caption">Втората дроб се отнася до остатъка след първия разход.{draft.value === Number(target.first.n) && ' Първата стъпка е вярна.'}</p></>;
}
function LiveReverse({ m, draft }: { m: Extract<Mission, { kind: 'reverse' }>; draft: Draft }) {
  let result = fraction(m.final);
  for (const index of draft.order) result = index === 0 ? add(result,fraction(m.deduction)) : divide(result,rational(m.multiplier));
  return <Frac n={result.n} d={result.d}/>;
}
