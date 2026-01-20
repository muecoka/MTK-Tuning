document.querySelectorAll(".top-header").forEach((header, index) => {
  const nav = header.querySelector(".header-nav");
  const actions = header.querySelector(".header-actions");
  if (!nav || !actions) return;

  let toggle = header.querySelector(".hamburger-menu");
  if (!toggle) {
    toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "hamburger-menu";
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Menü öffnen");
    toggle.innerHTML = "<span></span><span></span><span></span>";
    actions.insertBefore(toggle, actions.firstChild);
  }

  if (!nav.id) {
    nav.id = `header-nav-${index + 1}`;
  }
  toggle.setAttribute("aria-controls", nav.id);

  const closeMenu = () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Menü öffnen");
  };

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Menü schließen" : "Menü öffnen");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (nav.classList.contains("is-open")) {
        closeMenu();
      }
    });
  });

  document.addEventListener("click", (event) => {
    if (!header.contains(event.target)) {
      closeMenu();
    }
  });
});
