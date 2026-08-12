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

  function bindTitleTilt() {
    const hitArea = document.querySelector("[data-title-tilt]");
    const title = hitArea?.querySelector(".hero-title-tilt");
    if (!hitArea || !title || hitArea.dataset.tiltBound) return;
    hitArea.dataset.tiltBound = "true";

    hitArea.addEventListener("pointerenter", () => {
      if (reduced.matches || !finePointer.matches) return;
      title.classList.add("is-hover");
    });
    hitArea.addEventListener("pointermove", (event) => {
      if (reduced.matches || !finePointer.matches) return;
      const box = hitArea.getBoundingClientRect();
      const x = Math.min(1, Math.max(0, (event.clientX - box.left) / box.width));
      const y = Math.min(1, Math.max(0, (event.clientY - box.top) / box.height));
      title.style.setProperty("--title-rx", `${(0.5 - y) * 6}deg`);
      title.style.setProperty("--title-ry", `${(x - 0.5) * 6}deg`);
      title.style.setProperty("--title-gx", `${x * 100}%`);
      title.style.setProperty("--title-gy", `${y * 100}%`);
      title.classList.add("is-hover", "is-tilting");
    });
    hitArea.addEventListener("pointerleave", () => {
      title.classList.remove("is-hover", "is-tilting");
      title.style.removeProperty("--title-rx");
      title.style.removeProperty("--title-ry");
      title.style.removeProperty("--title-gx");
      title.style.removeProperty("--title-gy");
    });
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
    bindTitleTilt();
    document.querySelectorAll("[data-load-more],[data-theme-toggle]").forEach(bindMagnet);
  });
})();
