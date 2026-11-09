// الرسايل المستخبية على الحيطة
const MESSAGES = [
  "انتي كل حاجة في حياتي",
  "مراتي وبنتي وأمي وحياتي",
  "انتي مصدر أماني، وحضنك أحن حضن في حياتي",
  "انتي شبه النجم الساطع ⭐",
  "مفيش زيك في حلاوتك وجمالك",
  "ضحكتك وشكلك وتفاصيلك.. ما شاء الله",
  "انتي أحلى من برشلونة",
  "رجّعتيلي الشغف بعد ما كان مات",
  "الحمد لله إني اخترت صح",
  "حقك عليا، وهعوضك عن كل حاجة",
  "هعملك الهوت شوكليت، ونقف في البلكونة نضحك",
  "ليلى ويزن ولادنا إن شاء الله 💗"
];

const wall = document.getElementById('wall');
const ghost = document.getElementById('ghost');
const counter = document.getElementById('counter');
const hint = document.getElementById('hint');
const finale = document.getElementById('finale');
const root = document.documentElement;

// ترتيب الرسايل: ميلان خفيف مختلف لكل واحدة
const ROTS = [-3, 2, -1.5, 3, -2, 1.5, -3, 2.5, -1, 2, -2.5, 1];

MESSAGES.forEach((text, i) => {
  [wall, ghost].forEach(layer => {
    const cell = document.createElement('div');
    cell.className = 'msg';
    const span = document.createElement('span');
    span.textContent = text;
    span.style.setProperty('--rot', ROTS[i % ROTS.length] + 'deg');
    cell.appendChild(span);
    layer.appendChild(cell);
  });
});

const wallCells = [...wall.children];
const ghostCells = [...ghost.children];
const found = new Array(MESSAGES.length).fill(false);
let foundCount = 0;
let done = false;

// مراكز الرسايل
let centers = [];
function measure() {
  centers = wallCells.map(c => {
    const r = c.querySelector('span').getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  });
}

// حجم الكشاف
let R = 200;
function setRadius() {
  R = Math.max(130, Math.min(250, Math.min(innerWidth, innerHeight) * 0.36));
  root.style.setProperty('--r', R + 'px');
}

setRadius();
measure();
addEventListener('resize', () => { setRadius(); measure(); });
document.fonts && document.fonts.ready.then(measure);

// الضوء
let x = innerWidth / 2, y = innerHeight / 2;
let tx = x, ty = y;
let auto = true;

function onMove(e) {
  auto = false;
  hint.classList.add('gone');
  tx = e.clientX;
  // في اللمس: الكشاف أعلى الصباع شوية عشان الصباع ميغطيهوش
  ty = e.pointerType === 'touch' ? e.clientY - 70 : e.clientY;
}
addEventListener('pointermove', onMove);
addEventListener('pointerdown', onMove);

function check() {
  const reach = R * 0.5;
  for (let i = 0; i < centers.length; i++) {
    if (found[i]) continue;
    const dx = centers[i].x - x;
    const dy = centers[i].y - y;
    if (Math.hypot(dx, dy) < reach) {
      found[i] = true;
      foundCount++;
      ghostCells[i].classList.add('found');
      counter.textContent = `اكتشفتي ${foundCount} / ${MESSAGES.length}`;
    }
  }
  if (foundCount === MESSAGES.length && !done) {
    done = true;
    setTimeout(() => document.body.classList.add('all'), 1100);
  }
}

let t0 = performance.now();
function frame(now) {
  if (auto) {
    const t = (now - t0) / 1000;
    tx = innerWidth / 2 + Math.cos(t * 0.6) * innerWidth * 0.28;
    ty = innerHeight / 2 + Math.sin(t * 0.9) * innerHeight * 0.28;
  }
  x += (tx - x) * 0.2;
  y += (ty - y) * 0.2;
  root.style.setProperty('--x', x + 'px');
  root.style.setProperty('--y', y + 'px');
  if (!auto) check();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// قفل الرسالة الأخيرة
finale.addEventListener('click', () => {
  document.body.classList.add('closed');
});
