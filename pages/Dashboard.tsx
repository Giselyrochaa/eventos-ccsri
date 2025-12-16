import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Star, Target, CheckCircle2, ShieldAlert, Bell, Printer, X, Plus } from 'lucide-react';
import { MONTHS_DATA } from '../constants';

export const Dashboard = () => {
  const { activities, crises, notifications, addNotification, deleteNotification } = useData();
  const [newNote, setNewNote] = useState('');

  const completedActs = activities.filter(a => a.status === 'Concluído');
  const annualGoal = activities.length;
  const annualAchieved = completedActs.length;
  const ratedEvents = completedActs.filter(a => a.satisfaction && !isNaN(parseFloat(a.satisfaction)));
  const totalSatisfaction = ratedEvents.reduce((acc, curr) => acc + parseFloat(curr.satisfaction), 0);
  const averageSatisfaction = ratedEvents.length > 0 ? Math.round(totalSatisfaction / ratedEvents.length) : 0;

  const topEvents = [...ratedEvents]
    .sort((a, b) => parseFloat(b.satisfaction) - parseFloat(a.satisfaction))
    .slice(0, 5);

  const chartData = MONTHS_DATA.map(m => ({
    name: m.name.substring(0, 3),
    total: activities.filter(a => a.month === m.id).length
  }));

  const handleAddNote = () => {
    if (newNote.trim()) {
      addNotification(newNote);
      setNewNote('');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Geral</h2>
        <button 
          onClick={() => window.print()} 
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium no-print shadow-sm"
        >
          <Printer size={18} /> Exportar PDF
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-indigo-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 font-medium">Média Real (Anual)</p>
              <h3 className="text-3xl font-bold text-indigo-700">{averageSatisfaction}%</h3>
            </div>
            <Star className="text-indigo-500 h-8 w-8 opacity-80" />
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
            <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${averageSatisfaction}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-600">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 font-medium">Meta Anual</p>
              <h3 className="text-3xl font-bold text-gray-800">{annualGoal}</h3>
            </div>
            <Target className="text-blue-600 h-8 w-8 opacity-80" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 font-medium">Atingidas</p>
              <h3 className="text-3xl font-bold text-gray-800">{annualAchieved}</h3>
            </div>
            <CheckCircle2 className="text-green-500 h-8 w-8 opacity-80" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 font-medium">Riscos</p>
              <h3 className="text-3xl font-bold text-gray-800">{crises.length}</h3>
            </div>
            <ShieldAlert className="text-red-500 h-8 w-8 opacity-80" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col h-80 print:hidden">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Evolução de Atividades</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
              <Tooltip cursor={{fill: 'transparent'}} />
              <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.total > 0 ? '#3b82f6' : '#f3f4f6'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Events */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col h-80">
           <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
             <Star className="text-yellow-500" size={20}/> Top Eventos
           </h3>
           <div className="overflow-y-auto custom-scrollbar flex-1 pr-2">
              {topEvents.length === 0 ? (
                <p className="text-gray-400 text-sm italic text-center mt-10">Sem avaliações ainda.</p>
              ) : (
                <div className="space-y-2">
                  {topEvents.map((evt, idx) => (
                    <div key={evt.id} className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-100">
                      <div className="flex items-center gap-3">
                        <span className="w-5 h-5 flex items-center justify-center bg-yellow-100 text-yellow-700 rounded-full text-[10px] font-bold">#{idx + 1}</span>
                        <div>
                          <p className="text-xs font-bold text-gray-800 truncate max-w-[120px]" title={evt.eventName}>{evt.eventName}</p>
                          <p className="text-[10px] text-gray-500">{evt.type}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded">{evt.satisfaction}%</span>
                    </div>
                  ))}
                </div>
              )}
           </div>
        </div>

        {/* Mural */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col h-80 print:hidden">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Bell className="text-blue-500" size={20}/> Mural
            </h3>
            <div className="flex gap-2 mb-4">
              <input 
                type="text" 
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Novo aviso..."
                className="flex-1 border border-gray-300 rounded px-2 py-1 text-xs outline-none focus:border-blue-500"
              />
              <button onClick={handleAddNote} className="bg-blue-600 text-white p-1 rounded hover:bg-blue-700">
                <Plus size={16} />
              </button>
            </div>
            <div className="overflow-y-auto custom-scrollbar flex-1 space-y-2 pr-2">
              {notifications.map(n => (
                <div key={n.id} className="bg-yellow-50 border-l-4 border-yellow-400 p-2 rounded shadow-sm relative group">
                  <p className="text-xs text-yellow-800 font-medium pr-4">{n.text}</p>
                  <p className="text-[10px] text-yellow-600 mt-1">{new Date(n.timestamp).toLocaleDateString()} {new Date(n.timestamp).toLocaleTimeString().slice(0,5)}</p>
                  <button 
                    onClick={() => deleteNotification(n.id)}
                    className="absolute top-1 right-1 text-yellow-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              {notifications.length === 0 && <p className="text-xs text-gray-400 text-center mt-4">Nenhum aviso.</p>}
            </div>
        </div>
      </div>
    </div>
  );
};