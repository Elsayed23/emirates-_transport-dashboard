import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const rejectedReports = await db.report.findMany({
            where: {
                approved: false,
                rejectionReason: {
                    not: null,
                },
            },
            include: {
                user: true,
                inspections: true,
            },
        });

        return NextResponse.json(rejectedReports);
    } catch (error) {
        console.error('Error fetching rejected reports:', error);
        return NextResponse.json({ error: 'Internal Server Error' });
    }
}
