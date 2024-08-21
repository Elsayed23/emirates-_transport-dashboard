import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

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
function analyzeRisks(trafficLines: any, targetQuestionIds: any) {
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

        if (!schoolId || !stationId) {
            return NextResponse.json({ message: 'Missing required fields.' });
        }

        const trafficLines = await db.trafficLine.findMany({
            orderBy: {
                createdAt: 'asc'
            },
            where: {
                stationId,
                schoolId
            },
            include: {
                risks: {
                    include: {
                        question: {
                            select: {
                                userResponses: true
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
    const formData = await req.formData();

    const userId = formData.get('userId') as string;
    const name = formData.get('name') as string;
    const schoolId = formData.get('schoolId') as string;
    const stationId = formData.get('stationId') as string;
    const educationalLevel = formData.get('educationalLevel') as string;
    const countOfStudents = formData.get('countOfStudents') as unknown as number;
    const transferredCategory = formData.get('transferredCategory') as string;
    const latitude: any = formData.get('latitude');
    const longitude: any = formData.get('longitude');
    const files = formData.getAll('image') as File[];

    if (!userId || !name || !schoolId || !stationId || !educationalLevel || !countOfStudents || !transferredCategory) {
        return NextResponse.json({ message: 'Invalid input' });
    }

    try {
        // Save traffic line data to the database
        const trafficLine = await db.trafficLine.create({
            data: {
                userId,
                name,
                schoolId,
                stationId,
                educationalLevel,
                countOfStudents: Number(countOfStudents),
                transferredCategory,
                latitude: Number(latitude),
                longitude: Number(longitude),
            }
        });

        // تحديث `completedCount` للمهمة المرتبطة بهذا النوع من المهام
        await db.task.updateMany({
            where: {
                userId: userId,
                name: 'TRAFFIC_LINE_HAZARDS',
                completedCount: {
                    lt: db.task.fields.taskCount // تأكد من أن المهمة لم تكتمل بالكامل بعد
                }
            },
            data: {
                completedCount: {
                    increment: 1 // زيادة عدد المهام المكتملة بواحد
                }
            }
        });

        // Save images
        const imagePromises = files.filter(file => file.type.startsWith('image/')).map(async (file) => {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = new Uint8Array(arrayBuffer);
            const fileName = `${Date.now()}-${file.name}`;
            const filePath = path.join('/uploads', fileName);
            fs.writeFileSync(path.join('./public', filePath), buffer);

            // Save image path to TrafficLineImage model
            await db.trafficLineImage.create({
                data: {
                    trafficLineId: trafficLine.id,
                    imageUrl: filePath,
                }
            });

            return filePath;
        });

        await Promise.all(imagePromises);

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
                        question: {
                            include: {
                                answers: true
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
