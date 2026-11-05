import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { LuChevronLeft, LuChevronRight, LuX, LuPlay, LuPause, LuEye, LuArrowRight } from 'react-icons/lu';
import { STORIES, VIDEOS } from './data.js';
import { cx, plural } from './ui.jsx';

const SLIDE_MS = 5000;
const seen = new Set(); // просмотренные группы сторис — на время сессии

// ---------------- Сторис: лента кружков ----------------
export function StoriesRow({ go }) {
  const [open, setOpen] = useState(null);
  const [, rerender] = useState(0);
  return (
    <>
      <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none] lg:mx-0 lg:px-0">
        {STORIES.map((g, i) => (
          <button key={g.id} onClick={() => setOpen(i)} className="group flex w-[76px] shrink-0 flex-col items-center gap-2">
            <span className={cx('story-ring rounded-full p-[2.5px] transition-transform duration-300 group-hover:scale-105', seen.has(g.id) && 'seen')}>
              <span className="block rounded-full bg-bg p-[3px]">
                <img src={g.cover} alt="" className="h-[62px] w-[62px] rounded-full object-cover" />
              </span>
            </span>
            <span className={cx('w-full truncate text-center text-[12px]', seen.has(g.id) ? 'text-muted-fg' : 'text-fg')}>{g.label}</span>
          </button>
        ))}
      </div>
      {open !== null && <StoryViewer start={open} go={go} onClose={() => { setOpen(null); rerender((x) => x + 1); }} />}
    </>
  );
}

// ---------------- Сторис: просмотр ----------------
function StoryViewer({ start, onClose, go }) {
  const [gi, setGi] = useState(start);
  const [si, setSi] = useState(0);
  const [paused, setPaused] = useState(false);
  const pressAt = useRef(0);
  const g = STORIES[gi];
  const s = g.slides[si];
  useEffect(() => { seen.add(g.id); }, [g.id]);

  const next = () => {
    if (si < g.slides.length - 1) return setSi(si + 1);
    if (gi < STORIES.length - 1) { setGi(gi + 1); setSi(0); return; }
    onClose();
  };
  const prev = () => {
    if (si > 0) return setSi(si - 1);
    if (gi > 0) { setGi(gi - 1); setSi(STORIES[gi - 1].slides.length - 1); }
  };
  const jump = (d) => { const n = gi + d; if (n >= 0 && n < STORIES.length) { setGi(n); setSi(0); } else if (d > 0) onClose(); };

  useEffect(() => {
    const k = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === ' ') { e.preventDefault(); setPaused((p) => !p); }
    };
    addEventListener('keydown', k);
    return () => removeEventListener('keydown', k);
  });

  // Нажали и держим — пауза; короткий тап — листаем (левая треть — назад)
  const down = () => { pressAt.current = Date.now(); setPaused(true); };
  const up = (e) => {
    setPaused(false);
    if (Date.now() - pressAt.current > 250) return;
    const r = e.currentTarget.getBoundingClientRect();
    (e.clientX - r.left < r.width / 3 ? prev : next)();
  };

  return createPortal(
    <div className="fade fixed inset-0 z-[70] flex items-center justify-center bg-black/95" onClick={onClose}>
      <button onClick={(e) => { e.stopPropagation(); jump(-1); }} disabled={gi === 0} aria-label="Предыдущая история"
        className="mr-6 hidden h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 disabled:opacity-0 md:grid"><LuChevronLeft className="h-5 w-5" /></button>

      <div className="relative h-[100dvh] w-full overflow-hidden bg-[#111] sm:h-[min(88vh,860px)] sm:w-auto sm:rounded-3xl" style={{ aspectRatio: '9 / 16' }} onClick={(e) => e.stopPropagation()}>
        {/* фон слайда */}
        <div key={`${gi}-${si}`} className="fade absolute inset-0 select-none" onPointerDown={down} onPointerUp={up} onPointerLeave={() => setPaused(false)}>
          {s.img
            ? <img src={s.img} alt="" draggable={false} className="h-full w-full object-cover" />
            : <div className="relative h-full w-full cover-bg"><div className="plates">{[['20%', '-20%'], ['40%', '0%'], ['60%', '20%']].map(([l, t], i) => <i key={i} style={{ left: l, top: t, opacity: 0.5 + i * 0.15 }} />)}</div></div>}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/85" />
        </div>

        {/* прогресс */}
        <div className="pointer-events-none absolute inset-x-3 top-3 flex gap-1">
          {g.slides.map((_, i) => (
            <span key={i} className="story-bar h-[3px] flex-1 overflow-hidden rounded-full bg-white/30">
              {i < si && <i />}
              {i === si && <i key={`${gi}-${si}`} onAnimationEnd={next} style={{ animation: `storyfill ${SLIDE_MS}ms linear both`, animationPlayState: paused ? 'paused' : 'running' }} />}
            </span>
          ))}
        </div>
        <div className="absolute inset-x-3 top-6 flex items-center gap-2.5">
          <img src={g.cover} alt="" className="h-8 w-8 rounded-full object-cover" />
          <span className="text-[13px] font-semibold text-white">{g.label}</span>
          <span className="text-[12px] text-white/60">сегодня</span>
          <button onClick={() => setPaused((p) => !p)} className="ml-auto grid h-8 w-8 place-items-center rounded-full text-white/80 hover:bg-white/10" aria-label={paused ? 'Продолжить' : 'Пауза'}>
            {paused ? <LuPlay className="h-4 w-4" /> : <LuPause className="h-4 w-4" />}
          </button>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full text-white/80 hover:bg-white/10" aria-label="Закрыть"><LuX className="h-5 w-5" /></button>
        </div>

        {/* текст */}
        <div key={`t-${gi}-${si}`} className="rise pointer-events-none absolute inset-x-0 bottom-0 p-6 pb-8 text-white">
          <div className="display text-[28px] leading-[1.1]">{s.title}</div>
          {s.text && <p className="mt-2.5 text-[15px] leading-snug text-white/80">{s.text}</p>}
          {s.cta && (
            <button onClick={() => { onClose(); go(s.cta.to); }} className="pointer-events-auto mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white text-[14px] font-semibold text-black hover:bg-white/85">
              {s.cta.label}<LuArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <button onClick={(e) => { e.stopPropagation(); jump(1); }} aria-label="Следующая история"
        className="ml-6 hidden h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 md:grid"><LuChevronRight className="h-5 w-5" /></button>
    </div>,
    document.body,
  );
}

// ---------------- Видео: карточки + плеер поверх страницы ----------------
const views = (n) => `${n.toLocaleString('ru')} ${plural(n, 'просмотр', 'просмотра', 'просмотров')}`;

export function VideoCard({ v, onOpen, i = 0 }) {
  return (
    <button onClick={onOpen} style={{ '--i': i }} className="group rise flex min-w-0 flex-col text-left">
      <span className="relative block aspect-[9/14] overflow-hidden rounded-2xl bg-card">
        <img src={v.poster} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <span className="absolute top-1/2 left-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-black shadow-xl transition-transform duration-300 group-hover:scale-110"><LuPlay className="ml-0.5 h-5 w-5" /></span>
        <span className="absolute right-2.5 bottom-2.5 rounded-md bg-black/60 px-1.5 py-0.5 text-[11.5px] font-medium text-white tnum">{v.dur}</span>
      </span>
      <span className="mt-2.5 line-clamp-2 text-[14px] leading-snug font-medium">{v.title}</span>
      {v.views && <span className="mt-1 flex items-center gap-1 text-[12px] text-muted-fg"><LuEye className="h-3.5 w-3.5" />{views(v.views)}</span>}
    </button>
  );
}

export function VideoPlayer({ list, start = 0, onClose }) {
  const [i, setI] = useState(start);
  const v = list[i];
  useEffect(() => {
    const k = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setI((x) => Math.min(list.length - 1, x + 1));
      if (e.key === 'ArrowLeft') setI((x) => Math.max(0, x - 1));
    };
    addEventListener('keydown', k);
    return () => removeEventListener('keydown', k);
  }, []);
  return createPortal(
    <div className="fade fixed inset-0 z-[70] flex items-center justify-center bg-black/95" onClick={onClose}>
      <button onClick={(e) => { e.stopPropagation(); setI(i - 1); }} disabled={i === 0} aria-label="Предыдущее видео"
        className="mr-6 hidden h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 disabled:opacity-0 md:grid"><LuChevronLeft className="h-5 w-5" /></button>
      <div className="relative flex flex-col" onClick={(e) => e.stopPropagation()}>
        <video key={v.src} src={v.src} poster={v.poster} autoPlay controls playsInline loop
          className="h-[100dvh] w-full bg-black object-contain sm:h-[min(80vh,820px)] sm:w-auto sm:rounded-3xl" style={{ aspectRatio: '9 / 16' }} />
        <div className="absolute inset-x-0 top-0 flex items-start gap-3 p-4 sm:static sm:px-1 sm:pt-4">
          <div className="min-w-0 flex-1 text-white">
            <div className="text-[15px] font-semibold">{v.title}</div>
            {v.views && <div className="mt-0.5 text-[12.5px] text-white/60">{v.rubric} · {views(v.views)}</div>}
          </div>
          <button onClick={onClose} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Закрыть"><LuX className="h-5 w-5" /></button>
        </div>
      </div>
      <button onClick={(e) => { e.stopPropagation(); setI(i + 1); }} disabled={i === list.length - 1} aria-label="Следующее видео"
        className="ml-6 hidden h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 disabled:opacity-0 md:grid"><LuChevronRight className="h-5 w-5" /></button>
    </div>,
    document.body,
  );
}

export function VideoRow({ title = 'Видео', action, cols = 'grid-cols-2 sm:grid-cols-4' }) {
  const [open, setOpen] = useState(null);
  return (
    <section>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[17px] font-semibold tracking-[-0.01em]">{title}</h2>
        {action}
      </div>
      <div className={cx('mt-3 grid gap-3', cols)}>
        {VIDEOS.map((v, i) => <VideoCard key={v.id} v={v} i={i} onOpen={() => setOpen(i)} />)}
      </div>
      {open !== null && <VideoPlayer list={VIDEOS} start={open} onClose={() => setOpen(null)} />}
    </section>
  );
}
