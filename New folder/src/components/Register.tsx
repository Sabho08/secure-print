import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ShieldCheck, CheckIcon, LogIn } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../utils/supabase';

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            setErrorMsg('Passwords do not match');
            return;
        }

        setIsLoading(true);
        setErrorMsg(null);

        try {
            // 1. Sign up user
            const { data, error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
            });

            if (error) throw error;

            if (data.user) {
                // 2. Create profile row (this would also be handled by a DB trigger, but we'll do it manually for now)
                await supabase.from('profiles').insert([
                    {
                        id: data.user.id,
                        email: formData.email,
                        full_name: formData.name,
                        role: 'customer'
                    }
                ]);
            }

            navigate('/shop-code');
        } catch (err: any) {
            setErrorMsg(err.message || 'Registration failed.');
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
                className="w-full max-w-[420px] bg-white rounded-[40px] shadow-[0_32px_80px_-16px_rgba(0,0,0,0.12)] p-10 relative z-10"
            >
                <div className="flex flex-col items-center mb-10 text-center">
                        <ShieldCheck size={32} />
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Create account</h1>
                    <p className="text-gray-400 font-medium mt-2">Zero-footprint printing starts here</p>
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
                        <label className="text-sm font-bold text-gray-700 ml-1">Full name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                required
                                className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:bg-white focus:border-wetransfer-blue outline-none transition-all"
                                placeholder="Your Name"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    </div>

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

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:bg-white focus:border-wetransfer-blue outline-none transition-all"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                           <label className="text-sm font-bold text-gray-700 ml-1">Confirm</label>
                           <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl py-4 px-4 text-sm font-medium focus:bg-white focus:border-wetransfer-blue outline-none transition-all"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
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
                    </div>

                    <div className="flex items-center gap-3 px-1.5 py-2">
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white">
                           <CheckIcon size={12} />
                        </div>
                        <span className="text-xs font-semibold text-gray-400 tracking-wide">Secure registration active</span>
                    </div>

                    <button
                        disabled={isLoading}
                        className="w-full bg-black hover:bg-gray-800 text-white font-bold py-5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-2xl shadow-gray-200 disabled:bg-gray-400 mt-2"
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
                                Agree & Register
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-10 pt-8 border-t border-gray-50 flex flex-col items-center gap-4">
                    <p className="text-sm text-gray-400 font-medium text-center leading-relaxed">
                        Already have an account?{' '}
                        <Link to="/login" className="text-wetransfer-blue font-bold hover:underline">
                            Login here
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
