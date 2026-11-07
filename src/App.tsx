import { useEffect, useState } from 'react';
import { MotionConfig, motion } from 'motion/react';
import { ArrowDown, ArrowRight, BookOpen, Check, ChevronRight, Compass, FlaskConical, Grid2X2, Layers3, Leaf, LockKeyhole, Map, Sparkles, Target, Trophy, X } from 'lucide-react';
import AcademyArt from './components/AcademyArt';
import Lab, { activities } from './interactions/Lab';
import { type Activity } from './storage/progress';
import { loadGame, persistGame } from './storage/game';
import { badges, completeMission, emptyGame, recommendedMission, totalXP, unlockedWorld, type GameState } from './game-engine/progression';
import { missionById, missions, worldMissions, type WorldId } from './content/missions';
import { validateMission, type Draft } from './problem-engine/validate';
import Quest from './interactions/Quest';
import ProgressTools from './components/ProgressTools';
const worlds = [
  { name: 'Залата на частите', topic: 'Цяло, части и числова ос', icon: Grid2X2, tone: 'blue', number: '01' },
  { name: 'Огледалният лабиринт', topic: 'Равни дроби и преобразуване', icon: Layers3, tone: 'teal', number: '02' },
  { name: 'Кулата на знаменателите', topic: 'Общ знаменател и сравняване', icon: FlaskConical, tone: 'violet', number: '03' },
  { name: 'Машината на операциите', topic: 'Събиране, умножение и още', icon: Sparkles, tone: 'amber', number: '04' },
  { name: 'Лабораторията на неизвестното', topic: 'Уравнения и обратен ход', icon: Target, tone: 'blue', number: '05' },
  { name: 'Островът на логиката', topic: 'Остатъци и многостъпкови задачи', icon: Compass, tone: 'teal', number: '06' },
  { name: 'Арената на математиците', topic: 'Стратегия и състезателни задачи', icon: Trophy, tone: 'coral', number: '07' },
];
export default function App() {
  const [game, setGame] = useState<GameState>(emptyGame);
  const [ready, setReady] = useState(false);
  const [activity, setActivity] = useState<Activity>('split');
  const [page, setPage] = useState<'academy' | 'skills' | 'parent' | 'quest'>('academy');
  const [notice, setNotice] = useState('');
  const [storageError, setStorageError] = useState(false);
  useEffect(() => { let cancelled = false; void loadGame().then(saved => {
    if (!cancelled) { setGame(saved); if (saved.currentMission) setPage('quest'); setReady(true); }
  }); return () => { cancelled = true; }; }, []);
  useEffect(() => { if (ready) void persistGame(game).then(saved => setStorageError(!saved)); }, [game, ready]);
  const completed = game.discoveries;
  function complete(id: Activity) {
    setGame(previous => previous.discoveries.includes(id) ? previous : { ...previous, discoveries: [...previous.discoveries,id] });
  }
  function openLab(id: Activity) {
    setActivity(id); setPage('academy');
    requestAnimationFrame(() => document.getElementById('laboratory')?.scrollIntoView({ behavior: 'instant', block: 'start' }));
  }
  function openMission(id: string) {
    if (!missionById(id)) return;
    setGame(previous => ({ ...previous, currentMission: id })); setPage('quest');
    window.scrollTo({ top: 0, behavior: 'instant' });
    requestAnimationFrame(() => document.getElementById('quest-world-title')?.focus());
  }
  function updateDraft(id: string, draft: Draft) {
    setGame(previous => ({ ...previous, drafts: { ...previous.drafts, [id]: draft } }));
  }
  function attempt(id: string, draft: Draft) {
    setGame(previous => {
      const updated = { ...previous, drafts: { ...previous.drafts, [id]: draft } };
      return validateMission(missionById(id)!, draft) ? completeMission(updated,id,draft.hints,draft.attempts) : updated;
    });
  }
  const next = (['split', 'equivalence', 'line', 'common'] as Activity[]).find(id => !completed.includes(id)) ?? 'common';
  const recommended = recommendedMission(game);
  const worldCount = new Set(missions.filter(m => game.results[m.id]).map(m => m.world)).size;
  if (!ready) return <div className="loading-screen" role="status"><FlaskConical size={30}/><p>Академията отваря врати…</p></div>;
  return <MotionConfig reducedMotion="user"><div className="app">
    <a className="skip-link" href="#main">Към съдържанието</a>
    <aside className="sidebar"><a className="brand" href="#" onClick={() => setPage('academy')} aria-label="Fraction Lab — начало"><span className="brand-symbol"><span /><span /><span /></span><span>fraction<span className="brand-light">lab</span><small>МАТЕМАТИЧЕСКАТА АКАДЕМИЯ</small></span></a>
      <div className="sidebar-label">ТВОЕТО ПРОСТРАНСТВО</div>
      <nav aria-label="Главна навигация"><button className={page === 'academy' ? 'nav-item active' : 'nav-item'} onClick={() => setPage('academy')}><Map size={20} />Академията<span className="nav-dot" /></button><button className={page === 'skills' ? 'nav-item active' : 'nav-item'} onClick={() => setPage('skills')}><Compass size={20} />Карта на уменията</button><button className={page === 'parent' ? 'nav-item active' : 'nav-item'} onClick={() => setPage('parent')}><BookOpen size={20} />За родителя</button></nav>
      <div className="sidebar-journey"><div className="mini-orbit"><Sparkles size={23} /></div><p>Всяко откритие<br/>започва с „Ами ако…“</p><span>Опитай. Раздвижи. Разбери.</span></div>
      <div className="sidebar-bottom"><Leaf size={16} /><span>Учи със собствено темпо</span></div>
    </aside>
    <div className="main-column"><header className="topbar"><div className="breadcrumb">Твоето пространство<ChevronRight size={14} /><strong>{page === 'academy' ? 'Академията' : page === 'skills' ? 'Карта на уменията' : page === 'quest' ? 'Мисии' : 'За родителя'}</strong></div><div className="topbar-right"><span className="xp"><Sparkles size={16} />{totalXP(game)} XP</span><span className="profile" aria-label="Профил: изследовател">И</span></div></header>
      <main id="main">
      {page === 'quest' && game.currentMission ? <Quest missionId={game.currentMission} game={game} onSelect={openMission} onDraft={updateDraft} onAttempt={attempt} onBack={() => setPage('academy')}/> : page === 'academy' ? <>
        <section className="hero"><div className="hero-copy"><div className="badge"><span />МЯСТО ЗА ЛЮБОПИТНИ УМОВЕ</div><h1>Големи открития.<br/><span>Малки части.</span></h1><p>Математиката не е само на хартия.<br className="desktop-break"/> Раздвижи дробите и виж как всичко се свързва.</p><div className="hero-actions"><button className="button" onClick={() => openMission(recommended.id)}>{game.currentMission || Object.keys(game.results).length ? 'Продължи мисията' : 'Влез в академията'}<ArrowRight size={18} /></button><a className="hero-secondary" href="#worlds">Разгледай световете<ArrowDown size={16} /></a></div><div className="hero-meta"><span><Check size={14} />Учене чрез действие</span><span><Check size={14} />Без бързане</span></div></div><div className="hero-visual"><div className="art-glow"/><AcademyArt/><div className="floating-label label-top"><span className="label-icon teal"><Layers3 size={17} /></span><div><strong>Различни части</strong><small>Едно и също цяло.</small></div></div><div className="floating-label label-bottom"><span className="label-icon blue"><Compass size={18} /></span><div><strong>7 свята за откриване</strong><small>От първата дроб до големите идеи.</small></div></div></div></section>
        <section className="journey-strip" aria-label="Твоят напредък"><div className="journey-icon"><FlaskConical size={23}/></div><div className="journey-text"><strong>{worldCount === 7 ? 'Седем свята. Една голяма история.' : `Следва: ${recommended.title}`}</strong><span>{worlds[recommended.world-1].name} · {recommended.difficulty}</span></div><div className="journey-progress"><div><span>Изследвани светове</span><strong>{worldCount} / 7</strong></div><progress value={worldCount} max={7} aria-label="Изследвани светове"/></div><button className="round-button" aria-label="Продължи експедицията" onClick={() => openMission(recommended.id)}><ArrowRight size={19}/></button></section>
        <section className="section worlds" id="worlds" aria-labelledby="worlds-title"><div className="section-heading"><div><p className="eyebrow">КАРТА НА АКАДЕМИЯТА</p><h2 id="worlds-title">Един свят води към следващия.</h2></div><span className="section-note">Твоето математическо приключение</span></div><div className="world-grid">{worlds.map((world, i) => {
          const id = (i+1) as WorldId;
          const entries = worldMissions(id), solved = entries.filter(m => game.results[m.id]).length;
          const unlocked = id <= unlockedWorld(game);
          return <motion.button whileHover={{ y: -4 }} transition={{ duration: 0.18 }} className={`world-card ${world.tone} ${solved ? 'world-discovered' : ''}`} key={world.number} onClick={() => openMission(entries.find(m => !game.results[m.id])?.id ?? entries[0].id)}><div className="world-card-top"><span className="world-icon"><world.icon size={25} strokeWidth={1.5}/></span><span className="world-number">{solved ? <Check size={25}/> : world.number}</span></div><div><h3>{world.name}</h3><p>{world.topic}</p></div><div className="world-card-bottom">{solved ? <><Check size={13}/>{solved} / {entries.length} мисии<ArrowRight size={16}/></> : unlocked ? <><span className="available-dot"/>Започни мисия<ArrowRight size={16}/></> : <><LockKeyhole size={13}/><span>Опитай входна мисия</span><ArrowRight size={16}/></>}</div></motion.button>;
        })}</div><p className="map-caption">Една решена мисия отваря следващия свят. Знаеш основите? Влез направо в по-трудна мисия.</p></section>
        <section className="achievements" aria-label="Отличия">{badges(game).map(badge => <div className={badge.earned ? 'achievement earned' : 'achievement'} key={badge.id}><Trophy size={21}/><div><strong>{badge.name}</strong><span>{badge.description}</span></div>{badge.earned && <Check size={15}/>}</div>)}</section>
        <div className="lab-entry"><div><p className="eyebrow">СВОБОДНО ИЗСЛЕДВАНЕ</p><h2>Преди мисията — експериментирай.</h2></div><button className="secondary-button" onClick={() => openLab(next)}>Свободна лаборатория<ArrowDown size={16}/></button></div>
        <Lab activity={activity} completed={completed} onComplete={complete} onChange={setActivity}/>
        <div className="discovery-note"><span className="note-spark"><Sparkles size={23}/></span><div><strong>Разбирането е по-важно от скоростта.</strong><p>Всички лаборатории са достъпни. Прескочи познатото, опитай нещо ново и се върни, когато поискаш.</p></div></div>
      </> : page === 'skills' ? <section className="section dashboard"><p className="eyebrow">ТВОИТЕ ОТКРИТИЯ</p><h1>Карта на уменията</h1><p className="intro">Всяка лаборатория е стъпка към по-голяма идея. Избери откъде да продължиш.</p><div className="skills-list">{(['split', 'equivalence', 'line', 'common'] as Activity[]).map((id, i) => <button key={id} onClick={() => openLab(id)}><span className={`skill-number ${completed.includes(id) ? 'done' : ''}`}>{completed.includes(id) ? <Check size={20}/> : i + 1}</span><span><strong>{activities[id].name}</strong><small>{activities[id].description}</small></span><span className="skill-status">{completed.includes(id) ? 'Открито' : 'За изследване'}</span><ArrowRight size={18}/></button>)}</div><h2 className="missions-skill-heading">Мисии в седемте свята</h2><div className="skills-list">{missions.map(m => <button key={m.id} onClick={() => openMission(m.id)}><span className={`skill-number ${game.results[m.id] ? 'done' : ''}`}>{game.results[m.id] ? <Check size={20}/> : m.world}</span><span><strong>{m.title}</strong><small>{m.skill} · {m.difficulty}</small></span><span className="skill-status">{game.results[m.id] ? game.results[m.id].assisted ? 'С насока' : 'Самостоятелно' : 'За изследване'}</span><ArrowRight size={18}/></button>)}</div><p className="dashboard-note">Завършеното упражнение отбелязва откритие, а не трайно овладяване. Мисиите и откритията се пазят между сесиите. Трайното овладяване изисква независими решения през различни дни.</p></section> : <section className="section dashboard"><p className="eyebrow">НАПРЕДЪК БЕЗ БЪРЗАНЕ</p><h1>За родителя</h1><p className="intro">Кратки мисии, нови светове и време за разсъждение.</p><div className="parent-stats"><div><span>Завършени мисии</span><strong>{Object.keys(game.results).length}<small> / 14</small></strong></div><div><span>Самостоятелни решения</span><strong>{Object.values(game.results).filter(r => !r.assisted).length}<small> мисии</small></strong></div><div><span>Изследвани светове</span><strong>{worldCount}<small> / 7</small></strong></div></div><div className="parent-panel"><h2>Как работи напредъкът?</h2><p>Четиринадесет интерактивни мисии водят от частите през операциите и уравненията до остатъци и обратно разсъждение. Една решена мисия е достатъчна за следващия свят. Познатите теми могат да бъдат прескочени с входна мисия в по-труден свят.</p><p>Самостоятелното решение носи 50 XP, а решението с насока — 30 XP. Наградата се дава веднъж, а опитите не отнемат точки. Статусът отчита първото завършване на всяка мисия и не е оценка за трайно овладяване. Напредъкът се пази на това устройство.</p><button className="button" onClick={() => openMission(recommended.id)}>Продължи мисиите<ArrowRight size={17}/></button></div><ProgressTools game={game} onImport={imported => { setGame(imported); setNotice('Напредъкът е възстановен.'); }}/></section>}
      {storageError && <p className="storage-warning" role="alert">Браузърът не позволява записване. Откритията ще се пазят само докато страницата е отворена.</p>}
      <footer className="footer"><span>fractionlab <span> / </span> Математическата академия</span><span>Създадено за откриватели. <span className="footer-stage">Академията · Етап Б</span></span></footer>
      </main>
    </div>
    {notice && <div className="notice" role="status"><Sparkles size={20}/><p>{notice}</p><button aria-label="Затвори съобщението" onClick={() => setNotice('')}><X size={20}/></button></div>}
  </div></MotionConfig>;
}
