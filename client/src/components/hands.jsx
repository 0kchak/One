import React, { useContext } from "react";
import { BackCard, Card } from "../components/card";
import { UserContext } from "../../context/userContext";
import { useParams } from "react-router-dom";

export function PlayersHands({
  players,
  currentUser,
  currentColor,
  lastCard,
  turn,
  playableCard,
  setItems,
  one,
  oneOut,
}) {
  const { socket } = useContext(UserContext);
  const { roomId } = useParams();

  const handleOneClick = () => {
    one.setOne(true);
    console.log("ami");
  };

  const handleOneOutClick = () => {
    oneOut.setOneOut(false);
    socket.emit("OneOut", parseInt(roomId));
    console.log("ennemi");
  };
  /**
   * Une fonction qui génére des divs permettant la séparation de l'écran en 3 parties (en colonne), dont la partie du milieu sera divisé en 3 autres divs(en ligne).
   * Et pour chaque div, on affiche les mains des joueurs, la pioche la derniere carte joué et la carte actuelle.
   *
   * @return {JSX} - Retourne un composant React contenant notre affichage.
   */
  const Section = () => {
    const mains = Hands();
    console.log("ptn",oneOut)
    //console.log(mains);
    const { length } = mains.otherPlayers;
    const playUser = players.find((player) => player.username === currentUser);
    const userHand = playUser ? playUser.hand : [];
    return (
      <div className="flex-container">
        <div className="container_otherplayer">
          <div className="divlefttest divs">
            {length >= 2 && mains.otherPlayers[1]}
          </div>
          <div className="divmidtest divs">
            <div className="divtoptest divs">
              {length >= 1 && mains.otherPlayers[0]}
            </div>
            <div className="divbottomtest divs">
              <div className="draw" onClick={handleDrawClick}>
                {<BackCard className="drawcard" key={0} />}
              </div>
              <div className="containerMid">
                <button
                  className="one Out"
                  onClick={handleOneOutClick}
                  disabled={!oneOut.oneOut}
                >
                  ONE OUT
                </button>
                <div className={`color ${currentColor}`} />
                <button
                  className="one"
                  onClick={handleOneClick}
                  disabled={!(userHand.length === 2)}
                >
                  ONE
                </button>
              </div>
              <div className="lastcard">
                {
                  <Card
                    key={99}
                    valeur={lastCard}
                    val={99}
                    setItems={setItems}
                    players={players}
                    one={one.one}
                  />
                }
              </div>
            </div>
          </div>
          <div className="divrighttest divs">
            {length >= 3 && mains.otherPlayers[2]}
          </div>
        </div>
        <div className="container_player">{mains.userHand}</div>
      </div>
    );
  };

  /**
   * Une fonction qui génère une liste contenant les mains pour chaque joueur sous forme de composants React.
   * Sera utilisée dans le const Section pour simplifié la lisibilité du code.
   *
   * @return {array} Liste de composant React de la main de chaque joueur.
   */
  const Hands = () => {
    //console.log(players);
    const listhands = [];
    const hands = {
      userHand: [],
      otherPlayers: listhands,
    };
    let i = 1;
    players.map(
      (player) => (
        //console.log(player.hand),
        //console.log(player.username, currentUser    ),
        player.username === currentUser
          ? (hands.userHand = (
              <React.Fragment>
                <p
                  className={`playerName ${0}p ${
                    turn !== currentUser ? "cantPlay" : ""
                  }`}
                >
                  {currentUser}
                </p>
                <hr
                  className={`linePlayer ${0}p ${
                    turn !== currentUser ? "cantPlayl" : ""
                  }`}
                />
                <div
                  key={i}
                  className={`hand_0 ${
                    turn !== currentUser ? "cannotPlay" : ""
                  }`}
                >
                  {player.hand.map((carte, j) => (
                    <Card
                      key={j}
                      valeur={carte}
                      playableCard={playableCard}
                      setItems={setItems}
                      players={players}
                      one={one.one}
                    />
                  ))}
                </div>
              </React.Fragment>
            ))
          : (listhands.push(
              <React.Fragment>
                <div key={i} className={`hand_${i}`}>
                  {player.hand.map((_, j) => (
                    <BackCard key={j} joueur={i} />
                  ))}
                </div>
                <hr
                  className={`linePlayer ${i}p ${
                    turn !== player.username ? "cantPlayl" : ""
                  }`}
                />
                <p
                  className={`playerName ${i}p ${
                    turn !== player.username ? "cantPlay" : ""
                  }`}
                >
                  {player.username}
                </p>
              </React.Fragment>
            ),
            (i += 1))
      )
    );
    return hands;
  };
  const handleDrawClick = () => {
    if (currentUser === turn) {
      socket.emit("drawCards", { roomId: roomId });
    }
  };

  // Retourne un composant contenant l'appel de la const Section.
  return (
    <>
      <Section />
    </>
  );
}
