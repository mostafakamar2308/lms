"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

function YtPlayer({ ytUrl }: { ytUrl: { url: string; quality: string }[] }) {
  const [activeVideo, setActiveVideo] = useState(ytUrl[0]);

  return (
    <>
      <video controls src={activeVideo.url}></video>
      <div className="mt-2 flex gap-4">
        {ytUrl.map((video, index) => (
          <Button key={index}>{video.quality}</Button>
        ))}
      </div>
    </>
  );
}

export default YtPlayer;
