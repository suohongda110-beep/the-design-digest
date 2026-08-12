(() => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const observed = new WeakSet();

  function revealCards() {
    const cards = [...document.querySelectorAll(".resource-card:not([data-motion-bound])")];
    cards.forEach((card, index) => {
      card.dataset.motionBound = "true";
      card.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 55}ms`);
      if (reduced.matches) {
        card.classList.add("is-visible");
      } else if (!observed.has(card)) {
        observed.add(card);
        observer.observe(card);
      }
      if (finePointer.matches) bindCardPointer(card);
    });
  }

  const observer = new IntersectionObserver(
    (entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }),
    { rootMargin: "0px 0px -7%", threshold: 0.08 },
  );

  function bindCardPointer(card) {
    const preview = card.querySelector(".resource-image");
    if (!preview) return;
    preview.addEventListener("pointermove", (event) => {
      if (reduced.matches) return;
      const box = preview.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width;
      const y = (event.clientY - box.top) / box.height;
      preview.style.setProperty("--spot-x", `${x * 100}%`);
      preview.style.setProperty("--spot-y", `${y * 100}%`);
      preview.style.setProperty("--tilt-x", `${(0.5 - y) * 2.4}deg`);
      preview.style.setProperty("--tilt-y", `${(x - 0.5) * 2.8}deg`);
    });
    preview.addEventListener("pointerleave", () => {
      preview.style.removeProperty("--tilt-x");
      preview.style.removeProperty("--tilt-y");
    });
  }

  function bindMagnet(element) {
    if (element.dataset.magnetBound) return;
    element.dataset.magnetBound = "true";
    element.addEventListener("pointermove", (event) => {
      if (reduced.matches || !finePointer.matches) return;
      const box = element.getBoundingClientRect();
      const x = event.clientX - box.left - box.width / 2;
      const y = event.clientY - box.top - box.height / 2;
      element.style.transform = `translate(${x * 0.13}px, ${y * 0.16}px)`;
    });
    element.addEventListener("pointerleave", () => { element.style.transform = ""; });
  }

  function animateInterfaceChange() {
    if (reduced.matches) return;
    document.documentElement.classList.remove("interface-changing");
    requestAnimationFrame(() => {
      document.documentElement.classList.add("interface-changing");
      window.setTimeout(() => document.documentElement.classList.remove("interface-changing"), 360);
    });
  }

  document.addEventListener("digest:render", revealCards);
  document.addEventListener("digest:language", animateInterfaceChange);
  document.addEventListener("digest:theme", animateInterfaceChange);
  window.addEventListener("DOMContentLoaded", () => {
    document.documentElement.classList.add("motion-ready");
    revealCards();
    document.querySelectorAll("[data-load-more],[data-theme-toggle]").forEach(bindMagnet);
  });
})();
