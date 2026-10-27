```
Compte rendu, chantier C2 Acquisition, 27 octobre 2026
```

Objet : reprise de la chaîne du podcast STEPS'UP, à l'arrêt depuis le 21 octobre 2026 ; publication de l'épisode approuvé le 20 octobre ; surveillance de l'absence de production ; relance de la production.

## Constat (état réel relu avant d'agir)

- **Aucune exécution n8n entre le 21/10 à 1 h 00 et le 27/10 à 9 h 42.** Le 21/10 à 1 h 11, le PC a été éteint depuis le menu Démarrer (extinction rapide de Windows) ; Docker Desktop, qui fait tourner n8n, s'est arrêté avec la session et ne s'est pas relancé aux ouvertures de session suivantes (22/10 à 9 h 07, 25/10 à 16 h 39, 26/10 à 23 h 00).
  - Vérifié : la tâche planifiée de secours a tourné le 26/10 à 23 h 00, sans erreur, mais n'a pas lancé Docker Desktop (lancé avec élévation, il échoue en silence) ; aucun lancement de Docker Desktop n'apparaît dans ses journaux entre le 21/10 et le 27/10.
  - Corrigé dans la mise à jour (2) : la première version de ce compte rendu lisait la marque « 00 » de Docker Desktop dans les applications de démarrage comme « désactivé » ; la capture de Damien montre « Activé ». La cause exacte du non-redémarrage reste inexpliquée.
- Conséquences : l'épisode approuvé le 20/10 n'est pas parti le 21/10 à 7 h ; les sujets du 22/10 et du 25/10 n'ont pas été produits ; aucun e-mail « À valider » ; l'alerte de panne, qui tourne elle aussi dans n8n, ne pouvait rien envoyer.
- Second blocage découvert à la relance : **crédits prépayés Google Gemini épuisés** (étape « Recherche web », exécution 2096 du 27/10 à 9 h 54 : « Your prepayment credits are depleted »).
- Publication et planificateur mis en pause à 9 h 42, dès le redémarrage de n8n et avant leur passage de 10 h, le temps des vérifications.

## Décisions prises et actions

1. **Exécution 1936 (« Investir seul ou à deux : ce que changent le couple, le PACS et l'indivision pour un achat locatif »)** : terminée avec succès le 20/10 à 11 h 58, audio en file de publication, non publiée à cause de l'arrêt. Conformité vérifiée avant publication :
   - empreinte SHA-256 du texte lu identique dans le journal, dans l'exécution et au recalcul (`b7ed2d68…`) ; contrôle des règles CONFORME ;
   - les 12 morceaux envoyés à la voix sont exactement le texte approuvé, annonce R1 comprise ;
   - transcription de l'audio : 95,3 % des mots du texte approuvé retrouvés dans l'ordre, aucun passage de 6 mots ou plus manquant (les écarts sont ceux de la transcription : chiffres, noms) ; l'audio commence par R1 et finit par l'appel à l'abonnement ;
   - titre identique à celui validé ; description validée reprise telle quelle, ligne R2 en tête.

   Publiée le **27/10 à 9 h 49**, avec la date du jour (commits 16e1399, 204b343, 74fe825, 7bd6b80). Vérifié en ligne : fichier servi complet (12 901 869 octets), élément du flux avec la date du jour, même identifiant, contrôle codé CONFORME, plus d'étiquette « suno » ; statut « publié » dans la file éditoriale.
2. **Cause de l'arrêt (point 2)** :
   - n8n relancé (Docker Desktop démarré à 9 h 42) ; tous les workflows de la chaîne actifs.
   - Correction durable côté Windows **non faite** : la création d'une tâche « garde Docker » (relance toutes les 15 minutes) a été refusée par la sécurité de l'outil, parce qu'un réglage permanent de Windows doit venir de Damien. Voir les points ouverts.
3. **Surveillance de l'absence de production (point 3)** : nouveau workflow « Veille de production ».
   - Il vérifie toutes les 3 heures, au démarrage de n8n (après 3 minutes, le temps que le réseau soit prêt) et à la demande.
   - Il lit la boîte d'envoi Gmail. S'il n'est parti aucun e-mail « À valider » ou « BLOQUÉ » depuis plus de 4 jours (hors essais, voie de secours comprise), ou si la boîte est illisible, il écrit à Damien. Le message porte le diagnostic : sujets en retard, épisodes qui attendent une décision, sujets en erreur, prochains sujets.
   - Il envoie au plus un message par 20 heures, compté seulement une fois l'e-mail parti.
   - Revue Fable : 1 point bloquant (silence si Gmail est illisible au démarrage), 3 à corriger, 8 mineurs ; tous les points bloquants et à corriger sont corrigés, ainsi que les mineurs utiles. Essais : 11 cas hors ligne, simulation réelle, envoi réel (alerte du 27/10 à 10 h 00, « Aucune demande de validation depuis 6 jours »), second appel bloqué par l'anti-spam.
4. **Alerte de panne** : elle avait signalé l'échec du 27/10 comme « erreur technique non identifiée ». Elle reconnaît désormais les cas suivants :
   - crédits ou quota Gemini épuisés, d'après le message ou l'étape où l'erreur survient ;
   - paiement réclamé par un service d'IA (402) ;
   - « authorization failed », rangé parmi les clés d'accès.

   Sauvegarde préalable : `sauvegardes_n8n/2026-10-27_reprise/`.
5. **Relance de la production (point 4)** :
   - Le sujet du 22/10 (« Acheter une maison : vérifier fissures, inondations et argile… ») a été lancé à 9 h 54. Il a échoué à la recherche web (crédits Gemini) avant toute étape payante, et il est remis « à venir ».
   - Le planificateur est réactivé : il relance un sujet par heure. Tant que les crédits ne sont pas rechargés, chaque essai échoue, sans rien dépenser, et l'alerte le signale au plus toutes les 6 heures.
   - Dès la recharge, la production repart seule et l'e-mail de validation part par la voie 2 (liens signés).
   - **L'e-mail de validation n'a donc pas pu être envoyé dans cette séance.**

## Livrables (fichier, version)

| Livrable | Version |
|---|---|
| Workflow n8n « Veille de production » | déployé et actif le 27/10/2026, après revue Fable |
| Règles du workflow « Alerte panne podcast » (Gemini, paiement, autorisation) | déployées le 27/10/2026 |
| Sources de la veille et des règles d'alerte, 11 tests hors ligne | dépôt privé de la validation, commit 4c0ff82 |
| Épisode « Investir seul ou à deux… » | publié le 27/10/2026 à 9 h 49 |
| Planificateur : règle de rattrapage (sources et tests dans le dépôt privé de la validation, commit 86feafc) | déployée le 27/10/2026 |
| Veilleur hors du PC (service de validation, commit ccd4c88) | en ligne le 27/10/2026 |
| Tâche Windows « garde Docker » | installée le 27/10/2026 |
| Étude « podcast PC éteint » (fichier local) | 27/10/2026 |
| Veilleur : entretien de la clé Brevo et commande d'essai (commits 07b7802, adbd356) | en ligne le 27/10/2026 |
| Ce compte rendu | v3 |

## Points ouverts (responsable, échéance)

| Point | Responsable | Échéance |
|---|---|---|
| ~~Recharger les crédits prépayés Google Gemini~~ : rechargés par Damien le 27/10 | Damien | fait |
| ~~Réactiver Docker Desktop au démarrage~~ : il était déjà « Activé » (capture de Damien) | Damien | sans objet |
| ~~Garde Docker toutes les 15 minutes~~ : installée le 27/10 avec l'accord de Damien (voir mise à jour (2)) | Claude Code | fait |
| ~~Calendrier après un arrêt~~ : règle décidée par Damien, appliquée et inscrite dans le planificateur (voir mise à jour (2)) | Damien | fait |
| ~~Surveillance même PC éteint~~ : « go » de Damien ; veilleur en ligne, canal Brevo (voir mise à jour (2)) | Claude Code | fait |
| ~~Clé d'envoi Brevo~~ : créée par Damien (accès « Restricted », Transactional email : All), posée le 27/10 ; e-mail d'essai envoyé à 11 h 43 | Damien | fait |
| Vérifier en réel les déclenchements « toutes les 3 heures » et « au démarrage » de la veille (seul le déclenchement manuel a été exercé) | Claude Code | prochaine séance |
| Repli de la recherche web sur un autre modèle quand Gemini est indisponible | Claude Code, sur décision de Damien | à décider |
| YouTube : miniature 16:9 et étiquette « contenu synthétique » de l'épisode du 27/10, posées automatiquement quand YouTube aura importé la vidéo (non vérifié) | Claude Code | prochaine séance |
| ~~Valider « Investir dans l'immobilier : les 8 pièges mentaux qui vous bloquent »~~ : approuvé depuis le téléphone le 27/10 à 11 h 28 ; audio prêt à 11 h 40 ; publication le 28/10 à 7 h | Damien | fait |
| ~~IObit~~ : désinstallé par Damien le 27/10 (vérifié : plus aucun programme, service, tâche ni processus IObit) | Damien | fait |
| Garde Docker corrigée (voir mise à jour (3)) : essai réel à refaire, en quittant Docker Desktop depuis son icône, puis en vérifiant qu'il revient en moins de 15 minutes (une ligne « relance » s'ajoute alors dans `%LOCALAPPDATA%\stepsup-garder-docker.log`) | Damien | au plus tôt |
| Hébergement de la chaîne hors du PC (étude du 27/10 : serveur loué recommandé) : décision | Damien | avant les prochaines vacances |

## Pour que la surveillance fonctionne même ordinateur éteint

La veille tourne dans n8n, sur le PC : quand le PC, Docker ou n8n est arrêté, elle se tait, comme l'alerte de panne du 21 au 27 octobre. Il faut un veilleur hors du PC, qui remarque le silence. La voie la plus simple réutilise le service de validation déjà en ligne sur Cloudflare (allumé en permanence, gratuit à ce volume) :

1. Le service note la date du dernier signe de vie de n8n : la relève l'interroge toutes les 10 minutes. Il note aussi la date de la dernière demande de validation, créée à chaque e-mail « À valider ».
2. Un déclenchement programmé du service, chaque matin, vérifie ces deux dates. Si n8n ne s'est pas manifesté depuis plus de 12 heures, ou s'il n'y a eu aucune demande depuis plus de 4 jours, il écrit à Damien.
3. Pour écrire, il faut l'une de ces trois options :
   - un domaine géré par Cloudflare avec l'envoi d'e-mails activé : stepsup.fr après l'immatriculation, ou global-icon.fr s'il y est ;
   - une clé d'un service d'envoi transactionnel, posée en secret du service ;
   - à défaut, une tâche GitHub programmée qui ouvre un ticket, et GitHub prévient par e-mail.

Coût : nul ou presque. Il faut le « go » de Damien et le choix du canal d'envoi. La parade de fond reste un hébergement de n8n allumé en permanence, plutôt que le PC.

## Mise à jour en séance (2) : réponses de Damien, rattrapage, garde Docker, veilleur hors du PC, étude

- **Production relancée.** Crédits Gemini rechargés par Damien. Le sujet du 28/10 (« Investir dans l'immobilier : les 8 pièges mentaux qui vous bloquent ») a été produit avec un jour d'avance, par le chemin normal du planificateur (exécution 2113, contrôle CONFORME, empreinte `5d312a1c…`). L'e-mail de validation est parti par la voie 2 le 27/10 à 10 h 41. Publication à sa date, le 28/10 à 7 h, s'il est approuvé.
- **Décision de Damien (règle de rattrapage).** « S'il y a un arrêt comme celui que l'on vient de vivre, il faut faire un rattrapage d'un sujet par jour, en évitant de repousser les sujets qui sont déjà planifiés et qui se lancent correctement. Les sujets en retard, on les intercale sur les jours d'après qui n'ont pas de publication de prévue. »
  - Appliquée : sujet du 22/10 replacé au **29/10**, sujet du 25/10 au **30/10** ; rien d'autre n'a bougé.
  - Inscrite dans le planificateur : les sujets en retard sont replacés dans leur ordre sur les premiers jours libres, un par jour, et les épisodes déjà produits gardent les premiers créneaux. Les étapes sont chaînées en série (« Replanifier les retards », « Reporter la date », « Filtrer dus »).
  - Contrôles : revue Fable (aucun point bloquant ; 2 points à corriger, corrigés) ; 12 tests hors ligne ; essai réel sans effet sur la file, comme attendu.
  - Défaut ancien corrigé au passage : la lecture du registre des épisodes partait une fois par ligne de la file, soit 71 requêtes anonymes à GitHub par heure pour une limite de 60. Elle part désormais une fois, avec la clé GitHub.
- **Cause de l'arrêt, précisée** (journal de Windows, vérifié) :
  - Docker Desktop était bien « Activé » dans les applications de démarrage ; la lecture de la première version de ce compte rendu était fausse.
  - Le service « Docker Desktop Service » est passé à « désactivé » le 15/10 à 2 h 29, le 21/10 à 1 h 12, le 22/10 à 9 h 09 et le 25/10 à 20 h 43. Ce dernier passage a eu lieu deux minutes après une mise à jour lancée par IObit Software Updater, qui avait aussi agi le 15/10 et le 22/10.
  - La tâche de réparation réactive le service à chaque ouverture de session, mais elle ne lance pas l'application Docker Desktop : lancée avec élévation, celle-ci ne démarre pas.
  - Supposé : les mises à jour automatiques (IObit, Docker Desktop lui-même, mis à jour le 27/10 en 4.97) basculent le service.
- **Garde Docker installée** (accord de Damien) : tâche Windows à son nom, sans droits administrateur. Elle vérifie à l'ouverture de session puis toutes les 15 minutes que Docker Desktop tourne, et le relance sinon. Essai : la tâche tourne, résultat 0, Docker était lancé. Le relancement réel n'a pas pu être essayé (refusé à Claude Code par la sécurité de l'outil) ; voir les points ouverts.
- **Veilleur hors du PC en ligne** (« go » de Damien ; dépôt privé de la validation, commit ccd4c88) :
  - Le service de validation sur Cloudflare note chaque relève de n8n (toutes les 10 minutes) et chaque demande de validation.
  - Deux fois par jour (7 h et 19 h en hiver), si n8n est muet depuis plus de 12 heures, ou s'il n'y a eu aucune demande depuis plus de 4 jours, il écrit à Damien par Brevo, depuis l'expéditeur STEPS'UP déjà vérifié.
  - Rappels : 3 jours après la première alerte, puis tous les 7 jours, soit 3 e-mails pour trois semaines d'absence. Tout est remis à zéro au retour à la normale.
  - Contrôles : revue Fable (aucun point bloquant ; 2 points à corriger et 4 mineurs, corrigés) ; 74 tests. Constaté en production : relève de n8n notée à 11 h 00.
  - **Il n'enverra rien tant que la clé Brevo n'est pas posée** (voir les points ouverts).
- **Étude « podcast PC éteint 1 à 3 semaines »** : 5 explorations et une synthèse par Fable, dans le fichier local `Etude_podcast_PC_eteint_2026-10-27.md` (dossier du projet, hors de ce dépôt public). Recommandation :
  - copier la chaîne telle quelle sur un petit serveur loué en France (≈ 5 € TTC par mois, prix à confirmer à la commande), accessible par un réseau privé, sans réécrire aucun workflow ;
  - à défaut, pour un départ proche : laisser le portable allumé, avec réglages et limites ;
  - à écarter : n8n Cloud (réécriture du montage, environ dix fois le prix), le « mode vacances » seul (il ne couvre pas les pannes), le Raspberry Pi.
  - Chantier lié et pressé : sortir les nouveaux mp3 de GitHub Pages, à 640 Mo sur 1 Go, avec saturation prévue vers janvier-février 2027.

## Mise à jour en séance (3) : clé Brevo, IObit, validation, garde Docker

- Clé Brevo créée par Damien avec les droits minimaux : accès « Restricted », seule permission « Transactional email : All », sans expiration. Brevo désactive une clé restée 90 jours sans appel réussi : le veilleur la lit une fois par semaine pour la garder active.
- Ajouts au veilleur, après une revue Fable (aucun point bloquant ; 3 points à corriger, corrigés) : commande d'essai protégée par jeton, et date de la dernière vérification de la clé. 81 tests (commits 07b7802 et adbd356).
- Mise en ligne avec la clé, puis e-mail d'essai envoyé à 11 h 43 (Brevo : accepté). État vérifié : alerte possible, clé vérifiée, dernier signe de vie de n8n à 11 h 38.
- IObit désinstallé par Damien (vérifié).
- Épisode du 28/10 approuvé par Damien depuis son téléphone à 11 h 28. La décision a été relevée au redémarrage de n8n, l'audio produit à 11 h 40, et l'épisode est « prêt à publier » pour le 28/10 à 7 h.
- Garde Docker : Damien a fermé Docker vers 11 h 25 pour l'essayer. Au passage de 11 h 35, la tâche a tourné « sans erreur », mais n'a pas relancé Docker ; Docker a été relancé à la main à 11 h 38.
  - Cause, vérifiée par des essais et le journal de PowerShell : lancés par une tâche planifiée, PowerShell, wscript, le lanceur invisible et même un fichier `.cmd` placé dans AppData ne s'exécutent pas ; seule une commande cmd écrite directement dans la tâche passe. Supposé : protection de l'antivirus (Bitdefender) contre les scripts lancés en arrière-plan.
  - Correction : la garde est maintenant une commande cmd écrite dans la tâche elle-même. Elle note son dernier passage dans `stepsup-garder-docker.dernier.txt`, relance Docker Desktop par l'Explorateur s'il est absent, et note chaque relance dans `stepsup-garder-docker.log`. Essai au passage manuel de 11 h 58 : exécutée, dernier passage noté, aucune relance puisque Docker tournait.
  - Le cas « Docker fermé » reste à essayer par Damien (Claude Code n'a pas le droit de fermer Docker). Effet visible possible : une fenêtre noire d'une fraction de seconde à chaque passage.

## À reporter dans le référentiel (section, texte exact)

- Section 9, points ouverts : « Podcast : le PC est le seul serveur de la chaîne ; une extinction sans relance de Docker l'a arrêtée six jours (21 au 27 octobre 2026). Veille d'absence de production (dans n8n) et veilleur hors du PC (service de validation, alerte par Brevo) en place depuis le 27 octobre 2026 ; hébergement hors du PC à décider (étude du 27 octobre 2026). »
- Section 3, journal des décisions, nouvelle ligne (à numéroter par Damien) : « 27 octobre 2026, C2. Podcast : après un arrêt, rattrapage d'un sujet par jour ; les sujets en retard sont intercalés sur les jours suivants sans publication prévue, sans repousser les sujets déjà planifiés. »
