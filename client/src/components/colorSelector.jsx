import React, { useContext } from "react";
import { memo } from "react";
import { UserContext } from "../../context/userContext";
const ColorSelector = ({ card, one}) => {
  const { socket } = useContext(UserContext);
  const handleClick = (color) => {
    console.log(color);
    console.log(card);
    socket.emit("playCard", { cardPlayed: card, color: color });
    if (one) {
      console.log("t'as pas clické");
      socket.emit("One", roomId);
    }
  };

  return (
    <div className="background">
      <div className="colorContainer">
        <div className="askColor">Select a color</div>
        <div className="colorSelector">
          <div
            className="part violet"
            style={{ borderRadius: "100% 0 0 0" }}
            onClick={() => handleClick("violet")}
          />
          <div
            className="part rose"
            style={{ borderRadius: "0 100% 0 0" }}
            onClick={() => handleClick("rose")}
          />
          <div
            className="part bleu"
            style={{ borderRadius: "0 0 0 100%" }}
            onClick={() => handleClick("bleu")}
          />
          <div
            className="part vert"
            style={{ borderRadius: "0 0 100% 0" }}
            onClick={() => handleClick("vert")}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(ColorSelector);
