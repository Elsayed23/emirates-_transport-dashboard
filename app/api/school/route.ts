import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: Request) => {
    try {

        const { stationId, name, translationName, contract } = await req.json()

        if (!stationId || !name || !translationName || !contract) {
            return NextResponse.json({ message: 'Missing required fields.' });
        }

        const school = await db.school.create({
            data: {
                stationId,
                name,
                translationName,
                contract
            }
        })

        return NextResponse.json(school)

    } catch (error) {
        console.log(error);
        return new NextResponse('Internal Error', { status: 500 })
    }
}

export const GET = async (req: NextRequest) => {
    try {

        const stationId = req.nextUrl.searchParams.get('station_id')

        if (!stationId) {
            return NextResponse.json({ message: 'Invalid station id' })
        }

        const schools = await db.school.findMany({
            where: {
                stationId
            },
            include: {
                trafficLine: {
                    select: {
                        risks: {
                            select: {
                                question: {
                                    select: {
                                        id: true,
                                        userResponses: {
                                            select: {
                                                response: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })

        return NextResponse.json(schools)

    } catch (error) {
        console.log(error);
        return new NextResponse('Internal Error', { status: 500 })
    }
}