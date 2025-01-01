import { type Config } from "drizzle-kit";

import { env } from "~/env";

if (!env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  tablesFilter: ["to-eduvision_*"],
} satisfies Config;
