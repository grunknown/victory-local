// Своя каретка для однострочных полей ввода.
// Системную каретку браузер рисует строго по размеру шрифта, и в Onest она выходит не выше букв.
// Здесь системная прячется (класс vl-caret), а поверх рисуется полоска высотой 1.45 em, по центру строки.
// Многострочные поля (textarea) остаются с системной кареткой.

const TEXT_TYPES = new Set(['', 'text', 'search', 'email', 'tel', 'url']);
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

export function installCaret() {
  const bar = document.createElement('div');
  bar.className = 'vl-caret-bar';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);
  let el = null;

  const hide = () => { bar.style.display = 'none'; };
  const place = () => {
    if (!el || document.activeElement !== el) return hide();
    if (el.selectionStart !== el.selectionEnd) return hide(); // выделен текст — каретки нет
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const text = el.value.slice(0, el.selectionStart ?? el.value.length);
    const fs = parseFloat(cs.fontSize);
    const h = Math.round(fs * 1.45);
    const x = r.left + parseFloat(cs.paddingLeft) + parseFloat(cs.borderLeftWidth) + ctx.measureText(text).width - el.scrollLeft;
    if (x < r.left - 1 || x > r.right + 1) return hide();
    bar.style.display = 'block';
    bar.style.height = h + 'px';
    // полоска центрируется по границе между символами, чтобы не наезжать на первую букву
    bar.style.transform = `translate(${Math.round((x - 1.25) * 2) / 2}px, ${Math.round(r.top + (r.height - h) / 2)}px)`;
    // каретка не мигает, пока по ней печатают
    bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = '';
  };
  const later = () => requestAnimationFrame(place);

  document.addEventListener('focusin', (e) => {
    const t = e.target;
    if (t instanceof HTMLInputElement && TEXT_TYPES.has(t.getAttribute('type') || '')) {
      el = t; el.classList.add('vl-caret'); later();
    }
  });
  document.addEventListener('focusout', (e) => { if (e.target === el) { el.classList.remove('vl-caret'); el = null; hide(); } });
  ['input', 'keydown', 'keyup', 'pointerup', 'selectionchange'].forEach((ev) => document.addEventListener(ev, later));
  addEventListener('scroll', later, true);
  // окна и панели появляются с анимацией: пересчитываем место каретки, когда она закончится
  ['animationend', 'transitionend'].forEach((ev) => addEventListener(ev, later, true));
  addEventListener('resize', later);
}
