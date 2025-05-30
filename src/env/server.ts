import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    CLERK_SECRET_KEY: z.string().min(1),
    CLERK_WEBHOOK_SIGNING_SECRET: z.string().min(1),
    UPLOADTHING_TOKEN: z.string().min(1),
    ADMIN_KEY: z.string().min(1),
  },
  experimental__runtimeEnv: process.env,
});
