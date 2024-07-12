import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

const BASIC_HAZARDS = [
    {
        questionId: 26,
        causeOfRisk: "الطريق",
        activity: "نقل الطلاب من البيت إلى المدرسة وبالعكس",
        typeOfActivity: "روتيني",
        hazardSource: "صعود ونزول الطلبة من وإلى الحافلة المدرسية في أماكن التحميل والتنزيل",
        risk: "تعرض الطلاب للدهس من قبل الحافلة المدرسية أثناء الصعود أو النزول",
        peopleExposedToRisk: "الطلاب",
        expectedInjury: "إصابات متفاوتة، وفيات",
        riskAssessment: "3/4/2",
        controlMeasures: ["تركيب كاميرات على زوايا مختلفة من الحافلة لتأمين رؤية واضحة للسائق أثناء تحميل وتنزيل الطلاب", "الصيانة الدورية للحافلات شاملة الكاميرات والمرايا الجانبية وذراع التوقف", 'إعطاء الوقت الكافي للطلاب أثناء الصعود أو النزول والتأكيد على السائقين بعدم السير إلا عند التأكد من جلوس الطلاب في مقاعدهم وعدم وجود أي طالب بالخارج قرب الحافلة', 'المراقبة المستمرة للحافلات أثناء تحميل وتنزيل الطلاب من قبل منسقي الحركة للتأكد من اتباع السائق لإجراءات السلامة', 'وجود مشرفي السلامة في الحافلات المدرسية لمساعدة الطلاب عند الصعود أو النزول وإيصالهم للمكان الآمن', 'توعية الطلاب حول القاعدة الذهبية والتي من شأنها توفير المعلومات اللازمة لهم حول الإجراءات الآمنة عند الصعود أو النزو ', 'توفير صندوق الإسعافات الأولية لمعالجة الإصابات الطفيفة في حال حدوثها', 'تدريب وتوعية السائقين والمشرفات بإجراءات الطوارئ أثناء الحوادث'],
        residualRisks: "1/4/4"
    },
    {
        questionId: 27,
        causeOfRisk: "الطريق",
        activity: "نقل الطلاب من البيت إلى المدرسة وبالعكس",
        typeOfActivity: "روتيني",
        hazardSource: "التوقف المفاجئ للحافلة",
        risk: "تعرض الركاب في الحافلة للارتطام بالمقاعد أو الوقوع من المقاعد داخل الحافلة",
        peopleExposedToRisk: "جميع ركاب الحافلة",
        expectedInjury: "إصابات متفاوتة، وفيات",
        riskAssessment: "4/3/12",
        controlMeasures: ['تزويد الحافلات بمثبت السرعة بحيث لا تزيد عن 80 كم للساعة', 'تركيب أحزمة الامان على المقاعد في جميع الحافلات', 'توفير صناديق الإسعافات الأولية لاستخدامها عند الحاجة ', 'التدريب الدوري للسائقين على الالتزام بقواعد المرور ', 'تأكد مشرفي السلامة بالحافلات من جلوس الطلبة بمقاعدهم واستخدام أحزمة الأمان في المقاعد ', 'مراقبة المركبات في الطرق بواسطة منسقي الحركة ', 'تطبيق إجراءات عقابية وأخرى تشجيعية لالتزام السائقين بالسرعة وقواعد المرور', 'تطبيق إجراءات انضباطية لسلوكيات الطلاب داخل الحافلات'],
        residualRisks: "2/3/6"
    },
    {
        questionId: 28,
        causeOfRisk: "الطريق",
        activity: "نقل الطلاب من البيت إلى المدرسة وبالعكس",
        typeOfActivity: "روتيني",
        hazardSource: "الحوادث المرورية",
        risk: "تعرض ركاب الحافلة أو مستخدمي الطريق لإصابات مختلفة",
        peopleExposedToRisk: "جميع ركاب الحافلة، مستخدمي الطريق",
        expectedInjury: "إصابات متفاوتة، وفيات",
        riskAssessment: "3/5/15",
        controlMeasures: ['تركيب أحزمة الأمان على المقاعد في جميع الحافلات', 'تزويد الحافلات بمثبت السرعة بحيث لا تزيد عن 80 كم للساعة', 'جميع الحافلات مزودة بأجهزة تتبع يمكن من خلالها مراقبة سرعة الحافلات من قبل المحطات', 'جميع الحافلات تخضع لصيانة دورية للتأكد من أنها آمنة للسير على الطرق', 'تدريب جميع السائقين وبشكل دوري على القواعد المرورية (الالتزام بالسرعات المحددة، الإشارات الضوئية، وعدم التجاوز إطلاقاً، عدم القيادة تحت تأثير المشروبات الكحولية، عدم عرقلة حركة السير أثناء التوقف لتحميل وتنزيل الطلبة وعدم الوقوف في الأماكن الممنوعة، إعطاء أولوية السير لمستحقيها قانونياً، استخدام إشارات التنبيه، إعطاء الأولوية للمشاة بالعبور، الخ..)', 'قيام منسقي الحركة من مراقبة الحافلات (أثناء الحركة والسكون) بشكل دوري للتأكد من اتباع السائق لقواعد المرور بدقة', 'التأكيد على السائقين بعدم الرجوع للخلف لأي سبب إلا بالحالات الطارئة', 'تطبيق إجراءات عقابية وأخرى تشجيعية لالتزام السائقين بالسرعة وقواعد المرور', 'تدريب وتوعية السائقين والمشرفات بإجراءات الطوارئ حسب خطة الطوارئ'],
        residualRisks: "1/5/5"
    },
    {
        questionId: 29,
        causeOfRisk: "الطريق",
        activity: "نقل الطلاب من البيت إلى المدرسة وبالعكس",
        typeOfActivity: "روتيني",
        hazardSource: "القيادة في المطر",
        risk: "خطر انزلاق الحافلات بسبب حالة الطريق الزلقة إضافة إلى تدني مستوى الرؤية ما قد يسبب الحوادث المرورية",
        peopleExposedToRisk: "جميع ركاب الحافلة، مستخدمي الطريق",
        expectedInjury: "إصابات متفاوتة، وفيات",
        riskAssessment: "3/5/15",
        controlMeasures: ['الصيانة الدورية للحافلات لتأهيلها على السير في الحالات الجوية المختلفة', 'تركيب أحزمة الامان على المقاعد في جميع الحافلات', 'يتم تدريب السائقين بشكل دوري في خطة الطوارئ على القيادة في المطر', 'تعليق الرحلات (إن لزم) في حالات الاجواء العاصفة بالتنسيق مع المدرسة', 'الصيانة الدورية للحافلات لتأهيلها على السير في الحالات الجوية المختلفة', 'تعليق الرحلات (إن لزم) في الضباب بالتنسيق مع المدارس', 'تدريب السائقين على التعامل مع الضباب في خطة الطوارئ (السير ببطء وحذر أكبر، عدم استعمال الأضواء الرباعية في حالة السير، التوقف جانباً في حال الضباب الكثيف مع تشغيل الأضواء الرباعية وإعلام منسقي الحركة عند التوقف)'],
        residualRisks: "1/5/5"
    },
    {
        questionId: 30,
        causeOfRisk: "الطريق",
        activity: "نقل الطلاب من البيت إلى المدرسة وبالعكس",
        typeOfActivity: "روتيني",
        hazardSource: "القيادة في الضباب",
        risk: "خطر تدني مستوى الرؤية ما قد يسبب الحوادث المرورية",
        peopleExposedToRisk: "جميع ركاب الحافلة، مستخدمي الطريق",
        expectedInjury: "إصابات متفاوتة، وفيات",
        riskAssessment: "3/5/15",
        controlMeasures: ['الصيانة الدورية للحافلات لتأهيلها على السير في الحالات الجوية المختلفة', 'تعليق الرحلات (إن لزم) في الضباب بالتنسيق مع المدارس', 'تدريب السائقين على التعامل مع الضباب في خطة الطوارئ (السير ببطء وحذر أكبر، عدم استعمال الأضواء الرباعية في حالة السير، التوقف جانباً في حال الضباب الكثيف مع تشغيل الأضواء الرباعية وإعلام منسقي الحركة عند التوقف)'],
        residualRisks: "1/5/5"
    },
    {
        questionId: 31,
        causeOfRisk: "الطريق",
        activity: "نقل الطلاب من البيت إلى المدرسة وبالعكس",
        typeOfActivity: "روتيني",
        hazardSource: "القيادة الليلية المتأخرة أو المبكرة جداً",
        risk: "عدم وضوح الرؤية أثناء الظلام قد تتسبب بالحوادث المرورية",
        peopleExposedToRisk: "جميع ركاب الحافلة، مستخدمي الطريق",
        expectedInjury: "إصابات متفاوتة، وفيات",
        riskAssessment: "3/5/15",
        controlMeasures: ['الصيانة الدورية الوقائية لجميع الحافلات لتأهيلها للسير بشكل آمن أثناء الظلام', 'وجود شريط عاكس على الهيكل الخارجي للحافلات المدرسية لتنبيه مستخدمي الطريق', 'تركيب أحزمة أمان للمقاعد في جميع الحافلات المدرسية', 'تدريب السائقين على القواعد المرورية للقيادة الآمنة أثناء الظلام', 'التفقد اليومي للحافلات من قبل السائقين للتأكد من عمل الأضواء وإشارات التنبيه'],
        residualRisks: "1/5/5"
    },
    {
        questionId: 32,
        causeOfRisk: "الطريق",
        activity: "نقل الطلاب من البيت إلى المدرسة وبالعكس",
        typeOfActivity: "روتيني",
        hazardSource: "عبور مستخدمي الطريق بغير الأماكن المخصصة",
        risk: "تعرض مستخدمي الطريق لحالات الدهس",
        peopleExposedToRisk: "مستخدمي الطريق",
        expectedInjury: "إصابات متفاوتة، وفيات",
        riskAssessment: "4/4/16",
        controlMeasures: ['تزويد الحافلات بمثبت السرعة بحيث لا تزيد عن 80 كم للساعة', 'تدريب السائقين على قواعد السلامة المرورية'],
        residualRisks: "4/4/1"
    },
    {
        questionId: 33,
        causeOfRisk: "الطريق",
        activity: "نقل الطلاب من البيت إلى المدرسة وبالعكس",
        typeOfActivity: "روتيني",
        hazardSource: "القيادة اثناء العواصف والامطار الشديدة وجريان الأودية والفيضانات",
        risk: "تعرض الحافلة للغرق، الانحراف، التدهور، الانجراف، او الحوادث نتيجة الفيضانات",
        peopleExposedToRisk: "جميع ركاب الحافلة",
        expectedInjury: "غرق، إصابات متفاوتة، وفيات",
        riskAssessment: "1/5/5",
        controlMeasures: ['توجيه السائقين بضرورة إيقاف الحافلة في مكان آمن وعدم تعريض المنقولين لأي خطر ممكن في حال مواجهة سيناريو مشابه', 'مراجعة خطوط السير لتفادي دخول الحافلات للأماكن الخطرة كالأودية ومجاري السيول', 'اتباع الارشادات الصادرة عن الجهات المختصة', 'تدريب وتوعية السائقين ومشرفي النقل والسلامة والموظفين على اجراءات الطوارئ'],
        residualRisks: "1/5/5"
    },
    {
        questionId: 34,
        causeOfRisk: "الطريق / السائق",
        activity: "نقل الطلاب من البيت إلى المدرسة وبالعكس",
        typeOfActivity: "روتيني",
        hazardSource: "تقليل السرعة بشكل مفاجئ او التوقف المفاجئ",
        risk: "صدم الحافلة من الخلف من قبل المركبات الأخرى",
        peopleExposedToRisk: "جميع ركاب الحافلة",
        expectedInjury: "إصابات متفاوتة",
        riskAssessment: "3/3/9",
        controlMeasures: ['تركيب أحزمة الامان على المقاعد في جميع الحافلات', 'تدريب السائقين على القيادة الدفاعية', 'مراقبة المركبات في الطرق بواسطة منسقي الحركة', 'تأكد السائقين والمشرفات من جلوس الطلاب في مقاعدهم', 'توفير صندوق الإسعافات الأولية لاستخدامها عند الحاجة'],
        residualRisks: "2/3/6"
    },
    {
        questionId: 35,
        causeOfRisk: "الطريق",
        activity: "نقل الطلاب من البيت إلى المدرسة وبالعكس",
        typeOfActivity: "روتيني",
        hazardSource: "صعود ونزول مشرفي النقل والسلامة في مناطق التحميل والتنزيل (أمام المدارس والمنازل)",
        risk: "تعرض مشرفي النقل والسلامة للدهس من قبل الحافلة المدرسية أو المركبات الأخرى على الطريق",
        peopleExposedToRisk: "مشرفي النقل والسلامة",
        expectedInjury: "إصابات متفاوتة، وفيات",
        riskAssessment: "3/4/12",
        controlMeasures: ['ارتداء السترة العاكسة من قبل مشرفي النقل والسلامة أثناء العمل', 'استخدام ذراع التوقف لتحذير السائقين الآخرين على الطريق أثناء تحميل وتنزيل الطلبة', 'تركيب كاميرات على زوايا مختلفة من الحافلة لتأمين رؤية واضحة للسائق لحركة السير أثناء التنزيل والتحميل', 'المراجعة الدورية لخطوط السير لتفادي دخول الحافلات وتوقفها في الأماكن الخطرة على سلامة المنقولين', 'الصيانة الدورية للحافلات شاملة الكاميرات والمرايا الجانبية وذراع التوقف ', 'وقوف الحافلة على نفس جهة المدرسة/البيت لتفادي قطع الشارع (داخل الأحياء السكنية) أثناء التحميل والتنزيل إن أمكن', 'توفير صندوق الإسعافات الأولية لاستخدامها عند الحاجة', 'المراقبة المستمرة للحافلات أثناء تنزيل وتحميل الطلاب من قبل منسقي الحركة للتأكد من اتباع السائق والمشرفين لإجراءات السلامة'],
        residualRisks: "1/1/4"
    },
    {
        questionId: 36,
        causeOfRisk: "الطريق / السائق",
        activity: "نقل الطلاب من البيت إلى المدرسة وبالعكس",
        typeOfActivity: "روتيني",
        hazardSource: "تقليل السرعة بشكل مفاجئ او التوقف المفاجئ",
        risk: "صدم الحافلة من الخلف من قبل المركبات الأخرى",
        peopleExposedToRisk: "جميع ركاب الحافلة",
        expectedInjury: "إصابات متفاوتة",
        riskAssessment: "3/3/9",
        controlMeasures: ['تركيب أحزمة الامان على المقاعد في جميع الحافلات', 'تدريب السائقين على القيادة الدفاعية', 'مراقبة المركبات في الطرق بواسطة منسقي الحركة', 'تأكد السائقين والمشرفات من جلوس الطلاب في مقاعدهم', 'توفير صندوق الإسعافات الأولية لاستخدامها عند الحاجة'],
        residualRisks: "2/3/6"
    },
];



export async function POST(req: Request) {
    const { trafficLineId, risks } = await req.json();

    // Flatten the nested arrays of risks to a single array of risk objects
    const flatRisks = risks.flat(Infinity); // This will flatten any level of nested arrays

    // Check for required inputs
    if (!trafficLineId || !flatRisks.length) {
        return NextResponse.json({ message: 'Missing required fields or no risks provided.' });
    }
    const allRisks = [
        ...flatRisks.map((hazard: any) => ({
            ...hazard,
            controlMeasures: hazard.controlMeasures.map((measure: any) => ({ measure }))
        })),
        ...BASIC_HAZARDS.map(hazard => ({
            ...hazard,
            controlMeasures: hazard.controlMeasures.map(measure => ({ measure }))
        }))
    ];

    try {
        // Prepare risks and control measures for database insertion
        const riskCreations = allRisks.map(risk => db.risk.create({
            data: {
                trafficLine: { connect: { id: trafficLineId } },
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
                    create: risk.controlMeasures.map((cm: any) => ({ measure: cm.measure }))
                }
            }
        }));


        // Execute all database operations as a transaction
        const results = await db.$transaction(riskCreations);
        return NextResponse.json(results);


    } catch (error) {
        console.error('Error creating risks:', error);
        return NextResponse.json({ message: 'Internal server error' });
    }
}

export async function GET(req: NextRequest) {
    try {
        const trafficLineId = await req.nextUrl.searchParams.get('traffic_line_id')

        const risks = await db.risk.findMany({
            orderBy: {
                questionId: 'asc'
            },
            where: {
                trafficLineId
            },
            include: {
                controlMeasures: true
            }
        })

        return NextResponse.json(risks)


    } catch (error) {
        console.error('Error getting risks:', error);
        return NextResponse.json({ message: 'Internal server error' });
    }
}

export async function PATCH(req: NextRequest) {
    const { trafficLineId, risks } = await req.json();

    const flatRisks = risks.flat(Infinity); // This will flatten any level of nested arrays

    // Check for required inputs
    if (!trafficLineId) {

        return NextResponse.json({ message: 'Missing required fields or no risks provided.' });
    }

    // let allRisks;

    // const allRisks = [
    //     ...flatRisks.map((hazard: any) => ({
    //         ...hazard,
    //         controlMeasures: hazard.controlMeasures.map((measure: any) => ({ measure }))
    //     })),

    // ];

    let allRisks;
    if (flatRisks.length === 0) {
        // Use BASIC_HAZARDS if no risks are provided
        allRisks = [
            ...BASIC_HAZARDS.map(hazard => ({
                ...hazard,
                controlMeasures: hazard.controlMeasures.map(measure => ({ measure }))
            }))
        ]
    } else {
        // Use provided risks otherwise
        allRisks = [
            ...flatRisks.map((hazard: any) => ({
                ...hazard,
                controlMeasures: hazard.controlMeasures.map((measure: any) => ({ measure }))
            })),
            ...BASIC_HAZARDS.map(hazard => ({
                ...hazard,
                controlMeasures: hazard.controlMeasures.map(measure => ({ measure }))
            }))
        ]
    }

    try {
        // Begin a transaction

        // First, delete dependent records (e.g., Control Measures)
        await db.controlMeasure.deleteMany({
            where: {
                risk: {
                    trafficLineId: trafficLineId
                }
            }
        });
        console.log('testasdasdasd');

        // Now, delete the risks
        await db.risk.deleteMany({
            where: {
                trafficLineId: trafficLineId
            }
        });

        const riskCreations = allRisks.map(risk => db.risk.create({
            data: {
                trafficLine: { connect: { id: trafficLineId } },
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
                    create: risk.controlMeasures.map((cm: any) => ({ measure: cm.measure }))
                }
            }
        }));

        // Execute all database operations as a transaction
        const results = await db.$transaction(riskCreations);
        return NextResponse.json(results);
    } catch (error) {
        console.error('Error replacing risks:', error);
        return NextResponse.json({ message: 'Internal server error', error: error });
    }
}