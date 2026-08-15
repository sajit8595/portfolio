document.getElementById('year').textContent = new Date().getFullYear();

const navLinks = document.querySelectorAll('.side-nav a[data-nav]');
const blocks = document.querySelectorAll('.block[id]');

const setActiveNav = (id) => {
  navLinks.forEach((link) => {
    link.classList.toggle('is-active', link.dataset.nav === id);
  });
};

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('in-view');
    });
  },
  { threshold: 0.12 }
);

blocks.forEach((block) => {
  revealObserver.observe(block);
});

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.getElementById(link.dataset.nav);
    if (!target) return;

    event.preventDefault();
    setActiveNav(target.id);
    history.replaceState(null, '', `#${target.id}`);
    target.scrollIntoView({
      behavior: 'instant',
      block: 'start',
    });
    setActiveNav(target.id);
  });
});

let scrollFrame;
const updateActiveNav = () => {
  const marker = window.scrollY + 120;
  let activeId = blocks[0]?.id;

  blocks.forEach((block) => {
    if (block.offsetTop <= marker) activeId = block.id;
  });

  if (activeId) setActiveNav(activeId);
  scrollFrame = undefined;
};

window.addEventListener('scroll', () => {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(updateActiveNav);
}, { passive: true });

updateActiveNav();

const cursorLaser = document.querySelector('.cursor-laser');
const canTrackPointer = window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)');

if (cursorLaser && canTrackPointer.matches) {
  let targetX = -200;
  let targetY = -200;
  let currentX = targetX;
  let currentY = targetY;
  let laserFrame;
  let hasPosition = false;

  const renderLaser = () => {
    currentX += (targetX - currentX) * 0.24;
    currentY += (targetY - currentY) * 0.24;
    cursorLaser.style.setProperty('--laser-x', `${currentX}px`);
    cursorLaser.style.setProperty('--laser-y', `${currentY}px`);

    if (Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1) {
      laserFrame = requestAnimationFrame(renderLaser);
    } else {
      laserFrame = undefined;
    }
  };

  window.addEventListener('pointermove', (event) => {
    targetX = event.clientX;
    targetY = event.clientY;

    if (!hasPosition) {
      currentX = targetX;
      currentY = targetY;
      cursorLaser.style.setProperty('--laser-x', `${currentX}px`);
      cursorLaser.style.setProperty('--laser-y', `${currentY}px`);
      hasPosition = true;
    }

    cursorLaser.classList.add('is-visible');
    if (!laserFrame) laserFrame = requestAnimationFrame(renderLaser);
  }, { passive: true });

  document.documentElement.addEventListener('mouseleave', () => {
    cursorLaser.classList.remove('is-visible');
  });
}
