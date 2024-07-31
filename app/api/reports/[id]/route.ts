import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {

        const { id } = params


        const report = await db.report.findFirst({
            where: {
                id
            },
            include: {
                inspections: {
                    include: {
                        attachment: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                inspectionType: true
            }
        })

        if (!report) {
            return NextResponse.json({ message: 'Not found report with this id' }, { status: 404 });
        }


        return NextResponse.json(report)


    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params

        if (!id) {
            return NextResponse.json({ message: 'Report ID is required' }, { status: 400 });
        }


        await db.report.delete({
            where: {
                id
            },
            include: {
                inspections: {
                    include: {
                        DeleteRequest: true
                    }
                }
            }
        });

        return NextResponse.json({ message: 'Inspection and related data deleted successfully' });
    } catch (error) {
        console.error('Error deleting Inspection:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
