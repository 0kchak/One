import React, { useContext, useEffect, useState } from "react";
import "./one_page.css";
import { PlayersHands } from "../components/hands";
import ColorSelector from "../components/colorSelector";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import logo from "../assets/logo.png";
import { ButtonContext } from "../../context/buttonContext";
import { GameContext } from "../../context/gameContext";

function Page1() {
  const navigate = useNavigate();
  const { socket, user, setSocket} =
    useContext(UserContext);

  const {setInGame, setDontShow } = useContext(ButtonContext)
  const username = user ? user.username : "";
  const { roomId } = useParams();

  const [players, setPlayers] = useState([]);
  // stocke toutes les mains
  const [playableCard, setPlayableCard] = useState([]);
  const [currentColor, setCurrentColor] = useState("");
  const [items, setItems] = useState([]);
  // tour de quel joueur
  const [turn, setTurn] = useState(0);
  // lastcard
  const [Fausse, setFausse] = useState([]);
  const [one, setOne] = useState(false);
  const [oneOut, setOneOut] = useState(false);
  const [end, setEnd] = useState(false);
  const [winner, setWinner] = useState([]);
  const [ranking, setRanking] = useState([]);
  const {setSelected} = useContext(GameContext);
  const {setSameValueCard} = useContext(GameContext);


  useEffect(() => {
    if (username !== "" && !socket) {
      //navigate("/chat");
      // c'est pour le refresh donc déconnexion/reconnexion.
    }
  }, [username]);

  useEffect(() => {
    setInGame(true);
    setDontShow(false);
    if (username !== "" && socket) {
      // Ce code ne sera exécuté qu'une seule fois au montage du composant
      socket.emit("GameHasStarted", { roomId, username });
    }
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("SendInfo", (data) => {
        setPlayers(data.players);
        setFausse(data.lastCard);
        setCurrentColor(data.currentColor);
        setTurn(data.currentTurn);
        setPlayableCard(data.playableCards);
      });

      socket.on("updateDraw", (data) => {
        setTurn(data.currentTurn);
        setPlayers((prevPlayers) => {
          const updatedPlayers = [...prevPlayers];
          const playerIndex = updatedPlayers.findIndex(
            (player) => player.username === data.hand.player
          );
          if (playerIndex !== -1) {
            updatedPlayers[playerIndex].hand = data.hand.newhand;
          }
          return updatedPlayers;
        });
        setPlayableCard(data.playableCards);
      });

      socket.on("hasPlayed", (data) => {
        setFausse(data.lastCard);
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
          if (data.hand.previousPlayer) {
            const playerIndexPrevious = updatedPlayers.findIndex(
              (player) => player.username === data.hand.previousPlayer.name
            );
            if (playerIndexPrevious !== -1) {
              updatedPlayers[playerIndexPrevious].hand =
                data.hand.previousPlayer.hand;
            }
          }
          return updatedPlayers;
        });
        setItems([]);
        setOne(false);
        setOneOut(false);
        setSelected([]);
        setSameValueCard([]);
      });

      socket.on("gameResults", (data) => {
        setWinner(data.winner);
        setRanking(data.rankings);
        setEnd(true);
      });

      socket.on("OneOutPossible", () => {
        setOneOut(true);
      });

      socket.on("updateOne", (data) => {
        setPlayers((prevPlayers) => {
          const updatedPlayers = [...prevPlayers];
          const playerIndex = updatedPlayers.findIndex(
            (player) => player.username === data.name
          );
          if (playerIndex !== -1) {
            updatedPlayers[playerIndex].hand = data.hand;
            setPlayableCard(data.playableCards);
          }
          return updatedPlayers;
        });
      });
    }

    return () => {
      if (socket) {
        socket.off("SendInfo");
      }
    };
  }, [socket]);

  const leave = () => {
    if (socket) {
      socket.disconnect();
    }    
    setSocket(null);
    setInGame(false);
    navigate("/dashboard");
  };

  return (
    <div className="screen">
      <div className="containerimage">
        <img className="boxlogo" src={logo}></img>
      </div>
      <div className="screendashBlue" id="gamescreen" />
      <div className="screendashPink" id="gamescreen" />
      <div className="board">
        {/*On regarde si la partie est fini via un opérateur ternaire, si oui on affiche le classement, 
                sinon on execute le necessaire pour le fonctionnement de la partie*/}
        {end && (
          <div className="endPage">
            <div className="endContainer">
              <h1 className="endTitle">{winner} has won the game!</h1>
              <hr></hr>
              {ranking.map((player, index) => (
                <p className="rankingPlayer" key={index}>
                  {index === 0 && "👑"} {player.username} : {player.cardCount}
                </p>
              ))}
              <button
                className="itemMenu"
                id="endButton"
                onClick={leave}
              >
                Leave
              </button>
            </div>
          </div>
        )}
        {items}
        <div className="hands" style={end ? { filter: "blur(5px)" } : {}}>
          {
            <PlayersHands
              players={players}
              currentUser={username}
              currentColor={currentColor}
              lastCard={Fausse}
              turn={turn}
              playableCard={playableCard}
              setItems={setItems}
              one={{ one, setOne }}
              oneOut={{ oneOut, setOneOut }}
            />
          }
        </div>
      </div>
    </div>
  );
}

export default Page1;
