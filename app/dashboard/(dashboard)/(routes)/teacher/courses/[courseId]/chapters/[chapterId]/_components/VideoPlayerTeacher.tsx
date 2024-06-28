"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ReplayPlayerWrapper } from "@/app/dashboard/(course)/courses/[courseId]/(course-content)/chapters/[chapterId]/_components/ReplayPlayerWrapper";

interface VideoPlayerTeacherProps {
  ytUrl: { url: string; quality: string }[];
}
function VideoPlayerTeacher({ ytUrl }: VideoPlayerTeacherProps) {
  const router = useRouter();
  const [activeVideo, setActiveVideo] = useState(ytUrl[0]);

  return (
    <>
      <div className="relative aspect-video">
        <ReplayPlayerWrapper src={activeVideo.url} onEnd={() => {}} />
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

export default VideoPlayerTeacher;
