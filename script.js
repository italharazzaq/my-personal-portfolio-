'use strict';

/* ---------- Dark mode: OS preference + manual toggle, saved in localStorage ---------- */
const root = document.documentElement;
const toggle = document.getElementById('theme-toggle');

function systemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  toggle.setAttribute('aria-pressed', String(theme === 'dark'));
  toggle.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
}
let saved = null;
try { saved = localStorage.getItem('theme'); } catch (e) { /* storage blocked */ }
applyTheme(saved || systemTheme());

toggle.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  try { localStorage.setItem('theme', next); } catch (e) { /* ignore */ }
});

/* ---------- Projects: data, safe rendering, combined search + filter ---------- */
const projects = [
  { id: 1, title: 'Personal Blog', description: 'A static blog with a clean reading layout.', tech: ['HTML', 'CSS'], year: 2025, link: 'https://github.com/your-username/blog' },
  { id: 2, title: 'Todo App', description: 'Add, complete and delete tasks with saved state.', tech: ['JavaScript', 'HTML'], year: 2025, link: 'https://github.com/your-username/todo' },
  { id: 3, title: 'Weather Dashboard', description: 'Shows a forecast using a public weather API.', tech: ['JavaScript', 'API'], year: 2026, link: 'https://github.com/your-username/weather' },
  { id: 4, title: 'Landing Page Clone', description: 'A pixel-careful responsive marketing page.', tech: ['HTML', 'CSS'], year: 2024, link: 'https://github.com/your-username/landing' },
  { id: 5, title: 'Quiz Game', description: 'Timed multiple-choice quiz with a score screen.', tech: ['JavaScript', 'CSS'], year: 2026, link: 'https://github.com/your-username/quiz' },
  { id: 6, title: 'Recipe Finder', description: 'Search recipes by ingredient and save favourites.', tech: ['JavaScript', 'API', 'CSS'], year: 2026, link: 'https://github.com/your-username/recipes' }
];

const grid = document.getElementById('project-grid');
if (grid) {
  const search = document.getElementById('search');
  const filter = document.getElementById('tech-filter');
  const count = document.getElementById('result-count');
  const empty = document.getElementById('empty-state');

  // Fill the technology dropdown from the data
  [...new Set(projects.flatMap(p => p.tech))].sort().forEach(t => {
    const opt = document.createElement('option');
    opt.value = t;
    opt.textContent = t;
    filter.appendChild(opt);
  });

  function makeCard(p) {
    const li = document.createElement('li');
    const card = document.createElement('article');
    card.className = 'card';

    const h3 = document.createElement('h3');
    h3.textContent = p.title;

    const desc = document.createElement('p');
    desc.textContent = p.description;

    const tags = document.createElement('div');
    tags.className = 'tags';
    p.tech.forEach(t => {
      const span = document.createElement('span');
      span.className = 'tag';
      span.textContent = t;
      tags.appendChild(span);
    });

    const year = document.createElement('p');
    year.className = 'year';
    year.textContent = String(p.year);

    const a = document.createElement('a');
    a.href = p.link;
    a.textContent = 'View on GitHub';
    a.setAttribute('aria-label', 'View ' + p.title + ' on GitHub');

    card.append(h3, desc, tags, year, a);
    li.appendChild(card);
    return li;
  }

  function render() {
    const q = search.value.trim().toLowerCase();
    const tech = filter.value;
    const result = projects.filter(p => {
      const matchesText = p.title.toLowerCase().includes(q) || p.tech.some(t => t.toLowerCase().includes(q));
      const matchesTech = !tech || p.tech.includes(tech);
      return matchesText && matchesTech; // both filters must pass
    });
    grid.replaceChildren(...result.map(makeCard));
    empty.hidden = result.length > 0;
    count.textContent = result.length + (result.length === 1 ? ' project' : ' projects') + ' shown';
  }

  search.addEventListener('input', render);
  filter.addEventListener('change', render);
  render();
}

/* ---------- Contact form validation ---------- */
const form = document.getElementById('contact-form');
if (form) {
  const success = document.getElementById('form-success');

  function setError(input, msg) {
    document.getElementById(input.id + '-error').textContent = msg;
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    return !msg;
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    success.textContent = '';
    const name = form.elements.name, email = form.elements.email, message = form.elements.message, consent = form.elements.consent;

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    const results = [
      setError(name, name.value.trim().length >= 3 ? '' : 'Enter a name with at least 3 characters.'),
      setError(email, emailOk ? '' : 'Enter a valid email, like name@example.com.'),
      setError(message, message.value.trim().length >= 20 ? '' : 'Write a message of at least 20 characters.'),
      setError(consent, consent.checked ? '' : 'Tick the box to agree to be contacted.')
    ];

    if (results.every(Boolean)) {
      success.textContent = 'Thanks! Your message was sent.';
      form.reset();
    } else {
      form.querySelector('[aria-invalid="true"]').focus();
    }
  });
}
