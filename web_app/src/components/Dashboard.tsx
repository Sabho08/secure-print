import React, { useState } from 'react';
import { usePrintQueue, type PrintJob } from '../utils/mockApi';
import { Printer, Clock, FileCheck, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SecureViewer from './SecureViewer';

const Dashboard: React.FC = () => {
    const { jobs, markAsPrinted } = usePrintQueue();
    const [selectedJob, setSelectedJob] = useState<PrintJob | null>(null);

    const pendingJobs = jobs.filter(j => j.status === 'pending');
    const finishedJobs = jobs.filter(j => j.status === 'printed');

    return (
        <div className="min-h-screen bg-[#f3f4f6] text-gray-900 font-sans p-8">
            {/* Header */}
            <header className="max-w-6xl mx-auto mb-10 flex justify-between items-end">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-black rounded flex items-center justify-center text-white">SP</div>
                        <span className="font-black text-xl tracking-tighter italic">SECUREPRINT DASHBOARD</span>
                    </div>
                    <p className="text-gray-500 font-medium">Shop Terminal ID: <span className="text-black">SHOP-7742</span></p>
                </div>

                <div className="flex gap-4">
                    <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200 flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Live Connection</span>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Live Queue */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            Print Queue
                            <span className="bg-wetransfer-blue text-white text-[10px] px-2 py-1 rounded-full">{pendingJobs.length}</span>
                        </h2>
                    </div>

                    <div className="space-y-4">
                        <AnimatePresence mode="popLayout">
                            {pendingJobs.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="bg-white/50 border-2 border-dashed border-gray-200 rounded-3xl py-20 flex flex-col items-center justify-center gap-4 text-gray-400"
                                >
                                    <Clock size={40} className="opacity-20" />
                                    <p className="font-medium">Waiting for incoming jobs...</p>
                                </motion.div>
                            ) : (
                                pendingJobs.map((job) => (
                                    <motion.div
                                        key={job.id}
                                        layout
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.9, opacity: 0 }}
                                        className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-xl hover:border-wetransfer-blue/20 transition-all"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-wetransfer-blue transition-colors">
                                                <Printer size={28} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg leading-tight">{job.filename}</h3>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                                        <Clock size={12} /> {job.timestamp}
                                                    </span>
                                                    <span className="text-xs font-bold text-wetransfer-blue flex items-center gap-1 uppercase tracking-tighter">
                                                        <ShieldCheck size={12} /> Encrypted
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setSelectedJob(job)}
                                            className="bg-black text-white px-8 py-3 rounded-full font-bold text-sm tracking-tight hover:bg-wetransfer-blue transition-all active:scale-95"
                                        >
                                            Process & Print
                                        </button>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Right Column: Mini Stats/Log */}
                <div className="space-y-6">
                    <div className="bg-black text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <ShieldCheck size={100} />
                        </div>
                        <h3 className="text-xl font-bold mb-6">Terminal Health</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                <span className="text-white/60 text-sm italic">Memory Buffer</span>
                                <span className="font-mono text-green-400">Clear</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                <span className="text-white/60 text-sm italic">Disk Cache</span>
                                <span className="font-mono text-blue-400">Disabled</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-white/60 text-sm italic">Auth Level</span>
                                <span className="font-mono text-purple-400">Level 4</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <FileCheck size={18} className="text-green-500" />
                            Daily History
                        </h3>
                        <div className="space-y-2 max-h-[200px] overflow-y-auto">
                            {finishedJobs.length === 0 ? (
                                <p className="text-xs text-gray-400 italic">No files processed yet today.</p>
                            ) : (
                                finishedJobs.map(job => (
                                    <div key={job.id} className="text-[10px] flex justify-between items-center py-2 border-b border-gray-50 last:border-0 text-gray-500">
                                        <span className="truncate max-w-[120px]">{job.filename}</span>
                                        <span className="font-mono">SHREDDED ✓</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Secure Viewer Modal */}
            <AnimatePresence>
                {selectedJob && (
                    <SecureViewer
                        job={selectedJob}
                        onClose={() => {
                            // Security: Shred memory when closing
                            if (selectedJob.content) URL.revokeObjectURL(selectedJob.content);
                            setSelectedJob(null);
                        }}
                        onPrintSuccess={() => {
                            markAsPrinted(selectedJob.id);
                            // Security: Shred memory after successful print
                            if (selectedJob.content) URL.revokeObjectURL(selectedJob.content);
                            setSelectedJob(null);
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;
