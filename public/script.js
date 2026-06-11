// Accordion service index
document.querySelectorAll('.index-row').forEach((row) => {
  const head = row.querySelector('.index-head');
  const body = row.querySelector('.index-body');

  head.addEventListener('click', () => {
    const isOpen = row.classList.contains('open');

    document.querySelectorAll('.index-row.open').forEach((openRow) => {
      openRow.classList.remove('open');
      openRow.querySelector('.index-body').style.maxHeight = null;
      openRow.querySelector('.index-head').setAttribute('aria-expanded', 'false');
    });

    if (!isOpen) {
      row.classList.add('open');
      body.style.maxHeight = body.scrollHeight + 'px';
      head.setAttribute('aria-expanded', 'true');
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
