import { Hono } from "hono";
import { formatSuccessResponse } from "../middleware/error";

export const healthRouter = new Hono();

healthRouter.get("/", (c) => {
  return c.json(
    formatSuccessResponse(
      {
        status: "ok",
        database: "connected",
        storage: "connected",
        version: "1.3",
      },
      "JerseyFlow Worker API Operational"
    )
  );
});
