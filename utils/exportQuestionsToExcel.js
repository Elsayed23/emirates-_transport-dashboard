import * as XLSX from 'xlsx-js-style';
import { saveAs } from 'file-saver';

export const exportQuestionsToExcel = (data, filename) => {
    // Transform the data
    const transformedData = data.map((item, index) => [
        { v: index + 1, t: 'n', s: { alignment: { vertical: 'center', horizontal: 'center' }, font: { bold: true } } },
        { v: `${item.question.question}\n${item.question.translatedQuestion}`, t: 's', s: { alignment: { vertical: 'center', horizontal: 'center', wrapText: true }, font: { sz: 12 } } },
        { v: item.response, t: 's', s: { alignment: { vertical: 'center', horizontal: 'center' }, font: { sz: 12 } } },
    ]);

    // Define the headers
    const headers = [
        'No.',
        'Question (Arabic/English)',
        'Response',
    ];

    // Prepare the data for the worksheet
    const worksheetData = [headers, ...transformedData];

    // Create the worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Define column widths
    worksheet['!cols'] = [
        { wpx: 50 },  // No.
        { wpx: 500 }, // Question (Arabic/English)
        { wpx: 150 }  // Response
    ];

    // Define styles for headers
    const headerStyle = {
        alignment: { vertical: 'center', horizontal: 'center', wrapText: true },
        font: { bold: true, sz: 12, color: { rgb: 'FFFFFF' } },
        fill: { fgColor: { rgb: '172554' } },
        border: {
            top: { style: 'thin', color: { rgb: "000000" } },
            bottom: { style: 'thin', color: { rgb: "000000" } },
            left: { style: 'thin', color: { rgb: "000000" } },
            right: { style: 'thin', color: { rgb: "000000" } },
        },
    };

    // Apply header styles
    for (let C = 0; C <= 2; C++) {
        const cellAddress = XLSX.utils.encode_cell({ c: C, r: 0 });
        worksheet[cellAddress].s = headerStyle;
    }

    // Create the workbook with RTL direction
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
