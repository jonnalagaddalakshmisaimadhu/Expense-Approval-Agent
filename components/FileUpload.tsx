
"use client";

import { useState } from 'react';
import { Upload, X, FileText, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FileUploadProps {
    onFileSelect: (file: File) => void;
    isProcessing: boolean;
}

export function FileUpload({ onFileSelect, isProcessing }: FileUploadProps) {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file: File) => {
        setSelectedFile(file);
        onFileSelect(file);
    };

    const removeFile = () => {
        setSelectedFile(null);
    };

    return (
        <div className="w-full max-w-xl mx-auto mb-8">
            <AnimatePresence>
                {!selectedFile ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl transition-colors cursor-pointer
                ${dragActive ? "border-blue-500 bg-blue-50/10" : "border-slate-300 hover:border-blue-400 bg-slate-50/50"}
            `}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <input
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={handleChange}
                            accept="image/*,.pdf"
                            disabled={isProcessing}
                        />
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <div className="p-4 bg-blue-100 rounded-full mb-3 text-blue-600">
                                <Upload size={24} />
                            </div>
                            <p className="mb-2 text-sm text-slate-500 font-semibold">
                                <span className="text-blue-600">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-slate-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative flex items-center p-4 bg-white rounded-xl shadow-sm border border-slate-200"
                    >
                        <div className="p-3 bg-green-100 rounded-lg mr-4 text-green-600">
                            <FileText size={24} />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <h3 className="text-sm font-medium text-slate-900 truncate">{selectedFile.name}</h3>
                            <p className="text-xs text-slate-500">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                        </div>

                        {isProcessing ? (
                            <div className="flex items-center text-blue-600 text-sm font-medium animate-pulse">
                                <Loader2 className="animate-spin mr-2" size={16} />
                                Processing
                            </div>
                        ) : (
                            <button
                                onClick={removeFile}
                                className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-500 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
