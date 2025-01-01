import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here.
   */
  server: {
    AUTH_SECRET: process.env.SKIP_ENV_VALIDATION
      ? z.string().optional()
      : z.string(),
    AUTH_DISCORD_ID: process.env.SKIP_ENV_VALIDATION
      ? z.string().optional()
      : z.string(),
    AUTH_DISCORD_SECRET: process.env.SKIP_ENV_VALIDATION
      ? z.string().optional()
      : z.string(),
    DATABASE_URL: process.env.SKIP_ENV_VALIDATION
      ? z.string().optional()
      : z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },

  /**
   * Specify your client-side environment variables schema here.
   * Prefix them with `NEXT_PUBLIC_` to expose them to the client.
   */
  client: {
    NEXT_PUBLIC_SAFE_KEY: z.string(),
  },

  /**
   * Manually destruct the runtime environment variables.
   */
  runtimeEnv: {
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_DISCORD_ID: process.env.AUTH_DISCORD_ID,
    AUTH_DISCORD_SECRET: process.env.AUTH_DISCORD_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_SAFE_KEY: process.env.NEXT_PUBLIC_SAFE_KEY,
  },

  /**
   * Skip validation when SKIP_ENV_VALIDATION is true.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,

  /**
   * Treat empty strings as undefined.
   */
  emptyStringAsUndefined: true,
});

