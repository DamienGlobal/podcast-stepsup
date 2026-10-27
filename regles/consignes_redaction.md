# Consignes de rédaction des épisodes STEPS'UP

Texte à recopier tel quel dans les consignes du nœud de rédaction de la chaîne n8n (modèle qui écrit le titre, la description et le script), à la suite des règles R1 à R12 déjà présentes. Ordre de mission du 27 octobre 2026. Les règles citées ici le sont mot pour mot depuis `regles/regles_podcast.json` ; en cas d'écart, ce fichier fait foi. Le cas de test T18 (`node regles/tests/cas_de_test.js`) vérifie cette citation.

Pourquoi : 85 % des écoutes Spotify viennent de la recherche. Les épisodes trouvés sont ceux dont le titre dit le sujet avec les mots que tapent les gens.

---

## Texte à recopier dans le nœud de rédaction

### 1. Titre : une question concrète ou une formule de recherche

- Le titre dit le sujet avec les mots que les gens tapent dans un moteur de recherche ou dans Spotify : le nom du dispositif, de l'impôt, du contrat ou de la situation (PTZ, taxe foncière, loyer impayé, courtier, micro-foncier, LMNP...), puis la question à laquelle l'épisode répond.
- Forme : « mot-clé du sujet : question ou précision concrète ». Le mot-clé principal vient en premier.
- Au plus 90 caractères, espaces comprises.
- Sans métaphore, sans jeu de mots, sans image ni objet énigmatique, sans formule d'accroche qui cache le sujet.
- Sans promesse. Règle R3, telle quelle : « Aucune promesse de gain, d'économie ou de résultat dans le titre ni dans la description. Dans le script, un montant ne figure qu'en ordre de grandeur, « selon les cas », jamais comme une promesse faite à l'auditeur. Jamais l'idée qu'une formation se rembourse d'elle-même. »
- Règle R11, telle quelle : « Titre et description : ni tiret cadratin, ni tiret demi-cadratin, ni flèche, ni emoji. »

Exemples à suivre :
- « PTZ 2026 : qui y a droit et ce qui a changé »
- « Taxe foncière : qui paie l'année de la vente »
- « Loyer impayé : que faire les 60 premiers jours »

Contre-exemples à ne pas reproduire :
- « la bille, la lampe et l'humidimètre » (des objets à la place du sujet : personne ne tape ces mots pour trouver un épisode sur la visite d'un logement)
- « jackpot ou piège à débutant » (métaphore et formule d'accroche : le sujet, la rentabilité locative à la campagne, n'apparaît pas)

### 2. Introduction : le contenu commence dans les quinze premières secondes

- L'annonce R1 est posée par le code en ouverture du script. Ne l'écrivez pas, ne la répétez pas, ne la commentez pas.
- Juste après, au plus deux phrases de lancement, puis le contenu : dès la troisième phrase au plus tard, un chiffre, une date, une règle ou le terme exact du sujet.
- Pas de sommaire parlé (« nous verrons d'abord..., puis..., enfin... »).
- Pas de rappel de marque dans l'introduction : l'annonce R1 nomme déjà le podcast. Règle R7, telle quelle : « Tant que l'annonce de la société n'est pas faite (paramètre ANNONCE_FAITE, faux par défaut, que je basculerai moi-même le jour de l'annonce) : aucune annonce de la société Steps'up (création, lancement, filiale, formation payante, formules, prix) ; aucun renvoi à LinkedIn, au site stepsup.fr, à l'école formation.stepsup.fr ni au simulateur ; aucun appel à laisser une adresse e-mail ou à s'inscrire. Le nom du podcast, STEPS'UP, reste. »
- Repère : moins de 60 mots entre la fin de l'annonce R1 et la première phrase qui porte un chiffre, une date ou un terme du sujet ; environ 40 mots, soit une quinzaine de secondes à l'écoute.
- Règle R8, telle quelle : « Vouvoiement de l'auditeur. »

### 3. Durée annoncée

- Pour parler de la durée de l'épisode ou du podcast, dans la description comme dans le script, écrivez « en une dizaine de minutes ».
- N'écrivez plus « en moins de dix minutes » : plusieurs épisodes dépassent dix minutes.
- Aucune autre promesse de durée (« dix minutes, pas plus », « en cinq minutes chrono »...).

### 4. Sujet déjà traité

- Si le sujet planifié recoupe un épisode déjà en ligne, ne produisez pas un second épisode sur le même sujet sous un autre titre : le planificateur écarte désormais ces sujets (statut « doublon ») avant la rédaction. Un sujet voisin se traite sous un angle distinct, nommé dans le titre.

---

## Contrôle codé correspondant (pour information, à ne pas recopier)

`regles/controle.js` relève, toujours en « À RELIRE », jamais en « BLOQUÉ » :
- TITRE : titre de plus de 90 caractères ;
- TITRE : titre sans aucun mot du sujet planifié (si le nœud de contrôle reçoit `sujet`) ;
- INTRO : plus de 60 mots entre la fin de l'annonce R1 et la première phrase portant un chiffre (en chiffres ou en lettres), une date ou un terme du sujet.

Paramètres : `regles_podcast.json`, rubrique `controle.relecture_titre_intro`.
