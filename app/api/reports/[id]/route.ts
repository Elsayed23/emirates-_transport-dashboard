import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

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
        const { id } = params;

        if (!id) {
            return NextResponse.json({ message: 'Report ID is required' }, { status: 400 });
        }

        // Retrieve the report along with the associated inspections
        const report = await db.report.findUnique({
            where: { id },
            include: {
                inspections: true
            }
        });

        if (!report) {
            return NextResponse.json({ message: 'Report not found' }, { status: 404 });
        }

        // Delete inspection images from the file system
        report.inspections.forEach((inspection) => {
            const imagePath = path.join("./public", inspection.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        });

        // Delete the report and related inspections from the database
        await db.report.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'Report and associated inspections deleted successfully' });
    } catch (error) {
        console.error('Error deleting report and inspections:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
