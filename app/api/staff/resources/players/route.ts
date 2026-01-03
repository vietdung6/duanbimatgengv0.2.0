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
    const players = await prisma.player.findMany({
      orderBy: { ign: 'asc' }
    });
    return NextResponse.json(players);
  } catch (error: any) {
    return NextResponse.json({ 
      error: "Failed to fetch players",
      details: error.message 
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await checkAuth(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { ign, real_name, role, image_url, nationality, is_active, join_date } = await req.json();
    if (!ign || !role) return NextResponse.json({ error: "IGN and Role are required" }, { status: 400 });

    const player = await prisma.player.create({
      data: {
        ign,
        real_name,
        role,
        image_url,
        nationality,
        is_active: is_active ?? true,
        join_date: join_date ? new Date(join_date) : null
      }
    });

    return NextResponse.json(player);
  } catch (error: any) {
    console.error("Create player error:", error);
    return NextResponse.json({ 
        error: "Failed to create player", 
        details: error.message 
    }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await checkAuth(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id, ign, real_name, role, image_url, nationality, is_active, join_date } = await req.json();
    
    const player = await prisma.player.update({
      where: { id },
      data: {
        ign,
        real_name,
        role,
        image_url,
        nationality,
        is_active,
        join_date: join_date ? new Date(join_date) : null
      }
    });

    return NextResponse.json(player);
  } catch (error: any) {
    return NextResponse.json({ 
        error: "Failed to update player",
        details: error.message
    }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await checkAuth(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = parseInt(searchParams.get('id') || '');
    
    await prisma.player.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete player" }, { status: 500 });
  }
}
