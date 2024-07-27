"use client";

import { useState } from "react";

import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { ReplayPlayerWrapper } from "./_components/ReplayPlayerWrapper";

interface VideoPlayerProps {
  chapterId: string;
  videoUrl: string;
  courseId: string;
  nextChapterId?: string;
  playbackId?: string;
  isLocked: boolean;
  examId: string | null;
}
function VideoPlayer({
  videoUrl,
  chapterId,
  examId,
  courseId,
  nextChapterId,
  isLocked,
}: VideoPlayerProps) {
  const router = useRouter();
  const confetti = useConfettiStore();

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
          <ReplayPlayerWrapper
            src={`/api/courses/${courseId}/chapters/${chapterId}/watch`}
            onEnd={onVideoEnd}
          />
        )}
        {/* {!isLocked && (
          <video
            width={650}
            controls
            autoPlay
            // onEnd={onVideoEnd}
          >
            <source
              src={`/api/courses/${courseId}/chapters/${chapterId}/watch`}
              type="video/mp4"
            />
          </video>
        )} */}
      </div>
    </>
  );
}

export default VideoPlayer;
