import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
    try {

        const isElectronicCensorship = req.nextUrl.searchParams.get('is_electronic_censorship')


        if (isElectronicCensorship) {
            const safetyOfficers = await db.user.findMany({
                where: {
                    role: {
                        name: 'SAFETY_OFFICER'
                    },
                },
                select: {
                    _count: {
                        select: {
                            reports: {
                                where: {
                                    inspectionType: {
                                        is: {
                                            name: "Inspection of electronic control"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    id: true,
                    name: true,
                },
            })


            return NextResponse.json(safetyOfficers)
        } else {
            const safetyOfficers = await db.user.findMany({
                where: {
                    role: {
                        name: 'SAFETY_OFFICER'
                    }
                },
                select: {
                    _count: {
                        select: {
                            reports: {
                                where: {
                                    inspectionType: {
                                        isNot: {
                                            name: "Inspection of electronic control"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    id: true,
                    name: true,
                },
            })


            return NextResponse.json(safetyOfficers)
        }

    } catch (error) {
        console.log("[job_titles]", error);
        return new NextResponse('Internal Error', { status: 500 })
    }
}