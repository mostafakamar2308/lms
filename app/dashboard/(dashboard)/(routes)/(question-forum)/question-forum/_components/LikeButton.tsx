"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

function LikeButton({
  isPostLiked,
  likes,
  postId: id,
}: {
  isPostLiked: boolean;
  postId: string;
  likes: number;
}) {
  const [isLiked, setIsLiked] = useState(isPostLiked);
  const router = useRouter();
  const toggleLikePost = async () => {
    setIsLiked((prev) => !prev);
    await axios.post(`/api/posts/${id}/likes`, {
      action: isLiked ? "decrement" : "increment",
    });
    router.refresh();
  };
  return (
    <Button
      variant={"outline"}
      onClick={toggleLikePost}
      className={`flex items-center`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill={isLiked ? "#dc2626" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`lucide lucide-thumbs-up ml-2 w-5 h-5 ${
          isLiked && "text-red-600"
        }`}
      >
        <path d="M7 10v12" />
        <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
      </svg>
      <div className="mt-1">{likes}</div>
    </Button>
  );
}

export default LikeButton;
