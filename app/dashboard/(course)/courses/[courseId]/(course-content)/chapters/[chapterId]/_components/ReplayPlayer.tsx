"use client";
import toast from "react-hot-toast";
import { Replay } from "vimond-replay";
import "vimond-replay/index.css";
function ReplayPlayer({ src, onEnd }: { src: string; onEnd: () => void }) {
  return (
    <Replay
      onError={(e) => {
        toast.error("An error in video has happened");
      }}
      source={{ streamUrl: src }}
      initialPlaybackProps={{ isPaused: true }}
    />
  );
}

export default ReplayPlayer;
