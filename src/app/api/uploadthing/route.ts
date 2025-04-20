import { createRouteHandler } from "uploadthing/next";

import { ourFileRouter } from "./core";

export const maxDuration = 55; // This function can run for a maximum of 5 seconds

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,

  // Apply an (optional) custom config:
  // config: { ... },
});
