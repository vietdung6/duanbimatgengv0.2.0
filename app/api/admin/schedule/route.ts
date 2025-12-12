import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile } from "fs/promises";
import { join } from "path";

// Simple password protection (change this!)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "geng2025";

export async function GET() {
  try {
    const filePath = join(process.cwd(), "data", "schedule.json");
    const fileContents = await readFile(filePath, "utf8");
    const data = JSON.parse(fileContents);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error reading schedule:", error);
    return NextResponse.json(
      { error: "Failed to read schedule data" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Simple password check (in production, use proper auth)
    const { password, data } = await request.json();

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const filePath = join(process.cwd(), "data", "schedule.json");
    const updatedData = {
      ...data,
      _updated: new Date().toISOString().split("T")[0],
    };

    await writeFile(filePath, JSON.stringify(updatedData, null, 2), "utf8");

    return NextResponse.json({ success: true, message: "Schedule updated successfully" });
  } catch (error) {
    console.error("Error saving schedule:", error);
    return NextResponse.json(
      { error: "Failed to save schedule data" },
      { status: 500 }
    );
  }
}