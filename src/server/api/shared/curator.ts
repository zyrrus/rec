import { z } from "zod";

export const contentTypes = ["album", "track"] as const;
export type ContentType = (typeof contentTypes)[number];

export const listTemplateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  length: z.coerce.number().positive().max(50),
  contentType: z
    .set(z.enum(contentTypes))
    .min(1, "At least one option must be selected."),
});

export type ListTemplateSchema = z.infer<typeof listTemplateSchema>;
