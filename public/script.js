// Accordion service index (Expand on Hover & Click fallback)
document.querySelectorAll('.index-row').forEach((row) => {
  const head = row.querySelector('.index-head');
  const body = row.querySelector('.index-body');

  let isTouch = false;

  const openRow = () => {
    if (row.classList.contains('open')) return;

    // Close all other open rows
    document.querySelectorAll('.index-row.open').forEach((openRow) => {
      openRow.classList.remove('open');
      openRow.querySelector('.index-body').style.maxHeight = null;
      openRow.querySelector('.index-head').setAttribute('aria-expanded', 'false');
    });

    row.classList.add('open');
    body.style.maxHeight = body.scrollHeight + 'px';
    head.setAttribute('aria-expanded', 'true');
  };

  const closeRow = () => {
    if (!row.classList.contains('open')) return;
    row.classList.remove('open');
    body.style.maxHeight = null;
    head.setAttribute('aria-expanded', 'false');
  };

  // Track real touch interaction to prevent double-triggering simulated mouse events
  row.addEventListener('touchstart', () => {
    isTouch = true;
  }, { passive: true });

  // Hover triggers (only applies on real desktop mouse hover)
  row.addEventListener('mouseenter', () => {
    if (isTouch) return;
    openRow();
  });

  row.addEventListener('mouseleave', () => {
    if (isTouch) return;
    closeRow();
  });

  // Click fallback (mobile/touch toggle, or desktop clicks)
  head.addEventListener('click', () => {
    if (row.classList.contains('open')) {
      closeRow();
    } else {
      openRow();
    }
    // Reset touch flag after interaction completes
    setTimeout(() => { isTouch = false; }, 500);
  });
});

// Subtle scroll reveal
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document
  .querySelectorAll('.index-row, .how-text, .cta-link, .kicker, .testimonials-header, .testimonial-card')
  .forEach((el) => {
    el.classList.add('reveal-up');
    observer.observe(el);
  });

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// ── Testimonials Slider ──
(() => {
  const track = document.getElementById('review-track');
  const dotsContainer = document.getElementById('review-dots');
  const prevBtn = document.getElementById('btn-review-prev');
  const nextBtn = document.getElementById('btn-review-next');
  if (!track || !dotsContainer || !prevBtn || !nextBtn) return;

  const cards = Array.from(track.children);
  const gap = 32;
  let currentIndex = 0;
  let autoPlayTimer;

  // Determine how many cards to show per viewport
  const getPerView = () => {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  };

  const getMaxIndex = () => Math.max(0, cards.length - getPerView());

  const getOffset = (index) => {
    if (index === 0) return 0;
    const card = cards[0];
    const cardWidth = card.getBoundingClientRect().width;
    return -(index * (cardWidth + gap));
  };

  const updateDots = () => {
    const dots = dotsContainer.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  };

  const buildDots = () => {
    const maxIndex = getMaxIndex();
    dotsContainer.innerHTML = '';
    for (let i = 0; i <= maxIndex; i++) {
      const dot = document.createElement('span');
      dot.className = 'dot' + (i === currentIndex ? ' active' : '');
      dot.dataset.index = i;
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  };

  const goTo = (index) => {
    const maxIndex = getMaxIndex();
    currentIndex = Math.max(0, Math.min(index, maxIndex));
    track.style.transform = `translateX(${getOffset(currentIndex)}px)`;
    updateDots();
  };

  const next = () => goTo(currentIndex >= getMaxIndex() ? 0 : currentIndex + 1);
  const prev = () => goTo(currentIndex <= 0 ? getMaxIndex() : currentIndex - 1);

  prevBtn.addEventListener('click', () => { prev(); resetAutoPlay(); });
  nextBtn.addEventListener('click', () => { next(); resetAutoPlay(); });

  // Auto-play
  const startAutoPlay = () => { autoPlayTimer = setInterval(next, 5000); };
  const stopAutoPlay = () => clearInterval(autoPlayTimer);
  const resetAutoPlay = () => { stopAutoPlay(); startAutoPlay(); };

  const section = document.querySelector('.testimonials');
  if (section) {
    section.addEventListener('mouseenter', stopAutoPlay);
    section.addEventListener('mouseleave', startAutoPlay);
  }

  // Touch / swipe support
  let touchStartX = 0;
  let touchDelta = 0;
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchDelta = 0;
    stopAutoPlay();
  }, { passive: true });

  track.addEventListener('touchmove', (e) => {
    touchDelta = e.touches[0].clientX - touchStartX;
  }, { passive: true });

  track.addEventListener('touchend', () => {
    if (Math.abs(touchDelta) > 50) {
      touchDelta < 0 ? next() : prev();
    }
    resetAutoPlay();
  });

  // Keyboard navigation when section is in viewport
  document.addEventListener('keydown', (e) => {
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (!inView) return;
    if (e.key === 'ArrowLeft') { prev(); resetAutoPlay(); }
    if (e.key === 'ArrowRight') { next(); resetAutoPlay(); }
  });

  // Init & resize
  const init = () => { buildDots(); goTo(Math.min(currentIndex, getMaxIndex())); };
  init();
  startAutoPlay();

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(init, 150);
  });
})();
