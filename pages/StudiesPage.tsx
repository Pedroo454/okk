
import React, { useState, useEffect } from 'react';
import { contentStore } from '../contentStore';
import { Book } from '../types';

const StudiesPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await contentStore.getBooks();
      setBooks(data);
      setIsLoading(false);
    };
    load();
  }, []);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-20">
        <h1 className="text-5xl font-black text-blue-900 mb-4 italic uppercase tracking-tighter">Portal de Estudos</h1>
        <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.4em]">Foco • Preparação • Vestibular</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-12">
          <section>
            <div className="flex items-center justify-between border-b-4 border-blue-900 pb-4 mb-8">
               <h2 className="text-3xl font-black text-blue-900 italic uppercase">Livros Recomendados</h2>
               <span className="text-xs font-black text-yellow-600 uppercase tracking-widest">{books.length} Obras</span>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {books.map((book) => (
                <div key={book.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between hover:shadow-xl transition-all group">
                   <div>
                      <h3 className="text-xl font-black text-slate-800 italic uppercase group-hover:text-blue-700 transition-colors">{book.title}</h3>
                      <p className="text-slate-400 font-bold text-sm">{book.author}</p>
                   </div>
                   <span className="mt-4 sm:mt-0 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest w-fit">
                      {book.grade}
                   </span>
                </div>
              ))}
              {books.length === 0 && !isLoading && <p className="text-center py-10 text-slate-300 font-black uppercase text-xs italic">Nenhuma obra cadastrada.</p>}
            </div>
          </section>

          <section>
             <h2 className="text-3xl font-black text-blue-900 italic uppercase mb-8 border-b-4 border-yellow-400 w-fit pb-2">Dicas da Gestão</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-900 text-white p-8 rounded-[2.5rem] shadow-xl">
                   <h4 className="font-black text-yellow-400 uppercase italic mb-4">Método Pomodoro</h4>
                   <p className="text-blue-100 text-sm leading-relaxed">25 min de foco total, 5 min de descanso. Repita 4 vezes. Essencial para simulados.</p>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200">
                   <h4 className="font-black text-blue-900 uppercase italic mb-4">Mapas Mentais</h4>
                   <p className="text-slate-600 text-sm leading-relaxed">Conecte conceitos visualmente para matérias como História e Biologia.</p>
                </div>
             </div>
          </section>
        </div>

        <div className="space-y-10">
          <div className="bg-blue-800 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12"></div>
             <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-8 text-yellow-400 border-b border-white/10 pb-4">Vestibulares 2026</h3>
             <div className="space-y-6">
                {[
                  { name: 'ENEM', date: 'Novembro', color: 'bg-white/10' },
                  { name: 'FUVEST', date: 'Novembro', color: 'bg-white/10' },
                  { name: 'UNESP', date: 'Dezembro', color: 'bg-white/10' },
                ].map((v, i) => (
                  <div key={i} className={`${v.color} p-5 rounded-2xl flex justify-between items-center group hover:bg-yellow-400 hover:text-blue-900 transition-all cursor-pointer`}>
                    <span className="font-black uppercase italic">{v.name}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest">{v.date}</span>
                  </div>
                ))}
             </div>
          </div>
          
          <div className="p-8 bg-yellow-400 rounded-[2.5rem] text-blue-900 text-center shadow-lg">
             <h4 className="font-black text-lg uppercase italic tracking-tighter">Material Grátis</h4>
             <p className="text-[10px] font-bold uppercase leading-relaxed mt-2">Acesse as apostilas na biblioteca da escola portando sua carteirinha.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudiesPage;
