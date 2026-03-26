import React, { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Shield, Printer, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Worker configuration
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface SecureViewerProps {
    job: {
        id: string;
        filename: string;
        content: string; // Blob URL
    };
    onClose: () => void;
    onPrintSuccess: () => void;
}

const SecureViewer: React.FC<SecureViewerProps> = ({ job, onClose, onPrintSuccess }) => {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [isPrinting, setIsPrinting] = useState(false);
    const viewerRef = useRef<HTMLDivElement>(null);
    const shopId = "SHOP-7742";
    const timestamp = new Date().toLocaleString();

    const [renderedPages, setRenderedPages] = useState<number>(0);
    const [isTabActive, setIsTabActive] = useState(true);
    const [isPrivacyShieldActive, setIsPrivacyShieldActive] = useState(false);
    const [watermarkOpacity, setWatermarkOpacity] = useState(0.1);
    const [showSecureStamp, setShowSecureStamp] = useState(true);

    // Security: Tab Focus Protection
    useEffect(() => {
        const onBlur = () => setIsTabActive(false);
        const onFocus = () => setIsTabActive(true);

        window.addEventListener('blur', onBlur);
        window.addEventListener('focus', onFocus);

        return () => {
            window.removeEventListener('blur', onBlur);
            window.removeEventListener('focus', onFocus);
        };
    }, []);

    // Security 1: Intercept Keyboard and Context Menu
    useEffect(() => {
        const handleEvents = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'p' || e.key === 'u')) {
                e.preventDefault();
                alert('STRICT PROTOCOL: Use the [AUTHORIZE PRINT] command in the console.');
            }
        };

        const blockContextMenu = (e: MouseEvent) => e.preventDefault();

        window.addEventListener('keydown', handleEvents);
        window.addEventListener('contextmenu', blockContextMenu);

        return () => {
            window.removeEventListener('keydown', handleEvents);
            window.removeEventListener('contextmenu', blockContextMenu);
        };
    }, []);

    // Security 3: Hidden Iframe Printing Logic
    const handleSecurePrint = async () => {
        setIsPrinting(true);
        try {
            const canvases = viewerRef.current?.getElementsByTagName('canvas');
            if (!canvases || canvases.length === 0) return;

            const printWindow = document.createElement('iframe');
            printWindow.style.position = 'absolute';
            printWindow.style.top = '-10000px';
            document.body.appendChild(printWindow);

            const printDoc = printWindow.contentDocument || printWindow.contentWindow?.document;
            if (!printDoc) throw new Error('Hardware Access Denied');

            const imagesHtml = Array.from(canvases).map((canvas) => {
                return `<img src="${canvas.toDataURL('image/png')}" style="width: 100%; display: block; margin-bottom: 20px; page-break-after: always;" />`;
            }).join('');

            const html = `
                <html>
                <head>
                    <style>
                        body { margin: 0; padding: 0; background: white; }
                        img { max-width: 100%; display: block; }
                        @page { margin: 0; }
                        .watermark-print {
                            position: fixed;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%) rotate(-45deg);
                            font-size: 70px;
                            color: rgba(0,0,0,${watermarkOpacity + 0.05}) !important;
                            font-family: 'Inter', sans-serif;
                            font-weight: 900;
                            text-align: center;
                            pointer-events: none;
                            z-index: 9999;
                            white-space: nowrap;
                            -webkit-print-color-adjust: exact;
                        }
                    </style>
                </head>
                <body>
                    ${showSecureStamp ? `<div class="watermark-print">SECURE PRINT AUTHORIZED<br/>${shopId}<br/>${timestamp}</div>` : ''}
                    ${imagesHtml}
                </body>
                </html>
            `;

            printDoc.open();
            printDoc.write(html);
            printDoc.close();

            const triggerPrint = () => {
                if (printWindow.contentWindow) {
                    printWindow.contentWindow.focus();
                    printWindow.contentWindow.print();
                    setTimeout(() => {
                        document.body.removeChild(printWindow);
                        onPrintSuccess();
                        setIsPrinting(false);
                    }, 500);
                }
            };

            const imgs = printDoc.querySelectorAll('img');
            let loaded = 0;
            if (imgs.length === 0) triggerPrint();
            else {
                imgs.forEach(img => {
                    img.onload = () => {
                        loaded++;
                        if (loaded === imgs.length) triggerPrint();
                    };
                });
            }
        } catch (err) {
            console.error(err);
            setIsPrinting(false);
        }
    };

    const isReadyToPrint = numPages !== null && renderedPages >= numPages && !isPrinting;
    const shouldBlankContent = !isTabActive || isPrivacyShieldActive;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0c0c0e] flex flex-col items-center overflow-hidden font-sans"
        >
            {/* Tactical Privacy Overlay */}
            <AnimatePresence>
                {shouldBlankContent && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[100] bg-black flex flex-col items-center justify-center p-12"
                    >
                        <div className="relative">
                            <Shield className="text-red-500 animate-pulse mb-8" size={120} />
                            <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full animate-pulse"></div>
                        </div>
                        <h2 className="text-4xl font-black text-white tracking-widest mb-4 italic">RESTRICTED VIEW</h2>
                        <div className="h-px w-64 bg-red-500/30 mb-8"></div>
                        <p className="text-red-500/60 font-mono text-sm tracking-[0.3em] uppercase max-w-sm text-center">
                            Hardware Link Severed. Re-authenticate to restore document cache.
                        </p>
                        {isPrivacyShieldActive && (
                            <button
                                onClick={() => setIsPrivacyShieldActive(false)}
                                className="mt-12 group border border-white/10 px-8 py-3 rounded-full hover:bg-white hover:text-black transition-all flex items-center gap-3"
                            >
                                <Shield size={18} />
                                <span className="font-bold tracking-tighter">RE-ENCRYPT & VIEW</span>
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tactical Header */}
            <div className="w-full h-16 bg-[#16161b] border-b border-white/5 flex items-center justify-between px-6 z-20">
                <div className="flex items-center gap-5">
                    <div className="relative">
                        <Shield className="text-wetransfer-blue" size={24} />
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                    </div>
                    <div className="h-8 w-px bg-white/10"></div>
                    <div>
                        <h1 className="text-white font-black text-xs tracking-[0.2em] uppercase italic opacity-80">
                            Print Console v4.0.2
                        </h1>
                        <p className="text-[9px] text-green-500 font-mono uppercase tracking-widest">
                            {isReadyToPrint ? '● All Blocks Synchronized' : `● Buffering: ${renderedPages}/${numPages}`}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-black/40 rounded-full px-4 py-1.5 border border-white/5 gap-3 mr-4">
                        <span className="text-[10px] text-white/30 font-bold tracking-widest uppercase">Encryption Status</span>
                        <div className="flex gap-1">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-3 h-1 bg-wetransfer-blue rounded-full opacity-40"></div>
                            ))}
                            <div className="w-3 h-1 bg-wetransfer-blue rounded-full animate-pulse"></div>
                        </div>
                    </div>

                    <button onClick={onClose} className="p-2 text-white/20 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>
            </div>

            <div className="flex-1 w-full flex overflow-hidden">
                {/* Custom Print Sidebar (The "Design") */}
                <aside className="w-72 bg-[#121216] border-r border-white/5 p-6 flex flex-col gap-8 no-print">
                    <div>
                        <h2 className="text-[10px] text-white/30 font-black tracking-widest uppercase mb-4">Output Control</h2>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] text-white/60 font-bold uppercase tracking-tighter flex justify-between">
                                    <span>Poison Watermark</span>
                                    <span className="text-wetransfer-blue text-[8px]">{Math.round(watermarkOpacity * 100)}%</span>
                                </label>
                                <input
                                    type="range" min="0.05" max="0.4" step="0.01" value={watermarkOpacity}
                                    onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
                                    className="w-full accent-wetransfer-blue h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5">
                                <span className="text-[10px] text-white/80 font-bold uppercase tracking-tight">Zero-Log Stamp</span>
                                <button
                                    onClick={() => setShowSecureStamp(!showSecureStamp)}
                                    className={`w-8 h-4 rounded-full transition-all relative ${showSecureStamp ? 'bg-wetransfer-blue' : 'bg-white/10'}`}
                                >
                                    <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${showSecureStamp ? 'left-4.5' : 'left-0.5'}`}></div>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto">
                        <div className="bg-gradient-to-br from-wetransfer-blue/20 to-transparent p-5 rounded-3xl border border-wetransfer-blue/20 mb-6">
                            <Printer className="text-wetransfer-blue mb-3" size={24} />
                            <h4 className="text-white font-bold text-sm tracking-tight mb-1">Authorization Layer</h4>
                            <p className="text-[9px] text-white/40 leading-relaxed uppercase tracking-tighter font-medium">
                                Direct Hardware Tunneling.<br />Bypassing OS Buffer Cache.
                            </p>
                        </div>

                        <button
                            onClick={handleSecurePrint}
                            disabled={!isReadyToPrint}
                            className="w-full bg-wetransfer-blue hover:bg-blue-600 text-white py-4 rounded-2xl font-black text-xs tracking-[0.2em] uppercase transition-all shadow-xl shadow-blue-500/20 disabled:opacity-10 cursor-pointer active:scale-95 flex items-center justify-center gap-3"
                        >
                            {isPrinting ? <Loader2 className="animate-spin" size={16} /> : <Shield size={16} />}
                            {isPrinting ? 'Authorizing...' : 'Authorize Print'}
                        </button>
                    </div>
                </aside>

                {/* Main Preview Viewport */}
                <main className="flex-1 bg-[#1c1c22] overflow-y-auto p-12 flex flex-col items-center gap-12 relative scroll-smooth scroll-pb-20">
                    <div
                        ref={viewerRef}
                        className={`transition-all duration-1000 ${shouldBlankContent ? 'filter blur-3xl opacity-0 scale-95' : 'opacity-100 scale-100'}`}
                    >
                        <Document
                            file={job.content}
                            onLoadSuccess={({ numPages }) => {
                                setNumPages(numPages);
                                setRenderedPages(0);
                            }}
                            className="flex flex-col gap-12 items-center"
                            loading={
                                <div className="mt-40 flex flex-col items-center gap-6">
                                    <div className="w-16 h-16 border-4 border-wetransfer-blue/20 border-t-wetransfer-blue rounded-full animate-spin"></div>
                                    <span className="font-mono text-xs text-white/20 tracking-[1em] uppercase">Decrypting...</span>
                                </div>
                            }
                        >
                            {Array.from(new Array(numPages), (_, index) => (
                                <div key={index} className="relative group">
                                    {/* Premium Page Shadow */}
                                    <div className="absolute -inset-4 bg-black/40 blur-2xl rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                    <div className="relative bg-white shadow-2xl rounded-sm overflow-hidden scale-[0.98] group-hover:scale-100 transition-transform duration-500">
                                        <Page
                                            pageNumber={index + 1}
                                            renderAnnotationLayer={false}
                                            renderTextLayer={false}
                                            onRenderSuccess={() => setRenderedPages(prev => prev + 1)}
                                            width={800}
                                        />

                                        {/* Digital Scanning Overlay Effect */}
                                        <div className="absolute inset-x-0 h-[2px] bg-wetransfer-blue/30 shadow-[0_0_15px_rgba(64,159,255,0.5)] z-20 top-0 group-hover:top-full transition-all duration-[3000ms] ease-linear repeat-infinite pointer-events-none opacity-0 group-hover:opacity-100"></div>

                                        {/* Dynamic Watermark Preview */}
                                        {showSecureStamp && (
                                            <div
                                                className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 select-none rotate-[-30deg]"
                                                style={{ opacity: watermarkOpacity }}
                                            >
                                                <div className="border-[15px] border-black/80 px-10 py-5 rounded-[40px] text-center">
                                                    <span className="text-[60px] font-black text-black block leading-none">SECURE PRINT</span>
                                                    <span className="text-[20px] font-bold text-black opacity-60 uppercase tracking-widest">
                                                        AUTHORIZED: {shopId}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </Document>
                    </div>

                    {/* Encryption HUD Bottom */}
                    <div className="sticky bottom-0 w-full max-w-2xl px-8 py-4 bg-black/60 backdrop-blur-xl border border-white/5 rounded-t-[40px] flex justify-between items-center z-20">
                        <div className="flex gap-4">
                            <div className="flex flex-col">
                                <span className="text-[8px] text-white/30 uppercase font-black">Bit-Depth</span>
                                <span className="text-[10px] text-green-500 font-mono italic">256-AES</span>
                            </div>
                            <div className="w-px h-6 bg-white/10"></div>
                            <div className="flex flex-col">
                                <span className="text-[8px] text-white/30 uppercase font-black">Memory Integrity</span>
                                <span className="text-[10px] text-blue-500 font-mono italic">Protected</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[8px] text-white/30 uppercase font-black">Hardware Key</span>
                            <span className="text-[10px] text-white font-mono tracking-tighter">0x7742-SECURE-STAMP</span>
                        </div>
                    </div>
                </main>
            </div>
        </motion.div>
    );
};

export default SecureViewer;
