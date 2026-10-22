(() => {
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.querySelector("span").textContent = open ? "−" : "+";
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.querySelector("span").textContent = "+";
    }));
  }

  document.getElementById("year").textContent = new Date().getFullYear();

  // Use the motion only where supported; reduced-motion visitors see the full page immediately.
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealTargets = document.querySelectorAll(".intro-main, .intro-aside, .section-heading, .architecture-card, .components-visual, .components-copy, .software-visual, .software-copy, .partners-intro, .partner-row, .about-title, .about-copy, .investor-copy, .enquiry-intro, .enquiry-form, .faq details");
  if (!reduceMotion && "IntersectionObserver" in window) {
    revealTargets.forEach(el => el.classList.add("reveal"));
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
    revealTargets.forEach(el => observer.observe(el));
  }

  const typeSelect = document.getElementById("type");
  document.querySelectorAll("[data-enquiry]").forEach(link => {
    link.addEventListener("click", () => {
      if (typeSelect) typeSelect.value = link.getAttribute("data-enquiry");
    });
  });

  const form = document.getElementById("enquiry-form");
  const feedback = document.getElementById("form-feedback");
  form.addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(form);
    const subject = encodeURIComponent("STURN website enquiry: " + data.get("type"));
    const body = encodeURIComponent(
      "Enquiry type: " + data.get("type") + "\n" +
      "Name: " + data.get("name") + "\n" +
      "Company: " + data.get("company") + "\n" +
      "Email: " + data.get("email") + "\n\n" +
      data.get("message")
    );
    feedback.textContent = "Opening an email draft. Choose the STURN enquiry address before sending; this website does not store your details.";
    window.location.href = "mailto:?subject=" + subject + "&body=" + body;
  });
})();