import { useState } from 'react';
import Portal from './components/Portal';
import Dashboard from './components/Dashboard';

function App() {
  const [view, setView] = useState<'portal' | 'dashboard'>('portal');

  return (
    <div className="relative min-h-screen">
      {/* Perspective Toggle (Only for Demo) */}
      <div className="fixed top-4 right-4 z-[9999] flex gap-2 no-print bg-white/10 backdrop-blur p-1 rounded-full border border-black/5 shadow-sm">
        <button
          onClick={() => setView('portal')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${view === 'portal' ? 'bg-black text-white' : 'hover:bg-black/5 text-gray-500'}`}
        >
          Customer
        </button>
        <button
          onClick={() => setView('dashboard')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${view === 'dashboard' ? 'bg-black text-white' : 'hover:bg-black/5 text-gray-500'}`}
        >
          Shopkeeper
        </button>
      </div>

      <main>
        {view === 'portal' ? <Portal /> : <Dashboard />}
      </main>
    </div>
  );
}

export default App;
