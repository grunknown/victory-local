import React, { useEffect, useState } from 'react';
import { LuChevronRight, LuPhone, LuSend, LuCheck, LuMail } from 'react-icons/lu';
import { DEPTS, GROUPS, PEOPLE, byId, deptPeople, groupPeople } from './data.js';
import { cx, Avatar, StatusPill, copyText, toast } from './ui.jsx';

// Подразделение одним списком: заголовок дирекции → директор → отделы → группы (тимлид + участники).
// Люди — карточками на подложке: фото с кольцом статуса, ФИО, должность, отдел, город и время, теги, быстрые действия.

const DIR_HUE = { board: 265, marketing: 230, orm: 200, leadgen: 30, production: 300, clients: 150, vdl: 55, it: 210, people: 340, admin: 100 };
export const DirTile = ({ d, size = 18 }) => (
  <span className="grid shrink-0 place-items-center rounded-[5px] font-semibold"
    style={{ width: size, height: size, fontSize: size * 0.55, background: `oklch(0.62 0.12 ${DIR_HUE[d.id] ?? 260} / 0.2)`, color: `oklch(0.78 0.12 ${DIR_HUE[d.id] ?? 260})` }}>
    {d.short[0]}
  </span>
);

const useNow = () => null;

// Карточка фиксированной высоты (ровная сетка):
// верх — фото, ФИ, должность, статус; середина — теги занятости; низ — быстрые действия Telegram и телефон.
export function PersonCard({ p, onOpen }) {
  const [copied, setCopied] = useState(false);
  const copyPhone = (e) => {
    e.stopPropagation();
    copyText(p.phone, () => { setCopied(true); toast('Телефон скопирован', `${p.first} ${p.last} · ${p.phone}`); setTimeout(() => setCopied(false), 1400); });
  };
  const copyMail = (e) => {
    e.stopPropagation();
    copyText(p.email, () => { setCopied(true); toast('Почта скопирована', `${p.first} ${p.last} · ${p.email}`); setTimeout(() => setCopied(false), 1400); });
  };
  const btn = 'flex h-9 flex-1 items-center justify-center gap-2 rounded-lg bg-muted text-[13px] font-medium text-fg/85 transition-colors hover:bg-row-active hover:text-fg';
  return (
    <div role="button" tabIndex={0} onClick={() => onOpen(p.id)} onKeyDown={(e) => e.key === 'Enter' && onOpen(p.id)}
      className="group/c flex min-w-0 cursor-pointer flex-col rounded-2xl border border-border-strong bg-card p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-border-hover hover:bg-card-2 hover:shadow-[0_16px_40px_-24px_rgba(0,0,0,0.9)]">
      <div className="flex items-start gap-3.5">
        <Avatar p={p} size={56} status />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[15px] leading-tight font-semibold text-fg">{p.first} {p.last}</div>
          <div className="mt-1 truncate text-[13px] text-muted-fg" title={p.role}>{p.role}</div>
          <div className="mt-2 flex h-[22px] items-center"><StatusPill p={p} remote /></div>
        </div>
      </div>
      <div className="mt-3 flex h-[22px] gap-1.5 overflow-hidden">
        {p.tags.slice(0, 3).map((t) => <span key={t} className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 text-[11.5px] text-muted-fg">{t}</span>)}
      </div>
      <div className="mt-4 flex gap-2">
        {p.dept === 'board' ? (
          <button onClick={copyMail} className={btn}>{copied ? <LuCheck className="h-4 w-4 text-ok" /> : <LuMail className="h-4 w-4 text-muted-fg" />}{copied ? 'Скопирована' : 'Почта'}</button>
        ) : (<>
          <a href={`https://t.me/${p.tg.slice(1)}`} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className={btn}><LuSend className="h-4 w-4 text-muted-fg" />Telegram</a>
          <button onClick={copyPhone} className={btn}>{copied ? <LuCheck className="h-4 w-4 text-ok" /> : <LuPhone className="h-4 w-4 text-muted-fg" />}{copied ? 'Скопирован' : 'Телефон'}</button>
        </>)}
      </div>
    </div>
  );
}

const GRID = 'grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4';

function Crumbs({ items, go }) {
  return (
    <nav className="flex flex-wrap items-center gap-1 text-[13px] text-muted-fg" aria-label="Путь">
      {items.map((it, i) => (
        <React.Fragment key={it.label}>
          {i > 0 && <LuChevronRight className="h-3.5 w-3.5 text-faint" />}
          <span className={cx('px-1', i === items.length - 1 && 'text-fg')}>{it.label}</span>
        </React.Fragment>
      ))}
    </nav>
  );
}

function Label({ children }) {
  return <h3 className="mb-3 text-[17px] font-semibold tracking-[-0.01em] text-fg">{children}</h3>;
}

function Group({ gid, onOpen, now }) {
  const g = GROUPS[gid];
  const lead = byId(g.lead);
  const members = groupPeople(gid).filter((p) => p.id !== g.lead);
  return (
    <section className="mt-8">
      <h3 className="mb-3 text-[17px] font-semibold tracking-[-0.01em]">{g.name}</h3>
      <div className={GRID}>
        <PersonCard p={lead} onOpen={onOpen} now={now} />
        {members.map((p) => <PersonCard key={p.id} p={p} onOpen={onOpen} now={now} />)}
      </div>
    </section>
  );
}

function DeptSection({ d, onOpen, now }) {
  return (
    <section id={`dept-${d.id}`} className="mt-14 scroll-mt-24">
      <h2 className="display text-[26px]">{d.name}</h2>
      <div className="mt-5"><Label>Руководитель отдела</Label>
        <div className={GRID}><PersonCard p={byId(d.head)} onOpen={onOpen} now={now} /></div>
      </div>
      {d.groups.length
        ? d.groups.map((gid) => <Group key={gid} gid={gid} onOpen={onOpen} now={now} />)
        : <div className={cx(GRID, 'mt-8')}>{deptPeople(d.id).filter((p) => !p.isHead).map((p) => <PersonCard key={p.id} p={p} onOpen={onOpen} now={now} />)}</div>}
    </section>
  );
}

// ---------- Дирекция целиком, одним списком ----------
export function DirectionPage({ id, focus, go, openPerson }) {
  const d = DEPTS[id];
  const now = useNow();
  useEffect(() => {
    if (!focus) return;
    const el = document.getElementById(`dept-${focus}`);
    if (el) requestAnimationFrame(() => el.scrollIntoView({ block: 'start' }));
  }, [focus]);
  return (
    <div className="mx-auto max-w-[1280px]">
      <Crumbs items={[{ label: 'Сотрудники' }, { label: d.name }]} go={go} />
      <div className="mt-3 flex items-center gap-3">
        <DirTile d={d} size={32} />
        <h1 className="display text-[clamp(24px,3.2vw,34px)]">{d.name}</h1>
      </div>
      {id === 'board' ? (
        <div className={cx(GRID, 'mt-8')}>{deptPeople('board').map((p) => <PersonCard key={p.id} p={p} onOpen={openPerson} now={now} />)}</div>
      ) : (
        <>
          <div className="mt-8"><Label>Директор</Label>
            <div className={GRID}><PersonCard p={byId(d.head)} onOpen={openPerson} now={now} /></div>
          </div>
          {d.children.map((c) => <DeptSection key={c.id} d={DEPTS[c.id]} onOpen={openPerson} now={now} />)}
        </>
      )}
    </div>
  );
}

// ---------- Витрина карточек для оценки дизайна (#cards) ----------
export function CardsDemo({ openPerson }) {
  const now = useNow();
  const pick = (f) => PEOPLE.find(f);
  const people = [
    pick((p) => p.photo && !p.vacation && !p.sick && !p.remote && p.dept === 'ppc' && p.group),
    pick((p) => p.photo && p.remote && !p.vacation && !p.sick && p.city === 'Москва'),
    pick((p) => p.photo && p.vacation && p.group),
    pick((p) => p.photo && p.sick),
  ].filter(Boolean);
  const caption = ['Работает', 'Работает удалённо', 'В отпуске', 'На больничном'];
  return (
    <div className="mx-auto max-w-[1280px]">
      <div className="text-[13px] text-muted-fg">Витрина компонента</div>
      <h1 className="display mt-1.5 text-[clamp(24px,3.2vw,34px)]">Карточка сотрудника</h1>
      <p className="mt-2 max-w-[640px] text-[14px] text-muted-fg">Кольцо вокруг фото показывает статус: зелёное — работает, жёлтое — в отпуске, красное — на больничном. Кнопки внизу открывают чат в Telegram и копируют телефон, клик по карточке открывает профиль.</p>
      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {people.map((p, i) => (
          <div key={p.id}>
            <div className="mb-2 text-[12px] text-muted-fg">{caption[i]}</div>
            <PersonCard p={p} onOpen={openPerson} />
          </div>
        ))}
      </div>
    </div>
  );
}
