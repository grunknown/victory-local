// Моковые данные Victory Local. Всё генерируется детерминированно (seed),
// поэтому у всех зрителей одинаковые люди и цифры.

let seed = 20261020;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
const pick = (a) => a[Math.floor(rnd() * a.length)];
const int = (a, b) => a + Math.floor(rnd() * (b - a + 1));

export const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };

const M_FIRST = ['Александр','Дмитрий','Максим','Сергей','Андрей','Алексей','Артём','Илья','Кирилл','Михаил','Никита','Матвей','Роман','Егор','Иван','Павел','Денис','Тимур','Владислав','Глеб','Евгений','Антон','Даниил','Константин','Арсений','Фёдор','Марк','Лев','Ярослав','Степан'];
const F_FIRST = ['Анна','Мария','Елена','Дарья','Алина','Ирина','Екатерина','Полина','Ольга','Наталья','Татьяна','Юлия','Виктория','Ксения','Анастасия','Софья','Валерия','Вероника','Маргарита','Алёна','Кристина','Евгения','Диана','Арина','Милана','Яна','Ульяна','Василиса','Надежда','Карина'];
const LAST = ['Иванов','Смирнов','Кузнецов','Попов','Васильев','Петров','Соколов','Михайлов','Новиков','Фёдоров','Морозов','Волков','Алексеев','Лебедев','Семёнов','Егоров','Павлов','Козлов','Степанов','Николаев','Орлов','Андреев','Макаров','Никитин','Захаров','Зайцев','Соловьёв','Борисов','Яковлев','Григорьев','Романов','Воробьёв','Сергеев','Кузьмин','Фролов','Александров','Дмитриев','Королёв','Гусев','Киселёв','Ильин','Максимов','Поляков','Сорокин','Виноградов','Ковалёв','Белов','Медведев','Антонов','Тарасов','Жуков','Баранов','Филиппов','Комаров','Давыдов','Беляев','Герасимов','Богданов','Осипов','Сидоров','Матвеев','Титов','Марков','Миронов','Крылов','Куликов','Карпов','Власов','Мельников','Денисов','Гаврилов','Тихонов','Казаков','Афанасьев','Данилов','Савельев','Тимофеев','Фомин','Чернов','Абрамов','Мартынов','Ефимов','Федотов','Щербаков','Назаров','Калинин','Исаев','Чернышёв','Быков','Маслов','Родионов','Коновалов','Лазарев','Воронин','Климов','Филатов','Пономарёв','Голубев','Кудрявцев','Прохоров','Наумов','Потапов','Журавлёв','Овчинников','Трофимов','Леонов','Соболев','Ермаков','Колесников','Гончаров','Емельянов','Никифоров','Грачёв','Котов','Гришин','Ефремов','Архипов','Громов','Кириллов','Малышев','Панов','Моисеев','Румянцев','Акимов','Кондратьев','Бирюков','Горбунов','Анисимов','Ерёмин','Тихомиров','Галкин','Лукьянов','Михеев','Скворцов','Юдин','Белоусов','Нестеров','Симонов','Прокофьев','Харитонов','Князев','Цветков','Левин','Митрофанов','Воронов','Аксёнов','Софронов','Мальцев','Логинов','Горшков','Савин','Краснов','Майоров','Демидов','Елисеев','Рыбаков','Сафонов','Плотников','Дёмин','Хохлов','Хомяков','Блинов','Шубин','Корнилов'];
const fem = (l) => (/(ов|ев|ёв|ин)$/.test(l) ? l + 'а' : l);
const M_PATR = ['Александрович','Дмитриевич','Сергеевич','Андреевич','Алексеевич','Михайлович','Игоревич','Владимирович','Олегович','Николаевич','Павлович','Евгеньевич','Викторович','Юрьевич','Романович'];
const F_PATR = M_PATR.map((p) => p.replace(/ич$/, 'на'));

const TR = {а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'e',ж:'zh',з:'z',и:'i',й:'y',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'kh',ц:'ts',ч:'ch',ш:'sh',щ:'sch',ъ:'',ы:'y',ь:'',э:'e',ю:'yu',я:'ya'};
const translit = (s) => s.toLowerCase().split('').map((c) => TR[c] ?? c).join('');

// ---------- Оргструктура ----------
// size — сколько людей в отделе, включая руководителя.
const TREE = [
  { id: 'board', name: 'Руководство', short: 'Руководство', icon: 'crown', children: [] , size: 6,
    roles: ['Генеральный директор','Операционный директор','Финансовый директор','Коммерческий директор','Директор по развитию','Технический директор'] },
  { id: 'marketing', name: 'Дирекция performance-маркетинга', short: 'Performance', icon: 'chart', children: [
    { id: 'ppc', name: 'Контекстная реклама', size: 64, roles: ['Специалист по контекстной рекламе','Старший специалист PPC','Аналитик рекламных кампаний'] },
    { id: 'target', name: 'Таргетированная реклама', size: 52, roles: ['Таргетолог','Старший таргетолог','Креатор рекламных связок'] },
    { id: 'seo', name: 'SEO', size: 58, roles: ['SEO-специалист','SEO-аналитик','Линкбилдер','Технический SEO-специалист'] },
    { id: 'analytics', name: 'Веб-аналитика', size: 24, roles: ['Веб-аналитик','Специалист по сквозной аналитике'] },
  ] },
  { id: 'orm', name: 'Дирекция репутационного маркетинга', short: 'ORM / SERM', icon: 'shield', children: [
    { id: 'serm', name: 'SERM', size: 96, roles: ['SERM-специалист','Аналитик репутации','Старший SERM-специалист'] },
    { id: 'reviews', name: 'Работа с отзывами', size: 300, roles: ['Модератор отзывов','Специалист по работе с отзывами','Контент-райтер'] },
    { id: 'monitoring', name: 'Мониторинг упоминаний', size: 74, roles: ['Специалист по мониторингу','Аналитик упоминаний'] },
  ] },
  { id: 'leadgen', name: 'Дирекция лидогенерации', short: 'Лидогенерация', icon: 'target', children: [
    { id: 'callcenter', name: 'Контакт-центр', size: 560, roles: ['Оператор контакт-центра','Старший оператор','Супервайзер смены'] },
    { id: 'quality', name: 'Контроль качества', size: 42, roles: ['Специалист контроля качества','Аналитик качества'] },
    { id: 'leadops', name: 'Лид-операции', size: 48, roles: ['Менеджер лид-операций','Специалист по верификации лидов'] },
  ] },
  { id: 'production', name: 'Продакшн и digital', short: 'Продакшн', icon: 'pen', children: [
    { id: 'design', name: 'Дизайн', size: 46, roles: ['UI/UX-дизайнер','Продуктовый дизайнер','Графический дизайнер','Арт-директор'] },
    { id: 'web', name: 'Веб-разработка', size: 62, roles: ['Frontend-разработчик','Backend-разработчик','Fullstack-разработчик','Тимлид разработки'] },
    { id: 'brand', name: 'Брендинг', size: 18, roles: ['Бренд-дизайнер','Бренд-стратег'] },
    { id: 'motion', name: 'Моушн и видео', size: 22, roles: ['Моушн-дизайнер','Видеомонтажёр','Видеограф'] },
    { id: 'copy', name: 'Копирайтинг и PR', size: 38, roles: ['Копирайтер','PR-менеджер','Редактор'] },
    { id: 'smm', name: 'SMM', size: 44, roles: ['SMM-менеджер','Контент-менеджер','Комьюнити-менеджер'] },
  ] },
  { id: 'clients', name: 'Клиентский сервис и продажи', short: 'Продажи', icon: 'handshake', children: [
    { id: 'sales', name: 'Отдел продаж', size: 86, roles: ['Менеджер по продажам','Старший менеджер по продажам','Руководитель группы продаж'] },
    { id: 'accounts', name: 'Аккаунт-менеджмент', size: 72, roles: ['Аккаунт-менеджер','Старший аккаунт-менеджер','Project-менеджер'] },
    { id: 'tenders', name: 'Тендеры и партнёрства', size: 14, roles: ['Тендерный специалист','Менеджер по партнёрствам'] },
  ] },
  { id: 'vdl', name: 'VDL Service', short: 'VDL Service', icon: 'calc', children: [
    { id: 'vdl-ops', name: 'Управление стоимостью проектов', size: 34, roles: ['Аналитик стоимости','Менеджер проектов VDL','Специалист по сметам'] },
  ] },
  { id: 'it', name: 'IT и инфраструктура', short: 'IT', icon: 'server', children: [
    { id: 'sysadmin', name: 'Системное администрирование', size: 26, roles: ['Системный администратор','Инженер техподдержки','DevOps-инженер'] },
    { id: 'internal', name: 'Внутренние продукты', size: 32, roles: ['Разработчик','QA-инженер','Продакт-менеджер','Аналитик'] },
  ] },
  { id: 'people', name: 'HR', short: 'HR', icon: 'users', children: [
    { id: 'recruiting', name: 'Подбор персонала', size: 22, roles: ['Рекрутер','IT-рекрутер','Сорсер'] },
    { id: 'hrbp', name: 'HR BP и культура', size: 12, roles: ['HR BP','Менеджер по внутренним коммуникациям','Event-менеджер'] },
    { id: 'learning', name: 'Обучение и адаптация', size: 10, roles: ['Специалист по обучению','Менеджер по адаптации'] },
  ] },
  { id: 'admin', name: 'Финансы и администрирование', short: 'Финансы', icon: 'wallet', children: [
    { id: 'accounting', name: 'Бухгалтерия', size: 28, roles: ['Бухгалтер','Главный бухгалтер','Экономист'] },
    { id: 'legal', name: 'Юридический отдел', size: 12, roles: ['Юрист','Старший юрист'] },
    { id: 'office', name: 'Административно-хозяйственный отдел', size: 24, roles: ['Офис-менеджер','Администратор ресепшн','Специалист АХО'] },
  ] },
];

export const DIRECTIONS = TREE;
export const DEPTS = {}; // id -> dept
TREE.forEach((d) => {
  DEPTS[d.id] = { ...d, parent: null };
  d.children.forEach((c) => (DEPTS[c.id] = { ...c, parent: d.id }));
});

// ---------- Люди ----------
export const PEOPLE = [];
const usedEmails = new Set();
const FLOORS = ['2 этаж','3 этаж','4 этаж','5 этаж'];

function makePerson(deptId, role, isHead) {
  const female = rnd() < 0.52;
  const lastBase = pick(LAST);
  const first = female ? pick(F_FIRST) : pick(M_FIRST);
  const last = female ? fem(lastBase) : lastBase;
  const patr = female ? pick(F_PATR) : pick(M_PATR);
  let email = `${translit(first)[0]}.${translit(last)}`.replace(/[^a-z.]/g, '');
  let e = email, n = 2;
  while (usedEmails.has(e)) e = email + n++;
  usedEmails.add(e);
  const yearsIn = rnd() < 0.15 ? 0 : int(0, 5);
  const hired = addDays(TODAY, -(yearsIn * 365 + int(15, 360)));
  const bday = new Date(int(1972, 2003), int(0, 11), int(1, 28));
  const p = {
    id: PEOPLE.length + 1,
    first, last, patr, female,
    name: `${first} ${last}`,
    full: `${last} ${first} ${patr}`,
    role, dept: deptId, isHead,
    email: `${e}@victoryagency.ru`,
    phone: `+7 (343) ${int(200, 399)}-${String(int(10, 99))}-${String(int(10, 99))}`,
    ext: String(int(1000, 4999)),
    floor: pick(FLOORS),
    hired, bday,
    vacation: null, // { until: Date, deputy: id }
    photo: null,
  };
  PEOPLE.push(p);
  return p;
}

const HEAD_TITLE = (d) => (d.parent ? `Руководитель направления «${d.name}»` : `Директор: ${d.name}`);

TREE.forEach((dir) => {
  if (dir.id === 'board') {
    dir.roles.forEach((r) => {
      const p = makePerson('board', r, true);
      p.floor = '6 этаж';
    });
    DEPTS.board.head = PEOPLE.find((p) => p.dept === 'board').id;
    return;
  }
  const head = makePerson(dir.id, HEAD_TITLE(DEPTS[dir.id]), true);
  DEPTS[dir.id].head = head.id;
  dir.children.forEach((c) => {
    const h = makePerson(c.id, HEAD_TITLE(DEPTS[c.id]), true);
    DEPTS[c.id].head = h.id;
    for (let i = 1; i < c.size; i++) makePerson(c.id, pick(c.roles), false);
  });
});

export const byId = (id) => PEOPLE[id - 1];
export const deptPeople = (deptId) => PEOPLE.filter((p) => p.dept === deptId);
export const dirCount = (dirId) => {
  const d = DEPTS[dirId];
  if (!d.parent && d.children) return 1 + d.children.reduce((s, c) => s + deptPeople(c.id).length, 0) + (dirId === 'board' ? deptPeople('board').length - 1 : 0);
  return deptPeople(dirId).length;
};
// У директоров дирекций и членов правления формального руководителя нет — блок в карточке не показываем
export const managerOf = (p) => {
  const d = DEPTS[p.dept];
  if (p.dept === 'board') return null;
  if (!p.isHead && p.group && GROUPS[p.group]?.lead !== p.id) return GROUPS[p.group].lead;
  if (!p.isHead) return d.head;
  if (d.parent) return DEPTS[d.parent].head;
  return null;
};

// Текущий пользователь
export const ME = makePerson('design', 'Продуктовый дизайнер', false);
ME.first = 'Григорий'; ME.last = 'Худоян'; ME.patr = ''; ME.female = false;
ME.name = 'Григорий Худоян'; ME.full = 'Худоян Григорий';
ME.email = 'g.khudoyan@victoryagency.ru';
ME.role = 'Тимлид продуктовых дизайнеров';
ME.hired = addDays(TODAY, -(2 * 365 + 40));

// ---------- Статусы: отпуска ----------
PEOPLE.forEach((p) => {
  if (p !== ME && rnd() < 0.045) {
    const colleagues = PEOPLE.filter((x) => x.dept === p.dept && x.id !== p.id);
    p.vacation = { until: addDays(TODAY, int(2, 16)), deputy: colleagues.length ? pick(colleagues).id : null };
  }
});

// ---------- Дни рождения: гарантируем несколько на этой неделе ----------
const pool = PEOPLE.filter((p) => !p.isHead && p !== ME);
const BDAY_TODAY = [];
const bdaySet = (p, d) => { p.bday = new Date(p.bday.getFullYear(), d.getMonth(), d.getDate()); };
for (let i = 0; i < 3; i++) { const p = pool[int(0, pool.length - 1)]; bdaySet(p, TODAY); p.vacation = null; BDAY_TODAY.push(p); }
// Чтобы карточка была читаемой, убираем «случайные» ДР на ближайшую неделю и ставим 1–2 в день
PEOPLE.forEach((p) => { const d = new Date(TODAY.getFullYear(), p.bday.getMonth(), p.bday.getDate()); const n = Math.round((d - TODAY) / 86400000); if (n >= 0 && n < 7 && !BDAY_TODAY.includes(p)) bdaySet(p, addDays(TODAY, 8 + (p.id % 20))); });
for (let k = 1; k <= 6; k++) for (let i = 0; i < int(1, 2); i++) bdaySet(pool[int(0, pool.length - 1)], addDays(TODAY, k));

export function birthdaysAhead(days = 7) {
  const out = [];
  for (let k = 0; k < days; k++) {
    const d = addDays(TODAY, k);
    PEOPLE.forEach((p) => { if (p.bday.getMonth() === d.getMonth() && p.bday.getDate() === d.getDate()) out.push({ p, inDays: k, date: d }); });
  }
  return out;
}

// ---------- Новички ----------
export const NEWBIES = [];
['design', 'sales', 'seo', 'internal', 'callcenter', 'recruiting'].forEach((dep, i) => {
  const cand = PEOPLE.find((p) => p.dept === dep && !p.isHead && !p.vacation && p !== ME && !NEWBIES.includes(p) && !BDAY_TODAY.includes(p));
  cand.hired = addDays(TODAY, -[1, 2, 4, 6, 9, 12][i]);
  NEWBIES.push(cand);
});

// ---------- Фото: реальные фото из папки photos ----------
// Люди с фото: руководители дирекций, новички и именинники дня. Имена берутся из имён файлов.
export const PHOTO_PEOPLE = [
  ['p01','Сергей','Антипин',false],['p02','Кирилл','Буйкевич',false],['p03','Кирилл','Вафин',false],
  ['p04','Антон','Гончаренко',false],['p05','Яна','Койнова',true],['p06','Артём','Крохалев',false],
  ['p07','Анастасия','Лобко',true],['p08','Алёна','Першина',true],['p09','Егор','Полещук',false],
  ['p10','Александр','Потапов',false],['p11','Никита','Раевский',false],['p12','Дарья','Скачкова',true],
  ['p13','Евгений','Соловьёв',false],['p14','Юлия','Стыцюк',true],['p15','Вячеслав','Токачев',false],
  ['p16','Денис','Худайбергонов',false],['p17','Владислав','Чадаев',false],['p18','Владислав','Чернев',false],
];
{
  const fem = PHOTO_PEOPLE.filter((x) => x[3]);
  const mal = PHOTO_PEOPLE.filter((x) => !x[3]);
  // слоты: новички и именинники — сначала, затем руководители дирекций
  const slots = [...NEWBIES, ...BDAY_TODAY, ...TREE.filter((d) => d.id !== 'board').map((d) => byId(DEPTS[d.id].head))];
  slots.forEach((p) => {
    const src = (p.female ? fem : mal).length ? (p.female ? fem : mal) : (fem.length ? fem : mal);
    const x = src.shift();
    if (!x) return;
    const [file, first, last, female] = x;
    p.photo = `assets/photos/${file}.jpg`;
    p.first = first; p.last = last; p.female = female;
    p.patr = female ? pick(F_PATR) : pick(M_PATR);
    p.name = `${first} ${last}`; p.full = `${last} ${first} ${p.patr}`;
    p.email = `${translit(first)[0]}.${translit(last)}@victoryagency.ru`.replace(/[^a-z.@]/g, '');
  });
}

// ---------- Новости ----------
export const NEWS = [
  { id: 'n1', rubric: 'События', title: 'Victory Group переезжает в новую штаб-квартиру на Восточной', lead: '4 000 м², шесть этажей, восемь переговорок и своя кофейня. Рассказываем, как пройдёт переезд и что поменяется для каждого отдела.', date: addDays(TODAY, 0), mins: 4, author: 'hrbp', reactions: { '🔥': 214, '👏': 96, '❤️': 58 }, comments: 37, cover: 'office', featured: true,
    body: [
      ['p', 'С 1 ноября команды начинают поэтапный переезд в новую штаб-квартиру на улице Восточной, 7Г. Мы выросли из старого офиса ещё год назад, и теперь у нас наконец есть пространство, где поместится вся компания.'],
      ['h', 'Как пройдёт переезд'],
      ['p', 'Переезжаем тремя волнами, чтобы ни один клиентский проект не встал. Первыми едут продакшн и IT, затем performance и ORM, последними — контакт-центр, для которого готовят отдельный этаж с акустикой.'],
      ['q', 'Мы проектировали офис вместе с командами: каждый отдел сам выбрал планировку своей зоны.'],
      ['h', 'Что внутри'],
      ['p', 'Восемь переговорок разного размера, тихие кабины для звонков, кофейня на первом этаже, спортзал и терраса на крыше. Переговорки уже можно бронировать на портале.'],
    ] },
  { id: 'n6', rubric: 'Команда', source: 'tg', title: 'Новая фотосессия команды', lead: 'Сняли портреты для сайта, презентаций и портала. Забирайте свои фото у HR, а остальные скоро появятся в профилях.', date: addDays(TODAY, 0), mins: 1, author: 'hrbp', reactions: { '🔥': 156, '😍': 88 }, comments: 19,
    images: ['assets/photos/p05.jpg', 'assets/photos/p11.jpg', 'assets/photos/p07.jpg', 'assets/photos/p02.jpg', 'assets/photos/p14.jpg', 'assets/photos/p09.jpg'],
    body: [['p', 'Спасибо всем, кто пришёл на съёмку! Фото уже в общей папке, а портреты постепенно появятся в карточках сотрудников на портале.']] },
  { id: 'n2', rubric: 'Достижения', source: 'tg', title: 'Команда SERM взяла «Серебро» на Tagline Awards', lead: 'Кейс по восстановлению репутации сети клиник отметили в номинации «Лучшая ORM-кампания».', date: addDays(TODAY, -1), mins: 3, author: 'hrbp', reactions: { '🏆': 182, '🔥': 77 }, comments: 24, cover: 'award',
    body: [['p', 'Жюри отметило комплексный подход: аудит выдачи, работу с площадками отзывов и систему мониторинга, которая сократила время реакции до 40 минут.'], ['p', 'Поздравляем команду SERM и аккаунт-менеджеров проекта!']] },
  { id: 'n3', rubric: 'HR', title: 'Запускаем внутреннюю программу наставничества', lead: 'Опытные сотрудники помогут новичкам пройти первые три месяца. Наставники получат бонус и доступ к обучению.', date: addDays(TODAY, -3), mins: 2, author: 'learning', reactions: { '👏': 64, '❤️': 41 }, comments: 12, cover: 'mentor',
    body: [['p', 'Программа стартует 1 ноября. Заявку на роль наставника можно оставить у своего руководителя до 28 октября.'], ['p', 'Подробности и регламент — в базе знаний, раздел «Онбординг».']] },
  { id: 'n4', rubric: 'События', source: 'tg', title: 'Корпоратив «Victory Night» — 20 декабря', lead: 'Регистрация открыта до 1 декабря. Тема вечера — «Ревущие двадцатые».', date: addDays(TODAY, -5), mins: 2, author: 'hrbp', reactions: { '🎉': 301, '🔥': 120 }, comments: 58, cover: 'party',
    body: [['p', 'Собираемся всей компанией в загородном клубе. Трансфер от офиса в 17:00. Дресс-код — 1920-е.']] },
  { id: 'n5', rubric: 'Продукт', title: 'Как VDL Service сэкономил клиенту 18% бюджета на стройке', lead: 'Разбор кейса от команды управления стоимостью проектов.', date: addDays(TODAY, -8), mins: 6, author: 'vdl-ops', reactions: { '👏': 43 }, comments: 6, cover: 'chart',
    body: [['p', 'Команда пересобрала смету по 214 позициям и нашла дублирующиеся работы на 11 млн рублей.']] },

  { id: 'n7', rubric: 'Команда', source: 'tg', title: 'Отдел продаж закрыл рекордный квартал', lead: '+38% к плану: рассказываем, какие сделки сделали результат и кого благодарить.', date: addDays(TODAY, -9), mins: 3, reactions: { '🔥': 98, '👏': 54 }, comments: 15, cover: 'chart', body: [['p', 'Итоги третьего квартала превзошли ожидания: команда закрыла 214 сделок.']] },
  { id: 'n8', rubric: 'HR', title: 'Новый порядок оформления отпусков', lead: 'С 1 ноября заявления подаются через портал, бумажные больше не принимаем.', date: addDays(TODAY, -10), mins: 2, reactions: { '👍': 120 }, comments: 33, cover: 'mentor', body: [['p', 'Бланк заявления есть в разделе «Бланки документов», его можно заполнить онлайн.']] },
  { id: 'n9', rubric: 'События', source: 'tg', title: 'Как прошёл осенний тимбилдинг', lead: 'Байдарки, костёр и 140 участников. Делимся фото и лучшими моментами.', date: addDays(TODAY, -12), mins: 2, reactions: { '😍': 210, '🔥': 87 }, comments: 41, images: ['assets/photos/p17.jpg', 'assets/photos/p12.jpg', 'assets/photos/p15.jpg'], body: [['p', 'Спасибо организаторам и всем, кто приехал!']] },
  { id: 'n10', rubric: 'Достижения', title: 'Victory Group вошла в топ-10 рейтинга Рунета по ORM', lead: 'Поднялись на четыре позиции за год.', date: addDays(TODAY, -15), mins: 2, reactions: { '🏆': 133 }, comments: 9, cover: 'award', body: [['p', 'Рейтинг составлен по выручке и количеству кейсов.']] },
  { id: 'n11', rubric: 'Продукт', title: 'Запустили внутренний сервис сквозной аналитики', lead: 'Все отчёты по клиентам теперь в одном окне. Доступы выдаёт IT.', date: addDays(TODAY, -18), mins: 4, reactions: { '👏': 66 }, comments: 12, cover: 'chart', body: [['p', 'Сервис собирает данные из рекламных кабинетов, CRM и контакт-центра.']] },
  { id: 'n12', rubric: 'Команда', source: 'tg', title: 'Знакомьтесь: команда моушн-дизайна', lead: 'Кто делает все ролики агентства и почему у них в кабинете живёт кактус Гоша.', date: addDays(TODAY, -21), mins: 3, reactions: { '❤️': 77 }, comments: 18, images: ['assets/photos/p01.jpg'], body: [['p', 'В команде 22 человека, и каждый месяц они выпускают больше 60 роликов.']] },
];

// ---------- События ----------
export const EVENTS = [
  { title: 'Колесо фортуны', date: addDays(TODAY, 3), time: '17:00', place: 'Кофейня, 1 этаж', desc: 'Крутим колесо с призами: мерч, коины, поздний старт' },
  { title: 'Кино-вечер', date: addDays(TODAY, 9), time: '19:00', place: 'Конференц-зал, 6 этаж', desc: 'Фильм выбираем голосованием в Telegram-канале' },
  { title: 'Турнир по настольному теннису', date: addDays(TODAY, 16), time: '18:30', place: 'Терраса, 6 этаж', desc: 'Сетка на 32 игрока, запись у HR' },
  { title: 'Victory Night', date: addDays(TODAY, 61), time: '18:00', place: 'Загородный клуб', desc: 'Новогодний корпоратив, дресс-код 1920-х' },
].sort((a, b) => a.date - b.date);

// ---------- Переговорки ----------
export const ROOMS = [
  { id: 'everest', name: 'Эверест', floor: 6, cap: 20, eq: ['ТВ 86″', 'ВКС', 'Доска'] },
  { id: 'elbrus', name: 'Эльбрус', floor: 5, cap: 12, eq: ['ТВ 75″', 'ВКС'] },
  { id: 'kazbek', name: 'Казбек', floor: 4, cap: 8, eq: ['ТВ 65″', 'Доска'] },
  { id: 'belukha', name: 'Белуха', floor: 4, cap: 6, eq: ['ВКС'] },
  { id: 'ural', name: 'Урал', floor: 3, cap: 10, eq: ['Проектор', 'Доска'] },
  { id: 'iremel', name: 'Иремель', floor: 3, cap: 4, eq: ['ТВ 55″'] },
  { id: 'konzhak', name: 'Конжак', floor: 2, cap: 4, eq: ['ВКС'] },
  { id: 'taganay', name: 'Таганай', floor: 2, cap: 2, eq: ['Тихая кабина'] },
];

// ---------- Бланки ----------
export const FORMS = [
  { id: 'vacation', cat: 'Кадры', title: 'Заявление на ежегодный отпуск', fmt: 'DOCX', online: true },
  { id: 'unpaid', cat: 'Кадры', title: 'Заявление на отпуск без сохранения зарплаты', fmt: 'DOCX' },
  { id: 'transfer', cat: 'Кадры', title: 'Заявление о переводе на другую должность', fmt: 'DOCX' },
  { id: 'certificate', cat: 'Кадры', title: 'Запрос справки с места работы', fmt: 'PDF' },
  { id: 'ndfl', cat: 'Бухгалтерия', title: 'Запрос справки 2-НДФЛ', fmt: 'PDF' },
  { id: 'advance', cat: 'Бухгалтерия', title: 'Авансовый отчёт', fmt: 'XLSX' },
  { id: 'trip', cat: 'Командировки', title: 'Служебное задание на командировку', fmt: 'DOCX' },
  { id: 'trip-report', cat: 'Командировки', title: 'Отчёт о командировке', fmt: 'DOCX' },
  { id: 'nda', cat: 'Юридические', title: 'Соглашение о неразглашении (NDA)', fmt: 'PDF' },
  { id: 'guest', cat: 'Офис', title: 'Заявка на гостевой пропуск', fmt: 'PDF' },
  { id: 'aid', cat: 'Бухгалтерия', title: 'Заявление на материальную помощь', fmt: 'DOCX' },
  { id: 'personal', cat: 'Кадры', title: 'Заявление об изменении персональных данных', fmt: 'DOCX' },
];

// ---------- База знаний ----------
export const KB = [
  { id: 'onboarding', title: 'Онбординг', count: 12, desc: 'Первая неделя, доступы, люди, к которым идти' },
  { id: 'memos', title: 'Памятки', count: 24, desc: 'Отпуск, больничный, командировка, пропуск' },
  { id: 'rules', title: 'Регламенты', count: 18, desc: 'Внутренний распорядок, ИБ, работа с клиентами' },
  { id: 'brand', title: 'Брендбук', count: 6, desc: 'Логотип, цвета, шаблоны презентаций' },
  { id: 'it', title: 'IT-инструкции', count: 15, desc: 'VPN, почта, принтеры, пароли' },
  { id: 'sales', title: 'Продажи и кейсы', count: 31, desc: 'Презентации услуг, кейсы, прайс' },
];

// ---------- Мерч ----------
export const MERCH = [
  { id: 'hoodie', cat: 'Одежда', title: 'Худи Victory', price: 1200, stock: 30, sizes: ['S', 'M', 'L', 'XL'], colors: ['Графит', 'Молочный'], badge: 'Новинка', plates: 'hero', desc: 'Плотный футер 360 г, вышитый знак на груди и надпись Victory Group на спине. Свободный крой.' },
  { id: 'tee', cat: 'Одежда', title: 'Футболка оверсайз', price: 600, stock: 54, sizes: ['S', 'M', 'L', 'XL'], colors: ['Чёрный', 'Белый'], plates: 'office', desc: '100% хлопок, принт с фирменными пластинами на спине.' },
  { id: 'cap', cat: 'Одежда', title: 'Кепка', price: 450, stock: 22, colors: ['Чёрный'], plates: 'award', desc: 'Шестиклинка с вышитым знаком, регулируемый ремешок.' },
  { id: 'backpack', cat: 'Аксессуары', title: 'Рюкзак Victory', price: 1800, stock: 8, colors: ['Графит'], badge: 'Лимитка', plates: 'party', desc: 'Городской рюкзак с отделением для ноутбука до 16″. Ограниченная серия к Victory Night.' },
  { id: 'tote', cat: 'Аксессуары', title: 'Шоппер', price: 350, stock: 5, plates: 'mentor', desc: 'Плотный хлопок, длинные ручки, внутренний карман.' },
  { id: 'stickers', cat: 'Аксессуары', title: 'Стикерпак', price: 100, stock: 200, plates: 'chart', desc: '12 виниловых стикеров для ноутбука и бутылки.' },
  { id: 'mug', cat: 'Для офиса', title: 'Кружка эмалированная', price: 300, stock: 80, plates: 'award', desc: 'Объём 350 мл, белая эмаль с тёмным кантом.' },
  { id: 'thermo', cat: 'Для офиса', title: 'Термокружка', price: 550, stock: 0, plates: 'office', desc: 'Держит тепло до 6 часов, объём 400 мл, подходит для подстаканника в машине.' },
  { id: 'notebook', cat: 'Для офиса', title: 'Блокнот A5', price: 250, stock: 64, plates: 'chart', desc: 'Точечная сетка, 160 страниц, твёрдая обложка с тиснением.' },
];
export const MY_COINS = 1340;

// ---------- Поиск ----------
export function search(q, limit = 8) {
  q = q.trim().toLowerCase();
  if (!q) return [];
  const words = q.split(/\s+/);
  return PEOPLE.filter((p) => { const h = (p.full + ' ' + p.role + ' ' + DEPTS[p.dept].name + ' ' + p.email).toLowerCase(); return words.every((w) => h.includes(w)); }).slice(0, limit);
}

// ---------- Рабочий Telegram, удалёнка ----------
// Отдельный детерминированный хеш, чтобы не сдвигать остальные случайные данные
const hash = (n) => { let x = (n * 2654435761) >>> 0; x ^= x >>> 15; x = Math.imul(x, 2246822519) >>> 0; x ^= x >>> 13; return x >>> 0; };
PEOPLE.forEach((p) => {
  p.tg = '@' + p.email.split('@')[0].replace(/\./g, '_');
  const h = hash(p.id);
  if (p !== ME && !p.isHead && (h >>> 4) % 9 === 0) p.remote = true;
  if (p !== ME && !p.vacation && !BDAY_TODAY.includes(p) && h % 71 === 0) {
    const mates = PEOPLE.filter((x) => x !== p && x.dept === p.dept && (!p.group || x.group === p.group) && !x.vacation && !x.sick);
    p.sick = { since: addDays(TODAY, -((h >>> 8) % 4)), until: addDays(TODAY, 2 + ((h >>> 4) % 6)), deputy: mates.length ? mates[(h >>> 3) % mates.length].id : null };
  }
});

// ---------- Группы внутри отделов ----------
// Иерархия: дирекция → отдел → группа. У небольших отделов групп нет.
const GROUP_NAMES = {
  callcenter: ['Смена «Утро»', 'Смена «День»', 'Смена «Вечер»', 'Входящая линия', 'Исходящие продажи', 'Обучение операторов'],
  reviews: ['Медицина', 'Недвижимость', 'Автодилеры', 'Ритейл', 'HoReCa'],
  serm: ['Медицина', 'Девелопмент', 'Автодилеры', 'Федеральные бренды'],
  monitoring: ['Медиа', 'Соцсети и форумы'],
  ppc: ['Яндекс Директ', 'VK Реклама', 'Медийная реклама'],
  target: ['VK', 'Telegram Ads', 'Креативы'],
  seo: ['Технический SEO', 'Контент и ссылки', 'Локальное SEO'],
  design: ['Продуктовый дизайн', 'Коммуникационный дизайн', 'Дизайн-система'],
  web: ['Frontend', 'Backend', 'Поддержка сайтов'],
  copy: ['Копирайтинг', 'PR'],
  smm: ['Контент', 'Комьюнити'],
  sales: ['Новые клиенты', 'Ключевые клиенты', 'Регионы'],
  accounts: ['Медицина', 'Недвижимость', 'Автодилеры', 'E-commerce'],
  quality: ['Контроль звонков', 'Аналитика качества'],
  leadops: ['Верификация', 'Маршрутизация лидов'],
  'vdl-ops': ['Сметы', 'Сопровождение проектов'],
  internal: ['CRM', 'Портал', 'QA'],
};
export const GROUPS = {}; // id -> { id, name, dept, lead }
Object.values(DEPTS).forEach((d) => {
  const names = GROUP_NAMES[d.id];
  d.groups = [];
  if (!names) return;
  const members = PEOPLE.filter((p) => p.dept === d.id && !p.isHead);
  names.forEach((name, gi) => {
    const g = { id: `${d.id}-g${gi + 1}`, name, dept: d.id, lead: null };
    GROUPS[g.id] = g; d.groups.push(g.id);
  });
  members.forEach((p, i) => { p.group = d.groups[i % d.groups.length]; });
  // руководитель группы — первый в группе; тимлид продуктовых дизайнеров — это ты
  d.groups.forEach((gid) => {
    const g = GROUPS[gid];
    const lead = (d.id === 'design' && gid === 'design-g1') ? ME : PEOPLE.find((p) => p.group === gid && p !== ME);
    if (d.id === 'design' && gid === 'design-g1') ME.group = gid;
    g.lead = lead.id;
    if (lead !== ME) lead.role = d.id === 'callcenter' ? `Старший смены` : `Руководитель группы`;
  });
});
export const groupPeople = (gid) => PEOPLE.filter((p) => p.group === gid);

// ---------- Фото для всех (прототип) ----------
// В кадровой системе будут свои фото. Пока раздаём 18 портретов из фотосессии по полу,
// детерминированно; люди с «родными» фото и ты (Григорий) не трогаются.
{
  const fem = PHOTO_PEOPLE.filter((x) => x[3]).map((x) => `assets/photos/${x[0]}.jpg`);
  const mal = PHOTO_PEOPLE.filter((x) => !x[3]).map((x) => `assets/photos/${x[0]}.jpg`);
  // по кругу внутри групп, чтобы соседи в одной группе не повторялись
  const order = [...PEOPLE].sort((a, b) => (a.dept + (a.group || '')).localeCompare(b.dept + (b.group || '')) || a.id - b.id);
  const taken = new Set(PEOPLE.filter((p) => p.photo).map((p) => p.photo));
  let fi = 0, mi = 0, key = '';
  order.forEach((p) => {
    const k = p.dept + (p.group || '');
    if (k !== key) { key = k; fi = hash(k.length * 31 + p.id) % fem.length; mi = hash(k.length * 17 + p.id) % mal.length; }
    if (p.photo || p === ME) return;
    if (p.female) p.photo = fem[fi++ % fem.length]; else p.photo = mal[mi++ % mal.length];
  });
}

// ---------- Город / часовой пояс и теги компетенций ----------
const REMOTE_CITIES = [['Москва', 3], ['Новосибирск', 7], ['Тюмень', 5], ['Пермь', 5], ['Санкт-Петербург', 3], ['Челябинск', 5]];
const TAGS = {
  ppc: ['Яндекс Директ', 'VK Реклама', 'Аналитика', 'E-commerce', 'B2B', 'Медицина'],
  target: ['VK', 'Telegram Ads', 'Креативы', 'Лидогенерация', 'B2C'],
  seo: ['Техаудит', 'Контент', 'Ссылки', 'Локальное SEO', 'E-commerce'],
  analytics: ['Сквозная аналитика', 'Метрика', 'BI', 'SQL'],
  serm: ['SERM', 'Медицина', 'Девелопмент', 'Автодилеры', 'Аналитика'],
  reviews: ['ORM', 'Отзывы', 'Медицина', 'HoReCa', 'Ритейл'],
  monitoring: ['Мониторинг', 'Медиа', 'Соцсети', 'Отчёты'],
  callcenter: ['Скрипты', 'Входящие', 'Исходящие', 'CRM', 'Продажи'],
  quality: ['Контроль качества', 'Скрипты', 'Аналитика'],
  leadops: ['Лиды', 'CRM', 'Верификация'],
  design: ['Figma', 'UX', 'Дизайн-система', 'Интерфейсы', 'B2B', 'Прототипы'],
  web: ['React', 'PHP', 'Laravel', 'Bitrix', 'DevOps'],
  brand: ['Айдентика', 'Логотипы', 'Гайдлайны'],
  motion: ['After Effects', '3D', 'Монтаж', 'Reels'],
  copy: ['Тексты', 'PR', 'Медиа'],
  smm: ['Контент', 'Комьюнити', 'Reels', 'Telegram'],
  sales: ['B2B', 'Переговоры', 'Медицина', 'Девелопмент'],
  accounts: ['Ключевые клиенты', 'Медицина', 'Автодилеры', 'E-commerce'],
  tenders: ['Тендеры', 'Партнёрства', 'Госзакупки'],
  'vdl-ops': ['Сметы', 'Стройка', 'Аналитика'],
  sysadmin: ['Linux', 'Сети', 'Поддержка', 'Безопасность'],
  internal: ['CRM', 'QA', 'Автоматизация', 'Портал'],
  recruiting: ['Подбор', 'IT-рекрутинг', 'Массовый найм'],
  hrbp: ['Культура', 'Ивенты', 'Коммуникации'],
  learning: ['Обучение', 'Адаптация', 'Наставничество'],
  accounting: ['1С', 'Отчётность', 'Налоги'],
  legal: ['Договоры', 'Претензии', 'Персданные'],
  office: ['Офис', 'Закупки', 'Пропуска'],
  board: ['Стратегия', 'Развитие', 'Финансы'],
};
PEOPLE.forEach((p) => {
  const h = hash(p.id * 13 + 5);
  if (p.remote) { const c = REMOTE_CITIES[h % REMOTE_CITIES.length]; p.city = c[0]; p.tz = c[1]; }
  else { p.city = 'Екатеринбург'; p.tz = 5; }
  const pool = TAGS[p.dept] || TAGS[DEPTS[p.dept].parent] || ['Victory'];
  const n = 2 + (h % 2);
  const start = (h >>> 3) % pool.length;
  p.tags = Array.from({ length: Math.min(n, pool.length) }, (_, i) => pool[(start + i) % pool.length]);
});
ME.tags = ['Figma', 'UX', 'Дизайн-система'];
export const localTime = (tz, now = new Date()) => {
  const t = new Date(now.getTime() + (tz * 60 + now.getTimezoneOffset()) * 60000);
  return `${String(t.getHours()).padStart(2, '0')}:${String(t.getMinutes()).padStart(2, '0')}`;
};
