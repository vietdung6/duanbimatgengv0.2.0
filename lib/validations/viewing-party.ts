import { z } from "zod";

export const createSessionSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống"),
  stream_url: z.string().optional().or(z.literal("")),
  start_time: z.date().or(z.string().transform((str) => new Date(str))),
  type: z.enum(["online", "offline"]).default("online"),
  location: z.string().optional().or(z.literal("")),
  map_url: z.string().optional().or(z.literal("")),
});

export const updateSessionSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống"),
  streamUrl: z.string().optional().or(z.literal("")),
});

export const chatMessageSchema = z.object({
  content: z.string().trim().min(1, "Nội dung không được để trống").max(500, "Nội dung quá dài"),
});

export const chatSettingsSchema = z.object({
  isChatEnabled: z.boolean(),
  slowModeDuration: z.number().min(0),
});
