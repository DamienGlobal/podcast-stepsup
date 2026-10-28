// Cas de test du contrôle codé. Une commande : node regles/tests/cas_de_test.js
// Sortie : une ligne par cas (RÉUSSI / ÉCHEC), le résultat obtenu et les points relevés. Code de sortie 1 si un cas échoue.
const fs = require('fs');
const path = require('path');
const { controlerTextes, poserMentions } = require('../controle.js');
const regles = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'regles_podcast.json'), 'utf8'));
const R1 = regles.textes_imposes.R1_annonce_audio;
const R2 = regles.textes_imposes.R2_ligne_description;
const R5 = regles.textes_imposes.R5_avertissement;
const ep16 = JSON.parse(fs.readFileSync(path.join(__dirname, 'episode_2026-10-16_tel_quel.json'), 'utf8'));
const ep16c = JSON.parse(fs.readFileSync(path.join(__dirname, 'episode_2026-10-16_corrige.json'), 'utf8'));

const DESC_OK = "Vous louez un appartement vide et vous hésitez entre deux façons de déclarer vos loyers.\n\nDans cet épisode :\n• Le micro-foncier et son abattement forfaitaire\n• Le régime réel et les charges déductibles\n• Les critères pour choisir selon votre situation";
// Lancement de plus de 60 mots sans chiffre, sans date ni terme des sujets des cas T14 à T17.
const INTRO_LONGUE = "Bonjour et bienvenue. Aujourd'hui, nous allons parler d'un sujet qui intéresse beaucoup de monde, et qui soulève souvent des questions. Avant d'entrer dans le vif du sujet, laissez-moi vous expliquer comment cet échange va se dérouler. Nous verrons d'abord les grandes lignes, puis les détails, et enfin les points de vigilance. Installez-vous confortablement, prenez de quoi noter si vous le souhaitez, et restez avec moi jusqu'au bout, parce que la fin compte autant que le début.";
const SCRIPT_OK = "Bonjour à toutes et à tous. Aujourd'hui, nous parlons de la déclaration de vos revenus locatifs. " + R5;

const cas = [
  { id: 'T1', nom: "épisode du 16 octobre tel quel", attendu: 'BLOQUÉ', regles_attendues: ['R1', 'R2', 'R3:titre', 'R9:script'],
    textes: { titre: ep16.titre, description: ep16.description || '', script: ep16.script } },
  { id: 'T2', nom: "le même corrigé (titre sans promesse, R1 et R2 posées, mot remplacé, avertissement R5)", attendu: 'CONFORME',
    textes: poserMentions({ titre: ep16c.titre, description: ep16c.description, script: ep16c.script }, regles) },
  { id: 'T3', nom: "« notre formation » et « inscrivez-vous sur stepsup.fr », ANNONCE_FAITE faux", attendu: 'BLOQUÉ', regles_attendues: ['R7:script'], options: { annonceFaite: false },
    textes: poserMentions({ titre: "Louer vide ou meublé", description: DESC_OK, script: SCRIPT_OK + " Pour aller plus loin, découvrez notre formation : inscrivez-vous sur stepsup.fr." }, regles) },
  { id: 'T4a', nom: "« conseil syndical »", attendu: 'CONFORME',
    textes: poserMentions({ titre: "La copropriété expliquée", description: DESC_OK, script: SCRIPT_OK + " Le conseil syndical contrôle la gestion du syndic." }, regles) },
  { id: 'T4b', nom: "« nos conseils »", attendu: 'À RELIRE', regles_attendues: ['R5:script'],
    textes: poserMentions({ titre: "La copropriété expliquée", description: DESC_OK, script: SCRIPT_OK + " Voici nos conseils pour bien choisir." }, regles) },
  { id: 'T5', nom: "description sans la ligne R2", attendu: 'BLOQUÉ', regles_attendues: ['R2'],
    textes: { titre: "Louer vide ou meublé", description: DESC_OK, script: R1 + "\n\n" + SCRIPT_OK } },
  { id: 'T6', nom: "passage au tutoiement", attendu: 'À RELIRE', regles_attendues: ['R8:script'],
    textes: poserMentions({ titre: "Louer vide ou meublé", description: DESC_OK, script: SCRIPT_OK + " Si tu loues meublé, tu dois savoir ceci." }, regles) },
  { id: 'T7', nom: "« ce contenu a été vérifié par des experts »", attendu: 'À RELIRE', regles_attendues: ['R4:script'],
    textes: poserMentions({ titre: "Louer vide ou meublé", description: DESC_OK, script: SCRIPT_OK + " Ce contenu a été vérifié par des experts." }, regles) },
  // Cas complémentaires (robustesse de la comparaison)
  { id: 'T8', nom: "R1 et R2 avec apostrophes typographiques et espaces insécables : neutralisées", attendu: 'CONFORME',
    textes: { titre: "Louer vide ou meublé",
              description: R2.replace(/'/g, '’').replace(' ;', ' ;') + "\n\n" + DESC_OK,
              script: R1.replace(/'/g, '’').replace(' ;', ' ;') + "\n\n" + SCRIPT_OK } },
  { id: 'T9', nom: "R1 altérée (un mot retiré) : bloquée", attendu: 'BLOQUÉ', regles_attendues: ['R1'],
    textes: { titre: "Louer vide ou meublé", description: R2 + "\n\n" + DESC_OK,
              script: R1.replace(' par IA', '') + "\n\n" + SCRIPT_OK } },
  // Relecture du titre et de l'introduction (ordre de mission du 27/10/2026) : jamais BLOQUÉ.
  { id: 'T10', nom: "titre de plus de 90 caractères : à relire, jamais bloqué", attendu: 'À RELIRE', regles_attendues: ['TITRE:titre'],
    textes: poserMentions({ titre: "Impôts sur les loyers : micro-foncier ou régime réel, ce que chaque régime change pour votre location vide", description: DESC_OK, script: SCRIPT_OK }, regles) },
  { id: 'T11a', nom: "contre-exemple « la bille, la lampe et l'humidimètre » : aucun mot du sujet planifié", attendu: 'À RELIRE', regles_attendues: ['TITRE:titre'],
    textes: Object.assign(poserMentions({ titre: "Visite immobilière : la bille, la lampe et l'humidimètre", description: DESC_OK, script: SCRIPT_OK }, regles), { sujet: "Les vérifications à faire avant d'acheter un appartement" }) },
  { id: 'T11b', nom: "contre-exemple « jackpot ou piège à débutant » : aucun mot du sujet planifié", attendu: 'À RELIRE', regles_attendues: ['TITRE:titre'],
    textes: Object.assign(poserMentions({ titre: "Jackpot ou piège à débutant ?", description: DESC_OK, script: SCRIPT_OK }, regles), { sujet: "Rentabilité locative à la campagne" }) },
  { id: 'T12a', nom: "exemple « PTZ 2026 : qui y a droit et ce qui a changé »", attendu: 'CONFORME',
    textes: Object.assign(poserMentions({ titre: "PTZ 2026 : qui y a droit et ce qui a changé", description: DESC_OK, script: SCRIPT_OK }, regles), { sujet: "Le prêt à taux zéro (PTZ) en 2026" }) },
  { id: 'T12b', nom: "exemple « Taxe foncière : qui paie l'année de la vente »", attendu: 'CONFORME',
    textes: Object.assign(poserMentions({ titre: "Taxe foncière : qui paie l'année de la vente", description: DESC_OK, script: SCRIPT_OK }, regles), { sujet: "La taxe foncière quand on vend en cours d'année" }) },
  { id: 'T12c', nom: "exemple « Loyer impayé : que faire les 60 premiers jours » (pluriel et accents du sujet)", attendu: 'CONFORME',
    textes: Object.assign(poserMentions({ titre: "Loyer impayé : que faire les 60 premiers jours", description: DESC_OK, script: SCRIPT_OK }, regles), { sujet: "LOYERS IMPAYÉS" }) },
  { id: 'T13', nom: "sans sujet planifié : pas de contrôle des mots du sujet", attendu: 'CONFORME',
    textes: poserMentions({ titre: "Jackpot ou piège à débutant ?", description: DESC_OK, script: SCRIPT_OK }, regles) },
  { id: 'T14', nom: "introduction de plus de 60 mots avant un chiffre, une date ou un terme du sujet", attendu: 'À RELIRE', regles_attendues: ['INTRO:script'],
    textes: Object.assign(poserMentions({ titre: "PTZ 2026 : qui y a droit et ce qui a changé", description: DESC_OK, script: INTRO_LONGUE + " Le PTZ 2026 concerne les primo-accédants." }, regles), { sujet: "Le prêt à taux zéro (PTZ) en 2026" }) },
  { id: 'T15', nom: "introduction courte : deux phrases de lancement puis le sujet", attendu: 'CONFORME',
    textes: Object.assign(poserMentions({ titre: "PTZ 2026 : qui y a droit et ce qui a changé", description: DESC_OK, script: "Vous préparez un premier achat et vous vous demandez si vous y avez droit. Voyons cela clairement. Depuis le 1er avril 2025, le PTZ est ouvert à tout le territoire pour le neuf. " + INTRO_LONGUE }, regles), { sujet: "Le prêt à taux zéro (PTZ) en 2026" }) },
  { id: 'T16', nom: "introduction : terme du sujet sans chiffre dès la première phrase", attendu: 'CONFORME',
    textes: Object.assign(poserMentions({ titre: "Taxe foncière : qui paie l'année de la vente", description: DESC_OK, script: "La taxe foncière est due par celui qui est propriétaire au premier janvier. " + INTRO_LONGUE }, regles), { sujet: "Taxe foncière et vente" }) },
  { id: 'T17', nom: "titre long, sans mot du sujet, introduction longue : à relire, jamais bloqué", attendu: 'À RELIRE', regles_attendues: ['TITRE:titre', 'INTRO:script'],
    textes: Object.assign(poserMentions({ titre: "La bille, la lampe et l'humidimètre : ce que les meilleurs visiteurs emportent toujours dans leur poche", description: DESC_OK, script: INTRO_LONGUE + " " + INTRO_LONGUE }, regles), { sujet: "Les vérifications avant d'acheter" }) },
  // Nom de Damien (décision du 29/10/2026) : prénom seul. Nom fictif dans les cas, jamais le vrai nom dans ce dépôt public.
  { id: 'T19', nom: "description : prénom suivi d'un nom", attendu: 'BLOQUÉ', regles_attendues: ['R2:description'],
    textes: poserMentions({ titre: "Louer vide ou meublé", description: DESC_OK + "\n\nPrésenté par Damien Martin.", script: SCRIPT_OK }, regles) },
  { id: 'T20', nom: "script : prénom suivi d'une initiale", attendu: 'BLOQUÉ', regles_attendues: ['R2:script'],
    textes: poserMentions({ titre: "Louer vide ou meublé", description: DESC_OK, script: "Je suis Damien M. " + SCRIPT_OK }, regles) },
  { id: 'T21', nom: "prénom seul, dans le script et la description", attendu: 'CONFORME',
    textes: poserMentions({ titre: "Louer vide ou meublé", description: DESC_OK + "\n\nPrésenté par Damien.", script: "Je suis Damien. " + SCRIPT_OK }, regles) },
  { id: 'T22', nom: "mot de la liste privée passée par n8n (ici fictive)", attendu: 'BLOQUÉ', regles_attendues: ['R2:script'], options: { motsExclusPrives: ['martin'] },
    textes: poserMentions({ titre: "Louer vide ou meublé", description: DESC_OK, script: SCRIPT_OK + " Monsieur Martin vous le dirait aussi." }, regles) },
];

let echecs = 0;
for (const c of cas) {
  const r = controlerTextes(c.textes, regles, c.options);
  const relevees = new Set(r.points.flatMap(p => [p.regle, p.regle + ':' + p.champ]));
  const manquantes = (c.regles_attendues || []).filter(x => !relevees.has(x));
  const ok = r.resultat === c.attendu && manquantes.length === 0;
  if (!ok) echecs++;
  console.log((ok ? 'RÉUSSI ' : 'ÉCHEC  ') + c.id + ' — ' + c.nom);
  console.log('        attendu : ' + c.attendu + (c.regles_attendues ? ' avec ' + c.regles_attendues.join(', ') : '') + ' | obtenu : ' + r.resultat + (manquantes.length ? ' | manquantes : ' + manquantes.join(', ') : ''));
  for (const p of r.points) console.log('        - ' + p.niveau + ' ' + p.regle + ' [' + p.champ + '] ' + p.motif + (p.occurrences > 1 ? ' (x' + p.occurrences + ')' : '') + ' : ' + p.extrait);
}
// T18 : les règles citées dans regles/consignes_redaction.md le sont mot pour mot (jamais reformulées) ; formule de durée.
{
  const consignes = fs.readFileSync(path.join(__dirname, '..', 'consignes_redaction.md'), 'utf8');
  const citees = [...new Set(consignes.match(/\bR(?:1[0-2]|[1-9])\b/g) || [])];
  const manquantes = citees.filter(r => !/^R(1|2|12)$/.test(r) && !consignes.includes(regles.regles[r]));
  const ancienne = /en moins de dix minutes/.test(consignes.replace(/« en moins de dix minutes »/g, ''));
  const ok = citees.length > 0 && manquantes.length === 0 && consignes.includes('en une dizaine de minutes') && !ancienne;
  if (!ok) echecs++;
  cas.push({ id: 'T18' });
  console.log((ok ? 'RÉUSSI ' : 'ÉCHEC  ') + 'T18 — consignes de rédaction : règles citées mot pour mot, formule « en une dizaine de minutes »');
  console.log('        règles citées : ' + citees.join(', ') + (manquantes.length ? ' | non citées mot pour mot : ' + manquantes.join(', ') : '') + (ancienne ? ' | ancienne formule de durée employée' : ''));
}
console.log('\n' + (cas.length - echecs) + ' / ' + cas.length + ' cas réussis');
process.exit(echecs ? 1 : 0);
