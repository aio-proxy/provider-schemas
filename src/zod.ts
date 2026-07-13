import type { ZodType } from "zod";
import { PROVIDER_OPTIONS_ZOD_SCHEMAS } from "./zod-module.js";

export { PROVIDER_OPTIONS_ZOD_SCHEMAS } from "./zod-module.js";

export const providerOptionsZodSchema = (packageName: string): ZodType | undefined =>
  PROVIDER_OPTIONS_ZOD_SCHEMAS[packageName];
