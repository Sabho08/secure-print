import React from 'react';
import { motion } from 'framer-motion';
import logo from '../assets/logo.png';

interface LandingPageProps {
  onGetStarted: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="bg-surface font-body text-on-surface antialiased overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-16 md:py-32 hero-gradient">
        <motion.div 
          className="max-w-7xl mx-auto flex flex-col items-center text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Logo mark above title */}
          <motion.div variants={itemVariants} className="mb-6">
            <img src={logo} alt="SecurePrint" className="w-32 h-32 object-contain mx-auto drop-shadow-lg" />
          </motion.div>
          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.1] max-w-4xl font-headline"
          >
            Secure Printing. <span className="text-primary">Redefined.</span>
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl text-on-surface-variant max-w-2xl mb-10 leading-relaxed font-body"
          >
            Access your secure print terminal effortlessly. SecurePrint ensures your sensitive documents stay private from upload to the tray.
          </motion.p>
          
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <motion.button 
              onClick={onGetStarted}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="primary-btn-gradient text-on-primary px-8 py-4 rounded-xl text-lg font-bold ambient-shadow font-body cursor-pointer"
            >
              Get Started
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: 'var(--color-surface-container-low)' }}
              whileTap={{ scale: 0.95 }}
              className="bg-surface-container-lowest text-on-surface px-8 py-4 rounded-xl text-lg font-semibold border border-outline-variant/15 font-body cursor-pointer"
            >
              Watch Demo
            </motion.button>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-20 w-full max-w-5xl rounded-2xl overflow-hidden ambient-shadow border border-outline-variant/10 relative"
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <img 
                alt="Modern printing interface" 
                className="w-full h-auto object-cover aspect-[16/9]" 
                data-alt="Modern clean dashboard UI showing print queue and security status"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQ04ajNs_Imv1qhU_qkYgrZjqEDEgKQzdcIcUGUVhEh4-mr74Lg-HczkUguLbfpeoSaAULMVaqklVct5foI2yD73IgWP_MEVbiLcVF3PtDaRfJR-iy-4zbOyDYvNjkVQfKqU8M5rpb4S6wc-ucXb1rS3ZRUKkgDHl7dWkRMcJNXDwzbC7luXq3sjK1Hokgy9ZpGX2fFNK3tioJjmx4OW9gZaqM5DjYUNTx-GxeIdSZEa59Qn0lhzDpBuz5Ux-dNsawNBfsRDFcSTcI"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-24 bg-surface-container-low">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight mb-4 font-headline">Engineered for Privacy</h2>
            <p className="text-on-surface-variant max-w-xl font-body">Every print job is encrypted with military-grade standards before it ever leaves your device.</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: 'lock', title: 'Unmatched Security', desc: 'End-to-end encryption ensures your data remains invisible until you authorize the final release at the terminal.' },
              { icon: 'bolt', title: 'Seamless Workflow', desc: 'Print from any device, anywhere. Our intuitive interface integrates directly into your existing office ecosystem.' },
              { icon: 'cloud', title: 'Cloud Integration', desc: 'Connect securely to Google Drive, Microsoft 365, and Dropbox for instant document retrieval and printing.' }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="bg-surface-container-lowest p-8 rounded-2xl ambient-shadow flex flex-col items-start"
              >
                <div className="w-14 h-14 bg-primary/5 rounded-xl flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-primary text-3xl" data-icon={feature.icon}>{feature.icon}</span>
                </div>
                <h3 className="text-xl font-bold mb-3 font-headline">{feature.title}</h3>
                <p className="text-on-surface-variant leading-relaxed font-body">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-6 py-24 bg-surface">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto text-center mb-16"
        >
          <h2 className="text-4xl font-black tracking-tight mb-4 font-headline">Print in Seconds</h2>
          <p className="text-on-surface-variant font-body">Simple steps to professional-grade security.</p>
        </motion.div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {[
            { step: 1, icon: 'login', title: 'Sign In', desc: 'Authenticated access using your corporate credentials or biometric ID.' },
            { step: 2, icon: 'upload_file', title: 'Upload Documents', desc: 'Securely drag and drop or select files from your preferred cloud storage.' },
            { step: 3, icon: 'print', title: 'Print Securely', desc: 'Release your documents at any terminal using a unique QR code or NFC.' }
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="flex flex-col items-center text-center group"
            >
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center text-2xl font-black mb-6 z-10 font-headline group-hover:shadow-[0_0_20px_rgba(11,85,207,0.4)] transition-shadow"
              >
                {item.step}
              </motion.div>
              <h3 className="text-xl font-bold mb-2 font-headline">{item.title}</h3>
              <p className="text-on-surface-variant font-body">{item.desc}</p>
              <motion.div 
                whileHover={{ y: -5 }}
                className="mt-8 bg-surface-container-low rounded-xl p-4 w-full aspect-video flex items-center justify-center border border-transparent group-hover:border-primary/20 transition-colors"
              >
                <span className="material-symbols-outlined text-5xl text-outline group-hover:text-primary transition-colors" data-icon={item.icon}>{item.icon}</span>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="px-6 py-24 bg-primary relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <motion.span 
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            className="material-symbols-outlined text-6xl text-on-primary/30 mb-8" 
            data-icon="format_quote"
          >
            format_quote
          </motion.span>
          <p className="text-2xl md:text-4xl font-medium text-on-primary leading-tight mb-10 italic font-headline">
            "SecurePrint has fundamentally changed how we handle sensitive legal documents. Our office security has improved tenfold, and the seamless workflow has made our team significantly more efficient."
          </p>
          <div className="flex flex-col items-center">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="w-16 h-16 rounded-full overflow-hidden mb-4 border-2 border-on-primary/20"
            >
              <img 
                alt="Professional User" 
                className="w-full h-full object-cover" 
                data-alt="Professional portrait of a business executive"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAswyRy5G-lKlC0Da_IGPpgwV-CCNLE_y9BzojpUNHcseFJ7-3iXoWFY4hoNjkfSAOEDaqG3mv4VEATT-tltCSjJsYkn7bCw6ghK0CapdN6JIBbNIVwmNvJyfG-7tOxL7Dkqar76m83n-rHD730p4qzHA5L2VOJX3_Lm5XYCPt37WLUPq3r2LSeEaRd2GrJc6Juh3_i_ODQXT3NLMzpBcGgDvvkIn7k7cjnDppWq36KlYiEJKklhkbcYz205vZ0jCnbxuInQ2SIukX7"
              />
            </motion.div>
            <h4 className="text-on-primary font-bold text-lg font-headline">Jonathan Sterling</h4>
            <p className="text-on-primary/70 text-sm font-body">Operations Director, Sterling & Associates</p>
          </div>
        </motion.div>
        {/* Background shapes for depth */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/2"></div>
      </section>

      {/* Final CTA Section */}
      <section className="px-6 py-24 bg-surface text-center mb-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto bg-surface-container-low rounded-[3rem] p-12 md:p-20 ambient-shadow"
        >
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6 font-headline">Ready to secure your prints?</h2>
          <p className="text-lg text-on-surface-variant mb-10 font-body">Join over 5,000 businesses trusting SecurePrint for their document security.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.button 
              onClick={onGetStarted}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="primary-btn-gradient text-on-primary px-10 py-4 rounded-xl text-lg font-bold hover:shadow-lg transition-all font-body cursor-pointer"
            >
              Create account
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: 'var(--color-surface-bright)' }}
              whileTap={{ scale: 0.95 }}
              className="bg-surface-container-lowest text-on-surface px-10 py-4 rounded-xl text-lg font-semibold border border-outline-variant/15 transition-all font-body cursor-pointer"
            >
              Talk to Sales
            </motion.button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default LandingPage;

