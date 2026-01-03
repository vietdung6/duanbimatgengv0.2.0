import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthTokenFromRequest, verifyAuthToken, isStaff } from "@/lib/auth";

async function checkAuth(req: NextRequest) {
  const token = getAuthTokenFromRequest(req);
  if (!token) return null;
  const user = verifyAuthToken(token);
  if (!isStaff(user)) return null;
  return user;
}

export async function GET() {
  try {
    const types = await prisma.tournamentType.findMany({
      orderBy: { created_at: 'desc' }
    });
    return NextResponse.json(types);
  } catch (error: any) {
    console.error("Tournament Type GET Error:", error);
    return NextResponse.json({ 
      error: "Không thể tải danh sách loại giải đấu.",
      details: error.message,
      code: error.code
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await checkAuth(req);
    if (!user) {
      return NextResponse.json({ error: "Phiên làm việc hết hạn. Vui lòng đăng nhập lại." }, { status: 401 });
    }

    const { name, logo, category, description } = await req.json();
    if (!name) return NextResponse.json({ error: "Tên là bắt buộc." }, { status: 400 });

    const type = await prisma.tournamentType.create({
      data: {
        name,
        logo,
        category,
        description
      }
    });

    return NextResponse.json(type);
  } catch (error: any) {
    console.error("Tournament Type POST Error:", error);
    return NextResponse.json({ 
      error: "Không thể tạo loại giải đấu.",
      details: error.message,
      code: error.code
    }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await checkAuth(req);
    if (!user) {
      return NextResponse.json({ error: "Phiên làm việc hết hạn. Vui lòng đăng nhập lại." }, { status: 401 });
    }

    const { id, name, logo, category, description } = await req.json();
    
    if (!id) return NextResponse.json({ error: "Thiếu ID để cập nhật." }, { status: 400 });

    const type = await prisma.tournamentType.update({
      where: { id },
      data: {
        name,
        logo,
        category,
        description
      }
    });

    return NextResponse.json(type);
  } catch (error: any) {
    console.error("Tournament Type PUT Error:", error);
    return NextResponse.json({ 
      error: "Không thể cập nhật loại giải đấu.",
      details: error.message,
      code: error.code
    }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await checkAuth(req);
    if (!user) {
      return NextResponse.json({ error: "Phiên làm việc hết hạn. Vui lòng đăng nhập lại." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = parseInt(searchParams.get('id') || '');
    
    if (!id) return NextResponse.json({ error: "Thiếu ID để xóa." }, { status: 400 });

    await prisma.tournamentType.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Tournament Type DELETE Error:", error);
    return NextResponse.json({ 
      error: "Không thể xóa loại giải đấu.",
      details: error.message,
      code: error.code
    }, { status: 500 });
  }
}
