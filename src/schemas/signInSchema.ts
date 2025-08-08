import { z } from "zod";

export const signInSchema = z.object({
  identifier: z.string(), // identifier -> Username or Email
  password: z.string(),
});
