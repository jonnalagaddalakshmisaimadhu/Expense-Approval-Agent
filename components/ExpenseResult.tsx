
"use client";

import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, AlertTriangle, ShieldCheck, DollarSign, FileCheck, FileText } from 'lucide-react';

interface ExpenseResultProps {
    data: any;
}

export function ExpenseResult({ data }: ExpenseResultProps) {
    if (!data) return null;
    // Fallback structures if properties are missing
    const { receipt, fraudCheck, policyDecision, approval, retrievedPolicies } = data || {};
    const merchant = receipt?.merchant || "Unknown Merchant";
    const date = receipt?.date || "Unknown Date";
    const total = receipt?.total || 0;
    const currency = receipt?.currency || "USD";
    const items = receipt?.items || [];

    // Policy Decision (Scaledown Reasoner)
    const decision = policyDecision?.decision || "Pending";
    const reason = policyDecision?.reason || "Analyzing...";

    // Fraud
    const isFlagged = fraudCheck?.isFlagged || false;
    const fraudReason = fraudCheck?.reason || "";

    // Approval
    const status = approval?.status || "Pending";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6"
        >
            {/* Receipt Details Card (OCR Agent Output) */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-semibold text-slate-700 flex items-center">
                        <FileText size={18} className="mr-2 text-blue-500" />
                        OCR Agent Output
                    </h3>
                    <span className="text-xs font-medium px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full border border-emerald-200">
                        Tesseract.js (Local)
                    </span>
                </div>
                <div className="p-6">
                    <div className="flex justify-between items-end mb-6">
                        <div>
                            <p className="text-sm text-slate-500">Total Amount</p>
                            <h2 className="text-3xl font-bold text-slate-900">{currency} {total.toFixed(2)}</h2>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-slate-500">Merchant</p>
                            <p className="font-medium text-slate-900">{merchant}</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <p className="text-sm font-medium text-slate-500 border-b border-slate-100 pb-2">Extracted Data</p>
                        <div className="bg-slate-50 p-3 rounded text-xs font-mono text-slate-600 max-h-32 overflow-y-auto whitespace-pre-wrap">
                            {receipt?.text || "No raw text available."}
                        </div>
                    </div>
                </div>
            </div>

            {/* Analysis Card */}
            <div className="space-y-6">

                {/* 1. Retrieved Policies (Light RAG) */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <h3 className="font-semibold text-slate-700 mb-3 flex items-center">
                        <span className="mr-2 text-xl">📚</span>
                        Retrieved Policies (Light RAG)
                    </h3>
                    <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 max-h-40 overflow-y-auto">
                        {retrievedPolicies && retrievedPolicies.length > 0 ? (
                            <ul className="list-disc pl-4 space-y-1">
                                {retrievedPolicies.map((p: any) => (
                                    <li key={p.id}>
                                        <span className="font-medium">{p.title}:</span> {p.text}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="italic text-slate-400">No specific policies retrieved (Using generic context)</p>
                        )}
                    </div>
                </div>

                {/* 2. Ollama Reasoner Decision */}
                <div className={`rounded-2xl p-6 border ${decision === 'Approve' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex items-start">
                        <div className={`p-2 rounded-full mr-4 ${decision === 'Approve' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {decision === 'Approve' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
                        </div>
                        <div>
                            <h3 className={`font-semibold text-lg ${decision === 'Approve' ? 'text-green-800' : 'text-red-800'}`}>
                                Local Ollama Agent: {decision}
                            </h3>
                            <p className={`text-sm mt-1 ${decision === 'Approve' ? 'text-green-600' : 'text-red-600'}`}>
                                {reason}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Scaledown Stats (Hidden/Removed as we are now using Local LLM) */}

                {/* 3. Fraud & Approval */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Fraud Agent</h3>
                        <div className="flex items-center">
                            {isFlagged ? (
                                <>
                                    <AlertTriangle className="text-amber-500 mr-2" size={20} />
                                    <span className="text-amber-700 font-medium text-sm">Flagged</span>
                                </>
                            ) : (
                                <>
                                    <ShieldCheck className="text-green-500 mr-2" size={20} />
                                    <span className="text-green-700 font-medium text-sm">Clean</span>
                                </>
                            )}
                        </div>
                        {isFlagged && <p className="text-xs text-slate-500 mt-1">{fraudReason}</p>}
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Approval Router</h3>
                        <p className="font-medium text-slate-900 text-sm">{status}</p>
                        <p className="text-xs text-slate-500 mt-1">Via {approval?.approver}</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}


