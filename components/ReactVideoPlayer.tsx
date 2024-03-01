"use client";
import { useEffect, useState } from "react";
import { Player, ControlBar, BigPlayButton } from "video-react";

function ReactVideoPlayer({ url }: { url: string }) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return null;
  console.log(url);

  return (
    <Player url={url}>
      <BigPlayButton position="center" />
    </Player>
  );
}

export default ReactVideoPlayer;
