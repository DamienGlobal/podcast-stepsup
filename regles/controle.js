// Contrôle codé des règles de communication du podcast STEPS'UP (R1 à R11).
// Déterministe : aucune dépendance, aucun modèle. Seule source des listes et des textes imposés :
// regles/regles_podcast.json (passé en paramètre « regles »).
// Utilisable tel quel dans Node (module.exports) et recopié dans un nœud Code n8n.
// Issues : 'BLOQUÉ', 'À RELIRE', 'CONFORME'.

function neutraliser(s) {
  // Neutralise la forme des apostrophes et des espaces (insécables, fines, tabulations).
  return String(s == null ? '' : s)
    .replace(/[’‘ʼ`´′]/g, "'")
    .replace(/[    \t]/g, ' ')
    .replace(/\r\n?/g, '\n')
    .replace(/ {2,}/g, ' ');
}

function plier(s) {
  // Minuscules sans accents, longueur conservée (un caractère pour un caractère) pour garder les positions.
  const t = neutraliser(s).toLowerCase();
  let o = '';
  for (const c of t) {
    const b = c.normalize('NFD').replace(/[̀-ͯ]/g, '');
    o += b.length ? b[0] : c;
  }
  return o;
}

function echapper(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

function trouver(textePlie, terme, racine) {
  // Positions des occurrences de « terme » comme mot entier (ou comme début de mot si racine).
  const t = plier(terme);
  const debut = /^[a-z0-9]/.test(t) ? '(?<![a-z0-9])' : '';
  const fin = racine ? '[a-z0-9-]*' : (/[a-z0-9]$/.test(t) ? '(?![a-z0-9])' : '');
  const re = new RegExp(debut + echapper(t) + fin, 'g');
  const res = [];
  let m;
  while ((m = re.exec(textePlie)) !== null) { res.push({ i: m.index, n: m[0].length }); if (m[0].length === 0) re.lastIndex++; }
  return res;
}

function extrait(texte, i, n) {
  const t = neutraliser(texte);
  const a = Math.max(0, i - 40), b = Math.min(t.length, i + n + 40);
  return (a > 0 ? '…' : '') + t.slice(a, b).replace(/\s+/g, ' ').trim() + (b < t.length ? '…' : '');
}

function chevauche(occ, zones) { return zones.some(z => occ.i < z.i + z.n && z.i < occ.i + occ.n); }

function controlerTextes(textes, regles, options) {
  const opt = options || {};
  const C = regles.controle;
  const T = regles.textes_imposes;
  const annonceFaite = opt.annonceFaite != null ? !!opt.annonceFaite : !!regles.ANNONCE_FAITE;
  const points = [];
  const vus = {};
  function ajouter(regle, niveau, champ, motif, texte, occ) {
    const cle = regle + '|' + champ + '|' + motif;
    if (vus[cle]) { vus[cle].occurrences++; return; }
    const p = { regle: regle, niveau: niveau, champ: champ, motif: motif, extrait: occ ? extrait(texte, occ.i, occ.n) : '', occurrences: 1 };
    vus[cle] = p;
    points.push(p);
  }

  const titre = neutraliser(textes.titre || '').trim();
  const description = neutraliser(textes.description || '').trim();
  const script = neutraliser(textes.script || '').trim();
  const R1 = neutraliser(T.R1_annonce_audio).trim();
  const R2 = neutraliser(T.R2_ligne_description).trim();

  // R1 : première phrase du texte envoyé à la voix.
  let scriptReste = script;
  if (script.startsWith(R1)) scriptReste = script.slice(R1.length);
  else ajouter('R1', 'BLOQUÉ', 'script', 'annonce IA absente ou altérée en ouverture', script, { i: 0, n: Math.min(script.length, 80) });

  // R2 : première ligne de la description.
  const lignes = description.split('\n');
  let descReste = description;
  if (lignes[0].trim() === R2) descReste = lignes.slice(1).join('\n');
  else ajouter('R2', 'BLOQUÉ', 'description', 'ligne IA absente ou altérée en première ligne', description, { i: 0, n: Math.min(description.length, 80) });

  const champs = { titre: titre, description: descReste, script: scriptReste };

  for (const champ of Object.keys(champs)) {
    const texte = champs[champ];
    const P = plier(texte);

    // R6 et R9 : bloquants partout.
    for (const e of C.R6_expressions) for (const o of trouver(P, e)) ajouter('R6', 'BLOQUÉ', champ, e, texte, o);
    for (const e of C.R9_mots) for (const o of trouver(P, e)) ajouter('R9', 'BLOQUÉ', champ, e, texte, o);
    for (const e of C.R9_racines) for (const o of trouver(P, e, true)) ajouter('R9', 'BLOQUÉ', champ, e + '…', texte, o);

    // R7 : bloquant tant que l'annonce n'est pas faite.
    if (!annonceFaite) {
      const zones7 = [];
      for (const e of C.R7_bloquant_si_annonce_non_faite) for (const o of trouver(P, e)) { zones7.push(o); ajouter('R7', 'BLOQUÉ', champ, e, texte, o); }
      for (const e of C.R7_a_relire) for (const o of trouver(P, e)) if (!chevauche(o, zones7)) ajouter('R7', 'À RELIRE', champ, e, texte, o);
    }

    // R3 : promesse bloquante dans le titre et la description ; formule de gain à relire dans le script.
    if (champ === 'titre' || champ === 'description') {
      const exceptions = [];
      for (const e of C.R3_exceptions_garantie) exceptions.push(...trouver(P, e));
      for (const e of C.R3_promesses_bloquantes_titre_description) {
        for (const o of trouver(P, e)) if (!chevauche(o, exceptions)) ajouter('R3', 'BLOQUÉ', champ, e, texte, o);
      }
      for (const e of (C.R3_a_relire_titre_description || [])) for (const o of trouver(P, e)) ajouter('R3', 'À RELIRE', champ, e, texte, o);
    } else {
      for (const e of C.R3_formules_gain_script) for (const o of trouver(P, e)) ajouter('R3', 'À RELIRE', champ, e, texte, o);
    }

    // R4 : mots et formules à relire ; sigle IA hors R1/R2.
    for (const e of C.R4_mots) for (const o of trouver(P, e)) ajouter('R4', 'À RELIRE', champ, e, texte, o);
    for (const e of C.R4_formules) for (const o of trouver(P, e)) ajouter('R4', 'À RELIRE', champ, e, texte, o);
    if (C.R4_sigle_IA) {
      const re = /(?<![A-Za-zÀ-ÿ0-9])IA(?![A-Za-zÀ-ÿ0-9])/g; let m;
      while ((m = re.exec(texte)) !== null) ajouter('R4', 'À RELIRE', champ, 'IA', texte, { i: m.index, n: 2 });
    }

    // R5 : « conseil » et dérivés hors termes permis.
    const permis = [];
    for (const e of C.R5_termes_permis.concat(C.R5_termes_permis_autres_acteurs || [])) permis.push(...trouver(P, e));
    for (const o of trouver(P, C.R5_racine, true).concat(trouver(P, 'deconseill', true))) {
      if (!chevauche(o, permis)) ajouter('R5', 'À RELIRE', champ, 'conseil (hors termes permis)', texte, o);
    }

    // R8 : tutoiement.
    const reTu = /(?<![a-z0-9'-])(tu|te|toi|ton|ta|tes)(?![a-z0-9'-])|(?<![a-z0-9'-])t'(?=[a-z])/g; let mt;
    while ((mt = reTu.exec(P)) !== null) ajouter('R8', 'À RELIRE', champ, 'tutoiement « ' + (mt[1] || "t'") + ' »', texte, { i: mt.index, n: mt[0].length });

    // R10 : indices de témoignage.
    for (const e of C.R10_indices) for (const o of trouver(P, e, true)) ajouter('R10', 'À RELIRE', champ, e, texte, o);

    // R11 : signes interdits dans le titre et la description.
    if (champ === 'titre' || champ === 'description') {
      for (const s of C.R11_signes) { let k = texte.indexOf(s); if (k >= 0) ajouter('R11', 'À RELIRE', champ, 'signe « ' + s + ' »', texte, { i: k, n: s.length }); }
      const reEmo = /\p{Extended_Pictographic}/u; const me = reEmo.exec(texte);
      if (me) ajouter('R11', 'À RELIRE', champ, 'emoji', texte, { i: me.index, n: me[0].length });
    }
  }

  const resultat = points.some(p => p.niveau === 'BLOQUÉ') ? 'BLOQUÉ' : (points.length ? 'À RELIRE' : 'CONFORME');
  const ordre = { 'BLOQUÉ': 0, 'À RELIRE': 1 };
  points.sort((a, b) => (ordre[a.niveau] - ordre[b.niveau]) || a.regle.localeCompare(b.regle, 'fr', { numeric: true }));
  return { resultat: resultat, annonceFaite: annonceFaite, points: points };
}

function poserMentions(textes, regles) {
  // R1 et R2 posées par le code, mot pour mot, jamais écrites par le modèle (sans doublon).
  const R1 = regles.textes_imposes.R1_annonce_audio;
  const R2 = regles.textes_imposes.R2_ligne_description;
  let script = String(textes.script || '').replace(/^\s+/, '');
  if (!neutraliser(script).startsWith(neutraliser(R1))) script = R1 + '\n\n' + script;
  let description = String(textes.description || '').replace(/^\s+/, '');
  if (neutraliser(description.split('\n')[0]).trim() !== neutraliser(R2).trim()) description = R2 + '\n\n' + description;
  return { titre: textes.titre, description: description, script: script };
}

if (typeof module !== 'undefined') module.exports = { controlerTextes, poserMentions, neutraliser, plier };
