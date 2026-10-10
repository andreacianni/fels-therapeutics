'use strict';
// Google Fonts variable weight ranges. No serif family is exposed in the controls.
const FONT_FAMILIES = {
  'nunito-sans': {name: 'Nunito Sans', min: 200, max: 1000},
  manrope: {name: 'Manrope', min: 200, max: 800},
  'plus-jakarta-sans': {name: 'Plus Jakarta Sans', min: 200, max: 800},
  'dm-sans': {name: 'DM Sans', min: 100, max: 1000},
  outfit: {name: 'Outfit', min: 100, max: 900},
  'ibm-plex-sans': {name: 'IBM Plex Sans', min: 100, max: 700},
  sora: {name: 'Sora', min: 100, max: 800}
};
const DEFAULTS = Object.freeze({headings: 'manrope', texts: 'nunito-sans', headingWeight: 700, textWeight: 400, headingSize: 100, textSize: 100});
let state = {...DEFAULTS};
const $ = selector => document.querySelector(selector);
function supportedWeight(font, value, fallback) {
  const number = Number(value);
  const weight = /^\d+$/.test(String(value)) && number >= 100 && number <= 1000 ? number : fallback;
  return Math.max(FONT_FAMILIES[font].min, Math.min(FONT_FAMILIES[font].max, Math.round(weight / 100) * 100));
}
function validSize(value) {
  return /^\d+$/.test(String(value)) && Number(value) >= 80 && Number(value) <= 120 ? Number(value) : 100;
}
function restoreFromURL() {
  const params = new URLSearchParams(location.hash.slice(1));
  const headings = Object.hasOwn(FONT_FAMILIES, params.get('headings')) ? params.get('headings') : DEFAULTS.headings;
  const texts = Object.hasOwn(FONT_FAMILIES, params.get('texts')) ? params.get('texts') : DEFAULTS.texts;
  state = {headings, texts,
    headingWeight: supportedWeight(headings, params.get('headingWeight'), DEFAULTS.headingWeight),
    textWeight: supportedWeight(texts, params.get('textWeight'), DEFAULTS.textWeight),
    headingSize: validSize(params.get('headingSize')), textSize: validSize(params.get('textSize'))};
}
function populateWeights(selector, font, selected) {
  const {min, max} = FONT_FAMILIES[font];
  const options = [];
  for (let weight = min; weight <= max; weight += 100) options.push(`<option value="${weight}">${weight}</option>`);
  $(selector).innerHTML = options.join('');
  $(selector).value = selected;
}
function render() {
  const style = document.documentElement.style;
  style.setProperty('--heading-font', `"${FONT_FAMILIES[state.headings].name}", Arial, sans-serif`);
  style.setProperty('--text-font', `"${FONT_FAMILIES[state.texts].name}", Arial, sans-serif`);
  style.setProperty('--heading-weight', state.headingWeight);
  // Preserve the initial 700 / 600 headline-to-slide hierarchy without unsupported weights.
  style.setProperty('--slide-weight', supportedWeight(state.headings, state.headingWeight - 100, state.headingWeight));
  style.setProperty('--text-weight', state.textWeight);
  style.setProperty('--strong-weight', supportedWeight(state.texts, state.textWeight + 200, state.textWeight));
  style.setProperty('--heading-scale', state.headingSize / 100);
  style.setProperty('--text-scale', state.textSize / 100);
  $('#heading-font').value = state.headings;
  $('#text-font').value = state.texts;
  populateWeights('#heading-weight', state.headings, state.headingWeight);
  populateWeights('#text-weight', state.texts, state.textWeight);
  for (const [prefix, key] of [['heading', 'headingSize'], ['text', 'textSize']]) {
    $(`#${prefix}-size`).value = state[key];
    $(`#${prefix}-size-value`).value = `${state[key]}%`;
    $(`#${prefix}-size`).setAttribute('aria-valuetext', `${state[key]}%`);
  }
  $('#pair-name').textContent = `${FONT_FAMILIES[state.headings].name} / ${FONT_FAMILIES[state.texts].name}`;
  const hash = new URLSearchParams(state);
  try { history.replaceState(null, '', `#${hash}`); } catch (error) { /* Local files remain usable. */ }
  if (!$('#link-fallback').hidden) $('#share-url').value = location.href;
}
let fontRequest = 0;
async function loadFonts() {
  const request = ++fontRequest;
  $('#font-status').textContent = 'Caricamento dei font da Google Fonts…';
  try {
    const specs = Object.values(FONT_FAMILIES).map(font => `400 18px "${font.name}"`);
    specs.push(`${state.headingWeight} 18px "${FONT_FAMILIES[state.headings].name}"`, `${state.textWeight} 18px "${FONT_FAMILIES[state.texts].name}"`);
    const results = await Promise.all(specs.map(spec => document.fonts.load(spec)));
    if (results.some(fonts => fonts.length === 0)) throw new Error('Font unavailable');
    if (request === fontRequest) $('#font-status').textContent = '';
  } catch (error) {
    if (request === fontRequest) $('#font-status').textContent = 'Alcuni font non sono disponibili. Verifica la connessione a Google Fonts; nel frattempo viene usato il font di riserva.';
  }
}
for (const selector of ['#heading-font', '#text-font']) {
  $(selector).innerHTML = Object.entries(FONT_FAMILIES).map(([key, font]) => `<option value="${key}">${font.name}</option>`).join('');
}
const samples = [
  {draw: graph, name: 'Grafico scientifico', caption: 'Curve e punti simulati: contenuti dimostrativi, non risultati sperimentali.'},
  {draw: diagram, name: 'Diagramma', caption: 'Schema semplificato di reclutamento e degradazione proteica, a scopo dimostrativo.'},
  {draw: cover, name: 'Copertina scura', caption: 'La stessa copertina FELS su fondo navy. Il logo rimane un asset grafico invariato.'}
];
// Fixed scientific-blue accent. The slide DOM never changes when a font is selected.
$('#previews').innerHTML = samples.map(({draw, name, caption}, index) => `<section class="preview" aria-labelledby="preview-title-${index}"><h2 id="preview-title-${index}" class="preview-title">0${index + 1} / ${name}</h2><div class="stage" tabindex="0" role="region" aria-label="${name}: scorri orizzontalmente su schermi piccoli">${draw('#0075D5')}</div><p class="caption">${caption}</p></section>`).join('');
$('#type-controls').addEventListener('submit', event => event.preventDefault());
$('#type-controls').addEventListener('input', event => {
  const input = event.target;
  if (!input.name) return;
  state[input.name] = input.tagName === 'SELECT' && input.name !== 'headingWeight' && input.name !== 'textWeight' ? input.value : Number(input.value);
  state.headingWeight = supportedWeight(state.headings, state.headingWeight, DEFAULTS.headingWeight);
  state.textWeight = supportedWeight(state.texts, state.textWeight, DEFAULTS.textWeight);
  render();
  if (!input.name.endsWith('Size')) loadFonts();
});
$('#reset').addEventListener('click', () => {
  state = {...DEFAULTS}; render(); loadFonts();
  $('#status').textContent = 'Ripristinati Manrope + Nunito Sans e tutti i valori iniziali.';
});
window.addEventListener('hashchange', () => { restoreFromURL(); render(); loadFonts(); });
$('#copy').addEventListener('click', async () => {
  if (location.protocol === 'file:') { $('#status').textContent = 'Per condividere il link, apri la pagina pubblicata o servita via HTTP.'; return; }
  try {
    await navigator.clipboard.writeText(location.href);
    $('#status').textContent = 'Link della configurazione copiato.';
  } catch (error) {
    $('#link-fallback').hidden = false;
    $('#share-url').value = location.href;
    $('#share-url').select();
    $('#status').textContent = 'Seleziona e copia il link qui sotto.';
  }
});
restoreFromURL();
render();
loadFonts();
