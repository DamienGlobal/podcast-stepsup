```
Compte rendu, chantier C2 Acquisition, 27 octobre 2026
```

Objet : reprise de la chaîne du podcast STEPS'UP, à l'arrêt depuis le 21 octobre 2026 ; publication de l'épisode approuvé le 20 octobre ; surveillance de l'absence de production ; relance de la production.

## Constat (état réel relu avant d'agir)

- **Aucune exécution n8n entre le 21/10 à 1 h 00 et le 27/10 à 9 h 42.** Le 21/10 à 1 h 11, le PC a été éteint depuis le menu Démarrer (extinction rapide de Windows) ; Docker Desktop, qui fait tourner n8n, s'est arrêté avec la session et ne s'est pas relancé aux ouvertures de session suivantes (22/10 à 9 h 07, 25/10 à 16 h 39, 26/10 à 23 h 00).
  - Vérifié : dans les applications de démarrage de Windows, Docker Desktop porte la marque « 00 » au lieu de « 02 » (activé) ; la tâche planifiée de secours a tourné le 26/10 à 23 h 00, sans erreur, mais n'a pas lancé Docker Desktop (lancé avec élévation, il échoue en silence).
  - Supposé : ce marquage a changé après le 15/10, dernier redémarrage automatique réussi (non daté).
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
| Ce compte rendu | v1 |

## Points ouverts (responsable, échéance)

| Point | Responsable | Échéance |
|---|---|---|
| Recharger les crédits prépayés Google Gemini (AI Studio, facturation du projet) : sans eux, aucune production | Damien | au plus tôt |
| Réactiver Docker Desktop au démarrage : Gestionnaire des tâches › Applications de démarrage › Docker Desktop › Activer | Damien | avant la prochaine extinction du PC |
| Garde Docker (relance toutes les 15 minutes si Docker Desktop est fermé) : tâche planifiée à installer par Damien, ou à autoriser pour Claude Code | Damien | à sa convenance |
| Calendrier : à la reprise, le planificateur produit d'abord le sujet du 22/10, puis celui du 25/10, et la publication reste espacée d'un jour ; ou bien décaler tout le calendrier de la durée de l'arrêt | Damien | à la reprise |
| Surveillance même PC éteint (voir ci-dessous) : choisir l'option et le canal d'envoi | Damien, puis Claude Code | à décider |
| Vérifier en réel les déclenchements « toutes les 3 heures » et « au démarrage » de la veille (seul le déclenchement manuel a été exercé) | Claude Code | prochaine séance |
| Repli de la recherche web sur un autre modèle quand Gemini est indisponible | Claude Code, sur décision de Damien | à décider |
| YouTube : miniature 16:9 et étiquette « contenu synthétique » de l'épisode du 27/10, posées automatiquement quand YouTube aura importé la vidéo (non vérifié) | Claude Code | prochaine séance |

## Pour que la surveillance fonctionne même ordinateur éteint

La veille tourne dans n8n, sur le PC : quand le PC, Docker ou n8n est arrêté, elle se tait, comme l'alerte de panne du 21 au 27 octobre. Il faut un veilleur hors du PC, qui remarque le silence. La voie la plus simple réutilise le service de validation déjà en ligne sur Cloudflare (allumé en permanence, gratuit à ce volume) :

1. Le service note la date du dernier signe de vie de n8n : la relève l'interroge toutes les 10 minutes. Il note aussi la date de la dernière demande de validation, créée à chaque e-mail « À valider ».
2. Un déclenchement programmé du service, chaque matin, vérifie ces deux dates. Si n8n ne s'est pas manifesté depuis plus de 12 heures, ou s'il n'y a eu aucune demande depuis plus de 4 jours, il écrit à Damien.
3. Pour écrire, il faut l'une de ces trois options :
   - un domaine géré par Cloudflare avec l'envoi d'e-mails activé : stepsup.fr après l'immatriculation, ou global-icon.fr s'il y est ;
   - une clé d'un service d'envoi transactionnel, posée en secret du service ;
   - à défaut, une tâche GitHub programmée qui ouvre un ticket, et GitHub prévient par e-mail.

Coût : nul ou presque. Il faut le « go » de Damien et le choix du canal d'envoi. La parade de fond reste un hébergement de n8n allumé en permanence, plutôt que le PC.

## À reporter dans le référentiel (section, texte exact)

- Section 9, points ouverts : « Podcast : le PC est le seul serveur de la chaîne ; une extinction sans relance de Docker l'a arrêtée six jours (21 au 27 octobre 2026). Veille d'absence de production en place depuis le 27 octobre 2026 ; veille hors du PC à décider. »
