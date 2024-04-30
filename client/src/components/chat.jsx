import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { resetTchat } from "./tchat";
import { UserContext } from "../../context/userContext";

const Chat = () => {
  // Recuperation de l'id de la room dans l'url si on utilise un lien partagé
  const navigate = useNavigate();
  const {user} = useContext(UserContext);
  const setSocketglobal = useContext(UserContext).setSocket;
  const existingSocket = useContext(UserContext).socket;

  // Différentes variables utilisées dans l'application, pour gérer l'état coté client.
  const [socket, setSocket] = useState(null);
  const [maxPlayer, setMaxPlayer] = useState(0);
  const [valRoom, setValRoom] = useState("");
  const [errorJoin, setErrorJoin] = useState("");

  useEffect (() => {
    // Déconnecter le socket existant lorsque le composant est monté
    return () => {
      if (existingSocket) {
        existingSocket.disconnect();
      }
    };
  }, []);

  /**
   * Définit le nouveau socket et s'authentifie avec Socket.IO.
   */
  const connectToSocketIO = () => {
    const newSocket = io("http://localhost:8000"); // Remplacez l'URL par celle de votre serveur
    setSocket(newSocket);
    authenticateWithSocketIO(newSocket);
  };

  /**
   * Envoi son nom d'utilisateur au serveur Socket.IO.
   *
   * @param {Object} socket - L'objet socket Socket.IO.
   * @param {string} username - Le nom d'utilisateur pour l'authentification.
   */
  const authenticateWithSocketIO = (socket) => {
    console.log("userrrrrrrr",user.username)
    socket.emit("authenticate", user.username);
    socket.on("authenticated", (data) => {
      //console.log(data);
    });
    setSocketglobal(socket);
  };

  /*
   * Plus utilisé mais sera implémenter pr le button déco
   * Fonction pour se désconnecter du serveur Socket.IO.
   */
  const disconnectFromSocketIO = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setSocketglobal(null);
    }
  };

  /**
   * Fonction pour se connecter au serveur Socket.Io, lorqu'on clique sur le bouton se connecter.
   */
  const handleConnectClick = () => {
    if (!socket) {
      connectToSocketIO();
    }
  };

  /**
   * actuellement plus utilisé
   * Fonction pour se déconnecter au serveur Socket.Io, lorqu'on clique sur le bouton se déconnecter.
   */
  const handleDisconnectClick = () => {
    if (socket) {
      disconnectFromSocketIO();
      setValRoom("");
      setMaxPlayer(0);
      resetTchat();
      setErrorJoin("");
    }
  };

  /**
   * Fonction pour creer une nouvelle room, avec un nombre limité de joueurs.
   */
  const createRoom = () => {
    if (maxPlayer <= 4 && socket) {
      socket.emit("createRoom", { maxPlayers: maxPlayer });
      socket.on("roomCreated", (data) => {
        //console.log("roomID: ", data);
        setValRoom(data.roomId);
        navigate(`/room/${data.roomId}?owner=${true}`);
      });
      setMaxPlayer(0);
    }
  };

  /**
   * Rejointe une room, tant que cette dernière existe et pas pleine.
   */
  const join = () => {
    if (socket) {
      //console.log("room: ", valRoom);
      socket.emit("joinRoom", { roomId: valRoom });
      socket.on("roomJoined", () => {
        setErrorJoin("");
        navigate(`/room/${valRoom}?owner=${false}`);
      });
      socket.on("error", (data) => {
        console.log("roomID: ", data);
        setErrorJoin(data);
      });
    }
  };

  return (
    <div className="App">
      <h1>Test de connexion avec Socket.IO</h1>
      {!socket && <button onClick={handleConnectClick}>Connecter</button>}
      {socket && (
        <div>
          <div>
            <input
              type="text"
              value={maxPlayer}
              onChange={(e) => setMaxPlayer(e.target.value)}
            />
            <button onClick={createRoom}>Create la room</button>
            <br />
            <input
              type="text"
              value={valRoom}
              onChange={(e) => setValRoom(e.target.value)}
            />
            <button onClick={join}>Join la room</button>
            <span>{errorJoin}</span>
          </div>
          <button onClick={handleDisconnectClick}>Déconnecter</button>
        </div>
      )}
    </div>
  );
};

export default Chat;
