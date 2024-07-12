import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';


async function addTrafficLine(data: {
    name: string;
    schoolId: number;
    schoolName: string;
    stationId: number;
    stationName: string;
    educationalLevel: string;
    countOfStudents: number;
    transferredCategory: string;
}) {
    return await db.trafficLine.create({
        data,
    });
}

export async function POST(req: Request) {

    const { name, schoolId, schoolName, stationId, stationName, educationalLevel, countOfStudents, transferredCategory } = await req.json();

    if (!name || !schoolId || !schoolName || !stationId || !stationName || !educationalLevel || !countOfStudents || !transferredCategory) {
        return NextResponse.json({ message: 'Invalid input' });
    }

    try {
        const trafficLine = await addTrafficLine({
            name,
            schoolId,
            schoolName,
            stationId,
            stationName,
            educationalLevel,
            countOfStudents,
            transferredCategory,
        });

        return NextResponse.json(trafficLine);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal server error' });
    }
}

async function getTrafficLinesBySchoolAndStation(stationId: number, schoolId: number) {
    return await db.trafficLine.findMany({
        where: {
            stationId,
            schoolId

        },
        include: {
            risks: true,
        },
    });
}

export async function GET(req: NextRequest) {
    try {

        const stationId = await req.nextUrl.searchParams.get('stationId')
        const schoolId = await req.nextUrl.searchParams.get('schoolId')


        const trafficLines = await getTrafficLinesBySchoolAndStation(Number(stationId), Number(schoolId));

        return NextResponse.json(trafficLines);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal server error' });
    }

}