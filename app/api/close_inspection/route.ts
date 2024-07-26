import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export const PATCH = async (req: Request) => {
    try {
        const { inspectionId, isClosed } = await req.json();


        await db.inspection.update({
            where: {
                id: inspectionId
            },
            data: {
                isClosed: Boolean(isClosed)
            }
        });

        return NextResponse.json({ message: 'Root cause added successfully' });
    } catch (error) {
        console.error('Error creating report:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}