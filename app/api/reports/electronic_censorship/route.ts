import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
const nodemailer = require("nodemailer");

export async function GET(req: NextRequest) {
    try {
        const userId = req.nextUrl.searchParams.get('user_id');

        if (!userId) {
            return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
        }

        // Fetch the user role and stationId
        const user = await db.user.findUnique({
            where: { id: userId },
            include: {
                role: true,
                station: {
                    select: {
                        id: true
                    }
                }
            }
        });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Check user role and fetch reports accordingly
        let reports;

        if (user?.role?.name === 'OPERATIONS_MANAGER') {
            // Fetch all reports for the user's stationId
            reports = await db.report.findMany({
                where: {
                    approved: true,
                    stationId: user.station?.id,
                    inspectionType: {
                        is: {
                            name: 'Inspection of electronic control'
                        }
                    },
                },
                include: {
                    inspectionType: true,
                    _count: true,
                    user: {
                        select: {
                            name: true
                        }
                    },
                },
            });
        } else if (user?.role?.name === 'SAFETY_OFFICER') {
            // Fetch all reports created by the user
            reports = await db.report.findMany({
                where: {
                    user_id: userId,
                    inspectionType: {
                        is: {
                            name: 'Inspection of electronic control'
                        }
                    }
                },
                include: {
                    inspectionType: true,
                    _count: true,
                }
            });
        } else {
            if (user.role?.name === 'SAFETY_DIRECTOR') {
                reports = await db.report.findMany({
                    where: {
                        approved: true,
                        inspectionType: {
                            isNot: {
                                name: 'Inspection of electronic control'
                            }
                        }
                    },
                    include: {
                        inspectionType: true,
                        _count: true,
                        user: {
                            select: {
                                name: true
                            }
                        }
                    }
                });
            } else {
                reports = await db.report.findMany({
                    where: {
                        inspectionType: {
                            isNot: {
                                name: 'Inspection of electronic control'
                            }
                        }
                    },
                    include: {
                        inspectionType: true,
                        _count: true,
                        user: {
                            select: {
                                name: true
                            }
                        }
                    }
                });
            }
        }

        return NextResponse.json(reports);

    } catch (error) {
        console.error('Error fetching reports:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
