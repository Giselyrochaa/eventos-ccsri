import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { MONTHS_DATA } from '../constants';
import { Printer, Wand2 } from 'lucide-react';

export const ReportsView = () => {
  const { activities, monthlyReports, updateReport } = useData();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  const monthActs = activities.filter(a => a.month === selectedMonth);
  const total = monthActs.length;
  const completed = monthActs.filter(a => a.status === 'Concluído').length;
  const missed = total - completed;
  const internal = monthActs.filter(a => a.type === 'Evento Interno').length;
  const ratedMonthActs = monthActs.filter(a => a.satisfaction && !isNaN(parseFloat(a.satisfaction)));
  const totalMonthSat = ratedMonthActs.reduce((acc, curr) => acc + parseFloat(curr.satisfaction), 0);
  const avgMonthSat = ratedMonthActs.length > 0 ? Math.round(totalMonthSat / ratedMonthActs.length) : 0;
  
  const report = monthlyReports[selectedMonth] || { explanation: '', highlights: '', suggestions: '' };

  const handleGenerateAnalysis = () => {
    const efficiency = total > 0 ? Math.round((completed/total)*100) : 0;
    const text = `ANÁLISE DE ENTREGAS - ${MONTHS_DATA[selectedMonth].name.toUpperCase()}\n\nO mês encerrou com ${total} ações planejadas e ${completed} metas atingidas. Eficiência: ${efficiency}%.`;
    updateReport(selectedMonth, 'explanation', text);
  };

  const handleGenerateHighlights = () => {
    const completedActs = monthActs.filter(a => a.status === 'Concluído');
    let text = "RESULTADOS CONSOLIDADOS:\n\n";
    if (completedActs.length === 0) text += "- Nenhuma atividade concluída.";
    else completedActs.forEach(act => text += `• ${act.type}: "${act.eventName || 'Evento'}" - Satisfação: ${act.satisfaction || '0'}%\n`);
    updateReport(selectedMonth, 'highlights', text);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
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

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Relatório de Desempenho e Metas</h2>
          <p className="text-gray-500">Mês de Referência: <span className="font-bold text-blue-600">{MONTHS_DATA[selectedMonth].name}</span></p>
        </div>
        <button 
          onClick={() => window.print()} 
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 font-bold no-print"
        >
          <Printer size={16} /> Exportar para Alta Gestão
        </button>
      </div>

      {/* KPI Stats */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-sm font-bold text-gray-500 uppercase mb-4 border-b pb-2">Metas Consolidadas do Mês</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-4 bg-gray-50 rounded text-center">
            <div className="text-3xl font-bold text-gray-800">{total}</div>
            <div className="text-xs font-bold text-gray-500 uppercase mt-1">Meta Mensal</div>
          </div>
          <div className="p-4 bg-green-50 rounded text-center">
            <div className="text-3xl font-bold text-green-600">{completed}</div>
            <div className="text-xs font-bold text-green-800 uppercase mt-1">Atingidas</div>
          </div>
          <div className="p-4 bg-yellow-50 rounded text-center">
            <div className="text-3xl font-bold text-yellow-600">{missed}</div>
            <div className="text-xs font-bold text-yellow-800 uppercase mt-1">Não Alcançadas</div>
          </div>
          <div className="p-4 bg-blue-50 rounded text-center">
            <div className="text-3xl font-bold text-blue-600">{internal}</div>
            <div className="text-xs font-bold text-blue-800 uppercase mt-1">Internos</div>
          </div>
          <div className="p-4 bg-indigo-50 rounded text-center border border-indigo-100">
            <div className="text-3xl font-bold text-indigo-600">{avgMonthSat}%</div>
            <div className="text-xs font-bold text-indigo-800 uppercase mt-1">Média Satisfação</div>
          </div>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-gray-800 text-lg">1. Análise Direta</h3>
            <button onClick={handleGenerateAnalysis} className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 font-bold no-print">
              <Wand2 size={12} /> Gerar Análise
            </button>
          </div>
          <textarea 
            value={report.explanation} 
            onChange={e => updateReport(selectedMonth, 'explanation', e.target.value)}
            className="w-full border border-gray-300 rounded p-4 h-48 focus:ring-blue-500 resize-none leading-relaxed text-sm text-gray-700" 
            placeholder="Escreva a análise da alta gestão..."
          />
        </div>

        <div className="bg-white p-6 rounded shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-gray-800 text-lg">2. Pontos Altos</h3>
            <button onClick={handleGenerateHighlights} className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full hover:bg-green-200 font-bold no-print">
              <Wand2 size={12} /> Gerar Destaques
            </button>
          </div>
          <textarea 
            value={report.highlights}
            onChange={e => updateReport(selectedMonth, 'highlights', e.target.value)}
            className="w-full border border-gray-300 rounded p-4 h-32 focus:ring-green-500 resize-none text-sm" 
            placeholder="Liste resultados..."
          />
        </div>
      </div>
    </div>
  );
};