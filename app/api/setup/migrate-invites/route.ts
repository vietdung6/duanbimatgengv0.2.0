import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Check if column exists by querying the information schema
    const columns: any[] = await prisma.$queryRaw`
      SHOW COLUMNS FROM invite_tokens LIKE 'role'
    `;

    if (columns.length > 0) {
      return NextResponse.json({ message: "Column 'role' already exists." });
    }

    // Add column
    await prisma.$executeRaw`
      ALTER TABLE invite_tokens ADD COLUMN role ENUM('fan', 'staff') NOT NULL DEFAULT 'fan' AFTER used_by_user_id
    `;

    return NextResponse.json({ success: true, message: "Added 'role' column to invite_tokens table." });
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
