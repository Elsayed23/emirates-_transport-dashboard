import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import path from 'path';
import fs from 'fs';

export const POST = async (req: Request) => {
    try {
        const formData = await req.formData();
        const inspectionId = formData.get("inspectionId") as string;
        const file = formData.get("file") as File;

        if (!inspectionId) {
            return NextResponse.json({ status: 400, message: "Inspection ID is required" });
        }

        if (!file) {
            return NextResponse.json({ status: 400, message: "File is required" });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);
        const fileName = `${Date.now()}-${file.name}`;
        const filePath = path.join('/uploads', fileName);
        fs.writeFileSync(path.join('./public', filePath), buffer);

        await db.inspectionAttachment.create({
            data: {
                name: file.name,
                path: filePath,
                inspectionId: inspectionId,
            },
        });

        return NextResponse.json({ status: 200, message: 'File uploaded successfully!' });

    } catch (error) {
        console.log("[upload]", error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
