import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  LuHouse, LuNewspaper, LuUsers, LuCalendar, LuHeadset, LuFileText, LuBookOpen, LuShoppingBag, LuSearch, LuBell, LuSun, LuMoon,
  LuChevronRight, LuX, LuMenu, LuCopy, LuCheck, LuPhone, LuMail, LuMapPin, LuCake, LuClock, LuArrowRight, LuPlane, LuBuilding2, LuSend, LuThermometer,
} from 'react-icons/lu';
import { MARK, WORD } from './logo.js';
import { Caret, CaretRight } from './icons.jsx';
import { DIRECTIONS, DEPTS, GROUPS, PEOPLE, ME, byId, dirCount, managerOf, search, MY_COINS, deptPeople } from './data.js';
import { cx, Avatar, VacationPill, StatusPill, Coin, fmtDay, fmtDM, tenure, deptPath, copyText, Button } from './ui.jsx';

export const NAV_TOP = [
  { id: 'home', label: 'Главная', icon: LuHouse },
  { id: 'blog', label: 'Блог', icon: LuNewspaper, match: (r) => r.startsWith('news-') },
];
export const NAV_OFFICE = [
  { id: 'rooms', label: 'Переговорки', icon: LuCalendar },
  { id: 'it', label: 'Заявка в IT', icon: LuHeadset },
  { id: 'forms', label: 'Бланки документов', icon: LuFileText },
  { id: 'kb', label: 'База знаний', icon: LuBookOpen },
  { id: 'store', label: 'Магазин мерча', icon: LuShoppingBag },
];
const DIR_HUE = { board: 265, marketing: 230, orm: 200, leadgen: 30, production: 300, clients: 150, vdl: 55, it: 210, people: 340, admin: 100 };

export function Logo({ className, word = true }) {
  return (
    <svg viewBox={word ? '0 0 718 511' : '150 20 420 330'} className={className} role="img" aria-label="Victory Group">
      {MARK.map((d, i) => <path key={i} d={d} fill="currentColor" />)}
      {word && <path d={WORD} fill="currentColor" />}
    </svg>
  );
}

// Горизонтальный логотип для сайдбара: знак + «VICTORY group» из исходного SVG
export function LogoInline() {
  return (
    <span className="flex items-center gap-2.5">
      <svg viewBox="160 26 400 310" className="h-7 w-auto" aria-hidden="true">
        <path d={MARK[0]} fill="currentColor" />
        <path d={MARK[1]} fill="currentColor" />
      </svg>
      <span className="leading-none">
        <span className="block text-[16px] font-semibold tracking-[0.06em] uppercase">Victory</span>
        <span className="block text-[10px] tracking-[0.3em] text-muted-fg uppercase">local</span>
      </span>
    </span>
  );
}

export function Loader({ onDone }) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setDone(true), 1150);
    const t2 = setTimeout(onDone, 1600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  return (
    <div className={cx('loader', done && 'done')} aria-hidden="true">
      <div className="sweep" />
      <svg viewBox="0 0 718 511" className="relative w-[min(260px,60vw)]">
        <g className="mark">{MARK.map((d, i) => <path key={i} d={d} />)}</g>
        <path className="word" d={WORD} fill="#fff" />
      </svg>
    </div>
  );
}

function Row({ icon: Icon, label, active, onClick, collapsed, indent = 0, trailing, tile }) {
  return (
    <button onClick={onClick} data-tip={collapsed ? label : undefined}
      className={cx('tip group/row relative flex h-[30px] w-full items-center gap-2.5 rounded-md text-[13px] transition-colors',
        collapsed ? 'justify-center px-0' : 'px-2',
        active ? 'bg-row-active text-fg' : 'text-fg/80 hover:bg-row-hover hover:text-fg')}
      style={indent ? { paddingLeft: 8 + indent } : undefined}>
      {tile || (Icon && <Icon className={cx('h-[17px] w-[17px] shrink-0', active ? 'text-fg' : 'text-muted-fg group-hover/row:text-fg')} />)}
      {!collapsed && <span className="min-w-0 flex-1 truncate text-left">{label}</span>}
      {!collapsed && trailing}
    </button>
  );
}

function GroupLabel({ label, open, onToggle }) {
  return (
    <button onClick={onToggle} className="group/g flex h-7 w-fit items-center gap-1 rounded-md px-2 text-[12px] font-medium text-muted-fg hover:text-fg">
      {label}
      <Caret className={cx('h-3.5 w-3.5 transition-transform', !open && '-rotate-90')} />
    </button>
  );
}

const DirTile = ({ d }) => (
  <span className="grid h-[18px] w-[18px] shrink-0 place-items-center rounded-[5px] text-[10px] font-semibold" style={{ background: `oklch(0.62 0.12 ${DIR_HUE[d.id] ?? 260} / 0.2)`, color: `oklch(0.78 0.12 ${DIR_HUE[d.id] ?? 260})` }}>
    {d.short[0]}
  </span>
);

export function Sidebar({ route, go, open, onClose }) {
  const [groups, setGroups] = useState({ people: true, office: true });
  const [openDirs, setOpenDirs] = useState(() => {
    const d = DEPTS[route.replace('people-', '')];
    return d ? { [d.parent || d.id]: true } : {};
  });
  const c = false;
  const curDept = route.startsWith('people-') ? DEPTS[route.slice(7)] : null;
  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/60 lg:hidden fade" onClick={onClose} />}
      <aside className={cx(
        'fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar transition-[transform,width] duration-200 lg:relative lg:z-20 lg:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full',
        'w-[248px]',
      )} style={{ paddingLeft: 'env(safe-area-inset-left, 0px)' }}>
        <div className="flex h-[52px] shrink-0 items-center gap-1 px-3">
          <button onClick={() => go('home')} className="flex min-w-0 flex-1 items-center gap-2 rounded-md px-1.5 py-1 hover:bg-row-hover">
            <span className="grid h-[22px] w-[22px] shrink-0 place-items-center rounded-[6px] bg-fg text-bg">
              <svg viewBox="160 26 400 310" className="h-3 w-auto" aria-hidden="true"><path d={MARK[0]} fill="currentColor" /><path d={MARK[1]} fill="currentColor" /></svg>
            </span>
            <span className="truncate text-[13px] font-semibold">Victory Local</span>
          </button>
          {open && <button onClick={onClose} className="grid h-7 w-7 place-items-center rounded-md text-muted-fg hover:bg-row-hover hover:text-fg lg:hidden" aria-label="Закрыть меню"><LuX className="h-4 w-4" /></button>}
        </div>

        <nav className={cx('flex-1 pb-4', c ? 'overflow-visible px-2' : 'overflow-x-hidden overflow-y-auto px-3')}>
          <div className="mt-2 flex flex-col gap-px">
            {NAV_TOP.map((n) => <Row key={n.id} icon={n.icon} label={n.label} collapsed={c} active={route === n.id || n.match?.(route)} onClick={() => go(n.id)} />)}
          </div>

          <div className="mt-5">
            {!c ? <GroupLabel label="Сотрудники" open={groups.people} onToggle={() => setGroups((g) => ({ ...g, people: !g.people }))} /> : <div className="mx-2 mb-2 border-t border-border" />}
            {(groups.people || c) && (
              <div className="mt-px flex flex-col gap-px">
                {!c && DIRECTIONS.map((d) => {
                  const isOpen = openDirs[d.id];
                  const active = route === `people-${d.id}`;
                  return (
                    <div key={d.id}>
                      <div className="group/dir relative">
                        <Row tile={<DirTile d={d} />} label={d.short} active={active} onClick={() => go(`people-${d.id}`)}
                          trailing={d.children.length > 0 && (
                            <span role="button" tabIndex={0} aria-label={isOpen ? 'Свернуть' : 'Развернуть'}
                              onClick={(e) => { e.stopPropagation(); setOpenDirs((o) => ({ ...o, [d.id]: !o[d.id] })); }}
                              onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); setOpenDirs((o) => ({ ...o, [d.id]: !o[d.id] })); } }}
                              className={cx('-mr-1 grid h-5 w-5 place-items-center rounded text-muted-fg transition-opacity hover:bg-row-hover hover:text-fg', isOpen || active || curDept?.parent === d.id ? 'opacity-100' : 'opacity-0 group-hover/row:opacity-100')}>
                              <CaretRight className={cx('h-3.5 w-3.5 transition-transform', isOpen && 'rotate-90')} />
                            </span>
                          )} />
                      </div>
                      {isOpen && (
                        <div className="relative ml-[15px] flex flex-col gap-px border-l border-border py-px pl-[9px] fade">
                          {d.children.map((x) => (
                            <button key={x.id} onClick={() => go(`people-${x.id}`)}
                              className={cx('flex h-[28px] items-center rounded-md px-2 text-left text-[13px] transition-colors',
                                route === `people-${x.id}` ? 'bg-row-active text-fg' : 'text-muted-fg hover:bg-row-hover hover:text-fg')}>
                              <span className="truncate">{x.name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-5">
            {!c ? <GroupLabel label="Офис и сервисы" open={groups.office} onToggle={() => setGroups((g) => ({ ...g, office: !g.office }))} /> : <div className="mx-2 mb-2 border-t border-border" />}
            {(groups.office || c) && (
              <div className="mt-px flex flex-col gap-px">
                {NAV_OFFICE.map((n) => <Row key={n.id} icon={n.icon} label={n.label} collapsed={c} active={route === n.id || route.startsWith(n.id + '-')} onClick={() => go(n.id)} />)}
              </div>
            )}
          </div>
        </nav>
      </aside>
    </>
  );
}

export function useCoins() {
  const [coins, setCoins] = useState(() => window.__vlCoins ?? MY_COINS);
  useEffect(() => { const h = (e) => setCoins((c) => c + e.detail); addEventListener('coins', h); return () => removeEventListener('coins', h); }, []);
  return coins;
}

export function Header({ onMenu, onSearch, theme, setTheme, go, openPerson }) {
  const [bell, setBell] = useState(false);
  const coins = useCoins();
  return (
    <header className="sticky z-30 flex h-[52px] items-center gap-3 border-b border-border bg-bg/85 backdrop-blur-xl" style={{ top: 'env(safe-area-inset-top, 0px)', paddingLeft: 'max(16px, env(safe-area-inset-left, 0px))', paddingRight: 'max(16px, env(safe-area-inset-right, 0px))' }}>
      <button className="rounded-lg p-2 hover:bg-muted lg:hidden" onClick={onMenu} aria-label="Меню"><LuMenu className="h-5 w-5" /></button>
      <button onClick={onSearch} className="flex h-8 min-w-0 flex-1 items-center gap-2.5 rounded-lg border border-border bg-card px-3 text-left text-muted-fg transition-colors hover:border-border-strong md:max-w-[460px]">
        <LuSearch className="h-4 w-4 shrink-0" />
        <span className="flex-1 truncate">Поиск людей, документов, переговорок…</span>
        <kbd className="hidden rounded-md border border-border bg-muted px-1.5 py-0.5 text-[11px] font-sans sm:block">Ctrl K</kbd>
      </button>
      <div className="ml-auto flex items-center gap-1.5">
        <button onClick={() => go('store')} className="hidden h-9 items-center gap-1.5 rounded-xl bg-accent-soft px-3 text-[13px] font-semibold text-accent tnum sm:flex" title="Victory Coin">
          <Coin size={16} />{coins.toLocaleString('ru')}
        </button>
        <div className="relative">
          <Button variant="ghost" size="icon" onClick={() => setBell((v) => !v)} aria-label="Уведомления">
            <LuBell className="h-[18px] w-[18px]" />
          </Button>
          <span className="pointer-events-none absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent ring-2 ring-bg" />
          {bell && <Notifications onClose={() => setBell(false)} go={go} />}
        </div>
        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Сменить тему">
          {theme === 'dark' ? <LuSun className="h-[18px] w-[18px]" /> : <LuMoon className="h-[18px] w-[18px]" />}
        </Button>
        <button onClick={() => openPerson(ME.id)} className="ml-1 flex items-center gap-2.5 rounded-xl py-1 pr-2 pl-1 hover:bg-muted">
          <Avatar p={ME} size={32} />
          <span className="hidden text-left leading-tight xl:block"><span className="block text-[13px] font-medium">{ME.name}</span><span className="block text-[11px] text-muted-fg">{ME.role}</span></span>
        </button>
      </div>
    </header>
  );
}

function Notifications({ onClose, go }) {
  const ref = useRef();
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    setTimeout(() => document.addEventListener('click', h));
    return () => document.removeEventListener('click', h);
  }, []);
  const items = [
    { t: 'Новая новость: переезд в штаб-квартиру на Восточной', s: '10 минут назад', to: 'news-n1' },
    { t: 'Бронь «Эльбрус» на 15:00 подтверждена', s: '1 час назад', to: 'rooms' },
    { t: 'Ваш заказ «Стикерпак» готов к выдаче у HR', s: 'вчера', to: 'store' },
  ];
  return (
    <div ref={ref} className="pop absolute right-0 mt-2 w-[min(340px,calc(100vw-32px))] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/40">
      <div className="border-b border-border px-4 py-3 text-[13px] font-semibold">Уведомления</div>
      {items.map((i) => (
        <button key={i.t} onClick={() => { go(i.to); onClose(); }} className="flex w-full gap-3 px-4 py-3 text-left hover:bg-muted">
          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
          <span><span className="block text-[13px]">{i.t}</span><span className="text-[12px] text-muted-fg">{i.s}</span></span>
        </button>
      ))}
    </div>
  );
}

// ---------------- Ctrl+K ----------------
const ACTIONS = [
  { label: 'Оформить отпуск', hint: 'Бланки документов', to: 'forms', kw: 'отпуск заявление' },
  { label: 'Забронировать переговорку', hint: 'Переговорки', to: 'rooms', kw: 'переговорка бронь встреча' },
  { label: 'Не работает принтер, VPN или почта', hint: 'Заявка в IT', to: 'it', kw: 'принтер vpn почта пароль it айти компьютер монитор' },
  { label: 'Справка с места работы, 2-НДФЛ', hint: 'Бланки документов', to: 'forms', kw: 'справка ндфл' },
  { label: 'Новичку: с чего начать', hint: 'База знаний', to: 'kb', kw: 'онбординг новичок памятка адаптация' },
  { label: 'Магазин мерча', hint: 'Victory Coin', to: 'store', kw: 'мерч худи магазин коины' },
];

export function CommandPalette({ open, onClose, go, openPerson }) {
  const [q, setQ] = useState('');
  const [i, setI] = useState(0);
  const inputRef = useRef();
  useEffect(() => { if (open) { setQ(''); setI(0); requestAnimationFrame(() => inputRef.current?.focus()); } }, [open]);
  const people = useMemo(() => search(q, 6), [q]);
  const depts = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    return Object.values(DEPTS).filter((d) => d.name.toLowerCase().includes(s)).slice(0, 3);
  }, [q]);
  const actions = useMemo(() => {
    const s = q.trim().toLowerCase();
    return ACTIONS.filter((a) => !s || (a.label + ' ' + a.kw).toLowerCase().includes(s)).slice(0, s ? 3 : 6);
  }, [q]);
  const items = [
    ...people.map((p) => ({ type: 'p', p, run: () => openPerson(p.id) })),
    ...depts.map((d) => ({ type: 'd', d, run: () => go(`people-${d.id}`) })),
    ...actions.map((a) => ({ type: 'a', a, run: () => go(a.to) })),
  ];
  if (!open) return null;
  const run = (it) => { onClose(); it.run(); };
  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setI((v) => Math.min(v + 1, items.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setI((v) => Math.max(v - 1, 0)); }
    if (e.key === 'Enter' && items[i]) run(items[i]);
    if (e.key === 'Escape') onClose();
  };
  let idx = -1;
  const row = (it, key, children) => { idx++; const me = idx; return (
    <button key={key} onMouseMove={() => i !== me && setI(me)} onClick={() => run(it)} className={cx('flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left', i === me ? 'bg-muted' : '')}>{children}</button>
  ); };
  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/60 px-4 pt-[12vh] backdrop-blur-sm fade" onClick={onClose}>
      <div className="pop w-full max-w-[620px] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/60" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-border px-4">
          <LuSearch className="h-5 w-5 text-muted-fg" />
          <input id="cmdk-input" ref={inputRef} value={q} onChange={(e) => { setQ(e.target.value); setI(0); }} onKeyDown={onKey}
            placeholder="Имя, должность, отдел или что нужно сделать" className="h-14 flex-1 bg-transparent text-[15px] no-ring outline-none placeholder:text-muted-fg" />
          <kbd className="rounded-md border border-border bg-muted px-1.5 py-0.5 text-[11px]">Esc</kbd>
        </div>
        <div className="max-h-[56vh] overflow-y-auto p-2">
          {people.length > 0 && <div className="eyebrow px-3 pt-2 pb-1">Люди</div>}
          {people.map((p) => 
            row(items.find((x) => x.p === p), p.id, <>
              <Avatar p={p} size={34} />
              <span className="min-w-0 flex-1"><span className="block truncate text-[14px]">{p.name}</span><span className="block truncate text-[12px] text-muted-fg">{p.role} · {DEPTS[p.dept].name}</span></span>
              <VacationPill p={p} />
            </>)
          )}
          {depts.length > 0 && <div className="eyebrow px-3 pt-3 pb-1">Отделы</div>}
          {depts.map((d) => 
            row(items.find((x) => x.d === d), d.id, <>
              <span className="grid h-[34px] w-[34px] place-items-center rounded-full bg-muted"><LuBuilding2 className="h-4 w-4 text-accent" /></span>
              <span className="flex-1 text-[14px]">{d.name}</span>
            </>)
          )}
          {actions.length > 0 && <div className="eyebrow px-3 pt-3 pb-1">{q ? 'Действия' : 'Быстрые действия'}</div>}
          {actions.map((a) => 
            row(items.find((x) => x.a === a), a.label, <>
              <span className="grid h-[34px] w-[34px] place-items-center rounded-full bg-accent-soft"><LuArrowRight className="h-4 w-4 text-accent" /></span>
              <span className="flex-1 text-[14px]">{a.label}</span>
              <span className="text-[12px] text-muted-fg">{a.hint}</span>
            </>)
          )}
          {items.length === 0 && <div className="px-3 py-10 text-center text-muted-fg">Ничего не нашлось. Попробуйте фамилию или название отдела.</div>}
        </div>
      </div>
    </div>
  );
}

// ---------------- Карточка сотрудника ----------------
export function PersonSheet({ id, onClose, openPerson, go }) {
  const [copied, setCopied] = useState('');
  useEffect(() => {
    const h = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, []);
  if (!id) return null;
  const p = byId(id);
  const mgr = managerOf(p) ? byId(managerOf(p)) : null;
  const deputy = p.vacation?.deputy ? byId(p.vacation.deputy) : p.sick?.deputy ? byId(p.sick.deputy) : null;
  const closed = p.dept === 'board'; // руководство: только почта, без телефона и Telegram
  const ledDept = p.isHead && p.dept !== 'board' ? DEPTS[p.dept] : null; // у C-level плашку «Руководит» не показываем
  const copy = (k, v) => copyText(v, () => { setCopied(k); setTimeout(() => setCopied(''), 1400); });
  // Свойства в стиле Linear: подпись слева, значение справа, без рамок; копирование появляется при наведении
  const Prop = ({ k, label, value, copyable, href }) => (
    <div className="group/prop -mx-2 flex min-h-9 items-center gap-3 rounded-lg px-2 transition-colors hover:bg-row-hover">
      <span className="w-[118px] shrink-0 text-[13px] text-muted-fg">{label}</span>
      {href
        ? <a href={href} target="_blank" rel="noreferrer" className="min-w-0 flex-1 truncate text-[13.5px] tnum hover:text-accent">{value}</a>
        : <span className="min-w-0 flex-1 truncate text-[13.5px] tnum select-all">{value}</span>}
      {copyable && (
        <button onClick={() => copy(k, value)} aria-label={`Скопировать: ${label}`}
          className={cx('grid h-7 w-7 shrink-0 place-items-center rounded-md text-muted-fg transition-opacity hover:bg-muted hover:text-fg', copied === k ? 'opacity-100' : 'opacity-0 group-hover/prop:opacity-100 focus-visible:opacity-100')}>
          {copied === k ? <LuCheck className="h-3.5 w-3.5 text-ok" /> : <LuCopy className="h-3.5 w-3.5" />}
        </button>
      )}
    </div>
  );
  const Action = ({ icon: Icon, label, onClick, href }) => {
    const cls = 'flex h-9 flex-1 items-center justify-center gap-2 rounded-lg bg-muted text-[13px] font-medium transition-colors hover:bg-row-active hover:text-fg';
    return href
      ? <a href={href} target="_blank" rel="noreferrer" className={cls}><Icon className="h-4 w-4 text-muted-fg" />{label}</a>
      : <button onClick={onClick} className={cls}><Icon className="h-4 w-4 text-muted-fg" />{label}</button>;
  };
  const Person = ({ x, sub, onClick, icon }) => (
    <button onClick={onClick} className="-mx-2 flex w-[calc(100%+16px)] items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-row-hover">
      {icon || <Avatar p={x} size={34} />}
      <span className="min-w-0 flex-1"><span className="block truncate text-[13.5px] font-medium">{x?.name ?? sub[0]}</span><span className="block truncate text-[12px] text-muted-fg">{x ? x.role : sub[1]}</span></span>
      <LuChevronRight className="h-4 w-4 text-faint" />
    </button>
  );
  return (
    <div className="fixed inset-0 z-[55] flex justify-end bg-black/50 fade" onClick={onClose}>
      <aside className="sheet relative h-full w-full max-w-[440px] overflow-y-auto border-l border-border bg-card" onClick={(e) => e.stopPropagation()}>
        <div className="relative h-32 overflow-hidden cover-bg">
          <div className="plates"><i style={{ left: '30%', top: '-90%' }} /><i style={{ left: '48%', top: '-70%' }} /><i style={{ left: '66%', top: '-50%' }} /></div>
          <button onClick={onClose} className="absolute top-3 right-3 rounded-full bg-black/40 p-2 text-white hover:bg-black/60" aria-label="Закрыть"><LuX className="h-4 w-4" /></button>
        </div>
        <div className="px-6 pb-8">
          <div className="-mt-12"><Avatar p={p} size={96} className="ring-4 ring-card" /></div>
          <h2 className="mt-4 text-[21px] leading-tight font-semibold text-balance">{[p.last, p.first, p.patr].filter(Boolean).join(' ')}</h2>
          <div className="mt-1.5 text-[14px] text-fg/85">{p.role}</div>
          <div className="mt-1 flex flex-wrap items-center gap-1 text-[12.5px] text-muted-fg">
            {deptPath(p.dept).map((d, i) => (
              <React.Fragment key={d.id}>{i > 0 && <LuChevronRight className="h-3 w-3" />}<button className="hover:text-fg" onClick={() => { onClose(); go(`people-${d.id}`); }}>{d.name}</button></React.Fragment>
            ))}
            {p.group && <><LuChevronRight className="h-3 w-3" /><span>{GROUPS[p.group].name}</span></>}
          </div>

          <div className="mt-5 flex gap-2">
            {!closed && <Action icon={LuSend} label="Telegram" href={`https://t.me/${p.tg.slice(1)}`} />}
            <Action icon={LuMail} label={copied === 'mail' ? 'Скопирована' : 'Почта'} onClick={() => copy('mail', p.email)} />
            {!closed && <Action icon={LuPhone} label={copied === 'phone' ? 'Скопирован' : 'Телефон'} onClick={() => copy('phone', p.phone)} />}
          </div>

          {p.vacation && (
            <div className="mt-5 flex items-start gap-3 rounded-lg bg-warn-soft px-3.5 py-3">
              <LuPlane className="mt-0.5 h-4 w-4 text-warn" />
              <div className="text-[13px]"><div className="font-medium text-warn">В отпуске до {fmtDay(p.vacation.until)}</div>
                {deputy && <div className="mt-0.5 text-fg/80">Замещает: <button className="underline decoration-dotted underline-offset-2 hover:text-accent" onClick={() => openPerson(deputy.id)}>{deputy.name}</button></div>}
              </div>
            </div>
          )}
          {p.sick && (
            <div className="mt-5 flex items-start gap-3 rounded-lg bg-danger-soft px-3.5 py-3">
              <LuThermometer className="mt-0.5 h-4 w-4 text-danger" />
              <div className="text-[13px]"><div className="font-medium text-danger">На больничном до {fmtDay(p.sick.until)}</div>
                {deputy && <div className="mt-0.5 text-fg/80">Замещает: <button className="underline decoration-dotted underline-offset-2 hover:text-accent" onClick={() => openPerson(deputy.id)}>{deputy.name}</button></div>}
              </div>
            </div>
          )}

          <div className="mt-7 text-[17px] font-semibold tracking-[-0.01em] text-fg">Контакты</div>
          <div className="mt-2">
            {!closed && <Prop k="phone" label="Рабочий телефон" value={p.phone} copyable />}
            {!closed && <Prop k="tg" label="Рабочий Telegram" value={p.tg} href={`https://t.me/${p.tg.slice(1)}`} copyable />}
            <Prop k="mail" label="Почта" value={p.email} copyable />
          </div>

          <div className="mt-7 text-[17px] font-semibold tracking-[-0.01em] text-fg">О сотруднике</div>
          <div className="mt-2">
            {p.remote ? <Prop k="place" label="Где работает" value="Удалённо" /> : <Prop k="place" label="Где сидит" value={`Восточная, 7Г · ${p.floor}`} />}
            <Prop k="bday" label="День рождения" value={fmtDay(p.bday)} />
          </div>

          {mgr && (
            <>
              <div className="mt-7 text-[17px] font-semibold tracking-[-0.01em] text-fg">Руководитель</div>
              <div className="mt-2"><Person x={mgr} onClick={() => openPerson(mgr.id)} /></div>
            </>
          )}
          {!mgr && ledDept && (
            <>
              <div className="mt-7 text-[17px] font-semibold tracking-[-0.01em] text-fg">Руководит</div>
              <div className="mt-2"><Person sub={[ledDept.name, 'Открыть структуру']} icon={<span className="grid h-[34px] w-[34px] place-items-center rounded-full bg-muted"><LuBuilding2 className="h-4 w-4 text-muted-fg" /></span>} onClick={() => { onClose(); go(`people-${ledDept.id}`); }} /></div>
            </>
          )}
          <p className="mt-8 text-[12px] text-faint">Данные приходят из кадровой системы. Если что-то неверно, напишите в HR.</p>
        </div>
      </aside>
    </div>
  );
}
