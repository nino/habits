import { z } from "zod";
import { zodDateTime } from "./utils";

export const Entry = z.object({
  id: z.number(),
  name: z.string(),
  created_at: zodDateTime(),
});

export type Entry = z.infer<typeof Entry>;

