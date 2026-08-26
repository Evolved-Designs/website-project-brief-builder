export const decisions = Object.freeze([
  ['outcome', 'Name the business outcome and one observable success signal.'],
  ['journey', 'Define the priority audience, task, next step, and critical journey.'],
  ['content', 'Inventory the required content, source material, owner, and missing assets.'],
  ['editing', 'Choose the editing model, reusable content structure, and training boundary.'],
  ['integrations', 'Map payments, forms, calendars, email, APIs, data flows, and owners.'],
  ['quality', 'Set accessible form, keyboard, error, and manual acceptance checks.'],
  ['measurement', 'Name critical pages, field metrics, analytics events, and reporting owners.'],
  ['care', 'Define staging, approvals, rollback, backups, launch support, and ongoing care.']
]);

export function projectSignal(selected = []) {
  const complete = new Set(selected).size;
  if (complete <= 2) return { band: 'discovery', label: 'Discovery first', cta: 'Scope the smallest useful phase' };
  if (complete <= 5) return { band: 'definition', label: 'Definition ready', cta: 'Stress-test the project brief' };
  return { band: 'handoff', label: 'Handoff ready', cta: 'Compare implementation approaches' };
}

export function firstGap(selected = []) {
  const complete = new Set(selected);
  return decisions.find(([key]) => !complete.has(key))?.[1] ?? 'Keep ownership, acceptance evidence, and the care plan current through launch.';
}

export function phaseCopy(selected = []) {
  const signal = projectSignal(selected);
  if (signal.band === 'discovery') return {
    heading: 'Start with the outcome and visitor journey.',
    summary: 'The implementation is still carrying business decisions. Resolve the first unknowns before asking for a fixed scope.'
  };
  if (signal.band === 'definition') return {
    heading: 'Turn the known work into a bounded first release.',
    summary: 'The direction is visible. Resolve the remaining integration, quality, measurement, and ownership gaps before committing to schedule.'
  };
  return {
    heading: 'Require a proposal to connect work with evidence.',
    summary: 'Most core decisions are owned. Compare approaches by deliverables, acceptance checks, rollback, training, and ongoing care.'
  };
}

export function contactUrl(project = 'company', selected = []) {
  const types = ['company', 'commerce', 'content', 'publication', 'operations', 'automation'];
  const valid = types.includes(project) ? project : 'company';
  const url = new URL('https://evolveddesigns.net/contact-us/');
  url.searchParams.set('utm_source', 'github_pages');
  url.searchParams.set('utm_medium', 'owned_tool');
  url.searchParams.set('utm_campaign', 'project_brief_builder');
  url.searchParams.set('utm_content', `${valid}_${projectSignal(selected).band}`);
  return url.toString();
}

export function commerceBriefLines(details = {}) {
  const labels = [
    ['catalog', 'Catalog scale'],
    ['variants', 'Variant model'],
    ['markets', 'Markets'],
    ['payments', 'Payments'],
    ['fulfillment', 'Fulfillment'],
    ['content', 'Product content']
  ];
  return labels.map(([key, label]) => `${label}: ${details[key] || 'unknown'}`);
}

export function companyBriefLines(details = {}) {
  const labels = [
    ['audiences', 'Priority audiences'],
    ['architecture', 'Service architecture'],
    ['estate', 'Site estate'],
    ['conversion', 'Primary conversion'],
    ['content', 'Content readiness'],
    ['governance', 'Publishing governance'],
    ['systems', 'Forms and systems'],
    ['automation', 'AI or automation role'],
    ['risk', 'Data or compliance boundary']
  ];
  return labels.map(([key, label]) => `${label}: ${details[key] || 'unknown'}`);
}

export function briefText(project = 'company', selected = [], scope = {}) {
  const signal = projectSignal(selected);
  const phase = phaseCopy(selected);
  const commerceSection = project === 'commerce'
    ? `\n\nCommerce boundaries\n${commerceBriefLines(scope).join('\n')}`
    : '';
  const companySection = ['company', 'publication'].includes(project)
    ? `\n\n${project === 'publication' ? 'Research or publication website' : 'Company website'} boundaries\n${companyBriefLines(scope).join('\n')}`
    : '';
  return `Website project first-phase brief\n\nProject type: ${project}\nReadiness: ${signal.label} (${new Set(selected).size}/8 decisions owned)\nRecommended phase: ${phase.heading}\nWhy: ${phase.summary}\nFirst unresolved decision: ${firstGap(selected)}${companySection}${commerceSection}\n\nThis is a scope signal, not a price estimate or contract.`;
}

export function downloadTextFile(filename, text) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function init() {
  const form = document.querySelector('[data-builder]');
  if (!form) return;
  const boxes = [...form.querySelectorAll('input[type="checkbox"]')];
  const types = [...form.querySelectorAll('input[name="project"]')];
  const commerceScope = form.querySelector('[data-commerce-scope]');
  const companyScope = form.querySelector('[data-company-scope]');
  const commerceFields = [...form.querySelectorAll('[data-commerce-field]')];
  const companyFields = [...form.querySelectorAll('[data-company-field]')];
  const score = document.querySelector('[data-score]');
  const band = document.querySelector('[data-band]');
  const phase = document.querySelector('[data-phase]');
  const summary = document.querySelector('[data-summary]');
  const gap = document.querySelector('[data-gap]');
  const contact = document.querySelector('[data-contact]');
  const copy = document.querySelector('[data-copy]');
  const download = document.querySelector('[data-download]');
  const selected = () => boxes.filter((box) => box.checked).map((box) => box.value);
  const project = () => types.find((type) => type.checked)?.value ?? 'company';
  const commerce = () => Object.fromEntries(commerceFields.map((field) => [field.dataset.commerceField, field.value]));
  const company = () => Object.fromEntries(companyFields.map((field) => [field.dataset.companyField, field.value]));
  const scope = () => project() === 'commerce' ? commerce() : ['company', 'publication'].includes(project()) ? company() : {};

  function render() {
    const values = selected();
    const signal = projectSignal(values);
    const copyForPhase = phaseCopy(values);
    score.textContent = `${new Set(values).size}/8`;
    band.textContent = signal.label;
    phase.textContent = copyForPhase.heading;
    summary.textContent = copyForPhase.summary;
    gap.textContent = firstGap(values);
    contact.textContent = signal.cta;
    contact.href = contactUrl(project(), values);
    commerceScope.hidden = project() !== 'commerce';
    companyScope.hidden = !['company', 'publication'].includes(project());
  }

  async function copyBrief() {
    await navigator.clipboard.writeText(briefText(project(), selected(), scope()));
    copy.textContent = 'Brief copied';
    window.setTimeout(() => { copy.textContent = 'Copy project brief'; }, 1800);
  }

  function downloadBrief() {
    downloadTextFile('website-project-first-phase-brief.txt', briefText(project(), selected(), scope()));
    download.textContent = 'Brief downloaded';
    window.setTimeout(() => { download.textContent = 'Download project brief'; }, 1800);
  }

  [...boxes, ...types, ...commerceFields, ...companyFields].forEach((control) => control.addEventListener('change', render));
  copy.addEventListener('click', () => copyBrief().catch(() => { copy.textContent = 'Copy unavailable'; }));
  download.addEventListener('click', downloadBrief);
  render();
}

if (typeof document !== 'undefined') init();
