```
Compte rendu, migration de la chaîne du podcast vers le serveur, 30 et 31 octobre 2026
```

Objet : déplacer la chaîne n8n de STEPS'UP de l'ordinateur de la maison vers le serveur loué pour Steps'up (IONOS VPS Linux M+, Ubuntu 24.04), piloté par le dépôt `stepsup-fr/serveur`. Séance locale, ordinateur de la maison. Ordre de mission du 30/10, avec les compléments d'`adresse.txt` validés par Damien.

L'adresse du serveur ne figure pas ici : elle est dans `.passage-serveur/adresse.txt`, hors du dépôt (`.git/info/exclude`). Aucune clé, aucun jeton, aucun mot de passe, aucune signature de lien n'est recopié dans ce compte rendu.

## Résultat

- Depuis le **31/10 à 14:08**, la chaîne tourne sur le serveur : 29 workflows actifs, identiques un à un à ceux de l'ordinateur avant la bascule. Aucune erreur depuis.
- Sur l'ordinateur, n8n reste en service sur le port **5680**, avec seulement les deux workflows de GLOBAL ICON actifs. Les 30 workflows de Steps'up y sont conservés, désactivés.
- Il n'y a qu'une seule chaîne active à la fois. Le service de validation reçoit la relève du serveur (relevé enregistré à 14:20:18, alors que la relève de l'ordinateur était déjà désactivée).
- Aucun épisode approuvé ni publié, flux et adresse du flux inchangés, rien de supprimé sur l'ordinateur, `ANNONCE_FAITE` toujours à `false`.

## Étape 1 : inventaire

- n8n 2.36.9, image locale `n8n-local:2.36.9-ffmpeg`, base SQLite en mode WAL.
- Volumes `n8n_data` et `podcast_data`.
- 32 workflows, dont 31 actifs. Deux n'appartiennent pas au podcast : « Vérification article de blog — Audit multi-IA » et « Utilitaire - Lire un Google Doc ».
- Le planificateur passe chaque heure à la minute 0 ; la relève toutes les 10 minutes.
- Détail : `.passage-serveur/inventaire.txt` (hors dépôt).

## Étape 2 : serveur

- **Socle** : installé par `bootstrap/installer.sh` du dépôt `stepsup-fr/serveur`, depuis `main`. L'utilisateur `steps` a été créé et sa connexion par clé contrôlée avant la fermeture de root et des mots de passe.
- **Système** :
  - mises à jour de sécurité automatiques ;
  - fuseau Europe/Paris, sur le serveur et dans le conteneur ;
  - pare-feu ouvert sur SSH seulement ;
  - Docker et Compose, avec redémarrage automatique.
- **n8n** : même version qu'avant, image figée par empreinte (n8n et ffmpeg 8.1.1, jamais `latest`), port publié sur la boucle locale seulement.
  - Contrôlé depuis l'ordinateur sans tunnel : port injoignable.
  - Mêmes outils dans le conteneur : ffmpeg et ffprobe 8.1.1, git 2.55.0.
- **Routines** à la minute 45 : sauvegarde 03:45, redémarrage éventuel 04:45, nettoyage le dimanche à 05:45.
- **Empreintes de la clé d'hôte du serveur**, acceptées à la première connexion :
  - ED25519 `SHA256:hmyUOoLunWDIICDkMpOBk4YM14RIoFwbtRC5uZpT8Eo`
  - ECDSA `SHA256:NvBjcHl47qSSQxVVblZrzhdaV4RhIp5qAHVZoogcdw8`
  - RSA `SHA256:bksWxTXpIu8tzHGvIc7dmo9Am6zkWOmbL5om1muiV8I`
- **Clés** :
  - clé de la séance : `~/.ssh/stepsup_serveur`, dédiée à ce serveur ;
  - clé de déploiement, enregistrée en lecture seule sur `stepsup-fr/serveur` : `SHA256:cwl+IkiwMxsyoFvpF4fLxXECGzA5Y34gVVHeMiLP9G8` ;
  - clé de l'agent : enregistrée dans le Worker « interface ».
- **Mise en service** : `serveur.conf` est complété (interface, clés enregistrées). Le premier relevé de l'agent a été accepté, puis la version 8d41ca1 appliquée après « Déployer ».
- **`verifier.sh`** : tout est OK sauf « aucun port exposé hors SSH », à cause du client DHCP de l'hôte (UDP 68). C'est un faux positif, corrigé par la pull request ci-dessous.

## Étape 3 : copie

- **Sauvegarde complète** : `sauvegardes_n8n/2026-10-30_migration/` (volumes, `docker-compose.yml`, `Dockerfile`, sommes de contrôle).
  - n8n de l'ordinateur arrêté 1 min 24 le 31/10, de 12:41:44 à 12:43:08, puis relancé.
- **Sur la copie, avant tout démarrage** :
  - les 32 workflows désactivés ;
  - les deux workflows de GLOBAL ICON supprimés, ainsi que le seul identifiant propre à eux, « Google – Verif Blog ». Base intègre ensuite.
  - « AI Assistant model » et « Mistral Cloud account » ne servent à aucun workflow : laissés en place.
- **Premier démarrage** : essai sans réseau (« 0 published workflows »), puis démarrage par `appliquer.sh`.
- **Autorisations** : rien à refaire. Les 11 identifiants se déchiffrent avec la clé de la copie, et Gmail et YouTube gardent leur jeton de renouvellement.

## Étape 4 : essai

- **Tests dans le conteneur du serveur** :
  - `node regles/tests/cas_de_test.js` : 22 sur 22 ;
  - `node n8n/planificateur/test_planifier.cjs` : 12 sur 12.
- **La relève de l'ordinateur ne pouvait pas prendre la demande d'essai** : elle ne voit que les décisions confirmées par un clic, et ne clôt que les lignes de sa propre table. Vérifié dans le code, puis contre-vérifié par trois relecteurs indépendants.
- **Essai de bout en bout** :
  - une ligne « [ESSAI] Essai de migration du 31/10, ne pas valider : la taxe foncière en 2026 », au statut « essai » ;
  - une exécution manuelle (n° 2668), lancée depuis l'éditeur du serveur avec la session de Damien.
- **Parcours suivi** : demande enregistrée sur le service de validation, ligne d'attente, statut « à valider », e-mail. Ni voix, ni journal, ni voie de secours ; contrôle des règles CONFORME.
- **E-mail reçu à 13:53** : « [Podcast STEPS'UP] À valider (CONFORME) — Taxe foncière 2026 : … ». L'objet porte le titre généré ; le corps porte le sujet « [ESSAI] ».
- **Nettoyage** : exécution annulée, ligne d'essai et ligne d'attente supprimées, sujet épinglé du formulaire remis à l'identique. Personne n'a cliqué.

## Étape 5 : bascule (31/10, 14:02 à 14:09)

- n8n du serveur arrêté. n8n de l'ordinateur arrêté de 14:02:52 à 14:06:18, le temps de copier ses données (`sauvegardes_n8n/2026-10-30_migration/bascule_2026-10-31/`).
- **Sur l'ordinateur** (complément 3, à la place de l'arrêt complet prévu par l'ordre de mission) :
  - seuls les 29 workflows de Steps'up actifs sont désactivés ;
  - n8n, Docker, son démarrage automatique et la garde Docker restent en service pour les deux workflows de GLOBAL ICON ;
  - port de n8n passé à 5680 (choix (a) de Damien). L'ancien `docker-compose.yml` est gardé dans le même dossier.
- **Sur le serveur** : données installées, workflows de GLOBAL ICON et leur identifiant retirés de nouveau, puis démarrage.
  - 29 workflows actifs, mêmes identifiants que sur l'ordinateur avant la bascule.
  - L'exécution 2354 (épisode du 29/10) attend sa décision jusqu'au **12/11 à 00:07 (heure de Paris)**. n8n affiche « 11/11 23:07 » en temps universel.
- **Exécution 2354 sur l'ordinateur** : annulée à la demande de Damien. C'était la seule exécution en attente, et la copie du serveur reste intacte.
- **Tableau de bord du serveur** : ses exécutions réussies ne sont plus enregistrées. Rien ne les lit, et les échecs restent enregistrés.
- **Liens « Produire quand même », « Relancer » et tableau de bord** : ils pointent toujours vers `http://localhost:5678`, donc vers le serveur, **seulement quand le tunnel est ouvert sur l'ordinateur**. Sans tunnel, ils ne mènent nulle part ; ils ne tombent jamais sur le n8n de l'ordinateur. Les boutons de validation par téléphone passent par le service de validation et marchent sans tunnel. Commande du tunnel :

  ```
  ssh -i ~/.ssh/stepsup_serveur -o IdentitiesOnly=yes -N -L 5678:127.0.0.1:5678 steps@ADRESSE_DU_SERVEUR
  ```

- **Copie hors du serveur** (complément 5) :
  - tâche planifiée « StepsUp-Copie-Serveur », chaque jour à 09:30 (rattrapée si l'ordinateur était éteint) et 10 minutes après l'ouverture de session ;
  - elle rapatrie la dernière sauvegarde contrôlée du serveur dans `C:\Users\damie\StepsUp-copies-serveur\` (7 gardées, hors OneDrive, car elles contiennent la clé de chiffrement de n8n) ;
  - script et journal : `C:\Users\damie\StepsUp\`. Première copie faite et contrôlée le 31/10 (686 Mo).

## Défaut trouvé : pull request ouverte

[stepsup-fr/serveur#7](https://github.com/stepsup-fr/serveur/pull/7), non fusionnée : relecture et fusion par la conversation de direction, puis « Déployer » par Damien.

- **Repos** : la condition de repos de n8n comptait les exécutions que n8n 2.36 marque supprimées sans changer leur statut « running » (relève, tableau de bord). La chaîne n'était donc jamais au repos : le redémarrage nocturne, le nettoyage du dimanche et les versions qui touchent `stack/` restent reportés jusqu'au déploiement de la correction (`AND deletedAt IS NULL`).
  - Preuve sur la base du serveur, en lecture seule : 2 lignes comptées, 0 avec la correction.
  - La sauvegarde nocturne n'en dépend pas.
- **Port 68** : `verifier.sh` n'écarte plus que le client DHCP (UDP 68).
- **Essais** : CI entièrement verte.
- **Point d'attention** : le tireur juge le repos avec la requête encore en place. La version peut donc rester reportée. La voie proposée est dans la pull request.

## Points ouverts

- **Demande d'essai** : elle reste sur le service de validation jusqu'au 03/11 vers 13:53, puis expire seule. Ne pas utiliser ses liens.
- **Veille de production** : elle compte l'e-mail d'essai comme une production. Son seuil de 4 jours se décale de quelques heures.
- **Connecteur n8n de Claude** : il pointe sur `localhost:5678`, donc sur le serveur quand le tunnel est ouvert. Le n8n de l'ordinateur est sur 5680.
- **Formulaire et webhook des workflows de GLOBAL ICON** : désormais sur `localhost:5680`.
- **À retirer plus tard, sur décision de Damien** :
  - sur le serveur : les archives de la migration et la copie de la période d'essai, dans `/root/migration-pc/`, ainsi que deux scripts de lecture de l'état du service de validation, dans `/root/outils/` (aucun secret dedans) ;
  - sur l'ordinateur : le premier script de copie, resté dans un dossier privé de l'application Claude (`AppData\Local`), invisible pour le planificateur et inutilisé.

## À vérifier au prochain redémarrage de l'ordinateur

1. Docker Desktop démarre seul. La tâche « StepsUp-Garder-Docker-Allume » le relance au besoin.
2. Le conteneur `n8n` tourne et répond sur `http://localhost:5680`, avec seulement les deux workflows de GLOBAL ICON actifs.
3. Aucun workflow de Steps'up n'est redevenu actif sur l'ordinateur, et l'exécution 2354 y est toujours « annulée ». Sinon, deux chaînes tourneraient en même temps.
4. Rien n'occupe le port 5678 tant que le tunnel n'est pas ouvert. Une fois le tunnel ouvert, le tableau de bord du serveur répond sur `http://localhost:5678/webhook/dashboard`.
5. Dix minutes après l'ouverture de session, `C:\Users\damie\StepsUp\copie-serveur.log` porte une ligne du jour : « copiée » ou « déjà copiée ».
6. Rien ne change pour le serveur : il ne dépend pas de l'ordinateur, sauf pour la copie hors du serveur et le tunnel.
