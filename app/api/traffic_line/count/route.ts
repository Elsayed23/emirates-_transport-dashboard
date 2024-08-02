import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(req: NextRequest) {

    try {
        // const schoolId = await req.nextUrl.searchParams.get('schoolId')
        const stationId = await req.nextUrl.searchParams.get('stationId')
        const isForSchoolCount: any = await req.nextUrl.searchParams.get('is_school_count')

        if (!stationId) {
            return NextResponse.json({ message: 'Invalid station id' })
        }

        const countOfTrafficLineAndStudents = await db.trafficLine.findMany({
            where: {
                stationId,
                // schoolId: Number(schoolId)
            },
            select: {
                schoolId: true,
                countOfStudents: true
            }
        })
        return NextResponse.json({ count: countOfTrafficLineAndStudents })





    } catch (error) {

    }
}