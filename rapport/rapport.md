# Projet AWS: Card Games

## Description de l'application

Nous avons décidé de créer une plateforme qui permettra de jouer en multijoueur à un jeu similaire au UNO différant sur certaines règles (enchaînement plusieurs fois de la même carte, pas de règle d'échange de carte...). 

Il sera également possible de communiquer via un tchat. Un système d'authentification sera mis en place pour identifier un joueur de manière relativement sécurisée.

## Progrès Réalisés 
  Nous avons commencé par choisir les technologies sur lesquelles le projet sera réalisé : pour le côté front-end (interface du site), le framework React sera utilisé, étant donné qu'il est l'un des frameworks les plus populaires, donc celui qui a le plus de documentation. Quant à la gestion du projet Vite sera utilisé au lieu du CRA, principalement pour le temps qu'il nous fait gagner (temps de démarrage et application des modifications).  

  Pour gérer la base de données du système d'authentification, on utilisera NOSQL via MongoDB. Cette approche est privilégiée par rapport à un hébergement via firebase à cause de la limitation du nombre de requêtes par jour pour la version gratuite.

  Pour le côté du serveur, on passera par Node.js et son framework express.js afin de faciliter la création des serveurs et de la gestion des requêtes HTTP.
  
  Dans un premier temps,  nous avons développé la direction artistique de notre jeu, en réalisant plusieurs propositions pour les cartes ainsi qu'une maquette du jeu. L'objectif était d'avoir une maquette assez simpliste nous permettant de l'intégrer le plus rapidement possible (cf l'appendix).

  Enfin, pour l'intégration du projet, nous nous sommes principalement concentrés sur la logique du jeu et la réalisatuin de toutes les fonctions essentielles. En outre, nous avons également commencé à réaliser l'intégration de la maquette via React, par des fonctions qui gèrent la création de cartes, de la main, et sur la réflexion de la stratégie à mettre en place pour la disposition des différents éléments.

# Réferences

https://css-tricks.com/snippets/css/a-guide-to-flexbox/ Explication des FlexBox  
https://www.figma.com/fr/ Le site où a été réalisé les maquettes  
https://flexboxfroggy.com/#fr Pour apprendre les différents usages des Flexbox (jeu interactif)  
https://flukeout.github.io/ Pour apprendre le CSS (jeu interactif)  
https://www.platoapp.com/: Plato a été notre inspiration pour notre jeu Uno.  
https://socket.io/fr/docs/v4/ Pour la documentation sur la bibliothèque et ses intérêts  
https://www.youtube.com/watch?v=EdB_lK7ICYc: Vidéo comparative entre Vite et CRA 


# Problèmes rencontrés
1. __Organisation des Classes et Méthodes :__  
L'une des premières difficultés a été de définir clairement les responsabilités de chaque classe et les méthodes nécessaires. La conception du jeu Uno impliquait de gérer plusieurs entités (cartes, joueurs, deck) et établir des liens logiques entre elles. La répartition des tâches entre les classes et la détermination des méthodes clés ont demandé une réflexion approfondie pour garantir une structure logique et compréhensible.
2. __Gestion de l'Ordre des Joueurs et des Actions Spéciales :__  
Trouver une manière efficace de relier les joueurs entre eux pour organiser l'ordre de jeu, faciliter les changements de sens de jeu et gérer les sauts du prochain joueur s'est révélé être un défi.  
L'idée proposée pour résoudre ce problème était d'introduire une organisation circulaire des joueurs avec des références à leurs prédécesseurs et successeurs.
3. __La disposition des éléments :__  
La disposition des éléments sur l'écran a été un défi complexe du à notre manque d'expérience avec le CSS et du framework React ; il nécessitait de trouver un moyen de pouvoir placer les éléments selon la maquette, tout en gardant une certaine flexibilité pour l'évolution via le responsive. Pour ceci, l'utilisation des absolute position n'étant pas possible, nous avons décidé de partir sur des structures composées de FlexBox : l'écran a été divisé en colonne via 3 Div, et pour la colonne du milieu, on la redivisait en ligne via 3 Div. (cf la derniere image dans l'appendix.)
4. __FlexBox :__
   Dans une moindre mesure, la compréhension de l'usage des flexbox était difficile à comprendre. Pour ceci, différentes documentations ont été consultées, et nous nous sommes exercés sur les différents usage du flexbox via un jeu interactif (cf les références)

# Calendrier

## Calendrier intial:
Objectif à partir de la date jusqu'à la date de la prochaine séance d'AWS.
- 14/02: Implémenter le jeu + Création du design + Implémenter le site
- 28/02: Finir le jeu + Création de compte (Implémentation d'un système d'authentification)
- 13/03: Finir la création de compte (Intégration de la base de données) + développer le tchat + les interactions du jeu + gestion des serveurs + possible intégration de bots.
- 03/04: Finir la gestion des serveurs + si tout est accompli, intégrer d'autre jeux de cartes + gérer le responsive.

## Calendrier ajusté:
Objectif à partir de la date jusqu'à la date de la prochaine séance d'AWS.
- 14/02: Implémenter le jeu + Création du design + Implémenter le site
- 28/02: Finir le jeu + Création de compte (Implémentation d'un système d'authentification) + Continuer l'implémentation du site
- 13/03: Finir la création de compte (Intégration de la base de données) + développer le tchat + les interactions du jeu + gestion des serveurs + Finir l'implémentation du site + Ajouter de la musique d'ambiance
- 03/04: Finir la gestion des serveurs + si tous accompli, intégrer d'autre jeux de cartes

# Rôles

Rôles de la semaine:  
- Responsable : Thanu/Maya (absente)
- Codeurs : Thanu et Daoud
- Chercheuse : Zeyneb

Rôles des prochaines semaines:  
Du 28/02 au 13/03 :  
- Responsable : Zeyneb
- Codeurs : Maya et Daoud
- Chercheur : Thanu

Du 13/03 au 03/04 :  
- Responsable : Maya/Thanu
- Codeurs :  Maya et Zeyneb
- Chercheur : Daoud

Du 03/04 au 10/04 :  
- Responsable : Daoud
- Codeurs : Zeyneb et Thanu
- Chercheuse : Maya


# Technologies qui seront utilisées

 Pour la communication client-serveur, nous avons opté pour Socket.io, une bibliothèque facilitant les communications en temps réel. Mais elle fournit également des fonctionnalités supplémentaires comme la reconnexion automatique, la diffusion à plusieurs clients, et le support des rooms, des points importants pour un jeu multijoueur contrairement aux Websockets natifs (gère aussi mieux la compatibilité avec d'autres navigateurs). Socket.io sera integré à notre application React pour communiquer avec le serveur Node.js (Socket.IO et Node.js sont utilisés ensemble), cela va établir une connexion WebSocket entre le navigateur de l'utilisateur et le serveur. 
Exemple simple de l'utilisation de Socket.io : quand un joueur joue une carte, l'action est envoyée au serveur via Socket.IO. Le serveur va traiter cette action (comme vérifier si le mouvement est valide, mettre à jour l'état du jeu, etc...), puis diffuse l'état du jeu mis à jour à tous les joueurs connectés en utilisant Socket.IO.

Dans le contexte d'un jeu Uno en ligne, Node.js sera utile pour construire le serveur qui gère la logique du jeu, les interactions avec la BD et les sessions des joueurs (privilégié à PHP car plus moderne et plus adapté à des jeux en ligne et chatbots car nécessite connexion en temps réel).
On creusera plus tard du coté de l'intégration du framework Express à notre stack combiné à Node.js pour faciliter la mise en place d'API, les interactions entre le serveur et le client, la création des routes et enfin la gestion des requêtes (très important car nous aurons beaucoup d'interactions client-serveur).
  
  

# Appendix
## Maquette
Maquette conception du jeu:  
![jeuschema](https://github.com/Groupe4AWS24/Jeux_de_cartes/blob/main/rapport/Maquette%20jeux.png)  
![jeucouleur](https://github.com/Groupe4AWS24/Jeux_de_cartes/blob/main/rapport/Maquette%20jeux%20couleur.png)  

Maquette pour les cartes:  
![carte](https://github.com/Groupe4AWS24/Jeux_de_cartes/blob/main/rapport/Maquette%20cartes.png)  

Maquette pour l'interface du jeu: 
![jeu](https://github.com/Groupe4AWS24/Jeux_de_cartes/blob/main/rapport/Maquette%20de%20l'interface%20du%20jeu.png)

Schéma des divisions pour l'affichage:  
![schemadiv](https://github.com/Groupe4AWS24/Jeux_de_cartes/blob/main/rapport/schemadiv.png)
