// Accordion service index (Expand on Hover & Click fallback)
document.querySelectorAll('.index-row').forEach((row) => {
  const head = row.querySelector('.index-head');
  const body = row.querySelector('.index-body');

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

  // Hover triggers (only applies on desktop mouse hover)
  row.addEventListener('mouseenter', openRow);
  row.addEventListener('mouseleave', closeRow);

  // Click fallback (mobile/touch toggle)
  head.addEventListener('click', () => {
    if (row.classList.contains('open')) {
      closeRow();
    } else {
      openRow();
    }
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
  .querySelectorAll('.index-row, .how-text, .cta-link, .kicker')
  .forEach((el) => {
    el.classList.add('reveal-up');
    observer.observe(el);
  });

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();
