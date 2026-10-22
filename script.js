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


  // Interactive conceptual SaaS / cooling architecture explorer.
  const explorer = document.getElementById("isometric-stage");
  if (explorer) {
    const layerData = {
      fluid: { kicker:"LAYER 01 / FLUID CIRCUIT", title:"Fluid circulation", description:"Moves compatible dielectric fluid through the tank and heat-rejection loop in a single-phase example. The final design depends on the selected system architecture.", components:["Circulation pump","Pipes, hoses and fittings","Flow meter and isolation valves"], connection:"Flow and pressure readings can help an operator understand circulation. Actual equipment and operating ranges must be confirmed with the system manufacturer.", next:"thermal" },
      thermal: { kicker:"LAYER 02 / THERMAL", title:"Heat transfer", description:"Transfers heat from the immersion tank into a suitable external cooling loop. This conceptual view is not a system sizing or engineering design.", components:["Heat exchanger","Temperature probes","Heat-rejection loop"], connection:"Temperature measurements at selected points can show how conditions change across the loop. Sensor locations and limits are application-specific.", next:"filtration" },
      filtration: { kicker:"LAYER 03 / FLUID QUALITY", title:"Filtration and fluid handling", description:"Filtration and careful fluid handling can support system cleanliness and maintainability. Requirements depend on fluid chemistry, equipment and manufacturer guidance.", components:["Filter housing and element","Service isolation valves","Fluid sampling / handling points"], connection:"Differential pressure across a filter may help indicate loading when supported by the chosen equipment. No universal threshold is implied here.", next:"sensing" },
      sensing: { kicker:"LAYER 04 / INSTRUMENTATION", title:"Sensors and detection", description:"Instrumentation measures selected operating conditions and may support detection of abnormal events. Sensor coverage and alert logic require application-specific validation.", components:["Temperature sensors","Flow and pressure instrumentation","Level or leak-detection sensors"], connection:"Compatible instruments send readings to a data-collection layer through supported interfaces. The exact protocol and hardware integration are not yet selected.", next:"saas" },
      saas: { kicker:"LAYER 05 / SOFTWARE AS A SERVICE", title:"SaaS monitoring layer", description:"A potential software service could turn selected sensor readings into a shared operational view, with trend history and configurable alerts.", components:["Monitoring dashboard","Trend history and event log","Configurable alert rules"], connection:"Receives data from instrumentation and presents context to an operator. Actual integrations depend on the selected hardware and software partners.", next:"fluid" }
    };
    const nodes = [...explorer.querySelectorAll("[data-layer]")];
    const links = [...explorer.querySelectorAll(".link")];
    const title = document.getElementById("detail-title");
    const kicker = document.getElementById("detail-kicker");
    const description = document.getElementById("detail-description");
    const components = document.getElementById("detail-components");
    const connection = document.getElementById("detail-connection");
    const nextButton = document.getElementById("detail-next");
    let activeLayer = "saas";
    function selectLayer(name) {
      const data = layerData[name];
      if (!data) return;
      activeLayer = name;
      explorer.classList.add("has-selection");
      nodes.forEach(node => {
        const selected = node.dataset.layer === name;
        node.setAttribute("aria-pressed", String(selected));
      });
      links.forEach(link => {
        const related = (link.dataset.link || "").split(/\s+/).includes(name);
        link.classList.toggle("is-related", related);
      });
      kicker.textContent = data.kicker;
      title.textContent = data.title;
      description.textContent = data.description;
      components.replaceChildren(...data.components.map(item => {
        const li = document.createElement("li");
        li.textContent = item;
        return li;
      }));
      connection.textContent = data.connection;
      nextButton.textContent = "Explore next layer ↗";
    }
    nodes.forEach(node => node.addEventListener("click", () => selectLayer(node.dataset.layer)));
    document.getElementById("explorer-reset")?.addEventListener("click", () => {
      explorer.classList.remove("has-selection");
      nodes.forEach(node => node.setAttribute("aria-pressed", "false"));
      links.forEach(link => link.classList.remove("is-related"));
      selectLayer("saas");
      explorer.classList.remove("has-selection");
      nodes.forEach(node => node.setAttribute("aria-pressed", "false"));
    });
    nextButton?.addEventListener("click", () => selectLayer(layerData[activeLayer].next));
    selectLayer(activeLayer);
  }

})();