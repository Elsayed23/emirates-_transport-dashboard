import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params

        const responses = await db.userResponse.findMany({
            where: {
                builtId: id,
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

        const allQuestionAnswers = await getAllQuestionAnswers(id);

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