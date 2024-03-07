"use client";

import { cn } from "@/lib/utils";
import MuxPlayer from "@mux/mux-player-react";
import { Loader2, Lock } from "lucide-react";
import { useState } from "react";
import { TheosPlayer } from "@aka_theos/react-hls-player";
import Player from "./_components/Player";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useConfettiStore } from "@/hooks/use-confetti-store";

interface VideoPlayerProps {
  chapterId: string;
  videoUrl: string;
  title: string;
  courseId: string;
  nextChapterId?: string;
  playbackId?: string;
  isLocked: boolean;
  completeOnEnd: boolean;
}
function VideoPlayer({
  videoUrl,
  chapterId,
  title,
  courseId,
  nextChapterId,
  playbackId,
  isLocked,
  completeOnEnd,
}: VideoPlayerProps) {
  const router = useRouter();
  const confetti = useConfettiStore();
  const onVideoEnd = async () => {
    try {
      await axios.put(
        `/api/courses/${courseId}/chapters/${chapterId}/progress`,
        { isCompleted: true }
      );
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
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  return (
    <div className="relative aspect-video">
      {isLocked && (
        <div className=" absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
          <Lock className="h-8 w-8" />
          <p className="text-sm">This chapter is locked</p>
        </div>
      )}
      {!isLocked && (
        <Player
          onEnd={onVideoEnd}
          src={videoUrl}
          muted={false}
          autoPlay={false}
        />
      )}
    </div>
  );
}

export default VideoPlayer;
