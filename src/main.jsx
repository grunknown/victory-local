import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Sidebar, Header, CommandPalette, PersonSheet, Loader } from './shell.jsx';
import { Home, NewsPage, Stub, Blog } from './pages.jsx';
import { DirectionPage, CardsDemo } from './people.jsx';
import { RoomsPage } from './rooms.jsx';
import { FormsPage } from './forms.jsx';
import { KbPage, KbArticle } from './kb.jsx';
import { StorePage } from './store.jsx';
import { DEPTS } from './data.js';
import { LuCheck } from 'react-icons/lu';
import { cx } from './ui.jsx';

function Toaster() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    const h = (e) => { const t = e.detail; setItems((x) => [...x, t]); setTimeout(() => setItems((x) => x.filter((i) => i !== t)), 3600); };
    addEventListener('toast', h);
    return () => removeEventListener('toast', h);
  }, []);
  return (
    <div className="pointer-events-none fixed z-[80] flex flex-col gap-2" style={{ right: 'max(16px, env(safe-area-inset-right, 0px))', bottom: 'calc(16px + env(safe-area-inset-bottom, 0px))' }} aria-live="polite">
      {items.map((t) => (
        <div key={t.id} className="toast pointer-events-auto flex w-[min(360px,calc(100vw-32px))] items-start gap-3 rounded-xl border border-border-strong bg-card p-3.5 shadow-2xl shadow-black/50">
          <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-ok text-white"><LuCheck className="h-3 w-3" /></span>
          <span><span className="block text-[14px] font-medium">{t.title}</span>{t.text && <span className="block text-[13px] text-muted-fg">{t.text}</span>}</span>
        </div>
      ))}
    </div>
  );
}

const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch {} },
  sget(k) { try { return sessionStorage.getItem(k); } catch { return null; } },
  sset(k, v) { try { sessionStorage.setItem(k, v); } catch {} },
};
const readHash = () => (location.hash || '').replace(/^#/, '') || 'home';

function App() {
  const [route, setRoute] = useState(readHash());
  const [theme, setTheme] = useState(store.get('vl-theme') || 'dark');
  const [menu, setMenu] = useState(false);
  const [cmdk, setCmdk] = useState(false);
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(!store.sget('vl-loaded'));

  useEffect(() => { document.documentElement.dataset.appTheme = theme; store.set('vl-theme', theme); }, [theme]);
  useEffect(() => {
    const h = () => setRoute(readHash());
    addEventListener('hashchange', h);
    const k = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'л' || e.code === 'KeyK')) { e.preventDefault(); setCmdk((v) => !v); }
    };
    addEventListener('keydown', k);
    return () => { removeEventListener('hashchange', h); removeEventListener('keydown', k); };
  }, []);

  const go = (r) => {
    setMenu(false); setPerson(null);
    if (r !== route) { history.replaceState(null, '', '#' + r); setRoute(r); }
    document.getElementById('panel')?.scrollTo({ top: 0 });
    scrollTo({ top: 0 });
  };
  const openPerson = (id) => setPerson(id);

  let page;
  if (route === 'home') page = <Home go={go} openPerson={openPerson} />;
  else if (route === 'blog') page = <Blog go={go} />;
  else if (route.startsWith('news-')) page = <NewsPage id={route.slice(5)} go={go} />;
  else if (route === 'people') page = <DirectionPage key="board" id="board" go={go} openPerson={openPerson} />;
  else if (route === 'rooms') page = <RoomsPage openPerson={openPerson} />;
  else if (route === 'forms') page = <FormsPage openPerson={openPerson} />;
  else if (route === 'store') page = <StorePage openPerson={openPerson} />;
  else if (route === 'kb') page = <KbPage go={go} />;
  else if (route.startsWith('kb-')) page = <KbArticle key={route} id={route.slice(3)} go={go} openPerson={openPerson} />;
  else if (route === 'cards') page = <CardsDemo openPerson={openPerson} />;
  else if (route.startsWith('people-') && DEPTS[route.slice(7)]) {
    const d = DEPTS[route.slice(7)];
    const dir = d.parent || d.id;
    page = <DirectionPage key={dir} id={dir} focus={d.parent ? d.id : null} go={go} openPerson={openPerson} />;
  }
  else page = <Stub route={route} openPerson={openPerson} />;

  return (
    <>
      {loading && <Loader onDone={() => { setLoading(false); store.sset('vl-loaded', '1'); }} />}
      <div className={cx('lg:flex lg:h-full', loading ? 'opacity-0' : 'app-in')}>
        <Sidebar route={route} go={go} open={menu} onClose={() => setMenu(false)} />
        <div className="min-w-0 flex-1 lg:h-full lg:py-2 lg:pr-2">
          <div id="panel" className="min-h-full bg-bg lg:h-full lg:overflow-y-auto lg:rounded-xl lg:border lg:border-border">
            <Header onMenu={() => setMenu(true)} onSearch={() => setCmdk(true)} theme={theme} setTheme={setTheme} go={go} openPerson={openPerson} />
            <main id="main" key={route} className="fade pb-16" style={{ paddingTop: 28, paddingLeft: 'max(16px, env(safe-area-inset-left, 0px))', paddingRight: 'max(16px, env(safe-area-inset-right, 0px))' }}>
              <div className="lg:px-4">{page}</div>
            </main>
          </div>
        </div>
      </div>
      <Toaster />
      <CommandPalette open={cmdk} onClose={() => setCmdk(false)} go={go} openPerson={openPerson} />
      {person && <PersonSheet key={person} id={person} onClose={() => setPerson(null)} openPerson={openPerson} go={go} />}
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
