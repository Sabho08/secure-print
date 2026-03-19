import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, CheckCircle, Info, ArrowLeft, StoreIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';

const RELAY_SERVER = 'http://localhost:3000'; // Replace with production URL later

const Portal: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const shopId = location.state?.shopId || 'Unknown Shop';

    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isDone, setIsDone] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        // Connect to relay server
        socketRef.current = io(RELAY_SERVER);
        
        socketRef.current.on('connect', () => {
           console.log('Connected to Relay Server');
           socketRef.current?.emit('customer-join-shop', shopId);
        });

        socketRef.current.on('transfer-error', (msg: string) => {
            alert(msg);
            setIsUploading(false);
        });

        return () => {
            socketRef.current?.disconnect();
        };
    }, [shopId]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file || !socketRef.current) return;
        setIsUploading(true);
        setUploadProgress(0);

        const CHUNK_SIZE = 64 * 1024; // 64KB chunks for smooth streaming
        const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
        
        for (let i = 0; i < totalChunks; i++) {
            const start = i * CHUNK_SIZE;
            const end = Math.min(file.size, start + CHUNK_SIZE);
            const chunk = await file.slice(start, end).arrayBuffer();
            
            socketRef.current.emit('file-stream-chunk', {
                shopId,
                fileName: file.name,
                chunk: chunk, // Sent as binary
                isFirst: i === 0,
                isLast: i === totalChunks - 1,
                totalSize: file.size
            });

            setUploadProgress(Math.round(((i + 1) / totalChunks) * 100));
            // Small delay to prevent flooding
            await new Promise(r => setTimeout(r, 10));
        }

        setIsUploading(false);
        setIsDone(true);
    };

    return (
        <div className="min-h-screen bg-wetransfer-light flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decorative Circles */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-wetransfer-blue/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-purple-500/10 rounded-full blur-[100px]" />

            <div className="fixed top-8 left-8 flex items-center gap-4 z-20">
                <button 
                  onClick={() => navigate('/shop-code')}
                  className="w-10 h-10 bg-white shadow-sm border border-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all hover:shadow-md"
                >
                    <ArrowLeft size={18} />
                </button>
                <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500/10 text-green-600 rounded-full flex items-center justify-center">
                    <StoreIcon size={12} />
                  </div>
                  <span className="text-xs font-black tracking-widest text-gray-500 uppercase">{shopId} Connected</span>
                </div>
            </div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-full max-w-[340px] bg-white rounded-[40px] shadow-[0_48px_96px_-16px_rgba(0,0,0,0.15)] p-10 relative z-10 flex flex-col gap-6"
            >
                <div className="flex justify-between items-center">
                    <div className="w-12 h-12 bg-wetransfer-blue rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100 transform -rotate-3">
                        <Upload size={24} />
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-1">AirTransfer</p>
                       <p className="text-xs font-black text-gray-900 leading-none">V 1.0.0</p>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {!file && !isDone ? (
                        <motion.div
                            key="select"
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                            onClick={() => fileInputRef.current?.click()}
                            className="group cursor-pointer py-16 border-2 border-dashed border-gray-100 rounded-3xl flex flex-col items-center gap-5 hover:border-wetransfer-blue hover:bg-blue-50/20 transition-all"
                        >
                            <div className="w-14 h-14 rounded-full bg-gray-50 group-hover:bg-wetransfer-blue group-hover:text-white flex items-center justify-center text-gray-300 transition-all group-hover:scale-110 group-active:scale-95 duration-300">
                                <Upload size={24} />
                            </div>
                            <div className="text-center">
                                <p className="font-extrabold text-xl text-gray-900 tracking-tight">Add your files</p>
                                <p className="text-xs font-semibold text-gray-300 mt-1 uppercase tracking-wider">PDF format preferred</p>
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
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }}
                            className="flex flex-col gap-6"
                        >
                            <div className="flex items-center gap-4 p-5 bg-gray-50/50 border border-gray-100 rounded-3xl group">
                                <div className="w-12 h-12 bg-white text-wetransfer-blue rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-all">
                                    <FileText size={24} />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="font-extrabold truncate text-sm text-gray-900 mb-0.5">{file.name}</p>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter italic">{(file.size / 1024 / 1024).toFixed(2)} MB • Ready to stream</p>
                                </div>
                            </div>

                            <button
                                onClick={handleUpload}
                                disabled={isUploading}
                                className="w-full bg-black hover:bg-gray-800 text-white font-bold py-5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-2xl shadow-gray-100 mt-2"
                            >
                                {isUploading ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="flex items-center gap-3">
                                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                                                <Upload size={20} />
                                            </motion.div>
                                            Streaming... {uploadProgress}%
                                        </div>
                                        <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
                                           <motion.div 
                                             initial={{ width: 0 }}
                                             animate={{ width: `${uploadProgress}%` }}
                                             className="bg-white h-full"
                                           />
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        Transfer to Shop
                                        <ArrowLeft size={18} className="rotate-180" />
                                    </>
                                )}
                            </button>

                            <button
                                onClick={() => setFile(null)}
                                className="text-xs font-bold text-gray-300 hover:text-gray-900 transition-colors uppercase tracking-[0.25em] text-center"
                            >
                                Cancel
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="done"
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            className="flex flex-col items-center gap-6 py-10"
                        >
                            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white mb-4 shadow-xl shadow-green-100 ring-[12px] ring-green-50 animate-bounce-short">
                                <CheckCircle size={48} />
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-black text-gray-900 tracking-tight leading-tight">You're all set!</p>
                                <p className="text-sm font-semibold text-gray-400 mt-3 px-4 leading-relaxed tracking-tight">The shopkeeper has received your document. Printing will begin shortly.</p>
                            </div>
                            <button
                                onClick={() => { setFile(null); setIsDone(false); }}
                                className="mt-8 text-wetransfer-blue font-black tracking-tight text-lg hover:bg-blue-50 px-6 py-3 rounded-2xl transition-all"
                            >
                                Transfer another file
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="mt-6 pt-6 border-t border-gray-50">
                    <div className="flex items-start gap-3 p-4 bg-gray-50/30 rounded-2xl">
                        <Info size={16} className="shrink-0 mt-0.5 text-gray-300" />
                        <p className="text-[10px] font-bold text-gray-400 leading-relaxed uppercase tracking-tight">Your data is streamed directly to the printer memory. Zero-footprint guaranteed.</p>
                    </div>
                </div>
            </motion.div>

            {/* Bottom-left headline (Desktop only) */}
            <div className="absolute bottom-12 left-12 hidden lg:block">
                <h1 className="text-6xl font-black text-gray-900 leading-tight tracking-tighter">
                    Stream it.<br />
                    <span className="text-wetransfer-blue italic">Print it.</span><br />
                    Then forget it.
                </h1>
                <p className="mt-6 text-gray-400 font-bold max-w-[440px] text-lg leading-relaxed">
                   The world's first zero-footprint air-printing platform. 
                   Files vanish from existence the moment the printer finishes.
                </p>
            </div>
        </div>
    );
};

export default Portal;
