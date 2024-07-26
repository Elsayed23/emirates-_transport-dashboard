import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const schoolId = req.nextUrl.searchParams.get('school_id');
        const stationId = req.nextUrl.searchParams.get('station_id');


        const count = await db.schoolRisks.count({
            where: {
                schoolId: Number(schoolId),
                stationId: Number(stationId)
            }
        });

        return NextResponse.json(count);

    } catch (error) {
        console.error('Error getting count of risks:', error);
        return NextResponse.json({ message: 'Internal server error' });
    }
}