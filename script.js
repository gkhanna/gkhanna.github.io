const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector("#nav-links");
const chips = document.querySelectorAll(".chip");
const publications = document.querySelectorAll(".publication");
const year = document.querySelector("#year");

if (year) {
  year.textContent = new Date().getFullYear();
}

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    const filter = chip.dataset.filter;

    chips.forEach((item) => item.classList.remove("active"));
    chip.classList.add("active");

    publications.forEach((publication) => {
      const tags = publication.dataset.tags || "";
      const visible = filter === "all" || tags.includes(filter);
      publication.classList.toggle("hidden", !visible);
    });
  });
});
