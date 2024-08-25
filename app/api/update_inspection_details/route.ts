import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request) {
    try {
        const { noteId, requirementId, inspectionId } = await req.json();

        await db.inspection.update({
            where: { id: inspectionId },
            data: { requirementId, noteId },
        });

        return NextResponse.json({ message: 'Inspection details updated successfully' });
    } catch (error) {
        console.error('Error updating inspection details:', error);
        return NextResponse.json({ error: 'Internal Server Error' });
    }
}
