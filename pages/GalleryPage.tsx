
import React, { useState, useEffect } from 'react';
import { Album } from '../types';
import { contentStore } from '../contentStore';

const GalleryPage: React.FC = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await contentStore.getAlbums();
      setAlbums(data);
      setIsLoading(false);
    };
    load();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-800 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Carregando Memórias...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 animate-in fade-in duration-700">
      <div className="mb-16 max-w-2xl">
        <h1 className="text-5xl font-black text-blue-900 mb-6 italic tracking-tighter uppercase">Galeria Américo</h1>
        <p className="text-slate-600 text-lg leading-relaxed">Momentos especiais, conquistas esportivas e eventos culturais registrados por nossa comunidade.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {albums.map((album) => (
          <div key={album.id} className="group cursor-pointer" onClick={() => setSelectedAlbum(album)}>
            <div className="relative overflow-hidden rounded-[2.5rem] shadow-xl aspect-[4/5] bg-white p-3 border border-slate-100">
              <div className="w-full h-full rounded-[1.8rem] overflow-hidden relative">
                <img 
                  src={album.coverImage} 
                  alt={album.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900 via-transparent to-transparent opacity-60"></div>
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <h3 className="text-2xl font-black mb-2 leading-none italic uppercase">{album.title}</h3>
                  <div className="flex items-center space-x-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-yellow-400 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full">{album.images.length} Fotos</span>
                    <span className="text-[9px] font-bold text-blue-100 uppercase tracking-widest">{album.date}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedAlbum && (
        <div className="fixed inset-0 z-[100] bg-blue-950/95 backdrop-blur-xl animate-in fade-in duration-300 p-4 sm:p-12 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl font-black text-white italic uppercase">{selectedAlbum.title}</h2>
                <p className="text-blue-300 text-[10px] font-black uppercase tracking-widest">{selectedAlbum.images.length} Registros Fotográficos</p>
              </div>
              <button onClick={() => setSelectedAlbum(null)} className="bg-white/10 hover:bg-white text-white hover:text-blue-900 p-4 rounded-full transition-all">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
              {selectedAlbum.images.map((img, idx) => (
                <div key={idx} className="break-inside-avoid rounded-3xl overflow-hidden shadow-2xl border-4 border-white/5 hover:border-white/20 transition-all cursor-zoom-in">
                  <img src={img} className="w-full h-auto object-cover" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {albums.length === 0 && (
        <div className="py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
           <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"></path></svg>
           </div>
           <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Aguardando as Primeiras Fotos de 2024</p>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
