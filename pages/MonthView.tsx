import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { MONTHS_DATA, EVENT_TYPES, AUDIENCE_OPTIONS } from '../constants';
import { Plus, Trash2, Printer, Save, X } from 'lucide-react';
import { Activity } from '../types';

export const MonthView = () => {
  const { activities, holidays, addActivity, updateActivity, deleteActivity, addHoliday, deleteHoliday } = useData();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [holidayDay, setHolidayDay] = useState('');
  const [holidayName, setHolidayName] = useState('');

  const currentMonthData = MONTHS_DATA[selectedMonth];
  const monthActs = activities.filter(a => a.month === selectedMonth);
  const monthHolidays = holidays.filter(h => h.month === selectedMonth);

  const handleAddActivity = () => {
    const newAct: Activity = {
      id: Date.now().toString(),
      month: selectedMonth,
      type: 'Evento Interno', eventName: '', audience: 'Interno', link: '',
      date: '', time: '', postName: '', postOccurrence: '', postAction: '',
      satisfaction: '', status: 'Planejado'
    };
    addActivity(newAct);
  };

  const handleAddHoliday = () => {
    if (holidayDay && holidayName) {
      addHoliday({ id: Date.now().toString(), month: selectedMonth, day: holidayDay, name: holidayName });
      setHolidayDay('');
      setHolidayName('');
    }
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'Concluído': return { bg: '#dcfce7', txt: '#166534' };
      case 'Planejado': return { bg: '#fef9c3', txt: '#854d0e' };
      default: return { bg: '#fee2e2', txt: '#991b1b' };
    }
  };

  const getTypeColor = (t: string) => {
    if (t === 'TI') return 'bg-purple-100 text-purple-800';
    if (t === 'Evento Interno') return 'bg-blue-100 text-blue-800';
    if (t === 'Evento Externo') return 'bg-indigo-100 text-indigo-800';
    if (t === 'Campanha') return 'bg-pink-100 text-pink-800';
    if (t === 'Treinamento') return 'bg-orange-100 text-orange-800';
    return 'bg-cyan-100 text-cyan-800';
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Month Selector */}
      <div className="overflow-x-auto pb-4 no-print">
        <div className="flex gap-2 min-w-max px-1">
          {MONTHS_DATA.map(m => (
            <button
              key={m.id}
              onClick={() => setSelectedMonth(m.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap border shadow-sm ${
                selectedMonth === m.id
                  ? 'bg-blue-900 text-white border-blue-900 ring-2 ring-offset-2 ring-blue-900'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200 hover:border-gray-300'
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>
      </div>

      {/* Header Card */}
      <div className={`bg-white p-6 rounded-lg shadow-sm ${currentMonthData.color} border-l-4`}>
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 uppercase">{currentMonthData.name}</h2>
          <div className="flex gap-2 no-print">
             <button onClick={() => window.print()} className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                <Printer size={16} /> Exportar
             </button>
          </div>
        </div>
        
        {/* Holidays */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-2">
            <h4 className="text-xs font-bold text-gray-500 uppercase">Datas Comemorativas</h4>
            <div className="flex gap-2 no-print bg-gray-50 p-1 rounded items-center">
              <input value={holidayDay} onChange={e => setHolidayDay(e.target.value)} placeholder="Dia" className="w-16 border border-gray-300 rounded px-2 py-1 text-xs" />
              <input value={holidayName} onChange={e => setHolidayName(e.target.value)} placeholder="Evento" className="w-32 border border-gray-300 rounded px-2 py-1 text-xs" />
              <button onClick={handleAddHoliday} className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-blue-700">Add</button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {monthHolidays.map(h => (
              <div key={h.id} className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-800 text-xs rounded-full border border-blue-100">
                <span className="font-bold">{h.day}</span> - {h.name}
                <button onClick={() => deleteHoliday(h.id)} className="text-red-400 hover:text-red-600 ml-1 no-print">
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activities Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b bg-gray-50">
          <h3 className="font-bold text-gray-700 text-sm">Cronograma de Ações</h3>
          <button onClick={handleAddActivity} className="flex items-center gap-1 text-sm bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 no-print">
            <Plus size={14} /> Adicionar Ação
          </button>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-gray-100 text-gray-700 font-semibold uppercase text-xs">
              <tr>
                <th className="px-4 py-3 min-w-[140px]">Tipo</th>
                <th className="px-4 py-3 min-w-[200px]">Nome</th>
                <th className="px-4 py-3 min-w-[120px]">Público</th>
                <th className="px-4 py-3 min-w-[120px]">Data/Hora</th>
                <th className="px-4 py-3 min-w-[120px]">Link</th>
                <th className="px-4 py-3 min-w-[150px]">Ocorrência</th>
                <th className="px-4 py-3 min-w-[150px]">Tomada</th>
                <th className="px-4 py-3 min-w-[120px]">Satisfação</th>
                <th className="px-4 py-3 min-w-[100px]">Status</th>
                <th className="px-4 py-3 w-[50px] no-print">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {monthActs.map(act => {
                const st = getStatusColor(act.status);
                return (
                  <tr key={act.id} className="hover:bg-gray-50 align-top">
                    <td className="px-4 py-3">
                      <select 
                        value={act.type} 
                        onChange={e => updateActivity(act.id, 'type', e.target.value)} 
                        className={`w-full border rounded text-xs p-1.5 ${getTypeColor(act.type)} font-bold outline-none`}
                      >
                        {EVENT_TYPES.map(opt => <option key={opt}>{opt}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <input value={act.eventName} onChange={e => updateActivity(act.id, 'eventName', e.target.value)} className="w-full border border-gray-300 rounded text-xs p-1.5 font-medium" />
                    </td>
                    <td className="px-4 py-3">
                      <select value={act.audience} onChange={e => updateActivity(act.id, 'audience', e.target.value)} className="w-full border border-gray-300 rounded text-xs p-1.5">
                        {AUDIENCE_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <input type="date" value={act.date} onChange={e => updateActivity(act.id, 'date', e.target.value)} className="w-full border border-gray-300 rounded text-xs p-1" />
                        <input type="time" value={act.time} onChange={e => updateActivity(act.id, 'time', e.target.value)} className="w-full border border-gray-300 rounded text-xs p-1" />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <input value={act.link} onChange={e => updateActivity(act.id, 'link', e.target.value)} className="w-full border border-gray-300 rounded text-xs p-1.5 text-blue-600" placeholder="http://" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                         <input value={act.postName} onChange={e => updateActivity(act.id, 'postName', e.target.value)} placeholder="Responsável" className="w-full border border-gray-200 rounded text-[10px] p-1 bg-gray-50" />
                         <textarea value={act.postOccurrence} onChange={e => updateActivity(act.id, 'postOccurrence', e.target.value)} className="w-full border border-gray-300 rounded p-1 text-xs h-12 resize-none" />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <textarea value={act.postAction} onChange={e => updateActivity(act.id, 'postAction', e.target.value)} className="w-full border border-gray-300 rounded p-1 text-xs h-16 resize-none bg-yellow-50" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 mb-1">
                        <input type="number" min="0" max="100" value={act.satisfaction} onChange={e => updateActivity(act.id, 'satisfaction', e.target.value)} className="w-12 border border-gray-300 rounded text-xs p-1 text-center font-bold" />
                        <span className="text-xs text-gray-500">%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${Math.min(Number(act.satisfaction) || 0, 100)}%` }}></div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                       <select 
                         value={act.status} 
                         onChange={e => updateActivity(act.id, 'status', e.target.value)} 
                         className="w-full text-xs font-bold rounded p-1.5 cursor-pointer border-none"
                         style={{ backgroundColor: st.bg, color: st.txt }}
                       >
                         {['Planejado', 'Em Execução', 'Concluído', 'Cancelado'].map(s => <option key={s}>{s}</option>)}
                       </select>
                    </td>
                    <td className="px-4 py-3 text-center no-print">
                      <button onClick={() => deleteActivity(act.id)} className="text-gray-400 hover:text-red-600 p-1">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {monthActs.length === 0 && <div className="p-8 text-center text-gray-400 text-sm">Nenhuma atividade registrada para este mês.</div>}
        </div>
      </div>
    </div>
  );
};