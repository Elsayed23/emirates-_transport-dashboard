import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const jsonData = await req.json();

        const { name, stationId, nameOfStation, nameOfSchool, InspectionSite, city, jobTitleOfTheEmployee, employeeName } = jsonData;

        const newReport = await db.report.create({
            data: {
                name,
                stationId: Number(stationId),
                nameOfStation,
                InspectionSite,
                city,
                nameOfSchool,
                jobTitleOfTheEmployee,
                employeeName,
            }
        });

        return NextResponse.json({ id: newReport.id });
    } catch (error) {
        console.error('Error creating report:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const reports = await db.report.findMany({
            include: {
                _count: true,
            }
        });

        return NextResponse.json(reports);
    } catch (error) {
        console.error('Error fetching reports:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
