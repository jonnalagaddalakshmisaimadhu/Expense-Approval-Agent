
"use client";

import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { ExpenseResult } from '@/components/ExpenseResult';
import { motion, AnimatePresence } from 'framer-motion';

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
        let errMessage = 'Failed to process receipt';
        try {
          const errData = await res.json();
          errMessage = errData.error || errMessage;
        } catch { }
        throw new Error(errMessage);
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
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 -z-20"></div>
      <div className="absolute top-0 -left-64 w-96 h-96 bg-blue-300 dark:bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-64 w-96 h-96 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <header className="fixed w-full top-0 z-50 glass-panel border-b-0 border-b-slate-200/50 dark:border-b-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg flex items-center justify-center text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
              </svg>
            </motion.div>
            <span className="font-bold text-xl tracking-tight text-slate-800 dark:text-slate-100">
              Agentic<span className="text-blue-600 dark:text-blue-400">Payer</span>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-semibold text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2 my-auto animate-pulse"></span>
              Python Backend Active
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden ring-2 ring-white dark:ring-slate-800 shadow-sm"
            >
              <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Alex" alt="User" />
            </motion.button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >

          <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Review Expenses <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400">
              with Superhuman Speed
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Drag & drop receipts to activate our Autonomous Python Agents.
            <br className="hidden sm:block" />
            We handle OCR, Policy Checking, and Fraud Detection instantly.
          </p>
        </motion.div>

        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative z-10"
          >
            <div className="glass-panel rounded-2xl p-1 shadow-2xl shadow-blue-900/10 dark:shadow-black/40">
              <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-slate-100 dark:border-slate-800 border-dashed border-2">
                <FileUpload onFileSelect={handleFileProcess} isProcessing={isProcessing} />
              </div>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="max-w-2xl mx-auto p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-900/50 text-center font-medium shadow-sm"
              >
                ⚠️ {error}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
              >
                <ExpenseResult data={result} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent"></div>
    </div>
  );
}
