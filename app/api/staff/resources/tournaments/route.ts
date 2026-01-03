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
    const tournaments = await prisma.tournamentResource.findMany({
      include: {
        opponent_group: true,
        type: true
      },
      orderBy: { created_at: 'desc' }
    });
    return NextResponse.json(tournaments);
  } catch (error: any) {
    console.error("Tournament GET Error:", error);
    return NextResponse.json({
      error: "Không thể tải danh sách giải đấu.",
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

    const { name, year, patch, type_id, is_official, is_current, opponent_group_id } = await req.json();
    if (!name) return NextResponse.json({ error: "Tên giải đấu là bắt buộc." }, { status: 400 });

    const tournament = await prisma.tournamentResource.create({
      data: {
        name,
        year: year ? Number(year) : new Date().getFullYear(),
        patch: patch || null,
        type_id: type_id ? Number(type_id) : null,
        is_official: is_official !== undefined ? !!is_official : true,
        is_current: !!is_current,
        opponent_group_id: opponent_group_id ? Number(opponent_group_id) : null
      },
      include: {
        opponent_group: true,
        type: true
      }
    });

    return NextResponse.json(tournament);
  } catch (error: any) {
    console.error("Tournament POST Error:", error);
    return NextResponse.json({
      error: "Không thể tạo giải đấu.",
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

    const { id, name, year, patch, type_id, is_official, is_current, opponent_group_id } = await req.json();

    if (!id) return NextResponse.json({ error: "Thiếu ID giải đấu để cập nhật." }, { status: 400 });

    const updateData: any = {
      name,
      patch: patch || null,
      is_official: is_official !== undefined ? !!is_official : true,
      is_current: !!is_current,
      opponent_group_id: opponent_group_id ? Number(opponent_group_id) : null
    };

    if (type_id !== undefined) {
      updateData.type_id = type_id ? Number(type_id) : null;
    }

    if (year !== undefined && year !== null) {
      updateData.year = Number(year);
    }

    const tournament = await prisma.tournamentResource.update({
      where: { id },
      data: updateData,
      include: {
        opponent_group: true,
        type: true
      }
    });

    return NextResponse.json(tournament);
  } catch (error: any) {
    console.error("Tournament PUT Error:", error);
    return NextResponse.json({
      error: "Không thể cập nhật giải đấu.",
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

    if (!id) return NextResponse.json({ error: "Thiếu ID giải đấu để xóa." }, { status: 400 });

    await prisma.tournamentResource.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Tournament DELETE Error:", error);
    return NextResponse.json({
      error: "Không thể xóa giải đấu.",
      details: error.message,
      code: error.code
    }, { status: 500 });
  }
}
