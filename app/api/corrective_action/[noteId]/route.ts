import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export const GET = async (req: Request, { params }: { params: { noteId: string } }) => {
    const { noteId } = params;
    try {
        const correctiveActions = await db.correctiveAction.findMany({
            where: {
                noteId: noteId as string,
            },
            select: {
                id: true,
                ar: true,
                en: true,
            },
        });

        return NextResponse.json(correctiveActions);
    } catch (error) {
        console.error('Error fetching corrective actions:', error);
        return NextResponse.json({ message: 'Failed to fetch corrective actions' });
    }

    return NextResponse.json({ message: 'Method not allowed' });
}
