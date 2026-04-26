/* ===========================
   MUSIK — main.js
   =========================== */

/* ───────────────────────────
   COUNTDOWN TIMER
─────────────────────────── */
const TARGET = new Date(Date.now() + (22 * 86400 + 13 * 3600 + 46 * 60 + 18) * 1000);

function tick() {
  const dif = TARGET - Date.now();
  if (dif <= 0) return;
  document.getElementById('d').textContent = String(Math.floor(dif / 86400000)).padStart(2, '0');
  document.getElementById('h').textContent = String(Math.floor(dif % 86400000 / 3600000)).padStart(2, '0');
  document.getElementById('m').textContent = String(Math.floor(dif % 3600000 / 60000)).padStart(2, '0');
  document.getElementById('s').textContent = String(Math.floor(dif % 60000 / 1000)).padStart(2, '0');
}
setInterval(tick, 1000);
tick();

/* ───────────────────────────
   REVIEWS SLIDER
─────────────────────────── */
const REVIEWS = [
  {
    n: 'Alex Bose',
    r: 'Fan muzică, București',
    i: 'https://i.pravatar.cc/150?img=32',
    t: 'O experiență absolut extraordinară! Am participat la ediția din 2025 și a depășit orice așteptări. Organizare impecabilă, artiști de top și o atmosferă care te face să uiți de orice grijă. Deja mi-am luat bilete pentru 2026!'
  },
  {
    n: 'Maria Ionescu',
    r: 'Blogger cultural, Cluj',
    i: 'https://i.pravatar.cc/150?img=44',
    t: 'Musik este cel mai bine organizat festival din România. Fiecare detaliu a fost gândit pentru confortul participanților. Artiștii internaționali au fost o surpriză uriașă — nu mă așteptam la un nivel atât de înalt!'
  },
  {
    n: 'Daniel Pop',
    r: 'Muzician, Iași',
    i: 'https://i.pravatar.cc/150?img=11',
    t: 'Ca artist, am participat atât ca performer cât și ca spectator. Nivelul tehnic și profesionalismul echipei Musik nu au egal în industrie. Recomandat cu căldură oricui iubește muzica adevărată.'
  }
];

let reviewIndex = 0;

function chR(direction) {
  reviewIndex = (reviewIndex + direction + REVIEWS.length) % REVIEWS.length;
  const r = REVIEWS[reviewIndex];
  document.getElementById('rav').src = r.i;
  document.getElementById('rnm').textContent = r.n;
  document.getElementById('rrl').textContent = r.r;
  document.getElementById('rtx').textContent = r.t;
  document.querySelectorAll('.rdot').forEach((dot, i) => dot.classList.toggle('on', i === reviewIndex));
}

// Dot click navigation
document.querySelectorAll('.rdot').forEach((dot, i) => {
  dot.addEventListener('click', () => {
    reviewIndex = i - 1;
    chR(1);
  });
});

// Auto-advance every 5 seconds
setInterval(() => chR(1), 5000);

/* ───────────────────────────
   SCROLL REVEAL
─────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('in');
  }),
  { threshold: 0.1 }
);
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ───────────────────────────
   CATEGORY CARDS
─────────────────────────── */
document.querySelectorAll('.ccard').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.ccard').forEach(c => c.classList.remove('active'));
    card.classList.add('active');
  });
});

/* ───────────────────────────
   CONTACT FORM — localStorage + feedback vizual
─────────────────────────── */

// Câmpurile formularului cu cheile lor din localStorage
const FORM_FIELDS = [
  { id: 'f-prenume',  key: 'musik_prenume' },
  { id: 'f-nume',     key: 'musik_nume'    },
  { id: 'f-email',    key: 'musik_email'   },
  { id: 'f-telefon',  key: 'musik_telefon' },
  { id: 'f-subiect',  key: 'musik_subiect' },
];

// ── Salvează datele în localStorage la fiecare input ──
function saveFormData() {
  FORM_FIELDS.forEach(({ id, key }) => {
    const el = document.getElementById(id);
    if (el) localStorage.setItem(key, el.value);
  });
  // Actualizează indicatorul vizual
  const ind = document.getElementById('save-indicator');
  const txt = document.getElementById('save-text');
  if (ind && txt) {
    ind.classList.add('active');
    txt.textContent = '✓ Date salvate automat';
    clearTimeout(window._saveTimeout);
    window._saveTimeout = setTimeout(() => {
      ind.classList.remove('active');
      txt.textContent = 'Date salvate în browser';
    }, 1800);
  }
}

// ── Încarcă datele salvate la deschiderea paginii ──
function loadFormData() {
  FORM_FIELDS.forEach(({ id, key }) => {
    const el = document.getElementById(id);
    const saved = localStorage.getItem(key);
    if (el && saved) {
      el.value = saved;
      el.classList.add('has-value'); // feedback vizual
    }
  });
}

// ── Validare simplă câmp ──
function validateField(el) {
  const val = el.value.trim();
  if (val === '') {
    el.classList.remove('valid');
    el.classList.add('invalid');
    return false;
  }
  if (el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
    el.classList.remove('valid');
    el.classList.add('invalid');
    return false;
  }
  el.classList.remove('invalid');
  el.classList.add('valid');
  return true;
}

// ── Atașează evenimentele pe câmpuri ──
function initForm() {
  loadFormData();

  FORM_FIELDS.forEach(({ id }) => {
    const el = document.getElementById(id);
    if (!el) return;

    // Salvare la fiecare tastă
    el.addEventListener('input', () => {
      saveFormData();
      validateField(el);
      el.classList.toggle('has-value', el.value.trim() !== '');
    });

    // Validare la blur (când iese din câmp)
    el.addEventListener('blur', () => validateField(el));

    // Focus: adaugă clasa focused
    el.addEventListener('focus', () => el.classList.add('focused'));
    el.addEventListener('blur',  () => el.classList.remove('focused'));
  });
}

// ── Submit formular ──
function subForm(btn) {
  // Validează toate câmpurile
  let allValid = true;
  FORM_FIELDS.forEach(({ id }) => {
    const el = document.getElementById(id);
    if (el && !validateField(el)) allValid = false;
  });

  if (!allValid) {
    btn.classList.add('shake');
    setTimeout(() => btn.classList.remove('shake'), 500);
    return;
  }

  // Animație de trimitere
  btn.classList.add('sending');
  btn.textContent = 'Se trimite...';

  setTimeout(() => {
    btn.classList.remove('sending');
    btn.classList.add('sent');
    btn.textContent = '✓ Trimis cu succes!';

    // Șterge datele din localStorage după trimitere
    FORM_FIELDS.forEach(({ id, key }) => {
      localStorage.removeItem(key);
      const el = document.getElementById(id);
      if (el) {
        el.value = '';
        el.classList.remove('valid', 'invalid', 'has-value');
      }
    });

    setTimeout(() => {
      btn.classList.remove('sent');
      btn.textContent = 'Trimite Mesajul';
    }, 3000);
  }, 1200);
}

// Inițializează formularul
document.addEventListener('DOMContentLoaded', initForm);

/* ───────────────────────────
   SMOOTH NAV LINKS
─────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ───────────────────────────
   NAV ACTIVE STATE ON SCROLL
─────────────────────────── */
const sections = document.querySelectorAll('section[id], footer[id]');
const navLinks = document.querySelectorAll('.nav-ul a');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.style.color = 'white';
          }
        });
      }
    });
  },
  { threshold: 0.5 }
);
sections.forEach(sec => sectionObserver.observe(sec));

/* ===========================
   AUTH — Login & Sign Up
   localStorage + feedback vizual
   =========================== */

const LOGIN_FIELDS = [
  { id: 'l-name', key: 'musik_l_name' },
  { id: 'l-email', key: 'musik_l_email' },
  { id: 'l-phone', key: 'musik_l_phone' }
];

const SIGNUP_FIELDS = [
  { id: 's-name', key: 'musik_s_name' },
  { id: 's-email', key: 'musik_s_email' },
  { id: 's-phone', key: 'musik_s_phone' }
];

function switchTab(tab, clickedBtn) {
  document.querySelectorAll('.auth-tab').forEach(b => b.classList.remove('active'));
  if (clickedBtn) clickedBtn.classList.add('active');

  document.getElementById('tab-login').classList.toggle('hidden', tab !== 'login');
  document.getElementById('tab-signup').classList.toggle('hidden', tab !== 'signup');
  document.getElementById('tab-success').classList.add('hidden');
}

function togglePw(inputId, btn) {
  const inp = document.getElementById(inputId);
  if (!inp) return;

  const show = inp.type === 'password';
  inp.type = show ? 'text' : 'password';
  btn.textContent = show ? '🙈' : '👁';
}

function setInvalid(el) {
  el.classList.remove('valid');
  el.classList.add('invalid');
}

function setValid(el) {
  el.classList.remove('invalid');
  el.classList.add('valid');
}

function validateAuthField(el) {
  const val = el.value.trim();

  if (val === '') {
    setInvalid(el);
    return false;
  }

  if (el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
    setInvalid(el);
    return false;
  }

  if ((el.id === 'l-phone' || el.id === 's-phone') && !/^\d+$/.test(val)) {
    setInvalid(el);
    return false;
  }

  if ((el.id === 'l-pass' || el.id === 's-pass' || el.id === 's-pass2') && val.length < 8) {
    setInvalid(el);
    return false;
  }

  setValid(el);
  return true;
}

function saveAuthField(fieldKey, value, indicatorId, textId) {
  localStorage.setItem(fieldKey, value);

  const ind = document.getElementById(indicatorId);
  const txt = document.getElementById(textId);

  if (ind && txt) {
    ind.classList.add('active');
    txt.textContent = '✓ Date salvate automat';

    clearTimeout(window['_st_' + indicatorId]);

    window['_st_' + indicatorId] = setTimeout(() => {
      ind.classList.remove('active');
      txt.textContent = 'Date salvate în browser';
    }, 1800);
  }
}

function loadAuthData() {
  [...LOGIN_FIELDS, ...SIGNUP_FIELDS].forEach(({ id, key }) => {
    const el = document.getElementById(id);
    const saved = localStorage.getItem(key);

    if (el && saved) {
      el.value = saved;
      el.classList.add('has-value');
    }
  });
}

function initAuthFields(fields, indicatorId, textId) {
  fields.forEach(({ id, key }) => {
    const el = document.getElementById(id);
    if (!el) return;

    el.addEventListener('input', () => {
      saveAuthField(key, el.value, indicatorId, textId);
      validateAuthField(el);
      el.classList.toggle('has-value', el.value.trim() !== '');
    });

    el.addEventListener('blur', () => validateAuthField(el));
    el.addEventListener('focus', () => el.classList.add('focused'));
    el.addEventListener('blur', () => el.classList.remove('focused'));
  });
}

function saveUserToJson(user) {
  fetch("http://localhost:3000/save-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  })
  .then(res => res.json())
  .then(data => console.log(data.message))
  .catch(err => console.log("Serverul nu este pornit sau Node.js nu este instalat:", err));
}

function checkLoggedIn() {
  const user = JSON.parse(localStorage.getItem('musik_user') || 'null');

  if (user) {
    showSuccess(user.name, user.email, false);
  }
}

function showSuccess(name, email, animate = true) {
  document.getElementById('tab-login').classList.add('hidden');
  document.getElementById('tab-signup').classList.add('hidden');
  document.getElementById('tab-success').classList.remove('hidden');

  const title = document.getElementById('success-title');
  const msg = document.getElementById('success-msg');
  const tabs = document.querySelector('.auth-tabs');

  const existing = document.getElementById('user-badge');
  if (existing) existing.remove();

  const badge = document.createElement('div');
  badge.id = 'user-badge';
  badge.className = 'user-badge';

  badge.innerHTML = `
    <div class="user-avatar">${name.charAt(0).toUpperCase()}</div>
    <div>
      <div class="user-info-name">${name}</div>
      <div class="user-info-email">${email}</div>
    </div>
  `;

  document.getElementById('tab-success').insertBefore(
    badge,
    document.getElementById('tab-success').firstChild
  );

  title.textContent = animate ? 'Autentificat cu succes!' : 'Bine ai revenit!';
  msg.textContent = 'Bine ai venit în comunitatea Musik, ' + name + '!';

  if (tabs) tabs.style.display = 'none';
}

function handleLogin(btn) {
  const nameEl = document.getElementById('l-name');
  const emailEl = document.getElementById('l-email');
  const phoneEl = document.getElementById('l-phone');
  const passEl = document.getElementById('l-pass');

  let ok = true;

  [nameEl, emailEl, phoneEl, passEl].forEach(el => {
    if (!validateAuthField(el)) ok = false;
  });

  if (!ok) {
    btn.classList.add('shake');
    setTimeout(() => btn.classList.remove('shake'), 500);
    return;
  }

  const accounts = JSON.parse(localStorage.getItem('musik_accounts') || '[]');

  const found = accounts.find(a =>
    a.email === emailEl.value.trim() &&
    a.pass === passEl.value
  );

  if (!found && accounts.length > 0) {
    btn.classList.add('error');
    btn.textContent = '✗ Email sau parolă greșită';
    passEl.classList.add('invalid');

    setTimeout(() => {
      btn.classList.remove('error');
      btn.textContent = 'Login';
    }, 2000);

    return;
  }

  btn.classList.add('sending');
  btn.textContent = 'Se autentifică...';

  setTimeout(() => {
    const user = found || {
      name: nameEl.value.trim(),
      email: emailEl.value.trim(),
      phone: phoneEl.value.trim()
    };

    localStorage.setItem('musik_user', JSON.stringify(user));

    btn.classList.remove('sending');
    btn.classList.add('sent');
    btn.textContent = '✓ Succes!';

    setTimeout(() => showSuccess(user.name, user.email), 500);
  }, 1000);
}

function handleSignup(btn) {
  const nameEl = document.getElementById('s-name');
  const emailEl = document.getElementById('s-email');
  const phoneEl = document.getElementById('s-phone');
  const passEl = document.getElementById('s-pass');
  const pass2El = document.getElementById('s-pass2');

  let ok = true;

  [nameEl, emailEl, phoneEl, passEl, pass2El].forEach(el => {
    if (!validateAuthField(el)) ok = false;
  });

  if (passEl.value !== pass2El.value) {
    setInvalid(pass2El);

    btn.classList.add('shake');
    btn.classList.add('error');
    btn.textContent = '✗ Parolele nu coincid!';

    setTimeout(() => {
      btn.classList.remove('shake', 'error');
      btn.textContent = 'Creează Cont';
    }, 2000);

    return;
  }

  if (!ok) {
    btn.classList.add('shake');
    setTimeout(() => btn.classList.remove('shake'), 500);
    return;
  }

  btn.classList.add('sending');
  btn.textContent = 'Se creează contul...';

  setTimeout(() => {
    const user = {
      name: nameEl.value.trim(),
      email: emailEl.value.trim(),
      phone: phoneEl.value.trim(),
      pass: passEl.value
    };

    const accounts = JSON.parse(localStorage.getItem('musik_accounts') || '[]');
    accounts.push(user);

    localStorage.setItem('musik_accounts', JSON.stringify(accounts));
    localStorage.setItem('musik_user', JSON.stringify(user));

    saveUserToJson(user);

    [...SIGNUP_FIELDS, { id: 's-pass' }, { id: 's-pass2' }].forEach(({ id, key }) => {
      const el = document.getElementById(id);

      if (el) {
        el.value = '';
        el.classList.remove('valid', 'invalid', 'has-value');
      }

      if (key) {
        localStorage.removeItem(key);
      }
    });

    btn.classList.remove('sending');
    btn.classList.add('sent');
    btn.textContent = '✓ Cont creat!';

    setTimeout(() => showSuccess(user.name, user.email), 500);
  }, 1200);
}

function logout() {
  localStorage.removeItem('musik_user');

  const tabs = document.querySelector('.auth-tabs');
  if (tabs) tabs.style.display = 'flex';

  switchTab('login', document.querySelector('.auth-tab'));

  const badge = document.getElementById('user-badge');
  if (badge) badge.remove();

  document.getElementById('tab-success').classList.add('hidden');
  document.getElementById('tab-login').classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
  loadAuthData();
  initAuthFields(LOGIN_FIELDS, 'save-indicator-login', 'save-text-login');
  initAuthFields(SIGNUP_FIELDS, 'save-indicator-signup', 'save-text-signup');
  checkLoggedIn();
});

