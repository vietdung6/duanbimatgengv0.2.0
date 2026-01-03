import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  username: z.string().min(3, "Username tối thiểu 3 ký tự").optional().nullable().or(z.literal("")),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
  displayName: z.string().max(50).optional().nullable().or(z.literal("")),
  role: z.enum(["fan", "staff", "admin"]).default("fan"),
  proof: z.string().optional().nullable().or(z.literal("")),
  points: z.number().int().min(0).default(0),
});

export const createInviteSchema = z.object({
  role: z.enum(["fan", "staff"]).default("fan"),
  expiresAt: z.string().optional().nullable().or(z.literal("")), // ISO date string
});

export const createHistorySchema = z.object({
  userId: z.number().int().positive("User ID không hợp lệ"),
  type: z.enum(["point", "admin", "notification"]),
  title: z.string().min(1, "Tiêu đề không được để trống"),
  description: z.string().min(1, "Nội dung không được để trống"),
  pointsChange: z.number().int().default(0),
});

const lineupPlayerSchema = z.object({
  role: z.string(),
  player: z.string(),
  note: z.string().optional(),
});

export const createMatchSchema = z.object({
  opponent_name: z.string().min(1, "Tên đối thủ không được để trống"),
  opponent_logo: z.string().optional().nullable().or(z.literal("")),
  match_date: z.string().or(z.date()), // Accepts ISO string or Date
  timezone: z.string().default("KST"),
  tournament: z.string().min(1, "Tên giải đấu không được để trống"),
  stage: z.string().optional().nullable(),
  round_name: z.string().optional().nullable(),
  match_type: z.string().optional().nullable(),
  match_status: z.enum(["scheduled", "finished"]).default("scheduled"),
  score_gen: z.number().int().min(0).default(0),
  score_opp: z.number().int().min(0).default(0),
  match_result: z.enum(["win", "loss", "draw"]).optional().nullable().or(z.literal("")),
  is_featured: z.boolean().optional().default(false),
  mvp: z.string().optional().nullable().or(z.literal("")),
  vod_url: z.string().optional().nullable().or(z.literal("")),
  patch: z.string().optional().nullable().or(z.literal("")),
  lineup: z.array(lineupPlayerSchema).optional().nullable(),
  roster: z.array(z.string()).optional().nullable(),
  games: z.array(z.object({
    result: z.enum(["win", "loss"]),
    side: z.enum(["Blue", "Red", "blue", "red"]).transform(v => v.toLowerCase() as "blue" | "red"),
    patch: z.string().optional().nullable()
  })).optional().nullable(),
});

export const updateMatchSchema = createMatchSchema.partial();
