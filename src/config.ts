import z from "zod";

export const config = z
  .object({
    VITE_SERVICE_TYPE: z.enum(["mock", "web"]).default("web"),
    VITE_API_BASE_URL: z.string().default("http://localhost:3000/api"),
    VITE_DEMO_ACCOUNT_EMAIL: z.string(),
    VITE_DEMO_ACCOUNT_PASSWORD: z.string(),
  })
  .parse(import.meta.env);
