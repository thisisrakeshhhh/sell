import { Context, Next } from "hono";
import { formatErrorResponse } from "./error";

export type Role = "Owner" | "Manager" | "Printing Staff" | "Delivery Staff" | "Support";

export function requireRole(allowedRoles: Role[]) {
  return async (c: Context, next: Next) => {
    const userRole = (c.req.header("X-User-Role") as Role) || "Owner";

    if (!allowedRoles.includes(userRole)) {
      return c.json(formatErrorResponse(`Access Denied - Requires one of roles: ${allowedRoles.join(", ")}`), 403);
    }

    await next();
  };
}
