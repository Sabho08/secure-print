import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ShopCode from './components/ShopCode';
import Portal from './components/Portal';

function App() {
  return (
    <Router>
      <div className="relative min-h-screen bg-wetransfer-light font-sans antialiased">
        <main>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Functional Routes */}
            <Route path="/shop-code" element={<ShopCode />} />
            <Route path="/portal" element={<Portal />} />
            
            {/* Fallback */}
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
