import { clerkClient } from "@clerk/nextjs/server";
import Image from "next/image";
import * as timeago from "timeago.js";

interface CommentProps {
  userId: string;
  createdAt: Date;
  content: string;
}
async function Comment({ userId, content, createdAt }: CommentProps) {
  const user = await clerkClient().users.getUser(userId);
  return (
    <div className="grid grid-cols-[5%,95%] gap-2 mt-3">
      <div>
        <Image
          src={user.imageUrl}
          alt={user.fullName || "User Image"}
          width={60}
          className="aspect-square rounded-full overflow-hidden"
          height={60}
        />
      </div>

      <div className="flex flex-col justify-center">
        <span className="font-semibold">{user.fullName}</span>
        <span className="text-sm text-gray-700 text-right" dir="ltr">
          {timeago.format(createdAt, "ar_EG")}
        </span>
        <p className="text-lg text-slate-900 mt-2 w-full">{content}</p>
      </div>
    </div>
  );
}

export default Comment;
