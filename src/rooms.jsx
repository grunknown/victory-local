import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { LuChevronLeft, LuChevronRight, LuUsers, LuVideo, LuTv, LuPresentation, LuX, LuPlus, LuSearch, LuTrash2, LuClock, LuMapPin } from 'react-icons/lu';
import { ROOMS, PEOPLE, ME, TODAY, search, byId } from './data.js';
import { cx, Avatar, Button, fmtDay, weekday, toast } from './ui.jsx';

// Переговорки: «Сейчас» (статус каждой комнаты) → расписание дня (комнаты × время, бронь протягиванием) → мои брони.

const START_H = 9, END_H = 21, SLOT = 30;
const SLOTS = ((END_H - START_H) * 60) / SLOT; // 24 слота по 30 минут
const slotLabel = (i) => { const m = START_H * 60 + i * SLOT; return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`; };
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const DAYS = Array.from({ length: 7 }, (_, i) => addDays(TODAY, i));

// ---------- моковые брони ----------
const TITLES = ['Планёрка отдела', 'Созвон с клиентом', 'Собеседование', '1:1', 'Ретро спринта', 'Демо клиенту', 'Обучение операторов', 'Бриф по ребрендингу', 'Стратсессия', 'Синк по проекту', 'Разбор кейса', 'Звонок с подрядчиком'];
function seeded(seed) { let s = seed; return () => ((s = (s * 1103515245 + 12345) % 2147483648) / 2147483648); }
function seedBookings() {
  const out = []; let id = 1;
  const faces = PEOPLE.filter((p) => p.photo && p !== ME);
  DAYS.forEach((_, day) => {
    ROOMS.forEach((room, ri) => {
      const r = seeded(1000 + day * 97 + ri * 13);
      let t = Math.floor(r() * 3);
      const busy = room.cap <= 4 ? 0.3 : 0.42;
      while (t < SLOTS - 1) {
        if (r() < busy) {
          const len = 2 + Math.floor(r() * 2);
          const end = Math.min(SLOTS, t + len);
          out.push({ id: id++, room: room.id, day, start: t, end, title: TITLES[Math.floor(r() * TITLES.length)], owner: faces[Math.floor(r() * faces.length)].id, people: [] });
          t = end + 1 + Math.floor(r() * 2);
        } else t += 2;
      }
    });
  });
  // мои брони: сегодня позже и завтра
  const nowSlot = currentSlot();
  const mineToday = Math.max(2, Math.min(SLOTS - 3, Math.ceil(nowSlot ?? 6) + 3));
  [['elbrus', 0, mineToday, mineToday + 2, 'Синк по редизайну портала'], ['kazbek', 1, 4, 6, 'Ревью дизайна с продуктом']].forEach(([room, day, s, e, title]) => {
    for (let i = out.length - 1; i >= 0; i--) { const b = out[i]; if (b.room === room && b.day === day && b.start < e && s < b.end) out.splice(i, 1); }
    out.push({ id: id++, room, day, start: s, end: e, title, owner: ME.id, people: [], mine: true });
  });
  return out;
}
function currentSlot() {
  const n = new Date(); const m = n.getHours() * 60 + n.getMinutes() - START_H * 60;
  if (m < 0 || m >= (END_H - START_H) * 60) return null;
  return m / SLOT;
}

const EQ_ICON = (e) => (/ВКС/.test(e) ? LuVideo : /ТВ|Проектор/.test(e) ? LuTv : /Доска/.test(e) ? LuPresentation : null);

export function RoomsPage({ openPerson }) {
  const [bookings, setBookings] = useState(seedBookings);
  const [day, setDay] = useState(0);
  const [cap, setCap] = useState('all');
  const [vks, setVks] = useState(false);
  const [draft, setDraft] = useState(null); // { room, day, start, end }
  const [, tick] = useState(0);
  useEffect(() => { const t = setInterval(() => tick((x) => x + 1), 60000); return () => clearInterval(t); }, []);

  const rooms = ROOMS.filter((r) => (cap === 'all' || (cap === 's' ? r.cap <= 4 : cap === 'm' ? r.cap > 4 && r.cap <= 10 : r.cap > 10)) && (!vks || r.eq.some((e) => /ВКС/.test(e))));
  const dayBookings = bookings.filter((b) => b.day === day);
  const now = currentSlot();
  const mine = bookings.filter((b) => b.mine).sort((a, b) => a.day - b.day || a.start - b.start);

  const save = (b) => {
    setBookings((x) => [...x.filter((y) => y.id !== b.id), { ...b, id: b.id || Date.now(), owner: ME.id, mine: true }]);
    setDraft(null);
    toast(`${ROOMS.find((r) => r.id === b.room).name} забронирована`, `${fmtDay(DAYS[b.day])}, ${slotLabel(b.start)}–${slotLabel(b.end)} · ${b.title}`);
  };
  const cancel = (b) => { setBookings((x) => x.filter((y) => y.id !== b.id)); toast('Бронь отменена', `${ROOMS.find((r) => r.id === b.room).name}, ${slotLabel(b.start)}–${slotLabel(b.end)}`); };

  return (
    <div className="mx-auto max-w-[1280px]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-[13px] text-muted-fg">Восточная, 7Г · {ROOMS.length} переговорок</div>
          <h1 className="display mt-1.5 text-[clamp(26px,3.4vw,36px)]">Переговорки</h1>
        </div>
        <Button onClick={() => setDraft({ room: rooms[0]?.id || ROOMS[0].id, day, start: Math.ceil(now ?? 2), end: Math.ceil(now ?? 2) + 2, title: '' })}><LuPlus className="h-4 w-4" />Забронировать</Button>
      </div>

      {/* Сейчас */}
      {day === 0 && <NowStrip rooms={ROOMS} bookings={bookings.filter((b) => b.day === 0)} now={now} onBook={(room, s) => setDraft({ room, day: 0, start: s, end: s + 1, title: '' })} />}

      {/* Панель: дни + фильтры */}
      <div className="mt-10 flex flex-wrap items-center gap-2">
        <h2 className="mr-3 text-[17px] font-semibold tracking-[-0.01em]">Расписание</h2>
        <div className="flex items-center gap-1">
          <button onClick={() => setDay(Math.max(0, day - 1))} disabled={day === 0} className="grid h-8 w-8 place-items-center rounded-lg text-muted-fg hover:bg-row-hover hover:text-fg disabled:opacity-30" aria-label="Предыдущий день"><LuChevronLeft /></button>
          {DAYS.map((d, i) => (
            <button key={i} onClick={() => setDay(i)} className={cx('h-8 rounded-lg px-2.5 text-[13px] transition-colors', day === i ? 'bg-row-active text-fg' : 'text-muted-fg hover:bg-row-hover hover:text-fg')}>
              {i === 0 ? 'Сегодня' : i === 1 ? 'Завтра' : `${['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'][d.getDay()]}, ${d.getDate()}`}
            </button>
          ))}
          <button onClick={() => setDay(Math.min(6, day + 1))} disabled={day === 6} className="grid h-8 w-8 place-items-center rounded-lg text-muted-fg hover:bg-row-hover hover:text-fg disabled:opacity-30" aria-label="Следующий день"><LuChevronRight /></button>
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-1">
          {[['all', 'Любые'], ['s', 'до 4'], ['m', '5–10'], ['l', 'от 10']].map(([k, l]) => (
            <button key={k} onClick={() => setCap(k)} className={cx('flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[13px] transition-colors', cap === k ? 'bg-row-active text-fg' : 'text-muted-fg hover:bg-row-hover hover:text-fg')}>
              {k === 'all' && <LuUsers className="h-3.5 w-3.5" />}{l}
            </button>
          ))}
          <button onClick={() => setVks(!vks)} className={cx('flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[13px] transition-colors', vks ? 'bg-accent-soft text-accent' : 'text-muted-fg hover:bg-row-hover hover:text-fg')}><LuVideo className="h-3.5 w-3.5" />ВКС</button>
        </div>
      </div>

      <Timeline rooms={rooms} bookings={dayBookings} now={day === 0 ? now : null}
        onSelect={(room, start, end) => setDraft({ room, day, start, end, title: '' })}
        onOpen={(b) => (b.mine ? setDraft(b) : openPerson(b.owner))} />
      <p className="mt-3 text-[12.5px] text-muted-fg">Протяните по свободным ячейкам, чтобы выбрать время. Клик по чужой брони откроет карточку организатора.</p>

      {/* Мои брони */}
      <h2 className="mt-12 text-[17px] font-semibold tracking-[-0.01em]">Мои брони</h2>
      <div className="mt-3 flex flex-col">
        {mine.length === 0 && <p className="text-[14px] text-muted-fg">Броней пока нет.</p>}
        {mine.map((b) => {
          const room = ROOMS.find((r) => r.id === b.room);
          return (
            <div key={b.id} className="group/m -mx-2 flex items-center gap-4 rounded-lg px-2 py-2.5 transition-colors hover:bg-row-hover">
              <span className="w-[120px] shrink-0 text-[13px] text-muted-fg">{b.day === 0 ? 'Сегодня' : b.day === 1 ? 'Завтра' : fmtDay(DAYS[b.day])}</span>
              <span className="w-[110px] shrink-0 text-[13.5px] font-medium tnum">{slotLabel(b.start)}–{slotLabel(b.end)}</span>
              <span className="min-w-0 flex-1 truncate text-[13.5px]">{b.title}</span>
              <span className="hidden shrink-0 text-[13px] text-muted-fg sm:block">{room.name} · {room.floor} этаж</span>
              <button onClick={() => setDraft(b)} className="rounded-md px-2 py-1 text-[12.5px] text-muted-fg hover:bg-row-active hover:text-fg">Изменить</button>
              <button onClick={() => cancel(b)} className="grid h-7 w-7 place-items-center rounded-md text-muted-fg hover:bg-danger-soft hover:text-danger" aria-label="Отменить бронь"><LuTrash2 className="h-3.5 w-3.5" /></button>
            </div>
          );
        })}
      </div>

      {draft && <BookingModal draft={draft} bookings={bookings} onClose={() => setDraft(null)} onSave={save} onCancel={(b) => { cancel(b); setDraft(null); }} />}
    </div>
  );
}

// ---------- Сейчас: статус каждой комнаты ----------
function NowStrip({ rooms, bookings, now, onBook }) {
  const at = now ?? -1;
  return (
    <section className="mt-8">
      <h2 className="text-[17px] font-semibold tracking-[-0.01em]">Сейчас</h2>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {rooms.map((r) => {
          const list = bookings.filter((b) => b.room === r.id).sort((a, b) => a.start - b.start);
          const cur = list.find((b) => b.start <= at && at < b.end);
          const next = list.find((b) => b.start > at);
          const free = !cur && now !== null;
          const startSlot = Math.ceil(at);
          const canGrab = free && (!next || next.start - startSlot >= 1) && startSlot < SLOTS;
          return (
            <div key={r.id} className="flex flex-col rounded-2xl border border-border-strong bg-card p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate text-[15px] font-semibold">{r.name}</div>
                  <div className="mt-0.5 text-[12.5px] text-muted-fg">{r.floor} этаж · до {r.cap} чел.</div>
                </div>
                <span className={cx('mt-1 h-2.5 w-2.5 shrink-0 rounded-full', now === null ? 'bg-faint' : free ? 'bg-ok shadow-[0_0_0_4px_var(--ok-soft)]' : 'bg-danger shadow-[0_0_0_4px_var(--danger-soft)]')} />
              </div>
              <div className="mt-3 h-[38px] text-[13px] leading-snug">
                {now === null ? <span className="text-muted-fg">Офис закрыт, бронь на завтра — в расписании</span>
                  : cur ? <><span className="text-danger">Занята до {slotLabel(cur.end)}</span><span className="block truncate text-muted-fg">{cur.title}</span></>
                  : <><span className="text-ok">Свободна{next ? ` до ${slotLabel(next.start)}` : ' до конца дня'}</span><span className="block truncate text-muted-fg">{r.eq.join(' · ')}</span></>}
              </div>
              <button disabled={!canGrab} onClick={() => onBook(r.id, startSlot)} className="mt-3 h-8 rounded-lg bg-muted text-[13px] font-medium text-fg/85 transition-colors hover:bg-row-active hover:text-fg disabled:cursor-default disabled:opacity-40 disabled:hover:bg-muted">
                {canGrab ? `Занять с ${slotLabel(startSlot)}` : cur ? 'Сейчас занята' : 'Нет свободного окна'}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ---------- Расписание: комнаты × время ----------
const CELL = 48, LABEL = 190, ROW = 58;
function Timeline({ rooms, bookings, now, onSelect, onOpen }) {
  const [sel, setSel] = useState(null); // { room, a, b }
  const dragging = useRef(false);
  const busy = (room, i) => bookings.some((b) => b.room === room && b.start <= i && i < b.end);
  const range = (room, a, b) => { const [s, e] = a <= b ? [a, b] : [b, a]; for (let i = s; i <= e; i++) if (busy(room, i)) return null; return [s, e + 1]; };
  useEffect(() => {
    const up = () => {
      if (!dragging.current) return;
      dragging.current = false;
      setSel((s) => { if (s) { const r = range(s.room, s.a, s.b); if (r) onSelect(s.room, r[0], r[1]); } return null; });
    };
    addEventListener('pointerup', up);
    return () => removeEventListener('pointerup', up);
  });
  const selRange = sel && range(sel.room, sel.a, sel.b);
  return (
    <div className="mt-4 overflow-x-auto rounded-2xl border border-border-strong bg-card">
      <div className="relative select-none" style={{ width: LABEL + SLOTS * CELL, touchAction: 'pan-x' }}>
        {/* шкала часов */}
        <div className="sticky top-0 z-10 flex h-9 border-b border-border bg-card" style={{ paddingLeft: LABEL }}>
          {Array.from({ length: SLOTS }, (_, i) => (
            <div key={i} className="relative shrink-0 text-[11.5px] text-muted-fg tnum" style={{ width: CELL }}>
              {i % 2 === 0 && <span className="absolute top-2.5 -left-[16px] w-8 text-center">{slotLabel(i)}</span>}
            </div>
          ))}
        </div>
        {rooms.map((r) => (
          <div key={r.id} className="relative flex border-b border-border last:border-b-0" style={{ height: ROW }}
            onPointerMove={(e) => {
              if (!dragging.current || !sel || sel.room !== r.id) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const i = Math.max(0, Math.min(SLOTS - 1, Math.floor((e.clientX - rect.left - LABEL) / CELL)));
              if (i !== sel.b) setSel({ ...sel, b: i });
            }}>
            <div className="sticky left-0 z-[5] flex shrink-0 flex-col justify-center border-r border-border bg-card px-4" style={{ width: LABEL }}>
              <span className="truncate text-[13.5px] font-medium">{r.name}</span>
              <span className="mt-0.5 flex items-center gap-1.5 text-[11.5px] text-muted-fg">
                <LuUsers className="h-3 w-3" />{r.cap}<span className="text-faint">·</span>{r.floor} эт.
                {r.eq.map((e) => { const I = EQ_ICON(e); return I ? <I key={e} className="h-3 w-3" title={e} /> : null; })}
              </span>
            </div>
            {Array.from({ length: SLOTS }, (_, i) => {
              const isBusy = busy(r.id, i);
              const past = now !== null && i + 1 <= now;
              const inSel = sel && sel.room === r.id && selRange && i >= selRange[0] && i < selRange[1];
              return (
                <div key={i}
                  onPointerDown={(e) => { if (isBusy || past) return; e.preventDefault(); e.currentTarget.releasePointerCapture?.(e.pointerId); dragging.current = true; setSel({ room: r.id, a: i, b: i }); }}
                  className={cx('shrink-0 border-l', i % 2 === 0 ? 'border-border' : 'border-border/40', !isBusy && !past && 'cursor-crosshair hover:bg-accent-soft', past && 'bg-[repeating-linear-gradient(135deg,transparent_0_6px,var(--row-hover)_6px_7px)]', inSel && 'bg-accent-soft')}
                  style={{ width: CELL }} />
              );
            })}
            {/* брони */}
            {bookings.filter((b) => b.room === r.id).map((b) => {
              const owner = byId(b.owner);
              return (
                <button key={b.id} onClick={() => onOpen(b)} title={`${b.title} · ${slotLabel(b.start)}–${slotLabel(b.end)} · ${owner.name}`}
                  className={cx('absolute top-1.5 bottom-1.5 flex min-w-0 items-center gap-2 overflow-hidden rounded-lg px-2 text-left transition-[filter,transform] hover:brightness-125', sel && 'pointer-events-none',
                    b.mine ? 'bg-accent text-accent-fg' : 'bg-muted text-fg')}
                  style={{ left: LABEL + b.start * CELL + 2, width: (b.end - b.start) * CELL - 4 }}>
                  {(b.end - b.start) * CELL > 70 && <Avatar p={owner} size={22} />}
                  <span className="min-w-0 leading-tight">
                    <span className="block truncate text-[12px] font-medium">{b.title}</span>
                    {(b.end - b.start) >= 2 && <span className={cx('block truncate text-[11px] tnum', b.mine ? 'text-accent-fg/75' : 'text-muted-fg')}>{slotLabel(b.start)}–{slotLabel(b.end)}</span>}
                  </span>
                </button>
              );
            })}
            {selRange && sel.room === r.id && (
              <div className="pointer-events-none absolute top-1.5 bottom-1.5 grid place-items-center rounded-lg border border-dashed border-accent text-[12px] font-medium text-accent tnum"
                style={{ left: LABEL + selRange[0] * CELL + 2, width: (selRange[1] - selRange[0]) * CELL - 4 }}>
                {slotLabel(selRange[0])}–{slotLabel(selRange[1])}
              </div>
            )}
          </div>
        ))}
        {/* линия «сейчас» */}
        {now !== null && (
          <div className="pointer-events-none absolute top-9 bottom-0 z-[6] w-px bg-danger" style={{ left: LABEL + now * CELL }}>
            <span className="absolute -top-1 -left-[3px] h-[7px] w-[7px] rounded-full bg-danger" />
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- Окно брони ----------
function BookingModal({ draft, bookings, onClose, onSave, onCancel }) {
  const [b, setB] = useState({ people: [], ...draft, title: draft.title || '' });
  const ref = useRef();
  useEffect(() => { setTimeout(() => ref.current?.focus(), 30); const h = (e) => e.key === 'Escape' && onClose(); addEventListener('keydown', h); return () => removeEventListener('keydown', h); }, []);
  const room = ROOMS.find((r) => r.id === b.room);
  const conflict = bookings.find((x) => x.id !== b.id && x.room === b.room && x.day === b.day && x.start < b.end && b.start < x.end);
  const set = (k, v) => setB((x) => ({ ...x, [k]: v }));
  const field = 'h-9 w-full rounded-lg bg-muted px-3 text-[13.5px] text-fg outline-none no-ring focus:ring-1 focus:ring-border-hover';
  return createPortal(
    <div className="fixed inset-0 z-[70] grid place-items-center bg-black/60 px-4 backdrop-blur-sm fade" onClick={onClose}>
      <form onSubmit={(e) => { e.preventDefault(); if (!conflict && b.end > b.start) onSave({ ...b, title: b.title.trim() || 'Встреча' }); }}
        className="pop w-full max-w-[480px] rounded-2xl border border-border-strong bg-card p-5 shadow-2xl shadow-black/60" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="text-[17px] font-semibold">{draft.id ? 'Изменить бронь' : 'Новая бронь'}</h3>
          <button type="button" onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-muted-fg hover:bg-muted" aria-label="Закрыть"><LuX /></button>
        </div>
        <label className="mt-4 block text-[12px] text-muted-fg" htmlFor="bk-title">Тема</label>
        <input id="bk-title" ref={ref} value={b.title} onChange={(e) => set('title', e.target.value)} placeholder="Например, синк по проекту" className={cx(field, 'mt-1')} />
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[12px] text-muted-fg" htmlFor="bk-room">Переговорка</label>
            <select id="bk-room" value={b.room} onChange={(e) => set('room', e.target.value)} className={cx(field, 'mt-1')}>
              {ROOMS.map((r) => <option key={r.id} value={r.id}>{r.name} · до {r.cap} чел.</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[12px] text-muted-fg" htmlFor="bk-day">День</label>
            <select id="bk-day" value={b.day} onChange={(e) => set('day', +e.target.value)} className={cx(field, 'mt-1')}>
              {DAYS.map((d, i) => <option key={i} value={i}>{i === 0 ? 'Сегодня' : i === 1 ? 'Завтра' : fmtDay(d)}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[12px] text-muted-fg" htmlFor="bk-start">Начало</label>
            <select id="bk-start" value={b.start} onChange={(e) => { const s = +e.target.value; setB((x) => ({ ...x, start: s, end: Math.max(x.end, s + 1) })); }} className={cx(field, 'mt-1 tnum')}>
              {Array.from({ length: SLOTS }, (_, i) => <option key={i} value={i}>{slotLabel(i)}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[12px] text-muted-fg" htmlFor="bk-end">Конец</label>
            <select id="bk-end" value={b.end} onChange={(e) => set('end', +e.target.value)} className={cx(field, 'mt-1 tnum')}>
              {Array.from({ length: SLOTS }, (_, i) => i + 1).filter((i) => i > b.start).map((i) => <option key={i} value={i}>{slotLabel(i)}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-[12.5px]">
          <LuMapPin className="h-3.5 w-3.5 text-muted-fg" />
          <span className="text-muted-fg">{room.name}, {room.floor} этаж · {room.eq.join(', ')}</span>
        </div>
        {conflict && <p className="mt-2 text-[12.5px] text-danger">Это время уже занято: {conflict.title}, {slotLabel(conflict.start)}–{slotLabel(conflict.end)}. Выберите другое время или комнату.</p>}
        <div className="mt-5 flex items-center gap-2">
          {draft.id && <Button type="button" variant="ghost" onClick={() => onCancel(draft)} className="text-danger"><LuTrash2 className="h-4 w-4" />Отменить бронь</Button>}
          <span className="flex-1" />
          <Button type="button" variant="ghost" onClick={onClose}>Закрыть</Button>
          <Button type="submit" disabled={!!conflict}><LuClock className="h-4 w-4" />{draft.id ? 'Сохранить' : `Забронировать ${slotLabel(b.start)}–${slotLabel(b.end)}`}</Button>
        </div>
      </form>
    </div>,
    document.body,
  );
}
