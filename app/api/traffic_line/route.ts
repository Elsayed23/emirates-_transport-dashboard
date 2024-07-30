import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';




export async function POST(req: Request) {

    const {
        name,
        schoolId,
        schoolName,
        stationId,
        stationName,
        educationalLevel,
        countOfStudents,
        transferredCategory
    } = await req.json();

    if (!name || !schoolId || !schoolName || !stationId || !stationName || !educationalLevel || !countOfStudents || !transferredCategory) {
        return NextResponse.json({ message: 'Invalid input' });
    }

    try {
        const trafficLine = await db.trafficLine.create({
            data: {
                name,
                schoolId,
                schoolName,
                stationId,
                stationName,
                educationalLevel,
                countOfStudents,
                transferredCategory,
            }
        });

        return NextResponse.json({ id: trafficLine.id });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal server error' });
    }
}


export async function GET(req: NextRequest) {
    try {

        const stationId = await req.nextUrl.searchParams.get('stationId')
        const schoolId = await req.nextUrl.searchParams.get('schoolId')


        const trafficLines = await db.trafficLine.findMany({
            orderBy: {
                createdAt: 'asc'
            },
            where: {
                stationId: Number(stationId),
                schoolId: Number(schoolId)

            },
            include: {
                risks: true,
            },
        });

        return NextResponse.json(trafficLines);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal server error' });
    }

}

export async function DELETE(req: NextRequest) {
    try {
        const trafficLineId = req.nextUrl.searchParams.get('trafficLine_id');

        if (!trafficLineId) {
            return NextResponse.json({ message: 'Traffic Line ID is required' }, { status: 400 });
        }

        // Delete the Traffic Line and cascade delete related records
        await db.trafficLine.delete({
            where: { id: trafficLineId },
            include: {
                risks: {
                    include: {
                        controlMeasures: true,
                    },
                },
            },
        });


        return NextResponse.json({ message: 'Traffic Line and related data deleted successfully' });
    } catch (error) {
        console.error('Error deleting Traffic Line:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
