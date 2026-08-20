let blockAutoSave = false;
let hpHistory = {};
let languagesFixed = false;
let baseRolledHP = 0;

// BASE DE DATOS OFICIAL DE IDIOMAS DE OSE
const OSE_LANGUAGES = [
  "Osgo", "Doppelgänger", "Dracónido", "Enano", "Élfico", "Gárgola", 
  "Gnoll", "Gnomo", "Goblin", "Mediano", "Harpía", "Hobgoblin", 
  "Kóbold", "Hombre lagarto", "Medusa", "Minotauro", "Ogro", "Orco", 
  "Pixie", "Dialecto humano"
];

// UTILIDADES DOM
function setVal(id, v) { const el = document.getElementById(id); if (el) el.value = v; }
function getVal(id) { const el = document.getElementById(id); return el ? el.value : null; }
function getNum(id) { const val = parseInt(getVal(id)); return isNaN(val) ? 0 : val; }
function setText(id, text) { const el = document.getElementById(id); if (el) el.innerText = text; }
function setDisplay(id, display) { const el = document.getElementById(id); if (el) el.style.display = display; }

// MODAL DE DIÁLOGO PERSONALIZADO
let dialogResolve = null;
function showDialog(title, message, isConfirm = false) {
  return new Promise(resolve => {
    document.getElementById('dialog-title').innerText = title;
    document.getElementById('dialog-message').innerHTML = message.replace(/\n/g, '<br>');
    document.getElementById('dialog-buttons').innerHTML = isConfirm
      ? `<button type="button" class="btn-action clickable" style="background:#fff; color:#000; border:2px solid #000; padding:6px 12px; font-size:1rem;" onclick="closeDialog(false)">CANCELAR</button>
         <button type="button" class="btn-action clickable" style="padding:6px 12px; font-size:1rem;" onclick="closeDialog(true)">ACEPTAR</button>`
      : `<button type="button" class="btn-action clickable" style="padding:6px 12px; font-size:1rem;" onclick="closeDialog(true)">ACEPTAR</button>`;
    document.getElementById('custom-dialog-modal').style.display = 'flex';
    dialogResolve = resolve;
  });
}
function closeDialog(r) {
  document.getElementById('custom-dialog-modal').style.display = 'none';
  if (dialogResolve) {
    dialogResolve(r);
    dialogResolve = null;
  }
}

// ====== DETECCIÓN Y PARSER INTEGRAL DE ACCESORIOS Y OBJETOS ======
function isMagicAccessory(text) {
  if (!text) return false;
  let lower = text.toLowerCase();
  
  // Armaduras y escudos puros se gestionan en su propio selector de CA
  let isPureArmorOrShield = /^(armadura|cuero|malla|placas|coraza|escudo|rodela|broquel|paves|tarja)(\s+[\+\-]?\d+)?$/i.test(lower.trim());
  if (isPureArmorOrShield) return false;

  // Detección universal: nombres de accesorios, palabras mágicas o etiquetas de atributos/bonos
  return /anillo|colgante|collar|brazalete|brazales|pendiente|amuleto|talisman|talismán|capa|cintur[oó]n|cinto|guanteletes|guantes|diadema|yelmo|perla|broche|tiara|medall[oó]n|vara|varita|orbe|botas|piedra/i.test(lower) ||
         /maldit|m[aá]gic|bono/i.test(lower) ||
         /(?:fue|str|int|sab|wis|des|dex|con|car|cha|fuerza|destreza|constitucion|constitución|sabiduria|sabiduría|inteligencia|carisma|atq|ataque|da[nñ]o|dmg|ca|ts|pg|hp|px|xp|exp)\s*[:\+\-]/i.test(lower) ||
         /[:\+\-]\s*(?:fue|str|int|sab|wis|des|dex|con|car|cha|fuerza|destreza|constitucion|constitución|sabiduria|sabiduría|inteligencia|carisma|atq|ataque|da[nñ]o|dmg|ca|ts|pg|hp|px|xp|exp)/i.test(lower) ||
         /pg\s*[:\s]*[xX]\d+/i.test(lower);
}

function getPassiveAccessoryBonuses() {
  let bonuses = {
    ac: 0,
    save: 0,
    atk: 0,
    dmg: 0,
    xpPercent: 0,
    hpMult: 1,
    hpBonus: 0,
    fixedAC: null,
    stats: { fue: 0, int: 0, sab: 0, des: 0, con: 0, car: 0 }
  };

  document.querySelectorAll('#equipment-items-list .item-row').forEach(row => {
    let textInput = row.querySelector('input[type="text"]');
    let equipCheckbox = row.querySelector('.item-equip-cb');
    if (!textInput) return;

    let raw = textInput.value.trim();
    if (!isMagicAccessory(raw)) return;
    if (equipCheckbox && !equipCheckbox.checked) return; // En mochila (OFF) no aplica

    let lower = raw.toLowerCase();

    // 1. Modificador genérico (+X o -X)
    let bMatch = raw.match(/(?:^|\s)([\+\-]\d+)(?:\s|$|\()/);
    let mod = bMatch ? parseInt(bMatch[1]) : 0;

    // 2. Multiplicadores y bonos de PG
    let hpMultMatch = raw.match(/(?:pg|hp|vida)\s*[:\s]*[xX]\s*(\d+)/i) || raw.match(/[xX]\s*(\d+)\s*(?:pg|hp|vida)/i);
    if (hpMultMatch) {
      bonuses.hpMult *= (parseInt(hpMultMatch[1]) || 1);
    }

    let hpBonusMatch = raw.match(/([\+\-]\d+)\s*(?:pg|hp|vida|puntos de golpe)/i) || raw.match(/(?:pg|hp|vida|puntos de golpe)\s*[:\s]*([\+\-]\d+)/i);
    if (hpBonusMatch) {
      bonuses.hpBonus += parseInt(hpBonusMatch[1]);
    }

    // 3. Bono de Experiencia
    let xpMatch = raw.match(/(?:bono\s*)?(?:px|xp|exp|experiencia)\s*[:\s]*([\+\-]?\d+)\s*%/i) ||
                  raw.match(/([\+\-]?\d+)\s*%\s*(?:bono\s*)?(?:px|xp|exp|experiencia)?/i);
    if (xpMatch) {
      bonuses.xpPercent += parseInt(xpMatch[1]);
    }

    // 4. Bonos a características (FUE, DES, CON, INT, SAB, CAR)
    let statRegex = /([\+\-]?\d+)\s*(?:a\s+la\s+|de\s+)?(fue|str|int|sab|wis|des|dex|con|car|cha|fuerza|destreza|constitucion|constitución|sabiduria|sabiduría|inteligencia|carisma)\b/i;
    let statRegexRev = /\b(fue|str|int|sab|wis|des|dex|con|car|cha|fuerza|destreza|constitucion|constitución|sabiduria|sabiduría|inteligencia|carisma)\s*[:\s]*([\+\-]?\d+)/i;
    let statMatch = raw.match(statRegex) || raw.match(statRegexRev);

    if (statMatch) {
      let sMod = 0;
      let sName = "";
      if (/^[\+\-]?\d+$/.test(statMatch[1].trim())) {
        sMod = parseInt(statMatch[1]);
        sName = statMatch[2].toLowerCase();
      } else {
        sMod = parseInt(statMatch[2]);
        sName = statMatch[1].toLowerCase();
      }
      if (/fue|str|fuerza/i.test(sName)) bonuses.stats.fue += sMod;
      else if (/int|inteligencia/i.test(sName)) bonuses.stats.int += sMod;
      else if (/sab|wis|sabiduria|sabiduría/i.test(sName)) bonuses.stats.sab += sMod;
      else if (/des|dex|destreza/i.test(sName)) bonuses.stats.des += sMod;
      else if (/con|constitucion|constitución/i.test(sName)) bonuses.stats.con += sMod;
      else if (/car|cha|carisma/i.test(sName)) bonuses.stats.car += sMod;
    }

    // 5. CA fija o modificador de CA
    let caMatch = raw.match(/\bCA\s*(\d+)/i);
    if (caMatch) bonuses.fixedAC = parseInt(caMatch[1]);

    let acModMatch = raw.match(/([\+\-]\d+)\s*(?:a\s+la\s+)?(ca|defensa|armadura)\b/i) || raw.match(/\b(ca|defensa|armadura)\s*[:\s]*([\+\-]\d+)/i);
    if (acModMatch) {
      bonuses.ac += (parseInt(acModMatch[1]) || parseInt(acModMatch[2]));
    }

    // 6. Salvaciones (TS)
    let saveModMatch = raw.match(/([\+\-]\d+)\s*(?:a\s+las?\s+)?(ts|salvaci[oó]n|salvaciones)\b/i) || raw.match(/\b(ts|salvaci[oó]n|salvaciones)\s*[:\s]*([\+\-]\d+)/i);
    if (saveModMatch) {
      bonuses.save += (parseInt(saveModMatch[1]) || parseInt(saveModMatch[2]));
    }

    // 7. Ataque y Daño directos
    let atkModMatch = raw.match(/([\+\-]\d+)\s*(?:al?\s+)?(atq|ataque|impactar)\b/i) || raw.match(/\b(atq|ataque|impactar)\s*[:\s]*([\+\-]\d+)/i);
    if (atkModMatch) {
      bonuses.atk += (parseInt(atkModMatch[1]) || parseInt(atkModMatch[2]));
    }
    let dmgModMatch = raw.match(/([\+\-]\d+)\s*(?:al?\s+)?(da[nñ]o|dmg)/i) || raw.match(/\b(da[nñ]o|dmg)\s*[:\s]*([\+\-]\d+)/i);
    if (dmgModMatch) {
      bonuses.dmg += (parseInt(dmgModMatch[1]) || parseInt(dmgModMatch[2]));
    }

    // 8. Objetos clásicos
    if (/protecci[oó]n|defensa|resistencia/i.test(lower) && !statMatch && !acModMatch && !saveModMatch) {
      bonuses.ac += (mod || 1);
      bonuses.save += (mod || 1);
    } else if (/ogro/i.test(lower) && !statMatch) {
      bonuses.stats.fue += (mod || 2);
    } else if (mod !== 0 && !statMatch && !acModMatch && !saveModMatch && !atkModMatch && !dmgModMatch && !xpMatch && !hpMultMatch && !hpBonusMatch) {
      bonuses.ac += mod;
      bonuses.save += mod;
    }
  });

  return bonuses;
}

function getEffectiveStat(statKey) {
  let base = getNum('stat-' + statKey);
  let bonus = getPassiveAccessoryBonuses().stats[statKey] || 0;
  return Math.max(1, base + bonus);
}

// ====== ASISTENTE DE CREACIÓN (WIZARD) ======
function goWizStep(step) {
  for (let i = 0; i <= 5; i++) {
    let el = document.getElementById('wiz-step-' + i);
    if (el) el.style.display = (i === step) ? 'flex' : 'none';
  }
  let langStep = document.getElementById('wiz-step-lang');
  if (langStep) langStep.style.display = 'none';
}

function startDirect() {
  blockAutoSave = false;
  document.getElementById('wizard-overlay').style.display = 'none';
  document.getElementById('main-sheet').style.display = 'block';
  autoSave();
}

function startGuided() {
  ['fue', 'int', 'sab', 'des', 'con', 'car'].forEach(s => {
    setVal('wiz-stat-' + s, getVal('stat-' + s) || 10);
  });
  goWizStep(1);
}

function randomizeWizStats() {
  let r = () => (Math.floor(Math.random() * 6) + 1) + (Math.floor(Math.random() * 6) + 1) + (Math.floor(Math.random() * 6) + 1);
  ['fue', 'int', 'sab', 'des', 'con', 'car'].forEach(s => setVal('wiz-stat-' + s, r()));
}

async function acceptWizStats() {
  let stats = ['fue', 'int', 'sab', 'des', 'con', 'car'];
  for (let s of stats) {
    let v = getNum('wiz-stat-' + s);
    if (v < 3 || v > 18) {
      await showDialog('AVISO', 'Todas las características deben tener un valor entre 3 y 18.');
      return;
    }
    setVal('stat-' + s, v);
  }
  setVal('stats-fixed', 'true');
  applyStatsFixedState();
  runAutoCalculations(false);

  let classSel = document.getElementById('wiz-class');
  classSel.innerHTML = document.getElementById('char-class').innerHTML;
  if (classSel.options[classSel.selectedIndex].disabled) {
    classSel.value = 'guerrero';
  }
  goWizStep(2);
}

function acceptWizClass() {
  let wizC = document.getElementById('wiz-class');
  let opt = wizC.options[wizC.selectedIndex];
  if (opt.disabled) return;

  setVal('char-class', opt.value);
  setVal('char-align', getVal('wiz-align'));
  runAutoCalculations(true);

  renderWizLanguages();
}

let wizSelectedExtraLangs = [];
function renderWizLanguages() {
  for (let i = 0; i <= 5; i++) {
    let el = document.getElementById('wiz-step-' + i);
    if (el) el.style.display = 'none';
  }
  let stepLang = document.getElementById('wiz-step-lang');
  if (stepLang) stepLang.style.display = 'flex';

  const intVal = getNum('wiz-stat-int') || getEffectiveStat('int');
  const cls = getVal('char-class');
  const align = getVal('char-align') || "Neutral";
  
  let maxExtra = intVal >= 18 ? 3 : intVal >= 16 ? 2 : intVal >= 13 ? 1 : 0;

  let statusText = intVal <= 3 ? "ANALFABETO (PALABRAS SUELTAS)" :
                   intVal <= 5 ? "ANALFABETO" :
                   intVal <= 8 ? "EDUCACIÓN BÁSICA" :
                   maxExtra > 0 ? `INSTRUÍDO (+${maxExtra} IDIOMA${maxExtra > 1 ? 'S' : ''} EXTRA)` : "INSTRUÍDO";

  setText('wiz-lang-status', statusText);
  setText('wiz-lang-desc', maxExtra > 0 ? `Tu Inteligencia (${intVal}) te permite elegir hasta ${maxExtra} idioma(s) adicional(es):` : `Idiomas nativos de tu personaje:`);

  let baseLangs = ["Común"];
  if (align !== "Neutral") baseLangs.push(`Alineamiento (${align})`);
  if (cls === 'enano') baseLangs.push("Enano", "Gnomo", "Goblin", "Kóbold");
  if (cls === 'elfo') baseLangs.push("Élfico", "Gnoll", "Hobgoblin", "Orco");
  if (cls === 'mediano') baseLangs.push("Mediano");

  wizSelectedExtraLangs = [];
  const container = document.getElementById('wiz-lang-list');
  container.innerHTML = `<div style="font-size:0.8rem; font-weight:bold; margin-bottom:4px;">NATIVOS: ${baseLangs.join(', ')}</div>`;

  if (maxExtra > 0) {
    OSE_LANGUAGES.forEach(lang => {
      if (baseLangs.some(b => b.toLowerCase() === lang.toLowerCase())) return;
      let btn = document.createElement('div');
      btn.className = 'lang-item-select';
      btn.innerHTML = `<span>${lang}</span><span>+</span>`;
      btn.onclick = () => {
        let idx = wizSelectedExtraLangs.findIndex(l => l.toLowerCase() === lang.toLowerCase());
        if (idx !== -1) {
          wizSelectedExtraLangs.splice(idx, 1);
          btn.classList.remove('selected');
          btn.querySelector('span:last-child').innerText = '+';
        } else {
          if (wizSelectedExtraLangs.length >= maxExtra) {
            showDialog('LÍMITE DE IDIOMAS', `Tu Inteligencia (${intVal}) solo te permite aprender hasta ${maxExtra} idioma(s) extra.`);
            return;
          }
          wizSelectedExtraLangs.push(lang);
          btn.classList.add('selected');
          btn.querySelector('span:last-child').innerText = '✓';
        }
      };
      container.appendChild(btn);
    });
  }
}

function acceptWizLanguages() {
  const cls = getVal('char-class');
  const align = getVal('char-align') || "Neutral";
  
  let baseLangs = ["Común"];
  if (align !== "Neutral") baseLangs.push(`Alineamiento (${align})`);
  if (cls === 'enano') baseLangs.push("Enano", "Gnomo", "Goblin", "Kóbold");
  if (cls === 'elfo') baseLangs.push("Élfico", "Gnoll", "Hobgoblin", "Orco");
  if (cls === 'mediano') baseLangs.push("Mediano");

  let allLangs = baseLangs.concat(wizSelectedExtraLangs);
  setVal('char-languages', allLangs.join(', '));
  languagesFixed = true;
  applyStatsFixedState();
  autoSave();

  let hd = OSE.gHD(cls);
  let modCon = OSE.gM(getEffectiveStat('con'));
  document.getElementById('wiz-hp-info').innerText = `Tu clase (${cls.toUpperCase()}) usa dados de ${hd} caras (1d${hd}). Mod. CON: ${OSE.fS(modCon)}.`;

  const dieInput = document.getElementById('wiz-hp-die');
  dieInput.max = hd;
  dieInput.value = '';
  
  setText('wiz-hp-die-label', `TIRAR 1d${hd}`);

  // Chip de CON con color semántico (gris neutro si es 0 para diferenciarlo del botón)
  const conChip = document.getElementById('wiz-chip-con');
  if (conChip) {
    conChip.innerText = `CON: ${OSE.fS(modCon)}`;
    conChip.style.background = modCon > 0 ? '#2e7d32' : modCon < 0 ? '#c62828' : '#555';
    conChip.style.borderColor = modCon > 0 ? '#1b5e20' : modCon < 0 ? '#b71c1c' : '#555';
  }

  setVal('wiz-hp-val', '');
  goWizStep(3);
}

function calcWizHPTotal() {
  let cls = getVal('char-class');
  let hd = OSE.gHD(cls);
  let dieInp = document.getElementById('wiz-hp-die');
  let rawVal = dieInp.value;

  if (rawVal === '') {
    setText('wiz-hp-die-label', `TIRAR 1d${hd}`);
    setVal('wiz-hp-val', '');
    return;
  }

  let dieVal = parseInt(rawVal);
  if (isNaN(dieVal)) {
    setText('wiz-hp-die-label', `TIRAR 1d${hd}`);
    setVal('wiz-hp-val', '');
    return;
  }
  if (dieVal > hd) {
    dieVal = hd;
    dieInp.value = hd;
  }
  if (dieVal < 1) {
    dieVal = 1;
    dieInp.value = 1;
  }

  setText('wiz-hp-die-label', `1d${hd}: ${dieVal}`);

  let modCon = OSE.gM(getEffectiveStat('con'));
  let total = Math.max(1, dieVal + modCon);

  const conChip = document.getElementById('wiz-chip-con');
  if (conChip) {
    conChip.innerText = `CON: ${OSE.fS(modCon)}`;
    conChip.style.background = modCon > 0 ? '#2e7d32' : modCon < 0 ? '#c62828' : '#555';
    conChip.style.borderColor = modCon > 0 ? '#1b5e20' : modCon < 0 ? '#b71c1c' : '#555';
  }

  setVal('wiz-hp-val', total);
}

function rollWizHP() {
  let cls = getVal('char-class');
  let hd = OSE.gHD(cls);
  let r = Math.floor(Math.random() * hd) + 1;
  setVal('wiz-hp-die', r);
  calcWizHPTotal();
}

async function acceptWizHP() {
  let hp = getNum('wiz-hp-val');
  if (hp <= 0 || getVal('wiz-hp-die') === '') {
    await showDialog('AVISO', 'Debes tirar o introducir un resultado para tu Dado de Golpe.');
    return;
  }
  baseRolledHP = hp;
  hpHistory = { 1: hp };
  let flag = document.getElementById('initial-hp-rolled');
  if (flag) flag.value = 'true';
  if (document.getElementById('btn-roll-hp')) document.getElementById('btn-roll-hp').style.display = 'none';

  calculateArmorClass();
  runAutoCalculations(false);
  setVal('hp-current', getNum('hp-max')); // Asignar PG actuales al máximo automáticamente

  setVal('wiz-gold-val', '');
  goWizStep(4);
}

function rollWizGold() {
  let g = ((Math.floor(Math.random() * 6) + 1) + (Math.floor(Math.random() * 6) + 1) + (Math.floor(Math.random() * 6) + 1)) * 10;
  setVal('wiz-gold-val', g);
}

async function acceptWizGold() {
  let g = getNum('wiz-gold-val');
  if (g < 0) g = 0;
  setVal('coin-mo', g);
  let flag = document.getElementById('initial-gold-rolled');
  if (flag) flag.value = 'true';
  if (document.getElementById('btn-initial-gold')) document.getElementById('btn-initial-gold').style.display = 'none';

  renderWizShop();
  goWizStep(5);
}

function renderWizShop() {
  document.getElementById('wiz-gold-display').innerText = getNum('coin-mo') + ' mo';
  const container = document.getElementById('wiz-shop-container');
  container.innerHTML = '';
  OSE_SHOP_DB.forEach(cat => {
    let details = document.createElement('details');
    details.style.marginBottom = "4px";
    details.innerHTML = `<summary style="cursor:pointer; padding:6px 10px; background:#222; color:#fff; font-family:var(--font-heading); font-size:1.05rem; border-radius:2px;">${cat.cat}</summary><div class="cat-items" style="padding-top:4px;"></div>`;
    let catContainer = details.querySelector('.cat-items');
    cat.i.forEach(item => {
      let div = document.createElement('div');
      div.className = 'modal-spell-item';
      div.style.marginBottom = "2px";
      div.style.background = "#fff";
      div.innerHTML = `
        <div style="flex:1;">
          <span style="font-weight:bold; font-family:var(--font-heading); font-size:1rem;">${item.n}</span><br>
          <span style="font-size:0.75rem; font-style:italic; color:#444;">Peso: ${item.w} mo${item.d ? ` | <b>${item.d}</b>` : ''}</span>
        </div>
        <button type="button" class="btn-action clickable" style="font-size:0.9rem;" onclick="buyWizItem('${item.n}', ${item.p}, ${item.w})">${item.p} mo</button>
      `;
      catContainer.appendChild(div);
    });
    container.appendChild(details);
  });
}

async function buyWizItem(name, price, weight) {
  let currentMo = getNum('coin-mo');
  if (currentMo >= price) {
    setVal('coin-mo', currentMo - price);
    addEquipmentRow(name, weight, false, true);
    document.getElementById('wiz-gold-display').innerText = getNum('coin-mo') + ' mo';
    await showDialog('COMPRA REALIZADA', `Has comprado ${name} por ${price} mo.`);
  } else {
    await showDialog('FONDOS INSUFICIENTES', `No tienes oro suficiente para comprar ${name}. Cuesta ${price} mo.`);
  }
}

function finishWizard() {
  blockAutoSave = false;
  document.getElementById('wizard-overlay').style.display = 'none';
  document.getElementById('main-sheet').style.display = 'block';
  updateInventoryDerived();
  autoSave();
}

// ====== BASE DE DATOS DE REGLAS OSE (CON DAÑO Y CA OFICIALES) ======
const OSE_SHOP_DB = [
  { 
    cat: "Armaduras", 
    i: [
      { n: "Armadura de Cuero", p: 20, w: 200, d: "CA 12 [7]" }, 
      { n: "Cota de Malla", p: 40, w: 400, d: "CA 14 [5]" }, 
      { n: "Armadura de Placas", p: 60, w: 500, d: "CA 16 [3]" }, 
      { n: "Escudo", p: 10, w: 100, d: "+1 CA [-1]" }
    ] 
  },
  { 
    cat: "Armas cuerpo a cuerpo", 
    i: [
      { n: "Alabarda (1d10)", p: 7, w: 150, d: "Daño 1d10 (2 manos)" }, 
      { n: "Bastón (1d4)", p: 2, w: 40, d: "Daño 1d4 (2 manos, contundente)" }, 
      { n: "Daga (1d4)", p: 3, w: 10, d: "Daño 1d4 (melé/arrojadiza)" }, 
      { n: "Espada a dos manos (1d10)", p: 15, w: 150, d: "Daño 1d10 (2 manos)" }, 
      { n: "Espada corta (1d6)", p: 7, w: 30, d: "Daño 1d6" }, 
      { n: "Espada normal (1d8)", p: 10, w: 60, d: "Daño 1d8" }, 
      { n: "Garrote (1d4)", p: 3, w: 50, d: "Daño 1d4 (contundente)" }, 
      { n: "Hacha de batalla (1d8)", p: 7, w: 50, d: "Daño 1d8 (2 manos)" }, 
      { n: "Hacha de mano (1d6)", p: 4, w: 30, d: "Daño 1d6 (melé/arrojadiza)" }, 
      { n: "Lanza (1d6)", p: 3, w: 30, d: "Daño 1d6" }, 
      { n: "Lanza de caballería (1d10)", p: 4, w: 120, d: "Daño 1d10 (montado)" }, 
      { n: "Martillo de guerra (1d6)", p: 5, w: 30, d: "Daño 1d6 (contundente)" }, 
      { n: "Maza (1d6)", p: 5, w: 30, d: "Daño 1d6 (contundente)" }, 
      { n: "Pica (1d10)", p: 5, w: 150, d: "Daño 1d10 (2 manos)" }
    ] 
  },
  { 
    cat: "Armas a distancia", 
    i: [
      { n: "Arco corto (1d6)", p: 25, w: 20, d: "Daño 1d6 (2 manos)" }, 
      { n: "Arco largo (1d6)", p: 40, w: 30, d: "Daño 1d6 (2 manos)" }, 
      { n: "Ballesta (1d6)", p: 30, w: 50, d: "Daño 1d6 (2 manos)" }, 
      { n: "Honda (1d4)", p: 2, w: 20, d: "Daño 1d4" }, 
      { n: "Jabalina (1d4)", p: 3, w: 20, d: "Daño 1d4 (arrojadiza)" }
    ] 
  },
  { 
    cat: "Munición", 
    i: [
      { n: "Carcaj", p: 1, w: 0 }, 
      { n: "Flechas (x20)", p: 5, w: 20 }, 
      { n: "Flecha de plata (x1)", p: 5, w: 1 }, 
      { n: "Piedras para honda", p: 0, w: 0 }, 
      { n: "Virotes (x30)", p: 10, w: 30 }, 
      { n: "Caja de virotes", p: 1, w: 0 }
    ] 
  },
  { 
    cat: "Equipo de aventura", 
    i: [
      { n: "Aceite (1 frasco)", p: 2, w: 10 }, 
      { n: "Acónito (1 manojo)", p: 10, w: 0 }, 
      { n: "Agua bendita (1 vial)", p: 25, w: 0 }, 
      { n: "Ajo", p: 5, w: 0 }, 
      { n: "Antorchas (x6)", p: 1, w: 120 }, 
      { n: "Clavos de hierro (x12)", p: 1, w: 10 }, 
      { n: "Cuerda (50')", p: 1, w: 50 }, 
      { n: "Espejo de acero", p: 5, w: 0 }, 
      { n: "Estaca de madera y mazo", p: 3, w: 10 }, 
      { n: "Garfio de anclaje", p: 25, w: 40 }, 
      { n: "Herramientas de ladrón", p: 25, w: 10 }, 
      { n: "Linterna", p: 10, w: 30 }, 
      { n: "Manta de invierno", p: 1, w: 10 }, 
      { n: "Martillo (pequeño)", p: 2, w: 10 }, 
      { n: "Mochila", p: 5, w: 20 }, 
      { n: "Odre de agua", p: 1, w: 5 }, 
      { n: "Pala", p: 2, w: 50 }, 
      { n: "Pértiga de madera (10')", p: 1, w: 100 }, 
      { n: "Pico", p: 2, w: 50 }, 
      { n: "Raciones de hierro (7 días)", p: 15, w: 70 }, 
      { n: "Raciones normales (7 días)", p: 5, w: 200 }, 
      { n: "Saco (grande)", p: 2, w: 5 }, 
      { n: "Saco (pequeño)", p: 1, w: 1 }, 
      { n: "Símbolo sagrado (madera)", p: 2, w: 0 }, 
      { n: "Símbolo sagrado (plata)", p: 25, w: 0 }, 
      { n: "Tiza (x10)", p: 1, w: 0 }, 
      { n: "Velas (x10)", p: 1, w: 0 }, 
      { n: "Yesca y pedernal", p: 3, w: 0 }
    ] 
  }
];

const OSE = {
  gM: s => (!s || s === 0) ? 0 : s <= 3 ? -3 : s <= 5 ? -2 : s <= 8 ? -1 : s <= 12 ? 0 : s <= 15 ? 1 : s <= 17 ? 2 : 3,
  fS: v => v >= 0 ? `+${v}` : `${v}`,
  gHD: c => ['guerrero', 'enano'].includes(c) ? 8 : ['clerigo', 'elfo', 'mediano'].includes(c) ? 6 : 4,
  gCombat: (c, l) => {
    let g = 19, b = 0;
    if (['guerrero', 'enano', 'elfo', 'mediano'].includes(c)) {
      if (l <= 3) { g = 19; b = 0; } else if (l <= 6) { g = 17; b = 2; } else if (l <= 9) { g = 14; b = 5; } else if (l <= 12) { g = 12; b = 7; } else { g = 10; b = 9; }
    } else if (['clerigo', 'ladron'].includes(c)) {
      if (l <= 4) { g = 19; b = 0; } else if (l <= 8) { g = 17; b = 2; } else if (l <= 12) { g = 14; b = 5; } else { g = 12; b = 7; }
    } else {
      if (l <= 5) { g = 19; b = 0; } else if (l <= 10) { g = 17; b = 2; } else { g = 14; b = 5; }
    }
    return { g, b };
  },
  gSave: (c, l) => {
    if (c === 'clerigo') return l <= 4 ? [11, 12, 14, 16, 15] : l <= 8 ? [9, 10, 12, 14, 12] : l <= 12 ? [6, 7, 9, 11, 9] : [3, 5, 7, 8, 7];
    if (c === 'enano' || c === 'mediano') return l <= 3 ? [8, 9, 10, 13, 12] : l <= 6 ? [6, 7, 8, 10, 10] : l <= 9 ? [4, 5, 6, 7, 8] : [2, 3, 4, 4, 6];
    if (c === 'elfo') return l <= 3 ? [12, 13, 13, 15, 15] : l <= 6 ? [10, 11, 11, 13, 12] : l <= 9 ? [8, 9, 9, 10, 10] : [6, 7, 8, 8, 8];
    if (c === 'guerrero') return l <= 3 ? [12, 13, 14, 15, 16] : l <= 6 ? [10, 11, 12, 13, 13] : l <= 9 ? [8, 9, 10, 10, 11] : l <= 12 ? [6, 7, 8, 8, 9] : [4, 5, 6, 5, 7];
    if (c === 'ladron') return l <= 4 ? [13, 14, 13, 16, 15] : l <= 8 ? [12, 13, 11, 14, 13] : l <= 12 ? [10, 11, 9, 12, 10] : [8, 9, 7, 10, 8];
    return l <= 5 ? [13, 14, 13, 16, 15] : l <= 10 ? [11, 12, 11, 14, 12] : [8, 9, 8, 11, 8];
  },
  thief: [null, { ac: 15, et: 10, rb: 20, ms: 20, es: 10, em: 87, er: 33, bs: "x2" }, { ac: 20, et: 15, rb: 25, ms: 25, es: 15, em: 88, er: 33, bs: "x2" }, { ac: 25, et: 20, rb: 30, ms: 30, es: 20, em: 89, er: 50, bs: "x2" }, { ac: 30, et: 25, rb: 35, ms: 35, es: 25, em: 90, er: 50, bs: "x2" }, { ac: 35, et: 30, rb: 40, ms: 40, es: 30, em: 91, er: 50, bs: "x3" }, { ac: 45, et: 40, rb: 45, ms: 45, es: 36, em: 92, er: 66, bs: "x3" }, { ac: 55, et: 50, rb: 55, ms: 55, es: 45, em: 93, er: 66, bs: "x3" }, { ac: 65, et: 60, rb: 65, ms: 65, es: 55, em: 94, er: 66, bs: "x3" }, { ac: 75, et: 70, rb: 75, ms: 75, es: 65, em: 95, er: 66, bs: "x4" }, { ac: 85, et: 80, rb: 85, ms: 85, es: 75, em: 96, er: 83, bs: "x4" }, { ac: 95, et: 90, rb: 95, ms: 95, es: 85, em: 97, er: 83, bs: "x4" }, { ac: 97, et: 95, rb: 105, ms: 97, es: 90, em: 98, er: 83, bs: "x4" }, { ac: 99, et: 97, rb: 115, ms: 99, es: 95, em: 99, er: 83, bs: "x5" }, { ac: 99, et: 99, rb: 125, ms: 99, es: 99, em: 99, er: 83, bs: "x5" }],
  tUndead: [null, ["7", "9", "11", "—", "—", "—", "—", "—"], ["E", "7", "9", "11", "—", "—", "—", "—"], ["E", "E", "7", "9", "11", "—", "—", "—"], ["D", "E", "E", "7", "9", "11", "—", "—"], ["D", "D", "E", "E", "7", "9", "11", "—"], ["D", "D", "D", "E", "E", "7", "9", "11"], ["D", "D", "D", "D", "E", "E", "7", "9"], ["D", "D", "D", "D", "D", "E", "E", "7"], ["D", "D", "D", "D", "D", "D", "E", "E"], ["D", "D", "D", "D", "D", "D", "D", "E"], ["D", "D", "D", "D", "D", "D", "D", "D"]],
  sCleric: [null, [0, 0, 0, 0, 0], [1, 0, 0, 0, 0], [2, 0, 0, 0, 0], [2, 1, 0, 0, 0], [2, 2, 0, 0, 0], [2, 2, 1, 1, 0], [2, 2, 2, 1, 1], [3, 3, 2, 2, 1], [3, 3, 3, 2, 2], [4, 4, 3, 3, 2], [4, 4, 4, 3, 3], [5, 5, 4, 4, 3], [5, 5, 5, 4, 4], [6, 5, 5, 5, 4]],
  sMage: [null, [1, 0, 0, 0, 0, 0], [2, 0, 0, 0, 0, 0], [2, 1, 0, 0, 0, 0], [2, 2, 0, 0, 0, 0], [2, 2, 1, 0, 0, 0], [2, 2, 2, 0, 0, 0], [3, 2, 2, 1, 0, 0], [3, 3, 2, 2, 0, 0], [3, 3, 3, 2, 1, 0], [3, 3, 3, 3, 2, 0], [4, 3, 3, 3, 2, 1], [4, 4, 3, 3, 3, 2], [4, 4, 4, 3, 3, 3], [4, 4, 4, 4, 3, 3]],
  sElf: [null, [1, 0, 0, 0, 0], [2, 0, 0, 0, 0], [2, 1, 0, 0, 0], [2, 2, 0, 0, 0], [2, 2, 1, 0, 0], [2, 2, 2, 0, 0], [3, 2, 2, 1, 0], [3, 3, 2, 2, 0], [3, 3, 3, 2, 1], [3, 3, 3, 3, 2]],
  xp: { guerrero: [0, 2000, 4000, 8000, 16000, 32000, 64000, 120000, 240000, 360000, 480000, 600000, 720000, 840000], clerigo: [0, 1500, 3000, 6000, 12000, 25000, 50000, 100000, 200000, 300000, 400000, 500000, 600000, 700000], enano: [0, 2200, 4400, 8800, 17000, 35000, 70000, 140000, 270000, 400000, 530000, 660000], elfo: [0, 4000, 8000, 16000, 32000, 64000, 120000, 250000, 400000, 600000], mediano: [0, 2000, 4000, 8000, 16000, 32000, 64000, 120000], ladron: [0, 1200, 2400, 4800, 9600, 20000, 40000, 80000, 160000, 280000, 400000, 520000, 640000, 760000], mago: [0, 2500, 5000, 10000, 20000, 40000, 80000, 150000, 300000, 450000, 600000, 750000, 900000, 1050000] }
};

const MAX_LEVELS = { guerrero: 14, clerigo: 14, enano: 12, elfo: 10, mediano: 8, ladron: 14, mago: 14 };

// ====== SISTEMA DE EFECTOS TEMPORALES ======
let activeEffects = [];

function updateActiveEffectsUI() {
  const list = document.getElementById('active-effects-list');
  const noEffMsg = document.getElementById('no-effects-msg');
  if (!list) return;

  list.innerHTML = '';
  if (activeEffects.length === 0) {
    if (noEffMsg) list.appendChild(noEffMsg);
    else list.innerHTML = '<span id="no-effects-msg" style="font-size:0.75rem; font-style:italic; color:#666;">Ningún efecto activo</span>';
    return;
  }

  activeEffects.forEach(eff => {
    let badge = document.createElement('span');
    badge.className = 'trait-badge';
    let isDebuff = (eff.type === 'debuff' || (eff.ac < 0 || eff.atk < 0 || eff.dmg < 0 || eff.save < 0));
    badge.style.background = isDebuff ? '#880000' : '#0056b3';
    badge.style.fontSize = '0.8rem';
    badge.style.display = 'inline-flex';
    badge.style.alignItems = 'center';
    badge.style.gap = '6px';
    badge.style.padding = '3px 8px';

    let descParts = [];
    if (eff.name === 'Escudo') {
      descParts.push('CA 17 [2] proy');
    } else if (eff.dmgDice) {
      descParts.push(`+${eff.dmgDice} daño`);
    } else {
      if (eff.ac && eff.ac !== 0) descParts.push(`${OSE.fS(eff.ac)} CA`);
    }
    if (eff.atk && eff.atk !== 0) descParts.push(`${OSE.fS(eff.atk)} Atq`);
    if (eff.dmg && eff.dmg !== 0) descParts.push(`${OSE.fS(eff.dmg)} Daño`);
    if (eff.save && eff.save !== 0) descParts.push(`${OSE.fS(eff.save)} TS`);

    let descStr = '';
    if (descParts.length > 0) {
      descStr = eff.name === 'Escudo' ? ` ${descParts.join(', ')}` : ` (${descParts.join(', ')})`;
    }

    badge.innerHTML = `<span>${eff.name}${descStr}</span><button type="button" onclick="removeActiveEffect('${eff.id}')" style="background:none; border:none; color:#fff; font-weight:bold; cursor:pointer; font-size:0.9rem; padding:0 2px;" title="Desactivar">✕</button>`;
    list.appendChild(badge);
  });
}

function openAddEffectModal() {
  setVal('custom-eff-name', '');
  setVal('custom-eff-ac', '0');
  setVal('custom-eff-atk', '0');
  setVal('custom-eff-dmg', '0');
  setVal('custom-eff-save', '0');
  setDisplay('add-effect-modal', 'flex');
}

function addEffectFromPreset(name, acMod, atkMod, dmgMod, saveMod, type) {
  let id = 'eff_' + Date.now() + '_' + Math.floor(Math.random() * 100);
  activeEffects.push({ id, name, ac: acMod, atk: atkMod, dmg: dmgMod, save: saveMod, type });
  updateActiveEffectsUI();
  calculateArmorClass();
  autoSave();
  setDisplay('add-effect-modal', 'none');
}

function addCustomEffect() {
  let name = getVal('custom-eff-name').trim();
  if (!name) name = 'Efecto Temporal';
  let acMod = getNum('custom-eff-ac');
  let atkMod = getNum('custom-eff-atk');
  let dmgMod = getNum('custom-eff-dmg');
  let saveMod = getNum('custom-eff-save');
  let type = (acMod < 0 || atkMod < 0 || dmgMod < 0 || saveMod < 0) ? 'debuff' : 'buff';
  let id = 'eff_' + Date.now() + '_' + Math.floor(Math.random() * 100);

  activeEffects.push({ id, name, ac: acMod, atk: atkMod, dmg: dmgMod, save: saveMod, type });
  updateActiveEffectsUI();
  calculateArmorClass();
  autoSave();
  setDisplay('add-effect-modal', 'none');
}

function removeActiveEffect(effId) {
  activeEffects = activeEffects.filter(e => e.id !== effId && e.name !== effId);
  updateActiveEffectsUI();
  calculateArmorClass();
  autoSave();
}

function getActiveEffectAtkBonus() {
  let b = 0;
  activeEffects.forEach(e => { if (e.atk) b += e.atk; });
  return b;
}

function getActiveEffectDmgBonus() {
  let b = 0;
  activeEffects.forEach(e => { if (e.dmg) b += e.dmg; });
  return b;
}

function getActiveEffectAcBonus() {
  let b = 0;
  activeEffects.forEach(e => { if (e.ac && typeof e.ac === 'number') b += e.ac; });
  return b;
}

function getActiveEffectSaveBonus() {
  let b = 0;
  activeEffects.forEach(e => { if (e.save) b += e.save; });
  return b;
}

// ====== GESTIÓN DE IDIOMAS Y ALFABETIZACIÓN OFICIAL OSE ======
let modalSelectedLangs = [];

function onAlignmentChange() {
  const align = getVal('char-align') || "Neutral";
  let langTextarea = document.getElementById('char-languages');
  if (!langTextarea) return;

  let currentText = langTextarea.value;
  
  // Limpiar alineamientos anteriores
  currentText = currentText.replace(/,?\s*Alineamiento\s*\([^\)]*\)/ig, '').trim();
  currentText = currentText.replace(/^,+|,+$/g, '').trim();

  if (align !== "Neutral") {
    langTextarea.value = currentText ? `${currentText}, Alineamiento (${align})` : `Alineamiento (${align})`;
  } else {
    langTextarea.value = currentText;
  }
  
  autoSave();
}

function updateLiteracyAndLanguages() {
  const intVal = getEffectiveStat('int');
  const cls = getVal('char-class');
  const align = getVal('char-align') || "Neutral";
  
  let isBasic = intVal >= 6 && intVal <= 8;
  let maxExtra = intVal >= 18 ? 3 : intVal >= 16 ? 2 : intVal >= 13 ? 1 : 0;

  let badgeText = intVal <= 3 ? "ANALFABETO (PALABRAS SUELTAS)" :
                  intVal <= 5 ? "ANALFABETO" :
                  isBasic ? "EDUCACIÓN BÁSICA" :
                  maxExtra > 0 ? `INSTRUÍDO (+${maxExtra} EXTRA)` : "INSTRUÍDO";

  setText('lang-literacy-badge', badgeText);

  const isStatsFixed = (getVal('stats-fixed') === 'true');
  const btnChooseLang = document.getElementById('btn-choose-languages');
  if (btnChooseLang) {
    btnChooseLang.style.display = (!languagesFixed && maxExtra > 0 && isStatsFixed) ? 'inline-flex' : 'none';
  }

  let langTextarea = document.getElementById('char-languages');
  if (langTextarea) {
    let baseLangs = ["Común"];
    if (align !== "Neutral") baseLangs.push(`Alineamiento (${align})`);
    if (cls === 'enano') baseLangs.push("Enano", "Gnomo", "Goblin", "Kóbold");
    if (cls === 'elfo') baseLangs.push("Élfico", "Gnoll", "Hobgoblin", "Orco");
    if (cls === 'mediano') baseLangs.push("Mediano");

    if (!langTextarea.value.trim()) {
      langTextarea.value = baseLangs.join(', ');
    } else if (maxExtra === 0 && languagesFixed) {
      langTextarea.value = baseLangs.join(', ');
      languagesFixed = false;
    }
  }
}

function openLanguageModal() {
  if (getVal('stats-fixed') !== 'true') {
    showDialog('AVISO', 'Debes fijar primero tus características (botón ACEPTAR) antes de poder elegir y fijar tus idiomas.');
    return;
  }

  if (languagesFixed) {
    showDialog('AVISO', 'Los idiomas de este personaje ya han sido fijados definitivamente.');
    return;
  }

  const intVal = getEffectiveStat('int');
  const cls = getVal('char-class');
  const align = getVal('char-align') || "Neutral";
  let maxExtra = intVal >= 18 ? 3 : intVal >= 16 ? 2 : intVal >= 13 ? 1 : 0;

  if (maxExtra <= 0) {
    showDialog('IDIOMAS ADICIONALES', `Tu Inteligencia (${intVal}) no te permite elegir idiomas adicionales.`);
    return;
  }

  let currentText = getVal('char-languages') || "";
  let currentList = currentText.split(',').map(s => s.trim()).filter(s => s.length > 0);

  let baseLangs = ["Común"];
  if (align !== "Neutral") baseLangs.push(`Alineamiento (${align})`);
  if (cls === 'enano') baseLangs.push("Enano", "Gnomo", "Goblin", "Kóbold");
  if (cls === 'elfo') baseLangs.push("Élfico", "Gnoll", "Hobgoblin", "Orco");
  if (cls === 'mediano') baseLangs.push("Mediano");

  modalSelectedLangs = [...currentList];

  setText('lang-modal-info', `INT ${intVal}: Puedes elegir hasta ${maxExtra} idioma(s) extra.`);
  
  const listContainer = document.getElementById('lang-modal-list');
  listContainer.innerHTML = '';

  OSE_LANGUAGES.forEach(lang => {
    if (baseLangs.some(b => b.toLowerCase() === lang.toLowerCase())) return;
    let isSelected = modalSelectedLangs.some(m => m.toLowerCase() === lang.toLowerCase());
    
    let div = document.createElement('div');
    div.className = 'lang-item-select' + (isSelected ? ' selected' : '');
    div.innerHTML = `<span>${lang}</span><span>${isSelected ? '✓' : '+'}</span>`;
    div.onclick = () => {
      let idx = modalSelectedLangs.findIndex(l => l.toLowerCase() === lang.toLowerCase());
      if (idx !== -1) {
        modalSelectedLangs.splice(idx, 1);
        div.classList.remove('selected');
        div.querySelector('span:last-child').innerText = '+';
      } else {
        let currentExtraCount = modalSelectedLangs.filter(l => !baseLangs.some(b => b.toLowerCase() === l.toLowerCase())).length;
        if (currentExtraCount >= maxExtra) {
          showDialog('LÍMITE DE IDIOMAS', `Tu Inteligencia (${intVal}) solo te permite aprender hasta ${maxExtra} idioma(s) extra.`);
          return;
        }
        modalSelectedLangs.push(lang);
        div.classList.add('selected');
        div.querySelector('span:last-child').innerText = '✓';
      }
    };
    listContainer.appendChild(div);
  });

  setVal('custom-lang-input', '');
  setDisplay('language-modal', 'flex');
}

function closeLanguageModal() {
  setDisplay('language-modal', 'none');
}

function addCustomLanguage() {
  let val = getVal('custom-lang-input').trim();
  if (!val) return;
  const intVal = getEffectiveStat('int');
  const cls = getVal('char-class');
  const align = getVal('char-align') || "Neutral";
  let maxExtra = intVal >= 18 ? 3 : intVal >= 16 ? 2 : intVal >= 13 ? 1 : 0;

  let baseLangs = ["Común"];
  if (align !== "Neutral") baseLangs.push(`Alineamiento (${align})`);
  if (cls === 'enano') baseLangs.push("Enano", "Gnomo", "Goblin", "Kóbold");
  if (cls === 'elfo') baseLangs.push("Élfico", "Gnoll", "Hobgoblin", "Orco");
  if (cls === 'mediano') baseLangs.push("Mediano");

  let currentExtraCount = modalSelectedLangs.filter(l => !baseLangs.some(b => b.toLowerCase() === l.toLowerCase())).length;
  if (currentExtraCount >= maxExtra) {
    showDialog('LÍMITE DE IDIOMAS', `Tu Inteligencia (${intVal}) solo te permite aprender hasta ${maxExtra} idioma(s) extra.`);
    return;
  }

  if (!modalSelectedLangs.some(m => m.toLowerCase() === val.toLowerCase())) {
    modalSelectedLangs.push(val);
  }
  setVal('custom-lang-input', '');
  
  const listContainer = document.getElementById('lang-modal-list');
  let div = document.createElement('div');
  div.className = 'lang-item-select selected';
  div.innerHTML = `<span>${val}</span><span>✓</span>`;
  div.onclick = () => {
    let idx = modalSelectedLangs.findIndex(l => l.toLowerCase() === val.toLowerCase());
    if (idx !== -1) {
      modalSelectedLangs.splice(idx, 1);
      div.remove();
    }
  };
  listContainer.appendChild(div);
}

async function saveLanguagesFromModal() {
  const confirm = await showDialog('FIJAR IDIOMAS', '¿Deseas fijar los idiomas seleccionados definitivamente?\nUna vez aceptados quedarán bloqueados.', true);
  if (!confirm) return;

  setVal('char-languages', modalSelectedLangs.join(', '));
  languagesFixed = true;
  applyStatsFixedState();
  closeLanguageModal();
  autoSave();
  await showDialog('IDIOMAS FIJADOS', 'Los idiomas de tu personaje han quedado fijados correctamente.');
}

// ====== GESTIÓN DE ARMAS ARROJADAS ======
let thrownWeapons = {};

function updateThrownRecoveryUI() {
  const banner = document.getElementById('thrown-recovery-banner');
  const list = document.getElementById('thrown-items-list');
  if (!banner || !list) return;

  list.innerHTML = '';
  let totalThrown = 0;

  for (let k in thrownWeapons) {
    let count = thrownWeapons[k];
    if (count > 0) {
      totalThrown += count;
      let name = k.charAt(0).toUpperCase() + k.slice(1);

      let row = document.createElement('div');
      row.className = 'flex justify-between align-center';
      row.style.background = '#fff';
      row.style.padding = '4px 6px';
      row.style.border = '1px solid #e0d090';
      row.style.borderRadius = '2px';

      row.innerHTML = `
        <span style="font-weight:bold; font-size:0.85rem;">${name} (x${count})</span>
        <div class="flex gap-5">
          <button type="button" class="btn-action clickable" style="font-size:0.75rem; padding:2px 6px; background:#856404; color:#fff;" onclick="recoverSingleThrownWeapon('${k}')">Recoger</button>
          <button type="button" class="btn-action clickable btn-danger" style="font-size:0.75rem; padding:2px 6px;" onclick="discardSingleThrownWeapon('${k}')">Descartar</button>
        </div>
      `;
      list.appendChild(row);
    }
  }

  banner.style.display = totalThrown > 0 ? 'flex' : 'none';
}

function deductItemFromInventory(keyword, qty = 1) {
  let remainingToDeduct = qty;
  let rows = Array.from(document.querySelectorAll('#equipment-items-list .item-row'));

  for (let r of rows) {
    if (remainingToDeduct <= 0) break;
    let nameInput = r.querySelector('input[type="text"]');
    if (!nameInput) continue;
    
    let val = nameInput.value.trim();
    let qtyMatch = val.match(/\(x(\d+)\)$|x\s*(\d+)$/i);
    let baseVal = val.replace(/\(x\d+\)$|x\s*\d+$/i, '').trim();

    if (baseVal.toLowerCase() === keyword.toLowerCase()) {
      let currentQty = qtyMatch ? (parseInt(qtyMatch[1] || qtyMatch[2]) || 1) : 1;
      if (currentQty > remainingToDeduct) {
        let newQty = currentQty - remainingToDeduct;
        nameInput.value = `${baseVal} (x${newQty})`;
        remainingToDeduct = 0;
      } else {
        remainingToDeduct -= currentQty;
        r.remove();
      }
    }
  }
  updateInventoryDerived();
}

async function recoverSingleThrownWeapon(wKey) {
  if (thrownWeapons[wKey] && thrownWeapons[wKey] > 0) {
    thrownWeapons[wKey]--;
    if (thrownWeapons[wKey] === 0) delete thrownWeapons[wKey];
    updateThrownRecoveryUI();
    updateWeapons();
    autoSave();
    let name = wKey.charAt(0).toUpperCase() + wKey.slice(1);
    await showDialog('ARMA RECUPERADA', `Has recogido 1 ${name}.`);
  }
}

async function discardSingleThrownWeapon(wKey) {
  let name = wKey.charAt(0).toUpperCase() + wKey.slice(1);
  const confirm = await showDialog('DESCARTAR ARMA', `¿Descartar y perder 1 ${name} definitivamente del inventario?`, true);
  if (!confirm) return;

  if (thrownWeapons[wKey] && thrownWeapons[wKey] > 0) {
    thrownWeapons[wKey]--;
    if (thrownWeapons[wKey] === 0) delete thrownWeapons[wKey];
    deductItemFromInventory(wKey, 1);
    updateThrownRecoveryUI();
    autoSave();
    await showDialog('ARMA DESCARTADA', `Has descartado 1 ${name}. Se ha eliminado de tu inventario.`);
  }
}

async function recoverAllThrownWeapons() {
  let count = 0;
  for (let k in thrownWeapons) count += thrownWeapons[k];
  if (count === 0) return;

  thrownWeapons = {};
  updateThrownRecoveryUI();
  updateWeapons();
  autoSave();
  await showDialog('ARMAS RECUPERADAS', 'Has recogido del suelo todas las armas arrojadas.');
}

async function discardAllThrownWeapons() {
  let count = 0;
  for (let k in thrownWeapons) count += thrownWeapons[k];
  if (count === 0) return;

  const confirm = await showDialog('DESCARTAR TODO', '¿Descartar y perder todas las armas arrojadas definitivamente del inventario?', true);
  if (!confirm) return;

  for (let k in thrownWeapons) {
    deductItemFromInventory(k, thrownWeapons[k]);
  }
  thrownWeapons = {};
  updateThrownRecoveryUI();
  autoSave();
  await showDialog('ARMAS DESCARTADAS', 'Todas las armas arrojadas han sido descartadas y eliminadas del inventario.');
}

// ====== ESTADOS FIJOS Y CARACTERÍSTICAS ======
async function checkLevelAccess() {
  const isFixed = (getVal('stats-fixed') === 'true');
  if (!isFixed) {
    await showDialog('AVISO', 'Debes fijar primero tus características (botón ACEPTAR) antes de poder modificar tu nivel.');
  }
}

function applyStatsFixedState() {
  const isFixed = (getVal('stats-fixed') === 'true');
  const actionContainer = document.getElementById('stats-action-container');
  if (actionContainer) {
    actionContainer.style.display = isFixed ? 'none' : 'flex';
  }
  const statIds = ['stat-fue', 'stat-int', 'stat-sab', 'stat-des', 'stat-con', 'stat-car'];
  statIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.readOnly = isFixed;
  });
  const classSelect = document.getElementById('char-class');
  if (classSelect) {
    classSelect.disabled = isFixed;
  }
  const alignSelect = document.getElementById('char-align');
  if (alignSelect) {
    alignSelect.disabled = false;
  }
  const levelSelect = document.getElementById('char-level');
  if (levelSelect) {
    levelSelect.disabled = !isFixed;
  }
  const levelLockOverlay = document.getElementById('level-lock-overlay');
  if (levelLockOverlay) {
    levelLockOverlay.style.display = isFixed ? 'none' : 'block';
  }

  const intVal = getEffectiveStat('int');
  let maxExtra = intVal >= 18 ? 3 : intVal >= 16 ? 2 : intVal >= 13 ? 1 : 0;
  const btnChooseLang = document.getElementById('btn-choose-languages');
  if (btnChooseLang) {
    btnChooseLang.style.display = (!languagesFixed && maxExtra > 0 && isFixed) ? 'inline-flex' : 'none';
  }
  
  const charLangText = document.getElementById('char-languages');
  if (charLangText) charLangText.readOnly = languagesFixed;
}

async function acceptStats() {
  const f = getNum('stat-fue'), i = getNum('stat-int'), s = getNum('stat-sab'),
        d = getNum('stat-des'), c = getNum('stat-con'), ch = getNum('stat-car');

  if ([f, i, s, d, c, ch].some(v => v < 3 || v > 18)) {
    await showDialog('AVISO', 'Todas las características deben tener un valor entre 3 y 18 antes de ser aceptadas.');
    return;
  }

  const cls = getVal('char-class');
  if (cls === 'enano' && c < 9) {
    await showDialog('REQUISITO NO CUMPLIDO', 'La clase Enano requiere un mínimo de 9 en Constitución (Req. CON ≥ 9).');
    return;
  }
  if (cls === 'elfo' && i < 9) {
    await showDialog('REQUISITO NO CUMPLIDO', 'La clase Elfo requiere un mínimo de 9 en Inteligencia (Req. INT ≥ 9).');
    return;
  }
  if (cls === 'mediano' && (c < 9 || d < 9)) {
    await showDialog('REQUISITO NO CUMPLIDO', 'La clase Mediano requiere un mínimo de 9 en Constitución y 9 en Destreza (Req. CON ≥ 9 y DES ≥ 9).');
    return;
  }

  const confirm = await showDialog('FIJAR CARACTERÍSTICAS', '¿Deseas fijar las características y la clase definitivamente?\nUna vez aceptadas quedarán bloqueadas.', true);
  if (!confirm) return;

  setVal('stats-fixed', 'true');
  applyStatsFixedState();
  updateLiteracyAndLanguages();
  autoSave();
  await showDialog('CARACTERÍSTICAS FIJADAS', 'Las características y la clase han quedado fijadas correctamente en la ficha.');
}

function randomizeStats() {
  if (getVal('stats-fixed') === 'true') return;
  let r = () => (Math.floor(Math.random() * 6) + 1) + (Math.floor(Math.random() * 6) + 1) + (Math.floor(Math.random() * 6) + 1);
  setVal('stat-fue', r()); setVal('stat-int', r()); setVal('stat-sab', r()); setVal('stat-des', r()); setVal('stat-con', r()); setVal('stat-car', r());
  runAutoCalculations(false);
  autoSave();
}

// ====== TIENDA Y ORO ======
async function rollInitialGold() {
  const flag = document.getElementById('initial-gold-rolled');
  if (flag && flag.value === 'true') {
    await showDialog('AVISO', 'Ya has tirado el oro inicial para este personaje.\n¡No puedes hacerlo dos veces!');
    return;
  }

  const confirm = await showDialog('ORO INICIAL', '¿Tirar 3d6 x 10 para tu oro inicial?\nEsto reemplazará tu valor actual de Oro (mo).', true);
  if (!confirm) return;

  let d1 = Math.floor(Math.random() * 6) + 1, d2 = Math.floor(Math.random() * 6) + 1, d3 = Math.floor(Math.random() * 6) + 1;
  let total = (d1 + d2 + d3) * 10;

  setVal('coin-mo', total);
  if (flag) flag.value = 'true';

  const btn = document.getElementById('btn-initial-gold');
  if (btn) btn.style.display = 'none';

  calculateEncumbrance();
  autoSave();
  await showDialog('ORO INICIAL', `Tirada (3d6): ${d1} + ${d2} + ${d3} = ${d1 + d2 + d3}\n\nOro inicial: ${total} mo.`);
}

function openShop() {
  const container = document.getElementById('shop-list');
  container.innerHTML = '';
  OSE_SHOP_DB.forEach(cat => {
    let details = document.createElement('details');
    details.style.marginBottom = "6px";
    details.innerHTML = `<summary style="cursor:pointer; padding:6px 10px; background:#000; color:#fff; font-family:var(--font-heading); font-size:1.1rem; border-radius:2px; letter-spacing:0.5px; outline:none;">${cat.cat}</summary><div class="cat-items" style="padding-top:4px;"></div>`;

    let catContainer = details.querySelector('.cat-items');
    cat.i.forEach(item => {
      let div = document.createElement('div');
      div.className = 'modal-spell-item';
      div.style.marginBottom = "4px";
      div.innerHTML = `
        <div style="flex:1;">
          <span style="font-weight:bold; font-family:var(--font-heading); font-size:1.05rem;">${item.n}</span><br>
          <span style="font-size:0.8rem; font-style:italic; color:#444;" class="shop-weight-lbl">Peso: ${item.w} mo${item.d ? ` | <b>${item.d}</b>` : ''}</span>
        </div>
        <div style="font-weight:bold; font-size:1.1rem; text-align:right; font-family:var(--font-heading);">${item.p} mo</div>
      `;
      div.onclick = () => buyItem(item.n, item.p, item.w);
      catContainer.appendChild(div);
    });
    container.appendChild(details);
  });
  document.getElementById('shop-modal').style.display = 'flex';
}
function closeShop() { document.getElementById('shop-modal').style.display = 'none'; }

async function buyItem(name, price, weight) {
  let currentMo = getNum('coin-mo');
  if (currentMo >= price) {
    setVal('coin-mo', currentMo - price);
    addEquipmentRow(name, weight, true, true);
    closeShop();
    await showDialog('COMPRA REALIZADA', `Compraste ${name} por ${price} mo.`);
  } else {
    if (await showDialog('FONDOS INSUFICIENTES', `Cuesta ${price} mo, pero solo tienes ${currentMo} mo.\n\n¿Comprar y quedar en negativo?`, true)) {
      setVal('coin-mo', currentMo - price);
      addEquipmentRow(name, weight, true, true);
      closeShop();
    }
  }
}

// ====== EXPERIENCIA Y PUNTOS DE GOLPE ======
function getXPBonus() {
  const cls = getVal('char-class'),
        str = getEffectiveStat('fue'),
        int = getEffectiveStat('int'),
        wis = getEffectiveStat('sab'),
        dex = getEffectiveStat('des');

  let prime = 0;
  if (cls === 'guerrero' || cls === 'enano') prime = str;
  else if (cls === 'mago') prime = int;
  else if (cls === 'clerigo') prime = wis;
  else if (cls === 'ladron') prime = dex;

  let bonus = 0;
  if (['guerrero', 'enano', 'mago', 'clerigo', 'ladron'].includes(cls)) {
    if (prime >= 16) bonus = 10; else if (prime >= 13) bonus = 5; else if (prime >= 9) bonus = 0; else if (prime >= 6) bonus = -10; else if (prime > 0) bonus = -20;
  } else if (cls === 'elfo') {
    if (str >= 13 && int >= 16) bonus = 10; else if (str >= 13 && int >= 13) bonus = 5;
  } else if (cls === 'mediano') {
    if (str >= 13 && dex >= 16) bonus = 10; else if (str >= 13 && dex >= 13) bonus = 5;
  }

  let accXp = getPassiveAccessoryBonuses().xpPercent || 0;
  return bonus + accXp;
}

function applySessionXP() {
  let baseXP = getNum('xp-session');
  if (baseXP <= 0) return false;
  let finalXP = Math.floor(baseXP * (1 + getXPBonus() / 100));
  setVal('char-xp', getNum('char-xp') + finalXP);
  setVal('xp-session', "");
  return finalXP;
}

async function manualApplySessionXP() {
  let applied = applySessionXP();
  if (applied !== false) {
    await showDialog('EXPERIENCIA', `Cobrados ${applied} PX (inc. bonus).`);
    await checkAutoLevel();
    autoSave();
  } else {
    await showDialog('AVISO', "No hay PX para cobrar.");
  }
}

async function validateXP() {
  let val = getNum('char-xp');
  if (val < 0) setVal('char-xp', 0);
  await checkAutoLevel();
}

function validateHP(fromMax = false) {
  let maxHp = getNum('hp-max'), currentHp = getNum('hp-current');
  if (currentHp > maxHp) currentHp = maxHp;
  if (currentHp < 0) currentHp = 0;
  setVal('hp-current', currentHp);
}

async function checkDeath() {
  let currentHp = getNum('hp-current'), maxHp = getNum('hp-max');
  if (currentHp === 0 && maxHp > 0) {
    await showDialog('PERSONAJE DERROTADO', 'Tus Puntos de Golpe han llegado a 0.<br>¡Tu personaje ha muerto!');
  }
}

async function alterHP(delta) {
  let prev = getNum('hp-current');
  let m = getNum('hp-max');
  let cur = prev + delta;
  let finalHp = cur > m ? m : (cur < 0 ? 0 : cur);
  setVal('hp-current', finalHp);
  autoSave();
  if (finalHp === 0 && prev > 0 && m > 0) {
    await checkDeath();
  }
}

function healFull() {
  setVal('hp-current', getNum('hp-max'));
  autoSave();
}

async function restHeal() {
  let heal = Math.floor(Math.random() * 3) + 1;
  alterHP(heal);

  const cls = getVal('char-class');
  const hasSpells = ['clerigo', 'elfo', 'mago'].includes(cls);

  if (hasSpells) {
    document.querySelectorAll('.spell-row input[type="checkbox"]').forEach(cb => cb.checked = false);
  }
  activeEffects = [];
  updateActiveEffectsUI();
  calculateArmorClass();
  autoSave();

  let spellMsg = hasSpells ? " y conjuros restaurados" : "";
  let sessionXP = getNum('xp-session');
  if (sessionXP > 0) {
    if (await showDialog('DESCANSO', `Curaste ${heal} PG${spellMsg}.\n\nTienes ${sessionXP} PX pendientes.\n¿Cobrar?`, true)) {
      let applied = applySessionXP();
      if (applied !== false) {
        await showDialog('EXP', `Cobrados ${applied} PX.`);
        await checkAutoLevel();
        autoSave();
      }
    }
  } else {
    await showDialog('DESCANSO', `Curaste ${heal} PG${spellMsg}.`);
  }
}

async function rollHP() {
  const flag = document.getElementById('initial-hp-rolled');
  if (flag && flag.value === 'true') {
    await showDialog('AVISO', 'Ya has tirado los Dados de Golpe para este personaje.\n¡No puedes hacerlo dos veces!');
    return;
  }

  const confirm = await showDialog('PUNTOS DE GOLPE', '¿Tirar Dados de Golpe (DG) iniciales?\nEsto calculará tus PG según tu clase, nivel y bono de CON.', true);
  if (!confirm) return;

  const cls = getVal('char-class'), lvl = getNum('char-level'), hd = OSE.gHD(cls), modCon = OSE.gM(getEffectiveStat('con'));
  let chips = [];
  hpHistory = {};

  let r1 = Math.max(1, (Math.floor(Math.random() * hd) + 1) + modCon);
  hpHistory[1] = r1;
  let total = r1;
  chips.push(`<span class="trait-badge" style="background:#000; font-size:0.85rem;">Nv 1 (1d${hd}${OSE.fS(modCon)}): <b>${r1} PG</b></span>`);

  for (let i = 2; i <= Math.min(lvl, 9); i++) {
    let r = Math.max(1, (Math.floor(Math.random() * hd) + 1) + modCon);
    hpHistory[i] = r;
    total += r;
    chips.push(`<span class="trait-badge" style="background:#444; font-size:0.85rem;">Nv ${i}: <b>${r} PG</b></span>`);
  }
  if (lvl > 9) {
    let flat = (['guerrero', 'enano'].includes(cls) ? 2 : 1);
    for (let i = 10; i <= lvl; i++) {
      hpHistory[i] = flat;
      total += flat;
    }
    let extra = (lvl - 9) * flat;
    chips.push(`<span class="trait-badge" style="background:#555; font-size:0.85rem;">Niveles 10-${lvl}: <b>+${extra} PG</b></span>`);
  }

  baseRolledHP = total;
  if (flag) flag.value = 'true';

  const btn = document.getElementById('btn-roll-hp');
  if (btn) btn.style.display = 'none';

  runAutoCalculations(false);
  setVal('hp-current', getNum('hp-max')); // Asignar automáticamente los PG actuales al máximo
  autoSave();
  let content = `
    <div style="max-height:100px; overflow-y:auto; display:flex; flex-wrap:wrap; justify-content:center; gap:5px; margin-bottom:10px; padding:4px; border:1px solid #ccc; background:#fafafa;">
      ${chips.join('')}
    </div>
    <div style="font-family:var(--font-heading); font-size:1.3rem; font-weight:bold;">PG MÁXIMOS: ${getNum('hp-max')}</div>
  `;
  await showDialog('PUNTOS DE GOLPE', content);
}

// ====== GESTIÓN DINÁMICA DE SUBIDA/BAJADA DE NIVEL ======
async function onLevelDropdownChange() {
  const sel = document.getElementById('char-level');
  if (!sel) return;

  const currentLevel = parseInt(sel.value) || 1;
  const prevLevel = parseInt(sel.getAttribute('data-prev-level')) || currentLevel;

  if (currentLevel === prevLevel) {
    runAutoCalculations(false);
    return;
  }

  const cls = getVal('char-class');
  const hd = OSE.gHD(cls);
  const modCon = OSE.gM(getEffectiveStat('con'));

  if (currentLevel > prevLevel) {
    let totalGained = 0;
    let breakdownChips = [];

    for (let l = prevLevel + 1; l <= currentLevel; l++) {
      let gain = 0;
      if (l <= 9) {
        gain = Math.max(1, (Math.floor(Math.random() * hd) + 1) + modCon);
        breakdownChips.push(`<span class="trait-badge" style="background:#000; font-size:0.85rem;">Nv ${l} (1d${hd}${OSE.fS(modCon)}): <b>+${gain} PG</b></span>`);
      } else {
        let flat = ['guerrero', 'enano'].includes(cls) ? 2 : 1;
        gain = flat;
        breakdownChips.push(`<span class="trait-badge" style="background:#444; font-size:0.85rem;">Nv ${l}: <b>+${flat} PG</b></span>`);
      }
      hpHistory[l] = gain;
      totalGained += gain;
    }

    baseRolledHP += totalGained;
    sel.setAttribute('data-prev-level', currentLevel);
    runAutoCalculations(false);
    setVal('hp-current', getNum('hp-max')); // Asignar automáticamente los PG actuales al máximo
    autoSave();

    await showDialog('SUBIDA DE NIVEL', `
      <div style="margin-bottom:8px;">Has subido del <b>Nivel ${prevLevel}</b> al <b>Nivel ${currentLevel}</b>.</div>
      <div style="max-height:100px; overflow-y:auto; display:flex; flex-wrap:wrap; justify-content:center; gap:5px; margin-bottom:10px; padding:4px; border:1px solid #ccc; background:#fafafa;">
        ${breakdownChips.join('')}
      </div>
      <div style="font-family:var(--font-heading); font-size:1.2rem; font-weight:bold;">PG Ganados: +${totalGained} (Total Máx: ${getNum('hp-max')})</div>
    `);
  } else if (currentLevel < prevLevel) {
    let totalLost = 0;
    let breakdownChips = [];

    for (let l = prevLevel; l > currentLevel; l--) {
      let lost = 0;
      if (hpHistory[l] !== undefined && hpHistory[l] > 0) {
        lost = hpHistory[l];
      } else {
        if (l <= 9) {
          lost = Math.max(1, Math.round(hd / 2) + modCon);
        } else {
          lost = ['guerrero', 'enano'].includes(cls) ? 2 : 1;
        }
      }
      breakdownChips.push(`<span class="trait-badge" style="background:#880000; font-size:0.85rem;">Nv ${l}: <b>-${lost} PG</b></span>`);
      totalLost += lost;
      delete hpHistory[l];
    }

    baseRolledHP = Math.max(1, baseRolledHP - totalLost);
    sel.setAttribute('data-prev-level', currentLevel);
    runAutoCalculations(false);
    setVal('hp-current', getNum('hp-max')); // Asignar automáticamente los PG actuales al máximo
    autoSave();

    await showDialog('BAJADA DE NIVEL', `
      <div style="margin-bottom:8px;">Has bajado del <b>Nivel ${prevLevel}</b> al <b>Nivel ${currentLevel}</b>.</div>
      <div style="max-height:100px; overflow-y:auto; display:flex; flex-wrap:wrap; justify-content:center; gap:5px; margin-bottom:10px; padding:4px; border:1px solid #ccc; background:#fafafa;">
        ${breakdownChips.join('')}
      </div>
      <div style="font-family:var(--font-heading); font-size:1.2rem; font-weight:bold;">PG Reducidos: -${totalLost} (Total Máx: ${getNum('hp-max')})</div>
    `);
  }
}

async function checkAutoLevel() {
  const cls = getVal('char-class'), maxLvl = MAX_LEVELS[cls] || 14;
  while (getNum('char-level') < maxLvl && getNum('char-xp') >= OSE.xp[cls][getNum('char-level')]) {
    await levelUp();
  }
}

async function levelUp() {
  const cls = getVal('char-class'), maxLvl = MAX_LEVELS[cls] || 14;
  let cL = getNum('char-level');
  if (cL >= maxLvl) {
    await showDialog('AVISO', "Nivel máximo alcanzado.");
    return;
  }
  setVal('char-level', cL + 1);
  await onLevelDropdownChange();
}

// ====== COMBATE, CA E INVENTARIO ======
function calculateArmorClass() {
  const cls = getVal('char-class');
  const modDes = OSE.gM(getEffectiveStat('des'));
  const isAsc = (getVal('ac-system') === 'asc');
  const armorSelect = document.getElementById('select-armor');
  const shieldCheck = document.getElementById('check-shield');
  const currentArmorVal = armorSelect ? armorSelect.value : "none";

  let hasShieldSpell = activeEffects.some(e => e.name === 'Escudo');
  let buffAC = getActiveEffectAcBonus();
  let accBonuses = getPassiveAccessoryBonuses();

  let invItems = [];
  document.querySelectorAll('#equipment-items-list .item-row input[type="text"]').forEach(input => {
    let val = input.value.trim();
    if (val) invItems.push(val);
  });

  let detectedArmors = [];
  let highestShieldBonus = 0;

  invItems.forEach(itemStr => {
    let lower = itemStr.toLowerCase();
    
    if (isMagicAccessory(itemStr)) return;

    let bMatch = itemStr.match(/(?:^|\s)([\+\-]\d+)(?:\s|$|\()/);
    let magicMod = bMatch ? parseInt(bMatch[1]) : 0;

    let caMatch = itemStr.match(/\bCA\s*(\d+)/i) || itemStr.match(/\((\d+)\)/);
    let explicitCA = caMatch ? parseInt(caMatch[1]) : null;

    if (/escudo|rodela|broquel|paves|tarja/i.test(lower)) {
      let sVal = 1 + magicMod;
      if (sVal > highestShieldBonus) highestShieldBonus = sVal;
    }

    let isArmor = /armadura|cuero|malla|placas|coraza|loriga|escamas|anillas|hueso|drag[oó]n|piel|acolchada|completa|peto|camisote/i.test(lower) && !/escudo|rodela|broquel|paves|tarja/i.test(lower);

    if (isArmor) {
      let baseAsc = 12;
      let baseDesc = 7;

      if (explicitCA !== null) {
        if (explicitCA <= 9) {
          baseDesc = explicitCA;
          baseAsc = 19 - explicitCA;
        } else {
          baseAsc = explicitCA;
          baseDesc = 19 - explicitCA;
        }
      } else if (/placas|completa|coraza|drag[oó]n|pesada/i.test(lower)) {
        baseAsc = 16 + magicMod;
        baseDesc = 3 - magicMod;
      } else if (/malla|escamas|anillas|loriga|brigantina|intermedia/i.test(lower)) {
        baseAsc = 14 + magicMod;
        baseDesc = 5 - magicMod;
      } else if (/cuero|piel|hueso|acolchada|ligera/i.test(lower)) {
        baseAsc = 12 + magicMod;
        baseDesc = 7 - magicMod;
      } else {
        baseAsc = 14 + magicMod;
        baseDesc = 5 - magicMod;
      }

      let cleanName = itemStr.replace(/\(x\d+\)$|x\s*\d+$/i, '').trim();
      detectedArmors.push({
        id: `arm_${detectedArmors.length}_${cleanName.replace(/\s+/g, '_')}`,
        name: cleanName,
        baseAsc: baseAsc,
        baseDesc: baseDesc,
        isLeather: /cuero|piel|acolchada/i.test(lower)
      });
    }
  });

  let opts = `<option value="none" data-asc="${isAsc ? 10 : 9}" data-desc="${isAsc ? 10 : 9}">Ninguna (CA ${isAsc ? 10 : 9})</option>`;
  detectedArmors.forEach(arm => {
    let caDisplay = isAsc ? arm.baseAsc : arm.baseDesc;
    opts += `<option value="${arm.id}" data-asc="${arm.baseAsc}" data-desc="${arm.baseDesc}">${arm.name} (CA ${caDisplay})</option>`;
  });

  armorSelect.innerHTML = opts;

  let hasShield = (highestShieldBonus > 0);
  setText('label-shield-bonus', isAsc ? `ESCUDO (+${highestShieldBonus || 1}):` : `ESCUDO (-${highestShieldBonus || 1}):`);

  if (Array.from(armorSelect.options).some(o => o.value === currentArmorVal)) {
    armorSelect.value = currentArmorVal;
  } else {
    armorSelect.value = (detectedArmors.length > 0) ? detectedArmors[0].id : "none";
  }

  if (!hasShield) {
    shieldCheck.checked = false;
    shieldCheck.disabled = true;
  } else {
    shieldCheck.disabled = false;
  }

  if (cls === 'mago') {
    armorSelect.value = "none";
    armorSelect.disabled = true;
    shieldCheck.checked = false;
    shieldCheck.disabled = true;
  } else if (cls === 'ladron') {
    let leatherOpt = detectedArmors.find(a => a.isLeather);
    if (leatherOpt && armorSelect.value === leatherOpt.id) {
      armorSelect.value = leatherOpt.id;
    } else if (leatherOpt) {
      armorSelect.value = leatherOpt.id;
    } else {
      armorSelect.value = "none";
    }
    armorSelect.disabled = !leatherOpt;
    shieldCheck.checked = false;
    shieldCheck.disabled = true;
  } else {
    armorSelect.disabled = false;
  }

  let selectedOpt = armorSelect.options[armorSelect.selectedIndex] || armorSelect.options[0];
  let baseCA = isAsc ? (parseInt(selectedOpt.getAttribute('data-asc')) || 10) : (parseInt(selectedOpt.getAttribute('data-desc')) || 9);

  if (selectedOpt.value === "none" && accBonuses.fixedAC !== null) {
    baseCA = isAsc ? (accBonuses.fixedAC <= 9 ? 19 - accBonuses.fixedAC : accBonuses.fixedAC) : (accBonuses.fixedAC > 9 ? 19 - accBonuses.fixedAC : accBonuses.fixedAC);
  }

  let shieldApplied = shieldCheck.checked ? highestShieldBonus : 0;
  let totalBonusAC = buffAC + accBonuses.ac;
  let finalAC = isAsc ? (baseCA + shieldApplied + modDes + totalBonusAC) : (baseCA - shieldApplied - modDes - totalBonusAC);

  if (hasShieldSpell) {
    finalAC = isAsc ? Math.max(finalAC, 15) : Math.min(finalAC, 4);
  }

  setVal('combat-ac', finalAC);
  setVal('combat-ac-unarmored', isAsc ? (10 + modDes + totalBonusAC) : (9 - modDes - totalBonusAC));
}

function updateWeapons() {
  let inv = [];
  document.querySelectorAll('#equipment-items-list .item-row input[type="text"]').forEach(i => {
    let v = i.value.trim();
    if (v && !isMagicAccessory(v)) inv.push(v);
  });

  let meleeOpts = [{ t: 'Desarmado (1d2)', dmg: '1d2', bonus: 0, extraDmg: 0 }];
  let missOpts = [];

  inv.forEach(rawInput => {
    let qtyMatch = rawInput.match(/\(x(\d+)\)$|x\s*(\d+)$/i);
    let rawName = rawInput.replace(/\(x\d+\)$|x\s*\d+$/i, '').trim();
    let lower = rawName.toLowerCase();

    let dmgFormula = null;
    let bonus = 0;
    let extraDmg = 0;

    let bMatch = rawName.match(/(?:^|\s)([\+\-]\d+)(?:\s|$|\()/);
    if (bMatch) bonus = parseInt(bMatch[1]);

    let atkMatch = rawName.match(/([\+\-]\d+)\s*(?:al?\s+)?(atq|ataque|impactar)/i) || rawName.match(/\b(atq|ataque|impactar)\s*[:\s]*([\+\-]\d+)/i);
    if (atkMatch) bonus = parseInt(atkMatch[1]) || parseInt(atkMatch[2]);

    let dmgMatch = rawName.match(/([\+\-]\d+)\s*(?:al?\s+)?(da[nñ]o|dmg)/i) || rawName.match(/\b(da[nñ]o|dmg)\s*[:\s]*([\+\-]\d+)/i);
    if (dmgMatch) extraDmg = parseInt(dmgMatch[1]) || parseInt(dmgMatch[2]);

    let fMatch = rawName.match(/\(([^)]+)\)/);
    if (fMatch) {
      let tempDmg = fMatch[1].replace(/\s/g, '').toLowerCase();
      if (/[\d]+d[\d]+/i.test(tempDmg) || /^[\+\-]?\d+$/.test(tempDmg)) {
        dmgFormula = tempDmg;
      }
    }

    if (!dmgFormula) {
      if (/daga|jabalina/i.test(lower)) dmgFormula = '1d4';
      else if (/lanza de caballer|dos manos|alabarda|pica/i.test(lower)) dmgFormula = '1d10';
      else if (/hacha de mano|espada corta|maza|martillo|bastón|baston|arco|ballesta|lanza/i.test(lower)) dmgFormula = '1d6';
      else if (/espada|hacha de batalla|hacha/i.test(lower)) dmgFormula = '1d8';
      else if (/honda|dardo|garrote|antorcha/i.test(lower)) dmgFormula = '1d4';
    }

    if (!dmgFormula) return; 

    let isThrown = /arrojadiz|daga|hacha de mano|lanza|jabalina/i.test(lower);
    let isMissileOnly = /arco|ballesta|honda|proyectil|distancia/i.test(lower) && !isThrown;

    let avail = 1;
    let thrownKey = null;

    if (isThrown) {
      thrownKey = rawName;
      let used = thrownWeapons[thrownKey] || 0;
      let countInInv = 0;
      document.querySelectorAll('#equipment-items-list .item-row input[type="text"]').forEach(input => {
        let text = input.value.trim();
        let bVal = text.replace(/\(x\d+\)$|x\s*\d+$/i, '').trim();
        if (bVal === rawName) {
          let cQtyMatch = text.match(/\(x(\d+)\)$|x\s*(\d+)$/i);
          countInInv += cQtyMatch ? (parseInt(cQtyMatch[1] || cQtyMatch[2]) || 1) : 1;
        }
      });
      avail = Math.max(0, countInInv - used);
    } else {
      let qtyMatch = rawInput.match(/\(x(\d+)\)$|x\s*(\d+)$/i);
      if(qtyMatch) avail = parseInt(qtyMatch[1] || qtyMatch[2]) || 1;
    }

    let optText = `${rawName}${!fMatch ? ` (${dmgFormula})` : ''}`;

    if (avail > 0) {
      if (!isMissileOnly) {
        meleeOpts.push({ t: optText + (avail > 1 && isThrown ? ` (Disp: ${avail})` : ''), dmg: dmgFormula, bonus: bonus, extraDmg: extraDmg });
      }
      if (isMissileOnly || isThrown) {
        missOpts.push({ t: optText + (isThrown ? ' (Arroj.)' : '') + (avail > 1 && isThrown ? ` (Disp: ${avail})` : ''), dmg: dmgFormula, bonus: bonus, extraDmg: extraDmg, thrown: thrownKey });
      }
    }
  });

  const updateSel = (id, opts) => {
    let sel = document.getElementById(id);
    if (!sel) return;
    let curText = sel.options[sel.selectedIndex]?.text?.split(' (Disp')[0];
    sel.innerHTML = opts.map((o, idx) => `<option value="${idx}" data-dmg="${o.dmg}" data-bonus="${o.bonus}" data-extradmg="${o.extraDmg || 0}" ${o.thrown ? `data-thrown="${o.thrown}"` : ''}>${o.t}</option>`).join('');
    
    let match = Array.from(sel.options).find(o => o.text.startsWith(curText));
    if (match) match.selected = true;
    else if (sel.options.length > 0) sel.selectedIndex = 0;
  };

  updateSel('melee-weapon-select', meleeOpts);
  updateSel('missile-weapon-select', missOpts.length > 0 ? missOpts : [{ t: 'Sin armas a distancia (0)', dmg: '0', bonus: 0, extraDmg: 0 }]);
  updateThrownRecoveryUI();
}

function updateInventoryDerived() {
  calculateEncumbrance();
  calculateArmorClass();
  updateWeapons();
  runAutoCalculations(false);
  autoSave();
}

function onEquipmentNameChange(input) {
  let row = input.closest('.item-row');
  if (row) {
    let sw = row.querySelector('.magic-switch');
    let isMag = isMagicAccessory(input.value);
    if (sw) {
      sw.style.display = isMag ? 'inline-block' : 'none';
      if (isMag && !sw.dataset.initialized) {
        let cb = sw.querySelector('.item-equip-cb');
        if (cb) cb.checked = true;
        sw.dataset.initialized = "true";
      }
    }
  }
  updateInventoryDerived();
}

function addEquipmentRow(n = '', w = 0, dS = true, isEquipped = true) {
  const l = document.getElementById('equipment-items-list');
  if (!l) return;
  let r = document.createElement('div');
  r.className = 'item-row';
  r.style.display = 'flex';
  r.style.alignItems = 'center';
  r.style.gap = '5px';
  
  let isMag = isMagicAccessory(n);
  
  r.innerHTML = `
    <label class="magic-switch" style="display:${isMag ? 'inline-block' : 'none'};" title="Equipado (activado) / En mochila (desactivado)" ${isMag ? 'data-initialized="true"' : ''}>
      <input type="checkbox" class="item-equip-cb" ${isEquipped ? 'checked' : ''} onchange="updateInventoryDerived()">
      <span class="magic-slider"></span>
    </label>
    <input type="text" value="${n}" oninput="onEquipmentNameChange(this)" style="flex:1;">
    <input type="number" value="${w}" min="0" oninput="updateInventoryDerived()" style="width:55px; text-align:center;">
    <button type="button" class="btn-delete" onclick="this.parentElement.remove(); updateInventoryDerived();">✕</button>
  `;
  l.appendChild(r);
  updateInventoryDerived();
  if (dS) autoSave();
}

function calculateEncumbrance() {
  let coins = getNum('coin-mp') + getNum('coin-mo') + getNum('coin-me') + getNum('coin-ml') + getNum('coin-mc');
  let w = Math.floor(coins / 10);
  document.querySelectorAll('#equipment-items-list .item-row input[type="number"]').forEach(e => w += parseInt(e.value) || 0);
  setText('total-weight-display', `${w} mo`);
  ['bracket-120', 'bracket-90', 'bracket-60', 'bracket-30'].forEach(i => document.getElementById(i).classList.remove('active'));

  if (w <= 400) {
    document.getElementById('bracket-120').classList.add('active'); setVal('mov-overland', "24 mi"); setVal('mov-exploration', "120'"); setVal('mov-encounter', "40'");
  } else if (w <= 600) {
    document.getElementById('bracket-90').classList.add('active'); setVal('mov-overland', "18 mi"); setVal('mov-exploration', "90'"); setVal('mov-encounter', "30'");
  } else if (w <= 800) {
    document.getElementById('bracket-60').classList.add('active'); setVal('mov-overland', "12 mi"); setVal('mov-exploration', "60'"); setVal('mov-encounter', "20'");
  } else if (w <= 1600) {
    document.getElementById('bracket-30').classList.add('active'); setVal('mov-overland', "6 mi"); setVal('mov-exploration', "30'"); setVal('mov-encounter', "10'");
  } else {
    setVal('mov-overland', "0"); setVal('mov-exploration', "0"); setVal('mov-encounter', "0");
  }
  autoSave();
}

// ====== CONJUROS Y GRIMORIO ======
function findSpellData(n) {
  if (!n || !window.SPELLS_DB) return null;
  for (const c in window.SPELLS_DB) {
    for (const l in window.SPELLS_DB[c]) {
      let s = window.SPELLS_DB[c][l].find(x => x.n === n || x.n.includes(n) || n.includes(x.n.split(' ↔ ')[0]));
      if (s) return s;
    }
  }
  return null;
}

function getSpellDisplayData(dbSpell, isReversible = false) {
  if (!dbSpell.n.includes('↔')) {
    return { displayName: dbSpell.n, formula: dbSpell.f, isRev: false };
  }
  const parts = dbSpell.n.split('↔').map(s => s.trim());
  const normalName = parts[0];
  const revName = parts[1];

  let formula = dbSpell.f;
  let lowerName = dbSpell.n.toLowerCase();
  if (lowerName.includes('curar heridas leves') || lowerName.includes('curar heridas ligeras')) {
    formula = isReversible ? '1d6+1 daño' : '1d6+1 PG';
  } else if (lowerName.includes('curar heridas graves')) {
    formula = isReversible ? '2d6+2 daño' : '2d6+2 PG';
  } else if (lowerName.includes('curar parálisis')) {
    formula = isReversible ? '2d6 turnos' : null;
  }

  return { displayName: isReversible ? revName : normalName, formula: formula, isRev: isReversible, normalName: normalName, revName: revName };
}

function createSpellRow(spellDbName, isSpent = false, isRev = false) {
  const sD = findSpellData(spellDbName);
  if (!sD) return null;

  const isReversibleSpell = sD.n.includes('↔');
  const info = getSpellDisplayData(sD, isRev);

  const div = document.createElement('div');
  div.className = 'spell-row';
  div.setAttribute('data-dbname', sD.n);
  div.setAttribute('data-rev', isRev ? 'true' : 'false');

  let revToggleHtml = '';
  if (isReversibleSpell) {
    revToggleHtml = `<button type="button" class="btn-action clickable" style="padding:2px 5px; font-size:0.85rem; background:${isRev ? '#880000' : '#444'}; margin-right:2px; font-weight:bold;" onclick="toggleSpellReversible(this)" title="Cambiar versión Normal/Reversible">↔</button>`;
  }

  div.innerHTML = `
    <input type="checkbox" ${isSpent ? 'checked' : ''} onchange="autoSave()">
    ${revToggleHtml}
    <input type="text" class="spell-name-input" value="${info.displayName}" readonly style="flex:1;">
    <button type="button" class="btn-action clickable" style="margin-right:4px;" onclick="initSpellCast(this)">TIRAR</button>
    <button type="button" class="spell-link-btn" onclick="openSpellInfo('${sD.n}')" style="margin-right:4px;">INFO</button>
    <button type="button" class="btn-delete" onclick="this.parentElement.remove(); autoSave();">✕</button>
  `;
  return div;
}

function toggleSpellReversible(btn) {
  const row = btn.closest('.spell-row');
  if (!row) return;
  const dbName = row.getAttribute('data-dbname');
  const sD = findSpellData(dbName);
  if (!sD) return;

  const currentRev = (row.getAttribute('data-rev') === 'true');
  const newRev = !currentRev;
  row.setAttribute('data-rev', newRev ? 'true' : 'false');

  const info = getSpellDisplayData(sD, newRev);
  btn.style.background = newRev ? '#880000' : '#444';

  const nameInput = row.querySelector('.spell-name-input');
  if (nameInput) nameInput.value = info.displayName;

  autoSave();
}

function openSpellInfo(n) {
  const s = findSpellData(n);
  if (!s) return;
  setText('spell-info-title', s.n);
  setText('spell-info-range', s.a);
  setText('spell-info-duration', s.d);
  setText('spell-info-desc', s.x);
  setDisplay('spell-info-modal', 'flex');
}

let pendingStrikeRow = null;
function openStrikeWeaponModal(row) {
  pendingStrikeRow = row;
  const list = document.getElementById('strike-weapons-list');
  list.innerHTML = '';

  const meleeSel = document.getElementById('melee-weapon-select');
  const options = Array.from(meleeSel.options);

  options.forEach(opt => {
    if (opt.text.toLowerCase().includes('desarmado')) return;
    let btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn-action clickable';
    btn.style.padding = '8px 12px';
    btn.style.fontSize = '1rem';
    btn.style.justifyContent = 'space-between';
    btn.innerHTML = `<span>${opt.text.split(' (')[0]}</span><span style="font-weight:bold;">+1d6 Daño</span>`;
    btn.onclick = () => applyStrikeWeapon(opt.text.split(' (')[0]);
    list.appendChild(btn);
  });

  setDisplay('spell-strike-modal', 'flex');
}

function applyStrikeWeapon(weaponName) {
  setDisplay('spell-strike-modal', 'none');
  if (pendingStrikeRow) {
    let cb = pendingStrikeRow.querySelector('input[type="checkbox"]');
    if (cb) cb.checked = true;
  }

  let id = 'eff_' + Date.now() + '_' + Math.floor(Math.random() * 100);
  activeEffects.push({
    id,
    name: `Golpear: ${weaponName}`,
    weapon: weaponName.toLowerCase(),
    ac: 0,
    atk: 0,
    dmg: 0,
    dmgDice: '1d6',
    save: 0,
    type: 'buff'
  });

  updateActiveEffectsUI();
  autoSave();
  showDialog('CONJURO: GOLPEAR', `Has encantado tu ${weaponName}.<br><br>Causa +1d6 de daño adicional y se considera un arma mágica durante 1 turno.`);
}

async function initSpellCast(btn) {
  const row = btn ? btn.closest('.spell-row') : null;
  const cb = row ? row.querySelector('input[type="checkbox"]') : null;

  if (cb && cb.checked) {
    await showDialog('CONJURO GASTADO', 'Este espacio de conjuro ya ha sido utilizado hoy.');
    return;
  }

  const dbName = row ? row.getAttribute('data-dbname') : null;
  const sD = findSpellData(dbName);
  if (!sD) return;

  const isRev = row ? (row.getAttribute('data-rev') === 'true') : false;
  const info = getSpellDisplayData(sD, isRev);

  if (info.displayName === 'Golpear') {
    openStrikeWeaponModal(row);
    return;
  }

  if (info.formula) {
    let formula = info.formula;
    const lvl = getNum('char-level') || 1;
    formula = formula.replace(/X/g, lvl);

    currentRollTask = { type: 'spell', sourceId: null, titleName: info.displayName, targetRow: row };
    setText('pre-roll-title', info.displayName);
    setDisplay('roll-mod-container', 'none');
    setDisplay('roll-spell-container', 'block');
    setVal('roll-spell-formula', formula);
    setDisplay('pre-roll-modal', 'flex');
  } else {
    if (cb) cb.checked = true;

    let effectMsg = "";
    if (info.displayName === 'Escudo') {
      addEffectFromPreset('Escudo', 0, 0, 0, 0, 'buff');
      effectMsg = "\n\nSe ha activado el campo de fuerza: CA 15 [4] (CA 17 [2] contra proyectiles).";
    } else if (info.displayName === 'Protección contra el mal' || sD.n.includes('Protección contra el mal')) {
      addEffectFromPreset('Protección contra el mal', 1, 0, 0, 1, 'buff');
      effectMsg = "\n\nSe ha aplicado +1 a la CA y +1 a las salvaciones contra criaturas de otro alineamiento.";
    } else if (info.displayName === 'Bendición') {
      addEffectFromPreset('Bendición', 0, 1, 1, 0, 'buff');
      effectMsg = "\n\nSe ha aplicado +1 a las tiradas de ataque y daño y +1 a la moral de aliados.";
    } else if (info.displayName === 'Infortunio' || info.displayName === 'Flagelo') {
      effectMsg = "\n\nLos enemigos en el área sufren -1 a tiradas de ataque, daño y moral.";
    } else if (info.displayName === 'Celeridad' || info.displayName === 'Velocidad') {
      addEffectFromPreset('Celeridad', 0, 0, 0, 0, 'buff');
      effectMsg = "\n\nLos aliados en el área duplican su movimiento y realizan el doble de ataques por asalto.";
    } else if (info.displayName === 'Lentitud') {
      effectMsg = "\n\nLos enemigos en el área reducen su velocidad y ataques a la mitad.";
    }

    updateActiveEffectsUI();
    calculateArmorClass();
    autoSave();

    await showDialog('CONJURO LANZADO', `Has lanzado ${info.displayName}.${effectMsg}`);
  }
}

function runAutoCalculations(isChange = false) {
  updateLevelDropdown();
  const cls = getVal('char-class'), max = MAX_LEVELS[cls] || 14;
  let lvl = getNum('char-level');
  if (lvl < 1) lvl = 1;
  if (lvl > max) lvl = max;
  setVal('char-level', lvl);

  // Características Efectivas (Base + Modificadores de accesorios)
  const valF = getEffectiveStat('fue'),
        valD = getEffectiveStat('des'),
        valC = getEffectiveStat('con'),
        valS = getEffectiveStat('sab'),
        valI = getEffectiveStat('int'),
        valCh = getEffectiveStat('car');

  const mf = OSE.gM(valF), md = OSE.gM(valD), mc = OSE.gM(valC), ms = OSE.gM(valS);

  // Cálculo de PG máximos efectivos (Base tirada * multiplicadores + bonos de objetos)
  let accBonuses = getPassiveAccessoryBonuses();
  if (baseRolledHP > 0) {
    let effectiveMaxHP = Math.max(1, (baseRolledHP * accBonuses.hpMult) + accBonuses.hpBonus);
    setVal('hp-max', effectiveMaxHP);
    validateHP(false);
  }

  setVal('mod-con-hp', OSE.fS(mc));
  setVal('mod-dex-ac', OSE.fS(md));
  setVal('mod-wis-save', OSE.fS(ms));
  calculateArmorClass();
  updateWeapons();

  const cbt = OSE.gCombat(cls, lvl);
  let effAtk = getActiveEffectAtkBonus();
  
  setVal('combat-gac0', cbt.g);
  setVal('attack-ba', OSE.fS(cbt.b));
  setVal('attack-melee', OSE.fS(cbt.b + mf + accBonuses.atk + effAtk));
  setVal('attack-missile', OSE.fS(cbt.b + md + (cls === 'mediano' ? 1 : 0) + accBonuses.atk + effAtk));
  for (let a = 0; a <= 9; a++) setVal(`matrix-${a}`, cbt.g - a);

  const s = OSE.gSave(cls, lvl);
  setVal('save-m', s[0]); setVal('save-v', s[1]); setVal('save-p', s[2]); setVal('save-a', s[3]); setVal('save-h', s[4]);

  const minXpForLevel = (OSE.xp[cls] && OSE.xp[cls][lvl - 1] !== undefined) ? OSE.xp[cls][lvl - 1] : 0;
  if (isChange || getNum('char-xp') < minXpForLevel) {
    setVal('char-xp', minXpForLevel);
  }

  setVal('xp-next-level', lvl < max ? OSE.xp[cls][lvl] : 'MÁX');
  setText('xp-mod-badge', `BONO PX: ${OSE.fS(getXPBonus())}%`);

  let openDoors = Math.max(1, Math.min(5, 2 + mf));
  setVal('skill-aa-val', openDoors);

  updateLiteracyAndLanguages();

  ['sec-thief', 'sec-turn-undead', 'sec-arcane-spells', 'sec-divine-spells'].forEach(i => setDisplay(i, 'none'));
  setDisplay('sec-general-skills', 'block');
  document.querySelectorAll('.trait-section').forEach(t => t.style.display = 'none');

  if (cls === 'guerrero') { setVal('char-race', 'Humano'); setDisplay('trait-guerrero', 'block'); }
  if (cls === 'clerigo') {
    setVal('char-race', 'Humano'); setDisplay('sec-turn-undead', 'block'); setDisplay('sec-divine-spells', 'block'); setDisplay('trait-clerigo', 'block');
    const tu = OSE.tUndead[Math.min(lvl, 11)];
    for (let i = 1; i <= 8; i++) {
      let el = document.getElementById(`turn-${i}`);
      if (el) { el.value = tu[i - 1]; el.disabled = (tu[i - 1] === '—'); el.style.color = (tu[i - 1] === '—') ? '#999' : '#000'; }
    }
    const sp = OSE.sCleric[Math.min(lvl, 14)];
    for (let i = 1; i <= 5; i++) setVal(`divine-slot-${i}`, sp[i - 1]);
  }
  if (cls === 'enano') { setVal('char-race', 'Enano'); setDisplay('trait-enano', 'block'); }
  if (cls === 'elfo') {
    setVal('char-race', 'Elfo'); setDisplay('sec-arcane-spells', 'block'); setDisplay('trait-elfo', 'block'); setDisplay('block-arcane-6', 'none');
    const sp = OSE.sElf[Math.min(lvl, 10)];
    for (let i = 1; i <= 5; i++) setVal(`arcane-slot-${i}`, sp[i - 1]);
  }
  if (cls === 'mediano') { setVal('char-race', 'Mediano'); setDisplay('trait-mediano', 'block'); }
  if (cls === 'ladron') {
    setVal('char-race', 'Humano'); setDisplay('sec-thief', 'block'); setDisplay('sec-general-skills', 'none'); setDisplay('trait-ladron', 'block');
    const th = OSE.thief[Math.min(lvl, 14)];
    setVal('thief-ac', th.ac); setVal('thief-et', th.et); setVal('thief-rb', th.rb); setVal('thief-ms', th.ms); setVal('thief-es', th.es); setVal('thief-em', th.em); setVal('thief-er', th.er); setVal('thief-backstab', th.bs);
  }
  if (cls === 'mago') {
    setVal('char-race', 'Humano'); setDisplay('sec-arcane-spells', 'block'); setDisplay('trait-mago', 'block'); setDisplay('block-arcane-6', 'block');
    const sp = OSE.sMage[Math.min(lvl, 14)];
    for (let i = 1; i <= 6; i++) setVal(`arcane-slot-${i}`, sp[i - 1]);
  }

  const titleMap = { guerrero: 'GUERRERO', clerigo: 'CLÉRIGO', enano: 'ENANO', elfo: 'ELFO', mediano: 'MEDIANO', ladron: 'LADRÓN', mago: 'MAGO' };
  let baseSubtitle = `HOJA DE PERSONAJE — ${titleMap[cls] || 'GUERRERO'}`;

  let reqError = "";
  if (cls === 'enano' && valC < 9) reqError = "Req. CON ≥ 9";
  if (cls === 'elfo' && valI < 9) reqError = "Req. INT ≥ 9";
  if (cls === 'mediano' && (valC < 9 || valD < 9)) reqError = "Req. CON ≥ 9 y DES ≥ 9";

  if (reqError) {
    setText('sheet-subtitle', baseSubtitle + ` [AVISO: ${reqError}]`);
    document.getElementById('sheet-subtitle').style.background = '#880000';
  } else {
    setText('sheet-subtitle', baseSubtitle);
    document.getElementById('sheet-subtitle').style.background = 'var(--border-color)';
  }

  const classSelect = document.getElementById('char-class');
  Array.from(classSelect.options).forEach(opt => {
    let disabled = false;
    let reqMsg = "";
    if (opt.value === 'enano' && valC < 9) { disabled = true; reqMsg = "(Req. CON ≥ 9)"; }
    if (opt.value === 'elfo' && valI < 9) { disabled = true; reqMsg = "(Req. INT ≥ 9)"; }
    if (opt.value === 'mediano' && (valC < 9 || valD < 9)) { disabled = true; reqMsg = "(Req. CON ≥ 9 y DES ≥ 9)"; }

    opt.disabled = disabled;
    let baseText = opt.text.split(' (')[0];
    opt.text = disabled ? baseText + " " + reqMsg : baseText;
  });

  document.querySelectorAll('.spell-level-block').forEach(b => {
    let mt = b.querySelector('h3') ? b.querySelector('h3').innerText.match(/Nivel\s+(\d+)/i) : null;
    if (mt) {
      let l = parseInt(mt[1]), t = b.closest('#sec-arcane-spells') ? 'mago' : 'clerigo';
      let lim = parseInt(((t === 'mago' ? OSE.sMage : t === 'elfo' ? OSE.sElf : OSE.sCleric)[Math.min(lvl, 14)] || [])[l - 1]) || 0;
      b.style.opacity = lim > 0 ? '1' : '0.6';
      let ab = b.querySelector('button');
      if (ab) ab.disabled = (lim <= 0);
    }
  });

  calculateEncumbrance();

  const goldFlag = document.getElementById('initial-gold-rolled');
  const goldBtn = document.getElementById('btn-initial-gold');
  if (goldFlag && goldFlag.value === 'true' && goldBtn) goldBtn.style.display = 'none';

  const hpFlag = document.getElementById('initial-hp-rolled');
  const hpBtn = document.getElementById('btn-roll-hp');
  if (hpFlag && hpFlag.value === 'true' && hpBtn) hpBtn.style.display = 'none';

  applyStatsFixedState();
  updateActiveEffectsUI();
}

function updateLevelDropdown() {
  const cls = getVal('char-class');
  const sel = document.getElementById('char-level');
  if (!sel) return;
  const cur = getNum('char-level') || 1;
  sel.innerHTML = '';
  for (let i = 1; i <= (MAX_LEVELS[cls] || 14); i++) {
    let o = document.createElement('option');
    o.value = i;
    o.textContent = i;
    if (i === cur) o.selected = true;
    sel.appendChild(o);
  }
  sel.setAttribute('data-prev-level', cur);
}

async function openSpellModal(sT, l) {
  let tDB = (sT === 'mago' && getVal('char-class') === 'elfo') ? OSE.sElf : (sT === 'mago' ? OSE.sMage : OSE.sCleric);
  let lim = parseInt((tDB[Math.min(getNum('char-level'), 14)] || [])[l - 1]) || 0;
  if (lim <= 0) {
    await showDialog('AVISO', `Nivel ${l} no disponible aún.`);
    return;
  }

  let cId = sT === 'clerigo' ? `divine-list-${l}` : `arcane-list-${l}`;
  let used = document.getElementById(cId) ? document.getElementById(cId).querySelectorAll('.spell-row').length : 0;
  if (used >= lim) {
    await showDialog('LÍMITE', `Alcanzaste el límite de ${lim} conjuros memorizables de Nivel ${l}.`);
    return;
  }

  setText('modal-title', `CONJUROS NV ${l}`);
  const lst = document.getElementById('modal-spell-list');
  lst.innerHTML = '';

  const spellsSource = (window.SPELLS_DB && window.SPELLS_DB[sT]) ? window.SPELLS_DB[sT][l] : [];
  spellsSource.forEach(s => {
    let dv = document.createElement('div');
    dv.className = 'modal-spell-item';
    dv.innerHTML = `
      <span style="flex:1;">${s.n}</span>
      <button type="button" class="spell-link-btn" onclick="openSpellInfo(this.dataset.spell); event.stopPropagation();" data-spell="${s.n}" style="margin-right:15px; font-size:0.75rem;">INFO</button>
      <strong>+</strong>
    `;
    dv.onclick = () => {
      let u2 = document.getElementById(cId).querySelectorAll('.spell-row').length;
      if (u2 >= lim) return;
      let tr = createSpellRow(s.n, false, false);
      if (tr) document.getElementById(cId).appendChild(tr);
      autoSave();
      closeSpellModal();
    };
    lst.appendChild(dv);
  });
  setDisplay('spell-modal', 'flex');
}
function closeSpellModal() { setDisplay('spell-modal', 'none'); }

// ====== DADOS Y TIRADAS ======
let currentRollTask = {};

function generateVectorDie(t, r, totalDiceCount = 1) {
  let f = "white", fz = "24", p = "", tY = "62";
  let sizeClass = (totalDiceCount > 6) ? "dice-tiny" : (totalDiceCount > 3) ? "dice-small" : "";

  if (t === 20) {
    p = `<polygon points="50,5 93,28 93,72 50,95 7,72 7,28" fill="#222" stroke="#fff" stroke-width="3" stroke-linejoin="round"/><polygon points="30,45 70,45 50,75" fill="none" stroke="#fff" stroke-width="2"/><line x1="50" y1="5" x2="30" y2="45" stroke="#fff" stroke-width="2"/><line x1="50" y1="5" x2="70" y2="45" stroke="#fff" stroke-width="2"/><line x1="93" y1="28" x2="70" y2="45" stroke="#fff" stroke-width="2"/><line x1="93" y1="72" x2="70" y2="45" stroke="#fff" stroke-width="2"/><line x1="93" y1="72" x2="50" y2="75" stroke="#fff" stroke-width="2"/><line x1="50" y1="95" x2="50" y2="75" stroke="#fff" stroke-width="2"/><line x1="7" y1="72" x2="50" y2="75" stroke="#fff" stroke-width="2"/><line x1="7" y1="72" x2="30" y2="45" stroke="#fff" stroke-width="2"/><line x1="7" y1="28" x2="30" y2="45" stroke="#fff" stroke-width="2"/>`;
  } else if (t === 10 || t === 100) {
    fz = "28"; tY = "75";
    p = `<polygon points="50,5 95,35 50,95 5,35" fill="#222" stroke="#fff" stroke-width="3"/><polyline points="5,35 25,45 50,35 75,45 95,35" fill="none" stroke="#fff" stroke-width="2"/><line x1="50" y1="5" x2="25" y2="45" stroke="#fff" stroke-width="2"/><line x1="50" y1="5" x2="50" y2="35" stroke="#fff" stroke-width="2"/><line x1="50" y1="5" x2="75" y2="45" stroke="#fff" stroke-width="2"/><line x1="50" y1="95" x2="25" y2="45" stroke="#fff" stroke-width="2"/><line x1="50" y1="95" x2="75" y2="45" stroke="#fff" stroke-width="2"/>`;
  } else if (t === 8) {
    fz = "26"; tY = "75";
    p = `<polygon points="50,5 95,50 50,95 5,50" fill="#222" stroke="#fff" stroke-width="3"/><polygon points="30,45 70,45 50,95" fill="none" stroke="#fff" stroke-width="2"/><line x1="50" y1="5" x2="30" y2="45" stroke="#fff" stroke-width="2"/><line x1="50" y1="5" x2="70" y2="45" stroke="#fff" stroke-width="2"/><line x1="5" y1="50" x2="30" y2="45" stroke="#fff" stroke-width="2"/><line x1="95" y1="50" x2="70" y2="45" stroke="#fff" stroke-width="2"/>`;
  } else if (t === 4) {
    fz = "30"; tY = "70";
    p = `<polygon points="50,15 95,85 5,85" fill="#222" stroke="#fff" stroke-width="4"/>`;
  } else {
    fz = "42"; tY = "65";
    p = `<rect x="10" y="10" width="80" height="80" rx="10" fill="#222" stroke="#fff" stroke-width="4"/>`;
  }
  return `<svg class="dice-vector ${sizeClass}" viewBox="0 0 100 100">${p}<text class="dice-result-text" x="50" y="${tY}" fill="${f}" font-size="${fz}" text-anchor="middle" font-family="var(--font-heading)" font-weight="bold">${r}</text></svg>`;
}

async function initRoll(type, sourceId, titleName, useWisdom = false) {
  if (type === 'attack' && sourceId === 'missile') {
    const missSel = document.getElementById('missile-weapon-select');
    const opt = missSel ? missSel.options[missSel.selectedIndex] : null;
    const dmg = opt ? opt.getAttribute('data-dmg') : '0';
    if (!opt || dmg === '0' || opt.text.toLowerCase().includes('sin armas a distancia')) {
      await showDialog('SIN ARMAS A DISTANCIA', 'No tienes ningún arma de proyectiles o arrojadiza disponible en el inventario para atacar a distancia.');
      return;
    }
  }

  currentRollTask = { type, sourceId, titleName, useWisdom };
  setText('pre-roll-title', titleName);
  setVal('roll-mod-val', '0');
  setDisplay('roll-mod-container', type === 'spell' ? 'none' : 'block');
  setDisplay('roll-spell-container', type === 'spell' ? 'block' : 'none');
  if (type === 'spell') setVal('roll-spell-formula', '1d6');
  setDisplay('pre-roll-modal', 'flex');
}

function executeRoll() {
  setDisplay('pre-roll-modal', 'none');
  const mod = parseInt(getVal('roll-mod-val')) || 0;
  const ctr = document.getElementById('dice-animation-container');
  let bR = 0, tR = 0, s1 = "", s2 = "", s = false, ds = [];
  ctr.innerHTML = "";

  // ====== PRUEBA DE CARACTERÍSTICA (1d20 <= CARACTERÍSTICA EFECTIVA) ======
  if (currentRollTask.type === 'stat') {
    let statKey = currentRollTask.sourceId.replace('stat-', '');
    let effectiveStat = getEffectiveStat(statKey);
    let baseVal = getNum('stat-' + statKey);
    let itemMod = effectiveStat - baseVal;

    let targetWithMod = effectiveStat + mod;

    bR = Math.floor(Math.random() * 20) + 1;
    s = (bR <= targetWithMod);

    let chips = [];
    chips.push(`<span style="white-space:nowrap; background:#f4f4f4; border:1px solid #ccc; padding:2px 8px; border-radius:3px;">1d20: <b>${bR}</b></span>`);
    chips.push(`<span style="white-space:nowrap; background:#f4f4f4; border:1px solid #ccc; padding:2px 8px; border-radius:3px;">Base: <b>${baseVal}</b></span>`);
    if (itemMod !== 0) {
      chips.push(`<span style="white-space:nowrap; background:${itemMod > 0 ? '#eef6ff' : '#ffebee'}; border:1px solid ${itemMod > 0 ? '#0056b3' : '#880000'}; padding:2px 8px; border-radius:3px;">Objetos: <b>${OSE.fS(itemMod)}</b></span>`);
    }
    if (mod !== 0) {
      chips.push(`<span style="white-space:nowrap; background:#f4f4f4; border:1px solid #ccc; padding:2px 8px; border-radius:3px;">Mod. Dificultad: <b>${OSE.fS(mod)}</b></span>`);
    }

    s1 = `
      <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:6px; margin-bottom:6px;">
        ${chips.join('')}
      </div>
      <div style="font-size:1.15rem; font-family:var(--font-heading);">Resultado: <b>${bR}</b> &le; ${targetWithMod} (${currentRollTask.titleName} Efectiva)</div>
    `;
    s2 = s ? "¡ÉXITO!" : "FALLO";
    ds.push(generateVectorDie(20, bR, 1));

  } else if (currentRollTask.type === 'save') {
    let wM = currentRollTask.useWisdom ? OSE.gM(getEffectiveStat('sab')) : 0;
    let effSave = getActiveEffectSaveBonus();
    let accSave = getPassiveAccessoryBonuses().save;
    bR = Math.floor(Math.random() * 20) + 1;
    tR = bR + mod + wM + effSave + accSave;
    s = (tR >= getNum(currentRollTask.sourceId));

    let chips = [];
    chips.push(`<span style="white-space:nowrap; background:#f4f4f4; border:1px solid #ccc; padding:2px 8px; border-radius:3px;">1d20: <b>${bR}</b></span>`);
    if (currentRollTask.useWisdom && wM !== 0) {
      chips.push(`<span style="white-space:nowrap; background:#f4f4f4; border:1px solid #ccc; padding:2px 8px; border-radius:3px;">Mod. SAB: <b>${OSE.fS(wM)}</b></span>`);
    }
    if (accSave !== 0) {
      chips.push(`<span style="white-space:nowrap; background:#eef6ff; border:1px solid #0056b3; padding:2px 8px; border-radius:3px;">Accesorios: <b>${OSE.fS(accSave)}</b></span>`);
    }
    if (effSave !== 0) {
      chips.push(`<span style="white-space:nowrap; background:${effSave > 0 ? '#eef6ff' : '#ffebee'}; border:1px solid ${effSave > 0 ? '#0056b3' : '#880000'}; padding:2px 8px; border-radius:3px;">Efectos: <b>${OSE.fS(effSave)}</b></span>`);
    }
    if (mod !== 0) {
      chips.push(`<span style="white-space:nowrap; background:#f4f4f4; border:1px solid #ccc; padding:2px 8px; border-radius:3px;">Mod. Extra: <b>${OSE.fS(mod)}</b></span>`);
    }

    s1 = `
      <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:6px; margin-bottom:6px;">
        ${chips.join('')}
      </div>
      <div style="font-size:1.15rem; font-family:var(--font-heading);">Total: <b>${tR}</b> &ge; ${getNum(currentRollTask.sourceId)}</div>
    `;
    s2 = s ? "¡ÉXITO!" : "FALLO";
    ds.push(generateVectorDie(20, bR, 1));

  } else if (currentRollTask.type === 'initiative') {
    bR = Math.floor(Math.random() * 6) + 1;
    let dM = document.getElementById('init-dex-mod').checked ? OSE.gM(getEffectiveStat('des')) : 0;
    tR = bR + mod + dM;
    s1 = `
      <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:6px; margin-bottom:6px;">
        <span style="white-space:nowrap; background:#f4f4f4; border:1px solid #ccc; padding:2px 8px; border-radius:3px;">1d6: <b>${bR}</b></span>
        ${dM != 0 ? `<span style="white-space:nowrap; background:#f4f4f4; border:1px solid #ccc; padding:2px 8px; border-radius:3px;">Mod. DES: <b>${OSE.fS(dM)}</b></span>` : ''}
        ${mod != 0 ? `<span style="white-space:nowrap; background:#f4f4f4; border:1px solid #ccc; padding:2px 8px; border-radius:3px;">Mod. Extra: <b>${OSE.fS(mod)}</b></span>` : ''}
      </div>
    `;
    s2 = `Iniciativa: ${tR}`;
    ds.push(generateVectorDie(6, bR, 1));

  } else if (currentRollTask.type === 'skill') {
    bR = Math.floor(Math.random() * 6) + 1;
    let targetThreshold = getNum(currentRollTask.sourceId) + mod;
    s = (bR <= targetThreshold);
    s1 = `
      <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:6px; margin-bottom:6px;">
        <span style="white-space:nowrap; background:#f4f4f4; border:1px solid #ccc; padding:2px 8px; border-radius:3px;">1d6: <b>${bR}</b></span>
        ${mod != 0 ? `<span style="white-space:nowrap; background:#f4f4f4; border:1px solid #ccc; padding:2px 8px; border-radius:3px;">Mod: <b>${OSE.fS(mod)}</b></span>` : ''}
      </div>
      <div style="font-size:1.15rem; font-family:var(--font-heading);">Resultado: <b>${bR}</b> (Obj: &le; ${targetThreshold}-en-6)</div>
    `;
    s2 = s ? "¡ÉXITO!" : "FALLO";
    ds.push(generateVectorDie(6, bR, 1));

  } else if (currentRollTask.type === 'thief') {
    let t = Math.floor(Math.random() * 10), u = Math.floor(Math.random() * 10);
    bR = (t === 0 && u === 0) ? 100 : t * 10 + u;
    tR = bR + mod;
    s = (tR <= getNum(currentRollTask.sourceId));
    s1 = `
      <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:6px; margin-bottom:6px;">
        <span style="white-space:nowrap; background:#f4f4f4; border:1px solid #ccc; padding:2px 8px; border-radius:3px;">1d100: <b>${bR}%</b></span>
        ${mod != 0 ? `<span style="white-space:nowrap; background:#f4f4f4; border:1px solid #ccc; padding:2px 8px; border-radius:3px;">Mod: <b>${OSE.fS(mod)}</b></span>` : ''}
      </div>
      <div style="font-size:1.15rem; font-family:var(--font-heading);">Total: <b>${tR}%</b> &le; ${getNum(currentRollTask.sourceId)}%</div>
    `;
    s2 = s ? "¡ÉXITO!" : "FALLO";
    ds.push(generateVectorDie(10, Math.floor(bR / 10) % 10, 2));
    ds.push(generateVectorDie(10, bR % 10, 2));

  } else if (currentRollTask.type === 'turn_undead') {
    let r1 = Math.floor(Math.random() * 6) + 1, r2 = Math.floor(Math.random() * 6) + 1;
    bR = r1 + r2;
    tR = bR + mod;
    let ns = ['Esqueletos', 'Zombis', 'Necrófagos', 'Espectros', 'Apariciones', 'Momias', 'Albedos', 'Vampiros'], des = [], exp = [], fail = [];
    for (let i = 1; i <= 8; i++) {
      let v = getVal('turn-' + i), n = ns[i - 1];
      if (v === 'D') des.push(n);
      else if (v === 'E') exp.push(n);
      else if (v !== '—') {
        if (tR >= parseInt(v)) exp.push(n); else fail.push(n);
      }
    }
    s1 = `
      <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:6px; margin-bottom:6px;">
        <span style="white-space:nowrap; background:#f4f4f4; border:1px solid #ccc; padding:2px 8px; border-radius:3px;">2d6: <b>${r1} + ${r2} = ${bR}</b></span>
        ${mod != 0 ? `<span style="white-space:nowrap; background:#f4f4f4; border:1px solid #ccc; padding:2px 8px; border-radius:3px;">Mod: <b>${OSE.fS(mod)}</b></span>` : ''}
      </div>
      <div style="font-size:1.15rem; font-family:var(--font-heading);">Total: <b>${tR}</b></div>
    `;
    let ht = `<div class="flex-col gap-5 mt-5">`;
    if (des.length > 0) ht += `<div><span style="color:#d32f2f; font-weight:bold;">DESTRUIDOS</span><br>${des.join(', ')}</div>`;
    if (exp.length > 0) ht += `<div><span style="color:#b8860b; font-weight:bold;">EXPULSADOS</span><br>${exp.join(', ')}</div>`;
    if (fail.length > 0) ht += `<div><span style="color:#555;">NO AFECTADOS</span><br>${fail.join(', ')}</div>`;
    if (des.length === 0 && exp.length === 0) ht = `<div style="color:red; font-weight:bold;">NINGÚN EFECTO</div>`;
    else ht += `<div style="border-top:1px solid #ccc; padding-top:6px;">Poder: ${Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1} DG</div>`;
    s2 = ht + `</div>`;
    ds.push(generateVectorDie(6, r1, 2));
    ds.push(generateVectorDie(6, r2, 2));

  } else if (currentRollTask.type === 'attack' || currentRollTask.type === 'backstab') {
    const cls = getVal('char-class');
    const lvl = getNum('char-level');
    const cbt = OSE.gCombat(cls, lvl);
    const baseBA = cbt.b;
    const isM = (currentRollTask.sourceId === 'melee' || currentRollTask.type === 'backstab');
    
    // Estadísticas base y efectivas
    const statKey = isM ? 'fue' : 'des';
    const baseStatVal = getNum('stat-' + statKey);
    const effectiveStatVal = getEffectiveStat(statKey);
    const itemStatBonus = effectiveStatVal - baseStatVal;

    const baseStatMod = OSE.gM(baseStatVal);
    const effectiveStatMod = OSE.gM(effectiveStatVal);
    const statModDiff = effectiveStatMod - baseStatMod;

    const racialMod = (!isM && cls === 'mediano') ? 1 : 0;
    const backstabMod = (currentRollTask.type === 'backstab') ? 4 : 0;
    const effAtkMod = getActiveEffectAtkBonus();
    const accBonuses = getPassiveAccessoryBonuses();

    const activeSel = document.getElementById(isM ? 'melee-weapon-select' : 'missile-weapon-select');
    const activeOpt = activeSel ? activeSel.options[activeSel.selectedIndex] : null;
    
    const wDmg = activeOpt ? activeOpt.getAttribute('data-dmg') : '0';
    const wBonus = activeOpt ? (parseInt(activeOpt.getAttribute('data-bonus')) || 0) : 0;
    const wExtraDmg = activeOpt ? (parseInt(activeOpt.getAttribute('data-extradmg')) || 0) : 0;
    const thrownType = (!isM && activeOpt) ? activeOpt.getAttribute('data-thrown') : null;
    const currentWeaponName = activeOpt ? activeOpt.text.toLowerCase() : '';

    const totalAtkMod = baseBA + effectiveStatMod + racialMod + mod + backstabMod + effAtkMod + wBonus + accBonuses.atk;

    bR = Math.floor(Math.random() * 20) + 1;
    tR = bR + totalAtkMod;

    let as = (getVal('ac-system') === 'asc');
    let hitString = as ? `Impacta a CAA: ${tR}` : `Impacta a CAD: ${cbt.g - tR}`;
    if (bR === 20) hitString = "¡IMPACTO CRÍTICO!";
    if (bR === 1) hitString = "¡PIFIA!";

    let hS = `<div style="font-size:1.45rem; font-weight:bold; font-family:var(--font-heading); color:${bR === 20 ? 'green' : bR === 1 ? 'red' : 'inherit'};">${hitString}</div>`;

    let strikeBonus = 0;
    let strikeDiceRoll = 0;
    let activeStrike = isM ? activeEffects.find(e => e.dmgDice && currentWeaponName.includes(e.weapon)) : null;
    if (activeStrike) {
      strikeDiceRoll = Math.floor(Math.random() * 6) + 1;
      strikeBonus = strikeDiceRoll;
    }

    let dR = 0;
    let baseDmgMod = 0;
    let rolledDice = [];

    if (wDmg !== '0') {
      let tokens = wDmg.match(/([\+\-]?\s*\d+d\d+)|([\+\-]?\s*\d+)/gi);
      if (tokens) {
        tokens.forEach(tok => {
          let t = tok.replace(/\s/g, '');
          if (t.includes('d')) {
            let parts = t.match(/([\+\-]?)(\d+)d(\d+)/i);
            if (parts) {
              let sign = parts[1] === '-' ? -1 : 1;
              let dC = parseInt(parts[2]);
              let dF = parseInt(parts[3]);
              for (let i = 0; i < dC; i++) {
                let r = Math.floor(Math.random() * dF) + 1;
                dR += sign * r;
                rolledDice.push({ faces: dF, val: r });
              }
            }
          } else {
            baseDmgMod += parseInt(t);
          }
        });
      } else {
        dR = 1; rolledDice.push({ faces: 2, val: 1 });
      }
    }

    let dmgModTotal = isM ? effectiveStatMod : 0;
    let effDmg = getActiveEffectDmgBonus();
    let totalDmgBonus = dmgModTotal + effDmg + strikeBonus + wBonus + wExtraDmg + baseDmgMod + accBonuses.dmg;
    let baseDmg = wDmg !== '0' ? Math.max(1, dR + totalDmgBonus) : 0;
    let bsMult = currentRollTask.type === 'backstab' ? (parseInt(getVal('thief-backstab').replace(/\D/g, '')) || 2) : 1;
    let totalDmg = baseDmg * bsMult;

    let chips = [];
    chips.push(`<span style="white-space:nowrap; background:#f4f4f4; border:1px solid #ccc; padding:2px 8px; border-radius:3px;">1d20: <b>${bR}</b></span>`);
    chips.push(`<span style="white-space:nowrap; background:#f4f4f4; border:1px solid #ccc; padding:2px 8px; border-radius:3px;">BA: <b>${OSE.fS(baseBA)}</b></span>`);
    
    // Desglose didáctico de Característica vs Objeto
    if (itemStatBonus !== 0) {
      chips.push(`<span style="white-space:nowrap; background:#f4f4f4; border:1px solid #ccc; padding:2px 8px; border-radius:3px;">${isM ? 'FUE Base' : 'DES Base'} (${baseStatVal}): <b>${OSE.fS(baseStatMod)}</b></span>`);
      chips.push(`<span style="white-space:nowrap; background:#eef6ff; border:1px solid #0056b3; padding:2px 8px; border-radius:3px; color:#0056b3;">Objeto ${isM ? 'FUE' : 'DES'} (${OSE.fS(itemStatBonus)}): <b>${OSE.fS(statModDiff)} Mod</b></span>`);
    } else {
      chips.push(`<span style="white-space:nowrap; background:#f4f4f4; border:1px solid #ccc; padding:2px 8px; border-radius:3px;">Mod. ${isM ? 'FUE' : 'DES'} (${baseStatVal}): <b>${OSE.fS(effectiveStatMod)}</b></span>`);
    }

    if (!isM && racialMod > 0) {
      chips.push(`<span style="white-space:nowrap; background:#f4f4f4; border:1px solid #ccc; padding:2px 8px; border-radius:3px;">Raza (Mediano): <b>+1</b></span>`);
    }
    if (wBonus !== 0) chips.push(`<span style="white-space:nowrap; background:#f4f4f4; border:1px solid #ccc; padding:2px 8px; border-radius:3px;">Arma: <b>${OSE.fS(wBonus)}</b></span>`);
    if (accBonuses.atk !== 0) chips.push(`<span style="white-space:nowrap; background:#eef6ff; border:1px solid #0056b3; padding:2px 8px; border-radius:3px; color:#0056b3;">Accesorios Atq: <b>${OSE.fS(accBonuses.atk)}</b></span>`);
    if (effAtkMod !== 0) chips.push(`<span style="white-space:nowrap; background:${effAtkMod > 0 ? '#eef6ff' : '#ffebee'}; border:1px solid ${effAtkMod > 0 ? '#0056b3' : '#880000'}; padding:2px 8px; border-radius:3px;">Efectos: <b>${OSE.fS(effAtkMod)}</b></span>`);
    if (backstabMod > 0) chips.push(`<span style="white-space:nowrap; background:#f4f4f4; border:1px solid #ccc; padding:2px 8px; border-radius:3px;">Apuñalar: <b>+4</b></span>`);
    if (mod !== 0) chips.push(`<span style="white-space:nowrap; background:#f4f4f4; border:1px solid #ccc; padding:2px 8px; border-radius:3px;">Mod. Extra: <b>${OSE.fS(mod)}</b></span>`);

    let thrownMsg = "";
    if (thrownType && thrownType !== 'null') {
      thrownWeapons[thrownType] = (thrownWeapons[thrownType] || 0) + 1;
      updateWeapons();
      thrownMsg = `<div style="font-size:0.85rem; color:#856404; background:#fff3cd; padding:4px 6px; border-radius:3px; margin-top:5px; border:1px solid #ffeeba;">Arma arrojada: Queda en el suelo hasta que decidas recogerla o descartarla.</div>`;
    }

    s1 = `
      <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:6px; margin-bottom:6px;">
        ${chips.join('')}
      </div>
      ${thrownMsg}
    `;

    let totalDiceToDisplay = 1 + rolledDice.length + (activeStrike ? 1 : 0);

    if (bR === 1) {
      s2 = `${hS}<div style="font-size:1.1rem; font-weight:normal; font-family:var(--font-body); margin:4px 0;">Ataque fallido</div>`;
      ds.push(generateVectorDie(20, bR, 1));
    } else {
      if (wDmg !== '0') {
        let staticMod = dmgModTotal + wBonus + wExtraDmg + baseDmgMod + accBonuses.dmg;
        let dieModStr = staticMod !== 0 ? ` (${OSE.fS(staticMod)})` : '';
        let strikeStr = activeStrike ? ` + Golpear: 1d6 (${strikeDiceRoll})` : '';
        let dieStr = `${wDmg}: ${dR}${dieModStr}${strikeStr}${bsMult > 1 ? ` (x${bsMult})` : ''}`;
        s2 = `${hS}<div style="font-size:1.1rem; font-weight:normal; font-family:var(--font-body); margin:4px 0;">${dieStr}</div><div style="font-size:1.45rem; font-weight:bold; font-family:var(--font-heading);">Daño: ${totalDmg}</div>`;
      } else {
        s2 = `${hS}<div style="font-size:1.1rem; font-weight:normal; font-family:var(--font-body); margin:4px 0;">Sin arma (0)</div><div style="font-size:1.45rem; font-weight:bold; font-family:var(--font-heading);">Daño: 0</div>`;
      }

      ds.push(generateVectorDie(20, bR, totalDiceToDisplay));
      rolledDice.forEach(d => {
        ds.push(generateVectorDie(d.faces, d.val, totalDiceToDisplay));
      });
      if (activeStrike) ds.push(generateVectorDie(6, strikeDiceRoll, totalDiceToDisplay));
    }

    if (activeStrike) {
      activeEffects = activeEffects.filter(e => e.id !== activeStrike.id);
      updateActiveEffectsUI();
      autoSave();
      s2 += `<div style="font-size:0.85rem; color:#880000; margin-top:5px; font-weight:normal; font-family:var(--font-body);">Efecto <i>Golpear</i> consumido.</div>`;
    }

  } else if (currentRollTask.type === 'spell') {
    let rawFormula = getVal('roll-spell-formula') || "1d6";
    let parts = rawFormula.split(/[,;\/]+/).map(p => p.trim()).filter(p => p.length > 0);
    if (parts.length === 0) parts = ["1d6"];

    let breakdownParts = [];
    let summaryParts = [];
    let totalDiceToRoll = 0;
    parts.forEach(part => {
      let mt = part.match(/^(\d+)d(\d+)/i);
      if (mt) totalDiceToRoll += parseInt(mt[1]) || 1;
    });

    parts.forEach(part => {
      let mt = part.match(/^(\d+)d(\d+)([+\-]\d+)?\s*(.*)$/i);
      if (mt) {
        let cnt = parseInt(mt[1]), fac = parseInt(mt[2]), md = mt[3] ? parseInt(mt[3]) : 0;
        let label = mt[4] ? mt[4].trim() : "";
        let ro = [];
        for (let i = 0; i < cnt; i++) ro.push(Math.floor(Math.random() * fac) + 1);
        let partTotal = Math.max(0, ro.reduce((a, b) => a + b, 0) + md);

        let rollStr = ro.join(' + ') + (md !== 0 ? ` (${OSE.fS(md)})` : '');
        breakdownParts.push(`<b>${cnt}d${fac}${md !== 0 ? OSE.fS(md) : ''} ${label ? `(${label})` : ''}</b>: ${rollStr} = <b>${partTotal}${label ? ` ${label}` : ''}</b>`);
        summaryParts.push(`${partTotal}${label ? ` ${label}` : ''}`);

        ro.forEach(r => ds.push(generateVectorDie(fac, r, totalDiceToRoll)));
      } else {
        breakdownParts.push(`<b>${part}</b>`);
        summaryParts.push(part);
      }
    });

    s1 = `Fórmula: <b>${rawFormula}</b><br>` + breakdownParts.join('<br>');
    s2 = summaryParts.join(' | ');

    if (currentRollTask.targetRow) {
      let cb = currentRollTask.targetRow.querySelector('input[type="checkbox"]');
      if (cb) { cb.checked = true; autoSave(); }
    }
  }

  ds.forEach(d => ctr.innerHTML += d);
  setDisplay('dice-result-overlay', 'flex');
  setDisplay('dice-result-panel', 'none');
  ctr.querySelectorAll('.dice-vector').forEach(v => {
    v.classList.remove('dice-tumbling');
    void v.offsetWidth;
    v.classList.add('dice-tumbling');
  });

  setTimeout(() => {
    setText('result-title', currentRollTask.titleName);
    document.getElementById('result-breakdown').innerHTML = s1;
    document.getElementById('result-final').innerHTML = s2;
    document.getElementById('result-final').style.color = (!s2.includes("<div") && (s2.includes("ÉXITO") || s2.includes("CRÍTICO") || s2.includes("IMPACTO CRÍTICO"))) ? 'green' : (s2.includes("FALLO") || s2.includes("PIFIA")) ? 'red' : '';
    setDisplay('dice-result-panel', 'flex');
  }, 1100);
}

// ====== MODAL DE EXPORTACIÓN ======
function openExportModal() {
  setDisplay('export-modal', 'flex');
}

function closeExportModal() {
  setDisplay('export-modal', 'none');
}

function triggerPrint() {
  closeExportModal();
  window.print();
}

function triggerPDF() {
  closeExportModal();
  window.print();
}

function triggerJSON() {
  closeExportModal();
  exportData();
}

// ====== GUARDADO, EXPORTACIÓN E IMPORTACIÓN ======
function getSaveData() {
  const d = {};
  document.querySelectorAll('input[id], select[id], textarea[id]').forEach(e => {
    d[e.id] = e.type === 'checkbox' ? e.checked : e.value;
  });
  d.inv = [];
  document.querySelectorAll('#equipment-items-list .item-row').forEach(r => {
    let textInput = r.querySelector('input[type="text"]');
    let numInput = r.querySelector('input[type="number"]');
    let equipCb = r.querySelector('.item-equip-cb');
    if (textInput && numInput) {
      d.inv.push({
        n: textInput.value,
        w: numInput.value,
        eq: equipCb ? equipCb.checked : true
      });
    }
  });
  d.sp = {};
  for (let l = 1; l <= 6; l++) {
    ['arcane', 'divine'].forEach(t => {
      let lst = document.getElementById(`${t}-list-${l}`);
      if (lst) {
        d.sp[`${t}-${l}`] = [];
        lst.querySelectorAll('.spell-row').forEach(r => {
          let cb = r.querySelector('input[type="checkbox"]');
          d.sp[`${t}-${l}`].push({ n: r.getAttribute('data-dbname'), p: cb ? cb.checked : false, rev: (r.getAttribute('data-rev') === 'true') });
        });
      }
    });
  }
  d.thrown = thrownWeapons;
  d.effects = activeEffects;
  d.hpHistory = hpHistory;
  d.baseRolledHP = baseRolledHP;
  d.languagesFixed = languagesFixed;
  return d;
}

function applySaveData(d) {
  if (!d) return;
  if (d['coin-gp'] !== undefined) { d['coin-mo'] = d['coin-gp']; delete d['coin-gp']; }
  if (d['coin-sp'] !== undefined) { d['coin-ml'] = d['coin-sp']; delete d['coin-sp']; }
  if (d['coin-cp'] !== undefined) { d['coin-mc'] = d['coin-cp']; delete d['coin-cp']; }

  Object.keys(d).forEach(k => {
    if (k !== 'inv' && k !== 'sp' && k !== 'thrown' && k !== 'effects' && k !== 'hpHistory' && k !== 'languagesFixed' && k !== 'baseRolledHP') {
      let e = document.getElementById(k);
      if (e) { e.type === 'checkbox' ? e.checked = d[k] : e.value = d[k]; }
    }
  });

  let l = document.getElementById('equipment-items-list');
  if (l && d.inv) {
    l.innerHTML = '';
    d.inv.forEach(i => addEquipmentRow(i.n, i.w, false, i.eq !== undefined ? i.eq : true));
  }

  if (d.sp) {
    for (let lv = 1; lv <= 6; lv++) {
      ['arcane', 'divine'].forEach(t => {
        let lst = document.getElementById(`${t}-list-${lv}`);
        if (lst && d.sp[`${t}-${lv}`]) {
          lst.innerHTML = '';
          d.sp[`${t}-${lv}`].forEach(s => {
            let row = createSpellRow(s.n, s.p, s.rev || false);
            if (row) lst.appendChild(row);
          });
        }
      });
    }
  }

  thrownWeapons = d.thrown || {};
  activeEffects = d.effects || [];
  hpHistory = d.hpHistory || {};
  baseRolledHP = d.baseRolledHP || getNum('hp-max') || 0;
  languagesFixed = d.languagesFixed || false;

  runAutoCalculations(false);
  applyStatsFixedState();
  updateThrownRecoveryUI();
  updateActiveEffectsUI();
}

function autoSave() {
  if (blockAutoSave) return;
  localStorage.setItem('ose_char', JSON.stringify(getSaveData()));
}

function exportData() {
  let d = getSaveData(), b = new Blob([JSON.stringify(d)], { type: 'application/json' }), a = document.createElement('a');
  a.href = URL.createObjectURL(b);
  a.download = `Personaje_${d['char-name'] ? d['char-name'] : 'OSE'}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}

function importData(e) {
  let f = e.target.files[0];
  if (!f) return;
  let r = new FileReader();
  r.onload = async (ev) => {
    try {
      applySaveData(JSON.parse(ev.target.result));
      autoSave();
      await showDialog('AVISO', 'Personaje cargado correctamente.');
    } catch (er) {
      await showDialog('ERROR', 'Archivo JSON inválido.');
    }
  };
  r.readAsText(f);
}

async function resetSheet() {
  if (await showDialog('ATENCIÓN', '¿Borrar ficha actual?\nSe perderán todos los datos no exportados.', true)) {
    localStorage.removeItem('ose_char');
    location.reload();
  }
}

function dSetup() {
  updateLevelDropdown();
  runAutoCalculations(true);
  updateInventoryDerived();
  applyStatsFixedState();
  updateThrownRecoveryUI();
  updateActiveEffectsUI();
  autoSave();
}

document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('input', autoSave);
  document.addEventListener('change', autoSave);
  let s = localStorage.getItem('ose_char');
  if (s) {
    document.getElementById('wizard-overlay').style.display = 'none';
    document.getElementById('main-sheet').style.display = 'block';
    try {
      applySaveData(JSON.parse(s));
    } catch (e) {
      dSetup();
    }
  } else {
    blockAutoSave = true;
    document.getElementById('wizard-overlay').style.display = 'flex';
    dSetup();
  }
});
