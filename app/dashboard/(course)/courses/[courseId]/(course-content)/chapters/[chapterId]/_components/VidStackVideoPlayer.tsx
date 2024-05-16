import "@vidstack/react/player/styles/base.css";
import { MediaPlayer, MediaProvider } from "@vidstack/react";

function VidStackVideoPlayer({ src }: { src: string }) {
  return (
    <MediaPlayer playsInline src="youtube/_cMxraX_5RE">
      <MediaProvider />
    </MediaPlayer>
  );
}

export default VidStackVideoPlayer;
