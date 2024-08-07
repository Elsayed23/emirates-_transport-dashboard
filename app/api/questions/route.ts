import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";


// export const POST = async (req: Request) => {
//     const { questions } = await req.json();

//     if (!questions || !Array.isArray(questions) || questions.length === 0) {
//         return NextResponse.json({ message: 'Missing required fields or no questions provided' }, { status: 400 });
//     }

//     try {
//         const createdQuestions = await db.$transaction(
//             questions.map((questionData) => {
//                 const {
//                     question,
//                     orderd,
//                     translatedQuestion,
//                     answerDetails,
//                 } = questionData;

//                 if (!question || !translatedQuestion || !answerDetails) {
//                     throw new Error('Missing required fields');
//                 }

//                 // Handle control measures
//                 const controlMeasures = answerDetails.controlMeasures.ar.map((measureAr: any, index: number) => ({
//                     ar: measureAr,
//                     en: answerDetails.controlMeasures.en[index],
//                 }));

//                 return db.question.create({
//                     data: {
//                         question,
//                         orderd,
//                         translatedQuestion,
//                         answers: {
//                             create: {
//                                 causeOfRisk: answerDetails.causeOfRisk,
//                                 activity: answerDetails.activity,
//                                 typeOfActivity: answerDetails.typeOfActivity,
//                                 hazardSource: answerDetails.hazardSource,
//                                 risk: answerDetails.risk,
//                                 peopleExposedToRisk: answerDetails.peopleExposedToRisk,
//                                 riskAssessment: answerDetails.riskAssessment,
//                                 residualRisks: answerDetails.residualRisks,
//                                 expectedInjury: answerDetails.expectedInjury,
//                                 controlMeasures: {
//                                     create: controlMeasures,
//                                 },
//                             },
//                         },
//                     },
//                 });
//             })
//         );

//         return NextResponse.json({ message: 'Questions and answers saved successfully', createdQuestions });
//     } catch (error) {
//         console.error('Error creating questions and answers:', error);
//         return NextResponse.json({ message: 'Internal server error', error: error }, { status: 500 });
//     }
// };

export async function GET() {
    try {

        const questions = await db.question.findMany({
            orderBy: {
                orderd: 'asc'
            },
            where: {
                question: {
                    not: 'اساسي'
                }
            },
            include: {
                answers: {
                    include: {
                        controlMeasures: true
                    }
                }
            }
        });

        return NextResponse.json(questions);
    } catch (error) {
        console.error('Error getting user responses:', error);
        return NextResponse.json({ message: 'Internal server error' });
    }
}
export async function PATCH(req: Request) {
    const { questionId, question, orderd, translatedQuestion, answers } = await req.json();

    if (!question || !translatedQuestion || !answers) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    try {
        const updatedQuestion = await db.question.upsert({
            where: { id: questionId || "" },
            update: {
                question,
                orderd,
                translatedQuestion,
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


// For create many 



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
                    answerDetails,
                } = questionData;

                if (!question || !translatedQuestion || !answerDetails) {
                    throw new Error('Missing required fields');
                }

                // Handle control measures
                const controlMeasures = answerDetails.controlMeasures.ar.map((measureAr: any, index: number) => ({
                    ar: measureAr,
                    en: answerDetails.controlMeasures.en[index],
                }));

                return db.question.create({
                    data: {
                        question,
                        orderd,
                        translatedQuestion,
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
