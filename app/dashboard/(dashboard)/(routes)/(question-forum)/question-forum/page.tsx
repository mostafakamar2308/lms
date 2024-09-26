import { db } from "@/lib/db";
import Categories from "./_components/Categories";
import Post from "./_components/Post";
import PostCreator from "./_components/PostCreatorForm";
import Leaderboard from "./_components/Leaderboard";
import { Separator } from "@/components/ui/separator";

async function page({
  searchParams,
}: {
  searchParams: { categoryId?: string };
}) {
  const questionCategories = await db.postCategory.findMany();

  const posts = await db.post.findMany({
    where: {
      postCategoryId: searchParams.categoryId || {},
    },
    include: {
      _count: {
        select: { likes: true, comments: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-6 px-3 grid gap-2 grid-cols-[75%,1%,24%]">
      <div>
        <PostCreator postCategories={questionCategories} />
        <hr />
        <div className="mt-2 grid gap-2 ">
          <Categories items={questionCategories} />
          <div className="mt-2 grid  place-items-center">
            {posts.map((post) => (
              <Post
                {...post}
                key={post.id}
                comments={post._count.comments}
                likes={post._count.likes}
              />
            ))}
          </div>
        </div>
      </div>
      <Separator orientation="vertical" />
      <div>
        <Leaderboard />
      </div>
    </div>
  );
}

export default page;
