import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  LuArrowRight, LuMessageCircle, LuClock, LuChevronLeft, LuPartyPopper, LuCheck, LuHammer, LuSend, LuX,
  LuFilm, LuMapPin, LuTrophy, LuUsers, LuSparkles, LuImage,
} from 'react-icons/lu';
import { NEWS, NEWBIES, ME, TODAY, DEPTS, birthdaysAhead, EVENTS } from './data.js';
import { cx, Avatar, Card, CardHead, Button, fmtDay, fmtShort, relDay, weekday, daysBetween, plural, burstConfetti, toast, Coin } from './ui.jsx';

const greeting = () => {
  const h = new Date().getHours();
  if (h < 5) return 'Доброй ночи';
  if (h < 12) return 'Доброе утро';
  if (h < 17) return 'Добрый день';
  return 'Добрый вечер';
};

// Плейсхолдер для новостей без фото: фирменные «пластины» в светлом контуре
const PLATES = {
  hero: [['34%', '-38%'], ['50%', '-26%'], ['66%', '-14%'], ['82%', '-2%']],
  office: [['8%', '-40%'], ['26%', '-30%'], ['44%', '-20%'], ['62%', '-10%']],
  award: [['40%', '-60%'], ['58%', '-30%']],
  mentor: [['-10%', '20%'], ['10%', '30%'], ['30%', '40%']],
  party: [['50%', '-80%'], ['30%', '40%'], ['70%', '10%']],
  chart: [['20%', '10%'], ['45%', '-20%']],
};
export function Plates({ kind = 'office' }) {
  return (
    <div className="plates">
      {(PLATES[kind] || PLATES.office).map(([l, t], i) => <i key={i} style={{ left: l, top: t, opacity: 0.55 + i * 0.12, '--dx': `${8 + i * 6}px`, '--dy': `${-4 - i * 4}px` }} />)}
    </div>
  );
}

// Медиа поста: одно фото или альбом из Telegram (до 4 видимых, остальное «+N»)
function Media({ images, kind, className, tall }) {
  if (!images?.length) {
    return <div className={cx('relative overflow-hidden cover-bg', className)}><Plates kind={kind} /></div>;
  }
  const shown = images.slice(0, images.length > 4 ? 4 : images.length);
  const more = images.length - shown.length;
  const grid = shown.length === 1 ? 'grid-cols-1' : shown.length === 2 ? 'grid-cols-2' : shown.length === 3 ? 'grid-cols-3' : 'grid-cols-4';
  return (
    <div className={cx('media relative grid gap-[2px] overflow-hidden bg-black', grid, className)}>
      {shown.map((src, i) => (
        <div key={src} className="relative overflow-hidden">
          <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
          {more > 0 && i === shown.length - 1 && <span className="absolute inset-0 grid place-items-center bg-black/55 text-[18px] font-semibold text-white">+{more}</span>}
        </div>
      ))}
    </div>
  );
}

function TgBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] text-muted-fg">
      <LuSend className="h-3 w-3" /> из Telegram
    </span>
  );
}

const Reactions = ({ r }) => (
  <span className="flex items-center gap-1.5">
    {Object.entries(r).slice(0, 2).map(([e, n]) => (
      <span key={e} className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[12px] tnum">{e} {n}</span>
    ))}
  </span>
);

export function Home({ go, openPerson }) {
  const [featured, ...rest] = NEWS;
  return (
    <div className="mx-auto flex max-w-[1320px] flex-col gap-6">
      <div className="rise">
        <div className="text-[13px] text-muted-fg first-letter:uppercase">{weekday(TODAY)}, {fmtDay(TODAY)}</div>
        <h1 className="display mt-1.5 text-[clamp(26px,3.4vw,38px)]">{greeting()}, {ME.first}</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="flex min-w-0 flex-col gap-4 xl:col-span-8">
          <button onClick={() => go(`news-${featured.id}`)} className="group rise relative overflow-hidden rounded-2xl border border-border text-left transition-all duration-300 hover:-translate-y-1 hover:border-border-hover hover:shadow-[0_24px_60px_-28px_rgba(0,0,0,0.9),0_0_0_1px_rgba(110,121,214,0.2)]" style={{ '--i': 1 }}>
            <div className="absolute inset-0"><Media images={featured.images} kind="hero" className="h-full" /></div>
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/55 to-transparent" />
            <div className="relative flex min-h-[360px] flex-col justify-end p-6 sm:p-8">
              <span className="w-fit rounded-full border border-border-strong bg-bg/60 px-2.5 py-1 text-[11px] font-medium backdrop-blur">{featured.rubric}</span>
              <h2 className="display mt-4 max-w-[640px] text-[clamp(22px,2.6vw,32px)]">{featured.title}</h2>
              <p className="mt-3 max-w-[600px] text-[15px] text-fg/70">{featured.lead}</p>
              <div className="mt-5 flex flex-wrap items-center gap-4 text-[13px] text-muted-fg">
                <span>{relDay(featured.date)} · {featured.mins} мин чтения</span>
                <Reactions r={featured.reactions} />
                <span className="ml-auto inline-flex items-center gap-1.5 text-fg transition-transform group-hover:translate-x-1">Читать <LuArrowRight /></span>
              </div>
            </div>
          </button>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {rest.slice(0, 4).map((n, i) => <NewsCard key={n.id} n={n} i={i + 2} go={go} />)}
          </div>
          <button onClick={() => go('blog')} className="group flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-card text-[14px] font-medium transition-all hover:border-border-hover hover:bg-muted">
            Показать ещё <span className="text-muted-fg tnum">{NEWS.length - 5}</span>
            <LuArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
          <Newbies openPerson={openPerson} />
        </div>

        <div className="flex min-w-0 flex-col gap-6 xl:col-span-4">
          <Birthdays openPerson={openPerson} />
          <Events />
        </div>
      </div>
    </div>
  );
}

// ---------------- Дни рождения ----------------
function Birthdays({ openPerson }) {
  const all = useMemo(() => birthdaysAhead(7), []);
  const today = all.filter((b) => b.inDays === 0);
  const soon = all.filter((b) => b.inDays > 0);
  return (
    <Card className="rise" style={{ '--i': 2 }}>
      <CardHead title="Дни рождения" action={<span className="rounded-full bg-accent-soft px-2.5 py-1 text-[12px] font-medium text-accent">Сегодня, {fmtDay(TODAY)}</span>} />
      <div className="flex flex-col gap-1 px-3">
        {today.map(({ p }) => (
          <button key={p.id} onClick={() => openPerson(p.id)} className="flex items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-muted">
            <Avatar p={p} size={44} ring />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[14px] font-medium">{p.name}</span>
              <span className="block truncate text-[12px] text-muted-fg">{p.role}</span>
            </span>
            <span className="text-[18px]" aria-hidden="true">🎂</span>
          </button>
        ))}
      </div>
      <div className="mt-3 border-t border-border px-5 pt-4 text-[14px] font-semibold text-fg">На этой неделе</div>
      <ul className="px-3 pb-3">
        {soon.slice(0, 5).map(({ p, date, inDays }) => (
          <li key={p.id}>
            <button onClick={() => openPerson(p.id)} className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-muted">
              <Avatar p={p} size={30} />
              <span className="min-w-0 flex-1"><span className="block truncate text-[13px]">{p.name}</span><span className="block truncate text-[11px] text-muted-fg">{DEPTS[p.dept].name}</span></span>
              <span className="text-right text-[12px] text-muted-fg tnum">{inDays === 1 ? 'завтра' : fmtShort(date)}</span>
            </button>
          </li>
        ))}
      </ul>
    </Card>
  );
}

// ---------------- События ----------------
function Events() {
  const [next, ...rest] = EVENTS;
  const d = daysBetween(TODAY, next.date);
  return (
    <Card className="rise" style={{ '--i': 3 }}>
      <CardHead title="Ближайшие события" />
      <div className="group relative mx-5 overflow-hidden rounded-xl border border-border cover-bg p-4">
        <div className="pointer-events-none absolute -top-16 -right-20 h-40 w-64 opacity-80"><Plates kind="award" /></div>
        <div className="relative">
          <div className="flex items-baseline gap-2"><span className="text-[40px] leading-none font-semibold tnum">{d}</span><span className="text-[13px] text-muted-fg">{plural(d, 'день', 'дня', 'дней')} до</span></div>
          <div className="mt-2 text-[16px] font-semibold">{next.title}</div>
          <div className="mt-0.5 text-[12px] text-muted-fg">{fmtDay(next.date)}, {next.time} · {next.place}</div>
          <div className="mt-2 text-[13px] text-fg/80">{next.desc}</div>
        </div>
      </div>
      <ul className="px-5 py-3">
        {rest.map((e) => (
          <li key={e.title} className="-mx-2 flex cursor-default items-center gap-3 rounded-xl border-t border-border px-2 py-3 transition-colors first:border-0 hover:border-transparent hover:bg-muted">
            <span className="w-11 shrink-0 rounded-lg border border-border bg-card-2 py-1 text-center leading-none">
              <span className="block text-[17px] font-semibold tnum">{e.date.getDate()}</span>
              <span className="text-[10px] text-muted-fg uppercase">{fmtShort(e.date).split(' ')[1]}</span>
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[14px] font-medium">{e.title}</span>
              <span className="block truncate text-[12px] text-muted-fg">{e.time} · {e.place}</span>
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

// ---------------- Новички ----------------
function Newbies({ openPerson }) {
  return (
    <Card className="rise" style={{ '--i': 7 }}>
      <CardHead title="Новые коллеги" action={<span className="text-[12px] text-muted-fg">за две недели</span>} />
      <div className="grid grid-cols-1 gap-2 px-3 pb-3 sm:grid-cols-2 xl:grid-cols-3">
        {NEWBIES.map((p) => {
          const d = daysBetween(p.hired, TODAY);
          return (
            <button key={p.id} onClick={() => openPerson(p.id)} className="group/nb flex items-center gap-3 rounded-xl p-2.5 text-left transition-colors hover:bg-muted">
              <Avatar p={p} size={52} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-medium">{p.name}</span>
                <span className="block truncate text-[12px] text-muted-fg">{p.role}</span>
                <span className="mt-1 block text-[11px] text-faint">с нами {d} {plural(d, 'день', 'дня', 'дней')}</span>
              </span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

// ---------------- Блог ----------------
export function Blog({ go }) {
  const rubrics = ['Все', ...Array.from(new Set(NEWS.map((n) => n.rubric)))];
  const [r, setR] = useState('Все');
  const list = NEWS.filter((n) => r === 'Все' || n.rubric === r);
  return (
    <div className="mx-auto max-w-[1320px]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-[13px] text-muted-fg">Новости и жизнь компании</div>
          <h1 className="display mt-1.5 text-[clamp(26px,3.4vw,38px)]">Блог</h1>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {rubrics.map((x) => (
            <button key={x} onClick={() => setR(x)} className={cx('h-8 rounded-full border px-3 text-[13px] transition-colors', r === x ? 'border-border-strong bg-muted text-fg' : 'border-border text-muted-fg hover:text-fg')}>{x}</button>
          ))}
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((n, i) => <NewsCard key={n.id} n={n} i={i} go={go} />)}
      </div>
    </div>
  );
}

function NewsCard({ n, i, go }) {
  return (
    <button onClick={() => go(`news-${n.id}`)} style={{ '--i': i }}
      className="group rise flex flex-col overflow-hidden rounded-2xl border border-border bg-card text-left transition-all duration-300 hover:-translate-y-1 hover:border-border-hover hover:bg-card-2 hover:shadow-[0_22px_50px_-24px_rgba(0,0,0,0.85),0_0_0_1px_rgba(110,121,214,0.18)]">
      <Media images={n.images} kind={n.cover} className="aspect-[16/10]" />
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2 text-[11px]">
          <span className="font-medium text-accent">{n.rubric}</span>
          
        </div>
        <h3 className="mt-1.5 text-[15px] leading-snug font-semibold text-balance">{n.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-[13px] text-muted-fg">{n.lead}</p>
        <div className="mt-auto flex items-center gap-3 pt-4 text-[12px] text-muted-fg">
          <span>{relDay(n.date)}</span>
                    <span className="ml-auto"><Reactions r={n.reactions} /></span>
        </div>
      </div>
    </button>
  );
}

// ---------------- Новость ----------------
export function NewsPage({ id, go }) {
  const n = NEWS.find((x) => x.id === id) || NEWS[0];
  const [mine, setMine] = useState(null);
  const others = NEWS.filter((x) => x.id !== n.id).slice(0, 3);
  return (
    <article className="mx-auto max-w-[860px]">
      <button onClick={() => go('blog')} className="mb-4 inline-flex items-center gap-1 text-[13px] text-muted-fg hover:text-fg"><LuChevronLeft /> В блог</button>
      <div className="flex items-center gap-2 text-[12px]"><span className="font-medium text-accent">{n.rubric}</span></div>
      <h1 className="display mt-3 text-[clamp(26px,3.6vw,40px)]">{n.title}</h1>
      <div className="mt-3 flex flex-wrap gap-4 text-[13px] text-muted-fg"><span>{fmtDay(n.date)}</span><span className="inline-flex items-center gap-1"><LuClock className="h-3.5 w-3.5" />{n.mins} мин чтения</span><span>Команда HR</span></div>
      {n.images?.length
        ? <div className={cx('mt-6 grid gap-1 overflow-hidden rounded-2xl', n.images.length === 1 ? 'grid-cols-1' : 'grid-cols-3')}>
            {n.images.map((src) => <img key={src} src={src} alt="" className="aspect-square w-full object-cover" />)}
          </div>
        : <div className="group relative mt-6 h-[260px] overflow-hidden rounded-2xl border border-border cover-bg"><Plates kind={n.cover} /></div>}
      <div className="mx-auto mt-8 max-w-[680px]">
        <p className="text-[18px] leading-relaxed">{n.lead}</p>
        {n.body.map(([t, text], i) =>
          t === 'h' ? <h2 key={i} className="display mt-8 text-[22px]">{text}</h2>
          : t === 'q' ? <blockquote key={i} className="my-6 border-l-2 border-accent pl-5 text-[17px] text-fg/85">{text}</blockquote>
          : <p key={i} className="mt-4 text-[16px] leading-[1.7] text-fg/85">{text}</p>)}
        <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-border pt-6">
          {Object.entries(n.reactions).concat([['👍', 0]]).slice(0, 4).map(([e, c]) => (
            <button key={e} onClick={() => setMine(mine === e ? null : e)} className={cx('inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-[14px] tnum transition-colors', mine === e ? 'border-accent bg-accent-soft' : 'border-border hover:bg-muted')}>
              {e} {c + (mine === e ? 1 : 0)}
            </button>
          ))}
        </div>
        <h2 className="mt-12 mb-4 text-[17px] font-semibold tracking-[-0.01em]">Другие новости</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {others.map((o) => (
            <button key={o.id} onClick={() => go(`news-${o.id}`)} className="group overflow-hidden rounded-2xl border border-border bg-card text-left hover:border-border-strong">
              <Media images={o.images} kind={o.cover} className="aspect-[16/10]" />
              <div className="p-4">
                <span className="text-[11px] font-medium text-accent">{o.rubric}</span>
                <span className="mt-1 block text-[14px] leading-snug font-medium">{o.title}</span>
                <span className="mt-2 block text-[12px] text-muted-fg">{relDay(o.date)}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </article>
  );
}

// ---------------- Заглушки следующих итераций ----------------
const STUBS = {
  people: { title: 'Сотрудники', next: ['Дерево дирекций и отделов', 'Страница отдела: руководитель, команда, подотделы', 'Фильтр «В отпуске / На месте»', 'Сохранить контакт: vCard и QR'] },
  rooms: { title: 'Переговорки', next: ['Карточки комнат со статусом «Свободна сейчас»', 'Сетка «комнаты × часы»', 'Бронь протягиванием по слотам', 'Мои брони и «Найти свободную»'] },
  it: { title: 'Заявка в IT', next: ['Частые проблемы с инструкциями', 'Шаблоны заявок по категориям', 'Кнопка и QR-код IT-бота'] },
  forms: { title: 'Бланки документов', next: ['Карточки бланков по категориям', 'Онлайн-заполнение заявления на отпуск', 'Скачивание готового PDF'] },
  kb: { title: 'База знаний', next: ['Разделы плитками', 'Статья с оглавлением', 'Онбординг-чек-лист первой недели'] },
  store: { title: 'Магазин мерча', next: ['Каталог за Victory Coin', 'Карточка товара: размер и цвет', 'Покупка и «Мои заказы»'] },
};
export function Stub({ route }) {
  const key = route.startsWith('people') ? 'people' : route;
  const s = STUBS[key] || STUBS.people;
  const dept = route.startsWith('people-') ? DEPTS[route.slice(7)] : null;
  return (
    <div className="mx-auto max-w-[1320px]">
      <div className="text-[13px] text-muted-fg">{dept ? 'Сотрудники' : 'Раздел'}</div>
      <h1 className="display mt-1.5 text-[clamp(26px,3.4vw,38px)]">{dept ? dept.name : s.title}</h1>
      <Card className="group relative mt-6 overflow-hidden p-8">
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 opacity-70"><Plates kind="award" /></div>
        <div className="relative max-w-[520px]">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1 text-[12px] text-accent"><LuHammer className="h-3.5 w-3.5" /> Следующая итерация прототипа</span>
          <h2 className="mt-4 text-[20px] font-semibold">Что здесь появится</h2>
          <ul className="mt-3 flex flex-col gap-2">
            {s.next.map((x) => <li key={x} className="flex gap-2 text-[14px] text-fg/85"><LuCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />{x}</li>)}
          </ul>
          <p className="mt-5 text-[13px] text-muted-fg">Карточки сотрудников уже работают: откройте поиск по Ctrl+K или нажмите на любого человека на главной.</p>
        </div>
      </Card>
    </div>
  );
}
