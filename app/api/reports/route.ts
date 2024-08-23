import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
const nodemailer = require("nodemailer");

export async function POST(req: Request) {
    try {

        const { userId, stationId, nameOfStation, schoolId, inspectionTypeId, city } = await req.json();

        // Fetch the user's name and financial number
        const user = await db.user.findUnique({
            where: { id: userId },
            select: { name: true, financialNumber: true }
        });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Create the report, including the user's name and financial number
        const newReport = await db.report.create({
            data: {
                userId,
                userName: user.name, // Store the user's name
                userFinancialNumber: user.financialNumber, // Store the user's financial number
                stationId,
                nameOfStation,
                schoolId,
                inspectionTypeId,
                city,
            },
            select: {
                id: true,
                userName: true,
                school: {
                    select: {
                        translationName: true
                    }
                },
            }
        });

        // Fetch Safety Managers
        const safetyManagers = await db.user.findMany({
            where: {
                role: {
                    name: 'SAFETY_MANAGER',
                },
            },
            select: {
                email: true,
                name: true,
            },
        });

        // Configure nodemailer
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS,
            },
        });

        // Send notifications
        for (const safetyManager of safetyManagers) {
            await transporter.sendMail({
                from: 'mido-dashboard@gmail.com',
                to: safetyManager?.email,
                subject: 'New Report Created',
                text: `A new report has been created for the station: ${nameOfStation} by ${newReport.userName}`,
                html: `Hello ${safetyManager.name},<br><br>
               <p>A new report has been created for the station: <strong>${nameOfStation}</strong> by ${newReport.userName}.<br>
               School: ${newReport.school.translationName}.<br>
               <a href="http://localhost:3000/reports/${newReport.id}">View Report</a></p>`,
            });
        }

        return NextResponse.json({ id: newReport.id });
    } catch (error) {
        console.error('Error creating report:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

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

        let reports;

        if (user?.role?.name === 'OPERATIONS_MANAGER') {
            reports = await db.report.findMany({
                where: {
                    approved: true,
                    stationId: user.station?.id,
                    inspectionType: {
                        isNot: {
                            name: 'Inspection of electronic control'
                        }
                    }
                },
                include: {
                    inspectionType: true,
                    school: {
                        select: {
                            name: true,
                            translationName: true
                        }
                    },
                    _count: true,
                    user: {
                        select: {
                            name: true
                        }
                    },
                },
            });
        } else if (user?.role?.name === 'SAFETY_OFFICER') {
            reports = await db.report.findMany({
                where: {
                    userId,
                    inspectionType: {
                        isNot: {
                            name: 'Inspection of electronic control'
                        }
                    }
                },
                include: {
                    inspectionType: true,
                    school: {
                        select: {
                            name: true,
                            translationName: true
                        }
                    },
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
                        school: {
                            select: {
                                name: true,
                                translationName: true
                            }
                        },
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
                        school: {
                            select: {
                                name: true,
                                translationName: true
                            }
                        },
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