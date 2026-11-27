(() => {
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  // Footer year
  $("#year").textContent = new Date().getFullYear();

  // Mobile navigation
  const menuToggle = $("#menuToggle");
  const nav = $("#mainNav");
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });
  $$("#mainNav a").forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }));

  // Rotating role text
  const role = $("#typedRole");
  const roles = ["Aspiring Red Teaming Engineer", "Cybersecurity Enthusiast", "Python & Linux Learner"];
  let roleIndex = 0;
  if (role && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    setInterval(() => {
      roleIndex = (roleIndex + 1) % roles.length;
      role.textContent = roles[roleIndex];
    }, 2600);
  }

  // Reveal sections as they enter the viewport
  const revealItems = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("visible"));
  }

  // Project filters
  $$(".filter-btn").forEach(button => {
    button.addEventListener("click", () => {
      $$(".filter-btn").forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      const filter = button.dataset.filter;
      $$(".project-card").forEach(card => {
        const categories = (card.dataset.category || "").split(" ");
        card.classList.toggle("hidden", filter !== "all" && !categories.includes(filter));
      });
    });
  });

  // Scroll progress and back-to-top
  const progress = $("#scrollProgress");
  const backTop = $("#backTop");
  const updateScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
    backTop.classList.toggle("visible", window.scrollY > 500);
  };
  window.addEventListener("scroll", updateScroll, { passive: true });
  updateScroll();
  backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // Custom cursor with card-hover expansion
  const dot = $(".cursor-dot");
  const ring = $(".cursor-ring");
  if (dot && ring && window.matchMedia("(hover:hover) and (pointer:fine)").matches) {
    let x = -100, y = -100, ringX = -100, ringY = -100;
    window.addEventListener("mousemove", event => {
      x = event.clientX; y = event.clientY;
      dot.style.left = `${x}px`; dot.style.top = `${y}px`;
    }, { passive: true });
    const animateRing = () => {
      ringX += (x - ringX) * 0.18;
      ringY += (y - ringY) * 0.18;
      ring.style.left = `${ringX}px`; ring.style.top = `${ringY}px`;
      requestAnimationFrame(animateRing);
    };
    animateRing();
    $$("a, button, .focus-card, .project-card").forEach(el => {
      el.addEventListener("mouseenter", () => ring.classList.add("hover"));
      el.addEventListener("mouseleave", () => ring.classList.remove("hover"));
    });
  }

  // Public GitHub profile metrics (no token required)
  fetch("https://api.github.com/users/SabbirAhmed-cys", { headers: { "Accept": "application/vnd.github+json" } })
    .then(response => {
      if (!response.ok) throw new Error("GitHub profile data unavailable");
      return response.json();
    })
    .then(data => {
      $("#repoCount").textContent = data.public_repos ?? "—";
      $("#followerCount").textContent = data.followers ?? "—";
      $("#followingCount").textContent = data.following ?? "—";
      $("#githubMessage").textContent = "Public profile data loaded from GitHub.";
    })
    .catch(() => {
      $("#githubMessage").textContent = "Live stats unavailable right now. Visit GitHub to see the latest.";
    });
})();
