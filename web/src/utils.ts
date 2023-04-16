import dayjs from "dayjs";
import { z } from "zod";

export const zodDateTime = () => z.string().transform((val) => dayjs(val));
