import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

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
export async function GET(req: NextRequest) {
    try {
        const builtId = req.nextUrl.searchParams.get('built_id');

        if (!builtId) {
            return NextResponse.json({ message: 'Missing required traffic_line_id parameter.' }, { status: 400 });
        }

        const responses = await db.userResponse.findMany({
            where: {
                builtId,
                response: {
                    in: ['نعم', 'basic']
                }
            },
            include: {
                question: {
                    include: {
                        answers: {
                            include: {
                                controlMeasures: true
                            }
                        }
                    }
                },
            },
            orderBy: {
                question: {
                    orderd: 'asc'
                }
            }
        });

        // Process responses to format data
        const processedResponses = responses.map(response => {
            const { question, ...rest } = response;
            return {
                ...rest,
                question: question.question,
                translatedQuestion: question.translatedQuestion,
                answers: question.answers.map(answer => ({
                    ...answer,
                    controlMeasures: answer.controlMeasures
                }))
            };
        });

        const allQuestionAnswers = await getAllQuestionAnswers(builtId);

        return NextResponse.json({ risks: processedResponses, allQuestionAnswers });
    } catch (error) {
        console.error('Error getting user responses:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

async function getAllQuestionAnswers(builtId: string) {
    const allQuestions = await db.userResponse.findMany({
        orderBy: {
            question: {
                orderd: 'asc'
            }
        },
        where: {
            builtId,
            NOT: {
                response: 'basic'
            }
        },
        select: {
            question: {
                select: {
                    question: true,
                    translatedQuestion: true
                }
            },
            response: true
        }
    });
    return allQuestions;
}