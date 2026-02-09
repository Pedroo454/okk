
import React, { useState, useEffect } from 'react';
import { Page, NewsItem, EventDate } from '../types';
import { EVENT_DATES as FALLBACK_EVENTS, Icons, NEWS as FALLBACK_NEWS } from '../constants';
import { contentStore } from '../contentStore';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [events, setEvents] = useState<EventDate[]>([]);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [dynamicNews, dynamicEvents] = await Promise.all([
          contentStore.getNews(),
          contentStore.getEvents()
        ]);
        setNews(dynamicNews.length > 0 ? dynamicNews : FALLBACK_NEWS as any);
        setEvents(dynamicEvents.length > 0 ? dynamicEvents : FALLBACK_EVENTS as any);
      } catch (e) {
        setNews(FALLBACK_NEWS as any);
        setEvents(FALLBACK_EVENTS as any);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const closeModal = () => setSelectedNews(null);

  return (
    <div className="animate-in fade-in duration-700 bg-slate-50">
      <section className="bg-blue-800 text-white pt-28 pb-48 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -ml-48 -mb-48"></div>

        <div className="container mx-auto text-center max-w-4xl relative z-10">
          <div className="inline-flex items-center space-x-2 bg-blue-700/50 px-4 py-1.5 rounded-full mb-8 border border-blue-600">
            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-blue-100 italic">Gestão 2026 Conectada</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-none tracking-tight italic uppercase">
            Américo Franco<br />
            <span className="text-yellow-400">Portal Estudantil</span>
          </h1>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
            <button onClick={() => onNavigate('announcements')} className="w-full sm:w-auto bg-yellow-400 text-blue-900 font-black px-12 py-5 rounded-2xl shadow-xl hover:bg-yellow-500 transition-all text-xs uppercase tracking-[0.2em]">Avisos Oficiais</button>
            <button onClick={() => onNavigate('studies')} className="w-full sm:w-auto bg-blue-700 text-white font-bold px-12 py-5 rounded-2xl shadow-lg border border-blue-600 hover:bg-blue-600 transition-all text-xs uppercase tracking-[0.2em]">Estudos & ENEM</button>
          </div>
        </div>
      </section>

      {/* Margem ajustada para não esconder o topo dos cards */}
      <section className="container mx-auto px-4 -mt-20 sm:-mt-24 mb-20 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            { label: 'A ESCOLA', icon: Icons.School, page: 'school' },
            { label: 'VESTIBULARES', icon: Icons.Studies, page: 'studies' },
            { label: 'INTERCLASSES', icon: Icons.Trophy, page: 'interclasses' },
            { label: 'GALERIA', icon: Icons.Photo, page: 'gallery' },
          ].map((card, i) => (
            <button
              key={i}
              onClick={() => onNavigate(card.page as Page)}
              className="bg-white p-6 sm:p-12 rounded-[2.5rem] shadow-xl hover:-translate-y-2 transition-all flex flex-col items-center text-center border border-slate-100 group"
            >
              <div className="p-5 bg-slate-50 text-blue-700 rounded-2xl mb-5 group-hover:bg-yellow-400 group-hover:text-blue-900 transition-all duration-300">
                <card.icon />
              </div>
              <span className="font-black text-[11px] text-slate-800 tracking-widest uppercase italic">{card.label}</span>
            </button>
          ))}
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-12">
          <div className="flex justify-between items-end border-b-4 border-blue-800 pb-4">
            <div>
              <h2 className="text-4xl font-black text-blue-900 uppercase tracking-tighter italic">Destaques</h2>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Feed Oficial de Notícias</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {news.map((item) => (
              <div key={item.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl group border border-slate-100 transition-all duration-500 flex flex-col">
                <div className="h-64 overflow-hidden relative">
                  <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-900/80 backdrop-blur-md text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">{item.date}</span>
                  </div>
                </div>
                <div className="p-8 flex-grow flex flex-col">
                  <h3 className="text-2xl font-black mb-4 leading-tight text-slate-800 group-hover:text-blue-700 transition-colors uppercase italic">{item.title}</h3>
                  <p className="text-slate-500 text-sm mb-8 leading-relaxed line-clamp-2">{item.excerpt}</p>
                  <button onClick={() => setSelectedNews(item)} className="mt-auto w-fit text-[11px] font-black text-blue-800 border-b-2 border-blue-100 hover:border-blue-800 py-1 transition-all uppercase tracking-widest">
                    Abrir Notícia Integral
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-12">
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
            <h2 className="text-2xl font-black text-blue-900 border-b-2 border-yellow-400 pb-5 mb-8 italic uppercase tracking-tighter">Agenda do Mês</h2>
            <div className="space-y-8">
              {events.map((date) => (
                <div key={date.id} className="flex items-center space-x-6 group">
                  <div className="text-center min-w-[60px] bg-slate-50 p-3 rounded-2xl group-hover:bg-blue-50 transition-colors">
                    <span className="block text-xl font-black text-blue-800 leading-none">{date.date.split('/')[0]}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{date.date.split('/')[1]}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-[15px] leading-tight uppercase italic">{date.title}</h4>
                    <span className={`text-[9px] font-black uppercase tracking-widest ${date.type === 'Vestibular' ? 'text-red-500' : 'text-blue-400'}`}>{date.type}</span>
                  </div>
                </div>
              ))}
              {events.length === 0 && <p className="text-slate-400 text-xs font-bold uppercase text-center">Nenhum evento este mês.</p>}
            </div>
          </div>

          <div className="bg-blue-900 text-white p-10 rounded-[3rem] text-center shadow-xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>
             <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-4">Ouvidoria Digital</h3>
             <p className="text-sm text-blue-200 mb-8 leading-relaxed font-medium">Sua sugestão ou denúncia de forma segura para a gestão do Grêmio.</p>
             <button onClick={() => onNavigate('feedback')} className="w-full bg-yellow-400 text-blue-900 font-black py-5 rounded-2xl text-[11px] uppercase tracking-widest hover:bg-white transition-all shadow-lg active:scale-95">Acessar Mural</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
