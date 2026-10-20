```
Compte rendu, chantier C2 Acquisition, 20 octobre 2026
```

Objet : application au podcast STEPS'UP des règles de communication du 12 octobre 2026 (R1 à R12) ; contrôle codé ; épisode du 16 octobre ; épisodes publiés ; validation hors de l'ordinateur.

## Décisions prises

1. Les règles R1 à R12 sont inscrites mot pour mot dans `regles/regles_podcast.json`, seule source lue par le contrôle codé et par les consignes des modèles de la chaîne. `ANNONCE_FAITE` vaut `false` ; Damien le basculera lui-même le jour de l'annonce.
2. R1 (annonce audio) et R2 (ligne de description) sont posées par le code de la chaîne, mot pour mot, jamais écrites par un modèle ; si un modèle les écrit quand même, elles sont retirées puis posées une seule fois.
3. Un contrôle codé déterministe (`regles/controle.js`) s'exécute après l'auto-correction et avant l'e-mail de validation, sur le titre, la description et le texte lu par la voix. Résultat BLOQUÉ : seconde auto-correction ciblée, puis nouveau contrôle ; s'il reste BLOQUÉ, l'e-mail part sans bouton Approve (un seul bouton « Refuser cet épisode », plus un lien pour relancer).
4. La description est désormais rédigée avant l'e-mail de validation : Damien valide le titre, la description et le texte exacts qui seront publiés. Les titres de chapitres et le texte des vignettes, écrits après la validation, passent aussi le contrôle et sont écartés s'ils ne sont pas conformes.
5. R12 : chaque approbation, refus ou absence de réponse est journalisé dans `validations/journal.csv` (date et heure, exécution, épisode, décision, résultat du contrôle, empreinte SHA-256 du texte lu par la voix).
6. Exécution 1909 (« Investir seul ou à deux… », produite avec l'ancienne chaîne) : refusée sur décision de Damien en séance, puis relancée avec la chaîne corrigée.
7. Épisode du 16 octobre (exécution 1878) : il avait été approuvé le 18 octobre et il est en ligne (épisode n° 41) ; il n'est pas supprimé. Il est refait sur le même sujet avec la chaîne corrigée, sous le titre « Impôts sur les loyers : micro-foncier ou régime réel, comment choisir ».
8. Sauvegardes datées des workflows et sources de la chaîne conservées sur l'ordinateur de Damien, hors de ce dépôt public (elles contiennent des identifiants internes). Retour arrière : un script de restauration en une commande ; côté dépôt, `git revert` des commits de la séance.

## Livrables produits (fichier, version)

| Livrable | Version |
|---|---|
| `regles/regles_podcast.json` : textes exacts R1 à R12, listes du contrôle | règles du 12/10/2026, commits a765dbf et df9b939 |
| `regles/controle.js` : contrôle codé (BLOQUÉ / À RELIRE / CONFORME) et pose de R1/R2 | commit a765dbf |
| `regles/tests/cas_de_test.js` + jeux de test de l'épisode du 16 octobre (tel quel, corrigé) | commit a765dbf, 10 cas sur 10 réussis |
| `validations/journal.csv` : journal des validations (R12) | en service depuis le 20/10/2026 |
| `CLAUDE.md` : consignes du dépôt pour les prochaines séances | commit a765dbf |
| Chaîne n8n : pipeline de production (règles chargées depuis ce dépôt, consignes R3 à R11 dans 10 prompts, contrôle, correction ciblée, e-mail, journal) ; workflow « Journal des validations (R12) » ; tableau de bord (statut « Bloqué (règles) ») | déployés le 20/10/2026, après revue adversariale (aucun point bloquant, 4 correctifs appliqués) |
| Préparation de l'étape 3 (descriptions avec R2, titres proposés, essai audio R1) | sur l'ordinateur de Damien, rien de publié |
| Ce compte rendu | v1 |

### Résultat des tests (commande : `node regles/tests/cas_de_test.js`)

```
RÉUSSI T1 — épisode du 16 octobre tel quel : BLOQUÉ (R1, R2, R3 titre « gagner » et « milliers d'euros », R3 description, R9 « incontournable » ; à relire R4 « automatique », R5 « conseil »)
RÉUSSI T2 — le même corrigé (titre sans promesse, R1 et R2 posées, mot remplacé, avertissement R5) : CONFORME
RÉUSSI T3 — « notre formation » et « inscrivez-vous sur stepsup.fr », ANNONCE_FAITE faux : BLOQUÉ (R7)
RÉUSSI T4a — « conseil syndical » : CONFORME
RÉUSSI T4b — « nos conseils » : À RELIRE (R5)
RÉUSSI T5 — description sans la ligne R2 : BLOQUÉ (R2)
RÉUSSI T6 — passage au tutoiement : À RELIRE (R8)
RÉUSSI T7 — « ce contenu a été vérifié par des experts » : À RELIRE (R4)
RÉUSSI T8 — R1 et R2 avec apostrophes typographiques et espaces insécables : CONFORME (neutralisées)
RÉUSSI T9 — R1 altérée (un mot retiré) : BLOQUÉ (R1)
10 / 10 cas réussis
```

Tests de la chaîne : parcours rejoué hors n8n sur les données réelles de l'exécution 1878 (BLOQUÉ, correction ciblée, CONFORME ; correction illisible, reste BLOQUÉ, e-mail sans Approve) ; empreinte SHA-256 identique à celle calculée indépendamment ; deux productions réelles avec la nouvelle chaîne (exécutions 1919 et 1924) : contrôle CONFORME, e-mail de validation envoyé, annonce R1 en tête du texte voix, ligne R2 en tête de la description.

### État de l'épisode du 16 octobre

- Version d'origine (exécution 1878) : approuvée le 18/10, en ligne depuis le 18/10 à 17 h 46 (n° 41), titre et description contraires à R3, sans R1 ni R2. Non supprimée ; titre et description à corriger en priorité à l'étape 3.
- Version refaite (exécution 1919) : contrôle CONFORME dès le premier passage, e-mail de validation envoyé le 20/10 à 10 h 53, en attente de la décision de Damien (délai : 23/10 à 10 h 53). Date de diffusion proposée : mercredi 21 octobre 2026 à 7 h.

### Épisodes publiés modifiés

Aucun à ce jour : arrêt obligatoire avant toute modification publique. Préparé et contrôlé (41 sur 41 CONFORME après propositions) : ligne R2 en tête des 41 descriptions ; 8 titres contraires à R3 reformulés (n° 15, 21, 25, 26, 30, 33, 40, 41) ; 11 descriptions retouchées au-delà de R2 ; annonce R1 générée avec la voix habituelle et essai de montage sur le n° 41 (+7,38 s, sans clic). En attente du « go publiés » de Damien.

### Voie de validation hors de l'ordinateur

Voie 2 retenue (« go voie 2 » de Damien) et en production depuis le 20/10/2026 : l'e-mail de validation porte deux liens signés à usage unique (Worker Cloudflare `podcast-validation`, dépôt privé stepsup-fr/podcast-validation), utilisables depuis le téléphone, PC éteint ; n8n relève la décision au rallumage. Détail dans la mise à jour (3) ci-dessous.

## Points ouverts (responsable, échéance)

| Point | Responsable | Échéance |
|---|---|---|
| Valider ou refuser l'épisode refait (exécution 1919) et « Investir seul ou à deux » (exécution 1924) | Damien | avant le 23/10/2026 vers 11 h (délai de 72 h) |
| « go publiés » et décisions audio : périmètre (41 épisodes ou seulement ceux d'après le 12/10), niveau de R1, poids du dépôt (environ 1,4 Go si les 41 fichiers sont remplacés), YouTube (réimport ou étiquette « contenu synthétique ») | Damien | à sa convenance ; titres et descriptions en priorité pour le n° 41 |
| Écouter l'annonce R1 générée (prononciation de « Steps'up ») | Damien | avant le « go publiés » |
| Arbitrer les titres « limites » gardés (n° 12, 19, 28, 31, 37) et le n° 40 (« gagner » au sens de salaire) | Damien | avec le « go publiés » |
| Valider deux extensions du contrôle faites en séance : institutions permises au titre de R5 (Haut Conseil de stabilité financière, conseiller bancaire…) ; formules R3 « à relire » | Damien | prochaine revue |
| Description de l'émission (niveau du flux) : « vérifié sur les sources officielles », « Animé par Damien Fancelli » (R4), « que vous conseilliez des clients » (R5), emoji (R11) | Claude Code, après « go publiés » | avec l'étape 3 |
| Commentaire « made with suno » dans les métadonnées des mp3 (R4) | Claude Code, sur décision de Damien | avec l'étape 3 audio |
| Essai réel de la voie 2 depuis le téléphone : e-mail d'essai du 20/10 (épisode fictif « ESSAI : validation depuis le téléphone », rien n'est produit), approuver ou refuser, puis le dire | Damien | avant le 23/10/2026 à 16 h (échéance des liens) |
| Ancienne exécution en attente depuis le 22/08 (épisode déjà en ligne) : à annuler | Claude Code, sur accord de Damien | prochaine séance |
| Hébergement de l'audio : le site publié atteindrait son plafond de 1 Go vers janvier 2027 | Damien et Claude Code | avant décembre 2026 |
| Hors périmètre, après l'immatriculation : flux sous une adresse stepsup.fr et transfert du dépôt dans l'organisation stepsup-fr (domaine personnalisé sur GitHub Pages, ancien flux qui annonce la nouvelle adresse, déclaration de la nouvelle adresse aux plateformes, mise à jour des workflows qui écrivent dans le dépôt) | Damien | après l'immatriculation |

## À reporter dans le référentiel (section, texte exact)

- Section 5, ligne « Acquisition | Podcast | Agent » : « Ligne éditoriale ; annonce IA en ouverture et en description (D49), posées par le code ; contrôle codé des règles R1 à R12 avant chaque validation ; relecture humaine journalisée dans le dépôt du podcast. »
- Section 9, point ouvert O32, colonne de l'objet : ajouter « Podcast : chaîne conforme depuis le 20 octobre 2026 (règles R1 à R12 dans le dépôt du podcast, contrôle codé, journal des validations) ; mise en conformité des 41 épisodes publiés préparée, en attente du go de Damien. »
- Section 3, journal des décisions, nouvelle ligne (à numéroter par Damien) : « 20 octobre 2026, C2. Podcast : aucun épisode n'est approuvable si le contrôle codé des règles le bloque ; R1 et R2 sont posées par le code ; chaque décision de validation est journalisée dans le dépôt du podcast. »

## Mise à jour en séance (20 octobre 2026, après la première version de ce compte rendu)

- Décision de Damien : nouveaux textes de R1 et R2 (commit 0e6145e ; anciens textes du 12/10 conservés dans `historique` du fichier de règles) :
  - R1 : « Steps'up, le podcast. Ma voix est générée par IA à partir de ma vraie voix. Mes textes sont écrits par moi, avec l'appui de l'IA, notamment pour récupérer les informations les plus récentes. »
  - R2 : « Voix générée par IA à partir de celle de Damien Fancelli, avec son accord ; textes écrits par lui, avec l'appui de l'IA, notamment pour récupérer les informations les plus récentes. »
- Cas de test après changement : 10 sur 10 réussis ; les nouveaux textes seuls ressortent CONFORME.
- Les deux épisodes en attente (exécutions 1919 et 1924, ancien texte figé au lancement) ont été arrêtés, leur refus journalisé, et relancés avec le nouveau texte ; nouveaux e-mails de validation à suivre.
- Annonce R1 régénérée dans la voix habituelle (12,2 s) et nouvel essai sur le n° 41 (+12,8 s au lieu de +7,4 s) : décalages de chapitres et tailles des fichiers à recalculer au moment de l'étape 3.
- À reporter dans le référentiel (principe 10 et D49, textes exacts des mentions du podcast) : remplacer les deux textes du podcast par ceux ci-dessus, avec la mention « modifiés par Damien le 20 octobre 2026 ».

## Mise à jour en séance (2) : validations, « go publiés », « go voie 2 »

- Damien a validé les deux épisodes refaits (journal : « approuvé », contrôle CONFORME, empreintes) et l'annonce R1 à l'écoute. La refonte « Impôts sur les loyers : micro-foncier ou régime réel, comment choisir » est en ligne depuis le 20/10 à 12 h (n° 42) ; « Investir seul ou à deux… » sort le 21/10 à 7 h.
- Décision de Damien sur les épisodes publiés : non-rétroactivité. Seuls les épisodes publiés après les règles du 12/10 sont mis en conformité ; les 39 épisodes antérieurs restent tels quels (audio, titres et descriptions).
- Épisodes publiés modifiés (même adresse de fichier, même guid, même date ; vérifiés en ligne, contrôle codé CONFORME) :
  - n° 41 (18/10) : titre « Impôts sur les loyers : micro-foncier ou régime réel, lequel choisir pour votre location vide ? » ; ligne R2 ; annonce R1 en tête de l'audio (+12,8 s, première phrase prononcée vérifiée par transcription) ; chapitres décalés ; taille et durée à jour.
  - n° 40 (13/10) : titre « Quel salaire faut-il pour investir dans l'immobilier ? Le calcul que fait vraiment votre banquier » ; mêmes modifications.
  - Limite connue : Spotify et les applications qui ont déjà mis en cache l'ancien audio peuvent le garder ; titres et descriptions suivent le flux. Sur YouTube, l'audio des vidéos existantes ne peut pas être remplacé : titres et descriptions s'y mettent à jour depuis le flux.
- YouTube (règle de la plateforme pour une voix réelle générée par IA) : étiquette « contenu synthétique » posée par l'API sur les 42 vidéos (42 sur 42 confirmées par l'API) ; les nouvelles vidéos la reçoivent automatiquement avec leur miniature. Affichage public de la mention : non encore constaté, à revérifier.
- « go voie 2 » : construction en cours (service de liens signés à usage unique sur Cloudflare, revue de sécurité), rien de déployé ; Damien devra créer lui-même une clé d'accès Cloudflare aux droits restreints.

## Mise à jour en séance (3) : voie 2 construite et en production

- Worker Cloudflare `podcast-validation` mis en ligne par GitHub Actions (clé Cloudflare dédiée créée par Damien, droits Workers Scripts et Workers KV en modification, sur le seul compte STEPS'UP ; les Workers et clés de la veille n'ont pas été touchés). Essai sur fausses demandes : 16 sur 16 (ouvrir un lien ne décide rien ; usage unique ; pas de lien « approuver » pour un épisode BLOQUÉ ; lien maquillé rejeté ; API refusée sans jeton).
- Faille trouvée dans n8n 2.36.9 et fermée : l'adresse de reprise d'une exécution en attente porte une signature que n8n ne vérifie pas (reprise sans signature acceptée). La reprise exige désormais une clé dédiée et ne peut venir que de n8n lui-même (3 tentatives non autorisées refusées, la bonne acceptée). La même faiblesse touche l'ancienne validation par e-mail, conservée seulement en secours.
- Chaîne de production modifiée (sauvegarde préalable `sauvegardes_n8n/2026-10-20_avant-voie2/`, 84 → 97 nœuds) : demande au Worker, e-mail à liens signés (boutons en bas, comme avant), attente, relève toutes les 10 minutes et au démarrage de n8n, journal R12 avec la date de la décision et le canal « lien signé (téléphone ou PC) » ; liens valables 72 h, puis « sans réponse » comme avant ; une décision prise à temps reste appliquée même si le PC est resté éteint jusqu'à 14 jours ; si le Worker est injoignable, retour automatique à l'ancien e-mail, signalé « [Secours : boutons sur le PC] ».
- Workflow d'alerte corrigé (défaut antérieur, révélé par la revue) : une panne qui se répète est rappelée toutes les 6 h au lieu d'une seule fois ; une panne de la relève dit « ne pas relancer le sujet » (sinon doublon).
- Contrôles : deux revues Fable (première revue : 4 points à corriger, tous corrigés ; contre-vérification à 3 angles : 1 point confirmé, corrigé) ; 48 tests hors ligne ; bancs réels sur faux épisodes : BLOQUÉ refusé par lien 13 sur 13, Worker en panne 3 sur 3, liens échus 5 sur 5 ; chaîne en ligne identique à la version testée. Sources et essais : dépôt stepsup-fr/podcast-validation, dossier `n8n/` (commit 3503aec).
- YouTube : la mention « Comment ce contenu a été créé : des sons ou des images ont été modifiés ou entièrement générés » est visible publiquement (constaté sur la vidéo du n° 42).
- Limites connues : les liens signés figurent dans les exécutions enregistrées de n8n (accès local seulement) ; au-delà de 14 jours PC éteint, l'épisode est classé « sans réponse » et une alerte le signale.
- Hors périmètre (après l'immatriculation) : aucun changement pour la voie 2 ; l'adresse du Worker pourra passer sous stepsup.fr (route Cloudflare) sans toucher à n8n autrement que par l'adresse du service.

## Prochaine étape

Damien fait l'essai depuis son téléphone sur l'e-mail d'essai (épisode fictif) ; le prochain vrai épisode (sujet du 22/10) arrivera par la voie 2. Claude Code supprime ensuite le banc d'essai, et annule l'ancienne exécution 900 avec l'accord de Damien.
