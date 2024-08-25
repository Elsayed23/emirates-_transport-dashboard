import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {

        const appliesTo = req.nextUrl.searchParams.get('applies_to')

        if (appliesTo) {
            const questions = await db.question.findMany({
                where: {
                    appliesTo,
                    question: {
                        not: 'اساسي'
                    }
                },
                orderBy: {
                    orderd: 'asc',
                },
                include: {
                    answers: {
                        include: {
                            controlMeasures: true,
                        },
                    },
                },
            });

            return NextResponse.json(questions);
        } else {
            const questions = await db.question.findMany({
                orderBy: {
                    orderd: 'asc',
                },
                include: {
                    answers: {
                        include: {
                            controlMeasures: true,
                        },
                    },
                },
            });

            return NextResponse.json(questions);
        }


    } catch (error) {
        console.error('Error getting questions:', error);
        return NextResponse.json({ message: 'Internal server error' });
    }
}


export async function PATCH(req: Request) {
    const { questionId, question, orderd, translatedQuestion, answers, appliesTo } = await req.json();

    if (!question || !translatedQuestion || !answers || !appliesTo) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    try {
        const updatedQuestion = await db.question.upsert({
            where: { id: questionId || "" },
            update: {
                question,
                orderd,
                translatedQuestion,
                appliesTo,
                answers: {
                    deleteMany: {}, // To handle the scenario where answers might change
                    create: answers.map((answer: any) => ({
                        causeOfRisk: answer.causeOfRisk,
                        activity: answer.activity,
                        typeOfActivity: answer.typeOfActivity,
                        hazardSource: answer.hazardSource,
                        risk: answer.risk,
                        peopleExposedToRisk: answer.peopleExposedToRisk,
                        riskAssessment: answer.riskAssessment,
                        residualRisks: answer.residualRisks,
                        expectedInjury: answer.expectedInjury,
                        controlMeasures: {
                            create: answer.controlMeasures.map((measure: any) => ({
                                ar: measure.ar,
                                en: measure.en,
                            })),
                        },
                    })),
                },
            },
            create: {
                id: questionId,
                question,
                orderd,
                translatedQuestion,
                appliesTo,
                answers: {
                    create: answers.map((answer: any) => ({
                        causeOfRisk: answer.causeOfRisk,
                        activity: answer.activity,
                        typeOfActivity: answer.typeOfActivity,
                        hazardSource: answer.hazardSource,
                        risk: answer.risk,
                        peopleExposedToRisk: answer.peopleExposedToRisk,
                        riskAssessment: answer.riskAssessment,
                        residualRisks: answer.residualRisks,
                        expectedInjury: answer.expectedInjury,
                        controlMeasures: {
                            create: answer.controlMeasures.map((measure: any) => ({
                                ar: measure.ar,
                                en: measure.en,
                            })),
                        },
                    })),
                },
            },
        });

        return NextResponse.json({ message: 'Question and answers saved successfully', updatedQuestion });
    } catch (error) {
        console.error('Error creating or updating question and answers:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export const POST = async (req: Request) => {
    const { questions } = await req.json();

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
        return NextResponse.json({ message: 'Missing required fields or no questions provided' }, { status: 400 });
    }

    try {
        const createdQuestions = await db.$transaction(
            questions.map((questionData) => {
                const {
                    question,
                    orderd,
                    translatedQuestion,
                    appliesTo,
                    answerDetails,
                } = questionData;

                if (!question || !translatedQuestion || !answerDetails || !appliesTo) {
                    throw new Error('Missing required fields');
                }

                if (answerDetails.controlMeasures.ar.length !== answerDetails.controlMeasures.en.length) {
                    console.log(answerDetails.controlMeasures.en);

                }

                // Handle control measures
                const controlMeasures = answerDetails.controlMeasures.ar.map((measureAr: any, index: number) => {

                    return {
                        ar: measureAr,
                        en: answerDetails.controlMeasures.en[index],
                    }
                });

                return db.question.create({
                    data: {
                        question,
                        orderd,
                        translatedQuestion,
                        appliesTo,
                        answers: {
                            create: {
                                causeOfRisk: answerDetails.causeOfRisk,
                                activity: answerDetails.activity,
                                typeOfActivity: answerDetails.typeOfActivity,
                                hazardSource: answerDetails.hazardSource,
                                risk: answerDetails.risk,
                                peopleExposedToRisk: answerDetails.peopleExposedToRisk,
                                riskAssessment: answerDetails.riskAssessment,
                                residualRisks: answerDetails.residualRisks,
                                expectedInjury: answerDetails.expectedInjury,
                                controlMeasures: {
                                    create: controlMeasures,
                                },
                            },
                        },
                    },
                });
            })
        );

        return NextResponse.json({ message: 'Questions and answers saved successfully', createdQuestions });
    } catch (error) {
        console.error('Error creating questions and answers:', error);
        return NextResponse.json({ message: 'Internal server error', error: error }, { status: 500 });
    }
};
export async function DELETE(req: NextRequest) {
    const { id } = await req.json();

    if (!id) {
        return NextResponse.json({ message: 'Missing required field: id' }, { status: 400 });
    }

    try {
        await db.question.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Question deleted successfully' });
    } catch (error) {
        console.error('Error deleting question:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}