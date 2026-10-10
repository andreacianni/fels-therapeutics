'use strict';
// Single configuration for all three accents: HTML and SCSS use these values.
const BRAND_COLORS = {
  amber: {name: 'Amber', hex: '#F2A65A', note: 'Warm and balanced'},
  molecularOrange: {name: 'Molecular Orange', hex: '#FF9400', note: 'Bold and energetic'},
  custom: {name: 'Custom', hex: '#44E49F', note: 'Your colour'}
};
const DEFAULT_CUSTOM_HEX = BRAND_COLORS.custom.hex;
function normalizeHex(value) {
  return /^#?[0-9a-f]{6}$/i.test(value) ? `#${value.replace(/^#/, '').toUpperCase()}` : null;
}
const names = ['Scientific chart', 'Diagram', 'Dark cover'];
const captions = [
  '01 / Dose–response chart inspired by the layout of slide 4 in the reference PDF. Curves and points are simulated: they are used to evaluate the palette and do not represent experimental results.',
  '02 / Simplified protein degradation diagram inspired by slides 3 and 12 in the PDF. The accent highlights the small molecule and the final step; blue tones distinguish the target and E3 ligase.',
  '03 / Cover inspired by the title on slide 1 in the PDF. Background #001431, logo adapted for readability and accent on the main concept.'
];
let selected = 'amber';
let comparing = false;
const $ = s => document.querySelector(s);
function restoreFromHash() {
  const params = new URLSearchParams(location.hash.slice(1));
  // Support links created before the new configuration.
  const aliases = {orange: 'molecularOrange', yellow: 'custom'};
  const requested = params.get('palette');
  const key = Object.hasOwn(aliases, requested) ? aliases[requested] : requested;
  selected = Object.hasOwn(BRAND_COLORS, key) ? key : 'amber';
  comparing = params.get('view') === 'compare';
  BRAND_COLORS.custom.hex = normalizeHex(params.get('custom') || '') || DEFAULT_CUSTOM_HEX;
  $('#custom-hex').value = BRAND_COLORS.custom.hex;
  $('#custom-hex').setAttribute('aria-invalid', 'false');
}
const text = (x,y,content,size=24,fill='#001431',extra='') => `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" ${extra}>${content}</text>`;
const line = (x1,y1,x2,y2,color='#dce2e9',width=1,extra='') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}" ${extra}/>`;
function base(body, title, dark=false) {
  return `<svg class="slide-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" role="img" aria-label="${title}"><title>${title}</title><rect width="1200" height="675" fill="${dark?'#001431':'#fff'}"/>${body}</svg>`;
}
function footer(num, accent, dark=false) {
  const color=dark?'#a8bed6':'#697b90';
  return `${line(64,610,1136,610,dark?'#244363':'#dce2e9')}${text(64,638,'FELS THERAPEUTICS  /  COLOUR STUDY',12,color,'letter-spacing="2"')}${text(1136,638,String(num).padStart(2,'0'),14,color,'text-anchor="end"')}<rect x="64" y="610" width="100" height="3" fill="${accent}"/>`;
}
function header(label, title, subtitle, a) {
  return `${text(64,67,label,13,'#124F95','letter-spacing="2" font-weight="700"')}${text(64,119,title,35,'#001431','font-weight="700"')}${text(64,157,subtitle,19,'#58677a')}<image href="assets/fels-logo.svg" x="1010" y="43" width="130" height="64"/><rect x="64" y="182" width="56" height="4" fill="${a}"/>`;
}
function graph(a) {
  let s=header('ONCO1 LEAD PROGRAM / IN VITRO','Target degradation across concentrations','A clear visual hierarchy for dose–response data',a);
  s+=text(78,247,'Relative target level (%)',17,'#58677a');
  for(let v=0;v<=100;v+=25){let y=530-v*2.55;s+=line(135,y,760,y,'#e4e9ef')+text(119,y+5,v,15,'#58677a','text-anchor="end"');}
  s+=line(135,275,135,530,'#001431',1.5)+line(135,530,760,530,'#001431',1.5);
  for(let j=0;j<5;j++){let x=135+j*156.25;s+=line(x,530,x,536,'#001431')+text(x,557,['0.01','0.1','1','10','100'][j],15,'#58677a','text-anchor="middle"');}
  s+=text(449,592,'Concentration (nM) · logarithmic scale',16,'#58677a','text-anchor="middle"');
  const curve=(mid,color,dash=false)=>{
    let points=[];
    for(let j=0;j<=80;j++){let z=-2+j/20;let v=6+94/(1+Math.pow(10,(z-mid)*1.35));points.push([135+j/80*625,530-v*2.55]);}
    let out=`<polyline points="${points.map(p=>p.join(',')).join(' ')}" fill="none" stroke="${color}" stroke-width="4" ${dash?'stroke-dasharray="8 6"':''}/>`;
    [0,10,20,30,40,50,60,70,80].forEach((j,i)=>{let [x,y]=points[j];let delta=[0,2,-3,2,-2,1,3,-1,0][i];y+=delta;out+=line(x,y-7,x,y+7,color,1.5)+line(x-4,y-7,x+4,y-7,color,1.5)+line(x-4,y+7,x+4,y+7,color,1.5);out+=dash?`<rect x="${x-4}" y="${y-4}" width="8" height="8" fill="${color}"/>`:`<circle cx="${x}" cy="${y}" r="5" fill="${color}" stroke="#001431" stroke-width=".7"/>`;});return out;
  };
  s+=curve(.65,'#124F95',true)+curve(-.55,a);
  s+=`<rect x="831" y="233" width="305" height="328" rx="8" fill="#f3f6f9"/>`;
  s+=text(858,271,'READING THE SLIDE',13,'#124F95','font-weight="700" letter-spacing="1.4"');
  s+=line(860,310,902,310,a,4)+`<circle cx="881" cy="310" r="5" fill="${a}" stroke="#001431"/>`+text(917,316,'Lead compound',17);
  s+=line(860,349,902,349,'#124F95',4,'stroke-dasharray="7 5"')+`<rect x="877" y="345" width="8" height="8" fill="#124F95"/>`+text(917,355,'Reference',17);
  s+=line(858,387,1109,387,'#dce2e9')+text(858,424,'Accent = the key series',19,'#001431','font-weight="700"')+text(858,458,'Blue = the comparator',17,'#58677a')+text(858,496,'Shape + line style retain',16,'#58677a')+text(858,520,'meaning beyond colour.',16,'#58677a');
  s+=text(64,215,'ILLUSTRATIVE DATA · NOT EXPERIMENTAL RESULTS',11,'#697b90','letter-spacing="1"');
  return base(s+footer(1,a),'Dose–response chart with simulated data and a highlighted series');
}
function diagram(a) {
  let s=header('MECHANISM / TARGETED PROTEIN DEGRADATION','A small molecule. A coordinated mechanism.','A simplified schematic of target recruitment and degradation',a);
  const xs=[64,431,798];
  xs.forEach((x,i)=>{s+=`<rect x="${x}" y="235" width="338" height="300" rx="8" fill="#f3f6f9"/>`+text(x+22,270,String(i+1).padStart(2,'0'),13,'#124F95','font-weight="700" letter-spacing="1"');});
  s+=`<path d="M132 320 C102 286 72 336 97 368 C76 408 139 426 163 394 C203 412 218 350 184 334 C178 303 145 298 132 320Z" fill="#124F95"/>`;
  s+=text(145,372,'BT',19,'#fff','font-weight="700" text-anchor="middle"');
  s+=`<path d="M300 315 L347 341 L339 391 L292 411 L254 378 L259 335Z" fill="#2992B1"/>`+text(301,372,'E3',19,'#fff','font-weight="700" text-anchor="middle"');
  s+=line(195,430,257,430,a,7)+`<circle cx="195" cy="430" r="11" fill="${a}" stroke="#001431" stroke-width="1"/><circle cx="257" cy="430" r="11" fill="${a}" stroke="#001431" stroke-width="1"/>`;
  s+=text(88,487,'Target + degrader + E3 ligase',18,'#001431','font-weight="700"')+text(88,514,'Three components, one interaction',15,'#58677a');
  s+=`<circle cx="536" cy="367" r="46" fill="#124F95"/><path d="M665 323 L713 348 L704 400 L654 420 L618 385 L623 342Z" fill="#2992B1"/>`+text(536,374,'BT',19,'#fff','text-anchor="middle" font-weight="700"')+text(665,379,'E3',19,'#fff','text-anchor="middle" font-weight="700"');
  s+=line(577,367,623,367,a,7)+`<circle cx="577" cy="367" r="10" fill="${a}" stroke="#001431"/><circle cx="623" cy="367" r="10" fill="${a}" stroke="#001431"/>`;
  s+=text(455,487,'Recruitment',18,'#001431','font-weight="700"')+text(455,514,'The degrader brings proteins together',15,'#58677a');
  s+=`<circle cx="889" cy="365" r="40" fill="#124F95"/>`+text(889,372,'BT',18,'#fff','text-anchor="middle" font-weight="700"');
  [[912,321],[936,302],[960,317]].forEach(([x,y])=>{s+=`<circle cx="${x}" cy="${y}" r="10" fill="${a}" stroke="#001431" stroke-width="1"/>`;});
  s+=line(940,378,990,378,'#001431',2)+`<path d="M982 372 L992 378 L982 384" fill="none" stroke="#001431" stroke-width="2"/>`;
  [[1012,351],[1050,357],[1034,392],[1075,392],[1006,412]].forEach(([x,y])=>{s+=`<rect x="${x}" y="${y}" width="15" height="9" rx="4" fill="#73BFD3" transform="rotate(-30 ${x} ${y})"/>`;});
  s+=text(822,487,'Ubiquitination → degradation',18,'#001431','font-weight="700"')+text(822,514,'Tagged target is broken down',15,'#58677a');
  [415,782].forEach(x=>{s+=`<path d="M${x-5} 374 L${x+3} 382 L${x-5} 390" fill="none" stroke="#124F95" stroke-width="2"/>`;});
  s+=`<rect x="64" y="557" width="1072" height="35" rx="4" fill="${a}"/>`+text(84,580,'BT: biological target     /     E3: ubiquitin ligase     /     Schematic for visual evaluation only',14);
  return base(s+footer(2,a),'Simplified diagram: target, small molecule, recruitment and degradation');
}
function cover(a) {
  let s=`<image href="assets/fels-logo-dark.svg" x="64" y="59" width="230" height="113"/>`;
  s+=text(66,234,'SMALL-MOLECULE DEGRADER PLATFORM',14,'#73BFD3','letter-spacing="2.5" font-weight="700"');
  s+=text(64,318,'Building the',55,'#fff','font-weight="700"')+text(64,384,'Next-Generation',55,'#fff','font-weight="700"')+text(64,450,'Degrader Platform',55,a,'font-weight="700"');
  s+=line(66,485,442,485,a,3)+text(66,529,'Precision therapeutics. A clear scientific vision.',20,'#c5d3e4')+text(66,566,'NON-CONFIDENTIAL PRESENTATION',12,'#a8bed6','letter-spacing="2"');
  [[945,315,110],[1060,405,74],[1010,209,50]].forEach(([x,y,r])=>{s+=`<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#2992B1" stroke-width="1.5"/>`;});
  s+=line(945,315,1060,405,'#73BFD3',3)+line(945,315,1010,209,'#73BFD3',3)+`<circle cx="945" cy="315" r="27" fill="${a}"/><circle cx="1060" cy="405" r="18" fill="#0075D5"/><circle cx="1010" cy="209" r="12" fill="#73BFD3"/>`;
  return base(s+footer(3,a,true),'FELS Therapeutics cover on a dark background with the new logo',true);
}
// One renderer per slide, shared by previews and comparison.
const previews = [graph, diagram, cover].map((draw, index) => ({
  draw, name: names[index], caption: captions[index]
}));
function render() {
  const p = BRAND_COLORS[selected];
  const style = document.documentElement.style;
  Object.entries(BRAND_COLORS).forEach(([key, color]) => {
    style.setProperty(`--color-${key}`, color.hex);
    $(`input[value="${key}"]`).closest('.palette').querySelector('.palette-detail').textContent = `${color.hex} · ${color.note}`;
  });
  style.setProperty('--accent', p.hex);
  $('#custom-picker').value = BRAND_COLORS.custom.hex;
  $('#palette-name').textContent = p.name;
  document.querySelectorAll('input[name=palette]').forEach(el => {
    el.checked = el.value === selected;
  });
  $('#previews').innerHTML = previews.map(({draw, name, caption}, index) => {
    const variants = comparing ? Object.values(BRAND_COLORS) : [p];
    const figures = variants.map(variant => `<figure style="--mini-accent:${variant.hex}"><div class="stage">${draw(variant.hex)}</div><figcaption><i aria-hidden="true"></i>${variant.name} · ${variant.hex}</figcaption></figure>`).join('');
    return `<section class="preview" aria-labelledby="preview-title-${index}"><h2 id="preview-title-${index}" class="preview-title">0${index + 1} / ${name}</h2><div class="${comparing ? 'comparison' : 'preview-slides'}">${figures}</div><p class="caption">${caption}</p></section>`;
  }).join('');
  $('#compare').setAttribute('aria-pressed', comparing);
  $('#compare').textContent = comparing ? 'Back to the selected palette' : 'Compare all three palettes';
  $('#decision-title').textContent = `${p.name}. A direction to share.`;
  const hash = new URLSearchParams({palette: selected, custom: BRAND_COLORS.custom.hex.slice(1)});
  if (comparing) hash.set('view', 'compare');
  try { history.replaceState(null, '', `#${hash}`); } catch (e) { /* Support local files. */ }
}
document.querySelectorAll('input[name=palette]').forEach(el => el.addEventListener('change', () => {
  selected = el.value;
  render();
}));
function applyCustomColor(value) {
  const hex = normalizeHex(value);
  if (!hex) return false;
  BRAND_COLORS.custom.hex = hex;
  selected = 'custom';
  $('#custom-hex').value = hex;
  $('#custom-hex').setAttribute('aria-invalid', 'false');
  render();
  return true;
}
$('#custom-hex').addEventListener('input', event => {
  const value = event.target.value;
  if (!applyCustomColor(value)) {
    // Keep the draft and the last valid colour while typing.
    event.target.setAttribute('aria-invalid', String(!/^#?[0-9a-f]{0,6}$/i.test(value)));
  }
});
$('#custom-hex').addEventListener('blur', event => {
  event.target.setAttribute('aria-invalid', String(!normalizeHex(event.target.value)));
});
$('#custom-picker').addEventListener('input', event => applyCustomColor(event.target.value));
$('#custom-picker').addEventListener('change', event => applyCustomColor(event.target.value));
$('#custom-reset').addEventListener('click', () => {
  applyCustomColor(DEFAULT_CUSTOM_HEX);
  $('#status').textContent = `Custom reset: ${BRAND_COLORS.custom.hex}.`;
  if (!$('#link-fallback').hidden) $('#share-url').value = location.href;
});
window.addEventListener('hashchange', () => { restoreFromHash(); render(); });
$('#compare').addEventListener('click', () => { comparing = !comparing; render(); });
$('#fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else if($('#viewer').requestFullscreen)await $('#viewer').requestFullscreen();else throw new Error();}catch(e){$('#status').textContent='Fullscreen is unavailable in this browser. You can enlarge the window to present.';}});
document.addEventListener('fullscreenchange',()=>{$('#fullscreen').textContent=document.fullscreenElement?'Exit fullscreen':'Fullscreen ↗';});
$('#copy').addEventListener('click',async()=>{if(location.protocol==='file:'){$('#status').textContent='To share the link, publish the page on GitHub Pages first.';return;}try{await navigator.clipboard.writeText(location.href);$('#status').textContent=`Link copied: ${BRAND_COLORS[selected].name} ${BRAND_COLORS[selected].hex}, all previews.`;}catch(e){$('#link-fallback').hidden=false;$('#share-url').value=location.href;$('#share-url').select();$('#status').textContent='Select and copy the link below.';}});
$('#download').addEventListener('click',()=>{const p=BRAND_COLORS[selected];const data=`FELS THERAPEUTICS — PALETTE\n\nAccent: ${p.name} ${p.hex}\n${p.note}\n\nFixed logo colours\nNavy #001431\nDeep Blue #124F95\nBlue #0075D5\nCyan #2992B1\nLight Cyan #73BFD3\n\nLight slide background: #FFFFFF\nDark slide background: #001431\nDark text: #001431\nLight text: #FFFFFF\n\nUsage: accent for the main series, small highlights and key messages.\nOn a white background, use navy text on accent areas; avoid small accent-coloured text.\nDark logo: white letters and separator; colour modules preserved.\nDemonstration curves: no experimental data.\n`;
  const url=URL.createObjectURL(new Blob([data],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=`FELS-palette-${selected}.txt`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('#status').textContent=`Palette ${p.name} downloaded.`;
});
restoreFromHash();
render();
