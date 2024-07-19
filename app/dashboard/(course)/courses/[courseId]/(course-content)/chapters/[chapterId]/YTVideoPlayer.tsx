"use client";
import { useState } from "react";

import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { ReplayPlayerWrapper } from "./_components/ReplayPlayerWrapper";
import { Button } from "@/components/ui/button";

interface YTVideoPlayerProps {
  chapterId: string;
  ytUrl: { url: string; quality: string }[];
  courseId: string;
  nextChapterId?: string;
  playbackId?: string;
  isLocked: boolean;
  examId: string | null;
}
function YTVideoPlayer({
  ytUrl,
  chapterId,
  examId,
  courseId,
  nextChapterId,
  isLocked,
}: YTVideoPlayerProps) {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [activeVideo, setActiveVideo] = useState(ytUrl[0]);

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
          <ReplayPlayerWrapper src={activeVideo.url} onEnd={onVideoEnd} />
        )}
      </div>
      <div className="mt-2 flex gap-4">
        {ytUrl.map((video, index) => (
          <Button key={index} onClick={() => setActiveVideo(ytUrl[index])}>
            {video.quality}
          </Button>
        ))}
      </div>
    </>
  );
}

export default YTVideoPlayer;
