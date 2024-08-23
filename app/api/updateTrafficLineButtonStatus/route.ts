import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export const PATCH = async (req: NextRequest) => {
    try {

        const buttonState: any = await db.updateTrafficLineButtonState.findFirst();
        const updatedButtonState = await db.updateTrafficLineButtonState.update({
            where: {
                id: buttonState.id
            },
            data: { enabled: !buttonState.enabled }
        });

        return NextResponse.json(updatedButtonState);
    } catch (error) {
        console.error(error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
};



export const GET = async (req: NextRequest) => {
    try {
        const buttonState = await db.updateTrafficLineButtonState.findFirst();

        // if (!buttonState) {
        //     return NextResponse.json({ message: 'Button state not found' }, { status: 404 });
        // }

        return NextResponse.json({ status: buttonState?.enabled });
    } catch (error) {
        console.error(error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
};
