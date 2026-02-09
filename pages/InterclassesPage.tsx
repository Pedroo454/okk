
import React, { useState, useEffect } from 'react';
import { GameResult } from '../types';
import { contentStore } from '../contentStore';
import { FUTSAL_RESULTS } from '../constants';

const InterclassesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'futsal' | 'pingpong' | 'chess'>('futsal');
  const [games, setGames] = useState<GameResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await contentStore.getGames();
      setGames(data.length > 0 ? data : FUTSAL_RESULTS as any);
      setIsLoading(false);
    };
    load();
  }, []);

  const filteredGames = games.filter(g => g.sport === activeTab);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-blue-900 mb-4 italic uppercase tracking-tighter">Interclasses 2026</h1>
        <p className="text-slate-500 max-w-xl mx-auto uppercase text-[10px] tracking-widest font-black text-yellow-600">Esporte • Competição • Grêmio Américo Franco</p>
      </div>

      <div className="flex flex-wrap justify-center mb-12 gap-2">
        {['futsal', 'pingpong', 'chess'].map((t) => (
          <button key={t} onClick={() => setActiveTab(t as any)} className={`px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === t ? 'bg-blue-800 text-yellow-400 shadow-xl scale-105' : 'bg-white text-slate-400 border border-slate-100'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        <div className="space-y-6">
          {filteredGames.map((game, i) => (
            <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between hover:border-blue-200 transition-all">
              <div className="flex-1 text-right font-black text-xl text-blue-900 uppercase italic">{game.teamA}</div>
              <div className="mx-8 flex items-center space-x-4">
                <span className="text-3xl font-black text-blue-900">{game.scoreA}</span>
                <span className="text-slate-300 font-black text-xs">VS</span>
                <span className="text-3xl font-black text-blue-900">{game.scoreB}</span>
              </div>
              <div className="flex-1 text-left font-black text-xl text-blue-900 uppercase italic">{game.teamB}</div>
            </div>
          ))}
          {filteredGames.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100">
               <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Nenhum placar registrado para esta categoria.</p>
            </div>
          )}
        </div>

        <div className="bg-blue-900 text-white p-10 rounded-[3rem] shadow-2xl h-fit lg:sticky lg:top-24">
           <h2 className="text-2xl font-black mb-8 text-yellow-400 border-b border-white/10 pb-4 italic uppercase tracking-tighter">Regulamento 2026</h2>
           <ul className="space-y-5 text-blue-100 text-sm font-medium">
              <li className="flex items-start"><span className="text-yellow-400 font-black mr-3">01.</span> Respeito total aos adversários e arbitragem.</li>
              <li className="flex items-start"><span className="text-yellow-400 font-black mr-3">02.</span> Uniforme completo obrigatório em quadra.</li>
              <li className="flex items-start"><span className="text-yellow-400 font-black mr-3">03.</span> Atraso de 10 minutos resulta em W.O.</li>
           </ul>
        </div>
      </div>
    </div>
  );
};

export default InterclassesPage;
