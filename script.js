// ── LIVE CLOCK (IST) — robust via Intl ───────────────────
const istFmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Kolkata',
  hour:   '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false
});

function updateClock() {
  const el = document.getElementById('live-clock');
  if (!el) return;
  const parts = istFmt.formatToParts(new Date());
  const get = (t) => parts.find(p => p.type === t)?.value ?? '00';
  el.textContent = `${get('hour')}:${get('minute')}:${get('second')}`;
}

// ── AGE / LIFE TIMER — calendar-accurate ─────────────────
// DOB in IST: 14 December 2009
const DOB_YEAR  = 2009;
const DOB_MONTH = 11;   // 0-indexed
const DOB_DAY   = 14;

// IST offset: UTC+5:30
const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;

function nowIST() {
  return new Date(Date.now() + IST_OFFSET_MS);
}

function calcAge(now) {
  // Work in IST calendar values
  const y  = now.getUTCFullYear();
  const mo = now.getUTCMonth();
  const d  = now.getUTCDate();
  const h  = now.getUTCHours();
  const mi = now.getUTCMinutes();
  const s  = now.getUTCSeconds();

  // Full years elapsed
  let years = y - DOB_YEAR;
  // If birthday hasn't occurred yet this calendar year, subtract 1
  if (mo < DOB_MONTH || (mo === DOB_MONTH && d < DOB_DAY)) {
    years--;
  }

  // Last birthday timestamp in UTC (adjust for IST midnight = UTC 18:30 prev day)
  const lastBdayUTC = Date.UTC(
    DOB_MONTH > mo || (mo === DOB_MONTH && d < DOB_DAY)
      ? y - 1          // birthday not yet this year — use last year
      : y,
    DOB_MONTH,
    DOB_DAY
  ) - IST_OFFSET_MS;  // IST midnight → UTC

  const diffMs = Date.now() - lastBdayUTC;

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
  const now = nowIST();
  const { years, days, hours, minutes, seconds } = calcAge(now);

  setEl('age-years',   String(years));
  setEl('age-days',    String(days).padStart(3, '0'));
  setEl('age-hours',   String(hours).padStart(2, '0'));
  setEl('age-minutes', String(minutes).padStart(2, '0'));
  setEl('age-seconds', String(seconds).padStart(2, '0'));
}

function setEl(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

// ── INIT ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  updateClock();
  updateAgeTimer();
  setInterval(updateClock, 1000);
  setInterval(updateAgeTimer, 1000);

  // Highlight active nav link
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });
});
