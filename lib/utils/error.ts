import { ZodError } from "zod";

/**
 * Xử lý lỗi an toàn cho Server Actions và API Routes.
 * Log lỗi chi tiết ở server, nhưng chỉ trả về thông báo an toàn cho client.
 */
export function getSafeErrorMessage(error: unknown): string {
  // 1. Zod Validation Error (An toàn để hiển thị)
  if (error instanceof ZodError) {
    return error.issues[0]?.message || "Dữ liệu không hợp lệ";
  }

  // 2. Prisma/Database Error (Nguy hiểm - Cần che giấu)
  // Prisma errors thường có property 'clientVersion' hoặc 'code' (e.g. P2002)
  if ((error as any).clientVersion || (error as any).code) {
    // Log chi tiết để debug
    console.error("🛑 Database Error:", error);
    return "Lỗi hệ thống cơ sở dữ liệu. Vui lòng thử lại sau.";
  }

  // 3. Standard Error (Giả định là lỗi logic do developer throw)
  // Ví dụ: throw new Error("Unauthorized")
  if (error instanceof Error) {
    // Vẫn log để theo dõi
    console.error("⚠️ Application Error:", error.message);
    return error.message;
  }

  // 4. Unknown Error
  console.error("💥 Unknown Error:", error);
  return "Đã có lỗi không xác định xảy ra.";
}

export function handleActionError(error: unknown): { success: false; error: string } {
  return {
    success: false,
    error: getSafeErrorMessage(error),
  };
}
