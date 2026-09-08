const GITHUB_USERNAME = 'Cerhovah';
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos`;
const FORM_ENDPOINT = 'YOUR_FORMSPREE_ENDPOINT';

const NAV_SCROLL_THRESHOLD = 60;
const SCROLL_TOP_THRESHOLD = 300;
const OBSERVER_THRESHOLD = 0.2;
const TYPING_START_DELAY = 320;
const TYPING_INTERVAL = 42;
const THEME_STORAGE_KEY = 'portfolio-theme';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const STATE = {
  theme: 'light',
  menuOpen: false,
  projects: {
    status: 'idle',
    items: [],
    selectedLanguage: 'All',
    error: null,
  },
  form: {
    values: {
      name: '',
      email: '',
      message: '',
    },
    errors: {
      name: '',
      email: '',
      message: '',
    },
    submitting: false,
    submitStatus: 'idle',
  },
};

const DOM = {
  root: document.documentElement,
  header: document.querySelector('#site-header'),
  themeToggle: document.querySelector('#theme-toggle'),
  hamburger: document.querySelector('#hamburger'),
  navMenu: document.querySelector('#nav-menu'),
  smoothLinks: document.querySelectorAll('.smooth-link'),
  scrollTop: document.querySelector('#scroll-top'),
  typingTarget: document.querySelector('#typing-target'),
  revealTargets: document.querySelectorAll('.reveal'),
  projectFilters: document.querySelector('#project-filters'),
  projectStatus: document.querySelector('#projects-status'),
  projectsGrid: document.querySelector('#projects-grid'),
  contactForm: document.querySelector('#contact-form'),
  formSubmit: document.querySelector('#form-submit'),
  formStatus: document.querySelector('#form-status'),
  currentYear: document.querySelector('#current-year'),
};

const FORM_FIELDS = {
  name: {
    input: document.querySelector('#name'),
    error: document.querySelector('#name-error'),
  },
  email: {
    input: document.querySelector('#email'),
    error: document.querySelector('#email-error'),
  },
  message: {
    input: document.querySelector('#message'),
    error: document.querySelector('#message-error'),
  },
};

const getInitialTheme = () => {
  try {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
  } catch (error) {
    console.warn('Theme preference could not be read.', error);
  }

  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
};

const applyTheme = () => {
  const isDark = STATE.theme === 'dark';
  DOM.root.setAttribute('data-theme', STATE.theme);
  DOM.themeToggle.setAttribute('aria-pressed', String(isDark));
  DOM.themeToggle.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} theme`);

  const themeColor = isDark ? '#111815' : '#f4f0e8';
  document.querySelector('meta[name="theme-color"]').setAttribute('content', themeColor);
};

const saveTheme = () => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, STATE.theme);
  } catch (error) {
    console.warn('Theme preference could not be saved.', error);
  }
};

const toggleTheme = () => {
  STATE.theme = STATE.theme === 'light' ? 'dark' : 'light';
  applyTheme();
  saveTheme();
};

const renderMenu = () => {
  DOM.navMenu.classList.toggle('active', STATE.menuOpen);
  DOM.hamburger.classList.toggle('active', STATE.menuOpen);
  DOM.hamburger.setAttribute('aria-expanded', String(STATE.menuOpen));
  DOM.hamburger.setAttribute('aria-label', STATE.menuOpen ? 'Close navigation menu' : 'Open navigation menu');
};

const closeMenu = () => {
  STATE.menuOpen = false;
  renderMenu();
};

const handleSmoothScroll = (event) => {
  const targetId = event.currentTarget.getAttribute('href');
  const target = document.querySelector(targetId);

  if (!target) {
    return;
  }

  event.preventDefault();
  target.scrollIntoView({ behavior: 'smooth' });
  closeMenu();
};

const handleScroll = () => {
  if (window.scrollY >= NAV_SCROLL_THRESHOLD) {
    DOM.header.classList.add('scrolled');
  } else {
    DOM.header.classList.remove('scrolled');
  }

  if (window.scrollY >= SCROLL_TOP_THRESHOLD) {
    DOM.scrollTop.classList.add('visible');
  } else {
    DOM.scrollTop.classList.remove('visible');
  }
};

const initScrollReveal = () => {
  if (!('IntersectionObserver' in window)) {
    DOM.revealTargets.forEach((target) => target.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('reveal-pending');
          entry.target.classList.add('is-revealed');
          currentObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: OBSERVER_THRESHOLD },
  );

  DOM.revealTargets.forEach((target) => {
    target.classList.add('reveal-pending');
    observer.observe(target);
  });
};

const startTypingEffect = () => {
  const sentence = DOM.typingTarget.textContent.trim();
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reducedMotion || !sentence) {
    return;
  }

  window.setTimeout(() => {
    let characterIndex = 0;
    DOM.typingTarget.textContent = '';
    DOM.typingTarget.classList.add('is-typing');

    const typingTimer = window.setInterval(() => {
      characterIndex += 1;
      DOM.typingTarget.textContent = sentence.slice(0, characterIndex);

      if (characterIndex >= sentence.length) {
        window.clearInterval(typingTimer);
        DOM.typingTarget.classList.remove('is-typing');
      }
    }, TYPING_INTERVAL);
  }, TYPING_START_DELAY);
};

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const setProjectStatus = (message) => {
  DOM.projectStatus.textContent = message;
};

const renderProjectFilters = () => {
  const languages = [
    'All',
    ...new Set(
      STATE.projects.items
        .map(({ language }) => language)
        .filter((language) => Boolean(language)),
    ),
  ];

  languages.sort((first, second) => {
    if (first === 'All') return -1;
    if (second === 'All') return 1;
    return first.localeCompare(second);
  });

  DOM.projectFilters.innerHTML = languages
    .map(
      (language) => `
        <button
          class="filter-button${STATE.projects.selectedLanguage === language ? ' active' : ''}"
          type="button"
          data-language="${escapeHtml(language)}"
          aria-pressed="${STATE.projects.selectedLanguage === language}"
        >
          ${escapeHtml(language)}
        </button>
      `,
    )
    .join('');

  DOM.projectFilters.querySelectorAll('.filter-button').forEach((button) => {
    button.addEventListener('click', () => {
      STATE.projects.selectedLanguage = button.dataset.language;
      renderProjects();
    });
  });
};

const renderProjects = () => {
  const { status, items, selectedLanguage, error } = STATE.projects;
  DOM.projectsGrid.innerHTML = '';

  if (status === 'idle') {
    setProjectStatus('');
    return;
  }

  if (status === 'loading') {
    DOM.projectFilters.innerHTML = '';
    setProjectStatus('로딩 중...');
    return;
  }

  if (status === 'error') {
    DOM.projectFilters.innerHTML = '';
    setProjectStatus('');

    const message = document.createElement('p');
    message.textContent =
      error?.status === 403
        ? '프로젝트를 불러올 수 없습니다. GitHub API 요청 한도에 도달했을 수 있습니다.'
        : '프로젝트를 불러올 수 없습니다.';

    const retryButton = document.createElement('button');
    retryButton.className = 'retry-button';
    retryButton.type = 'button';
    retryButton.textContent = '다시 시도';
    retryButton.addEventListener('click', fetchProjects);

    DOM.projectStatus.append(message, retryButton);
    return;
  }

  if (status === 'empty') {
    DOM.projectFilters.innerHTML = '';
    setProjectStatus('표시할 프로젝트가 없습니다.');
    return;
  }

  renderProjectFilters();

  const filteredItems =
    selectedLanguage === 'All'
      ? items
      : items.filter(({ language }) => language === selectedLanguage);

  if (filteredItems.length === 0) {
    setProjectStatus('이 필터에 해당하는 프로젝트가 없습니다.');
    return;
  }

  setProjectStatus('');
  DOM.projectsGrid.innerHTML = filteredItems
    .map((repository) => {
      const {
        name,
        description,
        html_url: repositoryUrl,
        language,
        stargazers_count: stars,
      } = repository;

      return `
        <article class="project-card repository-card">
          <div class="repo-card-header">
            <h3>${escapeHtml(name)}</h3>
            <span class="repo-stars" aria-label="${stars} stars">★ ${stars}</span>
          </div>
          <p class="repo-description">${escapeHtml(description || '설명이 없습니다.')}</p>
          <div class="repo-footer">
            <span class="repo-language">${escapeHtml(language || 'Not specified')}</span>
            <a
              class="repo-link"
              href="${escapeHtml(repositoryUrl)}"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open ${escapeHtml(name)} repository"
            >
              Repository <span aria-hidden="true">↗</span>
            </a>
          </div>
        </article>
      `;
    })
    .join('');
};

async function fetchProjects() {
  STATE.projects.status = 'loading';
  STATE.projects.error = null;
  renderProjects();

  try {
    const response = await fetch(GITHUB_API_URL, {
      headers: {
        Accept: 'application/vnd.github+json',
      },
    });

    if (!response.ok) {
      const requestError = new Error(`GitHub API request failed with ${response.status}`);
      requestError.status = response.status;
      throw requestError;
    }

    const repositories = await response.json();
    STATE.projects.items = repositories;
    STATE.projects.selectedLanguage = 'All';
    STATE.projects.status = repositories.length > 0 ? 'success' : 'empty';
  } catch (error) {
    STATE.projects.items = [];
    STATE.projects.status = 'error';
    STATE.projects.error = error;
  }

  renderProjects();
}

const validateField = (fieldName) => {
  const value = STATE.form.values[fieldName].trim();
  let errorMessage = '';

  if (fieldName === 'name' && !value) {
    errorMessage = '이름을 입력해 주세요.';
  }

  if (fieldName === 'email') {
    if (!value) {
      errorMessage = '이메일을 입력해 주세요.';
    } else if (!EMAIL_PATTERN.test(value)) {
      errorMessage = '올바른 이메일 형식을 입력해 주세요.';
    }
  }

  if (fieldName === 'message' && !value) {
    errorMessage = '메시지를 입력해 주세요.';
  }

  STATE.form.errors[fieldName] = errorMessage;
  return !errorMessage;
};

const renderFieldError = (fieldName) => {
  const { input, error } = FORM_FIELDS[fieldName];
  const message = STATE.form.errors[fieldName];
  const fieldWrapper = input.closest('.form-field');

  error.textContent = message;
  input.setAttribute('aria-invalid', String(Boolean(message)));

  if (message) {
    fieldWrapper.classList.add('has-error');
  } else {
    fieldWrapper.classList.remove('has-error');
  }
};

const renderFormStatus = () => {
  const messages = {
    idle: '',
    success: '메시지가 성공적으로 전송되었습니다.',
    error: '메시지를 전송하지 못했습니다. 다시 시도해 주세요.',
    configuration: '입력값 검증에 성공했습니다. 실제 전송을 위해 Formspree endpoint 설정이 필요합니다.',
  };

  DOM.formStatus.textContent = messages[STATE.form.submitStatus];
  DOM.formStatus.classList.toggle('is-error', STATE.form.submitStatus === 'error');
  DOM.formSubmit.disabled = STATE.form.submitting;
  DOM.formSubmit.firstChild.textContent = STATE.form.submitting ? 'Sending ' : 'Send message ';
};

const handleFieldInput = (event) => {
  const { name, value } = event.currentTarget;
  STATE.form.values[name] = value;
  STATE.form.submitStatus = 'idle';
  validateField(name);
  renderFieldError(name);
  renderFormStatus();
};

const validateForm = () => {
  const fieldNames = Object.keys(FORM_FIELDS);
  const validFields = fieldNames.map((fieldName) => {
    const isValid = validateField(fieldName);
    renderFieldError(fieldName);
    return isValid;
  });

  return validFields.every(Boolean);
};

const resetFormState = () => {
  STATE.form.values = { name: '', email: '', message: '' };
  STATE.form.errors = { name: '', email: '', message: '' };
  Object.keys(FORM_FIELDS).forEach(renderFieldError);
};

const handleFormSubmit = async (event) => {
  event.preventDefault();

  if (!validateForm()) {
    STATE.form.submitStatus = 'idle';
    renderFormStatus();

    const firstInvalidField = Object.keys(FORM_FIELDS).find(
      (fieldName) => STATE.form.errors[fieldName],
    );
    FORM_FIELDS[firstInvalidField].input.focus();
    return;
  }

  if (FORM_ENDPOINT === 'YOUR_FORMSPREE_ENDPOINT') {
    STATE.form.submitStatus = 'configuration';
    renderFormStatus();
    return;
  }

  STATE.form.submitting = true;
  STATE.form.submitStatus = 'idle';
  renderFormStatus();

  try {
    const response = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      body: new FormData(DOM.contactForm),
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Form submission failed with ${response.status}`);
    }

    DOM.contactForm.reset();
    resetFormState();
    STATE.form.submitStatus = 'success';
  } catch (error) {
    console.error('Contact form submission failed.', error);
    STATE.form.submitStatus = 'error';
  } finally {
    STATE.form.submitting = false;
    renderFormStatus();
  }
};

const initEvents = () => {
  DOM.themeToggle.addEventListener('click', toggleTheme);

  DOM.hamburger.addEventListener('click', () => {
    STATE.menuOpen = !STATE.menuOpen;
    renderMenu();
  });

  DOM.smoothLinks.forEach((link) => {
    link.addEventListener('click', handleSmoothScroll);
  });

  window.addEventListener('scroll', handleScroll, { passive: true });
  DOM.scrollTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });

  Object.values(FORM_FIELDS).forEach(({ input }) => {
    input.addEventListener('input', handleFieldInput);
  });

  DOM.contactForm.addEventListener('submit', handleFormSubmit);
};

const init = () => {
  STATE.theme = getInitialTheme();
  applyTheme();
  renderMenu();
  renderProjects();
  initEvents();
  handleScroll();
  initScrollReveal();
  startTypingEffect();
  fetchProjects();
  DOM.currentYear.textContent = String(new Date().getFullYear());
};

init();
