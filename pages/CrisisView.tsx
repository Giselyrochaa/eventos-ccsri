import React from 'react';
import { useData } from '../contexts/DataContext';
import { CRISIS_SECTOR_OPTIONS, RISK_LEVELS, ORIGIN_OPTIONS, RESPONSIBLE_OPTIONS } from '../constants';
import { Plus, Trash2, Printer, ShieldAlert, AlertTriangle } from 'lucide-react';
import { Crisis } from '../types';

export const CrisisView = () => {
  const { crises, addCrisis, updateCrisis, deleteCrisis } = useData();

  const handleAddCrisis = () => {
    const newCrisis: Crisis = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      riskLevel: 'Sem relevância crítica', origin: 'Interno', sector: 'Comunicação', responsible: 'Vera Nascimento',
      correctiveAction: '', risks: '', learning: '', improvement: ''
    };
    addCrisis(newCrisis);
  };

  const getRiskColor = (l: string) => {
    if (l.includes('Grave') || l.includes('Extrema')) return 'text-red-600';
    if (l.includes('Moderada')) return 'text-orange-600';
    return 'text-gray-700';
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-red-50 p-6 rounded-lg border border-red-100 flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h2 className="text-2xl font-bold text-red-800 mb-2 flex items-center gap-2">
            <ShieldAlert /> Gestão de Riscos
          </h2>
          <p className="text-red-700 text-sm max-w-2xl">Classificação de riscos e preenchimento manual.</p>
        </div>
        <button 
          onClick={() => window.print()} 
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 no-print"
        >
          <Printer size={16} /> Exportar PDF
        </button>
      </div>

      <button 
        onClick={handleAddCrisis}
        className="w-full py-4 border-2 border-dashed border-red-300 rounded-lg text-red-600 hover:bg-red-50 hover:border-red-400 transition-colors font-bold uppercase tracking-wide no-print flex items-center justify-center gap-2"
      >
        <Plus size={20} /> Registrar Novo Risco ou Ocorrência
      </button>

      <div className="grid gap-6">
        {crises.map((item, index) => (
          <div key={item.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 relative print-break-avoid">
            <div className="absolute top-4 right-4 no-print">
              <button onClick={() => deleteCrisis(item.id)} className="flex items-center gap-1 text-gray-400 hover:text-red-600 bg-white border border-gray-200 hover:border-red-200 rounded px-2 py-1 text-xs font-bold">
                <Trash2 size={14} /> Apagar
              </button>
            </div>
            
            <h3 className="font-bold text-gray-800 mb-4 border-b pb-2 flex items-center gap-2">
              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">#{index + 1}</span> Ocorrência de Setor
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 bg-gray-50 p-4 rounded-md border border-gray-100">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Nível de Risco</label>
                <select 
                  value={item.riskLevel} 
                  onChange={e => updateCrisis(item.id, 'riskLevel', e.target.value)} 
                  className={`w-full border rounded p-2 text-sm font-bold ${getRiskColor(item.riskLevel)}`}
                >
                  {RISK_LEVELS.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Origem</label>
                <select value={item.origin} onChange={e => updateCrisis(item.id, 'origin', e.target.value)} className="w-full border border-gray-300 rounded p-2 text-sm">
                  {ORIGIN_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Setor</label>
                <select value={item.sector} onChange={e => updateCrisis(item.id, 'sector', e.target.value)} className="w-full border border-gray-300 rounded p-2 text-sm">
                  {CRISIS_SECTOR_OPTIONS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Responsável</label>
                <select value={item.responsible} onChange={e => updateCrisis(item.id, 'responsible', e.target.value)} className="w-full border border-gray-300 rounded p-2 text-sm">
                  {RESPONSIBLE_OPTIONS.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase text-red-600 flex items-center gap-1">
                <AlertTriangle size={12} /> Plano de Ação Corretiva
              </label>
              <textarea 
                value={item.correctiveAction} 
                onChange={e => updateCrisis(item.id, 'correctiveAction', e.target.value)} 
                className="w-full border border-red-100 bg-white rounded p-3 text-sm focus:ring-red-500 min-h-[80px]" 
                placeholder="Descreva ação tomada..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-3 rounded border border-gray-100">
                <label className="block text-xs font-bold text-gray-600 mb-1">Impactos / Riscos</label>
                <textarea value={item.risks} onChange={e => updateCrisis(item.id, 'risks', e.target.value)} className="w-full bg-white border border-gray-200 rounded p-2 text-xs h-24 resize-none" />
              </div>
              <div className="bg-blue-50 p-3 rounded border border-blue-100">
                <label className="block text-xs font-bold text-blue-800 mb-1">Aprendizados</label>
                <textarea value={item.learning} onChange={e => updateCrisis(item.id, 'learning', e.target.value)} className="w-full bg-white border border-blue-200 rounded p-2 text-xs h-24 resize-none" />
              </div>
              <div className="bg-green-50 p-3 rounded border border-green-100">
                <label className="block text-xs font-bold text-green-800 mb-1">Melhoria Futura</label>
                <textarea value={item.improvement} onChange={e => updateCrisis(item.id, 'improvement', e.target.value)} className="w-full bg-white border border-green-200 rounded p-2 text-xs h-24 resize-none" />
              </div>
            </div>
          </div>
        ))}

        {crises.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500 font-medium">Nenhum risco ou ocorrência registrada.</p>
          </div>
        )}
      </div>
    </div>
  );
};