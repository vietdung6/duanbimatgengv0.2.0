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
    const groups = await prisma.opponentGroup.findMany({
      include: {
        members: {
          include: {
            team: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(groups);
  } catch (error: any) {
    console.error("Groups GET Error:", error);
    return NextResponse.json({ 
      error: "Failed to fetch groups",
      details: error.message,
      code: error.code
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await checkAuth(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, teamIds } = await req.json();
    if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

    const group = await prisma.opponentGroup.create({
      data: {
        name,
        members: {
          create: (teamIds || []).map((id: number) => ({
            team: { connect: { id } }
          }))
        }
      },
      include: {
        members: {
          include: {
            team: true
          }
        }
      }
    });

    return NextResponse.json(group);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create group" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await checkAuth(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, name, teamIds } = await req.json();
    
    // Delete existing members first
    await prisma.opponentGroupMember.deleteMany({
      where: { group_id: id }
    });

    const group = await prisma.opponentGroup.update({
      where: { id },
      data: {
        name,
        members: {
          create: (teamIds || []).map((id: number) => ({
            team: { connect: { id } }
          }))
        }
      },
      include: {
        members: {
          include: {
            team: true
          }
        }
      }
    });

    return NextResponse.json(group);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update group" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await checkAuth(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = parseInt(searchParams.get('id') || '');
    
    await prisma.opponentGroup.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete group" }, { status: 500 });
  }
}
