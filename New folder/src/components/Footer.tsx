import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#f3f4f5] w-full rounded-t-3xl">
      <div className="flex flex-col md:flex-row justify-between items-center px-8 py-12 gap-6 w-full max-w-7xl mx-auto">
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="font-bold text-[#191c1d] flex items-center gap-2 text-xl font-headline">
            <span className="material-symbols-outlined text-[#0b55cf]" data-icon="shield">shield</span>
            <span>SecurePrint Terminal</span>
          </div>
          <p className="font-body text-sm leading-relaxed text-[#191c1d] opacity-60">
            © 2024 SecurePrint Terminal. All rights reserved.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-8 font-body">
          <a className="text-sm text-[#191c1d] opacity-60 hover:text-[#0b55cf] transition-colors" href="#">Privacy Policy</a>
          <a className="text-sm text-[#191c1d] opacity-60 hover:text-[#0b55cf] transition-colors" href="#">Terms of Service</a>
          <a className="text-sm text-[#191c1d] opacity-60 hover:text-[#0b55cf] transition-colors" href="#">Security Whitepaper</a>
          <a className="text-sm text-[#191c1d] opacity-60 hover:text-[#0b55cf] transition-colors" href="#">Contact Support</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
