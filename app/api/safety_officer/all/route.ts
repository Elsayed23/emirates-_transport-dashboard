import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
    try {



        const safetyOfficers = await db.user.findMany({
            where: {
                role: {
                    name: 'SAFETY_OFFICER'
                }
            },
            select: {
                id: true,
                name: true,
                email: true
            }
        })


        return NextResponse.json(safetyOfficers)

    } catch (error) {
        console.log("[job_titles]", error);
        return new NextResponse('Internal Error', { status: 500 })
    }
}