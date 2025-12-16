import React from 'react';
import { useData } from '../contexts/DataContext';
import { MONTHS_DATA } from '../constants';
import { Printer } from 'lucide-react';

export const CalendarView = () => {
  const { activities } = useData();

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Calendário Anual Consolidado</h2>
        <button 
          onClick={() => window.print()} 
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium no-print shadow-sm"
        >
          <Printer size={18} /> Exportar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MONTHS_DATA.map(m => {
          const mActs = activities.filter(a => a.month === m.id);
          const total = mActs.length;
          const achieved = mActs.filter(a => a.status === 'Concluído').length;

          return (
            <div key={m.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden print-break-avoid flex flex-col h-auto min-h-[150px]">
              <div className={`px-4 py-3 ${m.color} bg-gray-50 border-b border-gray-100 flex justify-between items-center`}>
                <h3 className="font-bold text-gray-800">{m.name}</h3>
                <span className="text-xs font-bold bg-white px-2 py-1 rounded shadow-sm border text-gray-500">{total} Ações</span>
              </div>
              <div className="p-4 flex-1">
                <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Eventos:</h4>
                <ul className="space-y-1 mb-4">
                  {mActs.length > 0 ? (
                    mActs.map(act => (
                      <li key={act.id} className="text-xs text-gray-700 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1 flex-shrink-0"></span>
                        <span title={act.eventName || 'Sem nome'} className="truncate">{act.eventName || 'Sem nome'}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-xs text-gray-300 italic">Nenhum evento</li>
                  )}
                </ul>
              </div>
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex justify-between text-xs mt-auto">
                <span className="text-green-600 font-bold">Concluídos: {achieved}</span>
                <span className="text-gray-500">Planejados: {total}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};