import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadToTempCloud } from '../utils/mockApi';

const Portal: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isDone, setIsDone] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setIsUploading(true);
        // Simulate upload delay
        await new Promise(r => setTimeout(r, 2000));
        await uploadToTempCloud(file);
        setIsUploading(false);
        setIsDone(true);
    };

    return (
        <div className="min-h-screen bg-wetransfer-light flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decorative Circles (WeTransfer style) */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-wetransfer-blue/10 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-purple-500/10 rounded-full blur-[100px]"></div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-full max-w-[320px] bg-white rounded-[32px] shadow-[0_24px_64px_-16px_rgba(0,0,0,0.1)] p-8 relative flex flex-col gap-6"
            >
                <div className="flex justify-between items-start">
                    <div className="w-12 h-12 bg-wetransfer-blue rounded-full flex items-center justify-center text-white">
                        <Upload size={24} />
                    </div>
                    <p className="text-sm font-bold text-gray-400">SecurePrint</p>
                </div>

                <AnimatePresence mode="wait">
                    {!file && !isDone ? (
                        <motion.div
                            key="select"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => fileInputRef.current?.click()}
                            className="group cursor-pointer py-12 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center gap-4 hover:border-wetransfer-blue hover:bg-blue-50/50 transition-all"
                        >
                            <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-wetransfer-blue group-hover:text-white flex items-center justify-center text-gray-400 transition-colors">
                                <Upload size={20} />
                            </div>
                            <div className="text-center">
                                <p className="font-bold text-lg">Add your files</p>
                                <p className="text-xs text-gray-400">PDF up to 10MB</p>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept=".pdf"
                            />
                        </motion.div>
                    ) : file && !isDone ? (
                        <motion.div
                            key="uploading"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="flex flex-col gap-6"
                        >
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                <div className="w-10 h-10 bg-wetransfer-blue/10 text-wetransfer-blue rounded flex items-center justify-center">
                                    <FileText size={20} />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="font-bold truncate text-sm">{file.name}</p>
                                    <p className="text-[10px] text-gray-400 uppercase">{(file.size / 1024 / 1024).toFixed(2)} MB • Ready</p>
                                </div>
                            </div>

                            <button
                                onClick={handleUpload}
                                disabled={isUploading}
                                className="w-full bg-wetransfer-blue hover:bg-blue-600 text-white font-bold py-4 rounded-full transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
                            >
                                {isUploading ? (
                                    <>
                                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                                            <Upload size={20} />
                                        </motion.div>
                                        Uploading...
                                    </>
                                ) : 'Transfer to Shop'}
                            </button>

                            <button
                                onClick={() => setFile(null)}
                                className="text-xs font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest text-center"
                            >
                                Cancel
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="done"
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            className="flex flex-col items-center gap-4 py-8"
                        >
                            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white mb-4">
                                <CheckCircle size={40} />
                            </div>
                            <p className="text-2xl font-bold text-center">You're done!</p>
                            <p className="text-sm text-gray-500 text-center">The shopkeeper has received your document for secure printing.</p>
                            <button
                                onClick={() => { setFile(null); setIsDone(false); }}
                                className="mt-6 text-wetransfer-blue font-bold hover:underline"
                            >
                                Send another file
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="mt-4 pt-6 border-t border-gray-100">
                    <div className="flex items-start gap-2 text-[10px] text-gray-400">
                        <Info size={12} className="shrink-0 mt-0.5" />
                        <p>Files are stored temporarily and encrypted. Zero-footprint guaranteed.</p>
                    </div>
                </div>
            </motion.div>

            {/* Footer / Info */}
            <div className="absolute bottom-10 left-10 hidden lg:block">
                <h1 className="text-5xl font-black text-gray-900 leading-tight">
                    SecurePrint<br />
                    <span className="text-wetransfer-blue">Zero-Footprint.</span>
                </h1>
                <p className="mt-4 text-gray-400 max-w-[400px]">
                    Upload documents safely. We never save them to disk. Once printed, they vanish forever.
                </p>
            </div>
        </div>
    );
};

export default Portal;
