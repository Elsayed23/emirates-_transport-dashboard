import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(req: Request) {
    try {
        const { data, user } = await req.json();

        if (!data || !user) {
            return NextResponse.json({ message: 'Data and user information are required' }, { status: 400 });
        }

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        const htmlContent = `
            <html>
            <body style="font-family: 'Arial', sans-serif; direction: rtl; text-align: right;">
                <h1>تقرير</h1>
                <p><strong>الاسم:</strong> ${user.name}</p>
                <p><strong>البريد الإلكتروني:</strong> ${user.email}</p>
                <p><strong>الرقم المالي:</strong> ${user.financialNumber}</p>
                <table border="1" style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                    <thead>
                        <tr style="background-color: #172554; color: white;">
                            <th>رقم</th>
                            <th>السؤال (عربي/إنجليزي)</th>
                            <th>الاستجابة</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map((item: any, index: number) => `
                            <tr>
                                <td style="text-align: center;">${index + 1}</td>
                                <td style="text-align: center;">${item.question.question}<br/>${item.question.translatedQuestion}</td>
                                <td style="text-align: center;">${item.response}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </body>
            </html>
        `;

        await page.setContent(htmlContent);
        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
        await browser.close();

        return new NextResponse(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename=${user.name}_report.pdf`,
            },
        });
    } catch (error) {
        console.error('Error generating PDF:', error);
        return NextResponse.json({ message: 'Failed to generate PDF' }, { status: 500 });
    }
}
