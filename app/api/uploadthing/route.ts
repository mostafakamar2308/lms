import { createRouteHandler } from "uploadthing/next";

import { ourFileRouter } from "./core";

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    logLevel: "debug",
    uploadthingId: "q7ti7m4igy",
    uploadthingSecret:
      "sk_live_4f0492177665b65c6f2f34a641d826fd9f68375e49713faa41cfb1db01bd700a",
  },
});
