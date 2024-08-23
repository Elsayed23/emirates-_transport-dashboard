import { db } from "@/lib/db";
import { NextResponse } from "next/server";


const targetOrderdIds = [1, 2, 5, 6];

function analyzeRisks(trafficLines: any[], targetQuestionIds: number[]): Record<string, number> {
    return trafficLines.reduce((analysis: Record<string, number>, line: any) => {
        const yesCount = line.risks.reduce((count: number, risk: any) => {
            return count + risk.question.userResponses.filter((qa: any) => targetQuestionIds.includes(qa.question.orderd) && qa.response === 'نعم').length;
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
                        risks: {
                            select: {
                                response: true,
                                question: {
                                    select: {
                                        orderd: true
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

        const riskAnalysis = school?.trafficLine?.map((line: any) => {
            const yesCount = line.risks.reduce((count: number, risk: any) => {
                return count + (targetOrderdIds.includes(risk.question.orderd) && risk.response === 'نعم' ? 1 : 0);
            }, 0);

            return {
                trafficLineId: line.id,
                yesCount
            };
        });
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