'use strict';
// Selective copy of the approved palette SVG renderers; geometry and scientific content are preserved.
// Keep approved coordinates and sizes; roles control families, relative scale and weight.
const text = (x, y, content, size = 24, fill = '#26384A', extra = '') => {
  const numeric = /^\d+(?:\.\d+)?$/.test(String(content));
  const role = size >= 50 ? 'main' : size >= 30 ? 'title' : numeric ? 'number' : extra.includes('data-subtitle') || size >= 18 && extra.includes('font-weight="700"') ? 'subtitle' : size <= 14 ? 'caption' : 'body';
  const strong = extra.includes('font-weight="700"') && (role === 'body' || role === 'caption');
  return `<text x="${x}" y="${y}" class="type-${role}${strong ? ' type-strong' : ''}" style="--base-size:${size}px" font-size="${size}" fill="${fill}" ${extra}>${content}</text>`;
};
const line = (x1,y1,x2,y2,color='#E8EDF2',width=1,extra='') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}" ${extra}/>`;
function base(body, title, dark=false) {
  return `<svg class="slide-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" role="img" aria-label="${title}"><title>${title}</title><rect width="1200" height="675" fill="${dark?'#001431':'#fff'}"/>${body}</svg>`;
}
function footer(num, accent, dark=false) {
  const color=dark?'#C5CED8':'#667789';
  return `${line(64,610,1136,610,dark?'#26384A':'#E8EDF2')}${text(64,638,'FELS THERAPEUTICS  /  TYPOGRAPHY STUDY',12,color,'letter-spacing="2"')}${text(1136,638,String(num).padStart(2,'0'),14,color,'text-anchor="end"')}<rect x="64" y="610" width="100" height="3" fill="${accent}"/>`;
}
function header(label, title, subtitle, a) {
  return `${text(64,67,label,13,'#124F95','letter-spacing="2" font-weight="700"')}${text(64,119,title,35,'#001431','font-weight="700"')}${text(64,157,subtitle,19,'#667789','data-subtitle="true"')}<image href="../palette/assets/fels-logo.svg" x="1010" y="43" width="130" height="64"/><rect x="64" y="182" width="56" height="4" fill="${a}"/>`;
}
function graph(a) {
  let s=header('ONCO1 LEAD PROGRAM / IN VITRO','Target degradation across concentrations','A clear visual hierarchy for dose–response data',a);
  s+=text(78,247,'Relative target level (%)',17,'#667789');
  for(let v=0;v<=100;v+=25){let y=530-v*2.55;s+=line(135,y,760,y,'#E8EDF2')+text(119,y+5,v,15,'#667789','text-anchor="end"');}
  s+=line(135,275,135,530,'#001431',1.5)+line(135,530,760,530,'#001431',1.5);
  for(let j=0;j<5;j++){let x=135+j*156.25;s+=line(x,530,x,536,'#001431')+text(x,557,['0.01','0.1','1','10','100'][j],15,'#667789','text-anchor="middle"');}
  s+=text(449,592,'Concentration (nM) · logarithmic scale',16,'#667789','text-anchor="middle"');
  const curve=(mid,color,dash=false)=>{
    let points=[];
    for(let j=0;j<=80;j++){let z=-2+j/20;let v=6+94/(1+Math.pow(10,(z-mid)*1.35));points.push([135+j/80*625,530-v*2.55]);}
    let out=`<polyline points="${points.map(p=>p.join(',')).join(' ')}" fill="none" stroke="${color}" stroke-width="4" ${dash?'stroke-dasharray="8 6"':''}/>`;
    [0,10,20,30,40,50,60,70,80].forEach((j,i)=>{let [x,y]=points[j];let delta=[0,2,-3,2,-2,1,3,-1,0][i];y+=delta;out+=line(x,y-7,x,y+7,color,1.5)+line(x-4,y-7,x+4,y-7,color,1.5)+line(x-4,y+7,x+4,y+7,color,1.5);out+=dash?`<rect x="${x-4}" y="${y-4}" width="8" height="8" fill="${color}"/>`:`<circle cx="${x}" cy="${y}" r="5" fill="${color}" stroke="#001431" stroke-width=".7"/>`;});return out;
  };
  s+=curve(.65,'#124F95',true)+curve(-.55,a);
  s+=`<rect x="831" y="233" width="305" height="328" rx="8" fill="#F7F9FB"/>`;
  s+=text(858,271,'READING THE SLIDE',13,'#124F95','font-weight="700" letter-spacing="1.4"');
  s+=line(860,310,902,310,a,4)+`<circle cx="881" cy="310" r="5" fill="${a}" stroke="#001431"/>`+text(917,316,'Lead compound',17);
  s+=line(860,349,902,349,'#124F95',4,'stroke-dasharray="7 5"')+`<rect x="877" y="345" width="8" height="8" fill="#124F95"/>`+text(917,355,'Reference',17);
  s+=line(858,387,1109,387,'#E8EDF2')+text(858,424,'Accent = the key series',19,'#001431','font-weight="700"')+text(858,458,'Blue = the comparator',17,'#667789')+text(858,496,'Shape + line style retain',16,'#667789')+text(858,520,'meaning beyond colour.',16,'#667789');
  s+=text(64,215,'ILLUSTRATIVE DATA · NOT EXPERIMENTAL RESULTS',11,'#667789','letter-spacing="1"');
  return base(s+footer(1,a),'Dose–response chart with simulated data and a highlighted series');
}
function diagram(a) {
  let s=header('MECHANISM / TARGETED PROTEIN DEGRADATION','A small molecule. A coordinated mechanism.','A simplified schematic of target recruitment and degradation',a);
  const xs=[64,431,798];
  xs.forEach((x,i)=>{s+=`<rect x="${x}" y="235" width="338" height="300" rx="8" fill="#F7F9FB"/>`+text(x+22,270,String(i+1).padStart(2,'0'),13,'#124F95','font-weight="700" letter-spacing="1"');});
  s+=`<path d="M132 320 C102 286 72 336 97 368 C76 408 139 426 163 394 C203 412 218 350 184 334 C178 303 145 298 132 320Z" fill="#124F95"/>`;
  s+=text(145,372,'BT',19,'#fff','font-weight="700" text-anchor="middle"');
  s+=`<path d="M300 315 L347 341 L339 391 L292 411 L254 378 L259 335Z" fill="#2992B1"/>`+text(301,372,'E3',19,'#fff','font-weight="700" text-anchor="middle"');
  s+=line(195,430,257,430,a,7)+`<circle cx="195" cy="430" r="11" fill="${a}" stroke="#001431" stroke-width="1"/><circle cx="257" cy="430" r="11" fill="${a}" stroke="#001431" stroke-width="1"/>`;
  s+=text(88,487,'Target + degrader + E3 ligase',18,'#001431','font-weight="700"')+text(88,514,'Three components, one interaction',15,'#667789');
  s+=`<circle cx="536" cy="367" r="46" fill="#124F95"/><path d="M665 323 L713 348 L704 400 L654 420 L618 385 L623 342Z" fill="#2992B1"/>`+text(536,374,'BT',19,'#fff','text-anchor="middle" font-weight="700"')+text(665,379,'E3',19,'#fff','text-anchor="middle" font-weight="700"');
  s+=line(577,367,623,367,a,7)+`<circle cx="577" cy="367" r="10" fill="${a}" stroke="#001431"/><circle cx="623" cy="367" r="10" fill="${a}" stroke="#001431"/>`;
  s+=text(455,487,'Recruitment',18,'#001431','font-weight="700"')+text(455,514,'The degrader brings proteins together',15,'#667789');
  s+=`<circle cx="889" cy="365" r="40" fill="#124F95"/>`+text(889,372,'BT',18,'#fff','text-anchor="middle" font-weight="700"');
  [[912,321],[936,302],[960,317]].forEach(([x,y])=>{s+=`<circle cx="${x}" cy="${y}" r="10" fill="${a}" stroke="#001431" stroke-width="1"/>`;});
  s+=line(940,378,990,378,'#001431',2)+`<path d="M982 372 L992 378 L982 384" fill="none" stroke="#001431" stroke-width="2"/>`;
  [[1012,351],[1050,357],[1034,392],[1075,392],[1006,412]].forEach(([x,y])=>{s+=`<rect x="${x}" y="${y}" width="15" height="9" rx="4" fill="#73BFD3" transform="rotate(-30 ${x} ${y})"/>`;});
  s+=text(822,487,'Ubiquitination → degradation',18,'#001431','font-weight="700"')+text(822,514,'Tagged target is broken down',15,'#667789');
  [415,782].forEach(x=>{s+=`<path d="M${x-5} 374 L${x+3} 382 L${x-5} 390" fill="none" stroke="#124F95" stroke-width="2"/>`;});
  s+=`<rect x="64" y="557" width="1072" height="35" rx="4" fill="${a}"/>`+text(84,580,'BT: biological target     /     E3: ubiquitin ligase     /     Schematic for visual evaluation only',14,'#FFFFFF');
  return base(s+footer(2,a),'Simplified diagram: target, small molecule, recruitment and degradation');
}
function cover(a) {
  let s=`<image href="../palette/assets/fels-logo-dark.svg" x="64" y="59" width="230" height="113"/>`;
  s+=text(66,234,'SMALL-MOLECULE DEGRADER PLATFORM',14,'#73BFD3','letter-spacing="2.5" font-weight="700"');
  s+=text(64,318,'Building the',55,'#fff','font-weight="700"')+text(64,384,'Next-Generation',55,'#fff','font-weight="700"')+text(64,450,'Degrader Platform',55,a,'font-weight="700"');
  s+=line(66,485,442,485,a,3)+text(66,529,'Precision therapeutics. A clear scientific vision.',20,'#C5CED8')+text(66,566,'NON-CONFIDENTIAL PRESENTATION',12,'#C5CED8','letter-spacing="2"');
  [[945,315,110],[1060,405,74],[1010,209,50]].forEach(([x,y,r])=>{s+=`<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#2992B1" stroke-width="1.5"/>`;});
  s+=line(945,315,1060,405,'#73BFD3',3)+line(945,315,1010,209,'#73BFD3',3)+`<circle cx="945" cy="315" r="27" fill="${a}"/><circle cx="1060" cy="405" r="18" fill="#0075D5"/><circle cx="1010" cy="209" r="12" fill="#73BFD3"/>`;
  return base(s+footer(3,a,true),'FELS Therapeutics cover on a dark background with the new logo',true);
}
