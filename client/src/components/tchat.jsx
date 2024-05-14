import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/userContext";
import "../styles/tchat.css";
import send from "../assets/icones/send.png";

const Tchat = ({ roomId , hidden }) => {
  const { socket, user } = useContext(UserContext);
  const username = user ? user.username : "";
  const [newMsg, setNewMsg] = useState("");
  const [messages, setMessages] = useState([]);

  /*
   *Un useEffect pour mettre à jours les messages stockées.
   */
  useEffect(() => {
    if (socket) {
      // Écoute l'événement "message"
      const handleMessage = (data) => {
        setMessages((prevMessages) => [...prevMessages, data]);
      };
      socket.on("message", handleMessage);

      // Empêche l'événement "message" de se réaliser deux fois.
      return () => {
        socket.off("message", handleMessage);
      };
    }
  }, [socket]);

  /**
   * Serait déplacer dans le nouveau fichier chat.jsx
   * Envoie le message du joueur au serveur avec et le numéro de la room et le nom d'utilisateur.
   */
  const sendMessage = () => {
    if (newMsg !== "" && socket) {
          socket.emit("message", {
            player: username,
            message: newMsg,
            room: parseInt(roomId),
          });
          setNewMsg("");
    }
  };

  /*
   * Serait décaler dans le nouveau fichier chat.jsx
   * Fonction pour afficher les messages.
   */
  const renderMessages = () => {
    let sameUser = "";
    return messages.map((msg, index) => {
      const msgliste = (
        <div
          className="message"
          id={username == msg.player ? "userMsg" : "otherMsg"}
          key={index}
        >
          {sameUser !== msg.player && (
            <p className="playerName" id="playerTchat">
              <strong>{msg.player}</strong>
            </p>
          )}
          <p
            className="playerMessage"
            id={username == msg.player ? "userMsg" : "otherPlayerMsg"}
          >
            {msg.message}
          </p>
        </div>
      );
      sameUser = msg.player;
      return msgliste;
    });
  };

  return (
    <div className="tchat"  style={{ visibility: hidden ? 'visible' : 'hidden' }}>
      <div className="allMsg">{renderMessages()}</div>
      <div className="inputContainerTchat">
        <textarea
          className="inputTchat"
          type="text"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
        />
        <div className="containerSend">
        <img src={send} className="buttonTchat" onClick={sendMessage} />
        </div>
      </div>
    </div>
  );
};

export const resetTchat = () => {
  setMessages([]);
};

export default Tchat;
