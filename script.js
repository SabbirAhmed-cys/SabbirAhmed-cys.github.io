const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

$("#year").textContent = new Date().getFullYear();

// Mobile navigation
const menuButton = $(".menu-toggle");
const nav = $(".nav");
menuButton.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
});
$$(".nav a").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
}));

// Subtle terminal typing loop
const typing = $(".typing-text");
const phrases = ["build --with-purpose", "document --everything", "learn --every-day"];
let phraseIndex = 0, charIndex = 0, deleting = false;
function typeLoop() {
  if (!typing) return;
  const phrase = phrases[phraseIndex];
  typing.textContent = phrase.slice(0, charIndex);
  if (!deleting && charIndex < phrase.length) charIndex++;
  else if (deleting && charIndex > 0) charIndex--;
  else {
    deleting = !deleting;
    if (!deleting) phraseIndex = (phraseIndex + 1) % phrases.length;
  }
  setTimeout(typeLoop, deleting ? 45 : 85);
}
typeLoop();

// Reveal elements when they enter the viewport
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
$$(".reveal").forEach(el => revealObserver.observe(el));

// Project filtering
const filters = $$(".filter-btn");
const cards = $$(".project-card");
filters.forEach(button => button.addEventListener("click", () => {
  filters.forEach(item => item.classList.remove("active"));
  button.classList.add("active");
  const filter = button.dataset.filter;
  cards.forEach(card => {
    const show = filter === "all" || card.dataset.category === filter;
    card.classList.toggle("is-hidden", !show);
  });
}));

// Custom cursor: dot + outlined ring, with a larger ring over interactive items.
// Automatically disabled for touch/coarse-pointer devices and reduced-motion settings.
const finePointer = matchMedia("(pointer: fine)").matches;
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
if (finePointer && !reducedMotion) {
  const dot = $(".cursor-dot"), ring = $(".cursor-ring");
  let mouseX = -100, mouseY = -100, ringX = -100, ringY = -100;
  window.addEventListener("mousemove", event => {
    mouseX = event.clientX; mouseY = event.clientY;
    dot.style.opacity = "1"; ring.style.opacity = "1";
    dot.style.left = `${mouseX}px`; dot.style.top = `${mouseY}px`;
  });
  function animateRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.left = `${ringX}px`; ring.style.top = `${ringY}px`;
    requestAnimationFrame(animateRing);
  }
  animateRing();
  $$("a, button, .stack-card, .project-card").forEach(el => {
    el.addEventListener("mouseenter", () => ring.classList.add("hover"));
    el.addEventListener("mouseleave", () => ring.classList.remove("hover"));
  });
  document.addEventListener("mouseleave", () => {
    dot.style.opacity = "0"; ring.style.opacity = "0";
  });
}
