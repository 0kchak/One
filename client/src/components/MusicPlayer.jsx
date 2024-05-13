import React, { useState, useRef, useEffect, useContext } from "react";
//import io from 'socket.io-client';

import "../styles/MusicPlayer.css";
import { FaPlay, FaPause, FaStepForward, FaStepBackward } from "react-icons/fa";
import { PiRepeatBold } from "react-icons/pi";
import { PiRepeatOnceBold } from "react-icons/pi";
import { ButtonContext } from "../../context/buttonContext";
import audio from "../assets/icones/audio.png";

function MusicPlayer({ style, className }) {
  // rajout de props pour permettre à thanu de gérer la taille de la barre depuis le room.jsx
  const [tracks, setTracks] = useState([
    { name: "Threatenin' Zeppelin", src: "/audio/1)Threatenin_Zeppelin.mp3" },
    { name: "Undertale", src: "/audio/2)Undertale.mp3" },
    {
      name: "The promised neverland",
      src: "/audio/3)The_promised_neverland.mp3",
    },
    { name: "Lofi sad", src: "/audio/4)Lofi sad.mp3" },
  ]);

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0); // Index de la piste actuelle
  const [isPlaying, setIsPlaying] = useState(false); // État de lecture
  const [volume, setVolume] = useState(0.5); // Volume initial à 50%
  const [progress, setProgress] = useState(0); // Progression de la piste en cours
  const [duration, setDuration] = useState(0); // Durée de la piste en cours
  //const [pausedTime, setPausedTime] = useState(0);
  const [repeatMode, setRepeatMode] = useState(0);
  //const [isShuffling, setIsShuffling] = useState(false);
  const [timeMarker, setTimeMarker] = useState("00:00");
  const [hoverPosition, setHoverPosition] = useState(null); // Position en pourcentage pour le CSS
  const [hoverTime, setHoverTime] = useState(null);
  const audioRef = useRef(null); // Référence à l'élément audio HTML
  const { isMusicPlayerVisible } = useContext(ButtonContext);

  useEffect(() => {
    const audio = audioRef.current;
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };
    const handleTimeUpdate = () => {
      setProgress(audio.currentTime);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  // Lorsque l'audio est mis en pause, enregistrez la position de lecture actuelle
  // Met en pause la lecture et enregistre la position de lecture actuelle
  // Gère le bouton de lecture/pause directement sans état pausedTime
  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const playAudio = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        console.error("Erreur lors de la lecture :", err);
      }
    };

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      playAudio();
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    audio.src = tracks[currentTrackIndex]?.src || "";
    if (isPlaying) {
      audio
        .play()
        .catch((err) => console.error("Erreur lors de la lecture :", err));
    }
  }, [currentTrackIndex, tracks]); // Enlevez isPlaying des dépendances si cela cause des réinitialisations

  const changeTrack = (forward) => {
    let newIndex = currentTrackIndex + (forward ? 1 : -1);
    if (newIndex < 0) {
      newIndex = tracks.length - 1;
    } else if (newIndex >= tracks.length) newIndex = 0;
    setCurrentTrackIndex(newIndex);
    setIsPlaying(true); // Démarrer automatiquement la lecture de la nouvelle piste
  };

  const handleTrackEnd = () => {
    if (repeatMode === 1) {
      // Répétition de la piste actuelle
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else if (currentTrackIndex < tracks.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
    } else {
      setIsPlaying(false);
    }
  };

  const toggleRepeat = () => {
    setRepeatMode((prevMode) => (prevMode + 1) % 2); // Alterne entre 0 et 1
  };

  const handleTimeUpdate = () => {
    const {currentTime} = audioRef.current;
    setProgress(currentTime);
    setTimeMarker(formatTime(currentTime));
  };

  const handleVolumeChange = (event) => {
    const newVolume = event.target.value;
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };

  const handleProgressClick = (event) => {
    const audio = audioRef.current;
    if (!audio || !event) return;

    const progressBar = event.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const progressBarWidth = rect.width;

    if (progressBarWidth === 0) {
      console.error("La largeur de la barre de progression est nulle.");
      return;
    }

    const clickX = event.clientX - rect.left;
    if (clickX < 0 || clickX > progressBarWidth) {
      console.error("Position de clic hors limites:", clickX);
      return;
    }

    const clickPosition = clickX / progressBarWidth;
    const newTime = audio.duration * clickPosition;

    if (!isFinite(newTime)) {
      console.error("Le nouveau temps calculé n'est pas fini:", newTime);
      return;
    }

    audio.currentTime = newTime;

    // (Optionnel) Si la musique était en pause, démarrez la lecture
    if (!isPlaying) {
      setIsPlaying(true);
      audio
        .play()
        .catch((err) =>
          console.error("Erreur lors de la reprise de la lecture :", err)
        );
    }
  };

  const handleMouseMove = (event) => {
    const progressBar = event.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const x = event.clientX - rect.left; // x position within the element.
    const width = rect.width;
    const clickPosition = x / width;
    const newTime = audioRef.current.duration * clickPosition;

    setHoverPosition(clickPosition * 100);
    setHoverTime(formatTime(newTime));
  };

  const handleMouseLeave = () => {
    setHoverPosition(null);
    setHoverTime(null);
  };

  // Fonction d'assistance pour formater le temps en minutes:secondes
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <React.Fragment>
      <audio
        ref={audioRef}
        onEnded={handleTrackEnd}
        onTimeUpdate={handleTimeUpdate}
      />
      {isMusicPlayerVisible && (
        <div className={`audioPlayer ${className || ""}`} style={style}>
          <div className="trackInfo">{tracks[currentTrackIndex].name}</div>
          <div
            className="progressContainer"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={handleProgressClick}
          >
            <div
              className="progressBar"
              style={{ width: `${(progress / duration) * 100}%` }}
            ></div>
            {hoverPosition !== null && (
              <div
                className="hoverMarker"
                style={{ left: `${hoverPosition}%` }}
              ></div>
            )}
            {hoverTime && (
              <div
                className="hoverTimeLabel"
                style={{ left: `${hoverPosition}%` }}
              >
                {hoverTime}
              </div>
            )}
          </div>
          <div className="progressTime">
            <span>
              {Math.floor(progress / 60)}:
              {Math.floor(progress % 60)
                .toString()
                .padStart(2, "0")}
            </span>
            <span>
              {Math.floor(duration / 60)}:
              {Math.floor(duration % 60)
                .toString()
                .padStart(2, "0")}
            </span>
          </div>
          <div className="volumeControls">
            <img src={audio} className="audioMusic"/>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="volumeSlider"
            />
          </div>
          <div className="controlsWrapper">
            <button
              onClick={toggleRepeat}
              className={`controlButton ${repeatMode !== 1 ? "active" : ""}`}
            >
              {repeatMode === 1 ? (
                <PiRepeatOnceBold style={{ fontSize: "22px" }} />
              ) : (
                <PiRepeatBold style={{ fontSize: "22px" }} />
              )}
            </button>
            <button
              onClick={() => changeTrack(false)}
              className="controlButton"
            >
              <FaStepBackward style={{ fontSize: "18px" }} />
            </button>
            <button onClick={togglePlayPause} className="controlButton">
              {isPlaying ? (
                <FaPause style={{ fontSize: "15px" }} />
              ) : (
                <FaPlay style={{ fontSize: "15px" }} />
              )}
            </button>
            <button onClick={() => changeTrack(true)} className="controlButton">
              <FaStepForward style={{ fontSize: "18px" }} />
            </button>
            <div className="nomDuJeu">ONE</div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

export default MusicPlayer;
