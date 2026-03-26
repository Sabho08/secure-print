import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Store, ArrowRight, ScanLine, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ShopCode: React.FC = () => {
    const navigate = useNavigate();
    const [shopCode, setShopCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const code = shopCode.trim().toUpperCase();
        
        if (!code.startsWith('SHOP-') || code.length < 9) {
            setError('Please enter a valid Shop ID (e.g. SHOP-7742)');
            return;
        }

        setIsLoading(true);
        setError(null);
        // Simulate shop verification
        await new Promise(r => setTimeout(r, 1200));
        setIsLoading(false);
        navigate('/portal', { state: { shopId: code } });
    };

    return (
        <div className="min-h-screen bg-wetransfer-light flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decorative Circles */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-wetransfer-blue/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-purple-500/10 rounded-full blur-[100px]" />

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-full max-w-[400px] bg-white rounded-[40px] shadow-[0_32px_80px_-16px_rgba(0,0,0,0.12)] p-10 relative z-10"
            >
                <div className="flex justify-between items-start mb-10">
                    <div className="w-16 h-16 bg-wetransfer-blue rounded-3xl flex items-center justify-center text-white shadow-lg shadow-blue-100 transform rotate-3">
                        <Store size={32} />
                    </div>
                    <button 
                        onClick={() => navigate('/login')}
                        className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="mb-10">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-tight">Locate a Printer</h1>
                    <p className="text-gray-400 font-medium mt-3">Enter the Shop Terminal ID displayed on the shopkeeper's screen</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-3">
                        <div className="relative group">
                            <input
                                type="text"
                                autoFocus
                                className={`w-full bg-gray-50 border-2 ${error ? 'border-red-100 text-red-600' : 'border-gray-50'} rounded-2xl py-6 px-6 text-2xl font-black tracking-widest placeholder:text-gray-300 placeholder:font-bold focus:bg-white focus:border-wetransfer-blue outline-none transition-all uppercase`}
                                placeholder="SHOP-XXXX"
                                value={shopCode}
                                onChange={e => {
                                    const val = e.target.value.toUpperCase();
                                    if (!val.startsWith('SHOP-') && val.length > 0 && !'SHOP-'.startsWith(val)) {
                                        setShopCode('SHOP-' + val);
                                    } else {
                                        setShopCode(val);
                                    }
                                    setError(null);
                                }}
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                <ScanLine className="text-gray-300 group-focus-within:text-wetransfer-blue transition-colors" size={24} />
                            </div>
                        </div>
                        {error && (
                            <motion.p 
                                initial={{ opacity: 0, y: -5 }} 
                                animate={{ opacity: 1, y: 0 }}
                                className="text-xs font-bold text-red-500 ml-2"
                            >
                                {error}
                            </motion.p>
                        )}
                    </div>

                    <div className="bg-blue-50/50 rounded-2xl p-5 border border-blue-100/50">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 bg-wetransfer-blue rounded-full pulse" />
                            <p className="text-xs font-bold text-wetransfer-blue/80 tracking-wide uppercase">Scanning for local shops...</p>
                        </div>
                    </div>

                    <button
                        disabled={isLoading || shopCode.length < 6}
                        className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-200 text-white font-bold py-5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-2xl shadow-gray-200 mt-2"
                    >
                        {isLoading ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                            />
                        ) : (
                            <>
                                Connect to Terminal
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-12 pt-8 border-t border-gray-50">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase">Nearby Terminals</span>
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <button 
                                onClick={() => setShopCode('SHOP-7742')}
                                className="w-full bg-white border-2 border-gray-50 hover:border-gray-100 hover:bg-gray-50 p-4 rounded-xl flex items-center justify-between group transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-white transition-colors">
                                        <Store size={14} className="text-gray-400" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs font-bold text-gray-900 uppercase">FastPrint Express</p>
                                        <p className="text-[10px] font-bold text-gray-400 mt-0.5 uppercase tracking-tighter">SHOP-7742 • 12m away</p>
                                    </div>
                                </div>
                                <ArrowRight size={14} className="text-gray-200 group-hover:text-gray-400 group-hover:translate-x-1 transition-all" />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ShopCode;
