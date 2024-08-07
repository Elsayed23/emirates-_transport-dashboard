import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params

        if (!id) {
            return NextResponse.json({ message: 'Inspection ID is required' }, { status: 400 });
        }
        await db.question.delete({
            where: { id },
        });
        return NextResponse.json({ message: 'Question deleted successfully' });
    } catch (error) {
        console.error('Error deleting Inspection:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
