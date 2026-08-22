(() => {
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const header = $(".site-header");
  const nav    = $(".nav");
  const toggle = $(".menu-toggle");
  const links  = $$(".nav a");
  const sectionIds = ["sobre", "projetos", "trajetoria", "contato"];
  const sections = sectionIds
    .map(id => document.getElementById(id))
    .filter(Boolean);

  const onScroll = () => {
    const y = window.scrollY;
    header?.classList.toggle("is-scrolled", y > 8);

    const scrollTop = $(".scroll-top");
    if (scrollTop) scrollTop.classList.toggle("is-visible", y > 400);

    const pos = y + 120;
    let current = sections[0]?.id;
    for (const s of sections) {
      if (s.offsetTop <= pos) current = s.id;
    }
    links.forEach(a => a.classList.toggle("is-active", a.getAttribute("href") === `#${current}`));
  };

  toggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open);
  });

  links.forEach(a => a.addEventListener("click", () => {
    nav.classList.remove("is-open");
    toggle.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", false);
  }));

  $(".scroll-top")?.addEventListener("click", e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  const io = new IntersectionObserver(entries => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add("is-visible");
        io.unobserve(e.target);
      }
    }
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  $$(".reveal").forEach(el => io.observe(el));

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
