import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import ShopCode from './components/ShopCode';
import Portal from './components/Portal';

import Header from './components/Header';
import Footer from './components/Footer';

import { supabase } from './utils/supabase';

function LandingPageWrapper() {
  const navigate = useNavigate();
  
  const handleGetStarted = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      navigate('/portal');
    } else {
      navigate('/login');
    }
  };

  return (
    <LandingPage 
      onGetStarted={handleGetStarted} 
    />
  );
}

function App() {
  return (
    <Router>
      <div className="relative min-h-screen bg-[#f8f9fa] font-sans antialiased flex flex-col">
        <Header />
        <main className="flex-grow pt-20">
          <Routes>
            {/* Landing Page */}
            <Route path="/" element={<LandingPageWrapper />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Functional Routes */}
            <Route path="/shop-code" element={<ShopCode />} />
            <Route path="/portal" element={<Portal />} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
