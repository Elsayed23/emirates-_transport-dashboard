import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

const BASIC_HAZARDS = [
    {
        questionId: 38,
        question: 'اساسي',
        translatedQuestion: 'BASIC',
        answer: 'basic',
        causeOfRisk: "الطريق | The road",
        activity: "نقل الطلاب من البيت إلى المدرسة وبالعكس | Transport student from home to school and vice versa",
        typeOfActivity: "روتيني | Routine",
        hazardSource: "صعود ونزول الطلبة من وإلى الحافلة المدرسية في أماكن التحميل والتنزيل | Students boarding and disembarking from and to the school bus in the allocated areas",
        risk: "تعرض الطلاب للدهس من قبل الحافلة المدرسية أثناء الصعود أو النزول | Students may be at risk of run over accidents by the school bus while boarding or disembarking the bus",
        peopleExposedToRisk: "الطلاب | Students",
        expectedInjury: "إصابات متفاوتة، وفيات | Various injuries, fatalities",
        riskAssessment: "3/4/2",
        controlMeasures: {
            ar: [
                "تركيب كاميرات على زوايا مختلفة من الحافلة لتأمين رؤية واضحة للسائق أثناء تحميل وتنزيل الطلاب",
                "الصيانة الدورية للحافلات شاملة الكاميرات والمرايا الجانبية وذراع التوقف",
                "إعطاء الوقت الكافي للطلاب أثناء الصعود أو النزول والتأكيد على السائقين بعدم السير إلا عند التأكد من جلوس الطلاب في مقاعدهم وعدم وجود أي طالب بالخارج قرب الحافلة",
                "المراقبة المستمرة للحافلات أثناء تحميل وتنزيل الطلاب من قبل منسقي الحركة للتأكد من اتباع السائق لإجراءات السلامة",
                "وجود مشرفي السلامة في الحافلات المدرسية لمساعدة الطلاب عند الصعود أو النزول وإيصالهم للمكان الآمن",
                "توعية الطلاب حول القاعدة الذهبية والتي من شأنها توفير المعلومات اللازمة لهم حول الإجراءات الآمنة عند الصعود أو النزول",
                "توفير صندوق الإسعافات الأولية لمعالجة الإصابات الطفيفة في حال حدوثها",
                "تدريب وتوعية السائقين والمشرفات بإجراءات الطوارئ أثناء الحوادث"
            ],
            en: [
                "Installing Cameras: Installing cameras at different angles of the bus to provide a clear view for the driver during loading and unloading students.",
                "Regular maintenance of buses including cameras, side mirrors, and stop arms.",
                "Giving students enough time to get on or off and ensuring drivers do not move until students are seated and there are no students outside near the bus.",
                "Continuous monitoring of buses during loading and unloading by traffic coordinators to ensure drivers follow safety procedures.",
                "Having safety supervisors on school buses to assist students in getting on or off and to escort them to a safe place.",
                "Educating students about the golden rule to provide them with necessary information on safe procedures when getting on or off.",
                "Providing a first aid kit to treat minor injuries if they occur.",
                "Training and educating drivers and supervisors on emergency procedures during accidents."
            ]
        },
        residualRisks: "1/4/4"
    },
    {
        questionId: 39,
        question: 'اساسي',
        translatedQuestion: 'BASIC',
        answer: 'basic',
        causeOfRisk: "الطريق | The road",
        activity: "نقل الطلاب من البيت إلى المدرسة وبالعكس | Transport student from home to school and vice versa",
        typeOfActivity: "روتيني | Routine",
        hazardSource: "التوقف المفاجئ للحافلة | Harsh brakes",
        risk: "تعرض الركاب في الحافلة للارتطام بالمقاعد أو الوقوع من المقاعد داخل الحافلة | Students, driver, and safety escorts may be injured from hitting seats in front of them or falling from seats in the bus",
        peopleExposedToRisk: "جميع ركاب الحافلة | All passengers",
        expectedInjury: "إصابات متفاوتة، وفيات | Various injuries, fatalities",
        riskAssessment: "4/3/12",
        controlMeasures: {
            ar: [
                "تزويد الحافلات بمثبت السرعة بحيث لا تزيد عن 80 كم للساعة",
                "تركيب أحزمة الامان على المقاعد في جميع الحافلات",
                "توفير صناديق الإسعافات الأولية لاستخدامها عند الحاجة",
                "التدريب الدوري للسائقين على الالتزام بقواعد المرور",
                "تأكد مشرفي السلامة بالحافلات من جلوس الطلبة بمقاعدهم واستخدام أحزمة الأمان في المقاعد",
                "مراقبة المركبات في الطرق بواسطة منسقي الحركة",
                "تطبيق إجراءات عقابية وأخرى تشجيعية لالتزام السائقين بالسرعة وقواعد المرور",
                "تطبيق إجراءات انضباطية لسلوكيات الطلاب داخل الحافلات"
            ],
            en: [
                "Speed Control: Equipping buses with speed limiters so that they do not exceed 80 km/h.",
                "Installing seat belts on seats in all buses.",
                "Providing first aid kits for use when needed.",
                "Regular training for drivers on traffic rules compliance.",
                "Safety supervisors in buses ensuring students are seated and using seat belts.",
                "Monitoring vehicles on the roads by traffic coordinators.",
                "Applying disciplinary and encouraging measures to ensure drivers adhere to speed limits and traffic rules.",
                "Implementing disciplinary procedures for student behavior inside buses."
            ]
        },
        residualRisks: "2/3/6"
    },
    {
        questionId: 40,
        question: 'اساسي',
        translatedQuestion: 'BASIC',
        answer: 'basic',
        causeOfRisk: "الطريق | The road",
        activity: "نقل الطلاب من البيت إلى المدرسة وبالعكس | Transport student from home to school and vice versa",
        typeOfActivity: "روتيني | Routine",
        hazardSource: "الحوادث المرورية | Traffic accidents",
        risk: "تعرض ركاب الحافلة أو مستخدمي الطريق لإصابات مختلفة | Passengers or road users may suffer injuries",
        peopleExposedToRisk: "جميع ركاب الحافلة، مستخدمي الطريق | All bus passengers, road users",
        expectedInjury: "إصابات متفاوتة، وفيات | Various injuries, fatalities",
        riskAssessment: "3/5/15",
        controlMeasures: {
            ar: [
                "تركيب أحزمة الأمان على المقاعد في جميع الحافلات",
                "تزويد الحافلات بمثبت السرعة بحيث لا تزيد عن 80 كم للساعة",
                "جميع الحافلات مزودة بأجهزة تتبع يمكن من خلالها مراقبة سرعة الحافلات من قبل المحطات",
                "جميع الحافلات تخضع لصيانة دورية للتأكد من أنها آمنة للسير على الطرق",
                "تدريب جميع السائقين وبشكل دوري على القواعد المرورية (الالتزام بالسرعات المحددة، الإشارات الضوئية، وعدم التجاوز إطلاقاً، عدم القيادة تحت تأثير المشروبات الكحولية، عدم عرقلة حركة السير أثناء التوقف لتحميل وتنزيل الطلبة وعدم الوقوف في الأماكن الممنوعة، إعطاء أولوية السير لمستحقيها قانونياً، استخدام إشارات التنبيه، إعطاء الأولوية للمشاة بالعبور، الخ..)",
                "قيام منسقي الحركة من مراقبة الحافلات (أثناء الحركة والسكون) بشكل دوري للتأكد من اتباع السائق لقواعد المرور بدقة",
                "التأكيد على السائقين بعدم الرجوع للخلف لأي سبب إلا بالحالات الطارئة",
                "تطبيق إجراءات عقابية وأخرى تشجيعية لالتزام السائقين بالسرعة وقواعد المرور",
                "تدريب وتوعية السائقين والمشرفات بإجراءات الطوارئ حسب خطة الطوارئ"
            ],
            en: [
                "Seat Belts and Speed Control: Installing seat belts on seats in all buses.",
                "Equipping buses with speed limiters so that they do not exceed 80 km/h.",
                "All buses are equipped with tracking devices to monitor bus speed from stations.",
                "All buses undergo regular maintenance to ensure they are safe to drive.",
                "Regular training for all drivers on traffic rules (adherence to speed limits, traffic signals, no overtaking, no driving under the influence of alcohol, no obstructing traffic when stopping to load or unload students, no parking in prohibited areas, giving priority to pedestrians, using warning signals, giving way to pedestrians, etc.).",
                "Traffic coordinators regularly monitor buses (during movement and stationary) to ensure drivers follow traffic rules accurately.",
                "Emphasizing to drivers not to reverse for any reason except in emergencies.",
                "Applying disciplinary and encouraging measures to ensure drivers adhere to speed limits and traffic rules.",
                "Training and educating drivers and supervisors on emergency procedures according to the emergency plan."
            ]
        },
        residualRisks: "1/5/5"
    },
    {
        questionId: 41,
        question: 'اساسي',
        translatedQuestion: 'BASIC',
        answer: 'basic',
        causeOfRisk: "الطريق | The road",
        activity: "نقل الطلاب من البيت إلى المدرسة وبالعكس | Transport student from home to school and vice versa",
        typeOfActivity: "روتيني | Routine",
        hazardSource: "القيادة في المطر | Driving in rain",
        risk: "خطر انزلاق الحافلات بسبب حالة الطريق الزلقة إضافة إلى تدني مستوى الرؤية ما قد يسبب الحوادث المرورية | Risk of slipping due to road slippery condition, in addition to low visibility which may cause accidents",
        peopleExposedToRisk: "جميع ركاب الحافلة، مستخدمي الطريق | All bus passengers, road users",
        expectedInjury: "إصابات متفاوتة، وفيات | Various injuries, fatalities",
        riskAssessment: "3/5/15",
        controlMeasures: {
            ar: [
                "الصيانة الدورية للحافلات لتأهيلها على السير في الحالات الجوية المختلفة",
                "تركيب أحزمة الامان على المقاعد في جميع الحافلات",
                "يتم تدريب السائقين بشكل دوري في خطة الطوارئ على القيادة في المطر",
                "تعليق الرحلات (إن لزم) في حالات الاجواء العاصفة بالتنسيق مع المدرسة",
                "الصيانة الدورية للحافلات لتأهيلها على السير في الحالات الجوية المختلفة",
                "تعليق الرحلات (إن لزم) في الضباب بالتنسيق مع المدارس",
                "تدريب السائقين على التعامل مع الضباب في خطة الطوارئ (السير ببطء وحذر أكبر، عدم استعمال الأضواء الرباعية في حالة السير، التوقف جانباً في حال الضباب الكثيف مع تشغيل الأضواء الرباعية وإعلام منسقي الحركة عند التوقف)"
            ],
            en: [
                "Weather Adaptation: Regular maintenance of buses to ensure they are fit for driving in different weather conditions.",
                "Installing seat belts on seats in all buses.",
                "Drivers are regularly trained in the emergency plan on driving in the rain.",
                "Suspending trips (if necessary) during stormy weather in coordination with the school.",
                "Regular maintenance of buses to ensure they are fit for driving in different weather conditions.",
                "Suspending trips (if necessary) in foggy weather in coordination with schools.",
                "Training drivers on dealing with fog in the emergency plan (driving slowly and more cautiously, not using hazard lights while driving, stopping on the side in dense fog with hazard lights on, and informing traffic coordinators when stopping)."
            ]
        },
        residualRisks: "1/5/5"
    },
    {
        questionId: 42,
        question: 'اساسي',
        translatedQuestion: 'BASIC',
        answer: 'basic',
        causeOfRisk: "الطريق | The road",
        activity: "نقل الطلاب من البيت إلى المدرسة وبالعكس | Transport student from home to school and vice versa",
        typeOfActivity: "روتيني | Routine",
        hazardSource: "القيادة في الضباب | Driving in fog",
        risk: "خطر تدني مستوى الرؤية ما قد يسبب الحوادث المرورية | Risk of low visibility which may cause accidents",
        peopleExposedToRisk: "جميع ركاب الحافلة، مستخدمي الطريق | All bus passengers, road users",
        expectedInjury: "إصابات متفاوتة، وفيات | Various injuries, fatalities",
        riskAssessment: "3/5/15",
        controlMeasures: {
            ar: [
                "الصيانة الدورية للحافلات لتأهيلها على السير في الحالات الجوية المختلفة",
                "تعليق الرحلات (إن لزم) في الضباب بالتنسيق مع المدارس",
                "تدريب السائقين على التعامل مع الضباب في خطة الطوارئ (السير ببطء وحذر أكبر، عدم استعمال الأضواء الرباعية في حالة السير، التوقف جانباً في حال الضباب الكثيف مع تشغيل الأضواء الرباعية وإعلام منسقي الحركة عند التوقف)"
            ],
            en: [
                "Fog Management: Regular maintenance of buses to ensure they are fit for driving in different weather conditions.",
                "Suspending trips (if necessary) in foggy weather in coordination with schools.",
                "Training drivers on dealing with fog in the emergency plan (driving slowly and more cautiously, not using hazard lights while driving, stopping on the side in dense fog with hazard lights on, and informing traffic coordinators when stopping)."
            ]
        },
        residualRisks: "1/5/5"
    },
    {
        questionId: 43,
        question: 'اساسي',
        translatedQuestion: 'BASIC',
        answer: 'basic',
        causeOfRisk: "الطريق | The road",
        activity: "نقل الطلاب من البيت إلى المدرسة وبالعكس | Transport student from home to school and vice versa",
        typeOfActivity: "روتيني | Routine",
        hazardSource: "القيادة الليلية المتأخرة أو المبكرة جداً | Late night/ Early morning Driving",
        risk: "عدم وضوح الرؤية أثناء الظلام قد تتسبب بالحوادث المرورية | Inadequate vision in the dark may cause traffic accidents",
        peopleExposedToRisk: "جميع ركاب الحافلة، مستخدمي الطريق | All bus passengers, road users",
        expectedInjury: "إصابات متفاوتة، وفيات | Various injuries, fatalities",
        riskAssessment: "3/5/15",
        controlMeasures: {
            ar: [
                "الصيانة الدورية الوقائية لجميع الحافلات لتأهيلها للسير بشكل آمن أثناء الظلام",
                "وجود شريط عاكس على الهيكل الخارجي للحافلات المدرسية لتنبيه مستخدمي الطريق",
                "تركيب أحزمة أمان للمقاعد في جميع الحافلات المدرسية",
                "تدريب السائقين على القواعد المرورية للقيادة الآمنة أثناء الظلام",
                "التفقد اليومي للحافلات من قبل السائقين للتأكد من عمل الأضواء وإشارات التنبيه"
            ],
            en: [
                "Driving at Night: Preventive regular maintenance for all buses to ensure safe driving at night.",
                "Reflective strips on the exterior of school buses to alert road users.",
                "Installing seat belts on seats in all school buses.",
                "Training drivers on traffic rules for safe driving at night.",
                "Daily inspection of buses by drivers to ensure lights and warning signals are working."
            ]
        },
        residualRisks: "1/5/5"
    },
    {
        questionId: 44,
        question: 'اساسي',
        translatedQuestion: 'BASIC',
        answer: 'basic',
        causeOfRisk: "الطريق | The road",
        activity: "نقل الطلاب من البيت إلى المدرسة وبالعكس | Transport student from home to school and vice versa",
        typeOfActivity: "روتيني | Routine",
        hazardSource: "عبور مستخدمي الطريق بغير الأماكن المخصصة | Crossing of road users in undesignated areas",
        risk: "تعرض مستخدمي الطريق لحالات الدهس | Road users are exposed to run over accidents",
        peopleExposedToRisk: "مستخدمي الطريق | Road users",
        expectedInjury: "إصابات متفاوتة، وفيات | Various injuries, fatalities",
        riskAssessment: "4/4/16",
        controlMeasures: {
            ar: [
                "تزويد الحافلات بمثبت السرعة بحيث لا تزيد عن 80 كم للساعة",
                "تدريب السائقين على قواعد السلامة المرورية"
            ],
            en: [
                "Speed Control: Equipping buses with speed limiters so that they do not exceed 80 km/h.",
                "Training drivers on road safety rules."
            ]
        },
        residualRisks: "1/4/4"
    },
    {
        questionId: 45,
        question: 'اساسي',
        translatedQuestion: 'BASIC',
        answer: 'basic',
        causeOfRisk: "الطريق | The road",
        activity: "نقل الطلاب من البيت إلى المدرسة وبالعكس | Transport student from home to school and vice versa",
        typeOfActivity: "روتيني | Routine",
        hazardSource: "القيادة اثناء العواصف والامطار الشديدة وجريان الأودية والفيضانات | Driving during storms, heavy rain, valleys, and floods",
        risk: "تعرض الحافلة للغرق، الانحراف، التدهور، الانجراف، او الحوادث نتيجة الفيضانات | The bus has been drowned, swerved, deteriorated, drifting, or had an accident because of flooding",
        peopleExposedToRisk: "جميع ركاب الحافلة | All bus passengers",
        expectedInjury: "غرق، إصابات متفاوتة،  وفيات | Drowning, various injuries, fatalities",
        riskAssessment: "1/5/5",
        controlMeasures: {
            ar: [
                "توجيه السائقين بضرورة إيقاف الحافلة في مكان آمن وعدم تعريض المنقولين لأي خطر ممكن في حال مواجهة سيناريو مشابه",
                "مراجعة خطوط السير لتفادي دخول الحافلات للأماكن الخطرة كالأودية ومجاري السيول",
                "اتباع الارشادات الصادرة عن الجهات المختصة",
                "تدريب وتوعية السائقين ومشرفي النقل والسلامة والموظفين على اجراءات الطوارئ"
            ],
            en: [
                "Flood Management: Guiding drivers to stop the bus in a safe place and not expose transported students to any potential danger in the event of a similar scenario.",
                "Reviewing routes to avoid buses entering dangerous areas such as valleys and floodways.",
                "Following instructions issued by the competent authorities.",
                "Training and educating drivers, transport and safety supervisors, and employees on emergency procedures."
            ]
        },
        residualRisks: "1/5/5"
    },
    {
        questionId: 46,
        question: 'اساسي',
        translatedQuestion: 'BASIC',
        answer: 'basic',
        causeOfRisk: "الطريق | The road",
        activity: "نقل الطلاب من البيت إلى المدرسة وبالعكس | Transport student from home to school and vice versa",
        typeOfActivity: "روتيني | Routine",
        hazardSource: "تقليل السرعة بشكل مفاجئ او التوقف المفاجئ | Suddenly reduce the speed or harsh brake",
        risk: "صدم الحافلة من الخلف من قبل المركبات الأخرى | Hitting the bus from rear by other vehicles",
        peopleExposedToRisk: "جميع ركاب الحافلة | All bus passengers",
        expectedInjury: "إصابات متفاوتة | Various injuries",
        riskAssessment: "3/3/9",
        controlMeasures: {
            ar: [
                "تركيب أحزمة الامان على المقاعد في جميع الحافلات",
                "تدريب السائقين على القيادة الدفاعية",
                "مراقبة المركبات في الطرق بواسطة منسقي الحركة",
                "تأكد السائقين والمشرفات من جلوس الطلاب في مقاعدهم",
                "توفير صندوق الإسعافات الأولية لاستخدامها عند الحاجة"
            ],
            en: [
                "Seat Belts and Defensive Driving: Installing seat belts on seats in all buses.",
                "Training drivers on defensive driving.",
                "Monitoring vehicles on the roads by traffic coordinators.",
                "Drivers and supervisors ensuring students are seated in their seats.",
                "Providing a first aid kit for use when needed."
            ]
        },
        residualRisks: "2/3/6"
    },
    {
        questionId: 47,
        question: 'اساسي',
        translatedQuestion: 'BASIC',
        answer: 'basic',
        causeOfRisk: "الطريق | The road",
        activity: "نقل الطلاب من البيت إلى المدرسة وبالعكس | Transport student from home to school and vice versa",
        typeOfActivity: "روتيني | Routine",
        hazardSource: "صعود ونزول مشرفي النقل والسلامة في مناطق التحميل والتنزيل (أمام المدارس والمنازل) | Boarding and Disembarking safety escorts (boarding zone, schools & houses)",
        risk: "تعرض مشرفي النقل والسلامة للدهس من قبل الحافلة المدرسية أو المركبات الأخرى على الطريق | Safety escorts may be at risk of run over accidents by school bus or other vehicles while boarding or disembarking",
        peopleExposedToRisk: "مشرفي النقل والسلامة | Safety escorts",
        expectedInjury: "إصابات متفاوتة، وفيات | Various injuries, fatalities",
        riskAssessment: "3/4/12",
        controlMeasures: {
            ar: [
                "ارتداء السترة العاكسة من قبل مشرفي النقل والسلامة أثناء العمل",
                "استخدام ذراع التوقف لتحذير السائقين الآخرين على الطريق أثناء تحميل وتنزيل الطلبة",
                "تركيب كاميرات على زوايا مختلفة من الحافلة لتأمين رؤية واضحة للسائق لحركة السير أثناء التنزيل والتحميل",
                "المراجعة الدورية لخطوط السير لتفادي دخول الحافلات وتوقفها في الأماكن الخطرة على سلامة المنقولين",
                "الصيانة الدورية للحافلات شاملة الكاميرات والمرايا الجانبية وذراع التوقف",
                "وقوف الحافلة على نفس جهة المدرسة/البيت لتفادي قطع الشارع (داخل الأحياء السكنية) أثناء التحميل والتنزيل إن أمكن",
                "توفير صندوق الإسعافات الأولية لاستخدامها عند الحاجة",
                "المراقبة المستمرة للحافلات أثناء تنزيل وتحميل الطلاب من قبل منسقي الحركة للتأكد من اتباع السائق والمشرفين لإجراءات السلامة"
            ],
            en: [
                "Reflective Vests and Stop Arm Use: Safety and transport supervisors wearing reflective vests while working.",
                "Using stop arms to warn other drivers on the road during loading and unloading of students.",
                "Installing cameras at different angles of the bus to ensure a clear view for the driver of the traffic during loading and unloading.",
                "Regularly reviewing routes to avoid buses entering and stopping in dangerous places for the safety of the transported students.",
                "Regular maintenance of buses including cameras, side mirrors, and stop arms.",
                "Stopping the bus on the same side as the school/home to avoid crossing the street (within residential areas) during loading and unloading, if possible.",
                "Providing a first aid kit for use when needed.",
                "Continuous monitoring of buses during loading and unloading of students by traffic coordinators to ensure drivers and supervisors follow safety procedures."
            ]
        },
        residualRisks: "1/4/4"
    },
    {
        questionId: 48,
        question: 'اساسي',
        translatedQuestion: 'BASIC',
        answer: 'basic',
        causeOfRisk: "الطريق | The road",
        activity: "نقل الطلاب من البيت إلى المدرسة وبالعكس | Transport student from home to school and vice versa",
        typeOfActivity: "روتيني | Routine",
        hazardSource: "تقليل السرعة بشكل مفاجئ او التوقف المفاجئ | Suddenly reduce the speed or harsh brake",
        risk: "صدم الحافلة من الخلف من قبل المركبات الأخرى | Hitting the bus from rear by other vehicles",
        peopleExposedToRisk: "جميع ركاب الحافلة | All bus passengers",
        expectedInjury: "إصابات متفاوتة | Various injuries",
        riskAssessment: "3/3/9",
        controlMeasures: {
            ar: [
                "تركيب أحزمة الامان على المقاعد في جميع الحافلات",
                "تدريب السائقين على القيادة الدفاعية",
                "مراقبة المركبات في الطرق بواسطة منسقي الحركة",
                "تأكد السائقين والمشرفات من جلوس الطلاب في مقاعدهم",
                "توفير صندوق الإسعافات الأولية لاستخدامها عند الحاجة"
            ],
            en: [
                "Seat Belts and Defensive Driving: Installing seat belts on seats in all buses.",
                "Training drivers on defensive driving.",
                "Monitoring vehicles on the roads by traffic coordinators.",
                "Drivers and supervisors ensuring students are seated in their seats.",
                "Providing a first aid kit for use when needed."
            ]
        },
        residualRisks: "2/3/6"
    }
];



export async function POST(req: Request) {
    const { trafficLineId, questionAnswers } = await req.json();

    if (!trafficLineId || !questionAnswers) {
        return NextResponse.json({ message: 'Missing required fields or no question answers provided.' });
    }

    const allQuestionAnswers = [...questionAnswers, ...BASIC_HAZARDS];

    try {
        // Prepare risks and question answers for database insertion
        const riskCreations = allQuestionAnswers.map((qa: any) => db.trafficLineRisk.create({
            data: {
                trafficLine: { connect: { id: trafficLineId } },
                questionAnswers: {
                    create: {
                        questionId: qa.questionId,
                        question: qa.question,
                        translatedQuestion: qa.translatedQuestion,
                        answer: qa.answer,
                        causeOfRisk: qa.causeOfRisk,
                        activity: qa.activity,
                        typeOfActivity: qa.typeOfActivity,
                        hazardSource: qa.hazardSource,
                        risk: qa.risk,
                        peopleExposedToRisk: qa.peopleExposedToRisk,
                        riskAssessment: qa.riskAssessment,
                        residualRisks: qa.residualRisks,
                        expectedInjury: qa.expectedInjury,
                        controlMeasures: {
                            create: qa.controlMeasures.ar.map((measureAr: string, index: number) => ({
                                measureAr,
                                measureEn: qa.controlMeasures.en[index]
                            }))
                        }
                    }
                }
            }
        }));

        // Execute all database operations as a transaction
        const results = await db.$transaction(riskCreations);
        return NextResponse.json(results);

    } catch (error) {
        console.error('Error creating question answers:', error);
        return NextResponse.json({ message: 'Internal server error' });
    }
}

export async function GET(req: NextRequest) {
    try {
        const trafficLineId = req.nextUrl.searchParams.get('traffic_line_id');

        if (!trafficLineId) {
            return NextResponse.json({ message: 'Missing required traffic_line_id parameter.' });
        }

        const risks = await db.trafficLineRisk.findMany({
            where: {
                trafficLineId,
                questionAnswers: {
                    some: {
                        answer: {
                            in: ['نعم', 'basic']
                        }
                    }
                }
            },
            include: {
                questionAnswers: {
                    include: {
                        controlMeasures: true
                    }
                }
            }
        });

        const allQuestionAnswers = await getAllQuestionAnswers(trafficLineId);

        return NextResponse.json({ risks, allQuestionAnswers });

    } catch (error) {
        console.error('Error getting risks:', error);
        return NextResponse.json({ message: 'Internal server error' });
    }
}
async function getAllQuestionAnswers(trafficLineId: string) {
    const allQuestions = await db.questionAnswer.findMany({
        orderBy: {
            questionId: 'asc'
        },
        where: {
            trafficLineRisk: {
                trafficLineId,
            },
            NOT: {
                answer: 'basic'
            }
        },
        select: {
            question: true,
            questionId: true,
            translatedQuestion: true,
            answer: true
        }
    });
    return allQuestions;
}

export async function PATCH(req: NextRequest) {
    const { trafficLineId, questionAnswers } = await req.json();

    if (!trafficLineId || !questionAnswers) {
        return NextResponse.json({ message: 'Missing required fields or no question answers provided.' });
    }

    const allQuestionAnswers = [...questionAnswers, ...BASIC_HAZARDS];

    try {
        // Delete existing control measures and question answers
        const existingRisks = await db.trafficLineRisk.findMany({
            where: { trafficLineId },
            include: { questionAnswers: true }
        });

        for (const risk of existingRisks) {
            await db.traffikLineControlMeasure.deleteMany({
                where: { questionAnswerId: { in: risk.questionAnswers.map(qa => qa.id) } }
            });

            await db.questionAnswer.deleteMany({
                where: { trafficLineRiskId: risk.id }
            });
        }

        await db.trafficLineRisk.deleteMany({
            where: { trafficLineId }
        });

        // Create new risks and question answers
        const riskCreations = allQuestionAnswers.map((qa: any) => db.trafficLineRisk.create({
            data: {
                trafficLine: { connect: { id: trafficLineId } },
                questionAnswers: {
                    create: {
                        questionId: qa.questionId,
                        question: qa.question,
                        translatedQuestion: qa.translatedQuestion,
                        answer: qa.answer,
                        causeOfRisk: qa.causeOfRisk,
                        activity: qa.activity,
                        typeOfActivity: qa.typeOfActivity,
                        hazardSource: qa.hazardSource,
                        risk: qa.risk,
                        peopleExposedToRisk: qa.peopleExposedToRisk,
                        riskAssessment: qa.riskAssessment,
                        residualRisks: qa.residualRisks,
                        expectedInjury: qa.expectedInjury,
                        controlMeasures: {
                            create: qa.controlMeasures.ar.map((measureAr: string, index: number) => ({
                                measureAr,
                                measureEn: qa.controlMeasures.en[index]
                            }))
                        }
                    }
                }
            }
        }));

        // Execute all database operations as a transaction
        const results = await db.$transaction(riskCreations);
        return NextResponse.json(results);

    } catch (error) {
        console.error('Error replacing question answers:', error);
        return NextResponse.json({ message: 'Internal server error', error: error });
    }
}
