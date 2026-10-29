import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { LuX, LuPackage, LuMapPin, LuCheck, LuBell } from 'react-icons/lu';
import { MERCH, MY_COINS, TODAY, deptPeople } from './data.js';
import { cx, Coin, toast, fmtShort } from './ui.jsx';
import { Plates } from './pages.jsx';
import { PersonCard } from './people.jsx';

// Магазин мерча: только витрина. Каталог → карточка товара → покупка → «Мои заказы».
// Выдача — самовывоз в HR. Экономику коинов не проектируем.

const byIdM = Object.fromEntries(MERCH.map((m) => [m.id, m]));
const fmt = (n) => n.toLocaleString('ru');

// Баланс и заказы живут на уровне модуля, чтобы шапка и страница не расходились между переходами
const getCoins = () => window.__vlCoins ?? MY_COINS;
const day = (d) => { const x = new Date(TODAY); x.setDate(x.getDate() + d); return x; };
let ORDERS = [
  { no: 1042, item: 'stickers', opt: null, date: day(-2), status: 'ready' },
  { no: 987, item: 'mug', opt: null, date: day(-21), status: 'done' },
];
const subs = new Set();
const emit = () => subs.forEach((f) => f());
const useOrders = () => {
  const [, set] = useState(0);
  useEffect(() => { const f = () => set((x) => x + 1); subs.add(f); return () => subs.delete(f); }, []);
  return ORDERS;
};
function placeOrder(m, opt) {
  const no = Math.max(...ORDERS.map((o) => o.no)) + 1;
  window.__vlCoins = getCoins() - m.price;
  dispatchEvent(new CustomEvent('coins', { detail: -m.price }));
  const o = { no, item: m.id, opt, date: new Date(TODAY), status: 'new' };
  ORDERS = [o, ...ORDERS];
  emit();
  // демо: через несколько секунд HR «собирает» заказ
  setTimeout(() => { o.status = 'ready'; ORDERS = [...ORDERS]; emit(); toast('Заказ можно забрать', `${m.title} ждёт вас в HR`); }, 6000);
}

const STATUS = {
  new: { label: 'Собираем', cls: 'bg-muted text-muted-fg' },
  ready: { label: 'Можно забрать', cls: 'bg-ok-soft text-ok' },
  done: { label: 'Получен', cls: 'bg-muted text-faint' },
};

const Price = ({ n, big }) => (
  <span className={cx('tnum inline-flex items-center gap-1.5 font-semibold', big ? 'text-[22px]' : 'text-[15px]')}><Coin size={big ? 20 : 16} />{fmt(n)}</span>
);

function Cover({ m, className }) {
  return (
    <div className={cx('relative overflow-hidden cover-bg', className)}>
      <Plates kind={m.plates} />
      {m.badge && <span className={cx('absolute top-3 left-3 rounded-full px-2.5 py-1 text-[11.5px] font-medium', m.badge === 'Лимитка' ? 'bg-warn-soft text-warn' : 'bg-accent text-accent-fg')}>{m.badge}</span>}
    </div>
  );
}

const meta = (m) => {
  if (!m.stock) return 'Нет в наличии';
  if (m.stock <= 8) return `Осталось ${m.stock} шт.`;
  if (m.sizes) return `Размеры ${m.sizes[0]}–${m.sizes[m.sizes.length - 1]}`;
  return 'В наличии';
};

function ProductCard({ m, coins, onOpen }) {
  const lack = m.price - coins;
  return (
    <div role="button" tabIndex={0} onClick={onOpen} onKeyDown={(e) => e.key === 'Enter' && onOpen()}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-border-strong bg-card transition-all duration-200 hover:-translate-y-0.5 hover:border-border-hover hover:bg-card-2 hover:shadow-[0_16px_40px_-24px_rgba(0,0,0,0.9)]">
      <Cover m={m} className="aspect-[16/10]" />
      <div className="flex flex-1 flex-col p-4">
        <div className="truncate text-[15px] font-semibold">{m.title}</div>
        <div className={cx('mt-1 text-[13px]', !m.stock ? 'text-danger' : m.stock <= 8 ? 'text-warn' : 'text-muted-fg')}>{meta(m)}</div>
        <div className="mt-4 flex h-8 items-center justify-between gap-3">
          <Price n={m.price} />
          {!m.stock
            ? <span className="text-[12.5px] text-muted-fg">Сообщим о поступлении</span>
            : lack > 0
              ? <span className="text-[12.5px] text-muted-fg">Не хватает {fmt(lack)}</span>
              : <span className="rounded-lg bg-muted px-3 py-1.5 text-[13px] font-medium text-fg/85 transition-colors group-hover:bg-accent group-hover:text-accent-fg">Купить</span>}
        </div>
      </div>
    </div>
  );
}

function Chip({ on, children, onClick }) {
  return <button onClick={onClick} className={cx('h-9 min-w-11 rounded-lg px-3 text-[13px] font-medium transition-colors', on ? 'bg-fg text-bg' : 'bg-muted text-fg/85 hover:bg-row-active')}>{children}</button>;
}

function ProductSheet({ m, coins, onClose, onBought }) {
  const [size, setSize] = useState(null);
  const [color, setColor] = useState(m.colors?.[0] ?? null);
  const [confirm, setConfirm] = useState(false);
  const [notify, setNotify] = useState(false);
  useEffect(() => { const k = (e) => e.key === 'Escape' && onClose(); addEventListener('keydown', k); return () => removeEventListener('keydown', k); }, []);
  const lack = m.price - coins;
  const needSize = m.sizes && !size;
  const opt = [size, m.colors?.length > 1 ? color : null].filter(Boolean).join(' · ') || null;
  const buy = () => { placeOrder(m, opt); toast('Заказ оформлен', `${m.title}${opt ? ` (${opt})` : ''} · списано ${fmt(m.price)} VC`); onBought(); };
  return createPortal(
    <div className="fixed inset-0 z-[55] flex justify-end bg-black/50 fade" onClick={onClose}>
      <aside className="sheet relative flex h-full w-full max-w-[460px] flex-col overflow-y-auto border-l border-border bg-card" onClick={(e) => e.stopPropagation()}>
        <div className="group relative">
          <Cover m={m} className="aspect-[16/10]" />
          <button onClick={onClose} className="absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-black/40 text-white backdrop-blur hover:bg-black/60" aria-label="Закрыть"><LuX className="h-4.5 w-4.5" /></button>
        </div>
        <div className="flex flex-1 flex-col px-6 pt-5 pb-6">
          <div className="text-[12.5px] text-muted-fg">{m.cat}</div>
          <h2 className="mt-1 text-[22px] leading-tight font-semibold">{m.title}</h2>
          <div className="mt-3"><Price n={m.price} big /></div>
          <p className="mt-4 text-[14.5px] leading-[1.6] text-fg/85">{m.desc}</p>

          {m.sizes && (
            <>
              <div className="mt-7 text-[15px] font-semibold">Размер</div>
              <div className="mt-2.5 flex flex-wrap gap-2">{m.sizes.map((s) => <Chip key={s} on={size === s} onClick={() => { setSize(s); setConfirm(false); }}>{s}</Chip>)}</div>
            </>
          )}
          {m.colors?.length > 1 && (
            <>
              <div className="mt-6 text-[15px] font-semibold">Цвет</div>
              <div className="mt-2.5 flex flex-wrap gap-2">{m.colors.map((c) => <Chip key={c} on={color === c} onClick={() => { setColor(c); setConfirm(false); }}>{c}</Chip>)}</div>
            </>
          )}

          <div className="mt-7 flex items-start gap-3 rounded-xl bg-muted/70 p-3.5 text-[13px]">
            <LuMapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-fg" />
            <span><span className="font-medium">Самовывоз из HR</span><span className="block text-muted-fg">Восточная, 7Г, 6 этаж. Сообщим, когда заказ будет готов.</span></span>
          </div>

          <div className="mt-auto pt-8">
            {!m.stock ? (
              <button onClick={() => { setNotify(true); toast('Подписка оформлена', `Напишем, когда «${m.title}» снова появится`); }} disabled={notify}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-muted text-[14px] font-medium hover:bg-row-active disabled:opacity-60">
                {notify ? <><LuCheck className="h-4 w-4 text-ok" />Сообщим о поступлении</> : <><LuBell className="h-4 w-4" />Сообщить о поступлении</>}
              </button>
            ) : lack > 0 ? (
              <div className="flex h-11 w-full items-center justify-center rounded-xl bg-muted text-[14px] text-muted-fg">Не хватает {fmt(lack)} VC</div>
            ) : confirm ? (
              <div className="pop flex flex-col gap-2.5">
                <div className="text-center text-[13.5px] text-muted-fg">Списать <span className="font-medium text-fg">{fmt(m.price)} VC</span>? Останется {fmt(coins - m.price)}.</div>
                <div className="flex gap-2">
                  <button onClick={() => setConfirm(false)} className="h-11 flex-1 rounded-xl bg-muted text-[14px] font-medium hover:bg-row-active">Отмена</button>
                  <button onClick={buy} className="h-11 flex-[2] rounded-xl bg-accent text-[14px] font-medium text-accent-fg hover:brightness-110">Подтвердить</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setConfirm(true)} disabled={needSize}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-accent text-[14px] font-medium text-accent-fg transition-all hover:brightness-110 disabled:bg-muted disabled:text-muted-fg disabled:hover:brightness-100">
                {needSize ? 'Выберите размер' : <>Купить за <Coin size={15} />{fmt(m.price)}</>}
              </button>
            )}
          </div>
        </div>
      </aside>
    </div>,
    document.body,
  );
}

function Orders({ openPerson, onShop }) {
  const orders = useOrders();
  const hr = deptPeople('hrbp').filter((p) => !p.vacation && !p.sick).sort((a, b) => b.isHead - a.isHead).slice(0, 2);
  return (
    <div className="mt-8 grid grid-cols-1 gap-10 xl:grid-cols-[minmax(0,1fr)_380px]">
      <div>
        {orders.length === 0 && <p className="text-[14px] text-muted-fg">Заказов пока нет. <button onClick={onShop} className="text-accent hover:underline">Перейти в витрину</button></p>}
        <div className="flex flex-col gap-2">
          {orders.map((o) => {
            const m = byIdM[o.item];
            const st = STATUS[o.status];
            return (
              <div key={o.no} className="group flex items-center gap-4 rounded-2xl bg-card p-3 pr-4">
                <Cover m={{ ...m, badge: null }} className="h-16 w-20 shrink-0 rounded-xl" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[14.5px] font-medium">{m.title}{o.opt && <span className="text-muted-fg"> · {o.opt}</span>}</div>
                  <div className="mt-0.5 text-[12.5px] text-muted-fg">Заказ №{o.no} · {fmtShort(o.date)}</div>
                </div>
                <span className="hidden sm:block"><Price n={m.price} /></span>
                <span className={cx('w-[124px] shrink-0 rounded-full px-2.5 py-1 text-center text-[12px] font-medium', st.cls)}>{st.label}</span>
              </div>
            );
          })}
        </div>
      </div>
      <aside>
        <h2 className="text-[17px] font-semibold tracking-[-0.01em]">Где забрать</h2>
        <p className="mt-1 text-[14px] text-muted-fg">Отдел HR, Восточная, 7Г, 6 этаж. Когда статус сменится на «Можно забрать», подойдите и назовите номер заказа.</p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1">{hr.map((p) => <PersonCard key={p.id} p={p} onOpen={openPerson} />)}</div>
      </aside>
    </div>
  );
}

export function StorePage({ openPerson }) {
  const [coins, setCoins] = useState(getCoins());
  useEffect(() => { const h = () => setCoins(getCoins()); addEventListener('coins', h); return () => removeEventListener('coins', h); }, []);
  const orders = useOrders();
  const [tab, setTab] = useState('shop');
  const [cat, setCat] = useState('Все');
  const [open, setOpen] = useState(null);
  const cats = ['Все', ...Array.from(new Set(MERCH.map((m) => m.cat)))];
  const list = MERCH.filter((m) => cat === 'Все' || m.cat === cat);
  const active = orders.filter((o) => o.status !== 'done').length;

  return (
    <div className="mx-auto max-w-[1280px]">
      <div className="text-[13px] text-muted-fg">Мерч за Victory Coin</div>
      <div className="mt-1.5 flex flex-wrap items-end justify-between gap-4">
        <h1 className="display text-[clamp(26px,3.4vw,36px)]">Магазин мерча</h1>
        <div className="flex items-center gap-2 rounded-xl bg-accent-soft px-3.5 py-2">
          <span className="text-[13px] text-muted-fg">Ваш баланс</span>
          <span className="tnum inline-flex items-center gap-1.5 text-[16px] font-semibold text-accent"><Coin size={17} />{fmt(coins)}</span>
        </div>
      </div>

      <div className="mt-8 flex gap-1 border-b border-border">
        {[['shop', 'Витрина'], ['orders', 'Мои заказы']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className={cx('-mb-px flex h-10 items-center gap-2 border-b-2 px-3 text-[14px] font-medium transition-colors', tab === k ? 'border-fg text-fg' : 'border-transparent text-muted-fg hover:text-fg')}>
            {l}{k === 'orders' && active > 0 && <span className="tnum grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1.5 text-[11px] text-accent-fg">{active}</span>}
          </button>
        ))}
      </div>

      {tab === 'shop' ? (
        <>
          <div className="mt-5 flex flex-wrap gap-1">
            {cats.map((c) => <button key={c} onClick={() => setCat(c)} className={cx('h-9 rounded-lg px-3 text-[13px] transition-colors', cat === c ? 'bg-row-active text-fg' : 'text-muted-fg hover:bg-row-hover hover:text-fg')}>{c}</button>)}
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {list.map((m) => <ProductCard key={m.id} m={m} coins={coins} onOpen={() => setOpen(m.id)} />)}
          </div>
        </>
      ) : <Orders openPerson={openPerson} onShop={() => setTab('shop')} />}

      {open && <ProductSheet key={open} m={byIdM[open]} coins={coins} onClose={() => setOpen(null)} onBought={() => { setOpen(null); setTab('orders'); }} />}
    </div>
  );
}
