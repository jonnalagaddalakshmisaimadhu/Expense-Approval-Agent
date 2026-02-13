
import { NextRequest, NextResponse } from 'next/server';
import { checkPolicyComplianceOllama } from '@/lib/ollama';
import { extractTextFromImage } from '@/lib/ocr';
import { detectFraud, routeApproval } from '@/lib/logic';
import { retrieveRelevantPolicies } from '@/lib/rag';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const base64Image = buffer.toString('base64');

        const receiptData = await extractTextFromImage(base64Image, file.type);

        if (!receiptData) {
            return NextResponse.json({ error: 'Failed to process receipt' }, { status: 500 });
        }

        const receiptString = receiptData.text;
        const relevantPolicies = retrieveRelevantPolicies(receiptString);

        const policyDecision = await checkPolicyComplianceOllama(receiptString, relevantPolicies);

        const fraudCheck = detectFraud(receiptData);

        const approvalRoute = routeApproval(policyDecision, receiptData.total);

        return NextResponse.json({
            receipt: receiptData,
            retrievedPolicies: relevantPolicies,
            policyDecision: policyDecision,
            fraudCheck: fraudCheck,
            approval: approvalRoute
        });

    } catch (error) {
        console.error("Error processing expense:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
