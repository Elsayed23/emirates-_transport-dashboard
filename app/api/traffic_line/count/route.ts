import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(req: NextRequest) {

    try {
        // const schoolId = await req.nextUrl.searchParams.get('schoolId')
        const stationId = await req.nextUrl.searchParams.get('stationId')
        const isForSchoolCount: any = await req.nextUrl.searchParams.get('is_school_count')



        const countOfTrafficLineAndStudents = await db.trafficLine.findMany({
            where: {
                stationId: Number(stationId),
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