```
Compte rendu, chantier C2 Acquisition, 27 octobre 2026
```

Objet : titres en question concrète, introduction courte, non-redondance des sujets, formule de durée (ordre de mission du 27 octobre 2026, décisions prises sur délégation, réversibles). Séance cloud : dépôts `DamienGlobal/podcast-stepsup` et `stepsup-fr/podcast-validation` seulement. La chaîne n8n n'a pas été touchée : le déploiement revient à la séance locale (voir la note de déploiement).

## Constat (état réel relu avant d'agir)

- `episodes.json` compte **43 épisodes** au 27/10 : le n° 43 (« Investir seul ou à deux... ») a été publié ce matin. Numérotation du plus ancien au plus récent : n° 41 = 18/10 et n° 42 = 20/10, tous deux sur « micro-foncier ou régime réel ». Ils restent en ligne, sans changement.
- Formule de durée : **42 descriptions sur 43** disent « STEPS'UP, le podcast qui décode l'immobilier en moins de dix minutes » (l'ordre de mission en comptait 41 ; le n° 43 s'y ajoute, seul le n° 39 ne l'a pas). Elle apparaît 84 fois dans `feed.xml` (description et résumé de chaque épisode). **13 épisodes sur 43** durent plus de dix minutes ; le plus long fait 11 min 14 s (n° 35).
- Titres longs : **10 titres sur 43** dépassent 90 caractères (n° 9, 14, 17, 27, 33, 36, 39, 40, 41, 43), dont 5 des 8 derniers. Avec le nouveau contrôle, ils seraient tous signalés « À RELIRE ».
- Cas de test du contrôle codé avant modification : 10 sur 10 réussis. Planificateur : 12 sur 12.

## Décisions prises et actions

1. **Titre (lot 1).** `regles/controle.js` ajoute un point « TITRE », toujours « À RELIRE », jamais « BLOQUÉ », dans deux cas : un titre de plus de 90 caractères, ou un titre qui ne contient aucun mot du sujet planifié. Le second cas ne s'applique que si le nœud de contrôle transmet `textes.sujet`, qui reste facultatif. Comparaison par mots-clés : sans accents, sans pluriels, mots vides exclus, et même racine de cinq lettres acceptée.
2. **Introduction (lot 2).** Point « INTRO », toujours « À RELIRE », si plus de 60 mots séparent la fin de l'annonce R1 de la première phrase qui porte un chiffre (en chiffres ou en lettres), une date (mois, année) ou un terme du sujet. Ce point n'est calculé que si R1 est présente (sinon R1 bloque déjà).
3. Paramètres de ces deux points : `regles_podcast.json`, rubrique `controle.relecture_titre_intro` (90 caractères, 60 mots, mots vides, nombres en lettres, mois). Ajout en fin de rubrique : les textes R1 à R12, `textes_imposes` et `ANNONCE_FAITE` (toujours `false`) sont inchangés ; c'est vérifié par comparaison au commit précédent.
4. **Consignes de rédaction (lots 1, 2, 4).** Création de `regles/consignes_redaction.md`, à recopier dans le nœud de rédaction. Il couvre le titre en question concrète (exemples et contre-exemples de l'ordre de mission), l'introduction (au plus deux phrases de lancement, ni sommaire parlé ni rappel de marque) et la formule « en une dizaine de minutes ». R3, R7, R8 et R11 y sont citées mot pour mot ; le cas T18 le vérifie.
5. **Non-redondance (lot 3), dépôt privé.** Ajout de la fonction pure `detecterDoublon`, branchée sur la règle de rattrapage (commit 86feafc).
   - Seuil : au moins 60 % des mots-clés du texte le plus court se retrouvent dans l'autre, avec au moins 3 mots-clés communs (2 si le texte le plus court n'en a que 2, jamais un seul).
   - Fenêtre : un épisode en ligne compte s'il est sorti dans les 90 derniers jours ; un épisode produit en attente compte toujours.
   - Un sujet dû ou en retard qui en reprend un autre passe en statut « doublon », avec le titre existant dans la note. Il ne prend aucun jour, les autres gardent leur date et le suivant part.
   - Pour le produire quand même : remettre le statut « à venir » et écrire « doublon accepté » dans la note.
6. **Durée (lot 4).** Aucun épisode en ligne n'a été modifié, ni `index.html`, ni le flux.

## Livrables (fichier, version)

| Livrable | Version |
|---|---|
| `regles/controle.js` (points TITRE et INTRO), `regles/regles_podcast.json` (paramètres), `regles/consignes_redaction.md`, `regles/tests/cas_de_test.js` (T10 à T18) | dépôt public, branche `claude/blissful-shannon-sfqe3m`, pull request à fusionner par Damien |
| `n8n/planificateur/doublons.js`, `planifier.js`, `mk_doublons.py`, `test_planifier.cjs`, `titres_episodes_2026-10-27.json` | dépôt privé, commit a72183a, [stepsup-fr/podcast-validation#1](https://github.com/stepsup-fr/podcast-validation/pull/1) |

## Vérifié

- `node regles/tests/cas_de_test.js` : **22 sur 22** réussis (les 10 cas d'origine sans changement, plus 12 nouveaux).
  - T10 à T17 : titre long, contre-exemples « la bille, la lampe et l'humidimètre » et « jackpot ou piège à débutant », les trois exemples conformes, absence de sujet, introduction longue ou courte, cumul toujours « À RELIRE » et jamais « BLOQUÉ ».
  - T18 : règles citées mot pour mot dans les consignes.
- Planificateur : **23 sur 23** (12 existants, 11 nouveaux).
  - N° 41 et n° 42 sont détectés comme doublons l'un de l'autre ; « louer vide ou meublé » et « micro-foncier ou régime réel » ne le sont pas.
  - Sur les 903 paires des 43 titres en ligne, seule la paire 41/42 dépasse le seuil ; toutes les autres restent à 50 % au plus.
  - Également couverts : la fenêtre de 90 jours, la normalisation, un doublon du jour remplacé par le retard suivant, un doublon d'un épisode en attente, deux sujets dus identiques, « doublon accepté », la stabilité au passage suivant et la sentinelle.
- Dépôt privé, autres suites : `node --test` 81 sur 81, `tests_codes.cjs` 48 sur 48, `test_veille.cjs` 11 sur 11.
- `mk_doublons.py hors-ligne` : transformation correcte sur une copie simulée du workflow. **Non essayé sur le vrai n8n**, qui n'est pas joignable depuis cette séance.

## Autres promesses de durée relevées (non modifiées)

| Endroit | Texte |
|---|---|
| `index.html`, ligne 7 (méta description) | « Le podcast qui décode l'immobilier en moins de dix minutes... » |
| `index.html`, ligne 14 (og:description) | « Le podcast qui décode l'immobilier en moins de dix minutes. » |
| `index.html`, ligne 110 | « L'immobilier décodé en moins de dix minutes par épisode. » |
| `index.html`, ligne 118 | « Dix minutes, pas plus : le temps d'un trajet. » |
| 42 descriptions en ligne (`episodes.json`, `feed.xml`) | « ...en moins de dix minutes » |
| Scripts audio | non vérifiables d'ici (aucune transcription dans les dépôts) ; aucun texte de durée dans les sources n8n du dépôt privé |

Relevé au passage, hors périmètre et non modifié : la description du flux (`feed.xml`, `<description>` et `<itunes:summary>` de la chaîne) contient « vérifié sur les sources officielles » (liste R4 du contrôle), un emoji « 🎙️ » et « vous conseilliez des clients ». À soumettre à Damien.

## Points ouverts (responsable, échéance)

| Point | Responsable | Échéance |
|---|---|---|
| Fusionner les deux pull requests | Damien | à sa convenance |
| Déployer dans n8n (note ci-dessous) | séance locale | après la fusion |
| D'où vient la formule « en moins de dix minutes » : écrite par le modèle ou ajoutée par un nœud Code (fin de description) ? Dans le second cas, la remplacer dans ce nœud : la consigne seule ne suffira pas | séance locale | au déploiement |
| Statut « doublon » : vérifier que le tableau de bord et les autres nœuds qui lisent la file l'acceptent (comme « refusé ») | séance locale | au déploiement |
| « Louer vide ou meublé » serait marqué comme doublon du n° 20 (19/08, moins de 90 jours) : c'est voulu par la règle, à confirmer si un tel sujet est planifié | Damien | si le cas se présente |
| Seuil de 90 caractères : 10 titres en ligne sur 43 le dépassent ; à revoir si les points « À RELIRE » deviennent du bruit | Damien | après deux semaines |
| Promesses de durée de `index.html` et de la description du flux : reformulation éventuelle | Damien | « go » requis |

## Note de déploiement pour la séance locale

Ordre à suivre : fusion, puis tests, contrôle, rédaction, planificateur, vérification.

1. **Récupérer les deux dépôts fusionnés** et lancer `node regles/tests/cas_de_test.js` (22 sur 22) et `node n8n/planificateur/test_planifier.cjs` (23 sur 23). Ne pas aller plus loin si un cas échoue.
2. **Nœud de contrôle des règles** (nœud Code qui appelle `controlerTextes`, en amont de « Textes contrôlés » ; nom exact à confirmer sur place).
   - Recopier le nouveau `regles/controle.js` en entier.
   - Si le nœud « Préparer règles » contient une copie de `regles_podcast.json`, la remplacer par la version fusionnée. S'il lit le fichier sur GitHub, rien à faire.
   - Ajouter le sujet à l'appel : `sujet: $('Paramètres').first().json.sujet` dans l'objet `textes`.
   - Le code reste compatible sans ce paramètre : sans `sujet`, seuls la longueur du titre et l'introduction sont contrôlés.
3. **Nœud de rédaction** (modèle qui écrit titre, description et script) : recopier la section « Texte à recopier dans le nœud de rédaction » de `regles/consignes_redaction.md` à la suite des règles déjà présentes. Si la fin de description « ...en moins de dix minutes » est ajoutée par un nœud Code, y remplacer « en moins de dix minutes » par « en une dizaine de minutes » (épisodes futurs seulement).
4. **Planificateur.**
   - Depuis `n8n/planificateur/` : `python -I mk_doublons.py verifier`, puis `python -I mk_doublons.py deployer`. Le script sauvegarde d'abord le workflow dans `sauvegardes_n8n/2026-10-27_doublons/`.
   - Il met à jour « Replanifier les retards » et « Filtrer dus », et ajoute `statut` à « Reporter la date ». Le nombre de nœuds ne change pas.
5. **Vérifier.**
   - Sortie du déploiement : `actif = True`, doublons présents dans les deux nœuds, `statut` écrit.
   - Exécuter le planificateur une fois à la main : sans sujet en double, aucun changement de date ni de statut ne doit apparaître.
   - Faire un essai sur une ligne de test « à venir » datée du jour, au sujet « Micro-foncier ou régime réel : comment choisir » : elle doit passer en « doublon », avec le titre du n° 41 ou du n° 42 dans la note. Supprimer ensuite la ligne de test.
   - Lancer un sujet d'essai par le chemin normal : l'e-mail de validation affiche les éventuels points TITRE ou INTRO en « À RELIRE », et le bouton Approve reste présent si rien n'est BLOQUÉ.
6. **Retour arrière** si besoin : réimporter la sauvegarde de l'étape 4 ; pour le contrôle, recopier la version précédente de `controle.js`.

## À reporter dans le référentiel (section, texte exact)

- Section 3, journal des décisions, nouvelle ligne (à numéroter par Damien) : « 27 octobre 2026, C2. Podcast : titres en question concrète ou formule de recherche avec les mots que tapent les gens, au plus 90 caractères ; contenu dans les quinze premières secondes après l'annonce IA ; la chaîne ne produit plus un sujet traité dans les 90 derniers jours ou déjà produit en attente (statut « doublon ») ; durée annoncée « en une dizaine de minutes » pour les prochains épisodes. Décisions prises sur délégation, réversibles. »
- Section 5, ligne « Acquisition | Podcast | Agent », ajout : « Relecture codée du titre et de l'introduction (jamais bloquante) ; détection des sujets en double par le planificateur. »
