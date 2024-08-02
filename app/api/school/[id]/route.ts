import { db } from "@/lib/db";
import { NextResponse } from "next/server";


const targetQuestionIds = [1, 2, 5, 6];
function analyzeRisks(trafficLines: any, targetQuestionIds: number[]): Record<string, number> {
    return trafficLines.reduce((analysis: any, line: any) => {
        const yesCount = line.risks.reduce((count: any, risk: any) => {
            return count + risk.questionAnswers.filter((qa: any) => targetQuestionIds.includes(qa.questionId) && qa.answer === 'نعم').length;
        }, 0);

        analysis[line.id] = yesCount;
        return analysis;
    }, {});
}


export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {

        const { id } = params

        // name, translationName, translationStationName
        const school = await db.school.findFirst({
            where: {
                id
            },
            include: {
                _count: true,
                trafficLine: {
                    orderBy: {
                        createdAt: 'asc'
                    },
                    include: {
                        user: {
                            select: {
                                name: true
                            }
                        },
                        risks: {
                            select: {
                                questionAnswers: {
                                    select: {
                                        questionId: true,
                                        answer: true
                                    }
                                }
                            }
                        }
                    }
                },
                station: {
                    select: {
                        translationName: true
                    }
                },
            },
        })

        const riskAnalysis = analyzeRisks(school?.trafficLine, targetQuestionIds);

        return NextResponse.json({ school, riskAnalysis })


    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

// import { db } from "@/lib/db";
// import { NextResponse } from "next/server";



// export async function GET(
//     req: Request,
//     { params }: { params: { id: string } }
// ) {
//     try {

//         const { id } = params

//         // name, translationName, translationStationName
//         const school = await db.school.findFirst({
//             where: {
//                 id
//             },
//             include: {
//                 _count: true,
//                 trafficLine: {
//                     orderBy: {
//                         createdAt: 'asc'
//                     },
//                     select: {
//                         risks: {
//                             select: {
//                                 questionAnswers: {
//                                    
//                                 }
//                             }
//                         },
//                         user: {
//                             select: {
//                                 name: true
//                             }
//                         }
//                     }
//                 },
//                 station: {
//                     select: {
//                         translationName: true
//                     }
//                 },
//             },
//         })

//         const riskAnalysis = analyzeRisks(school?.trafficLine, targetQuestionIds);


//         return NextResponse.json(school);


//     } catch (error) {
//         console.log(error);
//         return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
//     }
// }