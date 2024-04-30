# Projet AWS: Card Games

## Description de l'application

Nous avons décidé de créer une plateforme qui permettra de jouer en multijoueur à un jeu similaire au UNO différant sur certaines règles (enchaînement plusieurs fois de la même carte, pas de règle d'échange de carte...). 

Il sera également possible de communiquer via un tchat. Un système d'authentification sera mis en place pour identifier un joueur de manière relativement sécurisée.

## Ce qui a été réalisé les semaines passées

Dans un premier temps, nous avons développé la direction artistique de notre jeu. Puis, pour l'intégration du projet, nous avons entamé le développement de la logique du jeu, et en parallèle, nous avons débuté l'intégration de la maquette en utilisant React.

## Progrès Réalisés 

Cette semaine, nous avons terminé la logique du jeu et réécrit des fonctions qui nous posaient problèmes.
En outre, des débuts d'authentification du compte et d'inscription ont été implémentés en Javascript et HTML. Comme aucune base de donnée n'a encore été implémentée, ces pages sont obsolètes mais vérifient les conditions de chacun, il suffira de créer une fonction qui vérifie que les données se trouvent ou non dans la base de donnée. Le but sera donc, pour ces prochaines semaines, de rendre fonctionnel tout le système d'authentification en utilisant Nodejs, Reactjs et MongoDB.
Nous avons également continué le front en corrigeant des erreurs rencontrées.

Globalement, le projet a évolué plus doucement qu'au début car des problèmes personnels ont été rencontrés pour plusieurs personnes, mais les objectifs prévus ont tout de même été atteints. Les prochaines semaines seront plus chargées.

## Organisation

L'organisation pour cette semaine a été la suivante :
- Daoud s'est occupé de finir l'implémentation de la logique du jeu en back-end
- Maya s'est occupée de l'authentification
- Thanushan s'est occupé des recherches et de modifier les maquettes déjà faites
- Zeyneb s'est occupée de suivre chacun des membres
  
# Réferences

https://cyber.gouv.fr/bonnes-pratiques-protegez-vous#:~:text=Cr%C3%A9ez%20un%20mot%20de%20passe,chiffres%20et%20des%20caract%C3%A8res%20sp%C3%A9ciaux  
https://cyber.gouv.fr/publications/recommandations-relatives-lauthentification-multifacteur-et-aux-mots-de-passe  
https://fr.wikipedia.org/wiki/Bcrypt  
https://www.iubenda.com/fr/help/57465-consent-database-documentation-js  
https://stytch.com/blog/argon2-vs-bcrypt-vs-scrypt/  
https://www.platoapp.com/: Plato a été notre inspiration pour notre jeu Uno.  
https://nordvpn.com/fr/blog/what-is-bcrypt/  
https://socket.io/fr/docs/v4/ Pour la documentation sur la bibliothèque et ses intérêts  
Sources: Chagpt nous a principalement été utile pour l'explication de certains termes compliqués et le début de piste de recherche.



# Problèmes rencontrés
1. __Disponibilités de chacun  :__  
Une des difficultés rencontrées cette semaine a été de s'adapter aux différents emplois du temps, puisqu'une partie du groupe était en déplacement à l'étranger pour un Hackathon, et que des problèmes personnels ont été rencontrés pour plusieurs personnes. Malgré ces imprévus, nous avons réussi à nous en tenir au calendrier préétabli, mais ne laissant cependant aucune marge pour des améliorations.
2. __Gestion asynchrone :__  
La nécessité de récupérer les cartes choisies par chaque joueur introduit une interaction utilisateur essentielle. Cependant, cette étape a posé des problèmes de gestion du flux de contrôle, car le programme devait attendre que chaque joueur fasse son choix avant de passer au tour suivant. La gestion de cette interaction utilisateur, tout en maintenant la continuité du jeu, a exigé une approche asynchrone.
L'introduction de mécanismes d'attente asynchrone a été une solution clé. Cette approche permet au programme de suspendre temporairement son exécution pour attendre les choix des joueurs sans bloquer complètement le déroulement du jeu.
3. __Base de données :__
L'absence de l'implémentation de la base de donnée a été un problème lors de l'implémentation des pages d'authentification et d'inscription. En effet, il aurait été plus judicieux d'inverser les étapes pour une meilleure cohérence. L'introduction de Nodejs et Reactjs n'était pas naturelle sans la base de donnée disponible au préalable, ce qui nous fera perdre du temps sur la réadaptation du code aux technologies choisies. Le code actuel sera forcément mis à jour pour la prochaine fois, avec une meilleure interface, une base de donnée intégrée et une sécurité.


# Calendrier

## Calendrier intial:
Objectif à avoir accompli à la date indiquée.
- 28/02: Implémenter le jeu + Création du design + Implémenter le site
- 13/03: Finir le jeu + Création de compte (Implémentation d'un système d'authentification)
- 03/04: Finir la création de compte (Intégration de la base de données) + développer le tchat + les interactions du jeu + gestion des serveurs + possible intégration de bots.
- 10/04: Finir la gestion des serveurs + si tout est accompli, intégrer d'autre jeux de cartes.

## Calendrier ajusté:
Objectif à avoir accompli à la date indiquée.
- 28/02: Implémenter le jeu + Création du design + Implémenter le site
- 13/03: Finir le jeu + Création de compte (Implémentation d'un système d'authentification) + Continuer l'implémentation du site
- 03/04: Finir la création de compte (Intégration de la base de données + relier back/bdd + Finition côté front avec react) + Finir l'implémentation du site + Relier front/back + les interactions du jeu + gestion des serveurs
- 10/04: Finir la gestion des serveurs + si tous accompli, intégrer d'autre jeux de cartes + Ajouter de la musique d'ambiance + développer le tchat + gérer le responsive

# Rôles

Rôles de la semaine :  
- Responsable : Zeyneb
- Codeurs : Maya et Daoud
- Chercheur : Thanu

Rôles de la semaine prochaine :
Du 13/03 au 03/04 :  
- Responsable : Maya/Thanu
- Codeurs :  Maya et Zeyneb
- Chercheur : Daoud

Du 03/04 au 10/04 :  
- Responsable : Daoud
- Codeurs : Zeyneb et Thanu
- Chercheuse : Maya


# Technologies qui seront utilisées
On va utiliser les bibliothèque mongosse (MongoDB), Bcrypt (Hachage), dotenv (pouvoir stocker des info sensibles sans le mettre dans le code source, ex : clé API)
Nous avons choisi Bcrypt pour plusieurs raisons, la principale étant l’intégration automatique du sel. De plus, il a été conçu pour être lent à calculer et rendre coûteuses les attaques par force brute. Du fait qu’il soit largement adopté, il y a plusieurs tests de sécurité dessus, ce qui renforce la confiance dans sa robustesse.
Initialement, il était prévu de suivre les recommandations de l’ANSII pour le système d’authentification. Cependant, étant donné la complexité de la mise en place de plusieurs éléments tels que l’authentification à facteurs multiples, la journalisation, ou encore la surveillance des tentatives de connexion, il a été décidé que toutes ces recommendation ne correspondaient pas aux ambitions de notre projet, et rendraient l’expérience utilisateur moindre.


# Appendix
## Maquette
Maquette conception du jeu:  
![jeuschema](https://github.com/Groupe4AWS24/Jeux_de_cartes/blob/main/rapport/Maquette%20jeux.png)  
![jeucouleur](https://github.com/Groupe4AWS24/Jeux_de_cartes/blob/main/rapport/Maquette%20jeux%20couleur.png)  

Maquette pour les cartes:  
![carte](https://github.com/Groupe4AWS24/Jeux_de_cartes/blob/main/rapport/Maquette%20cartes.png)  

Maquette pour l'interface du jeu: 
![jeu](https://github.com/Groupe4AWS24/Jeux_de_cartes/blob/main/rapport/Maquette%20de%20l'interface%20du%20jeu.png)

