import * as XLSX from 'xlsx-js-style';
import { saveAs } from 'file-saver';

export const exportRisksToExcel = (data, filename) => {
    // Transform the data to flatten the control measures and split Arabic/English text
    const transformedData = data.map((entry, entryIndex) => {
        return entry.answers.map((answer, answerIndex) => {
            const controlMeasuresAr = answer.controlMeasures ? answer.controlMeasures.map(measure => measure.ar).join('\n\n') : '';
            const controlMeasuresEn = answer.controlMeasures ? answer.controlMeasures.map(measure => measure.en).join('\n\n') : '';
            return {
                index: entryIndex + 1,
                causeOfRisk: splitText(answer.causeOfRisk || ''),
                activity: splitText(answer.activity || ''),
                typeOfActivity: splitText(answer.typeOfActivity || ''),
                hazardSource: splitText(answer.hazardSource || ''),
                risk: splitText(answer.risk || ''),
                peopleExposedToRisk: splitText(answer.peopleExposedToRisk || ''),
                expectedInjury: splitText(answer.expectedInjury || ''),
                riskAssessment: answer.riskAssessment || '',
                controlMeasuresAr: controlMeasuresAr || '',
                controlMeasuresEn: controlMeasuresEn || '',
                residualRisks: answer.residualRisks || ''
            };
        });
    }).flat();

    // Helper function to split Arabic and English text
    function splitText(text) {
        const [ar, en] = text.split('|').map(part => part.trim());
        return `${ar}\n${en}`; // Place Arabic on top and English below
    }


    // Define the headers in Arabic and English
    const headers = [
        'No',
        'سبب الخطر \n Cause of risk',
        'النشاط \n Activity',
        'نوع النشاط \n Type of Activity',
        'مصدر الخطر \n Hazard',
        'الخطر \n Risk',
        'الأشخاص المعرضين للخطر \n People Exposed to Risk',
        'الإصابة المحتملة /الضرر \n Expected Injury',
        'LR',
        'تقييم الخطر \n R S L',
        'تدابير الرقابة الحالية',
        'Existing Control Measures',
        'المخاطر المتبقية \n Residual Risk ALARP'
    ];

    // Prepare the data for the worksheet
    const worksheetData = [headers, ...transformedData.map(item => [
        { v: item.index, t: 'n', s: { alignment: { wrapText: true, horizontal: 'center', vertical: 'center', readingOrder: 2 } } },
        { v: item.causeOfRisk, t: 's', s: { alignment: { wrapText: true, horizontal: 'center', vertical: 'center', readingOrder: 2 } } },
        { v: item.activity, t: 's', s: { alignment: { wrapText: true, horizontal: 'center', vertical: 'center', readingOrder: 2 } } },
        { v: item.typeOfActivity, t: 's', s: { alignment: { wrapText: true, horizontal: 'center', vertical: 'center', readingOrder: 2 } } },
        { v: item.hazardSource, t: 's', s: { alignment: { wrapText: true, horizontal: 'center', vertical: 'center', readingOrder: 2 } } },
        { v: item.risk, t: 's', s: { alignment: { wrapText: true, horizontal: 'center', vertical: 'center', readingOrder: 2 } } },
        { v: item.peopleExposedToRisk, t: 's', s: { alignment: { wrapText: true, horizontal: 'center', vertical: 'center', readingOrder: 2 } } },
        { v: item.expectedInjury, t: 's', s: { alignment: { wrapText: true, horizontal: 'center', vertical: 'center', readingOrder: 2 } } },
        { v: '', t: 's', s: { alignment: { wrapText: true, horizontal: 'center', vertical: 'center', readingOrder: 2 } } }, // Placeholder for 'LR'
        { v: item.riskAssessment, t: 's', s: { alignment: { wrapText: true, horizontal: 'center', vertical: 'center', readingOrder: 2 } } },
        { v: item.controlMeasuresAr, t: 's', s: { alignment: { wrapText: true, horizontal: 'center', vertical: 'center', readingOrder: 2, padding: { top: 10, bottom: 10 } } } }, // Arabic Control Measures
        { v: item.controlMeasuresEn, t: 's', s: { alignment: { wrapText: true, horizontal: 'center', vertical: 'center', readingOrder: 2, padding: { top: 10, bottom: 10 } } } }, // English Control Measures
        { v: item.residualRisks, t: 's', s: { alignment: { wrapText: true, horizontal: 'center', vertical: 'center', readingOrder: 2 } } }
    ])];

    // Create a new workbook and a worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Define styles
    const headerStyle = {
        font: { sz: 11, color: { rgb: "FFFFFF" } },
        alignment: { vertical: 'center', horizontal: 'center', readingOrder: 2, wrapText: true },
        border: {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' },
        },
        fill: { fgColor: { rgb: "172554" } },
        padding: { top: 15, bottom: 15, left: 15, right: 15 } // increased padding
    };

    const dataStyle1 = {
        font: { sz: 11 },
        alignment: { vertical: 'center', horizontal: 'center', readingOrder: 2, wrapText: true },
        border: {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' },
        },
        padding: { top: 10, bottom: 10, left: 5, right: 5 }
    };

    const dataStyle2 = {
        font: { sz: 11 },
        alignment: { vertical: 'center', horizontal: 'center', readingOrder: 2, wrapText: true },
        border: {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' },
        },
        fill: { fgColor: { rgb: "B4C7E7" } }, // light grey background
        padding: { top: 10, bottom: 10, left: 5, right: 5 }
    };

    // Apply styles to the headers and data cells
    worksheet['!cols'] = [
        { wpx: 30 }, // Column for 'No'
        { wpx: 100 }, // Column for 'سبب الخطر Cause of risk'
        { wpx: 150 }, // Column for 'النشاط Activity'
        { wpx: 100 }, // Column for 'نوع النشاط Type of Activity'
        { wpx: 150 }, // Column for 'مصدر الخطر Hazard'
        { wpx: 200 }, // Column for 'الخطر Risk'
        { wpx: 150 }, // Column for 'الأشخاص المعرضين للخطر People Exposed to Risk'
        { wpx: 150 }, // Column for 'الإصابة المحتملة /الضرر Expected Injury'
        { wpx: 20 }, // Column for 'LR'
        { wpx: 50 }, // Column for 'تقييم الخطر R S L'
        { wpx: 300 }, // Column for 'تدابير الرقابة الحالية (عربي) Existing Control Measures (Arabic)'
        { wpx: 300 }, // Column for 'تدابير الرقابة الحالية (إنجليزي) Existing Control Measures (English)'
        { wpx: 70 }  // Column for 'المخاطر المتبقية Residual Risk ALARP'
    ];

    const range = XLSX.utils.decode_range(worksheet['!ref']);
    for (let C = range.s.c; C <= range.e.c; ++C) {
        const headerAddress = XLSX.utils.encode_col(C) + "1"; // first row (headers)
        if (worksheet[headerAddress]) {
            worksheet[headerAddress].s = headerStyle;
        }

        for (let R = range.s.r + 1; R <= range.e.r; ++R) { // data rows
            const cellAddress = XLSX.utils.encode_cell({ c: C, r: R });
            if (worksheet[cellAddress]) {
                worksheet[cellAddress].s = (R % 2 === 0) ? dataStyle1 : dataStyle2; // alternate row styles
            }
        }
    }


    // Append worksheet to workbook
    const workbook = {
        Sheets: {
            'data': worksheet
        },
        SheetNames: ['data'],
        Workbook: {
            Views: [
                { RTL: true }
            ]
        }
    };

    // Write workbook to binary array
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    // Save the file
    saveAs(blob, `${filename}.xlsx`);
};
