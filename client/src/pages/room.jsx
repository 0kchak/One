import { useLocation, useNavigate, useParams } from "react-router-dom";
import Tchat from "../components/tchat";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/userContext";
import { io } from "socket.io-client";
import "../styles/room.css";
import { ButtonContext } from "../../context/buttonContext";

const Room = () => {
  const navigate = useNavigate();

  const { socket, user, setSocket } = useContext(UserContext);
  const { setInGame, setDontShow, setInRoom, setRoomId } =
    useContext(ButtonContext);
  const username = user ? user.username : "";
  const { roomId } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const owner = searchParams.get("owner") === "true";

  const [showCountdown, setshowCountdown] = useState(false);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    setInGame(true);
    setInRoom(true);
    setDontShow(false);
    setPlayers({
      owner: { username: username, id: socket ? socket.id : "" },
      players: [{ username: username, id: socket ? socket.id : "" }],
    });
  }, []);

  useEffect(() => {
    setRoomId(roomId);
    if (username !== "" && !socket) {
      const socket = io("https://onegameserv-7349ada989e5.herokuapp.com");
      socket.emit("authenticate", user.username);
      setSocket(socket);
      socket.emit("joinRoom", { roomId });
      socket.on("roomJoined");
      socket.on("error", (data) => {
        alert(data);
        navigate("/dashboard");
      });
    }
  }, [username]);

  /*
   * Un hook pour chaque changment sur le socket affiche et recupère ses modifications.
   */
  useEffect(() => {
    if (socket) {
      const handleJoinRoom = (data) => {
        setPlayers(data);
        //console.log("playerJoined: ", data);
      };

      const handleStartGame = () => {
        setshowCountdown(true);
        setTimeout(() => {
          setshowCountdown(false);
          setInRoom(false);
          //navigate('/game') le lien de la page de la room
          navigate(`/game/${roomId}`);
        }, 5000);
      };

      const handleDisconnected = (data) => {
        setPlayers(data);
        console.log(`Player ${data} disconnected`);
      };

      socket.on("playerJoined", handleJoinRoom);
      socket.on("gameStarted", handleStartGame);
      socket.on("playerDisconnected", handleDisconnected);

      return () => {
        socket.off("playerJoined", handleJoinRoom);
        socket.off("gameStarted", handleStartGame);
        socket.off("playerDisconnected", handleDisconnected);
      };
    }
  }, [socket]);

  const startGame = () => {
    socket.emit("startGame", { roomId: roomId });
    socket.on("error", (data) => {
      console.log("error start: ", data);
    });
  };

  return (
    <div className="screen" id="RoomPage">
      <div className="screendashBlue" />
      <div className="screendashPink" />
      <div className="screenWhite" id="whiteRoom" />
      <div className="pageContent">
        <div className="right" id="rightRoom">
          <div className="blockRoom" id="blockPlayer">
            <h2 className="textCenterRoom" id="wait">
              Who are we waiting for?
            </h2>
            <div className="containerPlayerlist">
              {
                players &&
                  players.players &&
                  players.players.map((player, index) => (
                    <p className={`playerNameInList`} key={index}>{`#${
                      player.username
                    } ${
                      player.username === players.owner.username ? "👑" : ""
                    }`}</p>
                  ))
              }
            </div>
          </div>
        </div>
        <div className="left" id="leftRoom">
          <div className="blockRoom" id="blockRoom1">
            <h1 className="textCenterRoom">{`Room n°${roomId}`}</h1>
            <div className="containerRoom">
              {owner === false && <h2>Waiting for the start.</h2>}
              {showCountdown && <h1>Game Started</h1>}
              {owner == true && (
                <button className="button" id="start" onClick={startGame}>
                  Start Game
                </button>
              )}
            </div>
            <button className="button" onClick={() => {navigator.clipboard.writeText(`https://onegame.vercel.app/room/${roomId}`), alert("Link has been copied.")}}>
              Share Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Room;
