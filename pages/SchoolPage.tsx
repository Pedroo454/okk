
import React from 'react';

const SchoolPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-blue-900 mb-4">A Nossa Escola</h1>
        <p className="text-slate-600 text-lg">Histórico, estrutura e organização do calendário oficial da EE Américo Franco.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div className="animate-fade-in">
          <h2 className="text-2xl font-bold text-blue-800 mb-6 flex items-center">
            <span className="w-8 h-1 bg-yellow-400 mr-3"></span>
            Calendário Letivo 2024
          </h2>
          <div className="space-y-6">
            {[
              { month: 'Fevereiro', events: ['Início das Aulas', 'Planejamento Escolar', 'Acolhimento aos Alunos'] },
              { month: 'Março', events: ['Reunião de Pais (1º Bimestre)', 'Avaliações Diagnósticas', 'Conselho de Classe'] },
              { month: 'Abril', events: ['Semana Cultural', 'Simulados de Matemática', 'Feriado Tiradentes'] },
              { month: 'Maio', events: ['Dia do Trabalho', 'Provas de Meio de Semestre', 'Gincana da Família'] },
            ].map((m, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <h3 className="font-bold text-blue-900 text-lg mb-3 border-l-4 border-blue-600 pl-3">{m.month}</h3>
                <ul className="space-y-2">
                  {m.events.map((e, j) => (
                    <li key={j} className="flex items-start text-slate-600 text-sm">
                      <span className="text-yellow-500 mr-2 font-black">•</span>
                      <span>{e}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-blue-800 mb-6 flex items-center">
            <span className="w-8 h-1 bg-yellow-400 mr-3"></span>
            Projetos e Destaques
          </h2>
          <div className="bg-blue-50 p-8 rounded-2xl border border-blue-100">
            <h3 className="text-xl font-bold text-blue-900 mb-3 italic">Protagonismo Juvenil</h3>
            <p className="text-slate-600 mb-4 text-sm leading-relaxed">
              Incentivamos nossos alunos a serem os líderes do amanhã. Através do Grêmio e de clubes de estudo, a Américo Franco proporciona um ambiente de troca e crescimento.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">LIDERANÇA</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">CULTURA</span>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-3 italic">Infraestrutura</h3>
            <p className="text-slate-600 mb-4 text-sm leading-relaxed">
              Nossa unidade conta com quadra coberta, biblioteca atualizada, laboratório de informática e espaços de convivência pensados para o bem-estar da comunidade.
            </p>
            <button className="text-blue-600 text-xs font-bold hover:underline uppercase tracking-widest">Conhecer Espaço &rarr;</button>
          </div>

          <div className="p-6 bg-yellow-400 rounded-2xl shadow-lg transform -rotate-1">
            <h4 className="font-black text-blue-900 text-center uppercase tracking-tighter">Matrículas e Transferências</h4>
            <p className="text-blue-900/80 text-xs text-center mt-2">Dúvidas sobre documentação devem ser tiradas diretamente na secretaria escolar nos horários de atendimento.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolPage;
