import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import path from 'path';
import fs from 'fs';
const crypto = require('crypto')

function sanitizeFileName(fileName: string): string {
    return fileName.replace(/[^a-z0-9.-]/gi, '_').toLowerCase();
}

export const POST = async (req: Request) => {
    try {
        const formData = await req.formData();
        const reportId = formData.get("reportId") as string;
        const idOfBus = formData.get("idOfBus") as string;
        const requirementId = formData.get("requirementId") as string;
        const noteId = formData.get("noteId") as string;
        const file = formData.get("file") as File;

        if (!reportId || !idOfBus || !requirementId || !noteId || !file) {
            return NextResponse.json({ status: 400, message: "All fields are required" });
        }

        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ status: 400, message: "Uploaded file must be an image" });
        }

        const uploadDir = path.join("./public/uploads");

        // Ensure the uploads directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);
        const randomString = crypto.randomBytes(6).toString('hex');
        const sanitizedFileName = sanitizeFileName(file.name);
        const fileName = `${Date.now()}-${randomString}-${sanitizedFileName}`;
        const filePath = path.join("/uploads", fileName);

        fs.writeFileSync(path.join(uploadDir, fileName), buffer);

        const newInspection = await db.inspection.create({
            data: {
                reportId,
                idOfBus: Number(idOfBus),
                requirementId,
                noteId,  // Link the inspection to the note
                image: filePath, // Store the single image path
            }
        });

        return NextResponse.json({ status: 200, message: "Inspection created successfully!", inspection: newInspection });

    } catch (error) {
        console.error("[Upload Error]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
};
