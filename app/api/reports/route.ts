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


        const stationManagers = await db.user.findMany({
            where: {
                role: {
                    name: 'STATION'
                },
                stationId: Number(stationId)
            },
            select: {
                email: true,
            }
        });

        // Find users with 'ADMIN' role
        const admins = await db.user.findMany({
            where: {
                role: {
                    name: 'ADMIN'
                }
            },
            select: {
                email: true,
            }
        });

        // // Combine the two lists of users
        // const recipients = [...stationManagers, ...admins];

        // const transporter = nodemailer.createTransport({
        //     service: "gmail",
        //     auth: {
        //         user: 'elsayedkewan123@gmail.com',
        //         pass: 'oyzd lxxx ajcf kgzb',
        //     },
        // });

        // // Placeholder for sending notifications
        // recipients.forEach(user => {
        //     console.log(`Send notification to: ${user.email}`);
        //     // Add your notification logic here
        // });

        // // Send notifications
        // for (const user of recipients) {
        //     await transporter.sendMail({
        //         from: 'mido-dashboard@gmail.com',
        //         to: user.email,
        //         subject: 'New Report Created',
        //         text: `A new report has been created for the station: ${nameOfStation}. from ${newReport.user.name}`,
        //         html: `<p>A new report has been created for the station: <strong>${nameOfStation}</strong>. School => ${nameOfSchool}. <a href="http://localhost:3000/reports/${newReport.id}">see it</a></p>`,
        //     });
        // }


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