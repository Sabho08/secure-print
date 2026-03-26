import React from 'react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin }) => {
  return (
    <div className="bg-surface font-body text-on-surface antialiased">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-[#f8f9fa] dark:bg-[#191c1d]">
        <nav className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <div className="text-2xl font-black text-[#191c1d] dark:text-[#f8f9fa] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0b55cf] dark:text-[#3870ea]">shield</span>
            <span className="font-headline tracking-tight">SecurePrint</span>
          </div>
          <div className="hidden md:flex gap-8 items-center">
            <a className="text-[#0b55cf] dark:text-[#3870ea] font-semibold hover:opacity-80 transition-opacity" href="#">Product</a>
            <a className="text-[#191c1d] dark:text-[#f8f9fa] opacity-70 hover:opacity-80 transition-opacity" href="#">Solutions</a>
            <a className="text-[#191c1d] dark:text-[#f8f9fa] opacity-70 hover:opacity-80 transition-opacity" href="#">Pricing</a>
          </div>
          <button 
            onClick={onLogin}
            className="bg-primary-container text-on-primary-container px-6 py-2 rounded-xl font-semibold primary-btn-gradient hover:opacity-90 active:scale-95 duration-200 transition-all"
          >
            Log in
          </button>
        </nav>
      </header>

      <main className="pt-24">
        {/* Hero Section */}
        <section className="relative overflow-hidden px-6 py-16 md:py-32 hero-gradient">
          <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-tertiary-container/10 text-tertiary-container mb-8 border border-tertiary-container/20">
              <span className="material-symbols-outlined text-sm">verified_user</span>
              <span className="text-xs font-bold uppercase tracking-wider font-label">Trusted by Fortune 500</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.1] max-w-4xl">
              Secure Printing. <span className="text-primary">Redefined.</span>
            </h1>
            <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mb-10 leading-relaxed">
              Access your secure print terminal effortlessly. SecurePrint ensures your sensitive documents stay private from upload to the tray.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button 
                onClick={onGetStarted}
                className="primary-btn-gradient text-on-primary px-8 py-4 rounded-xl text-lg font-bold ambient-shadow active:scale-95 duration-200"
              >
                Get Started
              </button>
              <button className="bg-surface-container-lowest text-on-surface px-8 py-4 rounded-xl text-lg font-semibold border border-outline-variant/15 active:scale-95 duration-200">
                Watch Demo
              </button>
            </div>
            {/* Hero Image Placeholder / Terminal Preview */}
            <div className="mt-20 w-full max-w-5xl rounded-2xl overflow-hidden ambient-shadow border border-outline-variant/10">
              <img 
                alt="Modern printing interface" 
                className="w-full h-auto object-cover aspect-[16/9]" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQ04ajNs_Imv1qhU_qkYgrZjqEDEgKQzdcIcUGUVhEh4-mr74Lg-HczkUguLbfpeoSaAULMVaqklVct5foI2yD73IgWP_MEVbiLcVF3PtDaRfJR-iy-4zbOyDYvNjkVQfKqU8M5rpb4S6wc-ucXb1rS3ZRUKkgDHl7dWkRMcJNXDwzbC7luXq3sjK1Hokgy9ZpGX2fFNK3tioJjmx4OW9gZaqM5DjYUNTx-GxeIdSZEa59Qn0lhzDpBuz5Ux-dNsawNBfsRDFcSTcI"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-6 py-24 bg-surface-container-low">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Engineered for Privacy</h2>
              <p className="text-on-surface-variant max-w-xl">Every print job is encrypted with military-grade standards before it ever leaves your device.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-surface-container-lowest p-8 rounded-2xl ambient-shadow flex flex-col items-start transition-all hover:-translate-y-1">
                <div className="w-14 h-14 bg-primary/5 rounded-xl flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-primary text-3xl">lock</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Unmatched Security</h3>
                <p className="text-on-surface-variant leading-relaxed">End-to-end encryption ensures your data remains invisible until you authorize the final release at the terminal.</p>
              </div>
              {/* Feature 2 */}
              <div className="bg-surface-container-lowest p-8 rounded-2xl ambient-shadow flex flex-col items-start transition-all hover:-translate-y-1">
                <div className="w-14 h-14 bg-primary/5 rounded-xl flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-primary text-3xl">bolt</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Seamless Workflow</h3>
                <p className="text-on-surface-variant leading-relaxed">Print from any device, anywhere. Our intuitive interface integrates directly into your existing office ecosystem.</p>
              </div>
              {/* Feature 3 */}
              <div className="bg-surface-container-lowest p-8 rounded-2xl ambient-shadow flex flex-col items-start transition-all hover:-translate-y-1">
                <div className="w-14 h-14 bg-primary/5 rounded-xl flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-primary text-3xl">cloud</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Cloud Integration</h3>
                <p className="text-on-surface-variant leading-relaxed">Connect securely to Google Drive, Microsoft 365, and Dropbox for instant document retrieval and printing.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="px-6 py-24 bg-surface">
          <div className="max-w-7xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-black tracking-tight mb-4">Print in Seconds</h2>
            <p className="text-on-surface-variant">Simple steps to professional-grade security.</p>
          </div>
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center text-2xl font-black mb-6 z-10">1</div>
              <h3 className="text-xl font-bold mb-2">Sign In</h3>
              <p className="text-on-surface-variant">Authenticated access using your corporate credentials or biometric ID.</p>
              <div className="mt-8 bg-surface-container-low rounded-xl p-4 w-full aspect-video flex items-center justify-center">
                <span className="material-symbols-outlined text-5xl text-outline">login</span>
              </div>
            </div>
            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center text-2xl font-black mb-6 z-10">2</div>
              <h3 className="text-xl font-bold mb-2">Upload Documents</h3>
              <p className="text-on-surface-variant">Securely drag and drop or select files from your preferred cloud storage.</p>
              <div className="mt-8 bg-surface-container-low rounded-xl p-4 w-full aspect-video flex items-center justify-center">
                <span className="material-symbols-outlined text-5xl text-outline">upload_file</span>
              </div>
            </div>
            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center text-2xl font-black mb-6 z-10">3</div>
              <h3 className="text-xl font-bold mb-2">Print Securely</h3>
              <p className="text-on-surface-variant">Release your documents at any terminal using a unique QR code or NFC.</p>
              <div className="mt-8 bg-surface-container-low rounded-xl p-4 w-full aspect-video flex items-center justify-center">
                <span className="material-symbols-outlined text-5xl text-outline">print</span>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="px-6 py-24 bg-[#0b55cf]">
          <div className="max-w-4xl mx-auto text-center">
            <span className="material-symbols-outlined text-6xl text-on-primary/30 mb-8">format_quote</span>
            <p className="text-2xl md:text-4xl font-medium text-on-primary leading-tight mb-10 italic">
              "SecurePrint has fundamentally changed how we handle sensitive legal documents. Our office security has improved tenfold, and the seamless workflow has made our team significantly more efficient."
            </p>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full overflow-hidden mb-4 border-2 border-on-primary/20">
                <img 
                  alt="Professional User" 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAswyRy5G-lKlC0Da_IGPpgwV-CCNLE_y9BzojpUNHcseFJ7-3iXoWFY4hoNjkfSAOEDaqG3mv4VEATT-tltCSjJsYkn7bCw6ghK0CapdN6JIBbNIVwmNvJyfG-7tOxL7Dkqar76m83n-rHD730p4qzHA5L2VOJX3_Lm5XYCPt37WLUPq3r2LSeEaRd2GrJc6Juh3_i_ODQXT3NLMzpBcGgDvvkIn7k7cjnDppWq36KlYiEJKklhkbcYz205vZ0jCnbxuInQ2SIukX7"
                />
              </div>
              <h4 className="text-on-primary font-bold text-lg">Jonathan Sterling</h4>
              <p className="text-on-primary/70 text-sm">Operations Director, Sterling & Associates</p>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="px-6 py-24 bg-surface text-center">
          <div className="max-w-3xl mx-auto bg-surface-container-low rounded-[3rem] p-12 md:p-20 ambient-shadow">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">Ready to secure your prints?</h2>
            <p className="text-lg text-on-surface-variant mb-10">Join over 5,000 businesses trusting SecurePrint for their document security.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={onGetStarted}
                className="primary-btn-gradient text-on-primary px-10 py-4 rounded-xl text-lg font-bold hover:opacity-90 transition-all active:scale-95 duration-200"
              >
                Create account
              </button>
              <button className="bg-surface-container-lowest text-on-surface px-10 py-4 rounded-xl text-lg font-semibold border border-outline-variant/15 hover:bg-surface-bright transition-all active:scale-95 duration-200">
                Talk to Sales
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#f3f4f5] dark:bg-[#121415] w-full rounded-t-3xl">
        <div className="flex flex-col md:flex-row justify-between items-center px-8 py-12 gap-6 w-full max-w-7xl mx-auto">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="font-bold text-[#191c1d] dark:text-[#f8f9fa] flex items-center gap-2 text-xl">
              <span className="material-symbols-outlined text-[#0b55cf]">shield</span>
              <span>SecurePrint Terminal</span>
            </div>
            <p className="font-['Inter'] text-sm leading-relaxed text-[#191c1d] dark:text-[#f8f9fa] opacity-60">
              © 2024 SecurePrint Terminal. All rights reserved.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <a className="font-['Inter'] text-sm text-[#191c1d] dark:text-[#f8f9fa] opacity-60 hover:text-[#0b55cf] dark:hover:text-[#3870ea] transition-colors" href="#">Privacy Policy</a>
            <a className="font-['Inter'] text-sm text-[#191c1d] dark:text-[#f8f9fa] opacity-60 hover:text-[#0b55cf] dark:hover:text-[#3870ea] transition-colors" href="#">Terms of Service</a>
            <a className="font-['Inter'] text-sm text-[#191c1d] dark:text-[#f8f9fa] opacity-60 hover:text-[#0b55cf] dark:hover:text-[#3870ea] transition-colors" href="#">Security Whitepaper</a>
            <a className="font-['Inter'] text-sm text-[#191c1d] dark:text-[#f8f9fa] opacity-60 hover:text-[#0b55cf] dark:hover:text-[#3870ea] transition-colors" href="#">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
