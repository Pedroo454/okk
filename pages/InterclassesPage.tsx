
import React, { useState, useEffect } from 'react';
import { GameResult } from '../types';
import { contentStore } from '../contentStore';

const InterclassesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'futsal' | 'pingpong' | 'chess'>('futsal');
  const [games, setGames] = useState<GameResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await contentStore.getGames();
      setGames(data);
      setIsLoading(false);
    };
    load();
  }, []);

  const filteredGames = games.filter(g => g.sport === activeTab);

  const getStatusBadge = (status: GameResult['status']) => {
    switch (status) {
      case 'Em Andamento':
        return <span className="bg-red-600 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest animate-pulse flex items-center"><span className="w-1.5 h-1.5 bg-white rounded-full mr-2"></span>Ao Vivo</span>;
      case 'Encerrado':
        return <span className="bg-slate-200 text-slate-500 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">Encerrado</span>;
      case 'Em Breve':
        return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">Em Breve</span>;
      default:
        return null;
    }
  };

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
            <div key={game.id} className={`bg-white p-8 rounded-[2rem] shadow-sm border ${game.status === 'Em Andamento' ? 'border-red-400 shadow-lg' : 'border-slate-100'} flex flex-col hover:border-blue-200 transition-all`}>
              <div className="flex justify-between items-center mb-6">
                 <div className="flex items-center space-x-3">
                   {getStatusBadge(game.status)}
                   {game.status === 'Em Breve' && (
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       {game.date} às {game.time}
                     </span>
                   )}
                 </div>
                 <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{game.sport}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1 text-center">
                   <div className="font-black text-2xl text-blue-900 uppercase italic truncate">{game.teamA}</div>
                </div>
                
                <div className="mx-8 flex flex-col items-center">
                  <div className="flex items-center space-x-6">
                    <span className={`text-4xl font-black ${game.status === 'Em Breve' ? 'text-slate-200' : 'text-blue-900'}`}>{game.scoreA}</span>
                    <span className="text-slate-300 font-black text-xs italic">X</span>
                    <span className={`text-4xl font-black ${game.status === 'Em Breve' ? 'text-slate-200' : 'text-blue-900'}`}>{game.scoreB}</span>
                  </div>
                </div>

                <div className="flex-1 text-center">
                   <div className="font-black text-2xl text-blue-900 uppercase italic truncate">{game.teamB}</div>
                </div>
              </div>
              
              {game.status === 'Encerrado' && (
                <div className="mt-6 pt-4 border-t border-slate-50 text-center">
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Partida Realizada em {game.date}</span>
                </div>
              )}
            </div>
          ))}
          {filteredGames.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
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
