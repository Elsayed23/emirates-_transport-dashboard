import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export const POST = async (req: Request) => {
    try {
        const { requirements } = await req.json();

        if (!requirements || !Array.isArray(requirements) || requirements.length === 0) {
            return NextResponse.json({ message: 'No requirements provided' });
        }

        const createdRequirements = await db.$transaction(
            requirements.map((requirement: any) =>
                db.requirement.create({
                    data: {
                        requirement: requirement.requirement,
                        inspectionType: {
                            connect: { id: requirement.inspectionTypeId },
                        },
                        notes: {
                            create: requirement.notes.map((note: any) => ({
                                ar: note.ar,
                                en: note.en,
                                noteClassification: note.noteClassification,
                                severity: note.severity,
                                correctiveAction: {
                                    create: note.correctiveAction.map((action: any) => ({
                                        ar: action.ar,
                                        en: action.en,
                                    })),
                                },
                            })),
                        },
                    },
                })
            )
        );

        return NextResponse.json({ createdRequirements });
    } catch (error) {
        console.error('Error creating requirements:', error);
        return NextResponse.json({ message: 'Failed to create requirements' });
    }
};
