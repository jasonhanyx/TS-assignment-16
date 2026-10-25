import { bootstrap } from "./app.controller.js";

bootstrap().catch((error: unknown) => {
  console.error("Failed to start app:", error);
  process.exit(1);
});
