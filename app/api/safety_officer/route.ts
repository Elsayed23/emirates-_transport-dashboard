import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
    try {
        const isElectronicCensorship = req.nextUrl.searchParams.get('is_electronic_censorship');

        const safetyOfficers = await db.user.findMany({
            where: {
                role: {
                    name: 'SAFETY_OFFICER',
                },
            },
            select: {
                id: true,
                name: true,
                reports: {
                    where: isElectronicCensorship
                        ? {
                            inspectionType: {
                                name: "Inspection of electronic control",
                            },
                        }
                        : {
                            inspectionType: {
                                name: {
                                    not: "Inspection of electronic control",
                                },
                            },
                        },
                    select: {
                        approved: true,
                        school: {
                            select: {
                                name: true,
                                translationName: true
                            }
                        },
                    },
                },
                _count: {
                    select: {
                        reports: {
                            where: isElectronicCensorship
                                ? {
                                    inspectionType: {
                                        name: "Inspection of electronic control",
                                    },
                                }
                                : {
                                    inspectionType: {
                                        name: {
                                            not: "Inspection of electronic control",
                                        },
                                    },
                                },
                        },
                    },
                },
            },
        });

        return NextResponse.json(safetyOfficers);
    } catch (error) {
        console.log(error);
        return new NextResponse('Internal Error', { status: 500 });
    }
};
