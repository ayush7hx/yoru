// ── LIVE CLOCK (IST) ──────────────────────────────
  const istFmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  });
  function updateClock() {
    const el = document.getElementById('live-clock');
    if (!el) return;
    const parts = istFmt.formatToParts(new Date());
    const get = (t) => parts.find(p => p.type === t)?.value ?? '00';
    el.textContent = get('hour') + ':' + get('minute') + ':' + get('second');
  }

  // ── AGE / LIFE TIMER ──────────────────────────────────
  // DOB: 14 December 2009, 20:30 IST (8:30 PM)
  // IST = UTC+5:30, so birth in UTC = 14 Dec 2009 15:00:00 UTC
  const BIRTH_UTC_MS = Date.UTC(2009, 11, 14, 15, 0, 0); // month is 0-indexed: 11 = December

  const DOB_YEAR = 2009, DOB_MONTH = 11, DOB_DAY = 14; // for year calc
  const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;

  function nowIST() { return new Date(Date.now() + IST_OFFSET_MS); }

  function calcAge() {
    const now = Date.now();
    const nowIST_ = new Date(now + IST_OFFSET_MS);

    const y  = nowIST_.getUTCFullYear();
    const mo = nowIST_.getUTCMonth();
    const d  = nowIST_.getUTCDate();
    const h  = nowIST_.getUTCHours();
    const mi = nowIST_.getUTCMinutes();
    const s  = nowIST_.getUTCSeconds();

    // Full years completed
    let years = y - DOB_YEAR;
    // Check if this year's birthday (at 20:30 IST) has passed
    const thisYearBdayUTC = Date.UTC(y, 11, 14, 15, 0, 0); // 14 Dec this year 20:30 IST
    if (now < thisYearBdayUTC) years--;

    // Time since last birthday (exact 20:30 IST moment)
    const lastBdayYear = now >= thisYearBdayUTC ? y : y - 1;
    const lastBdayUTC  = Date.UTC(lastBdayYear, 11, 14, 15, 0, 0);
    const diffMs       = now - lastBdayUTC;

    const totalSec  = Math.floor(diffMs / 1000);
    const totalMin  = Math.floor(totalSec / 60);
    const totalHrs  = Math.floor(totalMin / 60);
    const totalDays = Math.floor(totalHrs / 24);

    return {
      years,
      days:    totalDays,
      hours:   totalHrs  % 24,
      minutes: totalMin  % 60,
      seconds: totalSec  % 60
    };
  }

  function updateAgeTimer() {
    const a = calcAge();
    setEl('age-years',   String(a.years));
    setEl('age-days',    String(a.days).padStart(3, '0'));
    setEl('age-hours',   String(a.hours).padStart(2, '0'));
    setEl('age-minutes', String(a.minutes).padStart(2, '0'));
    setEl('age-seconds', String(a.seconds).padStart(2, '0'));
  }

  function setEl(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  // ── AUTO FAQ AGE UPDATE ─────────────────────────────
  function updateFaqAge() {
    const a = calcAge();
    setEl('faq-age', String(a.years));
  }

  // ── PARTICLE SYSTEM ───────────────────────────────────
  function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    const count = 25;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDuration = (8 + Math.random() * 12) + 's';
      p.style.animationDelay = Math.random() * 10 + 's';
      p.style.width = (1 + Math.random() * 2) + 'px';
      p.style.height = p.style.width;
      p.style.opacity = 0.15 + Math.random() * 0.3;
      container.appendChild(p);
    }
  }

  // ── INIT ─────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    updateClock(); updateAgeTimer(); updateFaqAge(); createParticles();
    setInterval(updateClock, 1000);
    setInterval(updateAgeTimer, 1000);
    setInterval(updateFaqAge, 60000);

    // Active nav highlight
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a').forEach(a => {
      if (a.getAttribute('href') === path) a.classList.add('active');
    });
  });
  
