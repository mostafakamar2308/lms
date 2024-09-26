import { db } from "@/lib/db";
import { auth, clerkClient } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";
import LikeButton from "../_components/LikeButton";
import { Button } from "@/components/ui/button";
import CommentSection from "./_components/CommentSection";
import { MessageSquareText } from "lucide-react";
import * as timeago from "timeago.js";

async function page({ params }: { params: { postId: string } }) {
  const { userId } = auth();
  if (!userId) {
    redirect("/");
  }
  const post = await db.post.findUnique({
    where: {
      id: params.postId,
    },
    include: {
      _count: {
        select: { likes: true, comments: true },
      },
    },
  });
  if (!post) {
    redirect("/");
  }
  const isPostLiked = await db.like.findUnique({
    where: {
      userId_postId: {
        userId,
        postId: params.postId,
      },
    },
  });
  const user = await clerkClient().users.getUser(post.userId);

  return (
    <div className="w-[80%] mx-auto p-6">
      <div className="flex gap-2 items-center">
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
          <span className="text-xs text-gray-700 text-right" dir="ltr">
            {timeago.format(post.createdAt, "ar_EG")}
          </span>
        </div>
      </div>
      <div className="group  rounded-md relative">
        <div className="p-3 block rounded-md">
          <h2 className=" text-2xl font-bold">{post.title}</h2>
          <p>{post.description}</p>
          {post.imageUrl && (
            <div className="relative mt-3 overflow-hidden max-h-[400px] rounded-lg">
              <Image
                src={post.imageUrl}
                className="blur-xl -z-10 "
                alt={post.title}
                fill
              />
              <Image
                src={post.imageUrl}
                alt={post.title}
                className="object-contain  aspect-video w-full"
              />
            </div>
          )}
        </div>
        <div className="flex gap-2 p-2">
          <LikeButton
            likes={post._count.likes}
            postId={post.id}
            isPostLiked={!!isPostLiked}
          />
          <Button variant={"outline"}>
            <MessageSquareText className="w-5 h-5 ml-2" />
            {post._count.comments}
          </Button>
        </div>
      </div>
      <hr />
      <CommentSection postId={post.id} />
    </div>
  );
}

export default page;
