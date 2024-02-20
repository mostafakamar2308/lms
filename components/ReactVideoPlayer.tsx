"use client";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";

function ReactVideoPlayer({ url }: { url: string }) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return;
  console.log(url);

  return <ReactPlayer src={url} />;
}

export default ReactVideoPlayer;
