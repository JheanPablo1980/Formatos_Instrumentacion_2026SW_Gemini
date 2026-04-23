import { useEffect, useState } from 'react';
import { Database, Plus, Camera, FileText, Download, Check } from 'lucide-react';
import { useAppStore } from './store/useAppStore';
import { Admin } from './components/Admin';
import { NuevoRegistro } from './components/NuevoRegistro';
import { RegistroFotos } from './components/RegistroFotos';
import { ListaPerfiles } from './components/ListaPerfiles';
import { VistaGenerar } from './components/VistaGenerar';
import { motion, AnimatePresence } from 'motion/react';

type Tab = 'admin' | 'nuevo' | 'fotos' | 'perfiles' | 'generar';

export default function App() {
  const loadData = useAppStore(state => state.loadData);
  const [activeTab, setActiveTab] = useState<Tab>('admin');

  useEffect(() => { 
    loadData(); 
  }, [loadData]);

  const navigation: { id: Tab; icon: any; label: string }[] = [
    { id: 'admin', icon: Database, label: 'Admin' },
    { id: 'nuevo', icon: Plus, label: 'Nuevo' },
    { id: 'fotos', icon: Camera, label: 'Cámara' },
    { id: 'perfiles', icon: FileText, label: 'Perfiles' },
    { id: 'generar', icon: Download, label: 'Exportar' },
  ];

  return (
    <div className="min-h-screen bg-[#F3F6FA] font-sans selection:bg-blue-200 text-slate-900">
      <header className="bg-[#1F3864] text-white p-4 shadow-lg sticky top-0 z-40 flex justify-between items-center transition-all">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-2 rounded-lg backdrop-blur">
            <FileText size={20} className="text-blue-200" />
          </div>
          <div>
            <h1 className="font-bold text-base leading-tight tracking-tight uppercase">Protocolos I&C</h1>
            <span className="text-[10px] text-blue-300 font-bold tracking-widest uppercase opacity-80">Smurfit Westrock</span>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-sm">
          <Check size={12} className="text-green-400" />
          <span className="text-[10px] font-bold tracking-wider uppercase">Local Sync</span>
        </div>
      </header>

      <main className="pb-24 max-w-7xl mx-auto min-h-[calc(100vh-60px)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {activeTab === 'admin' && <Admin />}
            {activeTab === 'nuevo' && <NuevoRegistro />}
            {activeTab === 'fotos' && <RegistroFotos />}
            {activeTab === 'perfiles' && <ListaPerfiles />}
            {activeTab === 'generar' && <VistaGenerar />}
          </motion.div>
        </AnimatePresence>
      </main>

      <nav className="fixed bottom-0 w-full bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-[0_-4px_20px_0_rgba(0,0,0,0.05)] z-50 transition-all">
        <div className="max-w-xl mx-auto flex justify-around items-center px-2 py-1">
          {navigation.map(({ id, icon: Icon, label }) => {
            const isActive = activeTab === id;
            return (
              <button 
                key={id}
                onClick={() => setActiveTab(id)}
                className={`group flex-1 py-3 flex flex-col items-center justify-center gap-1.5 transition-all relative ${
                  isActive ? 'text-[#1F3864]' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="nav-bg"
                    className="absolute -top-1 w-1/2 h-1 bg-[#1F3864] rounded-full"
                  />
                )}
                <div className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-active:scale-95'}`}>
                  <Icon size={isActive ? 22 : 20} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={`text-[9px] font-bold uppercase tracking-widest transition-opacity ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                  {label}
                </span>
              </button>
            )
          })}
        </div>
        <div className="h-safe-bottom bg-white/95"></div>
      </nav>
    </div>
  );
}
