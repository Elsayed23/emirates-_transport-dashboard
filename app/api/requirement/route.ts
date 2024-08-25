import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        const { inspectionTypeId, requirement, notes } = await req.json();

        if (!inspectionTypeId || !requirement || !notes || !Array.isArray(notes)) {
            return NextResponse.json({ message: 'Missing required fields or notes format is incorrect.' }, { status: 400 });
        }

        const createdRequirement = await db.requirement.create({
            data: {
                requirement,
                inspectionType: {
                    connect: { id: inspectionTypeId }
                },
                notes: {
                    create: notes.map(note => ({
                        ar: note.ar,
                        en: note.en,
                        severity: note.severity,
                        noteClassification: note.noteClassification,
                        correctiveAction: {
                            create: note.correctiveAction?.map((action: any) => ({
                                ar: action.ar,
                                en: action.en,
                            })) || []
                        }
                    }))
                }
            },
            include: {
                notes: {
                    include: {
                        correctiveAction: true,
                    }
                },
            }
        });

        return NextResponse.json(createdRequirement, { status: 201 });

    } catch (error) {
        console.error('Error creating requirement:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
};
