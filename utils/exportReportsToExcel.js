import * as XLSX from 'xlsx-js-style';
import { saveAs } from 'file-saver';

export const exportReportsToExcel = async (data, filename) => {
    const { InspectionSite, city, createdAt, employeeName, jobTitleOfTheEmployee, name, inspections } = data;

    // Define styles
    const titleStyle = {
        font: { name: 'Arial', sz: 14, bold: true, color: { rgb: "FFFFFF" } },
        alignment: { vertical: 'center', horizontal: 'center', wrapText: true },
        border: {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' },
        },
        fill: { fgColor: { rgb: "172554" } }
    };

    const headerStyle = {
        font: { name: 'Arial', sz: 12, bold: true, color: { rgb: "FFFFFF" } },
        alignment: { vertical: 'center', horizontal: 'center', wrapText: true },
        border: {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' },
        },
        fill: { fgColor: { rgb: "172554" } }
    };

    const dataStyle1 = {
        font: { name: 'Arial', sz: 12 },
        alignment: { vertical: 'center', horizontal: 'center', wrapText: true },
        border: {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' }
        }
    };

    const dataStyle2 = {
        font: { name: 'Arial', sz: 12 },
        alignment: { vertical: 'center', horizontal: 'center', wrapText: true },
        border: {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' }
        },
        fill: { fgColor: { rgb: "D3D3D3" } } // light grey background
    };

    // Create a new workbook and a worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([]);

    // Set RTL for the sheet
    worksheet['!margins'] = { right: 0.75, left: 0.75, top: 1.0, bottom: 1.0, header: 0.5, footer: 0.5 };
    worksheet['!sheetPr'] = { rtl: 1 };

    // Prepare the data for worksheet
    const titleRow = [{ v: 'التفتيش على إجراءات السلامة في حافلات النقل المدرسي', s: titleStyle }];
    const subTitleRow = [{ v: 'المحطة', s: headerStyle }, { v: 'العاصمة', s: headerStyle }];
    const dateRow = [
        { v: 'تاريخ التفتيش', s: headerStyle },
        { v: new Date(createdAt).toLocaleDateString(), s: dataStyle1 },
        { v: '', s: dataStyle1 },
        { v: '', s: dataStyle1 },
        { v: 'تاريخ التقرير', s: headerStyle },
        { v: '', s: dataStyle1 },
        { v: new Date(createdAt).toLocaleDateString(), s: dataStyle1 }
    ];
    const headerRow = [
        { v: 'الاسم', s: headerStyle }, { v: '', s: headerStyle }, { v: 'الوظيفة', s: headerStyle },
        { v: 'عدد الملاحظات المسجلة', s: headerStyle }, { v: '', s: headerStyle }, { v: 'المدينة', s: headerStyle },
        { v: '', s: headerStyle }, { v: 'موقع التفتيش', s: headerStyle }, { v: 'التوزيع', s: headerStyle }
    ];
    const subHeaderRow = [
        { v: '', s: dataStyle1 }, { v: '', s: dataStyle1 }, { v: '', s: dataStyle1 },
        { v: 'الرئيسية', s: headerStyle }, { v: 'الثانوية', s: headerStyle }, { v: '', s: dataStyle1 },
        { v: '', s: dataStyle1 }, { v: '', s: dataStyle1 }, { v: '', s: dataStyle1 }
    ];
    const dataRow = [
        { v: name, s: dataStyle1 }, { v: '', s: dataStyle1 }, { v: jobTitleOfTheEmployee, s: dataStyle1 },
        { v: inspections.length, s: dataStyle1 }, { v: '', s: dataStyle1 }, { v: city, s: dataStyle1 },
        { v: '', s: dataStyle1 }, { v: InspectionSite, s: dataStyle1 }, { v: 'مدير النقل المدرسي', s: dataStyle1 }
    ];
    const dataRow2 = [
        { v: '', s: dataStyle1 }, { v: '', s: dataStyle1 }, { v: '', s: dataStyle1 },
        { v: '', s: dataStyle1 }, { v: '', s: dataStyle1 }, { v: '', s: dataStyle1 },
        { v: '', s: dataStyle1 }, { v: '', s: dataStyle1 }, { v: 'مشرف أول العمليات', s: dataStyle1 }
    ];
    const dataRow3 = [
        { v: '', s: dataStyle1 }, { v: '', s: dataStyle1 }, { v: '', s: dataStyle1 },
        { v: '', s: dataStyle1 }, { v: '', s: dataStyle1 }, { v: '', s: dataStyle1 },
        { v: '', s: dataStyle1 }, { v: '', s: dataStyle1 }, { v: 'مدير إدارة الجودة والسلامة', s: dataStyle1 }
    ];
    const footerRow = [{ v: 'مراجعة واعتماد:', s: headerStyle }];
    const inspectionHeaderRow = [
        { v: 'م', s: headerStyle }, { v: 'الصورة', s: headerStyle }, { v: 'وصف الملاحظة', s: headerStyle },
        { v: 'الدليل', s: headerStyle }, { v: 'تصنيف الملاحظة', s: headerStyle }
    ];

    // Add title row
    XLSX.utils.sheet_add_aoa(worksheet, [titleRow], { origin: 'A1' });
    // Add subtitle row
    XLSX.utils.sheet_add_aoa(worksheet, [subTitleRow], { origin: 'A2' });
    // Add date row
    XLSX.utils.sheet_add_aoa(worksheet, [dateRow], { origin: 'A3' });
    // Add header row
    XLSX.utils.sheet_add_aoa(worksheet, [headerRow], { origin: 'A4' });
    // Add sub-header row
    XLSX.utils.sheet_add_aoa(worksheet, [subHeaderRow], { origin: 'A5' });
    // Add data rows
    XLSX.utils.sheet_add_aoa(worksheet, [dataRow], { origin: 'A6' });
    XLSX.utils.sheet_add_aoa(worksheet, [dataRow2], { origin: 'A7' });
    XLSX.utils.sheet_add_aoa(worksheet, [dataRow3], { origin: 'A8' });
    // Add footer row
    XLSX.utils.sheet_add_aoa(worksheet, [footerRow], { origin: 'A9' });
    // Add inspection header row
    XLSX.utils.sheet_add_aoa(worksheet, [inspectionHeaderRow], { origin: 'A10' });

    // Add inspection data rows
    inspections.forEach((item, index) => {
        const row = [
            { v: index + 1, s: (index % 2 === 0) ? dataStyle1 : dataStyle2 },
            { v: '', s: (index % 2 === 0) ? dataStyle1 : dataStyle2 }, // Placeholder for image
            { v: item.description, s: (index % 2 === 0) ? dataStyle1 : dataStyle2 },
            { v: item.idOfBus, s: (index % 2 === 0) ? dataStyle1 : dataStyle2 },
            { v: item.noteClassification, s: (index % 2 === 0) ? dataStyle1 : dataStyle2 }
        ];
        XLSX.utils.sheet_add_aoa(worksheet, [row], { origin: `A${11 + index}` });

        // Ensure cell exists before setting properties
        const cellAddress = XLSX.utils.encode_cell({ c: 1, r: 11 + index });
        if (!worksheet[cellAddress]) {
            worksheet[cellAddress] = { v: '' };
        }
        worksheet[cellAddress].l = { Target: item.image, Tooltip: 'Click to view image' };
    });

    // Set column widths
    worksheet['!cols'] = [
        { wpx: 30 }, // Column for 'م'
        { wpx: 100 }, // Column for 'الصورة'
        { wpx: 200 }, // Column for 'وصف الملاحظة'
        { wpx: 150 }, // Column for 'الدليل'
        { wpx: 100 }  // Column for 'تصنيف الملاحظة'
    ];

    // Append worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Write workbook to binary array
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    // Save the file
    saveAs(blob, `${filename}.xlsx`);
};