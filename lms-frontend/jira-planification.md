# Open Campus — Planification Jira

> Des objectifs clairs, des tâches concrètes et une progression vérifiable.

## Accéder au tableau

[Ouvrir le tableau Jira Open Campus Front — OCF](https://mehdikarbitou-1769453505855.atlassian.net/jira/software/projects/OCF/boards/266)

Le projet **OCF** centralise le backlog du frontend Open Campus. Jira reste la source du suivi courant ; ce document explique son organisation et l’ordre de travail conseillé. L’accès au tableau nécessite les permissions du projet.

## Pourquoi cette organisation ?

Le projet est découpé en **epics**, **stories** et **sous-tâches** : les epics regroupent les grands domaines, les stories décrivent un résultat utilisateur et les sous-tâches rendent le travail réalisable et vérifiable. Ce découpage permet de repérer les dépendances, de limiter les oublis et de relier chaque livraison à ses critères d’acceptation.

## Les grands axes du backlog

| Epic | Domaine | Stories |
| --- | --- | --- |
| [OCF-1](https://mehdikarbitou-1769453505855.atlassian.net/browse/OCF-1) | Socle React, composants et navigation conditionnelle | OCF-9 à OCF-10 |
| [OCF-2](https://mehdikarbitou-1769453505855.atlassian.net/browse/OCF-2) | Authentification et session en mémoire | OCF-11 à OCF-12 |
| [OCF-3](https://mehdikarbitou-1769453505855.atlassian.net/browse/OCF-3) | Liste, filtres et fiche utilisateur Admin | OCF-13 à OCF-14 |
| [OCF-4](https://mehdikarbitou-1769453505855.atlassian.net/browse/OCF-4) | Création et modification des comptes | OCF-15 à OCF-16 |
| [OCF-5](https://mehdikarbitou-1769453505855.atlassian.net/browse/OCF-5) | Catalogue Admin et filtres | OCF-17 à OCF-18 |
| [OCF-6](https://mehdikarbitou-1769453505855.atlassian.net/browse/OCF-6) | Formulaires et cycle de vie des cours | OCF-19 à OCF-21 |
| [OCF-7](https://mehdikarbitou-1769453505855.atlassian.net/browse/OCF-7) | Profil Apprenant, Mes cours et états UI | OCF-22 à OCF-24 |
| [OCF-8](https://mehdikarbitou-1769453505855.atlassian.net/browse/OCF-8) | Sécurité, responsive et livraison | OCF-25 à OCF-26 |

## Ordre de travail conseillé

1. **Poser le socle** : configuration Vite, couche fetch partagée et composants de structure.
2. **Établir la session** : connexion, profil certifié par le serveur, navigation selon le rôle et déconnexion.
3. **Construire les espaces métier** : gestion des utilisateurs et des cours côté Admin, profil et Mes cours côté Apprenant. Valider les contrats API avant de brancher les opérations Admin.
4. **Vérifier à chaque étape** : validation des formulaires, chargement, listes vides, erreurs réseau, refus d’accès, clavier et mobile.
5. **Préparer la livraison** : documentation, démonstration et revue des critères d’acceptation.

La sécurité et le responsive se travaillent tout au long du développement. Cet ordre est une recommandation de dépendances, pas une modification du sprint ni un engagement sur des dates.

## Documentation et conception

Les livrables documentaires sont suivis sous [OCF-26 — Livraison et soutenance](https://mehdikarbitou-1769453505855.atlassian.net/browse/OCF-26) :

| Ticket | Livrable |
| --- | --- |
| [OCF-81](https://mehdikarbitou-1769453505855.atlassian.net/browse/OCF-81) | Organisation et suivi du projet dans Jira |
| [OCF-82](https://mehdikarbitou-1769453505855.atlassian.net/browse/OCF-82) | Maquettes, composants et parcours Figma |
| [OCF-78](https://mehdikarbitou-1769453505855.atlassian.net/browse/OCF-78) | README et configuration d’environnement sans secrets |

Voir aussi [les maquettes et la direction visuelle](./figma.md) et [le README](./README.md).

## Règles de suivi

- Lire le ticket et ses dépendances avant de commencer ; conserver une branche liée au travail concerné.
- Vérifier le résultat attendu et joindre une preuve utile : modification de code, commande reproductible ou capture selon le besoin.
- Déclarer un blocage API explicitement ; ne pas remplacer une intégration manquante par un faux succès.
- Ne déclarer une tâche terminée qu’après vérification de ses critères d’acceptation.
- Distinguer les écrans explorés dans Figma du périmètre effectivement planifié dans le brief. Les extensions de conception ne sont pas automatiquement des fonctionnalités livrées.

Structure et intitulés des epics/stories consultés dans Jira le **11 novembre 2026**. Les statuts et échéances évoluent : consulter le tableau pour leur état actuel. Ce document ne modifie aucun ticket.
