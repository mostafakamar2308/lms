import { clerkClient } from "@clerk/nextjs/server";

// function getUniqueListBy<T>(arr: T[], key: string): T[] {
//   const map = new Map<string, T>();
//   for (const item of arr) {
//     map.set((item as any)[key], item);
//   }
//   return Array.from(map.values());
// }
export default async function limitSession(userId: string, sessionId: string) {
  const sessions = await clerkClient.sessions.getSessionList({ userId });
  const activeSessions = sessions.filter(
    (session) => session.status === "active"
  );
  //   const uniqueSessionsByClients = getUniqueListBy(activeSessions, "clientId");
  //   console.log(activeSessions.length);
  activeSessions.sort((a, b) => a.createdAt - b.createdAt);
  //ascending sort
  let isAllowed;
  if (activeSessions.length > 1) {
    activeSessions.slice(1).forEach(async (session) => {
      await clerkClient.sessions.revokeSession(session.id);
      //   console.log("revoked the session");
      //   console.log({ currentSession: session.id, sessionId });
      if (sessionId === session.id) {
        // console.log("this is the revoked session");
        isAllowed = false;
      } else {
        isAllowed = true;
      }
    });
  } else {
    isAllowed = true;
  }
  return isAllowed;
}
