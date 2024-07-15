import { getUserId } from "@/lib/utils";

async function TeacherLayout({ children }: { children: React.ReactNode }) {
  const userId = await getUserId();

  return <>{children}</>;
}

export default TeacherLayout;
