import { useLocation, useNavigate, useParams } from "react-router-dom";
import Tchat from "../components/tchat";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/userContext";
import { io } from "socket.io-client";

const Room = () => {
  const navigate = useNavigate();

  const { socket, user, setSocket } = useContext(UserContext);
  const username = user ? user.username : "";
  console.log("username: ", username);
  console.log("socket: ", socket);
  const { roomId } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const owner = searchParams.get("owner") === "true";
  console.log(owner);

  const [showCountdown, setshowCountdown] = useState(false);

  useEffect(() => {
    if (username !== "" && !socket) {
      const socket = io(process.env.SERV_TCHAT);
      socket.emit("authenticate", user.username);
      setSocket(socket);
      socket.emit("joinRoom", { roomId });
      socket.on("roomJoined");
      socket.on("error", (data) => {
        alert(data);
        navigate("/chat");
      });
      console.log(socket);
    }
  }, [username]);

  /*
   * Un hook pour chaque changment sur le socket affiche et recupère ses modifications.
   */
  useEffect(() => {
    if (socket) {
      const handleJoinRoom = (data) => {
        console.log("playerJoined: ", data);
      };

      const handleStartGame = () => {
        setshowCountdown(true);
        setTimeout(() => {
          setshowCountdown(false);
          //navigate('/game') le lien de la page de la room
          console.log("game started");
          navigate(`/game/${roomId}`);
        }, 5000);
      };

      const handleDisconnected = (data) => {
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
    <div>
      <h2>{`Room n°${roomId}`}</h2>
      {owner == true && <button onClick={startGame}>Start Game</button>}
      {showCountdown && <h1>Game Started</h1>}
      {<Tchat roomId={roomId} />}
    </div>
  );
};

export default Room;
