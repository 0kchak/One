const socketIo = require("socket.io");
const Player = require("../jeu/Player");
const ManageGame = require("../jeu/ManageGame");
function setupSocket(server) {
  // Paramétrage socket.io pour le serveur hebergé en local
  const io = socketIo(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  // Déclaration de plusieurs variables pour la gestion du jeu
  let roomId = 1;
  const rooms = {};
  const playerDetails = {};

  // Le serveur via socket.io, va écouter si un joueur se connecte et initialise les fonctions internes.
  io.on("connection", (socket) => {
    // Pour le débugage
    console.log(`Nouveau joueur connecté: ${socket.id}`);

    // Lorsque le serveur écoute qu'un joueur s'est connecté et qu'il est authentifié (en envoyant sur username),
    // va modifier les informations du joueurs pour retenir son username. Et envoyer que ce dernier est bien connecté.
    socket.on("authenticate", (username) => {
      console.log(username);
      if (username) {
        socket.user = { username: username, id: socket.id };
        console.log(socket.id, socket.user);
        // Pour la connexion avec le front et le back
        io.emit("authenticated", "Authentification reussie");
      }
    });

    // Permet à un joueur de créer une nouvelle room, en choisiant le nombre de joueurs maximum.
    socket.on("createRoom", ({ maxPlayers }) => {
      const newRoom = {
        id: roomId,
        owner: socket.user,
        players: [socket.user],
        maxPlayers,
        gamestarted: false,
        game: null, // Initialise le jeu sans joueurs pour l'instant
      };

      rooms[roomId] = newRoom;
      console.log(socket.user);
      playerDetails[socket.id] = {
        roomId,
        player: new Player(socket.user.username),
      };

      // Permet au joueur de rejoindre une room
      socket.join(roomId);
      // Lui envoi l'informations de quelle room il a crée
      socket.emit("roomCreated", {
        roomId,
      });
      // augmente le compteur de roomId, pour avoir que des rooms différentes
      roomId += 1;
    });

    // Permet à un joueur d'envoyer un message au sein de sa room.
    socket.on("message", (newMsg) => {
      console.log(
        `L'ancien ${newMsg.player} debite dans la room ${newMsg.room}: ${newMsg.message}`
      );
      io.to(newMsg.room).emit("message", newMsg);
    });

    // Permet au joueur de se déconnecter
    socket.on("disconnect", () => {
      console.log(`Joueur ${socket.id} deconnecté`);
      const details = playerDetails[socket.id];
      if (details) {
        const { roomId } = details;
        const room = rooms[roomId];
        if (room) {
          room.players = room.players.filter(
            ({ username }) => username !== details.player.name
          );
          if (room.players.length === 0) {
            // Supprime la room si elle est vide
            delete rooms[roomId];
          } else {
            console.log("roommmmm : ", details);
            io.to(roomId).emit("playerDisconnected", details.player.name);
          }
        }
        delete playerDetails[socket.id];
      }
    });

    // Permet à un joueur de rejoindre une room précise, tant que cette dernière existe et non remplie.
    socket.on("joinRoom", ({ roomId }) => {
      const room = rooms[roomId];
      // verifie que la room existe dans la liste de liste crée.
      if (!room) {
        socket.emit("error", "Room not exists");
        return;
      }

      // verifie que la room n'est pas remplie
      if (room.players.length >= room.maxPlayers) {
        socket.emit("error", "Room is full");
        return;
      }

      if (room.gamestarted == true) {
        socket.emit("error", "Game already started");
        return;
      }

      // Ajoute le joueur à la liste des joueurs de la room
      room.players.push(socket.user);
      console.log("Liste des joueurs :", room.players);
      playerDetails[socket.id] = {
        roomId: parseInt(roomId),
        player: new Player(socket.user.username),
      };
      // rejoins la room
      socket.join(room.id);
      socket.emit("roomJoined");
      // rajouter dans le coté client qd joeur rejoint en updantant la liste des joueurs
      io.to(room.id).emit("playerJoined", socket.user.username);
    });

    socket.on("startGame", ({ roomId }) => {
      console.log(socket.user.username);
      const room = rooms[roomId];

      // Vérifiez si l'utilisateur est le créateur de la room
      if (!room || room.owner.id !== socket.user.id) {
        socket.emit("error", "Seul le créateur peut démarrer le jeu");
        return;
      }

      // Vérifie si le nombre de joueurs est suffisant
      if (room.players.length < room.maxPlayers) {
        socket.emit("error", "Pas assez de joueurs");
        return;
      }

      // Initialiser le jeu
      room.gamestarted = true;
      const game = new ManageGame(
        room.players.map(({ id }) => playerDetails[id].player)
      );
      room.game = game;
      game.GameStart();

      // console.log("Jeu commence: ", rooms);
      // console.log("Jeu commence: Players :", room.players);
      // console.log("Jeu commence: Game :", room.game);
      // console.log("Jeu commence: Players :", room.game.players);
      // console.log("Jeu commence: Deck :", room.game.UnoDeck);
      io.to(room.id).emit("gameStarted");
    });

    socket.on("GameHasStarted", ({ roomId }) => {
      const room = rooms[roomId];
      if (room) {
        const start = room.players.map((player) => {
          const findplayer = room.game.players.find(
            (item) => item.name === player.username
          );
          if (findplayer.name === socket.user.username) {
            return {
              username: findplayer.name,
              id: player.id,
              hand: findplayer.hand,
            };
          } else {
            return {
              username: findplayer.name,
              id: player.id,
              hand: findplayer.hand.map((_) => null),
            };
          }
        });
        const currentColor =
          room.game.lastCard.color !== "allcolors" &&
          room.game.lastCard.color !== "withoutcolor"
            ? room.game.lastCard.color
            : room.game.lastColor;
        const currentTurn = room.game.currentPlayer.name;
        const playableCards =
          socket.user.username === currentTurn
            ? room.game.getPlayableCards()
            : null;
        console.log(playableCards);
        socket.emit("SendInfo", {
          players: start,
          lastCard: room.game.lastCard,
          currentColor: currentColor,
          currentTurn: currentTurn,
          playableCards: playableCards,
        });
      }
    });

    //un joueur pioche des cartes
    socket.on("drawCards", ({ roomId }) => {
      const room = rooms[roomId];
      if (room.game) {
        const current = room.game.currentPlayer.name;
        room.game.draw();
        console.log(room.game);
        console.log("Jeu commence: Players :", room.game.players);
        console.log(room.game.currentPlayer.name);
        const { hand } = room.game.players.filter(
          (player) => player.name === current
        )[0];
        console.log(
          "wewe",
          room.game.players.filter((player) => player.name === current)
        );
        //const player = rooms[socket.id];
        // Logique pour faire piocher les cartes au joueur
        // Après avoir mis à jour la main du joueur, redistribuer ses cartes
        room.players.forEach((player) => {
          io.to(player.id).emit("updateDraw", {
            hand: {
              player: current,
              newhand: hand.map((carte) => {
                if (player.username === current) {
                  return carte;
                } else {
                  return null;
                }
              }),
            },
            currentTurn: room.game.currentPlayer.name,
            playableCards:
              player.username === room.game.currentPlayer.name
                ? room.game.getPlayableCards()
                : null,
          });
        });
      }
    });

    socket.on("playCard", ({ cardPlayed }) => {
      // Identifier le joueur et la partie à partir des informations de la socket
      const player = playerDetails[socket.id];
      const room = rooms[playerDetails[socket.id].roomId];
      if (!player) {
        socket.emit("error", { message: "Joueur non trouvé." });
        return;
      }

      const { game } = room;
      if (!game) {
        socket.emit("error", { message: "Partie non trouvée." });
        return;
      }

      // Vérifier si c'est le tour du joueur
      if (game.currentPlayer.name !== socket.user.username) {
        socket.emit("error", { message: "Ce n'est pas votre tour." });
        return;
      }

      // Trouver la carte dans la main du joueur
      const cardIndex = game.currentPlayer.hand.findIndex(
        (card) =>
          card.color === cardPlayed.color && card.value === cardPlayed.value
      );
      if (cardIndex === -1) {
        socket.emit("error", { message: "Carte non trouvée dans votre main." });
        return;
      }

      const playedCard = game.currentPlayer.hand[cardIndex];
      console.log(
        "Carte trouvée",
        cardIndex,
        game.currentPlayer,
        game.currentPlayer.hand[cardIndex]
      );

      // Vérifier si la carte peut être jouée
      if (!game.canPlayOn(playedCard)) {
        socket.emit("error", { message: "Mouvement invalide." });
        return;
      }
      const current = game.currentPlayer.name;
      game.play([playedCard]);
      const { hand } = room.game.players.filter(
        (player) => player.name === current
      )[0];
      const currentColor =
        room.game.lastCard.color !== "allcolors" &&
        room.game.lastCard.color !== "withoutcolor"
          ? room.game.lastCard.color
          : room.game.lastColor;

      room.players.forEach((player) => {
        io.to(player.id).emit("hasPlayed", {
          hand: {
            player: current,
            newhand: hand.map((carte) => {
              if (player.username === current) {
                return carte;
              } else {
                return null;
              }
            }),
          },
          lastCard: room.game.lastCard,
          currentColor: currentColor,
          currentTurn: room.game.currentPlayer.name,
          playableCards:
            player.username === room.game.currentPlayer.name
              ? room.game.getPlayableCards()
              : null,
        });
      });
      // Jouer la carte et l'appliquer à la logique du jeu
      console.log(game.currentPlayer, game);
      console.log(game.currentPlayer.nextPlayer);
    });
  });
}

module.exports = { setupSocket };
