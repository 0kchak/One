import React, { useContext, useEffect, useRef, useState } from "react";
import back from "../assets/cartes/back.png";
import back_left from "../assets/cartes/back left.png";
import { useParams } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import ColorSelector from "./colorSelector";
import { GameContext } from "../../context/gameContext";

/**
 * Crée la face d'une carte. Sera utilisé pour génerer les cartes des adversaires selon la vue du joueur.
 *
 * @return {JSX.Element} La face de la carte.
 */
export function BackCard(props) {
  const { joueur } = props;
  switch (joueur) {
    case 1:
      return <img className="back topside" src={back} />;

    case 2:
      return <img className="back leftside" src={back_left} />;

    case 3:
      return <img className="back rightside" src={back_left} />;

    default:
      return <img className="back drawcard" src={back} />;
  }
}

/**
 * Crée la carte avec sa couleur et sa valeur. Sera utilisé pour génerer les cartes du joueur.
 * Les cartes sont cliquables, ce qui permet de lancer une fonction handleCardClick. Nécessaire pour l'intégration visuel du jeu.
 *
 * @return {JSX.Element} La face de la carte. On retourne une balise image.
 */
export function Card({ valeur, playableCard, setItems, players, one, index }) {
  const { socket, user } = useContext(UserContext);
  const username = user ? user.username : "";
  const { roomId } = useParams();
  const [imagePath, setImagePath] = useState("");
  const { selected, setSelected } = useContext(GameContext);
  const { sameValueCard, setSameValueCard } = useContext(GameContext);
  const { setCardsToPlay } = useContext(GameContext);
  const currentUser = players.find((player) => player.username === username);
  const userHand = currentUser ? currentUser.hand : [];

  let playable = "";
  let select = "";

  useEffect(() => {
    if (valeur) {
      console.log("debug import", valeur, index);
      import(`../assets/cartes/${valeur.color}_${valeur.value}.png`)
        .then((image) => {
          setImagePath(image.default);
        })
        .catch((error) => {
          console.error("Erreur de chargement de l'image :", error);
        });
    }
  }, [valeur]);

  if (valeur) {
    if (
      playableCard !== undefined &&
      playableCard !== null &&
      sameValueCard.length === 0
    ) {
      console.log(playableCard, "debug playablecard");
      if (playableCard.length === 0) {
        playable = "cannotPlay";
      } else {
        for (const card of playableCard) {
          console.log(card, "debug card");

          if (card.color === valeur.color && card.value === valeur.value) {
            playable = "";
            break;
          } else {
            playable = "cannotPlay";
          }
        }
      }
    } else {
      for (const sameVal of sameValueCard) {
        if (sameVal.value === valeur.value) {
          playable = "";
          break;
        } else {
          playable = "cannotPlay";
        }
      }
    }
    selected.map((cardIndex) => {
      if (cardIndex === index) {
        select = "selected";
      }
    });
  }

  /**
   * Une fonction qui sera utilisé si une carte est cliquée.
   * Elle veriféra si la carte est jouable et la joue si oui.
   * A gérer.
   *
   */
  const handleCardClick = (event) => {
    console.log(valeur, "connard");
    if (
      event.currentTarget.parentElement.className !== "lastcard" &&
      event.currentTarget.classList.value == "card  " &&
      !event.currentTarget.parentElement.className.includes("cannotPlay")
    ) {
      let condition = false;
      const avaibleCard = userHand.filter((card, j) => {
        if (card.value === valeur.value && !selected.includes(j)) {
          setSelected([...selected, index]);
          return true;
        } else {
          return false;
        }
      });
      if (avaibleCard.length > 1) {
        setSameValueCard(avaibleCard);
        setSelected([...selected, index]);
        setItems([interfaceCard]);
        return;
      }
      console.log(userHand.length, one);
      if (userHand.length === 2 && one === false) {
        condition = true;
      }

      const send = [];
      for (const indexSelected of selected) {
        send.push(indexSelected);
      }
      send.push(index);

      if (valeur.color === "withoutColor" || valeur.color === "allColors") {
        setCardsToPlay(send);
        setItems([
          <ColorSelector
            key={101}
            card={valeur}
            one={condition}
            roomId={roomId}
          />,
        ]);
      } else {
        socket.emit("playCard", { cardPlayed: send });
        if (condition === true) {
          console.log("ici");
          socket.emit("One", parseInt(roomId));
        }
      }
    }
  };

  const handlePlayClick = () => {
    let condition = false;
    const send = [];
    for (const indexSelected of selected) {
      send.push(indexSelected);
    }
    send.push(index);
    const lastCardChoice = userHand[send[send.length - 1]];
    setCardsToPlay(send);
    if (
      lastCardChoice.color == "withoutColor" ||
      lastCardChoice.color === "allColors"
    ) {
      if (userHand.length === 2 && one === false) {
        condition = true;
      }
      setItems([
        <ColorSelector
          key={100}
          card={valeur}
          one={condition}
          roomId={roomId}
        />,
      ]);
    } else {
      setItems([]);
      socket.emit("playCard", { cardPlayed: send });
    }
  };

  const handleCancelClick = () => {
    setSelected([]);
    setSameValueCard([]);
    setItems([]);
  };

  const interfaceCard = (
    <React.Fragment key={index}>
      <div className="colorContainer" id="manyCard">
        <p className="textManyCard">
          You can still play cards of the same value.
        </p>
        <p className="textManyCard">
          Please click on the cards you want to play, then click on the play
          button.
        </p>
        <p className="textManyCard">
          You can cancel your selection by clicking cancel.
        </p>
        <div className="buttonContainer">
          <button className="playButton" onClick={handlePlayClick}>
            Play
          </button>
          <button className="cancelButton" onClick={handleCancelClick}>
            Cancel
          </button>
        </div>
      </div>
    </React.Fragment>
  );

  // Valeur de la carte pour l'affichage, contenant sa couleur et la valeur, ex: "purple_1"
  return (
    <img
      className={`card ${playable} ${select}`}
      src={imagePath}
      onClick={handleCardClick}
    />
  );
}
