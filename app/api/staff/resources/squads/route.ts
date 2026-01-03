import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const squads = await prisma.squadPreset.findMany({
      orderBy: { created_at: "desc" },
    });
    return NextResponse.json(squads);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch squad presets" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, top, jungle, mid, ad, support, coach, sub } = await req.json();
    const squad = await prisma.squadPreset.create({
      data: {
        name,
        top,
        jungle,
        mid,
        ad,
        support,
        coach,
        sub,
      },
    });
    return NextResponse.json(squad);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create squad preset" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, name, top, jungle, mid, ad, support, coach, sub, is_active } = await req.json();
    const squad = await prisma.squadPreset.update({
      where: { id },
      data: {
        name,
        top,
        jungle,
        mid,
        ad,
        support,
        coach,
        sub,
        is_active,
        updated_at: new Date(),
      },
    });
    return NextResponse.json(squad);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update squad preset" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.squadPreset.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete squad preset" }, { status: 500 });
  }
}
