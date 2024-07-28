import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import path from 'path';
import fs from 'fs';

export const POST = async (req: Request) => {
    try {
        const formData = await req.formData();
        const reportId = formData.get("reportId") as string;
        const name = formData.get("name") as string;
        const idOfBus = formData.get("idOfBus") as string;
        const requirement = formData.get("requirement") as string;
        const description = formData.get("description") as string;
        const enDescription = formData.get("enDescription") as string;
        const files = formData.getAll("files") as File[];

        if (!reportId || !name || !idOfBus || !requirement || !description || !enDescription) {
            return NextResponse.json({ status: 400, message: "All fields are required" });
        }

        const noteClassification = getRequirementForClassification(requirement); // Define this function based on your logic

        const imagePromises = files.filter(file => file.type.startsWith('image/')).map(async (file) => {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = new Uint8Array(arrayBuffer);
            const fileName = `${Date.now()}-${file.name}`;
            const filePath = path.join('/uploads', fileName);
            fs.writeFileSync(path.join('./public', filePath), buffer);

            return filePath;
        });

        const savedImages = await Promise.all(imagePromises);

        const newInspection = await db.inspection.create({
            data: {
                reportId,
                name,
                idOfBus: Number(idOfBus),
                requirement,
                description,
                enDescription,
                noteClassification,
                image: savedImages[0],
            }
        });

        return NextResponse.json({ status: 200, message: 'Inspection created successfully!', inspection: newInspection });

    } catch (error) {
        console.log("[upload]", error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

const getRequirementForClassification = (classification: string): string => {
    const classificationMap: { [key: string]: string } = {
        "Passenger_safety": "رئيسية",
        "Bus_sticker_identification_numbers": "ثانوية",
        // Add more mappings as needed
    };

    return classificationMap[classification] || "ثانوية";
};