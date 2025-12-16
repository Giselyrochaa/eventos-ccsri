import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  CalendarDays, 
  CalendarRange, 
  FileText, 
  ShieldAlert, 
  LogOut, 
  Menu,
  X
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const NavItem = ({ to, icon: Icon, label, active, onClick }: any) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${
      active 
        ? 'bg-blue-800 text-white shadow-md' 
        : 'text-blue-100 hover:bg-blue-800/50 hover:text-white'
    }`}
  >
    <Icon size={18} />
    <span>{label}</span>
  </Link>
);

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-blue-900 text-white h-screen sticky top-0 shadow-xl z-20 print:hidden">
        <div className="p-6 border-b border-blue-800">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-blue-900 font-bold text-sm">AE</div>
            <span className="font-bold text-lg tracking-tight">Evereste</span>
          </div>
          <p className="text-xs text-blue-300">Gestão de Comunicação</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" active={isActive('/dashboard')} />
          <NavItem to="/month" icon={CalendarDays} label="Ações do Mês" active={isActive('/month')} />
          <NavItem to="/calendar" icon={CalendarRange} label="Calendário Anual" active={isActive('/calendar')} />
          <NavItem to="/reports" icon={FileText} label="Relatórios & Metas" active={isActive('/reports')} />
          <NavItem to="/crisis" icon={ShieldAlert} label="Riscos & Crises" active={isActive('/crisis')} />
        </nav>

        <div className="p-4 border-t border-blue-800">
          <div className="flex items-center gap-3 px-4 py-2 mb-2">
             <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-xs font-bold">
                {user?.name?.substring(0,2).toUpperCase()}
             </div>
             <div className="overflow-hidden">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-[10px] text-blue-300 truncate">{user?.email}</p>
             </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2 text-red-300 hover:bg-blue-800 hover:text-red-200 rounded-lg text-sm transition-colors"
          >
            <LogOut size={18} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden bg-blue-900 text-white p-4 flex justify-between items-center sticky top-0 z-50 print:hidden">
        <div className="flex items-center gap-2">
           <div className="w-6 h-6 bg-white rounded flex items-center justify-center text-blue-900 font-bold text-xs">AE</div>
           <span className="font-bold">Evereste</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-blue-900 pt-16 px-4 space-y-2 print:hidden">
          <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" active={isActive('/dashboard')} onClick={() => setMobileMenuOpen(false)} />
          <NavItem to="/month" icon={CalendarDays} label="Ações do Mês" active={isActive('/month')} onClick={() => setMobileMenuOpen(false)} />
          <NavItem to="/calendar" icon={CalendarRange} label="Calendário Anual" active={isActive('/calendar')} onClick={() => setMobileMenuOpen(false)} />
          <NavItem to="/reports" icon={FileText} label="Relatórios & Metas" active={isActive('/reports')} onClick={() => setMobileMenuOpen(false)} />
          <NavItem to="/crisis" icon={ShieldAlert} label="Riscos & Crises" active={isActive('/crisis')} onClick={() => setMobileMenuOpen(false)} />
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-red-300 border-t border-blue-800 mt-4">
            <LogOut size={18} /> Sair
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto max-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:p-0 print:m-0 print:max-w-none">
          {children}
        </div>
        
        {/* Print Footer */}
        <footer className="hidden print:block fixed bottom-0 left-0 w-full text-center text-[10px] text-gray-400 border-t p-2 bg-white">
          <p className="uppercase font-bold">Assessoria de Comunicação Evereste - Relatório Oficial</p>
          <p>Gerado em {new Date().toLocaleDateString()}</p>
        </footer>
      </main>
    </div>
  );
};