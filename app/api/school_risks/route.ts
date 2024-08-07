import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { BASIC_HAZARDS } from './BASIC_HAZARDS'

export async function POST(req: Request) {
    const { schoolId, stationId, risks } = await req.json();

    // Flatten the nested arrays of risks to a single array of risk objects
    const flatRisks = risks.flat(Infinity);

    // Check for required inputs
    if (!schoolId || !stationId) {
        return NextResponse.json({ message: 'Missing required fields or no risks provided.' });
    }

    const allRisks = [
        ...flatRisks.map((hazard: any) => ({
            ...hazard,
            controlMeasures: {
                ar: hazard.controlMeasures.ar,
                en: hazard.controlMeasures.en
            }
        })),
        ...BASIC_HAZARDS.map(hazard => ({
            ...hazard,
            controlMeasures: {
                ar: hazard.controlMeasures.ar,
                en: hazard.controlMeasures.en
            }
        }))
    ];

    try {
        // Prepare risks and control measures for database insertion
        const riskCreations = allRisks.map(risk => {
            if (risk.controlMeasures.ar.length !== risk.controlMeasures.en.length) {
                throw new Error(`Mismatched control measures lengths for risk with questionId: ${risk.questionId}`);
            }

            const controlMeasures = risk.controlMeasures.ar.map((measureAr: string, index: number) => ({
                measureAr,
                measureEn: risk.controlMeasures.en[index]
            }));

            return db.schoolRisks.create({
                data: {
                    schoolId,
                    stationId,
                    questionId: risk.questionId,
                    causeOfRisk: risk.causeOfRisk,
                    activity: risk.activity,
                    typeOfActivity: risk.typeOfActivity,
                    hazardSource: risk.hazardSource,
                    risk: risk.risk,
                    peopleExposedToRisk: risk.peopleExposedToRisk,
                    expectedInjury: risk.expectedInjury,
                    riskAssessment: risk.riskAssessment,
                    residualRisks: risk.residualRisks,
                    controlMeasures: {
                        create: controlMeasures
                    }
                }
            });
        });

        // Execute all database operations as a transaction
        const results = await db.$transaction(riskCreations);
        return NextResponse.json(results);

    } catch (error) {
        console.error('Error creating risks:', error);
        return NextResponse.json({ message: 'Internal server error', error: error });
    }
}

export async function GET(req: NextRequest) {
    try {
        const schoolId = req.nextUrl.searchParams.get('school_id');
        const stationId = req.nextUrl.searchParams.get('station_id');

        if (!schoolId || !stationId) {
            return NextResponse.json({ message: 'Missing required fields.' });
        }

        const risks = await db.schoolRisks.findMany({
            orderBy: {
                questionId: 'asc'
            },
            where: {
                schoolId,
                stationId
            },
            include: {
                controlMeasures: true
            }
        });

        return NextResponse.json(risks);

    } catch (error) {
        console.error('Error getting risks:', error);
        return NextResponse.json({ message: 'Internal server error' });
    }
}

export async function PATCH(req: NextRequest) {
    const { schoolId, stationId, risks } = await req.json();

    const flatRisks = risks.flat(Infinity);

    if (!schoolId || !stationId) {
        return NextResponse.json({ message: 'Missing required fields or no risks provided.' });
    }

    let allRisks;
    if (flatRisks.length === 0) {
        allRisks = [
            ...BASIC_HAZARDS.map(hazard => ({
                ...hazard,
                controlMeasures: {
                    ar: hazard.controlMeasures.ar,
                    en: hazard.controlMeasures.en
                }
            }))
        ];
    } else {
        allRisks = [
            ...flatRisks.map((hazard: any) => ({
                ...hazard,
                controlMeasures: {
                    ar: hazard.controlMeasures.ar,
                    en: hazard.controlMeasures.en
                }
            })),
            ...BASIC_HAZARDS.map(hazard => ({
                ...hazard,
                controlMeasures: {
                    ar: hazard.controlMeasures.ar,
                    en: hazard.controlMeasures.en
                }
            }))
        ];
    }

    try {
        await db.schoolControlMeasure.deleteMany({
            where: {
                risk: {
                    schoolId,
                    stationId
                }
            }
        });

        await db.schoolRisks.deleteMany({
            where: {
                schoolId,
                stationId
            }
        });

        const riskCreations = allRisks.map(risk => {
            if (risk.controlMeasures.ar.length !== risk.controlMeasures.en.length) {
                throw new Error(`Mismatched control measures lengths for risk with questionId: ${risk.questionId}`);
            }

            const controlMeasures = risk.controlMeasures.ar.map((measureAr: string, index: number) => ({
                measureAr,
                measureEn: risk.controlMeasures.en[index]
            }));

            console.log(`Creating risk for questionId: ${risk.questionId}`, controlMeasures);

            return db.schoolRisks.create({
                data: {
                    schoolId,
                    stationId,
                    questionId: risk.questionId,
                    causeOfRisk: risk.causeOfRisk,
                    activity: risk.activity,
                    typeOfActivity: risk.typeOfActivity,
                    hazardSource: risk.hazardSource,
                    risk: risk.risk,
                    peopleExposedToRisk: risk.peopleExposedToRisk,
                    expectedInjury: risk.expectedInjury,
                    riskAssessment: risk.riskAssessment,
                    residualRisks: risk.residualRisks,
                    controlMeasures: {
                        create: controlMeasures
                    }
                }
            });
        });

        // Execute all database operations as a transaction
        const results = await db.$transaction(riskCreations);
        return NextResponse.json(results);
    } catch (error) {
        console.error('Error replacing risks:', error);
        return NextResponse.json({ message: 'Internal server error', error: error });
    }
}
