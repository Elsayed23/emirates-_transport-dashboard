import * as XLSX from 'xlsx-js-style';
import { saveAs } from 'file-saver';

export const exportRisksToExcel = (data, filename) => {
    // Transform the data to flatten the control measures
    const transformedData = data.map(item => {
        const controlMeasures = item.controlMeasures.map(measure => measure.measure).join('\n\n'); // Add extra newline for more space
        return {
            ...item,
            controlMeasures,
        };
    });

    // Define the headers in Arabic
    const headers = [
        'م',
        'سبب الخطر',
        'النشاط',
        'نوع النشاط',
        'مصدر الخطر',
        'الخطر',
        'الأشخاص المعرضين للخطر',
        'الإصابة المحتملة /الضرر',
        'تقييم الخطر',
        'تدابير الرقابة الحالية',
        'المخاطر المتبقية'
    ];

    // Prepare the data for worksheet
    const worksheetData = [headers, ...transformedData.map((item, index) => [
        { v: index + 1, t: 'n', s: { alignment: { wrapText: true, horizontal: 'center', readingOrder: 2 } } },
        { v: item.causeOfRisk, t: 's', s: { alignment: { wrapText: true, horizontal: 'center', readingOrder: 2 } } },
        { v: item.activity, t: 's', s: { alignment: { wrapText: true, horizontal: 'center', readingOrder: 2 } } },
        { v: item.typeOfActivity, t: 's', s: { alignment: { wrapText: true, horizontal: 'center', readingOrder: 2 } } },
        { v: item.hazardSource, t: 's', s: { alignment: { wrapText: true, horizontal: 'center', readingOrder: 2 } } },
        { v: item.risk, t: 's', s: { alignment: { wrapText: true, horizontal: 'center', readingOrder: 2 } } },
        { v: item.peopleExposedToRisk, t: 's', s: { alignment: { wrapText: true, horizontal: 'center', readingOrder: 2 } } },
        { v: item.expectedInjury, t: 's', s: { alignment: { wrapText: true, horizontal: 'center', readingOrder: 2 } } },
        { v: item.riskAssessment, t: 's', s: { alignment: { wrapText: true, horizontal: 'center', readingOrder: 2 } } },
        { v: item.controlMeasures, t: 's', s: { alignment: { wrapText: true, horizontal: 'center', readingOrder: 2, padding: { top: 10, bottom: 10 } } } }, // Increase padding
        { v: item.residualRisks, t: 's', s: { alignment: { wrapText: true, horizontal: 'center', readingOrder: 2 } } }
    ])];

    // Create a new workbook and a worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);


    // Define styles
    const headerStyle = {
        font: { name: 'Arial', sz: 12, bold: true, color: { rgb: "FFFFFF" } },
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
        font: { name: 'Arial', sz: 12 },
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
        font: { name: 'Arial', sz: 12 },
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
        { wpx: 30 }, // Column for 'م'
        { wpx: 100 }, // Column for 'سبب الخطر'
        { wpx: 150 }, // Column for 'النشاط'
        { wpx: 100 }, // Column for 'نوع النشاط'
        { wpx: 150 }, // Column for 'مصدر الخطر'
        { wpx: 200 }, // Column for 'الخطر'
        { wpx: 150 }, // Column for 'الأشخاص المعرضين للخطر'
        { wpx: 150 }, // Column for 'الإصابة المحتملة /الضرر'
        { wpx: 100 }, // Column for 'تقييم الخطر'
        { wpx: 300 }, // Column for 'تدابير الرقابة الحالية'
        { wpx: 100 }  // Column for 'المخاطر المتبقية'
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
