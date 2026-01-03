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

// GET: Public - Fetch Monthly Goal & Transactions
export async function GET(req: NextRequest) {
    try {
        // 1. Get Monthly Goal
        const goalConfig = await prisma.systemConfig.findUnique({
            where: { key: 'monthly_goal' }
        });
        const monthlyGoal = goalConfig ? parseInt(goalConfig.value) : 200000; // Default 200k

        // 2. Get Donations/Transactions
        const donations = await prisma.donation.findMany({
            orderBy: { date: 'desc' }
        });

        return NextResponse.json({
            monthlyGoal,
            transactions: donations
        });
    } catch (error) {
        console.error("Failed to fetch finance data", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// POST: Admin Only - Add Transaction
export async function POST(req: NextRequest) {
    if (!await isAdmin(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { date, type, amount, description, proof } = body;

        const donation = await prisma.donation.create({
            data: {
                date: new Date(date),
                type,
                amount: parseInt(amount),
                description,
                proof
            }
        });

        return NextResponse.json(donation);
    } catch (error) {
        console.error("Failed to create transaction", error);
        return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 });
    }
}

// PUT: Admin Only - Update Monthly Goal
export async function PUT(req: NextRequest) {
    if (!await isAdmin(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { monthlyGoal } = body;

        const config = await prisma.systemConfig.upsert({
            where: { key: 'monthly_goal' },
            update: { value: monthlyGoal.toString() },
            create: { key: 'monthly_goal', value: monthlyGoal.toString(), description: 'Monthly Donation Goal' }
        });

        return NextResponse.json(config);
    } catch (error) {
        console.error("Failed to update goal", error);
        return NextResponse.json({ error: "Failed to update goal" }, { status: 500 });
    }
}
