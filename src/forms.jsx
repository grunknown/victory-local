import React, { useState } from 'react';
import { LuDownload, LuSearch, LuX } from 'react-icons/lu';
import { FORMS, DEPTS, PEOPLE, byId, deptPeople } from './data.js';
import { cx, toast } from './ui.jsx';
import { PersonCard } from './people.jsx';

// Бланки документов: максимально просто — карточки с файлами и контакты кадров и бухгалтерии для нестандартных вопросов.

const FMT = {
  DOCX: { bg: 'oklch(0.6 0.13 255 / 0.16)', fg: 'oklch(0.72 0.13 255)' },
  PDF: { bg: 'oklch(0.6 0.15 25 / 0.16)', fg: 'oklch(0.72 0.15 25)' },
  XLSX: { bg: 'oklch(0.6 0.13 150 / 0.16)', fg: 'oklch(0.72 0.13 150)' },
};
const META = {
  vacation: ['36 КБ', '12 сентября'], unpaid: ['32 КБ', '12 сентября'], transfer: ['30 КБ', '4 августа'], certificate: ['118 КБ', '20 мая'],
  ndfl: ['96 КБ', '15 января'], advance: ['54 КБ', '3 марта'], trip: ['41 КБ', '3 марта'], 'trip-report': ['38 КБ', '3 марта'],
  nda: ['210 КБ', '1 июля'], guest: ['88 КБ', '9 октября'], aid: ['34 КБ', '2 октября'], personal: ['29 КБ', '18 июня'],
};

function FormCard({ f }) {
  const c = FMT[f.fmt] || FMT.DOCX;
  const [size, date] = META[f.id] || ['40 КБ', '1 сентября'];
  return (
    <div className="flex flex-col rounded-2xl border border-border-strong bg-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-border-hover hover:bg-card-2">
      <div className="flex items-start gap-3.5">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-[10.5px] font-bold tracking-wide" style={{ background: c.bg, color: c.fg }}>{f.fmt}</span>
        <div className="min-w-0 flex-1">
          <div className="line-clamp-2 h-[40px] text-[14.5px] leading-[20px] font-semibold">{f.title}</div>
          <div className="mt-1.5 text-[12.5px] text-muted-fg">{f.cat} · {size} · обновлён {date}</div>
        </div>
      </div>
      <button onClick={() => toast('Скачивание в прототипе отключено', `${f.title}.${f.fmt.toLowerCase()}`)}
        className="mt-4 flex h-9 items-center justify-center gap-2 rounded-lg bg-muted text-[13px] font-medium text-fg/85 transition-colors hover:bg-row-active hover:text-fg">
        <LuDownload className="h-4 w-4 text-muted-fg" />Скачать
      </button>
    </div>
  );
}

export function FormsPage({ openPerson }) {
  const cats = ['Все', ...Array.from(new Set(FORMS.map((f) => f.cat)))];
  const [cat, setCat] = useState('Все');
  const [q, setQ] = useState('');
  const list = FORMS.filter((f) => (cat === 'Все' || f.cat === cat) && (!q.trim() || f.title.toLowerCase().includes(q.trim().toLowerCase())));
  // показываем тех, кто на месте: в отпуске и на больничном контакт бесполезен
  const here = (dept) => deptPeople(dept).filter((p) => !p.vacation && !p.sick).sort((a, b) => b.isHead - a.isHead).slice(0, 2);
  const hr = here('hrbp');
  const acc = here('accounting');
  return (
    <div className="mx-auto max-w-[1280px]">
      <div className="text-[13px] text-muted-fg">Шаблоны заявлений, справок и отчётов</div>
      <h1 className="display mt-1.5 text-[clamp(26px,3.4vw,36px)]">Бланки документов</h1>

      <div className="mt-8 flex flex-wrap items-center gap-2">
        <label className="flex h-9 w-full items-center gap-2 rounded-lg bg-muted px-3 text-muted-fg focus-within:ring-1 focus-within:ring-border-hover sm:w-[280px]">
          <LuSearch className="h-4 w-4 shrink-0" />
          <input id="forms-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Найти бланк" className="no-ring min-w-0 flex-1 bg-transparent text-[13.5px] text-fg outline-none placeholder:text-muted-fg" />
          {q && <button onClick={() => setQ('')} aria-label="Очистить"><LuX className="h-3.5 w-3.5" /></button>}
        </label>
        <div className="flex flex-wrap gap-1">
          {cats.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={cx('h-9 rounded-lg px-3 text-[13px] transition-colors', cat === c ? 'bg-row-active text-fg' : 'text-muted-fg hover:bg-row-hover hover:text-fg')}>{c}</button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((f) => <FormCard key={f.id} f={f} />)}
      </div>
      {list.length === 0 && <p className="mt-6 text-[14px] text-muted-fg">Такого бланка нет. Напишите в отдел кадров или бухгалтерию — контакты ниже.</p>}

      <h2 className="mt-14 text-[17px] font-semibold tracking-[-0.01em]">Не нашли нужный документ?</h2>
      <p className="mt-1 max-w-[620px] text-[14px] text-muted-fg">Если запрос нестандартный, напишите напрямую: кадровые документы и справки — в отдел кадров, деньги, авансы и командировки — в бухгалтерию.</p>
      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-2">
        <section>
          <h3 className="mb-3 text-[15px] font-semibold">Отдел кадров</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{hr.map((p) => <PersonCard key={p.id} p={p} onOpen={openPerson} />)}</div>
        </section>
        <section>
          <h3 className="mb-3 text-[15px] font-semibold">Бухгалтерия</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{acc.map((p) => <PersonCard key={p.id} p={p} onOpen={openPerson} />)}</div>
        </section>
      </div>
    </div>
  );
}
