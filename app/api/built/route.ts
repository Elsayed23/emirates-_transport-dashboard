import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: Request) => {
    try {
        const { name, cityName, userId } = await req.json();

        if (!name || !cityName || !userId) {
            return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
        }

        // Fetch the user's name and financial number
        const user = await db.user.findUnique({
            where: { id: userId },
            select: { name: true, financialNumber: true }
        });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Create the Built record, including the user's name and financial number
        const built = await db.built.create({
            data: {
                name,
                cityName,
                userId,
                userName: user.name, // Store the user's name
                userFinancialNumber: user.financialNumber, // Store the user's financial number
            }
        });

        return NextResponse.json({ id: built.id });
    } catch (error) {
        console.log('Error creating Built record:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
};
export const GET = async (req: NextRequest) => {
    try {

        // const stationId = req.nextUrl.searchParams.get('station_id')

        // if (!stationId) {
        //     return NextResponse.json({ message: 'Invalid station id' })
        // }

        const buildings = await db.built.findMany({
            // orderBy: {
            //     createdAt: 'asc'
            // },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        })

        return NextResponse.json(buildings)

    } catch (error) {
        console.log(error);
        return new NextResponse('Internal Error', { status: 500 })
    }
}