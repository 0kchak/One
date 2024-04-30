import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/userContext";

const Tchat = ({ roomId }) => {
  const { socket, user } = useContext(UserContext);
  const username = user ? user.username : "";
  const [newMsg, setNewMsg] = useState("");
  const [messages, setMessages] = useState([]);

  /*
   *Un hook pour mettre à jours les messages stockées.
   */
  useEffect(() => {
    if (socket) {
      // Écoute l'événement "message"
      const handleMessage = (data) => {
        setMessages((prevMessages) => [...prevMessages, data]);
        console.log(data);
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
    console.log(socket, username)
    if (socket) {
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
    console.log("msg : ",messages);
    return messages.map((msg, index) => (
      <div key={index}>
        <strong>{msg.player}: </strong>
        {msg.message}
      </div>
    ));
  };

  return (
    <div>
      <input
        type="text"
        value={newMsg}
        onChange={(e) => setNewMsg(e.target.value)}
      />
      <button onClick={sendMessage}>Envoyer</button>
      <div>{renderMessages()}</div>
    </div>
  );
};


export const resetTchat = () => {
  setMessages([]);
}

export default Tchat;