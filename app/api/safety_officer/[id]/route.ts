import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {

        const { id } = params

        const isElectronicCensorship = req.nextUrl.searchParams.get('is_electronic_censorship')

        if (isElectronicCensorship) {
            const reports = await db.report.findMany({
                where: {
                    userId: id,
                    inspectionType: {
                        is: {
                            name: "Inspection of electronic control"
                        }
                    }
                },
                include: {
                    inspections: true,
                    user: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    inspectionType: true,
                    school: {
                        select: {
                            name: true,
                            translationName: true
                        }
                    },
                }
            })

            if (!reports) {
                return NextResponse.json({ message: 'Not found user with this id' }, { status: 404 });
            }


            return NextResponse.json(reports)
        } else {
            const reports = await db.report.findMany({
                where: {
                    userId: id,
                    inspectionType: {
                        isNot: {
                            name: "Inspection of electronic control"
                        }
                    }
                },
                include: {
                    inspections: true,
                    user: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    inspectionType: true,
                    school: {
                        select: {
                            name: true,
                            translationName: true
                        }
                    },
                }
            })

            if (!reports) {
                return NextResponse.json({ message: 'Not found user with this id' }, { status: 404 });
            }


            return NextResponse.json(reports)
        }




    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
