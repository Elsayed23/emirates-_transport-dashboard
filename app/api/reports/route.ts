import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
const nodemailer = require("nodemailer");

export async function POST(req: Request) {
    try {
        const jsonData = await req.json();

        const { userId, stationId, nameOfStation, nameOfSchool, inspectionTypeId, city } = jsonData;

        const newReport = await db.report.create({
            data: {
                user_id: userId,
                stationId: Number(stationId),
                nameOfStation,
                nameOfSchool,
                inspectionTypeId,
                city,
            },
            select: {
                id: true,
                user: {
                    select: {
                        name: true
                    }
                }
            }
        });



        // Find users with 'ADMIN' role
        const admin = await db.user.findFirst({
            where: {
                role: {
                    name: 'ADMIN'
                },
                name: 'Humaid'
            },
            select: {
                email: true,
            }
        });

        // Combine the two lists of users
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS,
            },
        });

        // Placeholder for sending notifications


        // Send notifications
        await transporter.sendMail({
            from: 'mido-dashboard@gmail.com',
            to: admin?.email,
            subject: 'New Report Created',
            text: `A new report has been created for the station: ${nameOfStation}. from ${newReport.user.name}`,
            html: `<p>A new report has been created for the station: <strong>${nameOfStation}</strong>. School => ${nameOfSchool}. <a href="http://localhost:3000/reports/${newReport.id}">see it</a></p>`,
        });


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
                // Optionally include stationId if necessary
            }
        });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        let reports;

        if (user?.role?.name === 'STATION') {
            reports = await db.report.findMany({
                where: {
                    stationId: Number(user.stationId),
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
                    },
                },
            });
        } else if (user?.role?.name === 'SAFETY_OFFICER') {
            reports = await db.report.findMany({
                where: {
                    user_id: userId,
                    inspectionType: {
                        isNot: {
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

        return NextResponse.json(reports);

    } catch (error) {
        console.error('Error fetching reports:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}