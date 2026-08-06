import { z } from "zod";

export const envSchema = z.object({
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  ENVIRONMENT: z.enum(["development", "staging", "production"]).default("development"),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(env: Record<string, unknown>): Env {
  const result = envSchema.safeParse(env);
  if (!result.success) {
    console.error("❌ Invalid environment variables:", result.error.format());
    throw new Error("Invalid environment variables");
  }
  return result.data;
}
