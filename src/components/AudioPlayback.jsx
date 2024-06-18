import { useRef } from "react";

const AudioPlayback = () => {
  const audioRef = useRef(null);

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Error playing audio", error);
        alert("Audio playback failed. Please interact with the page to allow audio.");
      });
    }
  };

  return (
    <div>
      <audio ref={audioRef} src="/audio/aria.mp3"></audio>
      <button onClick={playAudio}>Play Audio</button>
    </div>
  );
};

export default AudioPlayback;
