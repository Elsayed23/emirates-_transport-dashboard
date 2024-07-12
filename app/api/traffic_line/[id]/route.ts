import { db } from '@/lib/db';
import { NextResponse } from 'next/server';


export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {

        const { id } = params

        const trafficLine = await db.trafficLine.findFirst({
            where: {
                id
            }
        })

        if (!trafficLine) {
            return NextResponse.json({ message: 'Not found traffic line with this id' })
        }

        return NextResponse.json(trafficLine)


    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}