# Промты для Nano Banana: визуалы портала Victory Local

Сейчас в прототипе 18 фото в `assets/photos`. Ниже — что сгенерировать, сколько и куда положить. Промты на английском: модель понимает и русский, но с английским стабильнее держит детали света и кадра.

## Как генерировать, чтобы всё выглядело одной серией

1. **Прикладывайте референсы.** К каждому промту портретов прикрепляйте 2–3 текущих фото (например, `p01`, `p05`, `p13`). Это главное: без референса свет и цвет будут каждый раз разные.
2. **Один чат на серию.** Портреты — в одном диалоге, обложки новостей — в другом. Внутри диалога модель держит стиль лучше.
3. **Никакого текста на картинках.** Заголовки и подписи портал рисует сам. Если модель всё-таки добавила буквы, допишите в чат «remove all text».
4. **Синтетические лица.** Не просите «похожего на» реальных коллег. Для прототипа нужны вымышленные люди; реальные фото потом заменят их один в один.
5. **Размеры.** Портреты 1:1, сторис и видео 9:16, обложки новостей 16:10 (если формата нет — 16:9), мерч 4:5.

---

## 1. Портреты сотрудников — 40 штук (приоритет)

**Где видны:** аватары везде, дни рождения, новички, карточки сотрудников, руководители, дежурные Фиксики, сторис.
**Куда класть:** `assets/photos/p19.jpg`, `p20.jpg`… квадрат, 400×400 или больше.

### Базовый промт (меняется только строка «Person»)

```
Studio headshot portrait for a corporate team page, matching the lighting and style of the attached reference photos exactly.

Person: {ОПИСАНИЕ ИЗ СПИСКА НИЖЕ}

Composition: head and shoulders, centered, square 1:1 crop, eyes on the upper third, slight three-quarter turn of the body, face toward the camera.
Lighting: low-key studio light, one large soft key light from the left side, gentle falloff into shadow on the right cheek, no rim light, no hair light.
Background: pure deep black, seamless, no gradient, no texture.
Wardrobe: plain black clothing without logos or prints.
Look: calm, confident, natural expression with a hint of a smile, real skin texture with pores, no retouching gloss, no makeup glamour.
Camera: 85mm portrait lens, f/2.8, sharp focus on the eyes, photorealistic.
No text, no watermark, no jewelry other than described.
```

### Список людей (подставлять в «Person»)

Руководство и директора (взрослее, строже):

1. `man, 45, short salt-and-pepper hair, clean-shaven, black crew-neck sweater`
2. `woman, 42, shoulder-length dark brown hair, black blazer over a black top`
3. `man, 38, short dark hair, neat short beard, black shirt with open collar`
4. `woman, 39, blonde hair in a low bun, black turtleneck`
5. `man, 50, bald, trimmed grey beard, black polo`
6. `woman, 47, short auburn bob, thin black-framed glasses, black blazer`
7. `man, 36, wavy brown hair, light stubble, black t-shirt under a black jacket`
8. `woman, 35, long straight black hair, black silk blouse`
9. `man, 41, buzz cut, rectangular glasses, black crew-neck sweater`
10. `woman, 44, curly dark hair to the chin, black turtleneck`

Специалисты и тимлиды (25–35, разные типажи):

11. `woman, 27, long light-brown hair, black hoodie`
12. `man, 29, curly dark hair, black t-shirt, thin silver chain`
13. `woman, 31, short pixie haircut, black oversized t-shirt`
14. `man, 26, long hair tied back, light beard, black hoodie`
15. `woman, 28, red hair in a high ponytail, black sweatshirt`
16. `man, 33, glasses with round frames, short beard, black t-shirt`
17. `woman, 25, dark hair with bangs, small hoop earrings, black top`
18. `man, 30, undercut hairstyle, clean-shaven, black hoodie`
19. `woman, 34, blonde wavy hair, black cardigan`
20. `man, 27, Central Asian appearance, short black hair, black t-shirt`
21. `woman, 29, Tatar appearance, long dark hair, black turtleneck`
22. `man, 35, ginger beard, short hair, black sweatshirt`
23. `woman, 30, freckles, auburn hair in a messy bun, black t-shirt`
24. `man, 28, tall and slim, shaggy blond hair, black hoodie`
25. `woman, 26, braids, black oversized hoodie`
26. `man, 32, heavier build, friendly face, short dark hair, black polo`
27. `woman, 33, short black bob, glasses, black blouse`
28. `man, 24, very short hair, light stubble, black t-shirt`
29. `woman, 37, dark blonde shoulder-length hair, black blazer`
30. `man, 31, Caucasus appearance, thick dark hair, short beard, black shirt`

Новички и контакт-центр (моложе, мягче):

31. `woman, 22, long dark hair, black t-shirt, slightly shy smile`
32. `man, 23, curly hair, black hoodie, open smile`
33. `woman, 24, ash-blonde hair, black sweatshirt`
34. `man, 22, short fade haircut, black t-shirt`
35. `woman, 23, wavy chestnut hair, headset resting around the neck, black top`
36. `man, 25, glasses, short hair, headset resting around the neck, black t-shirt`
37. `woman, 21, ponytail, black hoodie`
38. `man, 24, slight beard, black crew-neck`
39. `woman, 26, short curly hair, black t-shirt`
40. `man, 27, long fringe, black hoodie`

> Совет: генерируйте по 4 за раз и сразу отбраковывайте те, где фон не чисто чёрный или свет пришёл справа.

---

## 2. Сторис — 9 слайдов, 9:16

**Где видны:** лента сторис на главной. Текст поверх картинки рисует портал, поэтому низ кадра (нижняя треть) должен быть спокойным и тёмным.
**Куда класть:** `assets/stories/…jpg`, 1080×1920.

### Базовый промт

```
Vertical 9:16 photo for an internal company story, editorial documentary style, shot on a modern full-frame camera.

Scene: {СЦЕНА}

Mood: dark, moody, premium; dominant colors black, graphite and warm white light; desaturated, slight film grain.
Composition: main subject in the upper two thirds, the lower third is calm and dark so white text can sit on top.
Photorealistic, no text, no logos, no signage, no watermark.
```

### Сцены

| Файл | Сторис | Сцена |
|---|---|---|
| `move-office.jpg` | Переезд | `a modern open-space office on a high floor at dusk, long tables, black chairs, warm pendant lamps, city lights through floor-to-ceiling windows, nobody in focus` |
| `move-coffee.jpg` | Переезд | `a minimalist office coffee bar, black stone counter, espresso machine with steam, barista's hands pouring latte art, warm light` |
| `move-rooms.jpg` | Переезд | `a glass-walled meeting room with a large dark screen, black table and chairs, soft light, empty and ready for a meeting` |
| `merch-hoodie.jpg` | Мерч | `a folded heavy black hoodie with a small embroidered white emblem on the chest, lying on dark concrete, top light` |
| `merch-flatlay.jpg` | Мерч | `flat lay of black merch on dark graphite surface: hoodie, cap, tote bag, enamel mug, notebook, neatly arranged, top-down` |
| `wheel.jpg` | Колесо | `a big prize wheel in an office lounge, black and white segments without any text, people blurred in the background, festive warm light` |
| `it-help.jpg` | Фиксики | `close-up of an IT engineer's hands plugging a cable into a laptop on a desk, dark office, monitor glow` |
| `awards.jpg` | Награды | `a silver award statuette on a black stage table, spotlight from above, bokeh of a dark event hall behind` |
| `top10.jpg` | Награды | `a team of five young people in black clothes celebrating in a dark office, confetti in the air, motion blur, faces not sharp` |

---

## 3. Обложки новостей — 8 штук, 16:10

**Где видны:** главная (большая новость сверху и карточки), Блог, страница новости. Сейчас у новостей без фото стоят абстрактные «пластины».
**Куда класть:** `assets/news/n1.jpg`… 1600×1000.

### Базовый промт

```
Wide 16:10 editorial photo for a company news article cover.

Scene: {СЦЕНА}

Style: modern corporate documentary photography, natural candid moments, dark and premium palette (black, graphite, warm white highlights), slightly desaturated, soft contrast.
Leave the left half of the frame darker and less busy for a headline overlay.
Photorealistic, no text, no logos, no signage, no watermark.
```

| Файл | Новость | Сцена |
|---|---|---|
| `n1.jpg` | Переезд в штаб-квартиру | `exterior of a modern six-storey office building with dark glass facade at blue hour, lit windows` |
| `n2.jpg` | Серебро Tagline Awards | `a small team on a dark award stage holding a silver statuette, spotlight, audience silhouettes` |
| `n3.jpg` | Программа наставничества | `two colleagues at a desk, an experienced one explaining something on a laptop to a younger one, warm desk lamp` |
| `n4.jpg` | Корпоратив Victory Night | `elegant evening party in 1920s style, black and gold, people in suits and flapper dresses, champagne, warm bokeh` |
| `n5.jpg` | Кейс VDL Service | `construction site of a modern building at golden hour, cranes, engineer in a black jacket holding a tablet` |
| `n7.jpg` | Рекордный квартал продаж | `a sales team high-fiving around a desk with laptops in a dark office, energetic candid moment` |
| `n8.jpg` | Новый порядок отпусков | `a calm beach chair and a laptop closed on a wooden table, soft evening light, minimal` |
| `n11.jpg` | Сервис сквозной аналитики | `a large monitor with abstract dashboard charts glowing in a dark office, person silhouette in front` |

---

## 4. Кадры для видео — 5 штук, 9:16

**Где видны:** блок «Видео» на главной и в Блоге, приветственное видео в «Новичку».
Nano Banana делает картинки, а не видео. Эти кадры станут обложками роликов; потом их можно оживить в Veo («animate this image»).
**Куда класть:** `assets/videos/<имя>.jpg` (заменяют текущие обложки), 1080×1920.

```
Vertical 9:16 cinematic still frame from a short company video.

Scene: {СЦЕНА}

Cinematic lighting, shallow depth of field, dark premium palette, black and graphite with warm practical lights, subtle film grain.
Photorealistic, no text, no logos, no watermark.
```

| Файл | Ролик | Сцена |
|---|---|---|
| `office.jpg` | Тур по новому офису | `point-of-view walking through a modern office corridor with glass meeting rooms, warm lights, people working blurred` |
| `shoot.jpg` | Бэкстейдж фотосессии | `behind the scenes of a portrait photoshoot, a young woman in black sitting on a stool in front of a black backdrop, softbox, photographer silhouette in foreground` |
| `awards.jpg` | SERM на Tagline Awards | `a team of four in black outfits walking toward a lit stage, silver statuette in one hand, backlit` |
| `motion.jpg` | Шоурил моушн-дизайнеров | `a motion designer at a dual-monitor setup in a dark room, colorful abstract animation glowing on screens, face lit by monitors` |
| `welcome.jpg` | Привет от основателей | `two founders in black clothes sitting on a sofa in a modern office lounge, talking to the camera, warm practical lights` |

---

## 5. Мерч — 9 товаров, 4:5

**Где видны:** «Магазин мерча» (сейчас там абстрактные «пластины»).
**Куда класть:** `assets/merch/<id>.jpg`, 1200×1500.

```
Product photo for an online merch store, 4:5 vertical.

Product: {ТОВАР}

Background: seamless dark graphite (#141414), soft shadow under the product.
Lighting: soft studio light from top-left, subtle highlight on edges.
Product centered with generous empty space around it, front view, true colors.
Photorealistic, no text other than described, no extra props, no watermark.
```

| Файл | Товар |
|---|---|
| `hoodie.jpg` | `heavy black oversized hoodie, small white embroidered geometric emblem on the chest, laid flat` |
| `tee.jpg` | `black oversized t-shirt, back side shown with a subtle print of tilted rounded rectangles in white outline` |
| `cap.jpg` | `black six-panel baseball cap with a small white embroidered geometric emblem, three-quarter view` |
| `backpack.jpg` | `minimalist graphite city backpack with laptop compartment, matte fabric, standing upright` |
| `tote.jpg` | `black thick cotton tote bag with long handles, standing, slightly open` |
| `stickers.jpg` | `a sheet of twelve vinyl stickers with abstract black-and-white geometric shapes, top-down` |
| `mug.jpg` | `white enamel camping mug with a dark rim, three-quarter view` |
| `thermo.jpg` | `matte black insulated travel mug with a lid, 400 ml, standing upright` |
| `notebook.jpg` | `A5 hardcover notebook in black with a blind-embossed geometric emblem, slightly angled` |

> Эмблему на мерче модель нарисует условно. Для точного знака возьмите сгенерированный кадр и попросите: «replace the emblem with the attached logo», приложив `src/logo.svg`, сохранённый в PNG.

---

## 6. По желанию, если останется время

- **Переговорки (8 шт., 16:10):** `interior of a small meeting room named after a mountain, black table, {N} chairs, large wall screen, dark premium office, soft light`. Сейчас фото переговорок нигде не выводятся — понадобятся, если добавим карточки с фото.
- **Продукты в базе знаний (7 шт., 16:9):** абстрактные обложки в фирменном стиле: `abstract 3D composition of tilted translucent rounded glass panels on a pure black background, soft white edge light, minimal, premium` + отличие для продукта (например, `with a subtle five-star motif` для ORM, `with a soft ascending line` для Performance).
- **События (4 шт., 16:9):** колесо фортуны, кино-вечер, турнир по настольному теннису, Victory Night — по базовому промту новостей.

---

## Порядок работы

1. Портреты (раздел 1) — без них не заполнить ни сотрудников, ни главную.
2. Сторис и обложки видео (разделы 2 и 4) — то, что видно сразу на главной.
3. Обложки новостей и мерч (разделы 3 и 5).

Когда картинки будут готовы, присылайте их в чат или кладите в папки из таблиц — подключу к порталу.
