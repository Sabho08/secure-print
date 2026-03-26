import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../utils/supabase';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });

            if (error) throw error;
            
            navigate('/shop-code');
        } catch (err: any) {
            setErrorMsg(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-wetransfer-light flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-wetransfer-blue/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-purple-500/10 rounded-full blur-[100px]" />

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-full max-w-[400px] bg-white rounded-[40px] shadow-[0_32px_80px_-16px_rgba(0,0,0,0.12)] p-10 relative z-10"
            >
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center text-white mb-6 transform -rotate-6 shadow-xl">
                        <ShieldCheck size={32} />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Welcome back</h1>
                    <p className="text-gray-400 font-medium mt-2">Access your secure print terminal</p>
                </div>

                {errorMsg && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 border border-red-100 text-red-600 text-xs font-bold p-4 rounded-2xl mb-6 text-center"
                    >
                        {errorMsg}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">Email address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="email"
                                required
                                className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:bg-white focus:border-wetransfer-blue outline-none transition-all"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl py-4 pl-12 pr-12 text-sm font-medium focus:bg-white focus:border-wetransfer-blue outline-none transition-all"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-end px-1">
                        <button type="button" className="text-xs font-bold text-wetransfer-blue hover:underline">
                            Forgot password?
                        </button>
                    </div>

                    <button
                        disabled={isLoading}
                        className="w-full bg-black hover:bg-gray-800 text-white font-bold py-5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-2xl shadow-gray-200 disabled:bg-gray-400"
                    >
                        {isLoading ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                            />
                        ) : (
                            <>
                                <LogIn size={20} />
                                Sign in
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-10 pt-8 border-t border-gray-50 flex flex-col items-center gap-4">
                    <p className="text-sm text-gray-400 font-medium">
                        New to SecurePrint?{' '}
                        <Link to="/register" className="text-wetransfer-blue font-bold hover:underline">
                            Create account
                        </Link>
                    </p>
                </div>
            </motion.div>

            {/* Logo / Tagline */}
            <div className="absolute top-28 left-10 hidden lg:block">
               <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white text-[10px] font-black italic">SP</div>
                    <span className="text-xl font-black tracking-tight text-gray-900">SecurePrint</span>
               </div>
            </div>
        </div>
    );
};

export default Login;
