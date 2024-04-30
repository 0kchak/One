# Projet AWS : One, jeu de cartes

## Description de l'application

Nous avons décidé de créer une plateforme qui permettra de jouer en multijoueur à un jeu similaire au UNO, nommé One, différant sur certaines règles (enchaînement plusieurs fois de la même carte, pas de règle d'échange de carte...). 

Il sera également possible de communiquer via un tchat. Un système d'authentification sera mis en place pour identifier un joueur de manière relativement sécurisée.

## Ce qui a été réalisé les semaines passées

Dans un premier temps, nous avons développé la direction artistique et la logique de notre jeu. Un début d'authentification a été réalisé en Javascript et HTML. En parallèle, nous avons continué l'intégration de la maquette en utilisant React.

## Progrès Réalisés 

Ces dernières semaines, chaque personne avait une tâche précise, ce qui nous a permis d'avancer efficacement sur notre projet.

Tout d'abord, l'authentification est finie et fonctionnelle. Le code fourni la semaine précédente a été grandement modifié afin de s'adapter à nos attentes, c'est-à-dire l'utilisation de React, Express.js et Node.js. En effet, le premier code avait été implémenté en HTML en tant que "premier jet".  
Désormais, notre code d'authentification est lié à une base de données MongoDB que l'on manipule avec Mongoose. Le mot de passe est haché avec l'algorithme Bcrypt avant d'être stocké dans la base de données, afin d'éviter un problème de fuite de données. L'implémentation de tokens, avec JWT (Json Web Token) a été choisie.  

Ensuite, la gestion des serveurs a été un objectif clé à atteindre pour ces semaines. Deux aspects ont été explorés.  
Le premier étant la possibilité d'accéder à une room à partir d'un lien, une room étant l'endroit où une partie de One se déroule.   
Le deuxième aspect a été la synchronisation de la communication des joueurs en temps réel. Socket.io a été primordial pour créer des rooms, et sera utile pour la communication dans le tchat. Nous avons maintenant un système où les joueurs peuvent rejoindre des parties, et leurs actions sont synchronisées avec tous les participants en temps réel. Un mécanisme de vérification de tokens a été également intégré, permettant ainsi d'assurer que seuls les utilisateurs authentifiés peuvent rejoindre les parties. Cela contribue à la sécurité et à l'intégrité de notre jeu.

De plus, la logique du jeu étant presque finie, nous avons remarqué quelques cas auxquels nous n'avions pas pensé en faisant des tests, que nous avons donc du inclure dans le code. C'est le serveur qui gère la logique du jeu, ce qui permettra de garder face cachée les cartes des joueurs adverses avec de nouvelles fonctions à l'avenir.

En parallèle, le développement du front a avancé, au niveau du système d'authentification et du jeu, nous donnant une idée plus précise de notre DA.

En résumé, un joueur peut s'inscrire, s'authentifier, rejoindre des rooms spécifiques, et démarrer des parties de Uno.

De manière générale, les codes de chacun devaient faire attention a bien pouvoir s'intégrer aux codes des autres, donc du back-end au front-end.  
Une de nos pistes d'amélioration étant d'ajouter plusieurs jeux de cartes, nous avons écarté cette possibilité par manque de temps.

## Problèmes rencontrés
1. __Système d'authentification :__     
Plusieurs notions nous étaient inconnues de base, comme les tokens, cookies ou routes, le temps de compréhension et d'application étaient donc relativement longues par rapport à une personne en ayant déjà implémenté. La façon d'implémenter le code était également un obstacle lorsqu'il fallait gérer des cas particuliers.
2. __Gestion des serveurs:__     
L'absence du système d'authentification fonctionnel dès le début a freiné l'avancement de la gestion des serveurs. Les deux étant liés, les choix de l'un impactaient le code de l'autre. Le problème principal restant de nouveau l'asynchrone.
3. __Cas particuliers:__     
De manière générale, la prise en compte de tous les cas particuliers a été plutôt rude.


## Améliorations
Côté authentification, quelques ajouts seront faits dans les semaines à venir, tels qu'un lien _"Forgot password?"_, une option cliquable à côté du mot de passe pour pouvoir le visualiser lorsqu'il est tapé, ou encore la sécurisation du token et des routes.  
Côté serveurs, la permission pour plusieurs joueurs de se connecter à une room, et également de pouvoir choisir combien de personnes réelles jouent, pour combler le reste avec des bots, ou bien qu'on puisse jouer à 2 comme à 3 ou 4 joueurs mais réels uniquement.  
Et de manière plus générale, un choix final de DA et un lien entre tous les codes sera fait.

## Organisation

L'organisation pour ces dernières semaines a été la suivante :
- Daoud et Zeyneb se sont occupés d'implémenter la gestion des serveurs
- Daoud a fait des recherches plus approfondies sur nos choix
- Maya s'est occupée de finir l'authentification et de présenter le projet
- Thanushan s'est occupé de suivre chacun des membres, gérer les réunions et de continuer le front
  
Etant donné que Maya n'a pas pu assurer sa présentation au premier rendez-vous pour des raisons justifiées, et que c'est Thanushan qui s'en est occupé bien que leur rôle respectif étaient responsable de groupe et codeur, c'est elle qui se charge de la présentation cette semaine et de la réorganisation des tâches. Mais durant ces dernières semaines, Maya était codeuse et Thanushan responsable de groupe, il est important de le noter.

## Calendrier

### Calendrier initial:
Objectif à avoir accompli à la date indiquée.
- 28/02: Implémenter le jeu + Création du design + Implémenter le site
- 13/03: Finir le jeu + Création de compte (Implémentation d'un système d'authentification) + Continuer l'implémentation du site
- 03/04: Finir la création de compte (Intégration de la base de données + relier back/bdd + Finition côté front avec react) + Finir l'implémentation du site + Relier front/back + les interactions du jeu + gestion des serveurs
- 10/04: Finir la gestion des serveurs + si tous accompli, intégrer d'autre jeux de cartes + Ajouter de la musique d'ambiance + développer le tchat + gérer le responsive

### Calendrier ajusté:
**10/04** : Finir la gestion des serveurs (Z & D) + développer le tchat (T & M) + Tout relier bien (T) + (Rendre visible le mdp avec le petit oeil, Oubli de mdp -> mail automatique ) (M & T)  
**24/04** : Gérer le responsive (T) + Sécuriser avec https et routes et token (M) + Ajout mode daltonien (T) + Hebergeur (Z & D) + Ajout d'une IA (possibilité d'avoir 1 jour réel, 3 bots etc) OU jeu maléable (peut etre joué a 2, 3 ou 4) (Z & D) + Avoir une plateforme uniforme sur la DA et jouable (T & M)   
**08/05** : Avoir une plateforme uniforme sur la DA et jouable (T & M) + Implémenter & Rédiger paramètres (M) +
Rapport et soutenance (M) + Ajouter de la musique d'ambiance (Z & D) + (Classement (Z & D)) 


## Rôles

#### Rôles de la semaine :  
_Du 13/03 au 03/04_ :  
- Responsable : Maya (_pitch_)/Thanu
- Codeurs :  Maya et Zeyneb
- Chercheur : Daoud


#### Rôles de la semaine prochaine :  
_Du 03/04 au 10/04_ :  
- Responsable : Daoud
- Codeurs : Zeyneb et Thanu
- Chercheuse : Maya


## Réferences

https://www.purestorage.com/fr/knowledge/what-is-mongodb.html#:~:text=Il%20s'agit%20d'une%20base%20de%20donn%C3%A9es%20orient%C3%A9e%20document,sous%20forme%20de%20documents%20JSON.  
https://fr.linkedin.com/pulse/sessions-vs-jwts-un-guide-complet-de-web-mohamed-ouattara  
https://www.synbioz.com/blog/tech/le-web-temps-reel-avec-socketio#:~:text=Pour%20la%20tester%2C%20enregistrez%20l%C3%A0,la%20console%20de%20ce%20dernier.  
https://github.com/eperezcosano/Uno  
https://www.youtube.com/watch?v=XPC81RWOItI&t=2889s  
Sources : Chagpt nous a principalement été utile pour l'explication de certains termes compliqués et le début de piste de recherche.


# Appendix
## Maquette
Maquette pour l'interface du jeu: 
![jeucouleur](https://github.com/Groupe4AWS24/Jeux_de_cartes/blob/main/rapport/Maquette%20jeux%20couleur.png)  

Maquette pour les cartes:  
![carte](https://github.com/Groupe4AWS24/Jeux_de_cartes/blob/main/rapport/Maquette%20cartes.png)  

Maquette pour l'authentification: 
![authentification](https://github.com/Groupe4AWS24/Jeux_de_cartes/blob/main/rapport/Login.png)

