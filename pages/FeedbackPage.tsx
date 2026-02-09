
import React, { useState, useEffect } from 'react';
import { Icons } from '../constants';
import { feedbackStore } from '../feedbackStore';
import { FeedbackEntry } from '../types';

interface FeedbackPageProps {
  onBack: () => void;
}

const FeedbackPage: React.FC<FeedbackPageProps> = ({ onBack }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState(false);
  const [savedFeedbacks, setSavedFeedbacks] = useState<FeedbackEntry[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    category: 'Sugestão',
    message: '',
    anonymous: false
  });

  const ADMIN_PASSWORD = 'GREMIO_AMERICO';
  const isCloudActive = feedbackStore.isConfigured();

  const loadFeedbacks = async () => {
    setIsLoading(true);
    try {
      const data = await feedbackStore.getAll();
      setSavedFeedbacks(data);
    } catch (e) {
      console.error("Erro ao carregar:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (showAdmin) loadFeedbacks();
  }, [showAdmin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await feedbackStore.save({
        name: formData.anonymous ? 'Anônimo' : formData.name,
        grade: formData.anonymous ? '-' : formData.grade,
        category: formData.category,
        message: formData.message,
        anonymous: formData.anonymous
      });
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      alert("Erro de conexão. Verifique sua internet.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.toUpperCase() === ADMIN_PASSWORD) {
      setShowAdmin(true);
      setIsAuthenticating(false);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
    setPassword('');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Remover feedback? (Se a nuvem estiver ativa, será removido de todos os aparelhos)')) {
      await feedbackStore.remove(id);
      loadFeedbacks();
    }
  };

  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-2xl text-center animate-in zoom-in duration-500">
        <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-blue-50">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce ${isCloudActive ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-blue-900 mb-4 italic">
            {isCloudActive ? 'Enviado para a Nuvem!' : 'Salvo Localmente!'}
          </h2>
          <p className="text-slate-600 text-lg mb-10 leading-relaxed">
            {isCloudActive 
              ? 'Sua sugestão foi salva com sucesso e já pode ser vista pelo Grêmio no PC.' 
              : '⚠️ ATENÇÃO: O Firebase não está configurado. A mensagem foi salva apenas NESTE celular. Para sincronizar com o PC, você precisa colocar suas chaves do Firebase no código.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
            <button onClick={onBack} className="bg-blue-800 text-white font-black px-10 py-4 rounded-2xl hover:bg-blue-700 transition-all uppercase tracking-widest text-xs">
              Voltar ao Início
            </button>
            <button onClick={() => setIsSubmitted(false)} className="bg-slate-100 text-slate-600 font-bold px-10 py-4 rounded-2xl hover:bg-slate-200 transition-all uppercase tracking-widest text-xs">
              Nova Sugestão
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl animate-in fade-in duration-500">
      
      {/* Banner de Erro Crítico de Configuração */}
      {!isCloudActive && (
        <div className="bg-red-600 text-white p-6 rounded-3xl mb-12 shadow-xl border-4 border-red-800 animate-pulse">
           <div className="flex items-center space-x-4">
              <span className="text-4xl">⚠️</span>
              <div>
                 <h3 className="font-black text-xl uppercase italic">Sincronização Desativada!</h3>
                 <p className="text-sm font-bold opacity-90">Você ainda não colocou as chaves do Firebase no arquivo <code className="bg-red-800 px-2 py-0.5 rounded">feedbackStore.ts</code>. Por isso, as mensagens do celular não aparecem no PC.</p>
              </div>
           </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <button onClick={onBack} className="flex items-center space-x-2 text-blue-700 font-bold hover:translate-x-1 transition-transform group">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="uppercase text-xs tracking-widest">Início</span>
        </button>

        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${isCloudActive ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
             <div className={`w-2 h-2 rounded-full ${isCloudActive ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
             <span>{isCloudActive ? 'Nuvem Ativa' : 'Modo Offline'}</span>
          </div>
          
          {showAdmin ? (
            <div className="flex space-x-2">
              <button onClick={() => feedbackStore.exportJSON()} className="bg-white border-2 border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-colors">
                Exportar Backup
              </button>
              <button onClick={() => setShowAdmin(false)} className="bg-blue-900 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm">
                Sair
              </button>
            </div>
          ) : (
            <button onClick={() => setIsAuthenticating(true)} className="text-[10px] font-black text-slate-400 hover:text-blue-900 transition-colors uppercase tracking-widest">
              Painel do Grêmio (Adm)
            </button>
          )}
        </div>
      </div>

      {isAuthenticating && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-blue-900/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 relative">
            <button onClick={() => setIsAuthenticating(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h3 className="text-xl font-black text-blue-900 uppercase italic text-center mb-6">Acesso ao Mural</h3>
            <form onSubmit={handleAdminAccess} className="space-y-4">
              <input 
                type="password" 
                placeholder="Senha Administrativa"
                className={`w-full bg-slate-50 border-2 rounded-2xl px-5 py-4 outline-none text-center font-black ${authError ? 'border-red-400' : 'border-slate-100 focus:border-blue-400'}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="w-full bg-blue-800 text-white font-black py-4 rounded-2xl uppercase tracking-widest text-xs">Visualizar Mural</button>
            </form>
          </div>
        </div>
      )}

      {showAdmin ? (
        <div className="animate-in slide-in-from-bottom-8 duration-500">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-black text-blue-900 mb-2 italic tracking-tighter uppercase">Mural Consolidado</h2>
            {isLoading ? (
              <div className="text-blue-600 font-bold animate-pulse text-xs uppercase tracking-widest">Sincronizando com a Nuvem...</div>
            ) : (
              <p className="text-slate-500 text-xs font-bold uppercase">Buscando mensagens em tempo real.</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedFeedbacks.length > 0 ? (
              savedFeedbacks.map((fb) => (
                <div key={fb.id} className="bg-white p-6 rounded-[2rem] shadow-md border border-slate-100 flex flex-col hover:shadow-xl transition-shadow relative overflow-hidden group">
                  <button onClick={() => handleDelete(fb.id)} className="absolute top-4 right-4 bg-red-50 text-red-600 p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                  <div className="mb-4">
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-blue-800 text-yellow-400 rounded-md">{fb.category}</span>
                    <span className="ml-2 text-[9px] font-bold text-slate-400">{fb.timestamp}</span>
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed mb-6 italic flex-grow bg-slate-50 p-4 rounded-xl">"{fb.message}"</p>
                  <div className="pt-4 border-t border-slate-50">
                    <p className="text-xs font-black text-blue-900 uppercase">{fb.anonymous ? '👤 Autor Oculto' : fb.name}</p>
                    {!fb.anonymous && <p className="text-[10px] text-slate-400 font-bold uppercase">{fb.grade}</p>}
                  </div>
                </div>
              ))
            ) : (
              !isLoading && (
                <div className="col-span-full py-20 text-center text-slate-300">
                  <h3 className="font-bold uppercase tracking-widest">Mural vazio ou sem conexão</h3>
                </div>
              )
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-extrabold text-blue-900 mb-6 leading-none">Ouvidoria Digital<br/><span className="text-blue-500 italic">Américo Franco</span></h1>
            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              Esta é uma linha direta com o Grêmio Estudantil. Sua opinião ajuda a melhorar nossa escola todos os dias.
            </p>
            <div className={`p-8 rounded-3xl shadow-xl relative overflow-hidden ${isCloudActive ? 'bg-blue-900 text-white' : 'bg-slate-200 text-slate-600'}`}>
              <div className="relative z-10">
                <h4 className="font-black text-yellow-400 text-xs uppercase mb-2 tracking-widest">
                   {isCloudActive ? 'Sincronização Ativa' : 'Aguardando Configuração'}
                </h4>
                <p className="text-[11px] font-medium leading-relaxed">
                   {isCloudActive 
                     ? 'Sua voz será enviada para o banco de dados global instantaneamente.' 
                     : 'O desenvolvedor precisa configurar as chaves do Firebase para que sua mensagem chegue ao PC do Grêmio.'}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 space-y-6">
              <div className="flex items-center justify-between mb-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                 <span className="text-xs font-black text-blue-900 uppercase">Identidade</span>
                 <label className="flex items-center cursor-pointer group">
                    <input type="checkbox" className="sr-only" checked={formData.anonymous} onChange={(e) => setFormData({...formData, anonymous: e.target.checked})} />
                    <div className={`w-14 h-7 rounded-full shadow-inner transition-colors ${formData.anonymous ? 'bg-blue-800' : 'bg-slate-200'}`}></div>
                    <span className={`ml-3 text-[10px] font-black uppercase tracking-widest ${formData.anonymous ? 'text-blue-800' : 'text-slate-400'}`}>
                      {formData.anonymous ? 'Anônimo' : 'Identificado'}
                    </span>
                 </label>
              </div>

              {!formData.anonymous && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="text" required={!formData.anonymous} className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 transition-all font-bold" placeholder="Seu Nome" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  <input type="text" required={!formData.anonymous} className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 transition-all font-bold" placeholder="Série" value={formData.grade} onChange={(e) => setFormData({...formData, grade: e.target.value})} />
                </div>
              )}

              <select className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 outline-none font-bold text-xs uppercase" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                <option>Sugestão</option>
                <option>Infraestrutura</option>
                <option>Elogio</option>
                <option>Denúncia</option>
              </select>

              <textarea required rows={5} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 resize-none font-medium" placeholder="Sua mensagem..." value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}></textarea>

              <button 
                type="submit" 
                disabled={isLoading}
                className={`w-full text-white font-black py-5 rounded-2xl transition-all uppercase tracking-widest text-xs shadow-xl flex items-center justify-center space-x-3 disabled:opacity-50 ${isCloudActive ? 'bg-blue-800 hover:bg-blue-700' : 'bg-slate-500 cursor-not-allowed'}`}
              >
                {isLoading ? <span>Processando...</span> : <span>Enviar Mensagem</span>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackPage;
