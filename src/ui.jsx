import React from 'react';
import { DEPTS, TODAY } from './data.js';

export const cx = (...a) => a.filter(Boolean).join(' ');

const MONTHS = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
const MONTHS_SHORT = ['янв','фев','мар','апр','мая','июн','июл','авг','сен','окт','ноя','дек'];
const WD = ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'];
export const fmtDay = (d) => `${d.getDate()} ${MONTHS[d.getMonth()]}`;
export const fmtShort = (d) => `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
export const fmtDM = (d) => `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}`;
export const weekday = (d) => WD[d.getDay()];
export const daysBetween = (a, b) => Math.round((b - a) / 86400000);
export function plural(n, one, few, many) {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return few;
  return many;
}
export function relDay(d) {
  const n = daysBetween(TODAY, d);
  if (n === 0) return 'сегодня';
  if (n === 1) return 'завтра';
  if (n === -1) return 'вчера';
  if (n < 0) return `${-n} ${plural(-n, 'день', 'дня', 'дней')} назад`;
  return `через ${n} ${plural(n, 'день', 'дня', 'дней')}`;
}
export function tenure(hired) {
  const days = daysBetween(hired, TODAY);
  if (days < 30) return `${days} ${plural(days, 'день', 'дня', 'дней')}`;
  const y = Math.floor(days / 365), m = Math.floor((days % 365) / 30);
  if (y === 0) return `${m} ${plural(m, 'месяц', 'месяца', 'месяцев')}`;
  return `${y} ${plural(y, 'год', 'года', 'лет')}${m ? ` ${m} мес.` : ''}`;
}

// Статус присутствия: работает / в отпуске / на больничном. Фото никогда не обесцвечиваем.
export const presence = (p) => (p.vacation ? 'vacation' : p.sick ? 'sick' : 'work');
const RING = { work: 'var(--ok)', vacation: 'var(--warn)', sick: 'var(--danger)' };
const EMOJI = { vacation: '🌴', sick: '🤒' };

export function Avatar({ p, size = 40, ring = false, status = false, className }) {
  const initials = (p.first[0] + p.last[0]).toUpperCase();
  const st = presence(p);
  const hue = (p.id * 47) % 360;
  const showRing = status || (ring && st !== 'work');
  const ringW = size >= 48 ? 2.5 : 2;
  return (
    <span className={cx('relative inline-block shrink-0 select-none', className)} style={{ width: size, height: size }} aria-hidden="true">
      <span className="absolute inset-0 grid place-items-center overflow-hidden rounded-full font-medium"
        style={{
          fontSize: size * 0.36,
          background: p.photo ? '#000' : `oklch(var(--av-bg) 0.045 ${hue})`, color: `oklch(var(--av-fg) 0.06 ${hue})`,
          boxShadow: showRing ? `0 0 0 ${ringW}px var(--card), 0 0 0 ${ringW * 2}px ${RING[st]}` : ring ? `0 0 0 2px var(--card), 0 0 0 4px var(--accent)` : undefined,
        }}>
        {p.photo ? <img src={p.photo} alt="" className="h-full w-full object-cover" /> : initials}
      </span>
      {EMOJI[st] && size >= 28 && (
        <span className="absolute grid place-items-center rounded-full bg-card leading-none" style={{ right: -size * 0.06, bottom: -size * 0.06, width: size * 0.42, height: size * 0.42, fontSize: size * 0.24, boxShadow: '0 0 0 2px var(--card)' }}>{EMOJI[st]}</span>
      )}
    </span>
  );
}

export function StatusPill({ p, remote = false }) {
  if (p.vacation) return <span className="inline-flex items-center gap-1 rounded-full bg-warn-soft px-2 py-0.5 text-[11px] font-medium whitespace-nowrap text-warn">🌴 В отпуске до {fmtDM(p.vacation.until)}</span>;
  if (p.sick) return <span className="inline-flex items-center gap-1 rounded-full bg-danger-soft px-2 py-0.5 text-[11px] font-medium whitespace-nowrap text-danger">🤒 На больничном до {fmtDM(p.sick.until)}</span>;
  if (remote && p.remote) return <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium whitespace-nowrap text-muted-fg">Удалённо</span>;
  return null;
}
export const VacationPill = StatusPill;

export const deptName = (id) => DEPTS[id]?.name ?? '';
export const deptPath = (id) => {
  const d = DEPTS[id];
  if (!d) return [];
  return d.parent ? [DEPTS[d.parent], d] : [d];
};

export function Button({ variant = 'default', size = 'md', className, children, ...rest }) {
  const v = {
    default: 'bg-accent text-accent-fg hover:brightness-110 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_6px_20px_-10px_var(--glow)]',
    light: 'bg-fg text-bg hover:opacity-90',
    outline: 'border border-border-strong bg-transparent hover:bg-muted text-fg',
    ghost: 'hover:bg-muted text-fg',
    soft: 'bg-accent-soft text-accent hover:bg-accent hover:text-accent-fg',
  }[variant];
  const s = { sm: 'h-8 px-3 text-[13px] gap-1.5', md: 'h-10 px-4 text-sm gap-2', icon: 'h-9 w-9 justify-center' }[size];
  return (
    <button className={cx('inline-flex shrink-0 items-center rounded-xl font-medium transition-all active:scale-[.98] disabled:opacity-50', v, s, className)} {...rest}>
      {children}
    </button>
  );
}

export function Card({ className, children, ...rest }) {
  return <section className={cx('rounded-2xl border border-border bg-card', className)} {...rest}>{children}</section>;
}

export function CardHead({ title, action, icon: Icon }) {
  return (
    <div className="flex items-center justify-between gap-3 px-5 pt-5 pb-3">
      <h2 className="flex items-center gap-2 text-[17px] font-semibold tracking-[-0.01em]">
        {Icon && <Icon className="h-4 w-4 text-accent" />}
        {title}
      </h2>
      {action}
    </div>
  );
}

export function Coin({ size = 16, spin }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={cx('shrink-0', spin && 'coin-spin')} aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="var(--accent)" />
      <circle cx="12" cy="12" r="8.2" fill="none" stroke="var(--accent-fg)" strokeOpacity=".35" strokeWidth="1.2" />
      <path d="M15.6 7.4 11.2 11.6V9.4l4.4-4.2zM7.6 9.2l1.6 1.6h2.4V9.2z" fill="var(--accent-fg)" transform="translate(-0.4 2.4) scale(1.05)" />
    </svg>
  );
}

// Конфетти на canvas — для поздравлений и покупок
export function burstConfetti(x, y) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const c = document.createElement('canvas');
  c.className = 'confetti';
  c.width = innerWidth * devicePixelRatio; c.height = innerHeight * devicePixelRatio;
  c.style.width = '100%'; c.style.height = '100%';
  document.body.appendChild(c);
  const g = c.getContext('2d'); g.scale(devicePixelRatio, devicePixelRatio);
  const colors = ['#6e79d6', '#9aa3ff', '#ffffff', '#c9cdf5', '#4cb782', '#e2a33d'];
  const parts = Array.from({ length: 140 }, () => ({
    x, y, vx: (Math.random() - 0.5) * 12, vy: -Math.random() * 12 - 4, r: Math.random() * 6 + 3,
    c: colors[(Math.random() * colors.length) | 0], a: Math.random() * Math.PI, va: (Math.random() - 0.5) * 0.3,
  }));
  let t = 0;
  (function frame() {
    g.clearRect(0, 0, innerWidth, innerHeight);
    parts.forEach((p) => { p.vy += 0.35; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.a += p.va;
      g.save(); g.translate(p.x, p.y); g.rotate(p.a); g.fillStyle = p.c; g.globalAlpha = Math.max(0, 1 - t / 110); g.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); g.restore(); });
    if (++t < 110) requestAnimationFrame(frame); else c.remove();
  })();
}

// Тосты: window.dispatchEvent(new CustomEvent('toast', { detail: { title, text } }))
export const toast = (title, text) => window.dispatchEvent(new CustomEvent('toast', { detail: { title, text, id: Math.random() } }));

export function copyText(text, onDone) {
  const done = () => onDone && onDone();
  try {
    navigator.clipboard.writeText(text).then(done, done);
  } catch { done(); }
}
