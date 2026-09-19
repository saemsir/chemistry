document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();

  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("site-nav");
  toggle?.addEventListener("click", () => nav.classList.toggle("is-open"));

  const items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window &&
      !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, {threshold:.12});
    items.forEach(x => io.observe(x));
  } else items.forEach(x => x.classList.add("visible"));
});