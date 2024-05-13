import React, { useContext, useState } from "react";
import "../styles/buttoncomponents.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { ButtonContext } from "../../context/buttonContext";
import bubble from "../assets/icones/bubble.png"
import music from "../assets/icones/music.png"
import Tchat from "./tchat";

function Settings() {
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const { socket, setSocket } =
  useContext(UserContext);
  const { inGame, setInGame, dontShow, setDontShow, inRoom, roomId } = useContext(ButtonContext);
  const [guide, setGuide] = useState(false);
  const {tchat, setTchat} = useContext(ButtonContext);
  const {isMusicPlayerVisible, setIsMusicPlayerVisible} = useContext(ButtonContext);

  const text = (
    <div className="textContainer">
      <p>Bienvenue sur ONE!</p>
      <p>
        ONE est un jeu de cartes où le but est d’être le premier joueur à se
        débarrasser de toutes ses cartes!
      </p>

      <p>
        <strong>Composition :</strong>
      </p>
      <ul>
        <li>108 cartes composées d’une couleur et d’une valeur</li>
        <li>4 couleurs : Rose, Violet, Vert, Bleu</li>
        <li>
          Valeurs : 10 chiffres (0 à 9) et 6 spéciales : +2, +4, Changement de
          couleur, Interdit, Inversion
        </li>
      </ul>

      <p>
        <strong>Explication des cartes spéciales :</strong>
      </p>
      <ul>
        <li>Interdit : Le joueur suivant doit passer son tour.</li>
        <li>Inversion : Inverse l’ordre de passage.</li>
        <li>
          Changement de couleur : Peut être joué sur n'importe quelle carte de
          n'importe quelle couleur, permettant au joueur de choisir la couleur
          suivante.
        </li>
        <li>
          +2 : Le joueur suivant doit piocher deux cartes et passer son tour.
        </li>
        <li>
          +4 : Le joueur suivant doit piocher quatre cartes, passer son tour et
          choisir la couleur suivante.
        </li>
      </ul>
      <p>
        <strong>Règles :</strong>
      </p>
      <ul>
        <li>Chaque même valeur peut se superposer sur la fausse.</li>
        <li>
          A chaque tour, hormis s'il y a obligation de passer le tour, le joueur
          a le choix de piocher ou de jouer.
        </li>
      </ul>

      <p>
        <strong>Mode daltonien :</strong>
      </p>
      <ul>
        <li>/ : Violet</li>
        <li>// : Rose</li>
        <li>/// : Bleu</li>
        <li>//// : Vert</li>
      </ul>

      <p>Bon jeu à tous!</p>
    </div>
  );

  const handleClickLeave = () => {
    if (socket) {
      socket.disconnect();
    }
    setSocket(null);
    setInGame(false);
    setShowSettings(false);
    navigate("/dashboard");
  };

  const handleClickDisconnect = async () => {
    if (socket) {
      socket.disconnect();
    }
    setSocket(null);
    await axios.post("/disconnect");
    setShowSettings(false);
    setDontShow(true);
    navigate("/");
  };

  return dontShow ? null : (
    <React.Fragment>
      <div
        className="boxSettings"
        onClick={() => setShowSettings(!showSettings)}
      >
        <hr className="lineSettings" />
        <hr className="lineSettings" />
        <hr className="lineSettings" />
      </div>
      {(inRoom || !inGame) ? null : <div
        className="boxSettings" id="tchat"
        onClick={() => setTchat(!tchat)}
      >
        <img src={bubble} className="bubble"/>
      </div> }
      <div
        className="boxSettings" id="music"
        onClick={() => setIsMusicPlayerVisible(!isMusicPlayerVisible)}
      >
        <img src={music} className="music"/>
      </div>
      {showSettings ? (
        <div className="containerSettings">
          <div className="box">
            <div
              className="close"
              onClick={() => {
                setShowSettings(!showSettings);
                setGuide(false);
              }}
            />
            {guide ? (
              <div className="menuList">
                <div className="containerArrow">
                  <div className="scrollArrow">↕</div>
                </div>
                {text}
              </div>
            ) : (
              <div className="menuList">
                <button
                  className="itemMenu"
                  id="guide"
                  onClick={() => setGuide(!guide)}
                >
                  French Guide
                </button>
                <button
                  className="itemMenu"
                  id="leave"
                  onClick={() => {
                    inGame ? handleClickLeave() : handleClickDisconnect();
                  }}
                >
                  {inGame ? "Leave" : "Disconnect"}
                </button>
              </div>
            )}
          </div>
        </div>
      ) : null}
      {inGame && <Tchat roomId={roomId} hidden={tchat} />}
    </React.Fragment>
  );
}

export default Settings;
