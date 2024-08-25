import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export const POST = async (req: Request, { params }: { params: { id: string } }) => {
    try {
        const { id } = params;
        const { ar, en, noteClassification, severity, correctiveAction } = await req.json();

        if (!ar || !en || !noteClassification) {
            return NextResponse.json({ message: 'Missing required fields' });
        }

        const note = await db.note.create({
            data: {
                ar,
                en,
                noteClassification,
                severity,
                requirement: {
                    connect: { id },
                },
                correctiveAction: {
                    create: correctiveAction.map((action: { ar: string, en: string }) => ({
                        ar: action.ar,
                        en: action.en,
                    })),
                },
            },
        });

        return NextResponse.json(note);
    } catch (error) {
        console.error('Error adding note:', error);
        return NextResponse.json({ message: 'Failed to add note' });
    }
};
