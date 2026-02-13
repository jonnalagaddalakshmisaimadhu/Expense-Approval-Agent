
"use client";

import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { ExpenseResult } from '@/components/ExpenseResult';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [result, setResult] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileProcess = async (file: File) => {
    setIsProcessing(true);
    setResult(null);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/expense', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to process receipt');
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to process receipt. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800">ExpenseAgent</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-500">Powered by Gemini & Scaledown.ai</span>
            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Smart Expense Approval
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Upload your receipt and let our AI agents handle the rest.
            Receipt extraction, fraud check, policy compliance, and approval routing—all in seconds.
          </p>
        </motion.div>

        <FileUpload onFileSelect={handleFileProcess} isProcessing={isProcessing} />

        {error && (
          <div className="max-w-xl mx-auto p-4 mb-8 bg-red-50 text-red-600 rounded-lg text-center font-medium">
            {error}
          </div>
        )}

        <ExpenseResult data={result} />
      </main>
    </div>
  );
}
