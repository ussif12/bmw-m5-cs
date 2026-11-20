/* ============================================================
   BMW M5 CS — Editorial interactions
   ============================================================ */
(function () {
  "use strict";

  const header = document.getElementById("header");
  const hero = document.getElementById("hero");
  const menuBtn = document.getElementById("menuBtn");
  const nav = document.getElementById("nav");
  const heroMedia = document.getElementById("heroMedia");
  const perfMedia = document.getElementById("perfMedia");

  /* ---------- header state ---------- */
  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle("scrolled", y > 60);
    header.classList.toggle("over-hero", y < hero.offsetHeight - 120);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */
  menuBtn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.querySelectorAll("span").forEach((s, i) => {
      s.style.transform = open
        ? i === 0 ? "translateY(3.5px) rotate(45deg)" : "translateY(-3.5px) rotate(-45deg)"
        : "";
    });
  });
  nav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      nav.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.querySelectorAll("span").forEach((s) => (s.style.transform = ""));
    })
  );

  /* ---------- reveal ---------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          revealObserver.unobserve(e.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  /* ---------- hero text on load ---------- */
  window.addEventListener("load", () => {
    document.querySelectorAll(".hero .reveal").forEach((el, i) => {
      setTimeout(() => el.classList.add("in"), 150 + i * 130);
    });
  });

  /* ---------- counters ---------- */
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.to);
        const dec = parseInt(el.dataset.dec || "0", 10);
        const duration = 1800;
        const start = performance.now();

        function tick(now) {
          const p = Math.min((now - start) / duration, 1);
          const eased = p === 1 ? 1 : 1 - Math.pow(1 - p, 4);
          el.textContent = (eased * target).toFixed(dec);
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = target.toFixed(dec);
        }
        requestAnimationFrame(tick);
        counterObserver.unobserve(el);
      });
    },
    { threshold: 0.6 }
  );
  document.querySelectorAll(".metric-num").forEach((el) => counterObserver.observe(el));

  /* ---------- parallax ---------- */
  function parallax() {
    const y = window.scrollY;
    if (heroMedia && y < window.innerHeight * 1.2) {
      heroMedia.style.transform = `translate3d(0, ${y * 0.22}px, 0) scale(1.04)`;
    }
    if (perfMedia) {
      const rect = perfMedia.parentElement.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const offset = (window.innerHeight / 2 - (rect.top + rect.height / 2)) * 0.12;
        perfMedia.style.transform = `translate3d(0, ${offset}px, 0) scale(1.08)`;
      }
    }
  }
  window.addEventListener("scroll", parallax, { passive: true });
  parallax();
})();
