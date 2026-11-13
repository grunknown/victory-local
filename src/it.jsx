import React, { useEffect, useState } from 'react';
import { LuCheck, LuMapPin, LuSend, LuWrench } from './gicons.jsx';
import { PEOPLE, deptPeople } from './data.js';
import { cx, Avatar, toast } from './ui.jsx';

// Помощь Фиксиков — заявка в IT. Две вещи: что случилось и куда подойти. Ниже — статус заявок.

const FLOORS = ['2 этаж', '3 этаж', '4 этаж', '5 этаж', '6 этаж', 'Удалённо'];
const STEPS = ['Создана', 'Фиксик в пути', 'Решена'];
const pad = (n) => String(n).padStart(2, '0');
const hm = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
const fixers = () => {
  const it = deptPeople('sysadmin');
  return (it.length ? it : PEOPLE).filter((p) => p.photo).slice(0, 3);
};

// Заявки живут в памяти вкладки, чтобы не пропадали при переходах по порталу
const yesterday = new Date(Date.now() - 26 * 3600e3);
let TICKETS = [
  { id: 4127, text: 'Принтер на 4 этаже печатает пустые листы', place: '4 этаж · у кухни', created: yesterday, step: 2, fixer: 0 },
];

function useTickets() {
  const [list, setList] = useState(TICKETS);
  const update = (fn) => setList((x) => { TICKETS = fn(x); return TICKETS; });
  return [list, update];
}

export function ItPage({ openPerson }) {
  const [tickets, setTickets] = useTickets();
  const [text, setText] = useState('');
  const [floor, setFloor] = useState('');
  const [spot, setSpot] = useState('');
  const [tried, setTried] = useState(false);
  const team = fixers();
  const remote = floor === 'Удалённо';
  const ok = text.trim() && floor && (remote || spot.trim());

  // Новая заявка через несколько секунд «берётся в работу» — чтобы было видно, как меняется статус
  useEffect(() => {
    const open = tickets.filter((t) => t.step === 0);
    if (!open.length) return;
    const t = setTimeout(() => setTickets((x) => x.map((y) => (y.step === 0 ? { ...y, step: 1, taken: new Date() } : y))), 6000);
    return () => clearTimeout(t);
  }, [tickets]);

  const submit = (e) => {
    e.preventDefault();
    setTried(true);
    if (!ok) return;
    const t = { id: Math.max(...tickets.map((x) => x.id), 4127) + 1, text: text.trim(), place: remote ? 'Удалённо' : `${floor} · ${spot.trim()}`, created: new Date(), step: 0, fixer: tickets.length % Math.max(1, team.length) };
    setTickets((x) => [t, ...x]);
    setText(''); setSpot(''); setFloor(''); setTried(false);
    toast(`Заявка №${t.id} создана`, 'Фиксики уже видят её');
  };

  const field = 'w-full rounded-xl bg-muted px-3.5 text-[14px] text-fg outline-none no-ring placeholder:text-faint transition-colors focus:bg-row-active';

  return (
    <div>
      <div className="text-[13px] text-muted-fg">IT-поддержка</div>
      <h1 className="display mt-1.5 text-[clamp(26px,3.4vw,38px)]">Помощь Фиксиков</h1>
      <p className="mt-2 max-w-[560px] text-[15px] text-muted-fg">Опишите, что сломалось, и скажите, где вас найти. Фиксик подойдёт сам.</p>

      <div className="mt-8 grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <form onSubmit={submit} className="rounded-2xl bg-card p-5 sm:p-6">
          <label htmlFor="it-text" className="block text-[15px] font-semibold">Опишите проблему</label>
          <textarea id="it-text" value={text} onChange={(e) => setText(e.target.value)} rows={5}
            placeholder="Например, не включается второй монитор или не приходит почта"
            className={cx(field, 'mt-3 resize-none py-3 leading-relaxed')} />
          {tried && !text.trim() && <p className="mt-1.5 text-[12.5px] text-danger">Напишите хотя бы пару слов</p>}

          <div className="mt-6 text-[15px] font-semibold">Куда подойти</div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {FLOORS.map((f) => (
              <button type="button" key={f} onClick={() => setFloor(f)}
                className={cx('h-9 rounded-xl px-3.5 text-[13.5px] font-medium transition-colors', floor === f ? 'bg-accent text-accent-fg' : 'bg-muted text-fg/80 hover:bg-row-active hover:text-fg')}>
                {f}
              </button>
            ))}
          </div>
          {!remote && (
            <input value={spot} onChange={(e) => setSpot(e.target.value)} aria-label="Кабинет или место"
              placeholder="Кабинет или место, например опенспейс, стол 14"
              className={cx(field, 'mt-3 h-11')} />
          )}
          {remote && <p className="mt-3 text-[13px] text-muted-fg">Фиксик напишет вам в Telegram и подключится удалённо.</p>}
          {tried && (!floor || (!remote && !spot.trim())) && <p className="mt-1.5 text-[12.5px] text-danger">Укажите этаж и место</p>}

          <button type="submit" className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-accent text-[14px] font-semibold text-accent-fg transition-colors hover:bg-white/85">
            <LuSend className="h-4 w-4" />Позвать Фиксика
          </button>
        </form>

        <section>
          <h2 className="text-[17px] font-semibold tracking-[-0.01em]">Мои заявки</h2>
          <div className="mt-3 flex flex-col gap-3">
            {tickets.length === 0 && <p className="text-[14px] text-muted-fg">Заявок пока нет.</p>}
            {tickets.map((t) => <Ticket key={t.id} t={t} fixer={team[t.fixer]} openPerson={openPerson} />)}
          </div>
          {team.length > 0 && (
            <div className="mt-6 flex items-center gap-3 rounded-2xl bg-card p-4">
              <div className="flex -space-x-2">{team.map((p) => <Avatar key={p.id} p={p} size={32} className="rounded-full ring-2 ring-card" />)}</div>
              <div className="text-[13px] text-muted-fg">Сегодня дежурят {team.length} {team.length === 1 ? 'Фиксик' : 'Фиксика'}, с 9:00 до 19:00</div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function Ticket({ t, fixer, openPerson }) {
  const today = t.created.toDateString() === new Date().toDateString();
  const done = t.step === 2;
  return (
    <div className="rounded-2xl bg-card p-4 sm:p-5">
      <div className="flex items-center gap-2 text-[12.5px] text-muted-fg">
        <span className="tnum">№{t.id}</span>·
        <span>Создана {today ? 'сегодня' : 'вчера'} в {hm(t.created)}</span>
        <span className={cx('ml-auto rounded-full px-2.5 py-1 text-[12px] font-medium', done ? 'bg-ok-soft text-ok' : t.step === 1 ? 'bg-warn-soft text-warn' : 'bg-muted text-fg')}>{STEPS[t.step]}</span>
      </div>
      <p className="mt-2.5 text-[14.5px] leading-snug">{t.text}</p>
      <div className="mt-1.5 flex items-center gap-1.5 text-[12.5px] text-muted-fg"><LuMapPin className="h-3.5 w-3.5" />{t.place}</div>

      {t.step >= 1 && fixer && (
        <button onClick={() => openPerson(fixer.id)} className="-mx-2 mt-3 flex w-[calc(100%+16px)] items-center gap-2.5 rounded-xl px-2 py-1.5 text-left transition-colors hover:bg-row-hover">
          <Avatar p={fixer} size={28} />
          <span className="text-[13px]"><span className="font-medium">{fixer.first} {fixer.last}</span><span className="text-muted-fg"> {done ? (fixer.female ? 'всё починила' : 'всё починил') : 'уже идёт к вам'}</span></span>
          {done ? <LuCheck className="ml-auto h-4 w-4 text-ok" /> : <LuWrench className="ml-auto h-4 w-4 text-warn" />}
        </button>
      )}
    </div>
  );
}
