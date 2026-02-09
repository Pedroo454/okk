
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  orderBy 
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { NewsItem, Album, GameResult, Book, EventDate, Announcement } from './types';

const firebaseConfig = {
  apiKey: "AIzaSyBxrqQN_V7pK5Se6UA_Puj0PRu_5gYswtc",
  authDomain: "amero-18031.firebaseapp.com",
  projectId: "amero-18031",
  storageBucket: "amero-18031.firebasestorage.app",
  messagingSenderId: "498834482489",
  appId: "1:498834482489:web:63a37c2c698f466ce974e8",
  measurementId: "G-C4GCFZG880"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const contentStore = {
  fetchCollection: async <T>(name: string, sortField: string = 'date', direction: 'asc' | 'desc' = 'desc'): Promise<T[]> => {
    try {
      const q = query(collection(db, name), orderBy(sortField, direction));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as any));
    } catch (e) {
      console.error(`Erro ao buscar ${name}:`, e);
      return [];
    }
  },

  // Notícias
  getNews: () => contentStore.fetchCollection<NewsItem>('news'),
  saveNews: (news: Omit<NewsItem, 'id'>) => addDoc(collection(db, 'news'), { ...news, serverTimestamp: new Date() }),
  deleteNews: (id: string) => deleteDoc(doc(db, 'news', id)),

  // Avisos (Quadro de Avisos)
  getAnnouncements: () => contentStore.fetchCollection<Announcement>('announcements'),
  saveAnnouncement: (ann: Omit<Announcement, 'id'>) => addDoc(collection(db, 'announcements'), { ...ann, serverTimestamp: new Date() }),
  deleteAnnouncement: (id: string) => deleteDoc(doc(db, 'announcements', id)),

  // Galeria de Fotos
  getAlbums: () => contentStore.fetchCollection<Album>('albums'),
  saveAlbum: (album: Omit<Album, 'id'>) => addDoc(collection(db, 'albums'), { ...album, serverTimestamp: new Date() }),
  deleteAlbum: (id: string) => deleteDoc(doc(db, 'albums', id)),

  // Interclasses (Jogos)
  getGames: () => contentStore.fetchCollection<GameResult>('games'),
  saveGame: (game: Omit<GameResult, 'id'>) => addDoc(collection(db, 'games'), { ...game, serverTimestamp: new Date() }),
  deleteGame: (id: string) => deleteDoc(doc(db, 'games', id)),

  // Livros (Estudos)
  getBooks: () => contentStore.fetchCollection<Book>('books', 'title', 'asc'),
  saveBook: (book: Omit<Book, 'id'>) => addDoc(collection(db, 'books'), { ...book, serverTimestamp: new Date() }),
  deleteBook: (id: string) => deleteDoc(doc(db, 'books', id)),

  // Agenda (Eventos da Home)
  getEvents: () => contentStore.fetchCollection<EventDate>('events', 'date', 'asc'),
  saveEvent: (event: Omit<EventDate, 'id'>) => addDoc(collection(db, 'events'), { ...event, serverTimestamp: new Date() }),
  deleteEvent: (id: string) => deleteDoc(doc(db, 'events', id))
};
