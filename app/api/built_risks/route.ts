import { db } from "@/lib/db";
import {  NextResponse } from "next/server";

export async function POST(req: Request) {
    const { builtId, questionAnswers } = await req.json();

    if (!builtId || !questionAnswers) {
        return NextResponse.json({ message: 'Missing required fields or no question answers provided.' });
    }

    try {
        // Fetch all basic hazards from the database
        const basicHazards = await db.question.findMany({
            where: {
                question: 'اساسي',
                appliesTo: 'built'
            },
            include: {
                answers: true
            }
        });

        const allQuestionAnswers = [
            ...questionAnswers,
            ...basicHazards.map(hazard => ({
                questionId: hazard.id,
                response: 'basic'
            }))
        ];

        const responseCreations = allQuestionAnswers.map((qa) => {
            return db.userResponse.create({
                data: {
                    built: { connect: { id: builtId } },
                    question: {
                        connect: { id: qa.questionId },
                    },
                    response: qa.response,
                },
            });
        });

        const results = await db.$transaction(responseCreations);
        return NextResponse.json(results);
    } catch (error) {
        console.error('Error creating question answers:', error);
        return NextResponse.json({ message: 'Internal server error' });
    }
}
