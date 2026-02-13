
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

        // Convert file to base64
        const buffer = Buffer.from(await file.arrayBuffer());
        const base64Image = buffer.toString('base64');

        // 1. OCR Agent (Tesseract.js - Local & Free)
        console.log("OCR Agent (Tesseract) working...");
        const receiptData = await extractTextFromImage(base64Image, file.type);

        if (!receiptData) {
            return NextResponse.json({ error: 'Failed to process receipt' }, { status: 500 });
        }

        // 2. Policy Retriever Agent (Light RAG)
        console.log("Retriever Agent working...");
        // Use the raw text for retrieval
        const receiptString = receiptData.text;
        const relevantPolicies = retrieveRelevantPolicies(receiptString);

        // 3. Policy Reasoner Agent (Ollama - Local & Free)
        console.log("Reasoner Agent (Ollama) working...");
        // Pass the raw text and policies to Ollama
        const policyDecision = await checkPolicyComplianceOllama(receiptString, relevantPolicies);

        // 4. Fraud Detector Agent
        console.log("Fraud Detector Agent working...");
        const fraudCheck = detectFraud(receiptData);

        // 5. Approval Router Agent
        console.log("Approval Router working...");
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
