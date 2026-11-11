# Open Campus — Maquettes & direction visuelle

> Un campus clair, une prochaine étape évidente.

## Voir les maquettes

[Ouvrir les maquettes Open Campus dans Figma](https://www.figma.com/design/JbOZK7KkH39wjATrHkUUqi/Open-Campus?node-id=0-1)

Figma sert de référence visuelle pour les écrans, les composants et les parcours. Ce lien ouvre le fichier de conception ; il ne constitue pas une application fonctionnelle et peut nécessiter une autorisation Figma.

## Pourquoi ce design ?

Open Campus réunit deux besoins : permettre aux étudiants de trouver leurs cours et donner aux administrateurs des outils de gestion faciles à parcourir. Une interface cohérente aide chacun à repérer rapidement son espace et son action suivante.

- **Teal pour guider** : une couleur principale commune au logo, à la navigation active et aux actions importantes.
- **Lilac pour respirer** : un fond doux et des surfaces blanches qui séparent les zones sans surcharger les écrans.
- **Des cartes pour structurer** : cours, accès de gestion et informations regroupés en blocs lisibles.
- **Des composants partagés pour rester cohérent** : boutons, champs, badges et dialogues suivent les mêmes règles sur chaque page.
- **Une interface qui suit son utilisateur** : formulaires et grilles adaptés au mobile, libellés visibles, navigation clavier et retours explicites après une action.

## Palette de référence

| Usage | Couleur |
| --- | --- |
| Teal principal | `#15AAA4` |
| Teal foncé pour les actions nécessitant plus de contraste | `#137C78` |
| Fond lilac | `#F5F4FA` |
| Surface | `#FFFFFF` |
| Texte principal | `#242733` |
| Texte secondaire | `#737884` |
| Bordures | `#EAEAF0` |
| Accents pastel | `#FFE1E9`, `#D7EAFF`, `#DFF3E8`, `#FFF0B7` |

Ces valeurs proviennent de la référence HTML Open Campus existante ; elles ne sont pas présentées comme des couleurs extraites de Figma. Le contraste des combinaisons doit être vérifié lors de l’intégration.

## Composants à réutiliser

- **Identité** : marque Open Campus avec symbole de graduation, déclinée dans l’authentification et la navigation.
- **Actions** : boutons primaire, secondaire, discret et destructif, avec états de focus, désactivation et chargement.
- **Contenu** : cartes de cours et de gestion, listes, filtres et badges de statut.
- **Formulaires** : champs avec labels, aide et erreurs associées ; saisie préservée après une erreur récupérable.
- **Structure** : sidebar, en-tête, vues Admin et étudiant, dialogues de confirmation et états vide/erreur/réessayer.

Direction typographique : Inter avec repli Arial/sans-serif, titres semibold, texte lisible et espaces généreux. Cartes arrondies autour de 16 px et champs autour de 10 px, à adapter au contenu réel.

## Parcours prévus

| Espace | Vues de conception |
| --- | --- |
| Authentification | Connexion, inscription, récupération du mot de passe |
| Administration | Tableau de bord, gestion des étudiants/utilisateurs, détail et création/modification des comptes, catalogue et création/modification des cours |
| Étudiant | Découverte des cours, détail et inscription, Mes cours, contenu d’une leçon |
| Compte | Profil et réglages disponibles |

Cette liste décrit la direction de conception convenue, pas les écrans déjà implémentés ou vérifiés dans Figma. Les fonctionnalités livrées suivent le brief, les tickets et les contrats API disponibles. La récupération du mot de passe, les réglages éditables et les opérations Admin restent conditionnés au support backend réel.

## De la maquette à l’interface

Lors de l’intégration, vérifier les vues desktop et mobile, les longs textes, le clavier, le focus et les états chargement/vide/erreur. Les rôles, statistiques et succès affichés doivent provenir du serveur ; les données et sélecteurs de démonstration d’une maquette ne définissent pas les permissions de l’application.
