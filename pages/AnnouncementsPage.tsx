
import React, { useState, useEffect } from 'react';
import { contentStore } from '../contentStore';
import { Announcement } from '../types';

const AnnouncementsPage: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await contentStore.getAnnouncements();
      setAnnouncements(data);
      setIsLoading(false);
    };
    load();
  }, []);

  const closeModal = () => setSelectedAnnouncement(null);

  if (isLoading) return <div className="py-20 text-center font-black text-blue-800 animate-pulse">Carregando Quadro...</div>;

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl animate-in fade-in duration-500">
      <div className="mb-12">
        <h1 className="text-5xl font-black text-blue-900 mb-2 italic uppercase tracking-tighter">Mural do Grêmio</h1>
        <p className="text-slate-500 font-medium italic">Informações e decisões oficiais para os alunos.</p>
      </div>

      <div className="space-y-8">
        {announcements.map((item) => (
          <article 
            key={item.id} 
            className="bg-white rounded-[2.5rem] shadow-md border border-slate-100 overflow-hidden group hover:shadow-2xl transition-all duration-300 cursor-pointer"
            onClick={() => setSelectedAnnouncement(item)}
          >
            <div className={`h-3 w-full ${
              item.category === 'Urgente' ? 'bg-red-500' : 
              item.category === 'Evento' ? 'bg-blue-600' : 'bg-yellow-400'
            }`}></div>
            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-black uppercase px-3 py-1 bg-slate-50 text-slate-500 rounded tracking-widest">{item.category}</span>
                <time className="text-xs font-bold text-slate-300">{item.date}</time>
              </div>
              <h2 className="text-2xl font-black text-slate-800 mb-4 italic uppercase tracking-tighter">{item.title}</h2>
              <p className="text-slate-600 leading-relaxed font-medium mb-6 line-clamp-2">{item.content}</p>
              <div className="pt-6 border-t border-slate-50 flex justify-end">
                <span className="text-blue-700 font-black text-[10px] uppercase tracking-widest">Ver Detalhes</span>
              </div>
            </div>
          </article>
        ))}
        {announcements.length === 0 && <p className="text-center text-slate-300 py-20 font-black uppercase text-xs">Sem avisos no momento.</p>}
      </div>

      {selectedAnnouncement && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-blue-950/90 backdrop-blur-md animate-in fade-in duration-300" onClick={closeModal}>
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden relative" onClick={e=>e.stopPropagation()}>
            <div className="p-12">
              <h2 className="text-3xl font-black text-blue-900 mb-8 italic uppercase tracking-tighter">{selectedAnnouncement.title}</h2>
              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 mb-8">
                <p className="text-slate-700 text-lg leading-relaxed whitespace-pre-line">{selectedAnnouncement.content}</p>
              </div>
              <button onClick={closeModal} className="w-full bg-blue-800 text-white font-black py-4 rounded-xl uppercase tracking-widest text-[10px]">Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementsPage;
