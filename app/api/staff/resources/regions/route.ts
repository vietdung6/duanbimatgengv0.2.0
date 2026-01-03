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
    const regions = await prisma.region.findMany({
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(regions);
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch regions" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await checkAuth(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name } = await req.json();
    if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

    const region = await prisma.region.create({
      data: { name }
    });

    return NextResponse.json(region);
  } catch (error: any) {
    if (error.code === 'P2002') {
        return NextResponse.json({ error: "Region already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create region" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
    try {
      const user = await checkAuth(req);
      if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
      const { searchParams } = new URL(req.url);
      const id = parseInt(searchParams.get('id') || '');
      
      await prisma.region.delete({
        where: { id }
      });
  
      return NextResponse.json({ success: true });
    } catch (error) {
      return NextResponse.json({ error: "Failed to delete region" }, { status: 500 });
    }
}
