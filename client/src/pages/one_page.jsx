import React, { useContext, useEffect, useState } from "react";
import "./one_page.css";
import { PlayersHands } from "../components/hands";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../context/userContext";

function Page1() {
  //const navigate = useNavigate();
  const { socket, user, setSocket } = useContext(UserContext);
  const username = user ? user.username : "";
  const { roomId } = useParams();

  const [currentUser, setCurrentUser] = useState("");
  const [players, setPlayers] = useState([]);
  const [end, setEnd] = useState(false);
  // stocke toutes les mains
  const [playableCard, setPlayableCard] = useState([]);
  const [currentColor, setCurrentColor] = useState("");
  const [currentNumber, setCurrentNumber] = useState(0);
  // on s'enfout
  const [draw, setDraw] = useState([]);
  // tour de quel joueur
  const [turn, setTurn] = useState(0);
  // lastcard
  const [fosse, setFosse] = useState([]);
  const [test, setTest] = useState(false);

  useEffect(() => {
    if (username !== "" && !socket) {
      //navigate("/chat");
      // c'est pour le refresh donc déconnexion/reconnexion.
    }
  }, [username]);

  useEffect(() => {
    if (username !== "" && socket) {
      // Ce code ne sera exécuté qu'une seule fois au montage du composant
      socket.emit("GameHasStarted", { roomId, username });
    }
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("SendInfo", (data) => {
        setPlayers(data.players);
        console.log(data.players);
        setFosse(data.lastCard);
        setCurrentColor(data.currentColor);
        setTurn(data.currentTurn);
        setPlayableCard(data.playableCards);
        console.log("data", data.playableCards);
      });

      socket.on("updateDraw", (data) => {
        console.log("data", data);
        setTurn(data.currentTurn);
        console.log(players);
        setPlayers((prevPlayers) => {
          const updatedPlayers = [...prevPlayers];
          const playerIndex = updatedPlayers.findIndex(
            (player) => player.username === data.hand.player
          );
          if (playerIndex !== -1) {
            updatedPlayers[playerIndex].hand = data.hand.newhand;
          }
          console.log(updatedPlayers);
          return updatedPlayers;
        });
        console.log(data.playableCards, playableCard);
        setPlayableCard(data.playableCards);
      });

      socket.on("hasPlayed", (data) => {
        console.log(data);
        setFosse(data.lastCard);
        setCurrentColor(data.currentColor);
        setTurn(data.currentTurn);
        setPlayableCard(data.playableCards);
        setPlayers((prevPlayers) => {
          const updatedPlayers = [...prevPlayers];
          const playerIndex = updatedPlayers.findIndex(
            (player) => player.username === data.hand.player
          );
          if (playerIndex !== -1) {
            updatedPlayers[playerIndex].hand = data.hand.newhand;
          }
          console.log(updatedPlayers);
          return updatedPlayers;
        });
      })
    }

    return () => {
      if (socket) {
        socket.off("SendInfo");
      }
    };
  }, [socket]);

  useEffect(() => {
    // // Vérifier si playersHand est vide
    // if (Object.keys(playersHand).length === 0) {
    //     // Effectuer les actions nécessaires seulement si playersHand est vide
    //     setPlayersHand({
    //         "thanu": ["purple_1", "purple_1","purple_1", "purple_1","purple_1", "purple_1","purple_1", "purple_1","purple_1", "purple_1","purple_1", "purple_1"],
    //         "inconnu": ["purple_1", "purple_1", "purple_1","purple_1", "purple_1","purple_1", "purple_1","purple_1", "purple_1","purple_1" ,"purple_1", "purple_1","purple_1", "purple_1",,"purple_1", "purple_1","purple_1", "purple_1"],
    //         "versatile": ["purple_1", "purple_1"],
    //         "pastèque épicée": ["purple_1", "purple_1"]
    //     });
    //     setCurrentUser("thanu");
    // }
  }, [test]);

  return (
    // represente le board, on lui applique un effet CSS.
    <div className="board">
      {/*On regarde si la partie est fini via un opérateur ternaire, si oui on affiche le classement, 
                sinon on execute le necessaire pour le fonctionnement de la partie*/}
      {end ? (
        <div>
          {
            <>
              <h1>La partie est fini voici le classement</h1>
            </>
          }{" "}
        </div>
      ) : (
        <div className="hands">
          {
            <PlayersHands
              players={players}
              currentUser={username}
              currentColor={currentColor}
              lastCard={fosse}
              turn={turn}
              playableCard={playableCard}
            />
          }
        </div>
      )}
    </div>
  );
}

export default Page1;
