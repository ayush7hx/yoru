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
  const DOB_YEAR = 2009, DOB_MONTH = 11, DOB_DAY = 14; // 0-indexed month
  const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;

  function nowIST() { return new Date(Date.now() + IST_OFFSET_MS); }

  function calcAge(now) {
    const y = now.getUTCFullYear(), mo = now.getUTCMonth(), d = now.getUTCDate();
    const h = now.getUTCHours(), mi = now.getUTCMinutes(), s = now.getUTCSeconds();

    let years = y - DOB_YEAR;
    if (mo < DOB_MONTH || (mo === DOB_MONTH && d < DOB_DAY)) years--;

    const lastBdayUTC = Date.UTC(
      (DOB_MONTH > mo || (mo === DOB_MONTH && d < DOB_DAY)) ? y - 1 : y,
      DOB_MONTH, DOB_DAY
    ) - IST_OFFSET_MS;

    const diffMs = Date.now() - lastBdayUTC;
    const totalSec = Math.floor(diffMs / 1000);
    const totalMin = Math.floor(totalSec / 60);
    const totalHrs = Math.floor(totalMin / 60);
    const totalDays = Math.floor(totalHrs / 24);

    return {
      years, days: totalDays, hours: totalHrs % 24,
      minutes: totalMin % 60, seconds: totalSec % 60
    };
  }

  function updateAgeTimer() {
    const now = nowIST();
    const a = calcAge(now);
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
    const now = nowIST();
    const y = now.getUTCFullYear(), mo = now.getUTCMonth(), d = now.getUTCDate();
    let age = y - DOB_YEAR;
    if (mo < DOB_MONTH || (mo === DOB_MONTH && d < DOB_DAY)) age--;
    setEl('faq-age', String(age));
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
    setInterval(updateFaqAge, 60000); // Check age every minute

    // Active nav highlight
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a').forEach(a => {
      if (a.getAttribute('href') === path) a.classList.add('active');
    });
  });
  