import "../styles/dashboard.css";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { UserContext } from "../../context/userContext";
import axios from "axios";
import { ButtonContext } from "../../context/buttonContext";


function Dashboard() {
  // Recuperation de l'id de la room dans l'url si on utilise un lien partagé
  const navigate = useNavigate();
  const { socket, user, setSocket } = useContext(UserContext);
  const { setInGame, setDontShow, setInRoom, setTchat } = useContext(ButtonContext);
  const username = user ? user.username : "";
  const setSocketglobal = useContext(UserContext).setSocket;
  const existingSocket = useContext(UserContext).socket;
  console.log(user)

  // Différentes variables utilisées dans l'application, pour gérer l'état coté client.
  const [maxPlayer, setMaxPlayer] = useState(0);
  const [isChecked, setIsChecked] = useState(false);
  const [valRoom, setValRoom] = useState("");
  const [errorJoin, setErrorJoin] = useState("");

  useEffect(() => {
    setInGame(false);
    setDontShow(false);
    setInRoom(false);
    setTchat(true);
  
  }, []);

  useEffect(() => {
    if (username !== "") {
      const socket = io("https://onegameserv-7349ada989e5.herokuapp.com");
      socket.emit("authenticate", user.username);
      setSocketglobal(socket);
    } else { 
      console.log(username, "nom vide");
      console.log(user)
    }
  }, [username]);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked); // Inverse l'état de la case à cocher lorsqu'elle est cliquée
  };

  const createRoom = () => {
    console.log(socket)
    if (socket) {
      socket.emit("createRoom", { maxPlayers: maxPlayer, bot: isChecked });
      socket.on("roomCreated", (data) => {
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

  // Rendu
  return (
    <div className="screendash">
      <div className="screendashBlue" />
      <div className="screendashPink" />
      <div className="screendashWhite" />
      <div className="LeftPart1 Sidedash">
        <div className="CreateRoom">
          <h2 className="text-center-dash">Create Room</h2>
          <div className="choice-group">
            <p className="label">Number of players :</p>
            <div className="choicePlayer">
              <button className="buttonPlayer" id={maxPlayer == 2 ? "select" : ""} onClick={() => setMaxPlayer(2)}>2</button>
              <button className="buttonPlayer" id={maxPlayer == 3 ? "select" : ""} onClick={() => setMaxPlayer(3)}>3</button>
              <button className="buttonPlayer" id={maxPlayer == 4 ? "select" : ""} onClick={() => setMaxPlayer(4)}>4</button>
            </div>
          </div>
          <div className="bot-group">
            <p className="label">Fill with bots : </p>
            <input
              type="checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
              className="checkbox"
            />
          </div>
          <div className="containerJoin" onClick={createRoom}>
            <button className="buttonjoin" type="submit">
              Create Room
            </button>
          </div>
        </div>
      </div>
      <div className="RightPart1 Sidedash">
        <div className="CreateRoom">
          <h2 className="text-center-dash">Join Room</h2>
          <div className="input-groupdash">
            <p className="label">Room ID :</p>
            <input
              type="number"
              id="room"
              className="inputdash"
              placeholder="Enter your Room ID"
              onChange={(e) => setValRoom(parseInt(e.target.value))}
              />
          </div>
          <div className="containerJoin">
              <span id="dashError">{errorJoin}</span>
            <button className="buttonjoin" onClick={join}>
              Join Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export
export default Dashboard;
