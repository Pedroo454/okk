
import React from 'react';
import { SCHOOL_NAME, Icons } from '../constants';

const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="mb-16 text-center">
        <h1 className="text-5xl font-black text-blue-900 mb-4 italic uppercase tracking-tighter">Gestão 2026</h1>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] leading-relaxed">Portal Oficial • EE Américo Franco • Grêmio Estudantil</p>
      </div>

      <div className="space-y-16">
        <section className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          <h2 className="text-2xl font-black text-blue-900 mb-8 italic uppercase tracking-tighter border-b-2 border-yellow-400 w-fit pb-2">Nossa Escola</h2>
          <p className="text-slate-600 leading-relaxed mb-6 text-lg">
            A <strong>{SCHOOL_NAME}</strong> é referência em educação pública em Poá. Nossa missão em 2026 é integrar a tecnologia ao cotidiano escolar através do protagonismo estudantil.
          </p>
          <p className="text-slate-600 leading-relaxed text-lg italic">
            "Educar para transformar, liderar para inovar."
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-2xl font-black text-blue-900 mb-6 italic uppercase tracking-tighter">Siga o Grêmio</h2>
            <p className="text-slate-600 leading-relaxed mb-8">
              Acompanhe as fotos dos eventos, bastidores das reuniões e novidades instantâneas no nosso Instagram oficial.
            </p>
            <div className="flex items-center space-x-3 text-blue-900 font-black uppercase tracking-widest text-xs">
               <a href="https://instagram.com/americo_franco" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-4 bg-white p-6 rounded-3xl shadow-lg border border-slate-100 hover:scale-105 transition-all">
                  <div className="bg-gradient-to-tr from-yellow-400 to-pink-500 p-3 rounded-2xl text-white">
                    <Icons.Instagram />
                  </div>
                  <span>@americo_franco</span>
               </a>
            </div>
          </div>
          <div className="rounded-[3rem] overflow-hidden shadow-2xl rotate-2 order-1 md:order-2">
            <img src="https://images.unsplash.com/photo-1523050853063-bd8012fec21b?q=80&w=800&auto=format&fit=crop" alt="Educação 2026" className="w-full h-auto" />
          </div>
        </section>

        <footer className="bg-blue-900 text-white p-12 rounded-[3rem] text-center shadow-2xl relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
              <span className="block font-black text-yellow-400 uppercase text-[9px] tracking-widest mb-4">Secretaria 2026</span>
              <p className="text-sm font-medium">Rua Dobrada, 65<br/>Poá - SP</p>
            </div>
            <div className="p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
              <span className="block font-black text-yellow-400 uppercase text-[9px] tracking-widest mb-4">Contatos Digitais</span>
              <p className="text-sm font-medium">e907030a@educacao.sp.gov.br<br/>(11) 4636-6322</p>
            </div>
            <div className="p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
              <span className="block font-black text-yellow-400 uppercase text-[9px] tracking-widest mb-4">Gestão Grêmio</span>
              <p className="text-sm font-medium">Presidente: João Silva<br/>Gestão 2026/2027</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AboutPage;
