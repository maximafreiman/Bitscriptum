// ============================================================
// PAGE 1 · WELCOME · BUTTON EVENTS
// ============================================================
const btnMulai = document.getElementById('btn-mulai');
btnMulai.addEventListener('mouseenter', () => btnMulai.style.backgroundColor = '#7C3AED');
btnMulai.addEventListener('mouseleave', () => btnMulai.style.backgroundColor = '#1A1A18');
btnMulai.addEventListener('click', () => navigate('page-chapters'));
// ============================================================
// PAGE 1 · WELCOME · HASH CANVAS ANIMATION
// ============================================================
const canvas = document.getElementById('hash-canvas');
const ctx = canvas.getContext('2d');

function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
resize();
window.addEventListener('resize', resize);

const HEX = '0123456789abcdef';
const randHex = n => Array.from({length:n}, () => HEX[Math.random()*16|0]).join('');

class HashStream {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = -20;
    this.speed = 0.4 + Math.random() * 0.8;
    this.chars = Array.from({length: 12 + Math.floor(Math.random()*20)}, () => randHex(8));
    this.alpha = 0.04 + Math.random() * 0.06;
    this.size = 9 + Math.random() * 3;
    this.isLeader = Math.random() < 0.15;
    this.tick = 0;
  }
  update() {
    this.y += this.speed;
    this.tick++;
    if (this.tick % 4 === 0) this.chars[Math.floor(Math.random()*this.chars.length)] = randHex(8);
    if (this.y > canvas.height + 200) this.reset();
  }
  draw() {
    ctx.font = `${this.size}px 'Courier Prime', monospace`;
    for (let i = 0; i < this.chars.length; i++) {
      const yPos = this.y - i * (this.size + 4);
      if (yPos < -20 || yPos > canvas.height + 20) continue;
      const fade = 1 - i / this.chars.length;
      if (i === 0 && this.isLeader) ctx.fillStyle = `rgba(124,58,237,${this.alpha*3.5*fade})`;
      else if (i === 0)            ctx.fillStyle = `rgba(109,40,217,${this.alpha*2*fade})`;
      else                         ctx.fillStyle = `rgba(139,92,246,${this.alpha*fade*0.5})`;
      ctx.fillText(this.chars[i], this.x, yPos);
    }
  }
}

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.r = 1 + Math.random() * 2;
    this.alpha = 0.05 + Math.random() * 0.1;
    this.vx = (Math.random() - 0.5) * 0.2;
    this.vy = (Math.random() - 0.5) * 0.2;
    this.pulse = Math.random() * Math.PI * 2;
  }
  update() {
    this.x += this.vx; this.y += this.vy; this.pulse += 0.02;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(124,58,237,${this.alpha*(0.5+0.5*Math.sin(this.pulse))})`;
    ctx.fill();
  }
}

const streams = Array.from({length:28}, () => { const s = new HashStream(); s.y = Math.random()*canvas.height; return s; });
const particles = Array.from({length:40}, () => new Particle());

let frame = 0;
function animate() {
  if (!document.getElementById('page-welcome').classList.contains('active')) {
    requestAnimationFrame(animate);
    return;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(250,250,248,0.12)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  streams.forEach(s => { s.update(); s.draw(); });
  particles.forEach(p => { p.update(); p.draw(); });
  if (frame % 3 === 0) {
    ctx.strokeStyle = 'rgba(124,58,237,0.025)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < canvas.width; x += 60) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,canvas.height); ctx.stroke(); }
    for (let y = 0; y < canvas.height; y += 60) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(canvas.width,y); ctx.stroke(); }
  }
  frame++;
  requestAnimationFrame(animate);
}
animate();

// ============================================================
// PAGE 1 · WELCOME · LIVE HASH TICKER
// ============================================================
const hashEl = document.getElementById('live-hash');
setInterval(() => {
  const prefix = ['000000000000','00000000000','0000000000000'][Math.floor(Math.random()*3)];
  hashEl.textContent = prefix + randHex(20).slice(0,20) + '...';
  hashEl.classList.add('flash');
  setTimeout(() => hashEl.classList.remove('flash'), 120);
}, 600);

// ============================================================
// PAGE 1 · WELCOME · BLOCK NUMBER COUNTER
// ============================================================
// Block number statis — menandai block saat Bitscriptum mulai dikembangkan


