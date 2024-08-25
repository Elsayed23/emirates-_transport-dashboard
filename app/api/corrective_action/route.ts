// pages/api/corrective_action.ts

import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request) {
    try {
        const { inspectionId, correctiveAction } = await req.json();

        await db.inspection.update({
            where: {
                id: inspectionId,
            },
            data: {
                correctiveAction,
            },
        });

        return NextResponse.json({ message: 'Corrective action updated successfully' });
    } catch (error) {
        console.error('Error updating corrective action:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
