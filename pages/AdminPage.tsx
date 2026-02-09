
import React, { useState, useEffect } from 'react';
import { contentStore } from '../contentStore';
import { feedbackStore } from '../feedbackStore';
import { NewsItem, Album, GameResult, Book, EventDate, Announcement, FeedbackEntry, Vestibular } from '../types';

type AuthType = 'NONE' | 'MEMBER';

const AdminPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [auth, setAuth] = useState<AuthType>('NONE');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'news' | 'announcements' | 'gallery' | 'interclasses' | 'studies' | 'agenda' | 'vestibulares' | 'feedback'>('news');
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [data, setData] = useState<{
    news: NewsItem[], anns: Announcement[], albums: Album[],
    games: GameResult[], books: Book[], events: EventDate[], feedbacks: FeedbackEntry[], vestibulares: Vestibular[]
  }>({ news: [], anns: [], albums: [], games: [], books: [], events: [], feedbacks: [], vestibulares: [] });

  const initialForms = {
    news: { title: '', excerpt: '', content: '', image: '', youtubeUrl: '' },
    ann: { title: '', content: '', category: 'Geral' as any },
    album: { title: '', coverImage: '', imagesStr: '' },
    game: { teamA: '', scoreA: 0, teamB: '', scoreB: 0, sport: 'futsal' as any },
    book: { title: '', author: '', grade: '1ª Série' },
    event: { title: '', date: '', type: 'Evento' as any },
    vestibular: { name: '', date: '' }
  };

  const [forms, setForms] = useState(initialForms);

  const MEMBERS = [
    { user: 'presidente', pass: 'americo2026' },
    { user: 'secretaria', pass: 'gremio2026' },
    { user: 'admin', pass: 'AF2026' }
  ];

  const refresh = async () => {
    setIsLoading(true);
    const [n, an, al, g, b, e, f, v] = await Promise.all([
      contentStore.getNews(), contentStore.getAnnouncements(), contentStore.getAlbums(),
      contentStore.getGames(), contentStore.getBooks(), contentStore.getEvents(), 
      feedbackStore.getAll(), contentStore.getVestibulares()
    ]);
    setData({ news: n, anns: an, albums: al, games: g, books: b, events: e, feedbacks: f, vestibulares: v });
    setIsLoading(false);
  };

  useEffect(() => { if (auth !== 'NONE') refresh(); }, [auth]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = MEMBERS.find(m => m.user === username && m.pass === password);
    if (found) setAuth('MEMBER');
    else alert('Acesso negado.');
  };

  const handleAction = async () => {
    setIsLoading(true);
    try {
      if (editingId) {
        if (activeTab === 'news') await contentStore.updateNews(editingId, forms.news);
        if (activeTab === 'announcements') await contentStore.updateAnnouncement(editingId, forms.ann);
        if (activeTab === 'gallery') await contentStore.updateAlbum(editingId, { ...forms.album, images: forms.album.imagesStr.split(',').map(s=>s.trim()) });
        if (activeTab === 'interclasses') await contentStore.updateGame(editingId, forms.game);
        if (activeTab === 'studies') await contentStore.updateBook(editingId, forms.book);
        if (activeTab === 'agenda') await contentStore.updateEvent(editingId, forms.event);
        if (activeTab === 'vestibulares') await contentStore.updateVestibular(editingId, forms.vestibular);
      } else {
        if (activeTab === 'news') await contentStore.saveNews({ ...forms.news, date: '2026' });
        if (activeTab === 'announcements') await contentStore.saveAnnouncement({ ...forms.ann, date: new Date().toLocaleDateString() });
        if (activeTab === 'gallery') await contentStore.saveAlbum({ title: forms.album.title, coverImage: forms.album.coverImage, images: forms.album.imagesStr.split(',').map(s=>s.trim()), date: '2026' });
        if (activeTab === 'interclasses') await contentStore.saveGame({ ...forms.game, status: 'Finalizado', date: '2026' });
        if (activeTab === 'studies') await contentStore.saveBook(forms.book);
        if (activeTab === 'agenda') await contentStore.saveEvent(forms.event);
        if (activeTab === 'vestibulares') await contentStore.saveVestibular(forms.vestibular);
      }
      setForms(initialForms);
      setEditingId(null);
      refresh();
    } catch (err) {
      alert("Erro ao salvar.");
    }
    setIsLoading(false);
  };

  const startEdit = (type: string, item: any) => {
    setEditingId(item.id);
    if (type === 'news') setForms({...forms, news: { title: item.title, excerpt: item.excerpt, content: item.content, image: item.image, youtubeUrl: item.youtubeUrl || '' }});
    if (type === 'ann') setForms({...forms, ann: { title: item.title, content: item.content, category: item.category }});
    if (type === 'album') setForms({...forms, album: { title: item.title, coverImage: item.coverImage, imagesStr: item.images.join(', ') }});
    if (type === 'game') setForms({...forms, game: { teamA: item.teamA, scoreA: item.scoreA, teamB: item.teamB, scoreB: item.scoreB, sport: item.sport }});
    if (type === 'book') setForms({...forms, book: { title: item.title, author: item.author, grade: item.grade }});
    if (type === 'event') setForms({...forms, event: { title: item.title, date: item.date, type: item.type }});
    if (type === 'vest') setForms({...forms, vestibular: { name: item.name, date: item.date }});
  };

  const handleDelete = async (type: string, id: string) => {
    if (!confirm('Deseja excluir permanentemente?')) return;
    if (type === 'news') await contentStore.deleteNews(id);
    if (type === 'ann') await contentStore.deleteAnnouncement(id);
    if (type === 'album') await contentStore.deleteAlbum(id);
    if (type === 'game') await contentStore.deleteGame(id);
    if (type === 'book') await contentStore.deleteBook(id);
    if (type === 'event') await contentStore.deleteEvent(id);
    if (type === 'vest') await contentStore.deleteVestibular(id);
    refresh();
  };

  if (auth === 'NONE') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-slate-100 p-4">
        <form onSubmit={handleLogin} className="bg-white p-10 rounded-[3rem] shadow-2xl max-w-md w-full text-center">
          <div className="w-16 h-16 bg-blue-800 text-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <h2 className="text-xl font-black text-blue-900 uppercase italic mb-8 tracking-tighter">Login Grêmio Américo</h2>
          <div className="space-y-4">
            <input placeholder="Usuário" className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl font-bold" value={username} onChange={e => setUsername(e.target.value)} />
            <input type="password" placeholder="Senha" className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl font-bold" value={password} onChange={e => setPassword(e.target.value)} />
            <button className="w-full bg-blue-800 text-white font-black py-4 rounded-xl uppercase text-[10px] tracking-[0.2em] shadow-lg hover:bg-blue-700">Entrar</button>
          </div>
          <button type="button" onClick={onBack} className="mt-8 text-slate-400 text-[10px] font-bold uppercase underline">Voltar</button>
        </form>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="flex flex-col lg:flex-row justify-between items-center mb-10 gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        <h1 className="text-2xl font-black text-blue-900 uppercase italic">Gestão Américo Franco</h1>
        <div className="flex bg-slate-50 p-1.5 rounded-2xl overflow-x-auto gap-1">
          {['news', 'announcements', 'gallery', 'interclasses', 'studies', 'agenda', 'vestibulares', 'feedback'].map(t => (
            <button key={t} onClick={() => { setActiveTab(t as any); setEditingId(null); setForms(initialForms); }} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${activeTab === t ? 'bg-blue-800 text-white' : 'text-slate-400'}`}>
              {t === 'news' ? 'Notícias' : t === 'announcements' ? 'Avisos' : t === 'gallery' ? 'Galeria' : t === 'interclasses' ? 'Jogos' : t === 'studies' ? 'Livros' : t === 'agenda' ? 'Agenda' : t === 'vestibulares' ? 'Vestibulares' : 'Mural'}
            </button>
          ))}
          <button onClick={() => setAuth('NONE')} className="px-4 py-2 rounded-xl text-[9px] font-black uppercase bg-red-50 text-red-500">Sair</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 sticky top-24">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-lg font-black text-blue-900 uppercase italic">{editingId ? 'Editando Item' : 'Criar Novo'}</h3>
               {editingId && <button onClick={() => { setEditingId(null); setForms(initialForms); }} className="text-[10px] font-black text-red-500 uppercase">Cancelar</button>}
            </div>
            
            <div className="space-y-4">
              {activeTab === 'news' && (
                <>
                  <input placeholder="Título" className="w-full bg-slate-50 p-4 rounded-xl text-xs font-bold" value={forms.news.title} onChange={e => setForms({...forms, news: {...forms.news, title: e.target.value}})} />
                  <textarea placeholder="Resumo" className="w-full bg-slate-50 p-4 rounded-xl text-xs" value={forms.news.excerpt} onChange={e => setForms({...forms, news: {...forms.news, excerpt: e.target.value}})} />
                  <textarea placeholder="Conteúdo Completo" rows={5} className="w-full bg-slate-50 p-4 rounded-xl text-xs" value={forms.news.content} onChange={e => setForms({...forms, news: {...forms.news, content: e.target.value}})} />
                  <input placeholder="URL da Imagem Capa" className="w-full bg-slate-50 p-4 rounded-xl text-xs" value={forms.news.image} onChange={e => setForms({...forms, news: {...forms.news, image: e.target.value}})} />
                  <input placeholder="Link YouTube (Opcional)" className="w-full bg-slate-50 p-4 rounded-xl text-xs" value={forms.news.youtubeUrl} onChange={e => setForms({...forms, news: {...forms.news, youtubeUrl: e.target.value}})} />
                </>
              )}

              {activeTab === 'announcements' && (
                <>
                  <input placeholder="Título" className="w-full bg-slate-50 p-4 rounded-xl text-xs font-bold" value={forms.ann.title} onChange={e => setForms({...forms, ann: {...forms.ann, title: e.target.value}})} />
                  <textarea placeholder="Aviso" rows={4} className="w-full bg-slate-50 p-4 rounded-xl text-xs" value={forms.ann.content} onChange={e => setForms({...forms, ann: {...forms.ann, content: e.target.value}})} />
                  <select className="w-full bg-slate-50 p-4 rounded-xl text-xs font-bold" value={forms.ann.category} onChange={e => setForms({...forms, ann: {...forms.ann, category: e.target.value as any}})}>
                    <option>Geral</option><option>Urgente</option><option>Evento</option>
                  </select>
                </>
              )}

              {activeTab === 'gallery' && (
                <>
                  <input placeholder="Título Álbum" className="w-full bg-slate-50 p-4 rounded-xl text-xs font-bold" value={forms.album.title} onChange={e => setForms({...forms, album: {...forms.album, title: e.target.value}})} />
                  <input placeholder="URL Capa" className="w-full bg-slate-50 p-4 rounded-xl text-xs" value={forms.album.coverImage} onChange={e => setForms({...forms, album: {...forms.album, coverImage: e.target.value}})} />
                  <textarea placeholder="Fotos (Links separados por vírgula)" rows={4} className="w-full bg-slate-50 p-4 rounded-xl text-xs" value={forms.album.imagesStr} onChange={e => setForms({...forms, album: {...forms.album, imagesStr: e.target.value}})} />
                </>
              )}

              {activeTab === 'interclasses' && (
                <>
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
                </>
              )}

              {activeTab === 'studies' && (
                <>
                  <input placeholder="Título Livro" className="w-full bg-slate-50 p-4 rounded-xl text-xs font-bold" value={forms.book.title} onChange={e => setForms({...forms, book: {...forms.book, title: e.target.value}})} />
                  <input placeholder="Autor" className="w-full bg-slate-50 p-4 rounded-xl text-xs" value={forms.book.author} onChange={e => setForms({...forms, book: {...forms.book, author: e.target.value}})} />
                  <select className="w-full bg-slate-50 p-4 rounded-xl text-xs font-bold" value={forms.book.grade} onChange={e => setForms({...forms, book: {...forms.book, grade: e.target.value}})}>
                    <option>1ª Série</option><option>2ª Série</option><option>3ª Série</option>
                  </select>
                </>
              )}

              {activeTab === 'agenda' && (
                <>
                  <input placeholder="Título" className="w-full bg-slate-50 p-4 rounded-xl text-xs font-bold" value={forms.event.title} onChange={e => setForms({...forms, event: {...forms.event, title: e.target.value}})} />
                  <input placeholder="Data (Ex: 15/05)" className="w-full bg-slate-50 p-4 rounded-xl text-xs font-bold" value={forms.event.date} onChange={e => setForms({...forms, event: {...forms.event, date: e.target.value}})} />
                  <select className="w-full bg-slate-50 p-4 rounded-xl text-xs font-bold" value={forms.event.type} onChange={e => setForms({...forms, event: {...forms.event, type: e.target.value as any}})}>
                    <option value="Evento">Geral</option><option value="Prova">Prova</option><option value="Vestibular">Vestibular</option>
                  </select>
                </>
              )}

              {activeTab === 'vestibulares' && (
                <>
                  <input placeholder="Nome (Ex: FUVEST)" className="w-full bg-slate-50 p-4 rounded-xl text-xs font-bold" value={forms.vestibular.name} onChange={e => setForms({...forms, vestibular: {...forms.vestibular, name: e.target.value}})} />
                  <input placeholder="Mês (Ex: Novembro)" className="w-full bg-slate-50 p-4 rounded-xl text-xs" value={forms.vestibular.date} onChange={e => setForms({...forms, vestibular: {...forms.vestibular, date: e.target.value}})} />
                </>
              )}

              <button onClick={handleAction} className="w-full bg-blue-800 text-white py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-yellow-400 hover:text-blue-900 transition-all">
                {editingId ? 'Salvar Alterações' : 'Publicar Agora'}
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 min-h-[500px]">
            <h3 className="text-lg font-black text-slate-400 uppercase italic mb-6">Lista de Itens</h3>
            {isLoading && <p className="animate-pulse text-blue-800 font-black text-center mb-6">Sincronizando...</p>}
            
            <div className="space-y-3">
              {activeTab === 'news' && data.news.map(n => (
                <div key={n.id} className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-xs font-bold">{n.title}</span>
                  <div className="flex space-x-2">
                    <button onClick={() => startEdit('news', n)} className="text-blue-600 font-black text-[9px] uppercase">Editar</button>
                    <button onClick={() => handleDelete('news', n.id)} className="text-red-500 font-black text-[9px] uppercase">Excluir</button>
                  </div>
                </div>
              ))}
              {activeTab === 'announcements' && data.anns.map(a => (
                <div key={a.id} className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                  <span className="text-xs font-bold">{a.title}</span>
                  <div className="flex space-x-2">
                    <button onClick={() => startEdit('ann', a)} className="text-blue-600 font-black text-[9px] uppercase">Editar</button>
                    <button onClick={() => handleDelete('ann', a.id)} className="text-red-500 font-black text-[9px] uppercase">Excluir</button>
                  </div>
                </div>
              ))}
              {activeTab === 'gallery' && data.albums.map(al => (
                <div key={al.id} className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                  <span className="text-xs font-bold">{al.title}</span>
                  <div className="flex space-x-2">
                    <button onClick={() => startEdit('album', al)} className="text-blue-600 font-black text-[9px] uppercase">Editar</button>
                    <button onClick={() => handleDelete('album', al.id)} className="text-red-500 font-black text-[9px] uppercase">Excluir</button>
                  </div>
                </div>
              ))}
              {activeTab === 'interclasses' && data.games.map(g => (
                <div key={g.id} className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                  <span className="text-xs font-bold">{g.teamA} x {g.teamB} ({g.sport})</span>
                  <div className="flex space-x-2">
                    <button onClick={() => startEdit('game', g)} className="text-blue-600 font-black text-[9px] uppercase">Editar</button>
                    <button onClick={() => handleDelete('game', g.id)} className="text-red-500 font-black text-[9px] uppercase">Excluir</button>
                  </div>
                </div>
              ))}
              {activeTab === 'studies' && data.books.map(b => (
                <div key={b.id} className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                  <span className="text-xs font-bold">{b.title}</span>
                  <div className="flex space-x-2">
                    <button onClick={() => startEdit('book', b)} className="text-blue-600 font-black text-[9px] uppercase">Editar</button>
                    <button onClick={() => handleDelete('book', b.id)} className="text-red-500 font-black text-[9px] uppercase">Excluir</button>
                  </div>
                </div>
              ))}
              {activeTab === 'agenda' && data.events.map(ev => (
                <div key={ev.id} className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                  <span className="text-xs font-bold">{ev.title} ({ev.date})</span>
                  <div className="flex space-x-2">
                    <button onClick={() => startEdit('event', ev)} className="text-blue-600 font-black text-[9px] uppercase">Editar</button>
                    <button onClick={() => handleDelete('event', ev.id)} className="text-red-500 font-black text-[9px] uppercase">Excluir</button>
                  </div>
                </div>
              ))}
              {activeTab === 'vestibulares' && data.vestibulares.map(v => (
                <div key={v.id} className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                  <span className="text-xs font-bold">{v.name} ({v.date})</span>
                  <div className="flex space-x-2">
                    <button onClick={() => startEdit('vest', v)} className="text-blue-600 font-black text-[9px] uppercase">Editar</button>
                    <button onClick={() => handleDelete('vest', v.id)} className="text-red-500 font-black text-[9px] uppercase">Excluir</button>
                  </div>
                </div>
              ))}
              {activeTab === 'feedback' && data.feedbacks.map(f => (
                <div key={f.id} className="bg-slate-50 p-6 rounded-2xl border-l-4 border-blue-800">
                  <p className="text-sm italic mb-4">"{f.message}"</p>
                  <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
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
