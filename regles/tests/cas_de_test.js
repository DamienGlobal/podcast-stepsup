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
console.log('\n' + (cas.length - echecs) + ' / ' + cas.length + ' cas réussis');
process.exit(echecs ? 1 : 0);
