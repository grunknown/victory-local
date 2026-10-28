// Сборка прототипа в один dist/index.html (+ фото в dist/assets/photos).
// Запуск: npm install && npm run build
import * as esbuild from 'esbuild';
import { compile } from 'tailwindcss';
import fs from 'fs'; import path from 'path'; import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const twBase = path.dirname(require.resolve('tailwindcss/package.json'));

const r = await esbuild.build({ entryPoints: ['src/main.jsx'], bundle: true, minify: true, write: false, format: 'iife', jsx: 'automatic',
  define: { 'process.env.NODE_ENV': '"production"' }, target: 'es2020', logLevel: 'warning' });
const js = r.outputFiles[0].text;

// Tailwind v4: собираем классы-кандидаты прямо из исходников
const src = fs.readdirSync('src').filter(f => /\.(jsx?|mjs)$/.test(f)).map(f => fs.readFileSync('src/' + f, 'utf8')).join('\n');
const cand = new Set(src.match(/[^\s"'`{}<>]+/g));
const css0 = fs.readFileSync('src/styles.css', 'utf8');
const tw = await compile(css0, { base: 'src', loadStylesheet: async (id) => {
  const p = id === 'tailwindcss' ? twBase + '/index.css' : twBase + '/' + id.replace('tailwindcss/', '') + '.css';
  return { path: p, base: path.dirname(p), content: fs.readFileSync(p, 'utf8') };
} });
let css = tw.build([...cand]);
css = (await esbuild.transform(css, { loader: 'css', minify: true })).code;

const html = `<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Victory Local</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700&display=swap">
<style>${css}</style></head>
<body><div id="root"></div>
<script>${js.replace(/<\/script/gi, '<\\/script')}</script></body></html>
`;
fs.mkdirSync('dist/assets/photos', { recursive: true });
fs.writeFileSync('dist/index.html', html);
for (const f of fs.readdirSync('assets/photos')) fs.copyFileSync('assets/photos/' + f, 'dist/assets/photos/' + f);
console.log('js', (js.length / 1024 | 0) + 'KB', 'css', (css.length / 1024 | 0) + 'KB', 'html', (html.length / 1024 | 0) + 'KB');
