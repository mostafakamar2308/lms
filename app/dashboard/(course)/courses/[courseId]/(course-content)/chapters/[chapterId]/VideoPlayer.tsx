"use client";

import { cn } from "@/lib/utils";
import MuxPlayer from "@mux/mux-player-react";
import { Loader2, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { TheosPlayer } from "@aka_theos/react-hls-player";
import Player from "./_components/Player";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { ReplayPlayerWrapper } from "./_components/ReplayPlayerWrapper";
import { Button } from "@/components/ui/button";

interface VideoPlayerProps {
  chapterId: string;
  vidUrl: string;
  courseId: string;
  nextChapterId?: string;
  playbackId?: string;
  isLocked: boolean;
  examId: string | null;
}
function VideoPlayer({
  vidUrl,
  chapterId,
  examId,
  courseId,
  nextChapterId,
  isLocked,
}: VideoPlayerProps) {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [activeVideo, setActiveVideo] = useState(vidUrl);

  const onVideoEnd = async () => {
    try {
      await axios.put(
        `/api/courses/${courseId}/chapters/${chapterId}/progress`,
        { isCompleted: true }
      );
      if (examId) {
        router.push(`/dashboard/courses/${courseId}/exam/${examId}/`);
      } else {
        if (!nextChapterId) {
          confetti.onOpen();
        }
        toast.success("Video Ended");
        router.refresh();
        if (nextChapterId) {
          router.push(
            `/dashboard/courses/${courseId}/chapters/${nextChapterId}/`
          );
        }
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <div className="relative aspect-video">
        {!isLocked && (
          <ReplayPlayerWrapper src={activeVideo} onEnd={onVideoEnd} />
        )}
      </div>
      {/* <div className="mt-2 flex gap-4">
        {ytUrl.map((video, index) => (
          <Button key={index} onClick={() => setActiveVideo(ytUrl[index])}>
            {video.quality}
          </Button>
        ))}
      </div> */}
    </>
  );
}

export default VideoPlayer;
