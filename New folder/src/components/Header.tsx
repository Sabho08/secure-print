import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.png';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import type { User } from '@supabase/supabase-js';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-[#f8f9fa] border-b border-outline-variant/10">
      <nav className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto w-full">
        <Link to="/" className="text-2xl font-black text-[#191c1d] flex items-center gap-2">
          <img src={logo} alt="SecurePrint Logo" className="w-12 h-12 object-contain" />
          <span className="font-headline tracking-tight text-[#191c1d]">SecurePrint</span>
        </Link>
        <div className="hidden md:flex gap-8 items-center">
          <Link className="text-[#0b55cf] font-semibold hover:opacity-80 transition-opacity" to="/">Product</Link>
          <a className="text-[#191c1d] opacity-70 hover:opacity-80 transition-opacity" href="#">Solutions</a>
          <a className="text-[#191c1d] opacity-70 hover:opacity-80 transition-opacity" href="#">Pricing</a>
        </div>
        
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-xs font-bold text-outline uppercase tracking-tighter">Logged in as</span>
                <span className="text-sm font-bold text-on-surface truncate max-w-[150px]">{user.email?.split('@')[0]}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="bg-surface-container-highest text-on-surface px-4 py-2 rounded-xl font-bold text-sm hover:bg-error-container hover:text-on-error-container transition-all active:scale-95 duration-200"
              >
                Logout
              </button>
            </div>
          ) : (
            <button 
              onClick={() => navigate('/login')}
              className="bg-primary-container text-on-primary-container px-6 py-2 rounded-xl font-semibold primary-btn-gradient hover:opacity-90 active:scale-95 duration-200 transition-all font-body text-white"
            >
              Log in
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;

