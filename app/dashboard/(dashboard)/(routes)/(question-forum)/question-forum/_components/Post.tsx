import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import LikeButton from "./LikeButton";
import * as timeago from "timeago.js";
import { db } from "@/lib/db";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { MessageSquareText } from "lucide-react";
type PostProps = {
  title: string;
  description: string;
  likes: number;
  comments: number;
  imageUrl: string | null;
  id: string;
  userId: string;
  createdAt: Date;
};
async function Post({
  title,
  imageUrl,
  likes,
  id,
  userId,
  createdAt,
  comments,
}: PostProps) {
  const { userId: currentUserId } = auth();
  if (!currentUserId) {
    redirect("/");
  }
  const isPostLiked = await db.like.findUnique({
    where: {
      userId_postId: {
        userId: currentUserId,
        postId: id,
      },
    },
  });
  const user = await clerkClient().users.getUser(userId);

  return (
    <div className="w-[90%]">
      <div className="group relative rounded-md ">
        <div className="flex p-3 gap-2 items-center">
          <Image
            className="overflow-hidden rounded-full"
            src={user.imageUrl}
            alt={user.fullName || ""}
            width={30}
            height={30}
          />
          <div>
            <p className="font-semibold text-gray-700">
              {user.fullName || `${user.firstName} ${user.lastName || ""}`}
            </p>
            <p className="text-right text-xs" dir="ltr">
              {timeago.format(createdAt, "ar_EG")}
            </p>
          </div>
        </div>
        <div className="group-hover:bg-[#eee] duration-300 rounded-lg top-0 absolute w-full h-full -z-20"></div>
        <Link
          href={`/dashboard/question-forum/${id}`}
          className="p-3 block rounded-md"
        >
          <h2 className="group-hover:underline text-2xl font-bold">{title}</h2>
          {imageUrl && (
            <div className="relative mt-3 overflow-hidden max-h-[400px] rounded-lg">
              <Image
                src={imageUrl}
                className="blur-xl -z-10 "
                alt={title}
                fill
              />
              <Image
                src={imageUrl}
                alt={title}
                className="object-contain  aspect-video w-full"
              />
            </div>
          )}
        </Link>
        <div className="flex gap-2 p-2">
          <LikeButton likes={likes} postId={id} isPostLiked={!!isPostLiked} />
          <Link href={`/dashboard/question-forum/${id}`}>
            <Button variant={"outline"}>
              <MessageSquareText className="w-5 h-5 ml-2" />
              {comments}
            </Button>{" "}
          </Link>
        </div>
      </div>
      <hr className="w-full border-slate-700 my-2" />
    </div>
  );
}

export default Post;
