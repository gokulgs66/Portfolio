

// === Universal Slider Script ===
(function () {
  const sliders = document.querySelectorAll('.slider');
  if (!sliders.length) return;

  sliders.forEach((slider) => {
    const slidesWrap = slider.querySelector('.slides');
    const slides = Array.from(slidesWrap.children);
    const prevBtn = slider.querySelector('.prev');
    const nextBtn = slider.querySelector('.next');
    const dotsWrap = slider.querySelector('.dots');

    let index = 0;
    let autoplay = true;
    let intervalMs = 3000;
    let timer = null;

    function buildDots() {
      dotsWrap.innerHTML = '';
      slides.forEach((_, i) => {
        const d = document.createElement('button');
        d.className = 'dot';
        d.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(d);
      });
      updateDots();
    }

    function updateDots() {
      const dots = Array.from(dotsWrap.children);
      dots.forEach((d, i) => d.classList.toggle('active', i === index));
    }

    function update() {
      const width = slider.clientWidth;
      slidesWrap.style.transform = `translateX(-${index * width}px)`;
      updateDots();
    }

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      update();
      resetTimer();
    }

    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    function startTimer() {
      if (!autoplay) return;
      timer = setInterval(next, intervalMs);
    }
    function stopTimer() {
      if (timer) { clearInterval(timer); timer = null; }
    }
    function resetTimer() { stopTimer(); startTimer(); }

    // Button handlers
    nextBtn.addEventListener('click', () => next());
    prevBtn.addEventListener('click', () => prev());

    // Resize responsiveness
    function resizeSlides() {
      const width = slider.clientWidth;
      slides.forEach(s => s.style.minWidth = width + 'px');
      update();
    }
    window.addEventListener('resize', resizeSlides);

    // Slide click opens link
    slides.forEach(sl => {
      sl.addEventListener('click', (e) => {
        const link = sl.querySelector('.link-btn');
        if (link && e.target !== link) {
          const href = link.getAttribute('href');
          if (href && href !== '#') window.open(href, '_blank');
        }
      });
    });

    // Pause on hover
    slider.addEventListener('mouseenter', stopTimer);
    slider.addEventListener('mouseleave', startTimer);

    // Touch swipe (mobile)
    let startX = 0;
    slider.addEventListener('touchstart', e => startX = e.touches[0].clientX);
    slider.addEventListener('touchend', e => {
      const diff = e.changedTouches[0].clientX - startX;
      if (Math.abs(diff) > 50) diff > 0 ? prev() : next();
    });

    // Initialize
    buildDots();
    resizeSlides();
    startTimer();
  });
})();




