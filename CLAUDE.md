# Consignes du dépôt podcast-stepsup

Ce dépôt public héberge le podcast STEPS'UP (flux `feed.xml`, `episodes.json`, audio `episodes/`, vignettes `images/`, page d'accueil `index.html`), servi par GitHub Pages. Les épisodes sont produits et publiés par la chaîne n8n locale de Damien Fancelli, qui écrit dans ce dépôt par l'API GitHub.

## Règles de communication (12 octobre 2026) : impératives

Les règles R1 à R12 sont dans `regles/regles_podcast.json`, seule source lue par le contrôle codé (`regles/controle.js`) et reprise dans les consignes des modèles de la chaîne. Ne jamais les reformuler ; les citer telles quelles.

- R1 et R2 (mentions IA, audio et description) sont posées par le code, mot pour mot, jamais écrites par un modèle.
- Aucun épisode ne peut être approuvé s'il enfreint ces règles : le contrôle codé s'exécute avant l'e-mail de validation ; un résultat BLOQUÉ supprime le bouton Approve.
- `ANNONCE_FAITE` (dans `regles/regles_podcast.json`) reste à `false` tant que Damien ne l'a pas basculé lui-même le jour de l'annonce de la société.
- Toute approbation ou tout refus est journalisé dans `validations/journal.csv` (R12).
- Cas de test : `node regles/tests/cas_de_test.js` (tous doivent réussir avant toute modification de la chaîne).

## Ce qu'un agent ne fait jamais ici

- Approuver un épisode à la place de Damien, publier ou modifier un épisode en ligne sans son « go ».
- Supprimer un épisode, changer l'adresse du flux, ou modifier la structure du flux RSS.
- Écrire une clé, un jeton, un mot de passe ou une signature de lien dans un fichier de ce dépôt (il est public).
