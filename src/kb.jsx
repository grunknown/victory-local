import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  LuScale, LuStickyNote, LuLaptop, LuNetwork, LuPalette, LuBriefcase, LuPresentation, LuSprout, LuWrench,
  LuClock, LuChevronLeft, LuChevronRight, LuX, LuSearch, LuArrowRight, LuPlay, LuCheck, LuInfo,
} from 'react-icons/lu';
import { DIRECTIONS, DEPTS, byId, deptPeople, PEOPLE, WELCOME_VIDEO } from './data.js';
import { PRODUCTS, PRODUCT, ROLE_KITS } from './products.js';
import { cx, Avatar, toast } from './ui.jsx';
import { VideoCard, VideoPlayer } from './media.jsx';

// База знаний: не Confluence. Небольшой курируемый набор — новичку (презентация + план адаптации),
// разделы плитками, список материалов и простая страница статьи с оглавлением.

const SECTIONS = [
  { id: 'rules', title: 'Регламенты', desc: 'Распорядок, ИБ, работа с клиентами', icon: LuScale, hue: 255 },
  { id: 'memos', title: 'Памятки', desc: 'Отпуск, больничный, командировка', icon: LuStickyNote, hue: 55 },
  { id: 'it', title: 'IT-инструкции', desc: 'VPN, почта, принтеры, пароли', icon: LuLaptop, hue: 200 },
  { id: 'structure', title: 'Структура компании', desc: 'Дирекции, отделы и руководители', icon: LuNetwork, hue: 150 },
  { id: 'brand', title: 'Брендбук', desc: 'Логотип, цвета, шаблоны презентаций', icon: LuPalette, hue: 330 },
  { id: 'sales', title: 'Продажи и кейсы', desc: 'Презентации услуг, кейсы, прайс', icon: LuBriefcase, hue: 25 },
];
const SEC = Object.fromEntries(SECTIONS.map((s) => [s.id, s]));

// Статьи. body — массив блоков: h (подзаголовок), p, ul, note
const A = (id, sec, title, mins, upd, dept, lead, body) => ({ id, sec, title, mins, upd, dept, lead, body });
const ARTICLES = [
  A('routine', 'rules', 'Правила внутреннего распорядка', 6, '2 октября', 'hrbp', 'Рабочее время, опоздания, удалёнка и как устроен офис на Восточной.', [
    { h: 'Рабочее время' },
    { p: 'Стандартный рабочий день — с 9:00 до 18:00, обед — один час в удобное время. Гибкий старт возможен с 8:00 до 10:00, если это согласовано с руководителем и не мешает встречам команды.' },
    { ul: ['Колл-центр работает по сменному графику — расписание у руководителя смены', 'Переработки согласуются письменно и компенсируются отгулом или оплатой', 'Если опаздываете больше чем на 15 минут — напишите руководителю в Telegram'] },
    { h: 'Удалённая работа' },
    { p: 'Формат работы закрепляется за сотрудником при приёме и отображается в карточке на портале. Разовые дни из дома согласуются с руководителем, отдельного заявления не нужно.' },
    { note: 'В офисе нужно быть в дни общих встреч отдела и на планёрках дирекции.' },
    { h: 'Офис' },
    { p: 'Офис на Восточной, 7Г открыт с 7:30 до 22:00. Пропуск выдаёт АХО в первый день. Гости проходят по заявке, бланк — в разделе «Бланки документов».' },
    { ul: ['Переговорки бронируются только через портал', 'Кухни убираются в 18:30 — посуду оставлять в посудомойке', 'Последний уходящий с этажа выключает свет в опенспейсе'] },
  ]),
  A('security', 'rules', 'Информационная безопасность: базовые правила', 5, '18 сентября', 'sysadmin', 'Пароли, доступы, клиентские данные и что делать при подозрительном письме.', [
    { h: 'Пароли и доступы' },
    { ul: ['Пароль не короче 12 символов, разный для разных сервисов', 'Двухфакторная аутентификация обязательна для почты и CRM', 'Доступы не передаются коллегам — для этого есть запрос в IT'] },
    { h: 'Клиентские данные' },
    { p: 'Выгрузки из CRM, медиапланы и отчёты клиентов храним только в корпоративном облаке. Пересылать их в личные мессенджеры и почту нельзя.' },
    { h: 'Подозрительные письма' },
    { p: 'Не открывайте вложения и ссылки, перешлите письмо в IT через бота и удалите его. Если уже кликнули — сразу смените пароль и сообщите в IT.' },
    { note: 'Ноутбук блокируем (Win + L), даже если отходим на минуту.' },
  ]),
  A('clients', 'rules', 'Стандарт работы с клиентами', 7, '9 сентября', 'accounts', 'Коммуникации, сроки ответа, отчётность и эскалации.', [
    { h: 'Сроки ответа' }, { p: 'На сообщения клиента отвечаем в течение двух рабочих часов, даже если ответ — «взяли в работу, вернёмся до 16:00».' },
    { h: 'Каналы' }, { ul: ['Рабочий чат проекта в Telegram', 'Корпоративная почта для документов и согласований', 'Звонки — с записью итогов в CRM'] },
    { h: 'Эскалации' }, { p: 'Если клиент недоволен результатом, аккаунт-менеджер в тот же день сообщает руководителю отдела и предлагает план действий.' },
  ]),
  A('vacation', 'memos', 'Как оформить отпуск', 3, '12 сентября', 'hrbp', 'Сроки подачи, согласование и как поставить замещающего.', [
    { h: 'Порядок' }, { ul: ['Согласуйте даты с руководителем', 'Скачайте бланк заявления в «Бланках документов»', 'Передайте подписанное заявление в отдел кадров за 14 дней'] },
    { h: 'Замещающий' }, { p: 'Укажите замещающего — он появится в вашей карточке на портале на время отпуска, и коллеги будут знать, к кому идти.' },
    { note: 'Отпускные приходят за три дня до начала отпуска.' },
  ]),
  A('sick', 'memos', 'Если заболели', 2, '20 августа', 'hrbp', 'Кого предупредить и как закрыть больничный.', [
    { h: 'В первый день' }, { ul: ['Напишите руководителю до начала рабочего дня', 'Откройте больничный лист у врача', 'Сообщите номер больничного в отдел кадров'] },
    { h: 'После' }, { p: 'Электронный больничный закрывается автоматически — дополнительно ничего приносить не нужно.' },
  ]),
  A('trip', 'memos', 'Командировка: от заявки до отчёта', 4, '3 марта', 'accounting', 'Аванс, билеты, суточные и авансовый отчёт.', [
    { h: 'До поездки' }, { p: 'Оформите служебное задание и заявку на аванс. Билеты и гостиницу бронирует офис-менеджер.' },
    { h: 'После' }, { p: 'В течение трёх рабочих дней сдайте авансовый отчёт с чеками в бухгалтерию.' },
  ]),
  A('vpn', 'it', 'Подключение к VPN', 3, '7 октября', 'sysadmin', 'Настройка на Windows и macOS за пять минут.', [
    { h: 'Установка' }, { ul: ['Скачайте клиент из письма от IT', 'Войдите корпоративной почтой', 'Подтвердите вход в приложении-аутентификаторе'] },
    { h: 'Если не работает' }, { p: 'Перезапустите клиент и проверьте время на компьютере. Не помогло — напишите IT-боту.' },
  ]),
  A('printer', 'it', 'Печать и сканирование в офисе', 2, '1 сентября', 'sysadmin', 'Где стоят МФУ и как отправить документ на печать.', [
    { h: 'Где МФУ' }, { p: 'На каждом этаже у кухни. Печать по пропуску: отправьте документ и приложите пропуск к считывателю.' },
  ]),
  A('mail', 'it', 'Корпоративная почта и календарь', 3, '28 июля', 'sysadmin', 'Подпись, общий календарь и как не потерять письма.', [
    { h: 'Подпись' }, { p: 'Шаблон подписи — в брендбуке. ФИО, должность, рабочий телефон и Telegram.' },
  ]),
  A('wifi', 'it', 'Wi-Fi в офисе', 1, '30 октября', 'sysadmin', 'Какая сеть для сотрудников, а какая для гостей.', [
    { h: 'Сети' }, { ul: ['Victory — для рабочих ноутбуков, вход по корпоративной почте', 'Victory Guest — для гостей и телефонов, пароль на ресепшене'] },
  ]),
  A('2fa', 'it', 'Двухфакторная аутентификация', 3, '22 октября', 'sysadmin', 'Как включить второй фактор для почты и CRM.', [
    { h: 'Настройка' }, { ul: ['Установите приложение-аутентификатор', 'Откройте настройки безопасности почты и отсканируйте QR-код', 'Сохраните резервные коды в надёжном месте'] },
    { note: 'Потеряли телефон — сразу зовите Фиксиков, они сбросят второй фактор.' },
  ]),
  A('laptop', 'it', 'Ноутбук и доступы в первый день', 2, '15 октября', 'sysadmin', 'Что выдают, какие доступы будут сразу и как запросить остальные.', [
    { h: 'Что выдают' }, { p: 'Ноутбук, зарядку и пропуск. Почта, Telegram-бот и портал работают с первого дня.' },
    { h: 'Остальные доступы' }, { p: 'CRM, рекламные кабинеты и облако выдаются по запросу руководителя через Фиксиков.' },
  ]),
  A('logo', 'brand', 'Логотип и фирменные цвета', 4, '14 мая', 'brand', 'Охранное поле, версии логотипа и палитра.', [
    { h: 'Версии' }, { p: 'Основная — белый знак на тёмном. На светлом фоне используем тёмную версию. Не растягиваем, не меняем цвет, не добавляем тени.' },
  ]),
  A('deck', 'brand', 'Шаблон презентации Victory Group', 2, '14 мая', 'brand', 'Мастер-слайды для Google Slides и PowerPoint.', [
    { h: 'Где взять' }, { p: 'Шаблон доступен в корпоративном облаке в папке «Брендбук». Используйте его для всех внешних презентаций.' },
  ]),
  A('cases', 'sales', 'Кейсы для презентаций клиентам', 6, '30 сентября', 'sales', 'Подборка лучших кейсов по направлениям с цифрами.', [
    { h: 'Как пользоваться' }, { p: 'Кейсы сгруппированы по направлениям. Перед отправкой клиенту уточните у аккаунта проекта, можно ли раскрывать имя бренда.' },
  ]),
  A('price', 'sales', 'Прайс на услуги 2026', 3, '1 октября', 'sales', 'Базовые ставки и правила скидок.', [
    { h: 'Скидки' }, { p: 'Скидку больше 10% согласует руководитель отдела продаж.' },
  ]),
];
const MON = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
const updKey = (u) => { const [d, m] = u.split(' '); return MON.indexOf(m) * 40 + +d; };
const RECENT = [...ARTICLES].sort((a, b) => updKey(b.upd) - updKey(a.upd));
const ART = Object.fromEntries(ARTICLES.map((a) => [a.id, a]));


// ---------- Презентация для новичков ----------
const SLIDES = [
  { kind: 'cover', eyebrow: 'Презентация для новичков', title: 'Добро пожаловать в Victory Group', text: 'Всё, что стоит знать в первую неделю: кто мы, как устроены, куда идти с вопросами.' },
  { kind: 'stats', eyebrow: 'Кто мы', title: 'Маркетинговое и IT-агентство из Екатеринбурга', stats: [['~2 000', 'сотрудников'], ['10', 'дирекций'], ['6', 'этажей на Восточной, 7Г']] },
  { kind: 'list', eyebrow: 'Чем занимаемся', title: 'Направления', items: ['Performance-маркетинг и аналитика', 'Управление репутацией и SERM', 'Лидогенерация и колл-центр', 'Продакшн: дизайн, веб, моушн, SMM', 'Клиентский сервис и продажи'] },
  { kind: 'list', eyebrow: 'Как мы работаем', title: 'Три правила', items: ['Отвечаем клиенту в течение двух часов', 'Говорим о проблеме сразу, а не в конце месяца', 'Помогаем новичкам — у каждого есть наставник'] },
  { kind: 'list', eyebrow: 'Куда идти', title: 'С вопросами', items: ['Документы, отпуск, справки — отдел кадров', 'Деньги, авансы, командировки — бухгалтерия', 'Ноутбук, доступы, VPN — IT-бот в Telegram', 'Пропуск, рабочее место — АХО'] },
  { kind: 'cover', eyebrow: 'Victory Local', title: 'Всё остальное — на портале', text: 'Новости, коллеги, переговорки, бланки и база знаний. Поиск — Ctrl + K.' },
];

function SlideBody({ s, big }) {
  const t = big ? 'text-[clamp(26px,4vw,48px)]' : 'text-[22px]';
  return (
    <div className={cx('relative flex h-full flex-col justify-end', big ? 'p-[6%]' : 'p-6')}>
      <div className={cx('eyebrow text-fg/70', big ? 'text-[13px]' : 'text-[11px]')}>{s.eyebrow}</div>
      <div className={cx('display mt-2 max-w-[80%] leading-[1.08]', t)}>{s.title}</div>
      {s.text && <p className={cx('mt-3 max-w-[60%] text-muted-fg', big ? 'text-[clamp(14px,1.4vw,18px)]' : 'text-[13px]')}>{s.text}</p>}
      {big && s.stats && (
        <div className="mt-8 grid grid-cols-3 gap-6">
          {s.stats.map(([n, l]) => <div key={l}><div className="display tnum text-[clamp(28px,4vw,56px)]">{n}</div><div className="mt-1 text-[clamp(13px,1.2vw,16px)] text-muted-fg">{l}</div></div>)}
        </div>
      )}
      {big && s.items && (
        <ol className="mt-6 flex flex-col gap-2.5">
          {s.items.map((x, i) => <li key={x} className="flex items-baseline gap-4 text-[clamp(15px,1.6vw,21px)]"><span className="tnum w-6 text-[0.8em] text-muted-fg">{String(i + 1).padStart(2, '0')}</span>{x}</li>)}
        </ol>
      )}
    </div>
  );
}

function Plates({ n = 4, dense }) {
  const pos = [['38%', '-36%'], ['54%', '-24%'], ['70%', '-12%'], ['86%', '0%']];
  return <div className="plates">{pos.slice(0, n).map(([l, t], i) => <i key={i} style={{ left: l, top: dense ? `calc(${t} - 10%)` : t, opacity: 0.5 + i * 0.12, '--dx': `${8 + i * 6}px`, '--dy': `${-4 - i * 4}px` }} />)}</div>;
}

function Deck({ onClose }) {
  const [i, setI] = useState(0);
  const go = (d) => setI((x) => Math.max(0, Math.min(SLIDES.length - 1, x + d)));
  useEffect(() => {
    const k = (e) => { if (e.key === 'Escape') onClose(); if (e.key === 'ArrowRight' || e.key === ' ') go(1); if (e.key === 'ArrowLeft') go(-1); };
    addEventListener('keydown', k);
    return () => removeEventListener('keydown', k);
  }, []);
  const s = SLIDES[i];
  return createPortal(
    <div className="fade fixed inset-0 z-[70] flex flex-col bg-black/90 backdrop-blur-sm" onClick={onClose}>
      <div className="flex h-14 shrink-0 items-center justify-between px-5 text-[13px] text-white/60" onClick={(e) => e.stopPropagation()}>
        <span>Презентация для новичков</span>
        <span className="tnum">{i + 1} / {SLIDES.length}</span>
        <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white" aria-label="Закрыть"><LuX className="h-5 w-5" /></button>
      </div>
      <div className="flex min-h-0 flex-1 items-center justify-center px-4 sm:px-16" onClick={(e) => e.stopPropagation()}>
        <div key={i} className="pop group cover-bg relative aspect-video w-full max-w-[1200px] overflow-hidden rounded-3xl text-fg" style={{ maxHeight: 'calc(100vh - 140px)' }}>
          {s.kind === 'cover' && <Plates />}
          <SlideBody s={s} big />
        </div>
      </div>
      <div className="flex h-16 shrink-0 items-center justify-center gap-3" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => go(-1)} disabled={i === 0} className="grid h-9 w-9 place-items-center rounded-lg text-white/70 hover:bg-white/10 disabled:opacity-30" aria-label="Назад"><LuChevronLeft className="h-5 w-5" /></button>
        <div className="flex gap-1.5">{SLIDES.map((_, j) => <button key={j} onClick={() => setI(j)} className={cx('h-1.5 rounded-full transition-all', j === i ? 'w-6 bg-white' : 'w-1.5 bg-white/30 hover:bg-white/50')} aria-label={`Слайд ${j + 1}`} />)}</div>
        <button onClick={() => go(1)} disabled={i === SLIDES.length - 1} className="grid h-9 w-9 place-items-center rounded-lg text-white/70 hover:bg-white/10 disabled:opacity-30" aria-label="Вперёд"><LuChevronRight className="h-5 w-5" /></button>
      </div>
    </div>,
    document.body,
  );
}

// ---------- Общие куски ----------
const cardCls = 'rounded-2xl bg-card transition-all duration-200 hover:-translate-y-0.5 hover:bg-card-2';
const SecIcon = ({ s, size = 40 }) => {
  const I = s.icon;
  return (
    <span className="grid shrink-0 place-items-center rounded-xl bg-white/[0.07] text-fg/85" style={{ width: size, height: size }}>
      <I style={{ width: size * 0.46, height: size * 0.46 }} />
    </span>
  );
};

function Crumbs({ items, go }) {
  return (
    <nav className="flex flex-wrap items-center gap-1 text-[13px] text-muted-fg" aria-label="Путь">
      {items.map((it, i) => (
        <React.Fragment key={it.label}>
          {i > 0 && <LuChevronRight className="h-3.5 w-3.5 text-faint" />}
          {it.to ? <button onClick={() => go(it.to)} className="rounded px-1 hover:text-fg">{it.label}</button> : <span className="px-1 text-fg">{it.label}</span>}
        </React.Fragment>
      ))}
    </nav>
  );
}

function ArticleRow({ a, go }) {
  const s = SEC[a.sec];
  return (
    <button onClick={() => go('kb-' + a.id)} className="group/r flex w-full items-center gap-3.5 rounded-xl px-3 py-3 text-left transition-colors hover:bg-row-hover">
      <SecIcon s={s} size={32} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[14.5px] font-medium">{a.title}</span>
        <span className="mt-0.5 block truncate text-[13px] text-muted-fg">{a.lead}</span>
      </span>
      <span className="hidden shrink-0 text-[12.5px] text-muted-fg sm:block">{s.title}</span>
      <span className="hidden w-[110px] shrink-0 text-right text-[12.5px] text-muted-fg md:block">{a.upd}</span>
      <LuArrowRight className="h-4 w-4 shrink-0 text-faint transition-transform group-hover/r:translate-x-0.5 group-hover/r:text-fg" />
    </button>
  );
}

// ---------- Блоки базы знаний: раскрываются, как дирекции в «Сотрудниках» ----------
const BLOCKS = [
  { id: 'newbie', title: 'Новичку', desc: 'Презентация, видео, с чего начать и структура компании', icon: LuSprout },
  { id: 'tech', title: 'Тех. инструкции', desc: 'VPN, почта, Wi-Fi, принтеры и доступы', icon: LuLaptop },
  { id: 'products', title: 'О продуктах', desc: 'Всё о продуктах компании для продаж, маркетинга и онбординга', icon: LuBriefcase },
  { id: 'rules', title: 'Регламенты и памятки', desc: 'Распорядок, ИБ, отпуск, командировки, брендбук', icon: LuScale },
];
const RULE_SECS = ['rules', 'memos', 'brand'];
const blockCount = (id) => ({
  newbie: '4 материала',
  tech: `${ARTICLES.filter((a) => a.sec === 'it').length} инструкций`,
  products: `${PRODUCTS.length} продуктов`,
  rules: `${ARTICLES.filter((a) => RULE_SECS.includes(a.sec)).length} материалов`,
}[id]);

export function KbPage({ go, focus }) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(() => ({ [focus || 'newbie']: true }));
  const query = q.trim().toLowerCase();
  const found = ARTICLES.filter((a) => (a.title + ' ' + a.lead).toLowerCase().includes(query));
  const foundProducts = PRODUCTS.filter((p) => (p.name + ' ' + p.short + ' ' + p.tag).toLowerCase().includes(query));

  useEffect(() => {
    if (!focus) return;
    setOpen((o) => ({ ...o, [focus]: true }));
    setTimeout(() => document.getElementById('kb-b-' + focus)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
  }, [focus]);

  return (
    <div className="mx-auto max-w-[1280px]">
      <div className="text-[13px] text-muted-fg">Всё, что нужно знать о работе в Victory Group</div>
      <div className="mt-1.5 flex flex-wrap items-end justify-between gap-4">
        <h1 className="display text-[clamp(26px,3.4vw,36px)]">База знаний</h1>
        <label className="flex h-10 w-full items-center gap-2 rounded-xl bg-card px-3 text-muted-fg focus-within:ring-1 focus-within:ring-white/20 sm:w-[320px]">
          <LuSearch className="h-4 w-4 shrink-0" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Найти статью или продукт" className="no-ring min-w-0 flex-1 bg-transparent text-[13.5px] text-fg outline-none placeholder:text-muted-fg" />
          {q && <button onClick={() => setQ('')} aria-label="Очистить"><LuX className="h-3.5 w-3.5" /></button>}
        </label>
      </div>

      {query ? (
        <div className="mt-8">
          <h2 className="text-[17px] font-semibold tracking-[-0.01em]">Найдено: {found.length + foundProducts.length}</h2>
          <div className="-mx-3 mt-2 flex flex-col">
            {foundProducts.map((p) => (
              <button key={p.id} onClick={() => go('kb-p-' + p.id)} className="group/r flex w-full items-center gap-3.5 rounded-xl px-3 py-3 text-left transition-colors hover:bg-row-hover">
                <SecIcon s={{ icon: LuBriefcase }} size={32} />
                <span className="min-w-0 flex-1"><span className="block truncate text-[14.5px] font-medium">{p.name}</span><span className="mt-0.5 block truncate text-[13px] text-muted-fg">{p.short}</span></span>
                <span className="hidden shrink-0 text-[12.5px] text-muted-fg sm:block">Продукт</span>
                <LuArrowRight className="h-4 w-4 shrink-0 text-faint" />
              </button>
            ))}
            {found.map((a) => <ArticleRow key={a.id} a={a} go={go} />)}
          </div>
          {found.length + foundProducts.length === 0 && <p className="mt-3 text-[14px] text-muted-fg">Ничего не нашлось. Попробуйте другое слово или спросите в HR.</p>}
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-3">
          {BLOCKS.map((b) => {
            const isOpen = !!open[b.id];
            return (
              <section key={b.id} id={'kb-b-' + b.id} className="scroll-mt-20 rounded-3xl bg-card">
                <button onClick={() => setOpen((o) => ({ ...o, [b.id]: !isOpen }))} aria-expanded={isOpen}
                  className="group/b flex w-full items-center gap-4 rounded-3xl p-4 text-left transition-colors hover:bg-card-2 sm:p-5">
                  <SecIcon s={b} size={44} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[17px] font-semibold tracking-[-0.01em]">{b.title}</span>
                    <span className="mt-0.5 block truncate text-[13px] text-muted-fg">{b.desc}</span>
                  </span>
                  <span className="hidden shrink-0 text-[12.5px] text-muted-fg tnum sm:block">{blockCount(b.id)}</span>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted-fg group-hover/b:text-fg">
                    <LuChevronRight className={cx('h-4 w-4 transition-transform duration-200', isOpen && 'rotate-90')} />
                  </span>
                </button>
                {isOpen && (
                  <div className="fade px-4 pb-5 sm:px-5">
                    {b.id === 'newbie' && <NewbieBlock go={go} />}
                    {b.id === 'tech' && <TechBlock go={go} />}
                    {b.id === 'products' && <ProductsBlock go={go} />}
                    {b.id === 'rules' && <div className="-mx-3 flex flex-col">{RECENT.filter((a) => RULE_SECS.includes(a.sec)).map((a) => <ArticleRow key={a.id} a={a} go={go} />)}</div>}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ---------- Новичку ----------
function NewbieBlock({ go }) {
  const [deck, setDeck] = useState(false);
  const [video, setVideo] = useState(false);
  return (
    <>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1.5fr_0.62fr] xl:grid-cols-[1.5fr_0.62fr_1.2fr]">
        <button onClick={() => setDeck(true)} className={cx('group relative overflow-hidden rounded-2xl bg-card-2 text-left transition-all duration-200 hover:-translate-y-0.5')}>
          <div className="cover-bg relative aspect-[16/9] w-full overflow-hidden">
            <Plates />
            <SlideBody s={SLIDES[0]} />
            <span className="absolute top-4 right-4 grid h-11 w-11 place-items-center rounded-full bg-white text-black shadow-lg transition-transform group-hover:scale-105"><LuPlay className="ml-0.5 h-4.5 w-4.5" /></span>
          </div>
          <div className="flex items-center gap-3 p-4">
            <LuPresentation className="h-4.5 w-4.5 text-muted-fg" />
            <span className="flex-1 text-[14.5px] font-medium">Презентация для новичков</span>
            <span className="text-[12.5px] text-muted-fg">{SLIDES.length} слайдов</span>
          </div>
        </button>
        <VideoCard v={WELCOME_VIDEO} onOpen={() => setVideo(true)} />
        <div className="flex flex-col rounded-2xl bg-card-2 p-5 md:col-span-2 xl:col-span-1">
          <div className="text-[15px] font-semibold">С чего начать</div>
          <div className="mt-0.5 text-[13px] text-muted-fg">Пять шагов на первую неделю</div>
          <div className="-mx-2 mt-3 flex flex-1 flex-col justify-between">
            {[['routine', 'Прочитать правила распорядка'], ['security', 'Разобраться с безопасностью'], ['laptop', 'Получить ноутбук и доступы'], ['vpn', 'Настроить VPN'], ['kb-products', 'Узнать, что мы продаём']].map(([id, label], i) => (
              <button key={id} onClick={() => go(id.startsWith('kb-') ? id : 'kb-' + id)} className="group/s flex items-center gap-3 rounded-lg px-2 py-2.5 text-left hover:bg-row-hover">
                <span className="tnum w-5 text-[12.5px] text-muted-fg">{String(i + 1).padStart(2, '0')}</span>
                <span className="min-w-0 flex-1 truncate text-[14px]">{label}</span>
                <LuArrowRight className="h-3.5 w-3.5 shrink-0 text-faint group-hover/s:text-fg" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-end justify-between gap-3">
        <div>
          <div className="text-[15px] font-semibold">Структура компании</div>
          <div className="mt-0.5 text-[13px] text-muted-fg">Кто есть кто — чтобы случайно не послать CEO</div>
        </div>
        <button onClick={() => go('kb-structure')} className="flex shrink-0 items-center gap-1.5 text-[13px] text-muted-fg hover:text-fg">Подробная схема<LuArrowRight className="h-3.5 w-3.5" /></button>
      </div>
      <MiniStructure go={go} />
      {deck && <Deck onClose={() => setDeck(false)} />}
      {video && <VideoPlayer list={[WELCOME_VIDEO]} onClose={() => setVideo(false)} />}
    </>
  );
}

// Компактная оргструктура: правление + дирекции, каждая раскрывается до отделов
function MiniStructure({ go }) {
  const [open, setOpen] = useState({});
  const board = deptPeople('board');
  const dirs = DIRECTIONS.filter((d) => d.id !== 'board');
  return (
    <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-[0.9fr_1.6fr]">
      <div className="rounded-2xl bg-card-2 p-3">
        <div className="eyebrow px-2 pt-1 pb-2">Правление</div>
        {board.map((p) => (
          <button key={p.id} onClick={() => go('people')} className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-row-hover">
            <Avatar p={p} size={36} />
            <span className="min-w-0"><span className="block truncate text-[13.5px] font-medium">{p.first} {p.last}</span><span className="block truncate text-[12px] text-muted-fg">{p.role}</span></span>
          </button>
        ))}
      </div>
      <div className="rounded-2xl bg-card-2 p-3">
        <div className="eyebrow px-2 pt-1 pb-2">Дирекции</div>
        <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-2">
          {dirs.map((d) => {
            const D = DEPTS[d.id];
            const head = byId(D.head);
            const isOpen = open[d.id];
            return (
              <div key={d.id}>
                <button onClick={() => setOpen((o) => ({ ...o, [d.id]: !o[d.id] }))} aria-expanded={!!isOpen} className="flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-left hover:bg-row-hover">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white/[0.08] text-[12px] font-semibold text-fg/85">{D.short[0]}</span>
                  <span className="min-w-0 flex-1"><span className="block truncate text-[13.5px] font-medium">{D.short}</span><span className="block truncate text-[12px] text-muted-fg">{head.first} {head.last}</span></span>
                  <LuChevronRight className={cx('h-3.5 w-3.5 shrink-0 text-faint transition-transform', isOpen && 'rotate-90')} />
                </button>
                {isOpen && (
                  <div className="fade mb-1 ml-[22px] flex flex-col pl-3">
                    {D.children.map((c) => (
                      <button key={c.id} onClick={() => go('people-' + c.id)} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[13px] text-muted-fg hover:bg-row-hover hover:text-fg">
                        <span className="min-w-0 flex-1 truncate">{DEPTS[c.id].name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ---------- Тех. инструкции ----------
function TechBlock({ go }) {
  return (
    <>
      <div className="-mx-3 flex flex-col">{RECENT.filter((a) => a.sec === 'it').map((a) => <ArticleRow key={a.id} a={a} go={go} />)}</div>
      <button onClick={() => go('it')} className="mt-3 flex w-full items-center gap-3 rounded-2xl bg-card-2 p-4 text-left transition-colors hover:bg-muted">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-black"><LuWrench className="h-4.5 w-4.5" /></span>
        <span className="flex-1"><span className="block text-[14.5px] font-medium">Не нашли ответ?</span><span className="block text-[13px] text-muted-fg">Позовите Фиксиков — подойдут к вашему месту</span></span>
        <LuArrowRight className="h-4 w-4 text-faint" />
      </button>
    </>
  );
}

// ---------- О продуктах: превью в базе знаний ----------
function ProductsBlock({ go }) {
  return (
    <>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {PRODUCTS.map((p) => <ProductCard key={p.id} p={p} go={go} />)}
        <button onClick={() => go('kb-products')} className="flex flex-col justify-between rounded-2xl bg-white p-4 text-left text-black transition-transform hover:-translate-y-0.5">
          <span className="text-[15px] font-semibold">Вся информация о продуктах</span>
          <span className="mt-6 flex items-center gap-1.5 text-[13px] font-medium">Для продаж, маркетинга и онбординга<LuArrowRight className="h-4 w-4" /></span>
        </button>
      </div>
    </>
  );
}

function ProductCard({ p, go, big }) {
  return (
    <button onClick={() => go('kb-p-' + p.id)} className={cx('group flex flex-col rounded-2xl text-left transition-all duration-200 hover:-translate-y-0.5', big ? 'bg-card p-5 hover:bg-card-2' : 'bg-card-2 p-4 hover:bg-muted')}>
      <span className="text-[12px] text-muted-fg">{p.tag}</span>
      <span className={cx('mt-1 font-semibold', big ? 'text-[19px]' : 'text-[15px]')}>{p.name}</span>
      <span className={cx('mt-1.5 text-muted-fg', big ? 'text-[14px]' : 'line-clamp-2 text-[13px]')}>{p.short}</span>
      {big && (
        <span className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
          {p.facts.map(([n, l]) => <span key={l} className="min-w-0"><span className="block text-[18px] font-semibold tnum">{n}</span><span className="block text-[12px] text-muted-fg">{l}</span></span>)}
        </span>
      )}
      <span className="mt-auto flex items-center gap-1 pt-4 text-[13px] text-fg/80 group-hover:text-fg">Подробнее<LuArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" /></span>
    </button>
  );
}

const DraftNote = () => (
  <div className="mt-5 flex max-w-[760px] gap-3 rounded-2xl bg-warn-soft p-4 text-[13.5px] leading-[1.5]">
    <LuInfo className="mt-0.5 h-4.5 w-4.5 shrink-0 text-warn" />
    <span><span className="font-medium text-warn">Черновик.</span> Тексты собраны по направлениям компании и пока не сверены с разделом «Продукты» на victoryagency.ru и с владельцами продуктов.</span>
  </div>
);

// Разводящая страница продуктов
function ProductsPage({ go }) {
  const kitLinks = { 'Прайс на услуги 2026': 'kb-price', 'Кейсы для презентаций': 'kb-cases', 'Брендбук и шаблоны': 'kb-logo', 'Все продукты за 10 минут': 'kb-products', 'Какая дирекция что делает': 'kb-structure' };
  return (
    <div className="mx-auto max-w-[1280px]">
      <Crumbs items={[{ label: 'База знаний', to: 'kb' }, { label: 'О продуктах' }]} go={go} />
      <h1 className="display mt-6 text-[clamp(28px,3.8vw,44px)]">Продукты Victory Group</h1>
      <p className="mt-3 max-w-[680px] text-[16px] text-muted-fg">Что мы продаём, кому и как об этом рассказывать. Одна страница для продажников, маркетологов и новичков.</p>
      <DraftNote />

      <h2 className="mt-12 text-[17px] font-semibold tracking-[-0.01em]">Материалы по ролям</h2>
      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
        {ROLE_KITS.map((k) => (
          <div key={k.id} className="rounded-2xl bg-card p-5">
            <div className="text-[16px] font-semibold">{k.title}</div>
            <div className="-mx-2 mt-3 flex flex-col">
              {k.items.map((x) => (
                <button key={x} onClick={() => (kitLinks[x] ? go(kitLinks[x]) : toast('Материал готовится', `«${x}» появится в следующей итерации`))}
                  className="group/k flex items-center gap-2 rounded-lg px-2 py-2 text-left text-[14px] text-fg/85 hover:bg-row-hover hover:text-fg">
                  <span className="min-w-0 flex-1">{x}</span>
                  <LuArrowRight className="h-3.5 w-3.5 shrink-0 text-faint group-hover/k:text-fg" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-12 text-[17px] font-semibold tracking-[-0.01em]">Все продукты</h2>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {PRODUCTS.map((p) => <ProductCard key={p.id} p={p} go={go} big />)}
      </div>
    </div>
  );
}

// Страница продукта
function ProductPage({ id, go, openPerson }) {
  const p = PRODUCT[id];
  if (!p) return <ProductsPage go={go} />;
  const owner = byId(DEPTS[p.dir]?.head);
  const heads = ['Что это', 'Кому продаём', 'Какие задачи решает', 'Что входит', 'Как продавать', 'Частые вопросы'];
  const H = ({ t }) => <h2 id={slug(t)} className="mt-10 scroll-mt-24 text-[20px] font-semibold tracking-[-0.01em]">{t}</h2>;
  const List = ({ items }) => <ul className="mt-3 flex flex-col gap-2">{items.map((x) => <li key={x} className="flex gap-3 text-[15.5px] leading-[1.55] text-fg/88"><span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-muted-fg" />{x}</li>)}</ul>;
  const i = PRODUCTS.indexOf(p);
  const nextP = PRODUCTS[(i + 1) % PRODUCTS.length];
  return (
    <ArticleShell go={go} title={p.name} heads={heads}
      crumbs={[{ label: 'База знаний', to: 'kb' }, { label: 'О продуктах', to: 'kb-products' }, { label: p.name }]}
      meta={<>
        <p className="mt-3 max-w-[680px] text-[17px] text-muted-fg">{p.short}</p>
        <div className="mt-6 flex max-w-[680px] flex-wrap gap-3">
          {p.facts.map(([n, l]) => <div key={l} className="min-w-[160px] flex-1 rounded-2xl bg-card p-4"><div className="text-[24px] font-semibold tnum">{n}</div><div className="mt-0.5 text-[13px] text-muted-fg">{l}</div></div>)}
        </div>
        <DraftNote />
      </>}
      aside={
        <div className="max-w-[680px]">
          {owner && (
            <div className="mt-14 flex flex-col gap-4 rounded-2xl bg-card p-5 sm:flex-row sm:items-center">
              <div className="flex-1">
                <div className="text-[15px] font-semibold">Вопросы по продукту</div>
                <div className="mt-0.5 text-[13.5px] text-muted-fg">Продукт ведёт дирекция «{DEPTS[p.dir].name}»</div>
              </div>
              <button onClick={() => openPerson(owner.id)} className="flex items-center gap-2.5 rounded-xl bg-muted px-3 py-2 text-[13.5px] hover:bg-row-active"><Avatar p={owner} size={28} />{owner.first} {owner.last}</button>
            </div>
          )}
          <button onClick={() => go('kb-p-' + nextP.id)} className="group mt-4 flex w-full items-center gap-3 rounded-2xl bg-card p-5 text-left hover:bg-card-2">
            <span className="flex-1"><span className="block text-[12.5px] text-muted-fg">Следующий продукт</span><span className="mt-0.5 block text-[16px] font-semibold">{nextP.name}</span></span>
            <LuArrowRight className="h-5 w-5 text-faint transition-transform group-hover:translate-x-1 group-hover:text-fg" />
          </button>
        </div>
      }>
      <div className="mt-2 max-w-[680px]">
        <H t="Что это" /><p className="mt-3 text-[15.5px] leading-[1.65] text-fg/88">{p.what}</p>
        <H t="Кому продаём" /><List items={p.clients} />
        <H t="Какие задачи решает" /><List items={p.tasks} />
        <H t="Что входит" /><List items={p.included} />
        <H t="Как продавать" />
        <blockquote className="mt-4 rounded-2xl bg-card p-5 text-[18px] leading-[1.45] font-medium">«{p.pitch}»</blockquote>
        <H t="Частые вопросы" />
        <div className="mt-3 flex flex-col gap-2">
          {p.faq.map(([q, a]) => <div key={q} className="rounded-2xl bg-card p-4"><div className="text-[15px] font-medium">{q}</div><div className="mt-1 text-[14.5px] leading-[1.55] text-muted-fg">{a}</div></div>)}
        </div>
      </div>
    </ArticleShell>
  );
}

// ---------- Статья ----------
const slug = (s) => 'h-' + s.toLowerCase().replace(/[^a-zа-яё0-9]+/gi, '-');
function Toc({ heads }) {
  const [act, setAct] = useState(heads[0]);
  useEffect(() => {
    const panel = document.getElementById('panel');
    const h = () => {
      let cur = heads[0];
      for (const x of heads) { const el = document.getElementById(slug(x)); if (el && el.getBoundingClientRect().top < 140) cur = x; }
      setAct(cur);
    };
    (panel || window).addEventListener('scroll', h, { passive: true });
    window.addEventListener('scroll', h, { passive: true });
    return () => { (panel || window).removeEventListener('scroll', h); window.removeEventListener('scroll', h); };
  }, []);
  return (
    <nav className="sticky top-[84px] hidden lg:block">
      <div className="mb-2 text-[12px] font-medium text-muted-fg">На этой странице</div>
      <div className="flex flex-col border-l border-line">
        {heads.map((x) => (
          <button key={x} onClick={() => document.getElementById(slug(x))?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className={cx('-ml-px border-l py-1.5 pl-3 text-left text-[13px] transition-colors', act === x ? 'border-fg text-fg' : 'border-transparent text-muted-fg hover:text-fg')}>{x}</button>
        ))}
      </div>
    </nav>
  );
}

function Body({ blocks }) {
  return (
    <div className="mt-8 max-w-[680px]">
      {blocks.map((b, i) => {
        if (b.h) return <h2 key={i} id={slug(b.h)} className="mt-10 scroll-mt-24 text-[20px] font-semibold tracking-[-0.01em] first:mt-0">{b.h}</h2>;
        if (b.p) return <p key={i} className="mt-3 text-[15.5px] leading-[1.65] text-fg/88">{b.p}</p>;
        if (b.ul) return <ul key={i} className="mt-3 flex flex-col gap-2">{b.ul.map((x) => <li key={x} className="flex gap-3 text-[15.5px] leading-[1.55] text-fg/88"><span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-muted-fg" />{x}</li>)}</ul>;
        if (b.note) return <div key={i} className="mt-5 flex gap-3 rounded-xl bg-card p-4 text-[14.5px] leading-[1.55]"><LuInfo className="mt-0.5 h-4.5 w-4.5 shrink-0 text-muted-fg" />{b.note}</div>;
        return null;
      })}
    </div>
  );
}

function ArticleShell({ crumbs, title, meta, heads, children, aside, go }) {
  return (
    <div className="mx-auto max-w-[1180px]">
      <Crumbs items={crumbs} go={go} />
      <div className="mt-6 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_220px]">
        <article className="min-w-0">
          <h1 className="display max-w-[760px] text-[clamp(26px,3.4vw,38px)] leading-[1.1]">{title}</h1>
          {meta}
          {children}
          {aside}
        </article>
        {heads?.length > 1 ? <Toc heads={heads} /> : <div />}
      </div>
    </div>
  );
}

function Author({ dept, upd, mins }) {
  const p = byId(DEPTS[dept]?.head);
  return (
    <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-muted-fg">
      {p && <span className="flex items-center gap-2"><Avatar p={p} size={24} /><span className="text-fg/85">{p.first} {p.last}</span>· {DEPTS[dept].name}</span>}
      <span>Обновлено {upd}</span>
      {mins && <span className="flex items-center gap-1"><LuClock className="h-3.5 w-3.5" />{mins} мин</span>}
    </div>
  );
}

export function KbArticle({ id, go, openPerson }) {
  if (id === 'structure') return <Structure go={go} />;
  if (id.startsWith('s-')) return <KbPage go={go} focus={id.slice(2)} />;
  if (id === 'products') return <ProductsPage go={go} />;
  if (id.startsWith('p-')) return <ProductPage id={id.slice(2)} go={go} openPerson={openPerson} />;
  const a = ART[id];
  if (!a) return <KbPage go={go} />;
  const heads = a.body.filter((b) => b.h).map((b) => b.h);
  const more = ARTICLES.filter((x) => x.sec === a.sec && x.id !== a.id).slice(0, 3);
  const owner = byId(DEPTS[a.dept]?.head);
  return (
    <ArticleShell go={go} title={a.title} heads={heads}
      crumbs={[{ label: 'База знаний', to: 'kb' }, { label: SEC[a.sec].title }]}
      meta={<><p className="mt-3 max-w-[680px] text-[16px] text-muted-fg">{a.lead}</p><Author dept={a.dept} upd={a.upd} mins={a.mins} /></>}
      aside={
        <div className="max-w-[680px]">
          <div className="mt-14 flex flex-col gap-4 rounded-2xl bg-card p-5 sm:flex-row sm:items-center">
            <div className="flex-1">
              <div className="text-[15px] font-semibold">Остались вопросы?</div>
              <div className="mt-0.5 text-[13.5px] text-muted-fg">Статью ведёт {DEPTS[a.dept].name.toLowerCase()} — напишите автору.</div>
            </div>
            {owner && <button onClick={() => openPerson(owner.id)} className="flex items-center gap-2.5 rounded-xl bg-muted px-3 py-2 text-[13.5px] hover:bg-row-active"><Avatar p={owner} size={28} />{owner.first} {owner.last}</button>}
          </div>
          {more.length > 0 && (
            <>
              <h2 className="mt-12 text-[17px] font-semibold tracking-[-0.01em]">Ещё в разделе «{SEC[a.sec].title}»</h2>
              <div className="-mx-3 mt-2 flex flex-col">{more.map((x) => <ArticleRow key={x.id} a={x} go={go} />)}</div>
            </>
          )}
        </div>
      }>
      <Body blocks={a.body} />
    </ArticleShell>
  );
}

// ---------- Структура компании: живая статья из оргструктуры ----------
const DIR_HUE = { board: 265, marketing: 230, orm: 200, leadgen: 30, production: 300, clients: 150, vdl: 55, it: 210, people: 340, admin: 100 };
function Structure({ go }) {
  const dirs = DIRECTIONS.filter((d) => d.id !== 'board');
  const board = deptPeople('board');
  return (
    <ArticleShell go={go} title="Структура компании" heads={['Правление', 'Дирекции']}
      crumbs={[{ label: 'База знаний', to: 'kb' }, { label: 'Структура компании' }]}
      meta={<><p className="mt-3 max-w-[680px] text-[16px] text-muted-fg">Victory Group состоит из {dirs.length} дирекций. Схема собирается из оргструктуры портала, поэтому всегда актуальна. Нажмите на отдел, чтобы увидеть людей.</p></>}>
      <h2 id={slug('Правление')} className="mt-10 scroll-mt-24 text-[20px] font-semibold tracking-[-0.01em]">Правление</h2>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {board.map((p) => (
          <button key={p.id} onClick={() => go('people')} className="flex items-center gap-2.5 rounded-xl bg-card py-2 pr-4 pl-2 text-left hover:bg-card-2">
            <Avatar p={p} size={36} />
            <span><span className="block text-[13.5px] font-medium">{p.first} {p.last}</span><span className="block text-[12px] text-muted-fg">{p.role}</span></span>
          </button>
        ))}
      </div>
      <h2 id={slug('Дирекции')} className="mt-12 scroll-mt-24 text-[20px] font-semibold tracking-[-0.01em]">Дирекции</h2>
      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
        {dirs.map((d) => {
          const D = DEPTS[d.id];
          const head = byId(D.head);
          const hue = DIR_HUE[d.id] ?? 260;
          return (
            <div key={d.id} className="flex flex-col rounded-2xl bg-card p-4">
              <button onClick={() => go('people-' + d.id)} className="group/h flex items-center gap-3 text-left">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/[0.08] text-[15px] font-semibold text-fg/85">{D.short[0]}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-semibold group-hover/h:underline">{D.name}</span>
                  <span className="block truncate text-[12.5px] text-muted-fg">{head.first} {head.last} · директор</span>
                </span>
                <Avatar p={head} size={32} />
              </button>
              <div className="mt-3 flex flex-col pt-1">
                {D.children.map((c) => {
                  const cd = DEPTS[c.id];
                  const h = byId(cd.head);
                  return (
                    <button key={c.id} onClick={() => go('people-' + c.id)} className="group/d -mx-2 flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-left hover:bg-row-hover">
                      <span className="min-w-0 flex-1 truncate text-[13.5px]">{cd.name}</span>
                      <span className="hidden truncate text-[12.5px] text-muted-fg sm:block">{h.first} {h.last}</span>
                      <LuChevronRight className="h-3.5 w-3.5 shrink-0 text-faint group-hover/d:text-fg" />
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </ArticleShell>
  );
}
