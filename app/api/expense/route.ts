
import { NextRequest, NextResponse } from 'next/server';
import { runPythonScript } from '@/lib/pythonRunner';

/**
 * POST /api/expense
 * 
 * Accepts a receipt image (form data), passes it to the Python backend
 * for processing through the multi-agent pipeline:
 * OCR → RAG → Reasoner → Fraud Check → Approval Router
 */
export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Convert uploaded file to base64 data URI for the Python backend
        const buffer = Buffer.from(await file.arrayBuffer());
        const base64Image = buffer.toString('base64');
        const dataUri = `data:${file.type};base64,${base64Image}`;

        // Run the Python orchestrator with the image data via stdin
        const rawResponse = await runPythonScript('process.py', [], dataUri);

        // Parse the JSON response from the Python pipeline
        let result;
        try {
            result = JSON.parse(rawResponse);
        } catch (e) {
            console.error("JSON Parse Error:", rawResponse);
            return NextResponse.json(
                { error: 'Backend Processing Failed: ' + rawResponse.substring(0, 100) },
                { status: 500 }
            );
        }

        // Check for errors returned by the Python backend
        if (result.error) {
            return NextResponse.json({ error: result.error }, { status: 500 });
        }

        return NextResponse.json(result);

    } catch (error: any) {
        console.error("Route Error:", error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
