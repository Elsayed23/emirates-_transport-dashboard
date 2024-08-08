import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const schoolId = req.nextUrl.searchParams.get('school_id');

        if (!schoolId) {
            return NextResponse.json({ message: 'Missing required fields.' });
        }

        const count = await db.userResponse.count({
            where: {
                schoolId,
            }
        });

        return NextResponse.json(count);

    } catch (error) {
        console.error('Error getting count of risks:', error);
        return NextResponse.json({ message: 'Internal server error' });
    }
}