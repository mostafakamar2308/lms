import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/db";

import Comment from "./Comment";

import CommentCreator from "./CommentCreator";

async function CommentSection({ postId }: { postId: string }) {
  console.log(postId);

  const comments = await db.comment.findMany({
    where: {
      postId,
    },
  });

  return (
    <div className="mt-2">
      <CommentCreator postId={postId} />
      <div className="mt-2">
        {comments.map((comment) => (
          <Comment key={comment.id} {...comment} />
        ))}
      </div>
    </div>
  );
}

export default CommentSection;
