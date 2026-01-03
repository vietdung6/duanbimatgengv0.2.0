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
    const teams = await prisma.teamResource.findMany({
      orderBy: { name: 'asc' },
      include: {
        groups: true,
        regionRef: true
      }
    });
    return NextResponse.json(teams);
  } catch (error: any) {
    console.error("Teams GET Error:", error);
    return NextResponse.json({ 
      error: "Failed to fetch teams",
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

    const { name, logo_url, region, region_id, short_name } = await req.json();
    if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

    const team = await prisma.teamResource.create({
      data: { name, logo_url, region, region_id, short_name }
    });

    return NextResponse.json(team);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create team" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await checkAuth(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, name, logo_url, region, region_id, short_name } = await req.json();
    const team = await prisma.teamResource.update({
      where: { id },
      data: { name, logo_url, region, region_id, short_name }
    });

    return NextResponse.json(team);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update team" }, { status: 500 });
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
    
    await prisma.teamResource.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete team" }, { status: 500 });
  }
}
