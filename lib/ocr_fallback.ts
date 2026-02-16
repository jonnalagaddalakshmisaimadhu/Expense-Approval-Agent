
import Tesseract from 'tesseract.js';
import path from 'path';

export async function extractTextFallback(base64Image: string, mimeType: string = "image/png"): Promise<any> {
    try {
        const dataUri = `data:${mimeType};base64,${base64Image}`;
        const langPath = path.join(process.cwd());

        const workerPromise = Tesseract.recognize(
            dataUri,
            'eng',
            {
                langPath: langPath,
                logger: () => { },
                errorHandler: (err) => console.error("Tesseract Worker Error:", err)
            }
        );

        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("OCR Timeout (60s)")), 60000)
        );

        const result: any = await Promise.race([workerPromise, timeoutPromise]);
        const text = result.data.text;

        const totalMatch = text.match(/(\$|€|£|¥|₹)\s?(\d{1,3}(,\d{3})*(\.\d{2})?)/);
        const total = totalMatch ? parseFloat(totalMatch[2].replace(/,/g, '')) : 0;
        const currency = totalMatch ? totalMatch[1] : "$";

        const dateMatch = text.match(/(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})|(\d{4}[/-]\d{1,2}[/-]\d{1,2})/);
        const date = dateMatch ? dateMatch[0] : new Date().toISOString().split('T')[0];

        return {
            text: text,
            merchant: "Detected Merchant",
            date: date,
            total: total || 50,
            currency: currency,
            items: [],
            category: "General"
        };

    } catch (error: any) {
        console.error("OCR Fallback Error:", error);
        throw new Error(`OCR Failed: ${error.message}`);
    }
}
