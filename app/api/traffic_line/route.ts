import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

interface QuestionAnswer {
    questionId: number;
    answer: string;
}
interface Risk {
    questionAnswers: QuestionAnswer[];
}

interface TrafficLine {
    id: string;
    risks: Risk[];
}

const targetQuestionIds = [1, 2, 5, 6];
function analyzeRisks(trafficLines: TrafficLine[], targetQuestionIds: number[]): Record<string, number> {
    return trafficLines.reduce((analysis: Record<string, number>, line: TrafficLine) => {
        const yesCount = line.risks.reduce((count, risk) => {
            return count + risk.questionAnswers.filter(qa => targetQuestionIds.includes(qa.questionId) && qa.answer === 'نعم').length;
        }, 0);

        analysis[line.id] = yesCount;
        return analysis;
    }, {});
}

export async function GET(req: NextRequest) {
    try {

        const stationId = await req.nextUrl.searchParams.get('stationId')
        const schoolId = await req.nextUrl.searchParams.get('schoolId')


        const trafficLines: TrafficLine[] = await db.trafficLine.findMany({
            orderBy: {
                createdAt: 'asc'
            },
            where: {
                stationId: Number(stationId),
                schoolId: Number(schoolId)
            },
            include: {
                risks: {
                    select: {
                        questionAnswers: {
                            select: {
                                questionId: true,
                                answer: true
                            }
                        }
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });


        const riskAnalysis = analyzeRisks(trafficLines, targetQuestionIds);

        return NextResponse.json({ trafficLines, riskAnalysis });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal server error' });
    }

}



export async function POST(req: Request) {

    const {
        userId,
        name,
        schoolId,
        schoolName,
        stationId,
        stationName,
        educationalLevel,
        countOfStudents,
        transferredCategory,
        latitude,
        longitude
    } = await req.json();

    if (!userId || !name || !schoolId || !schoolName || !stationId || !stationName || !educationalLevel || !countOfStudents || !transferredCategory) {
        return NextResponse.json({ message: 'Invalid input' });
    }

    try {
        const trafficLine = await db.trafficLine.create({
            data: {
                userId,
                name,
                schoolId,
                schoolName,
                stationId,
                stationName,
                educationalLevel,
                countOfStudents,
                transferredCategory,
                latitude,
                longitude
            }
        });

        return NextResponse.json({ id: trafficLine.id });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal server error' });
    }
}



export async function DELETE(req: NextRequest) {
    try {
        const trafficLineId = req.nextUrl.searchParams.get('trafficLine_id');

        if (!trafficLineId) {
            return NextResponse.json({ message: 'Traffic Line ID is required' }, { status: 400 });
        }

        // Delete the Traffic Line and cascade delete related records
        await db.trafficLine.delete({
            where: { id: trafficLineId },
            include: {
                risks: {
                    include: {
                        questionAnswers: {
                            include: {
                                controlMeasures: true
                            }
                        }
                    },
                },
            },
        });


        return NextResponse.json({ message: 'Traffic Line and related data deleted successfully' });
    } catch (error) {
        console.error('Error deleting Traffic Line:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
