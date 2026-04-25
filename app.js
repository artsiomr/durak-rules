// ===== Theme toggle =====
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const themeLabel = document.getElementById('themeLabel');

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  const isLight = theme === 'light';
  themeIcon.textContent  = isLight ? '🌙' : '☀️';
  themeLabel.textContent = isLight ? 'Тёмная' : 'Светлая';
  localStorage.setItem('theme', theme);
}

// On load: use stored preference or fall back to system
const stored = localStorage.getItem('theme');
applyTheme(stored || getSystemTheme());

themeToggle.addEventListener('click', () => {
  const current = root.getAttribute('data-theme') || getSystemTheme();
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

// Follow system changes if user hasn't picked manually
window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
  if (!localStorage.getItem('theme')) {
    applyTheme(e.matches ? 'light' : 'dark');
  }
});

// ===== Scroll-in animation for sections =====
const sections = document.querySelectorAll('.card-section');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08 }
);
sections.forEach((s) => observer.observe(s));

// ===== Active nav link highlight =====
const navLinks = document.querySelectorAll('#toc a[href^="#"]');
const sectionEls = Array.from(navLinks)
  .map((a) => document.querySelector(a.getAttribute('href')))
  .filter(Boolean);

function updateActiveLink() {
  let current = null;
  sectionEls.forEach((el) => {
    if (el.getBoundingClientRect().top <= 100) current = el;
  });
  navLinks.forEach((a) => {
    a.classList.toggle(
      'active',
      current && a.getAttribute('href') === '#' + current.id
    );
  });
}
window.addEventListener('scroll', updateActiveLink, { passive: true });
updateActiveLink();

// ===== Back-to-top button =====
const topBtn = document.getElementById('topBtn');
window.addEventListener('scroll', () => {
  topBtn.classList.toggle('visible', window.scrollY > 300);
}, { passive: true });
topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
