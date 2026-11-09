// Световое пятно на текстурных плитках: передаём координаты курсора в CSS (--mx/--my) у ближайшей .tex
export function installTexFx() {
  addEventListener('pointermove', (e) => {
    const el = e.target instanceof Element ? e.target.closest('.tex') : null;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  }, { passive: true });
}
