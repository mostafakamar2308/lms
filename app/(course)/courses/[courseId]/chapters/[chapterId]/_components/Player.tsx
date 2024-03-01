import { Fullscreen, Loader2, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ElapsedTimeTracker from "./ElapsedTimeTracker";
import { cn } from "@/lib/utils";
import { convertHMS } from "@/lib/format";
import { useRouter } from "next/navigation";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import toast from "react-hot-toast";
import axios from "axios";

interface Props {
  src: string;
  muted?: boolean;
  autoPlay?: boolean;
  onEnd: () => void;
}
function Player({ src, muted, onEnd }: Props) {
  const [durationSec, setDurationSec] = useState(1);
  const [elapsedSec, setElapsedSec] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const router = useRouter();
  const confetti = useConfettiStore();

  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const bufferRef = useRef<HTMLDivElement>(null);

  const handlePlaying = () => {
    console.log(videoRef.current?.currentTime);
    if (!isPlaying) {
      videoRef.current?.play();
      setIsPlaying(true);
    } else {
      videoRef.current?.pause();
      setIsPlaying(false);
    }
  };
  function openFullscreen() {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        /* Safari */
        videoRef.current.webkitRequestFullscreen();
      } else if (videoRef.current.msRequestFullscreen) {
        /* IE11 */
        videoRef.current.msRequestFullscreen();
      }
    }
  }

  useEffect(() => {
    if (!videoRef.current) {
      return;
    }
    const element = videoRef.current;
    const onWaiting = () => {
      if (isPlaying) setIsPlaying(false);
      setIsWaiting(true);
    };

    const onPlay = () => {
      if (isWaiting) setIsWaiting(false);
      setIsPlaying(true);
    };

    const onPause = () => {
      setIsPlaying(false);
      setIsWaiting(false);
    };
    const preventRightClick = (e: Event) => {
      if (!element) return;
      e.preventDefault();
      return false;
    };
    const onProgress = () => {
      if (!element.buffered || !bufferRef.current) return;
      if (!element.buffered.length) return;
      const bufferedEnd = element.buffered.end(element.buffered.length - 1);
      const duration = element.duration;
      if (bufferRef && duration > 0) {
        bufferRef.current.style.width = (bufferedEnd / duration) * 100 + "%";
      }
    };

    const onTimeUpdate = () => {
      setIsWaiting(false);
      if (!element.buffered || !progressRef.current) return;
      const duration = element.duration;
      setDurationSec(duration);
      setElapsedSec(element.currentTime);
      if (progressRef && duration > 0) {
        progressRef.current.style.width =
          (element.currentTime / duration) * 100 + "%";
      }
    };

    element.addEventListener("progress", onProgress);
    element.addEventListener("timeupdate", onTimeUpdate);
    element.addEventListener("contextmenu", preventRightClick);
    element.addEventListener("waiting", onWaiting);
    element.addEventListener("play", onPlay);
    element.addEventListener("playing", onPlay);
    element.addEventListener("pause", onPause);
    element.addEventListener("ended", onEnd);

    return () => {
      element.removeEventListener("waiting", onWaiting);
      element.removeEventListener("play", onPlay);
      element.removeEventListener("playing", onPlay);
      element.removeEventListener("pause", onPause);
      element.removeEventListener("progress", onProgress);
      element.removeEventListener("timeupdate", onTimeUpdate);
      element.removeEventListener("contextmenu", preventRightClick);
      element.removeEventListener("ended", onEnd);
    };
  }, [videoRef.current]);
  return (
    <div className="flex relative justify-center items-center rounded-md overflow-hidden cursor-pointer">
      <video
        onClick={handlePlaying}
        className="shrink aspect-video object-cover rounded-md"
        src={src}
        disablePictureInPicture
        controlsList="nodownload noplaybackrate"
        controls={false}
        onEnded={() => setIsPlaying(false)}
        muted={muted}
        ref={videoRef}
      ></video>
      <button
        onClick={openFullscreen}
        className={cn("absolute top-2 right-2", !isPlaying && "hidden")}
      >
        <Fullscreen className="w-6 h-6 text-white" />
      </button>
      <div className="absolute inset-1/2  z-100">
        {!isPlaying && (
          <Play
            onClick={handlePlaying}
            className="w-12 hover:bg-slate-500 -translate-y-1/2 -translate-x-1/2 z-100 h-12 bg-slate-800 rounded-full p-2 text-white"
          />
        )}
      </div>
      <div
        className={cn(
          "absolute bottom-0 w-full group px-4 py-2 flex gap-4 items-center",
          !isPlaying && "hidden"
        )}
      >
        <div onClick={handlePlaying} className="">
          <Pause className="w-6 h-6 text-white" />
        </div>
        <div className="w-full h-[5px] transition duration-500 group-hover:h-[8px] bg-slate-800 rounded-md">
          <div className="relative flex w-full h-full">
            <div
              className="h-full rounded-md flex bg-[#0caadc] z-10"
              ref={progressRef}
            ></div>
            <div
              className="flex rounded-md absolute h-full #FDFFFC"
              ref={bufferRef}
            ></div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-white">
          <ElapsedTimeTracker elapsedSec={elapsedSec} totalSec={durationSec} />/
          <div className="flex items-center">
            <p className=" text-white">{Math.floor(durationSec / 60)}:</p>
            <p className=" text-white">{Math.floor(durationSec % 60)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Player;
