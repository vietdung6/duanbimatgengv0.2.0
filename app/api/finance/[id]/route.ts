import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthTokenFromRequest, verifyAuthToken } from "@/lib/auth";

async function isAdmin(req: NextRequest) {
    const token = getAuthTokenFromRequest(req);
    if (!token) return false;

    const decoded = verifyAuthToken(token);
    if (!decoded || decoded.role !== 'admin') return false;

    return true;
}

// DELETE: Admin Only - Delete Transaction
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    if (!await isAdmin(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        await prisma.donation.delete({
            where: { id: parseInt(id) }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete transaction", error);
        return NextResponse.json({ error: "Failed to delete transaction" }, { status: 500 });
    }
}
