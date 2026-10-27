```
Compte rendu, chantier C2 Acquisition, 27 octobre 2026
```

Objet : déploiement dans la chaîne n8n des lots 1 à 4 livrés par la session cloud du 27 octobre (titres en question concrète, introduction courte, non-redondance des sujets, formule de durée), puis vérification des lots 5 (YouTube) et 6 (veille de production). Séance locale, ordinateur de la maison.

## Constat (état réel relu avant d'agir)

- Les lots 1 à 4 sont livrés par la session cloud : [DamienGlobal/podcast-stepsup#1](https://github.com/DamienGlobal/podcast-stepsup/pull/1) (branche `claude/blissful-shannon-sfqe3m`, commit c8d0bf9) et [stepsup-fr/podcast-validation#1](https://github.com/stepsup-fr/podcast-validation/pull/1) (commit a72183a). Les deux pull requests sont ouvertes, non fusionnées. Leurs fichiers n'ont pas été modifiés.
- Une première version locale des lots 1 à 4, commencée avant la mise à jour de Damien, est mise de côté dans les deux dépôts (`git stash`, « session locale 27/10 (non utilisée…) »). Elle n'a été ni poussée ni déployée.
- Aucune exécution n8n en attente au moment du déploiement. Le planificateur n'avait aucun sujet dû le 27/10. L'épisode du 28/10 (« Investir dans l'immobilier : les 8 pièges mentaux qui vous bloquent ») est déjà produit, avec l'ancien pied de description, et reste tel quel.
- Les règles (`regles/regles_podcast.json`) sont lues à chaque production sur la branche principale du dépôt public. Les paramètres de relecture du titre et de l'introduction (`controle.relecture_titre_intro`) n'y seront donc qu'après la fusion de la PR publique.

## Fait

1. **Sauvegardes avant modification** : `sauvegardes_n8n/2026-10-27_titres-intro-redondance/`.
   - Contenu : pipeline, planificateur, veille, alerte, Publieur, miniatures YouTube, tableau de bord, « Calendrier — statut (relance) » et « Calendrier — tout relancer ».
   - Le script de déploiement du planificateur a fait en plus sa propre sauvegarde, dans `sauvegardes_n8n/2026-10-27_doublons/`.
2. **Tests avant déploiement**, sur les deux branches :
   - `node regles/tests/cas_de_test.js` : 22 sur 22 ;
   - `node n8n/planificateur/test_planifier.cjs` : 23 sur 23 (lancé dans le conteneur n8n, qui fournit la bibliothèque de dates).
3. **Planificateur** (16 h 35), par `python -I mk_doublons.py verifier` puis `deployer`, comme le prévoit la note de déploiement.
   - « Replanifier les retards » et « Filtrer dus » contiennent désormais `doublons.js` suivi de `planifier.js`.
   - « Reporter la date » écrit aussi le statut.
4. **Tableau de bord** (16 h 38) : le statut « doublon » s'affichait « À venir ». Correction faite, trois lignes dans le nœud « Construire HTML » :
   - étiquette grise « Doublon » ;
   - sur une ligne en doublon, le lien « Relancer » devient « Produire quand même ». Il remet la ligne « à venir » avec la note « doublon accepté (relance manuelle) », la dérogation prévue par la session cloud. Sans ce changement, « Relancer » ne servait à rien : la ligne repassait en doublon l'heure suivante.
   - Le bandeau de santé et « Tout relancer » ignoraient déjà ce statut : rien n'y a été changé.
5. **Pipeline** (16 h 40), en un seul envoi : soit tout passait, soit rien ne changeait.
   - « Contrôle des règles » et « Contrôle après correction » : ajouts de `regles/controle.js` recopiés (relecture TITRE et INTRO) ; le sujet planifié est passé au contrôle (`sujet`).
   - « Prépa script (Claude) », qui écrit le titre publié et le script : section « Texte à recopier dans le nœud de rédaction » de `regles/consignes_redaction.md` recopiée telle quelle, à la suite des règles R3 à R11 déjà présentes.
   - Pied de description : « en moins de dix minutes » remplacé par « en une dizaine de minutes » dans les 7 nœuds qui portent ce pied, le code l'ajoutant après le texte du modèle. Cela vaut pour les prochains épisodes seulement.
   - **Adaptation au déploiement**, à valider par Damien : le titre publié reste le sujet planifié, sauf si le modèle ajoute une section « # Titre publié ». Il ne le faisait que pour enfreindre R3, R9 ou R11. La condition devient : « …ou s'il ne suit pas les consignes de titre ci-dessous ». Sans cela, la règle de titre n'aurait aucun effet sur le titre publié. Retour arrière : une phrase à retirer.
6. **Essai de non-redondance** sur une ligne de test du jour, « Micro-foncier ou régime réel : comment choisir » (id 73) :
   - le planificateur, lancé à la main, l'a passée en « doublon » (exécution 2189), avec en note « même sujet que « Impôts sur les loyers : micro-foncier ou régime réel, comment choisir » (épisode en ligne du 20/10, mots communs : micro, foncier, regime, reel) » ;
   - aucun lancement de production ;
   - le tableau de bord l'a affichée « Doublon » ;
   - la ligne de test a ensuite été supprimée.
7. **Lecture de l'état du veilleur hors du PC** : workflow temporaire « 🔧 Lecture état du veilleur (temporaire, 27/10) », qui lit `/api/sante` avec l'accès déjà en place, sans afficher le jeton. Il est désactivé ; Damien peut le supprimer.

Non touchés : la description de l'émission, `index.html`, le flux RSS, les épisodes en ligne.

## Vérifié

- **Planificateur** : code en service identique au dépôt (`doublons.js` + `planifier.js`, MODE 'reporter' et 'lancer') ; version publiée active. Exécution à la main sans ligne de test (2188) : aucun report, aucun doublon, aucun lancement.
- **Pipeline** : version publiée active (97 nœuds). Dans les deux nœuds de contrôle, le texte de `regles/controle.js` est recopié à l'identique, de `neutraliser` à `poserMentions`, et le sujet est bien passé. Les consignes recopiées dans « Prépa script (Claude) » sont identiques à la section du fichier. Les 7 pieds portent la nouvelle formule ; l'ancienne ne figure plus que dans la consigne qui l'interdit. Tous les nœuds Code se lisent sans erreur de syntaxe.
- **Contrôle sur un vrai épisode** (textes du 27/10) : il fonctionne avec les règles en ligne comme avec celles de la PR. Résultat « À RELIRE » : titre de 98 caractères.
- **Lot 5, YouTube**, vidéo du 27/10 (`Z0Vm-Ypaz7o`), vérifiée sur la page publique :
  - miniature personnalisée 16:9 (1280 × 720) avec les mots du titre « SEUL OU À DEUX / INVESTIR À DEUX » ;
  - mention « Comment ce contenu a été créé : Créé avec l'IA. Des sons ou des images ont été modifiés ou entièrement générés » ;
  - description dont la première ligne est exactement la ligne R2, chapitres présents.
  Le tout a été posé automatiquement à 10 h 00 (workflow « Miniatures YouTube », exécution 2106). **Rien à faire par Damien.**
- **Lot 6, veille de production** : depuis sa mise en service le 27/10, quatre déclenchements réels, tous réussis :
  - deux au démarrage de n8n (n8n relancé à 11 h 38 et à 12 h 05 ; analyse 3 minutes plus tard) ;
  - deux programmés, à 12 h 15 et à 15 h 15.
  Aucun e-mail : dernier « À valider » le 27/10 à 10 h 42, pas de retard, donc **aucun faux positif**. Prochains passages : 18 h 15, 21 h 15, puis toutes les 3 heures.
- **Veilleur hors du PC** : dernier signe de vie de n8n noté à 16 h 10, puis à 16 h 40.
  - Le veilleur n'écrit qu'une fois par 30 minutes et ne garde que la dernière date : l'historique des relèves toutes les 10 minutes depuis 11 h n'est donc pas consultable. n8n ne conserve pas non plus les exécutions réussies de la relève.
  - Clé Brevo vérifiée à 11 h 43.
  - Aucune demande de validation n'est encore enregistrée par le veilleur : la dernière (10 h 42) précède sa mise en service. La surveillance « 4 jours sans demande » s'armera à la prochaine.
- **Crédit Gemini** : recherche web (79 s) et vérification des faits (49 s) réussies le 27/10 à 10 h 35 (exécution 2113), après la recharge.
  - Le sujet du 29/10 n'est pas encore produit : la confirmation viendra de sa production, au premier passage du planificateur le 29/10.

## Non fait, et pourquoi

- **Essai d'un sujet par le chemin normal** (dernier point de la note de déploiement) : il produirait un épisode et enverrait un vrai e-mail de validation, ce qu'exclut l'ordre de mission. Premier contrôle réel : l'e-mail « À valider » du sujet du 29/10.
- ~~**Signalement des doublons par e-mail**~~ (lot 3 : « l'alerte le signale à Damien dans l'e-mail du jour ») : absent de la PR privée n° 1. Déployé à 17 h 40 après le « go » de Damien (voir la mise à jour (2)).

## Livrables (fichier, version)

| Livrable | Version |
|---|---|
| Planificateur n8n : détection des doublons (PR privée n° 1, commit a72183a) | déployé le 27/10/2026 à 16 h 35 |
| Pipeline n8n : relecture TITRE et INTRO, consignes de rédaction, « en une dizaine de minutes » (PR publique n° 1, commit c8d0bf9) | déployé le 27/10/2026 à 16 h 40 |
| Tableau de bord n8n : statut « Doublon » et « Produire quand même » | déployé le 27/10/2026 à 16 h 38 |
| Veille de production n8n : signalement des doublons par e-mail, mémoire fiable au démarrage ([stepsup-fr/podcast-validation#2](https://github.com/stepsup-fr/podcast-validation/pull/2), commit 317632a) | déployée le 27/10/2026 à 17 h 40 |
| Sauvegardes avant modification | `sauvegardes_n8n/2026-10-27_titres-intro-redondance/` et `2026-10-27_doublons/` |
| Ce compte rendu | v2 |

## Points ouverts (responsable, échéance)

| Point | Responsable | Échéance |
|---|---|---|
| ~~Fusionner [DamienGlobal/podcast-stepsup#1](https://github.com/DamienGlobal/podcast-stepsup/pull/1)~~ : fusionnée par Damien le 27/10 ; vérifié, les règles servies par GitHub contiennent les paramètres de relecture (mots vides, nombres en lettres, mois), pris en compte dès la prochaine production | Damien | fait |
| ~~Fusionner [stepsup-fr/podcast-validation#1](https://github.com/stepsup-fr/podcast-validation/pull/1)~~ : fusionnée par Damien le 27/10 | Damien | fait |
| Fusionner [stepsup-fr/podcast-validation#2](https://github.com/stepsup-fr/podcast-validation/pull/2) (veille, code déjà en service) | Damien | à sa convenance |
| ~~Signalement des doublons par e-mail~~ : « go » de Damien, déployé à 17 h 40 (mise à jour (2)) | Damien, Claude Code | fait |
| Vérifier le premier e-mail « Sujet écarté (doublon) » réel, et la veille au prochain démarrage de n8n (exécution par le webhook, mémoire chargée) | Claude Code | au premier cas |
| Confirmer la condition « # Titre publié » étendue aux consignes de titre (Fait, point 5) | Damien | au premier e-mail « À valider » |
| Relire le premier e-mail « À valider » avec la nouvelle relecture : points TITRE ou INTRO, titre proposé par la chaîne, production sans erreur Gemini | Damien et Claude Code | 29/10 |
| Le prompt du script demande encore une « accroche forte » avant les consignes d'introduction (au plus deux phrases de lancement) : à surveiller sur les premiers scripts | Claude Code | après deux épisodes |
| Supprimer le workflow temporaire « 🔧 Lecture état du veilleur (temporaire, 27/10) », désactivé | Damien | à sa convenance |
| Promesses de durée de `index.html` et de la description de l'émission (relevées par la session cloud) : non modifiées | Damien | « go » requis |

## Mise à jour (2) : signalement des doublons par e-mail (« go » de Damien)

- **Fait** : la veille de production signale par e-mail chaque sujet que le planificateur a marqué « doublon », une seule fois.
  - Seul, il fait l'objet d'un e-mail dédié, « [Veille podcast] Sujet écarté (doublon) : … ». S'il y a aussi un retard, il s'ajoute à l'alerte de retard. L'e-mail part au passage suivant de la veille, au plus 3 heures après.
  - L'e-mail donne le sujet, l'épisode qu'il reprend et le lien « Produire quand même » du tableau de bord.
  - Un sujet relancé puis écarté de nouveau est signalé à nouveau.
  - L'alerte de retard est inchangée.
- **Code** : branche `veille-doublons-2026-10-27` du dépôt privé (commit 317632a, [stepsup-fr/podcast-validation#2](https://github.com/stepsup-fr/podcast-validation/pull/2), fusion par Damien). Déployé à 17 h 40 par `mk_veille.py`, qui conserve désormais aussi les réglages ajoutés dans n8n. Seuls les fichiers de la veille ont été repris de la mise de côté locale ; ceux de la session cloud n'ont pas été touchés.
- **Relecture Fable** : 3 constats, confirmés par une contre-vérification et corrigés avant le déploiement.
  - Bloquant : après un redémarrage de n8n, l'analyse reprenait après une attente de 3 minutes, sans la mémoire de la veille. Cela explique l'anti-spam « oublié » aux démarrages de 11 h 41 et 12 h 08. Avec les doublons, chaque redémarrage aurait renvoyé le même e-mail et effacé l'anti-spam. Désormais, après l'attente, la veille s'appelle elle-même par son webhook, et la mémoire est chargée.
  - La mémoire des doublons signalés n'était jamais élaguée.
  - La consigne de l'e-mail pour produire quand même était à préciser.
- **Vérifié** :
  - 22 cas sur 22 ;
  - code des nœuds identique au dépôt, version publiée active, mémoire (anti-spam) et réglages conservés ;
  - essai réel en simulation (exécution 2203) avec une ligne de test « doublon » : repérée, rien envoyé, mémoire chargée ;
  - ligne de test supprimée avant le passage de 18 h 15 : plus aucune ligne « doublon » dans la file.

## À reporter dans le référentiel (section, texte exact)

- Section 3, journal des décisions, nouvelle ligne (à numéroter par Damien) : « 27 octobre 2026, C2. Podcast : relecture codée du titre et de l'introduction, consignes de rédaction (titre en question concrète, introduction courte, « en une dizaine de minutes ») et détection des sujets en double mises en service dans la chaîne ; un doublon est marqué « doublon », visible au tableau de bord et signalé une fois par e-mail par la veille de production ; « Produire quand même » le force. »
- Section 9, points ouverts : « Podcast : fusion des pull requests du 27 octobre 2026 (dépôt public n° 1, dépôt privé n° 1 et n° 2). »
