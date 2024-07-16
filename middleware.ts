import {
  clerkClient,
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    auth().protect();

    const { userId } = auth();
    if (!userId) {
      redirect(
        "http://localhost:3000/sign-in?redirect_url=http%3A%2F%2Flocalhost%3A3000%2Fdashboard"
      );
    }
    const { data: sessions } = await clerkClient().sessions.getSessionList({
      userId,
    });
    const newestSessionClientId = sessions[0].clientId;

    // Get all sessions that don't have the same clientId as the newest session
    const sessionsToRevoke = sessions.filter(
      (session) =>
        session.clientId !== newestSessionClientId &&
        session.status === "active"
    );
    sessionsToRevoke.forEach(async (session) => {
      await clerkClient().sessions.revokeSession(session.id);
    });
  }
});
const isPublicRoute = createRouteMatcher([
  "/",
  "/api/uploadthing",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
