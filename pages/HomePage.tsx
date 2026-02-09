
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

  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

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
            <h2 className="text-4xl font-black text-blue-900 uppercase tracking-tighter italic">Destaques</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {news.map((item) => (
              <div key={item.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl group border border-slate-100 transition-all duration-500 flex flex-col">
                <div className="h-64 overflow-hidden relative">
                  <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-blue-900/80 backdrop-blur-md text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">{item.date}</span>
                    {item.youtubeUrl && <span className="bg-red-600 text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase">Vídeo</span>}
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
                  <div className="text-center min-w-[60px] bg-slate-50 p-3 rounded-2xl">
                    <span className="block text-xl font-black text-blue-800 leading-none">{date.date.split('/')[0]}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{date.date.split('/')[1]}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-[15px] leading-tight uppercase italic">{date.title}</h4>
                    <span className={`text-[9px] font-black uppercase tracking-widest ${date.type === 'Vestibular' ? 'text-red-500' : 'text-blue-400'}`}>{date.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-blue-900 text-white p-10 rounded-[3rem] text-center shadow-xl relative overflow-hidden group">
             <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-4">Ouvidoria Digital</h3>
             <button onClick={() => onNavigate('feedback')} className="w-full bg-yellow-400 text-blue-900 font-black py-5 rounded-2xl text-[11px] uppercase tracking-widest hover:bg-white transition-all shadow-lg active:scale-95">Acessar Mural</button>
          </div>
        </div>
      </div>

      {/* MODAL DE NOTÍCIA - CORRIGIDO */}
      {selectedNews && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-blue-950/95 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-[3.5rem] shadow-2xl overflow-y-auto relative p-8 sm:p-12">
            <button onClick={() => setSelectedNews(null)} className="absolute top-8 right-8 z-50 bg-slate-100 p-4 rounded-full text-slate-800 hover:bg-slate-200 transition-all">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <img src={selectedNews.image} className="w-full h-80 object-cover rounded-[2.5rem] shadow-lg" />
                {selectedNews.youtubeUrl && (
                  <div className="aspect-video rounded-[2rem] overflow-hidden bg-black shadow-lg">
                    <iframe 
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${getYouTubeId(selectedNews.youtubeUrl)}`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
              </div>
              
              <div className="space-y-8">
                <div>
                  <span className="bg-blue-800 text-yellow-400 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">{selectedNews.date}</span>
                  <h2 className="text-4xl sm:text-5xl font-black text-blue-900 mt-6 leading-tight italic uppercase tracking-tighter">{selectedNews.title}</h2>
                </div>
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-600 text-xl leading-relaxed italic font-black border-l-8 border-yellow-400 pl-8 mb-8">{selectedNews.excerpt}</p>
                  <div className="text-slate-800 text-lg leading-relaxed whitespace-pre-line font-medium">{selectedNews.content}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
