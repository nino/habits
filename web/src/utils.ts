import dayjs from "dayjs";
import { z } from "zod";

export const zodDateTime = () =>
  z
    .string()
    .datetime()
    .transform((val) => dayjs(val));
