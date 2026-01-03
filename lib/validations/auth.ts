import { z } from "zod";

export const loginSchema = z.object({
  emailOrUsername: z
    .string()
    .min(1, "Vui lòng nhập email hoặc tên đăng nhập"),
  password: z
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  turnstileToken: z.string().optional(),
});

export const registerSchema = z.object({
  token: z.string().min(1, "Token không hợp lệ"),
  email: z
    .string()
    .email("Email không hợp lệ")
    .min(1, "Vui lòng nhập email"),
  username: z
    .string()
    .min(3, "Username phải có ít nhất 3 ký tự")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username chỉ được chứa chữ cái, số, gạch ngang và gạch dưới")
    .optional()
    .or(z.literal("")),
  password: z
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  displayName: z
    .string()
    .max(50, "Tên hiển thị không được quá 50 ký tự")
    .optional()
    .or(z.literal("")),
  turnstileToken: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
