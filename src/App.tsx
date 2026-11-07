import { useState } from 'react';
import { MotionConfig, motion } from 'motion/react';
import { ArrowDown, ArrowRight, BookOpen, Check, ChevronRight, Compass, FlaskConical, Grid2X2, Layers3, Leaf, LockKeyhole, Map, Sparkles, Target, Trophy, X } from 'lucide-react';
import AcademyArt from './components/AcademyArt';
import Lab, { activities } from './interactions/Lab';
import { readProgress, saveProgress, type Activity } from './storage/progress';
const worlds = [
  { name: 'Залата на частите', topic: 'Цяло, части и числова ос', icon: Grid2X2, tone: 'blue', number: '01', activity: 'split' as Activity },
  { name: 'Огледалният лабиринт', topic: 'Равни дроби и преобразуване', icon: Layers3, tone: 'teal', number: '02', activity: 'equivalence' as Activity },
  { name: 'Кулата на знаменателите', topic: 'Общ знаменател и сравняване', icon: FlaskConical, tone: 'violet', number: '03', activity: 'common' as Activity },
  { name: 'Машината на операциите', topic: 'Събиране, умножение и още', icon: Sparkles, tone: 'amber', number: '04' },
  { name: 'Лабораторията на неизвестното', topic: 'Уравнения и обратен ход', icon: Target, tone: 'blue', number: '05' },
  { name: 'Островът на логиката', topic: 'Остатъци и многостъпкови задачи', icon: Compass, tone: 'teal', number: '06' },
  { name: 'Арената на математиците', topic: 'Стратегия и състезателни задачи', icon: Trophy, tone: 'coral', number: '07' },
];
export default function App() {
  const [completed, setCompleted] = useState<Activity[]>(readProgress);
  const [activity, setActivity] = useState<Activity>('split');
  const [page, setPage] = useState<'academy' | 'skills' | 'parent'>('academy');
  const [notice, setNotice] = useState('');
  const [storageError, setStorageError] = useState(false);
  function complete(id: Activity) {
    setCompleted(previous => {
      if (previous.includes(id)) return previous;
      const next = [...previous, id];
      if (!saveProgress(next)) setStorageError(true);
      return next;
    });
  }
  function openLab(id: Activity) {
    setActivity(id); setPage('academy');
    requestAnimationFrame(() => document.getElementById('laboratory')?.scrollIntoView({ behavior: 'instant', block: 'start' }));
  }
  const next = (['split', 'equivalence', 'line', 'common'] as Activity[]).find(id => !completed.includes(id)) ?? 'common';
  return <MotionConfig reducedMotion="user"><div className="app">
    <a className="skip-link" href="#main">Към съдържанието</a>
    <aside className="sidebar"><a className="brand" href="#" onClick={() => setPage('academy')} aria-label="Fraction Lab — начало"><span className="brand-symbol"><span /><span /><span /></span><span>fraction<span className="brand-light">lab</span><small>МАТЕМАТИЧЕСКАТА АКАДЕМИЯ</small></span></a>
      <div className="sidebar-label">ТВОЕТО ПРОСТРАНСТВО</div>
      <nav aria-label="Главна навигация"><button className={page === 'academy' ? 'nav-item active' : 'nav-item'} onClick={() => setPage('academy')}><Map size={20} />Академията<span className="nav-dot" /></button><button className={page === 'skills' ? 'nav-item active' : 'nav-item'} onClick={() => setPage('skills')}><Compass size={20} />Карта на уменията</button><button className={page === 'parent' ? 'nav-item active' : 'nav-item'} onClick={() => setPage('parent')}><BookOpen size={20} />За родителя</button></nav>
      <div className="sidebar-journey"><div className="mini-orbit"><Sparkles size={23} /></div><p>Всяко откритие<br/>започва с „Ами ако…“</p><span>Опитай. Раздвижи. Разбери.</span></div>
      <div className="sidebar-bottom"><Leaf size={16} /><span>Учи със собствено темпо</span></div>
    </aside>
    <div className="main-column"><header className="topbar"><div className="breadcrumb">Твоето пространство<ChevronRight size={14} /><strong>{page === 'academy' ? 'Академията' : page === 'skills' ? 'Карта на уменията' : 'За родителя'}</strong></div><div className="topbar-right"><span className="xp"><Sparkles size={16} />{completed.length * 25} XP</span><span className="profile" aria-label="Профил: изследовател">И</span></div></header>
      <main id="main">
      {page === 'academy' ? <>
        <section className="hero"><div className="hero-copy"><div className="badge"><span />МЯСТО ЗА ЛЮБОПИТНИ УМОВЕ</div><h1>Големи открития.<br/><span>Малки части.</span></h1><p>Математиката не е само на хартия.<br className="desktop-break"/> Раздвижи дробите и виж как всичко се свързва.</p><div className="hero-actions"><button className="button" onClick={() => openLab(next)}>{completed.length ? 'Продължи откриването' : 'Влез в академията'}<ArrowRight size={18} /></button><a className="hero-secondary" href="#worlds">Разгледай световете<ArrowDown size={16} /></a></div><div className="hero-meta"><span><Check size={14} />Учене чрез действие</span><span><Check size={14} />Без бързане</span></div></div><div className="hero-visual"><div className="art-glow"/><AcademyArt/><div className="floating-label label-top"><span className="label-icon teal"><Layers3 size={17} /></span><div><strong>Различни части</strong><small>Едно и също цяло.</small></div></div><div className="floating-label label-bottom"><span className="label-icon blue"><Compass size={18} /></span><div><strong>7 свята за откриване</strong><small>От първата дроб до големите идеи.</small></div></div></div></section>
        <section className="journey-strip" aria-label="Твоят напредък"><div className="journey-icon"><FlaskConical size={23} /></div><div className="journey-text"><strong>{completed.length === 4 ? 'Първата експедиция е завършена!' : 'Твоята първа експедиция'}</strong><span>{completed.length === 4 ? 'Четири открития. Върни се и експериментирай отново.' : '4 открития — от частите до общия знаменател'}</span></div><div className="journey-progress"><div><span>Открити лаборатории</span><strong>{completed.length} / 4</strong></div><progress value={completed.length} max={4} aria-label="Открити лаборатории" /></div><button className="round-button" aria-label="Продължи експедицията" onClick={() => openLab(next)}><ArrowRight size={19} /></button></section>
        <section className="section worlds" id="worlds" aria-labelledby="worlds-title"><div className="section-heading"><div><p className="eyebrow">КАРТА НА АКАДЕМИЯТА</p><h2 id="worlds-title">Един свят води към следващия.</h2></div><span className="section-note">Твоето математическо приключение</span></div><div className="world-grid">{worlds.map((world, i) => <motion.button whileHover={{ y: -4 }} transition={{ duration: 0.18 }} className={`world-card ${world.tone} ${!world.activity ? 'future-world' : ''}`} key={world.number} onClick={() => world.activity ? openLab(world.activity) : setNotice(`${world.name}: ${world.topic}. Този свят е планиран за следващите етапи. В демонстрацията можеш да изследваш четирите интерактивни лаборатории.`)}><div className="world-card-top"><span className="world-icon"><world.icon size={25} strokeWidth={1.5}/></span><span className="world-number">{world.number}</span></div><div><h3>{world.name}</h3><p>{world.topic}</p></div><div className="world-card-bottom">{world.activity ? <><span className="available-dot"/>Изследвай<ArrowRight size={16}/></> : <><LockKeyhole size={13}/><span>Предстои</span><span className="phase">Етап {i === 6 ? 'D' : 'C'}</span></>}</div></motion.button>)}</div></section>
        <Lab activity={activity} completed={completed} onComplete={complete} onChange={setActivity}/>
        <div className="discovery-note"><span className="note-spark"><Sparkles size={23}/></span><div><strong>Разбирането е по-важно от скоростта.</strong><p>Всички лаборатории са достъпни. Прескочи познатото, опитай нещо ново и се върни, когато поискаш.</p></div></div>
      </> : page === 'skills' ? <section className="section dashboard"><p className="eyebrow">ТВОИТЕ ОТКРИТИЯ</p><h1>Карта на уменията</h1><p className="intro">Всяка лаборатория е стъпка към по-голяма идея. Избери откъде да продължиш.</p><div className="skills-list">{(['split', 'equivalence', 'line', 'common'] as Activity[]).map((id, i) => <button key={id} onClick={() => openLab(id)}><span className={`skill-number ${completed.includes(id) ? 'done' : ''}`}>{completed.includes(id) ? <Check size={20}/> : i + 1}</span><span><strong>{activities[id].name}</strong><small>{activities[id].description}</small></span><span className="skill-status">{completed.includes(id) ? 'Открито' : 'За изследване'}</span><ArrowRight size={18}/></button>)}</div><p className="dashboard-note">Завършеното упражнение отбелязва откритие, а не трайно овладяване. Проследяването на знанията през различни сесии предстои в следващ етап.</p></section> : <section className="section dashboard"><p className="eyebrow">ПОГЛЕД КЪМ ПЪРВИТЕ СТЪПКИ</p><h1>За родителя</h1><p className="intro">Учене чрез експериментиране, със собствено темпо.</p><div className="parent-stats"><div><span>Открити лаборатории</span><strong>{completed.length}<small> / 4</small></strong></div><div><span>Спечелен опит</span><strong>{completed.length * 25}<small> XP</small></strong></div><div><span>Учебен етап</span><strong className="stat-text">Изследване</strong></div></div><div className="parent-panel"><h2>Какво показва тази демонстрация?</h2><p>Детето може да разделя цяло на части, да преобразува равни дроби, да поставя дроби върху числова ос и да намира общ знаменател. Няма ограничение във времето и няма наказание за опитите.</p><p>Откритията се пазят локално в този браузър. Те не са оценка за овладяване на материала. Подробните данни за точност, използвани насоки и напредък във времето са част от следващите етапи.</p><button className="button" onClick={() => openLab(next)}>Отвори лабораториите<ArrowRight size={17}/></button></div></section>}
      {storageError && <p className="storage-warning" role="alert">Браузърът не позволява записване. Откритията ще се пазят само докато страницата е отворена.</p>}
      <footer className="footer"><span>fractionlab <span> / </span> Математическата академия</span><span>Създадено за откриватели. <span className="footer-stage">Демонстрация · Етап А</span></span></footer>
      </main>
    </div>
    {notice && <div className="notice" role="status"><Sparkles size={20}/><p>{notice}</p><button aria-label="Затвори съобщението" onClick={() => setNotice('')}><X size={20}/></button></div>}
  </div></MotionConfig>;
}
