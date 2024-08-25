import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {

        const risks = await db.question.findMany({
            orderBy: {
                orderd: 'asc'
            },
            select: {
                appliesTo: true,
                answers: {
                    include: {
                        controlMeasures: {
                            select: {
                                ar: true,
                                en: true
                            }
                        }
                    }
                }
            }
        });

        const groupedRisks = risks.reduce((acc: any, risk) => {
            if (!acc[risk.appliesTo]) {
                acc[risk.appliesTo] = [];
            }
            acc[risk.appliesTo].push(risk.answers[0]);
            return acc;
        }, {});

        const response = Object.keys(groupedRisks).map((category) => ({
            header: `${category} risks`,
            risks: groupedRisks[category]
        }));

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error getting user responses:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
