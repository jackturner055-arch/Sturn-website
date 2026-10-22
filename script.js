(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const menuButton = $('.menu-toggle');
  const nav = $('#primary-nav');
  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(open));
      $('.menu-icon', menuButton).textContent = open ? '−' : '+';
      $('.menu-label', menuButton).textContent = open ? 'Close' : 'Menu';
    });
    $$('a', nav).forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
      $('.menu-icon', menuButton).textContent = '+';
      $('.menu-label', menuButton).textContent = 'Menu';
    }));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open'); menuButton.setAttribute('aria-expanded', 'false'); menuButton.focus();
      }
    });
  }
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  const layerData = {
    fluid: {kicker:'LAYER 01 / FLUID CIRCUIT',title:'Fluid circulation',description:'Moves compatible dielectric fluid through the tank and heat-rejection loop in a single-phase example. Final design depends on the selected architecture.',components:['Circulation pump','Pipes, hoses and fittings','Flow meter and isolation valves'],connection:'Flow and pressure readings may help an operator understand circulation. Equipment and operating ranges must be confirmed with the system manufacturer.',next:'thermal'},
    thermal: {kicker:'LAYER 02 / THERMAL',title:'Heat transfer',description:'Transfers heat from the immersion tank into a suitable external cooling loop. This conceptual view is not a system sizing or engineering design.',components:['Heat exchanger','Temperature probes','Heat-rejection loop'],connection:'Temperature measurements can show how conditions change across the loop. Sensor locations and limits are application-specific.',next:'filtration'},
    filtration: {kicker:'LAYER 03 / FLUID QUALITY',title:'Filtration and fluid handling',description:'Filtration and careful fluid handling can support system cleanliness and maintainability. Requirements depend on fluid chemistry, equipment and manufacturer guidance.',components:['Filter housing and element','Service isolation valves','Fluid sampling and handling points'],connection:'Differential pressure across a filter may help indicate loading when supported by selected equipment. No universal threshold is implied here.',next:'sensors'},
    sensors: {kicker:'LAYER 04 / INSTRUMENTATION',title:'Sensors and detection',description:'Instrumentation measures selected operating conditions and may support detection of abnormal events. Sensor coverage and alert logic require application-specific validation.',components:['Temperature sensors','Flow and pressure instrumentation','Level or leak-detection sensors'],connection:'Compatible instruments can send readings to a data-collection layer through supported interfaces. Protocols and hardware integrations have not been selected.',next:'software'},
    software: {kicker:'LAYER 05 / PLANNED SOFTWARE',title:'Monitoring layer',description:'A potential software service could organise selected sensor readings into an operational view, with trend history and configurable alerts.',components:['Monitoring dashboard','Trend history and event log','Configurable alert rules'],connection:'Receives data from instrumentation and presents context to an operator. Actual integrations depend on selected hardware and software partners.',next:'fluid'}
  };
  const stage = $('#system-stage');
  if (stage) {
    const nodes = $$('[data-layer]', stage);
    const lines = $$('[data-connection]', stage);
    const title = $('#detail-title'); const kicker = $('#detail-kicker'); const description = $('#detail-description');
    const components = $('#detail-components'); const connection = $('#detail-connection'); const nextButton = $('#detail-next');
    let activeLayer = 'software';
    function selectLayer(name) {
      const data = layerData[name]; if (!data) return;
      activeLayer = name;
      nodes.forEach(node => node.setAttribute('aria-pressed', String(node.dataset.layer === name)));
      lines.forEach(line => line.classList.toggle('is-related', (line.dataset.connection || '').split(/\s+/).includes(name)));
      kicker.textContent = data.kicker; title.textContent = data.title; description.textContent = data.description; connection.textContent = data.connection;
      components.replaceChildren(...data.components.map(text => { const li = document.createElement('li'); li.textContent = text; return li; }));
      nextButton.textContent = 'Explore next layer ↗';
    }
    nodes.forEach(node => node.addEventListener('click', () => selectLayer(node.dataset.layer)));
    $('#explorer-reset')?.addEventListener('click', () => selectLayer('software'));
    nextButton?.addEventListener('click', () => selectLayer(layerData[activeLayer].next));
    selectLayer(activeLayer);
  }

  const trendSets = {
    temp: {points:'40 139 90 125 140 132 190 92 240 105 290 75 340 91 390 59 440 72 490 50 540 62 590 40 640 47 700 31',values:[34.1,34.4,34.3,34.8,34.6,35.0,34.7,35.2,35.0,35.4,35.2,35.6,35.5,35.8],label:'Example temperature values for interface demonstration only. Not operational data or a recommended range.'},
    flow: {points:'40 98 90 85 140 102 190 91 240 95 290 82 340 99 390 77 440 88 490 79 540 91 590 70 640 80 700 74',values:[40.8,41.3,40.6,41.0,40.9,41.5,40.7,41.8,41.2,41.7,41.1,42.0,41.6,42.1],label:'Example flow values for interface demonstration only. Not a target flow rate or design recommendation.'},
    pressure: {points:'40 122 90 105 140 116 190 108 240 123 290 100 340 110 390 94 440 105 490 89 540 100 590 82 640 93 700 77',values:[16.2,16.8,16.4,16.7,16.1,16.9,16.6,17.1,16.7,17.2,16.9,17.5,17.1,17.6],label:'Example differential-pressure values for interface demonstration only. Not a recommended operating range.'}
  };
  const chartLine = $('.chart-line'); const chartArea = $('.chart-area'); const chartNote = $('#chart-note');
  $$('[data-metric]').forEach(button => button.addEventListener('click', () => {
    const set = trendSets[button.dataset.metric]; if (!set || !chartLine || !chartArea) return;
    $$('[data-metric]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    chartLine.setAttribute('d', set.points); chartArea.setAttribute('d', `${set.points}V185H40Z`); chartNote.textContent = set.label;
    const value = set.values[set.values.length - 1];
    if (button.dataset.metric === 'temp') $('#metric-temp').textContent = '34.8';
    if (button.dataset.metric === 'flow') $('#metric-flow').textContent = '42.1';
    if (button.dataset.metric === 'pressure') $('#metric-pressure').textContent = '18.4';
    const svg = $('#trend-chart'); if (svg) svg.setAttribute('aria-label', `${button.textContent} demonstration trend chart. Simulated values only.`);
  }));

  const typeSelect = $('#enquiry-type');
  $$('[data-enquiry]').forEach(link => link.addEventListener('click', () => {
    if (typeSelect) {
      const desired = link.dataset.enquiry;
      const option = [...typeSelect.options].find(item => item.textContent === desired);
      if (option) typeSelect.value = option.value;
    }
  }));
  const form = $('#enquiry-form'); const feedback = $('#form-feedback');
  if (form) form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const subject = encodeURIComponent(`STURN website enquiry: ${data.get('type')}`);
    const body = encodeURIComponent(`Enquiry type: ${data.get('type')}\nName: ${data.get('name')}\nCompany: ${data.get('company') || 'Not provided'}\nEmail: ${data.get('email')}\n\n${data.get('message')}`);
    if (feedback) feedback.textContent = 'Your email application should open with a draft. Confirm the official STURN recipient before sending; this website does not transmit or store your details.';
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  });
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) document.documentElement.classList.add('reduced-motion');
})();
