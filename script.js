(() => {
  const slides = document.querySelectorAll('.slide');
  const currentNumEl = document.getElementById('currentNum');
  const progressFill = document.getElementById('progressFill');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsContainer = document.getElementById('timelineDots');

  const TOTAL = slides.length;
  const AUTO_DELAY = 6000;
  const PROGRESS_INTERVAL = 50;

  const YEARS = ['2009', '2010', '2012', '2014', '2016', '2023', '2024'];

  let current = 0;
  let progressValue = 0;
  let progressTimer = null;
  let autoTimer = null;
  let isAnimating = false;

  // ── Build timeline dots ──
  YEARS.forEach((year, i) => {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('data-year', year);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function getDots() {
    return dotsContainer.querySelectorAll('.dot');
  }

  // ── Go to slide ──
  function goTo(index) {
    if (isAnimating || index === current) return;
    isAnimating = true;

    slides[current].classList.remove('active');
    getDots()[current].classList.remove('active');

    current = (index + TOTAL) % TOTAL;

    slides[current].classList.add('active');
    getDots()[current].classList.add('active');

    updateCounter();
    resetProgress();

    setTimeout(() => { isAnimating = false; }, 900);
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  // ── Counter ──
  function updateCounter() {
    const num = String(current + 1).padStart(2, '0');
    currentNumEl.style.opacity = '0';
    setTimeout(() => {
      currentNumEl.textContent = num;
      currentNumEl.style.opacity = '1';
    }, 200);
  }

  // ── Progress ──
  function resetProgress() {
    clearInterval(progressTimer);
    clearTimeout(autoTimer);
    progressValue = 0;
    progressFill.style.width = '0%';
    startProgress();
  }

  function startProgress() {
    const step = (PROGRESS_INTERVAL / AUTO_DELAY) * 100;

    progressTimer = setInterval(() => {
      progressValue += step;
      if (progressValue >= 100) {
        progressValue = 100;
        progressFill.style.width = '100%';
        clearInterval(progressTimer);
      } else {
        progressFill.style.width = progressValue + '%';
      }
    }, PROGRESS_INTERVAL);

    autoTimer = setTimeout(() => next(), AUTO_DELAY);
  }

  // ── Events ──
  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next();
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prev();
  });

  // Touch swipe
  let touchStartX = 0;
  document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) dx < 0 ? next() : prev();
  }, { passive: true });

  // ── Init ──
  slides[current].classList.add('active');
  updateCounter();
  startProgress();

})();
