(function () {
  const sliders = document.querySelectorAll(".slider");
  if (!sliders.length) return;

  sliders.forEach((slider) => {
    const slidesWrap = slider.querySelector(".slides");
    const slides = Array.from(slidesWrap.children);
    const prevBtn = slider.querySelector(".prev");
    const nextBtn = slider.querySelector(".next");
    const dotsWrap = slider.querySelector(".dots");

    let index = 0;
    let autoplay = true;
    let intervalMs = 3500;
    let timer = null;

    function buildDots() {
      dotsWrap.innerHTML = "";
      for (let i = 0; i < Math.ceil(slides.length / 2); i++) {
        const dot = document.createElement("button");
        dot.className = "dot";
        dot.addEventListener("click", () => goTo(i * 2));
        dotsWrap.appendChild(dot);
      }
      updateDots();
    }

    function updateDots() {
      const dots = Array.from(dotsWrap.children);
      dots.forEach((d, i) =>
        d.classList.toggle("active", i === Math.floor(index / 2))
      );
    }

    function update() {
      const width = slider.clientWidth;
      slidesWrap.style.transform = `translateX(-${index * (width / 2)}px)`;
      updateDots();
    }

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      if (index % 2 !== 0) index--; // align in pairs
      update();
      resetTimer();
    }

    function next() {
      index = (index + 2) % slides.length;
      update();
      resetTimer();
    }

    function prev() {
      index = (index - 2 + slides.length) % slides.length;
      update();
      resetTimer();
    }

    function startTimer() {
      if (!autoplay) return;
      timer = setInterval(next, intervalMs);
    }

    function stopTimer() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    function resetTimer() {
      stopTimer();
      startTimer();
    }

    // Event listeners
    nextBtn.addEventListener("click", next);
    prevBtn.addEventListener("click", prev);

    // Responsive resize
    window.addEventListener("resize", update);

    // Pause on hover
    slider.addEventListener("mouseenter", stopTimer);
    slider.addEventListener("mouseleave", startTimer);

    // Touch swipe
    let startX = 0;
    slider.addEventListener("touchstart", (e) => (startX = e.touches[0].clientX));
    slider.addEventListener("touchend", (e) => {
      const diff = e.changedTouches[0].clientX - startX;
      if (Math.abs(diff) > 50) diff > 0 ? prev() : next();
    });

    // Initialize
    buildDots();
    update();
    startTimer();
  });
})();
