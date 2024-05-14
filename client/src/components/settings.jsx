import React, { useContext, useState } from "react";
import "../styles/buttoncomponents.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { ButtonContext } from "../../context/buttonContext";
import bubble from "../assets/icones/bubble.png";
import music from "../assets/icones/music.png";
import Tchat from "./tchat";

function Settings() {
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const { socket, setSocket } = useContext(UserContext);
  const { inGame, setInGame, dontShow, setDontShow, inRoom, roomId } =
    useContext(ButtonContext);
  const [guide, setGuide] = useState(false);
  const { tchat, setTchat } = useContext(ButtonContext);
  const { isMusicPlayerVisible, setIsMusicPlayerVisible } =
    useContext(ButtonContext);

  const text = (
    <div className="textContainer">
      <p>
        <strong>Bienvenue sur ONE!</strong>
      </p>
      <p>
        ONE est un jeu de cartes où le but est d’être le premier joueur à se
        débarrasser de toutes ses cartes!
      </p>

      <p className="underline">Composition :</p>
      <ul>
        <li>
          <strong>108 cartes</strong> composées d’une couleur et d’une valeur
        </li>
        <li>
          <strong>4 couleurs</strong> : Rose, Violet, Vert, Bleu
        </li>
        <li>
          <strong>Valeurs</strong> :
          <ul>
            <li>
              <strong>10 chiffres</strong> : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
            </li>
            <li>
              <strong>6 spéciales</strong> : +2, +4, Changement de couleur,
              Interdit, Inversion
            </li>
          </ul>
        </li>
      </ul>

      <p className="underline">Explication des cartes spéciales :</p>
      <ul>
        <li>
          <strong>Interdit</strong> : Le joueur suivant doit passer son tour.
        </li>
        <li>
          <strong>Inversion</strong> : Inverse l’ordre de passage.
        </li>
        <li>
          <strong>Changement de couleur</strong> : Peut être joué sur n'importe
          quelle carte de n'importe quelle couleur, permettant au joueur de
          choisir la couleur suivante.
        </li>
        <li>
          <strong>+2</strong> : Le joueur suivant doit piocher deux cartes et
          passer son tour.
        </li>
        <li>
          <strong>+4</strong> : Le joueur suivant doit piocher quatre cartes,
          passer son tour et choisir la couleur suivante.
        </li>
      </ul>
      <p className="underline">Déroulement du jeu :</p>
      <p>
        Le jeu commence en distribuant 7 cartes à chaque joueur. Le reste des
        cartes forme la pioche, et la première carte est retournée face visible
        pour former la pile de défausse. Un joueur au hasard commence la partie
        en posant une carte qui correspond soit en couleur, soit en numéro à
        celle de la carte en haut de la pile de défausse. Si un joueur ne peut
        pas jouer de carte, il doit en piocher une dans la pioche. Le jeu
        continue jusqu'à ce qu'un joueur n'ait plus de cartes en main.
      </p>
      <p className="underline">Gagner la partie :</p>
      <p>
        Le premier joueur à se débarrasser de toutes ses cartes appuie sur “One”
        pour avertir les autres joueurs qu'il n'a plus qu'une carte en main. Si
        un joueur oublie d’appuyer sur “One”, et qu’un joueur appuie sur
        “Contre-One”, il doit piocher deux cartes. Une fois qu'un joueur a joué
        sa dernière carte, la manche est terminée et les autres joueurs comptent
        les points basés sur les cartes qu'ils ont encore en main. Une carte = 1
        point.
      </p>
      <p className="underline">Règles :</p>
      <ul>
        <li>
          Chaque <strong>même valeur</strong> peut se superposer sur la fausse.
        </li>
        <li>
          A chaque tour, hormis s'il y a obligation de passer le tour, le joueur
          a le <strong>choix</strong> de piocher ou de jouer.
        </li>
        <li>
          Si un joueur possède un <strong>doublon</strong> (ou plus) en main
          (même valeur ou même couleur) et que l’un d’eux peut se poser, il peut
          tous les sélectionner et les poser à condition de les choisir dans le
          bon ordre.
        </li>
        <li>
          Les +2 et les +4 sont <strong>superposables</strong> à condition
          d’avoir une valeur ou couleur commune.
        </li>
        <li>
          Lorsqu’un joueur n’a plus que 2 cartes, il doit appuyer sur{" "}
          <strong>“One”</strong>. Si il ne l’a pas fait et qu’un joueur appuie
          sur <strong>“Contre-One”</strong> dans les 3 secondes suivantes, il
          doit piocher 2 cartes.
        </li>
        <li>
          <strong>Interdiction</strong> de finir sur un +2 ou +4.
        </li>
      </ul>
      <p className="underline">Mode daltonien :</p>
      <p>
        Amis daltoniens, nous sommes conscients que les couleurs sont difficiles
        à discerner. C’est pour cette raison que vous remarquerez sur les
        cartes, des / en fonction de la couleur de la carte!
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
      {inRoom || !inGame ? null : (
        <div
          className="boxSettings"
          id="tchat"
          onClick={() => setTchat(!tchat)}
        >
          <img src={bubble} className="bubble" />
        </div>
      )}
      <div
        className="boxSettings"
        id="music"
        onClick={() => setIsMusicPlayerVisible(!isMusicPlayerVisible)}
      >
        <img src={music} className="music" />
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
