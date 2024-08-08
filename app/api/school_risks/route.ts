import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
    const { schoolId, risks } = await req.json();

    if (!schoolId || !risks) {
        return NextResponse.json({ message: 'Missing required fields or no risks provided.' }, { status: 400 });
    }

    try {
        const basicHazards = await db.question.findMany({
            where: {
                question: 'اساسي'
            },
            include: {
                answers: true
            }
        });

        const allQuestionAnswers = [
            ...risks,
            ...basicHazards.map(hazard => ({
                questionId: hazard.id,
                response: 'basic'
            }))
        ];

        const riskCreations = allQuestionAnswers.map((risk) => {
            return db.userResponse.create({
                data: {
                    school: { connect: { id: schoolId } },
                    question: { connect: { id: risk.questionId } },
                    response: risk.response
                },
            });
        });

        const results = await db.$transaction(riskCreations);
        return NextResponse.json(results);
    } catch (error) {
        console.error('Error creating school risks:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const schoolId = req.nextUrl.searchParams.get('school_id');

        if (!schoolId) {
            return NextResponse.json({ message: 'Missing required school_id parameter.' }, { status: 400 });
        }

        const responses = await db.userResponse.findMany({
            where: {
                schoolId,
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
                            },
                        },
                    },
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

        const allQuestionAnswers = await getAllQuestionAnswers(schoolId);

        return NextResponse.json({ risks: processedResponses, allQuestionAnswers });
    } catch (error) {
        console.error('Error getting user responses:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

async function getAllQuestionAnswers(schoolId: string) {
    const allQuestions = await db.userResponse.findMany({
        orderBy: {
            question: {
                orderd: 'asc'
            }
        },
        where: {
            schoolId,
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


export async function PATCH(req: NextRequest) {
    const { schoolId, risks } = await req.json();

    if (!schoolId || !risks) {
        return NextResponse.json({ message: 'Missing required fields or no risks provided.' }, { status: 400 });
    }

    try {
        const basicHazards = await db.question.findMany({
            where: {
                question: 'اساسي'
            },
            include: {
                answers: {
                    include: {
                        controlMeasures: true
                    }
                }
            }
        });

        const allRisks = [
            ...risks.map((risk: any) => ({
                ...risk,
                response: 'yes'
            })),
            ...basicHazards.map(hazard => ({
                questionId: hazard.id,
                response: 'basic'
            }))
        ];

        await db.schoolControlMeasure.deleteMany({
            where: {
                risk: {
                    schoolId,
                }
            }
        });

        await db.schoolRisks.deleteMany({
            where: {
                schoolId,
            }
        });

        const riskCreations = allRisks.map((risk) => {
            return db.userResponse.create({
                data: {
                    school: { connect: { id: schoolId } },
                    question: { connect: { id: risk.questionId } },
                    response: risk.response
                },
            });
        });

        const results = await db.$transaction(riskCreations);
        return NextResponse.json(results);
    } catch (error) {
        console.error('Error replacing school risks:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
