
import React, { useState, useEffect } from 'react';
import { contentStore } from '../contentStore';
import { feedbackStore } from '../feedbackStore';
import { NewsItem, Album, GameResult, Book, EventDate, Announcement, FeedbackEntry } from '../types';

type AuthType = 'NONE' | 'MEMBER';

const AdminPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [auth, setAuth] = useState<AuthType>('NONE');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'news' | 'announcements' | 'gallery' | 'interclasses' | 'studies' | 'agenda' | 'feedback'>('news');
  const [isLoading, setIsLoading] = useState(false);
  
  const [data, setData] = useState<{
    news: NewsItem[], anns: Announcement[], albums: Album[],
    games: GameResult[], books: Book[], events: EventDate[], feedbacks: FeedbackEntry[]
  }>({ news: [], anns: [], albums: [], games: [], books: [], events: [], feedbacks: [] });

  // Form States
  const [forms, setForms] = useState({
    news: { title: '', excerpt: '', content: '', image: '' },
    ann: { title: '', content: '', category: 'Geral' as any },
    album: { title: '', coverImage: '', imagesStr: '' },
    game: { teamA: '', scoreA: 0, teamB: '', scoreB: 0, sport: 'futsal' as any },
    book: { title: '', author: '', grade: '1ª Série' },
    event: { title: '', date: '', type: 'Evento' as any }
  });

  const MEMBERS = [
    { user: 'presidente', pass: 'americo2026' },
    { user: 'secretaria', pass: 'gremio2026' },
    { user: 'admin', pass: 'AF2026' }
  ];

  const refresh = async () => {
    setIsLoading(true);
    const [n, an, al, g, b, e, f] = await Promise.all([
      contentStore.getNews(), contentStore.getAnnouncements(), contentStore.getAlbums(),
      contentStore.getGames(), contentStore.getBooks(), contentStore.getEvents(), feedbackStore.getAll()
    ]);
    setData({ news: n, anns: an, albums: al, games: g, books: b, events: e, feedbacks: f });
    setIsLoading(false);
  };

  useEffect(() => { if (auth !== 'NONE') refresh(); }, [auth]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = MEMBERS.find(m => m.user === username && m.pass === password);
    if (found) setAuth('MEMBER');
    else alert('Acesso negado.');
  };

  const handleCreate = async (type: string) => {
    setIsLoading(true);
    if (type === 'news') await contentStore.saveNews({ ...forms.news, date: '2026' });
    if (type === 'ann') await contentStore.saveAnnouncement({ ...forms.ann, date: new Date().toLocaleDateString() });
    if (type === 'album') await contentStore.saveAlbum({ ...forms.album, images: forms.album.imagesStr.split(',').map(s=>s.trim()), date: '2026' });
    if (type === 'game') await contentStore.saveGame({ ...forms.game, status: 'Finalizado', date: '2026' });
    if (type === 'book') await contentStore.saveBook(forms.book);
    if (type === 'event') await contentStore.saveEvent(forms.event);
    
    // Reset forms
    setForms({
      news: { title: '', excerpt: '', content: '', image: '' },
      ann: { title: '', content: '', category: 'Geral' },
      album: { title: '', coverImage: '', imagesStr: '' },
      game: { teamA: '', scoreA: 0, teamB: '', scoreB: 0, sport: 'futsal' },
      book: { title: '', author: '', grade: '1ª Série' },
      event: { title: '', date: '', type: 'Evento' }
    });
    refresh();
  };

  const handleDelete = async (type: string, id: string) => {
    if (!confirm('Deseja excluir permanentemente?')) return;
    if (type === 'news') await contentStore.deleteNews(id);
    if (type === 'ann') await contentStore.deleteAnnouncement(id);
    if (type === 'album') await contentStore.deleteAlbum(id);
    if (type === 'game') await contentStore.deleteGame(id);
    if (type === 'book') await contentStore.deleteBook(id);
    if (type === 'event') await contentStore.deleteEvent(id);
    refresh();
  };

  if (auth === 'NONE') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-slate-100 p-4">
        <form onSubmit={handleLogin} className="bg-white p-10 rounded-[3rem] shadow-2xl max-w-md w-full text-center">
          <div className="w-16 h-16 bg-blue-800 text-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <h2 className="text-xl font-black text-blue-900 uppercase italic mb-8 tracking-tighter">Área do Grêmio Américo</h2>
          <div className="space-y-4">
            <input placeholder="Usuário" className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl font-bold" value={username} onChange={e => setUsername(e.target.value)} />
            <input type="password" placeholder="Senha" className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl font-bold" value={password} onChange={e => setPassword(e.target.value)} />
            <button className="w-full bg-blue-800 text-white font-black py-4 rounded-xl uppercase text-[10px] tracking-[0.2em] shadow-lg">Entrar</button>
          </div>
          <button type="button" onClick={onBack} className="mt-8 text-slate-400 text-[10px] font-bold uppercase underline">Voltar</button>
        </form>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {/* Header Adm */}
      <div className="flex flex-col lg:flex-row justify-between items-center mb-10 gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        <h1 className="text-2xl font-black text-blue-900 uppercase italic leading-none">Gestão Américo Franco 2026</h1>
        <div className="flex bg-slate-50 p-1.5 rounded-2xl overflow-x-auto gap-1">
          {['news', 'announcements', 'gallery', 'interclasses', 'studies', 'agenda', 'feedback'].map(t => (
            <button key={t} onClick={() => setActiveTab(t as any)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${activeTab === t ? 'bg-blue-800 text-white' : 'text-slate-400'}`}>
              {t}
            </button>
          ))}
          <button onClick={() => setAuth('NONE')} className="px-4 py-2 rounded-xl text-[9px] font-black uppercase bg-red-50 text-red-500">Sair</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Formulários dinâmicos baseados na TAB ativa */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
            <h3 className="text-lg font-black text-blue-900 uppercase italic mb-6">Criar Novo Item</h3>
            
            {activeTab === 'news' && (
              <div className="space-y-4">
                <input placeholder="Título" className="w-full bg-slate-50 p-4 rounded-xl text-xs font-bold" value={forms.news.title} onChange={e => setForms({...forms, news: {...forms.news, title: e.target.value}})} />
                <textarea placeholder="Resumo" className="w-full bg-slate-50 p-4 rounded-xl text-xs" value={forms.news.excerpt} onChange={e => setForms({...forms, news: {...forms.news, excerpt: e.target.value}})} />
                <textarea placeholder="Conteúdo" className="w-full bg-slate-50 p-4 rounded-xl text-xs" value={forms.news.content} onChange={e => setForms({...forms, news: {...forms.news, content: e.target.value}})} />
                <input placeholder="URL Imagem" className="w-full bg-slate-50 p-4 rounded-xl text-xs" value={forms.news.image} onChange={e => setForms({...forms, news: {...forms.news, image: e.target.value}})} />
                <button onClick={() => handleCreate('news')} className="w-full bg-blue-800 text-white py-4 rounded-xl font-black uppercase text-[10px]">Publicar Notícia</button>
              </div>
            )}

            {activeTab === 'announcements' && (
              <div className="space-y-4">
                <input placeholder="Título Aviso" className="w-full bg-slate-50 p-4 rounded-xl text-xs font-bold" value={forms.ann.title} onChange={e => setForms({...forms, ann: {...forms.ann, title: e.target.value}})} />
                <textarea placeholder="Texto" className="w-full bg-slate-50 p-4 rounded-xl text-xs" value={forms.ann.content} onChange={e => setForms({...forms, ann: {...forms.ann, content: e.target.value}})} />
                <select className="w-full bg-slate-50 p-4 rounded-xl text-xs font-bold" value={forms.ann.category} onChange={e => setForms({...forms, ann: {...forms.ann, category: e.target.value as any}})}>
                  <option>Geral</option><option>Urgente</option><option>Evento</option>
                </select>
                <button onClick={() => handleCreate('ann')} className="w-full bg-blue-800 text-white py-4 rounded-xl font-black uppercase text-[10px]">Fixar Aviso</button>
              </div>
            )}

            {activeTab === 'gallery' && (
              <div className="space-y-4">
                <input placeholder="Título do Álbum" className="w-full bg-slate-50 p-4 rounded-xl text-xs font-bold" value={forms.album.title} onChange={e => setForms({...forms, album: {...forms.album, title: e.target.value}})} />
                <input placeholder="URL Capa" className="w-full bg-slate-50 p-4 rounded-xl text-xs" value={forms.album.coverImage} onChange={e => setForms({...forms, album: {...forms.album, coverImage: e.target.value}})} />
                <textarea placeholder="URLs das fotos (separadas por vírgula)" className="w-full bg-slate-50 p-4 rounded-xl text-xs" value={forms.album.imagesStr} onChange={e => setForms({...forms, album: {...forms.album, imagesStr: e.target.value}})} />
                <button onClick={() => handleCreate('album')} className="w-full bg-blue-800 text-white py-4 rounded-xl font-black uppercase text-[10px]">Criar Álbum</button>
              </div>
            )}

            {activeTab === 'interclasses' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <input placeholder="Time A" className="bg-slate-50 p-4 rounded-xl text-xs font-bold" value={forms.game.teamA} onChange={e => setForms({...forms, game: {...forms.game, teamA: e.target.value}})} />
                  <input type="number" className="bg-slate-50 p-4 rounded-xl text-xs text-center font-bold" value={forms.game.scoreA} onChange={e => setForms({...forms, game: {...forms.game, scoreA: parseInt(e.target.value) || 0}})} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input placeholder="Time B" className="bg-slate-50 p-4 rounded-xl text-xs font-bold" value={forms.game.teamB} onChange={e => setForms({...forms, game: {...forms.game, teamB: e.target.value}})} />
                  <input type="number" className="bg-slate-50 p-4 rounded-xl text-xs text-center font-bold" value={forms.game.scoreB} onChange={e => setForms({...forms, game: {...forms.game, scoreB: parseInt(e.target.value) || 0}})} />
                </div>
                <select className="w-full bg-slate-50 p-4 rounded-xl text-xs font-bold" value={forms.game.sport} onChange={e => setForms({...forms, game: {...forms.game, sport: e.target.value as any}})}>
                  <option value="futsal">Futsal</option><option value="chess">Xadrez</option><option value="pingpong">Ping Pong</option>
                </select>
                <button onClick={() => handleCreate('game')} className="w-full bg-blue-800 text-white py-4 rounded-xl font-black uppercase text-[10px]">Lançar Placar</button>
              </div>
            )}

            {activeTab === 'studies' && (
              <div className="space-y-4">
                <input placeholder="Título Livro" className="w-full bg-slate-50 p-4 rounded-xl text-xs font-bold" value={forms.book.title} onChange={e => setForms({...forms, book: {...forms.book, title: e.target.value}})} />
                <input placeholder="Autor" className="w-full bg-slate-50 p-4 rounded-xl text-xs" value={forms.book.author} onChange={e => setForms({...forms, book: {...forms.book, author: e.target.value}})} />
                <select className="w-full bg-slate-50 p-4 rounded-xl text-xs font-bold" value={forms.book.grade} onChange={e => setForms({...forms, book: {...forms.book, grade: e.target.value}})}>
                  <option>1ª Série</option><option>2ª Série</option><option>3ª Série</option>
                </select>
                <button onClick={() => handleCreate('book')} className="w-full bg-blue-800 text-white py-4 rounded-xl font-black uppercase text-[10px]">Salvar Recomendação</button>
              </div>
            )}

            {activeTab === 'agenda' && (
              <div className="space-y-4">
                <input placeholder="Título do Evento" className="w-full bg-slate-50 p-4 rounded-xl text-xs font-bold" value={forms.event.title} onChange={e => setForms({...forms, event: {...forms.event, title: e.target.value}})} />
                <input placeholder="Data (Ex: 15/05)" className="w-full bg-slate-50 p-4 rounded-xl text-xs font-bold" value={forms.event.date} onChange={e => setForms({...forms, event: {...forms.event, date: e.target.value}})} />
                <select className="w-full bg-slate-50 p-4 rounded-xl text-xs font-bold" value={forms.event.type} onChange={e => setForms({...forms, event: {...forms.event, type: e.target.value as any}})}>
                  <option value="Evento">Geral</option><option value="Prova">Prova</option><option value="Vestibular">Vestibular</option>
                </select>
                <button onClick={() => handleCreate('event')} className="w-full bg-blue-800 text-white py-4 rounded-xl font-black uppercase text-[10px]">Agendar</button>
              </div>
            )}
          </div>
        </div>

        {/* Listagem para exclusão */}
        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 min-h-[400px]">
            <h3 className="text-lg font-black text-slate-400 uppercase italic mb-6">Itens Publicados</h3>
            {isLoading && <p className="text-center font-black animate-pulse text-blue-900">Sincronizando...</p>}
            
            <div className="space-y-3">
              {activeTab === 'news' && data.news.map(n => (
                <div key={n.id} className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                  <span className="text-xs font-bold">{n.title}</span>
                  <button onClick={() => handleDelete('news', n.id)} className="text-red-500 font-black text-[9px] uppercase">Excluir</button>
                </div>
              ))}
              {activeTab === 'announcements' && data.anns.map(a => (
                <div key={a.id} className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                  <span className="text-xs font-bold">{a.title}</span>
                  <button onClick={() => handleDelete('ann', a.id)} className="text-red-500 font-black text-[9px] uppercase">Excluir</button>
                </div>
              ))}
              {activeTab === 'interclasses' && data.games.map(g => (
                <div key={g.id} className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                  <span className="text-xs font-bold">{g.teamA} x {g.teamB}</span>
                  <button onClick={() => handleDelete('game', g.id)} className="text-red-500 font-black text-[9px] uppercase">Excluir</button>
                </div>
              ))}
              {activeTab === 'studies' && data.books.map(b => (
                <div key={b.id} className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                  <span className="text-xs font-bold">{b.title}</span>
                  <button onClick={() => handleDelete('book', b.id)} className="text-red-500 font-black text-[9px] uppercase">Excluir</button>
                </div>
              ))}
              {activeTab === 'agenda' && data.events.map(ev => (
                <div key={ev.id} className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                  <span className="text-xs font-bold">{ev.title} ({ev.date})</span>
                  <button onClick={() => handleDelete('event', ev.id)} className="text-red-500 font-black text-[9px] uppercase">Excluir</button>
                </div>
              ))}
              {activeTab === 'feedback' && data.feedbacks.map(f => (
                <div key={f.id} className="bg-slate-50 p-6 rounded-2xl relative border-l-4 border-blue-800">
                  <p className="text-sm italic mb-4">"{f.message}"</p>
                  <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400">
                    <span>{f.name} - {f.category}</span>
                    <button onClick={() => feedbackStore.remove(f.id).then(refresh)} className="text-red-400">Remover</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
