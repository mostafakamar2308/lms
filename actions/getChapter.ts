import { db } from "@/lib/db";
import { Attachemnt, Chapter } from "@prisma/client";
interface GetChapterProps {
  userId: string;
  courseId: string;
  chapterId: string;
}

export const getChapter = async ({
  userId,
  chapterId,
  courseId,
}: GetChapterProps) => {
  try {
    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });
    const course = await db.course.findUnique({
      where: {
        isPublished: true,
        id: courseId,
      },
      select: {
        title: true,
        price: true,
        isGradual: true,
      },
    });
    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        isPublished: true,
      },
      include: {
        exam: true,
      },
    });
    if (!chapter || !course) {
      throw new Error("Chapter or Course not found");
    }

    let attachements: Attachemnt[] | null = null;
    let nextChapter: Chapter | null = null;
    let prevChapter: Chapter | null = null;

    if (purchase) {
      attachements = await db.attachemnt.findMany({
        where: {
          courseId,
        },
      });
    }
    if (chapter.isFree || purchase) {
      nextChapter = await db.chapter.findFirst({
        where: {
          courseId,
          isPublished: true,
          position: {
            gt: chapter?.position,
          },
        },
        orderBy: {
          position: "asc",
        },
      });
      prevChapter = await db.chapter.findFirst({
        where: {
          courseId,
          isPublished: true,
          position: {
            lt: chapter?.position,
          },
        },
        orderBy: {
          position: "asc",
        },
      });
    }
    const userProgress = await db.userProgress.findUnique({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },
    });
    return {
      chapter,
      course,
      attachements,
      userProgress,
      prevChapter,
      purchase,
      nextChapter,
    };
  } catch (error) {
    console.log("[GET_CHAPTER]", error);
    return {
      chapter: null,
      course: null,
      attachment: null,
      nextChapter: null,
      userPropress: null,
      purchase: null,
    };
  }
};
