
export type Page = 'home' | 'school' | 'studies' | 'interclasses' | 'announcements' | 'gallery' | 'about' | 'feedback' | 'admin';

export interface Announcement {
  id: string;
  title: string;
  date: string;
  category: 'Geral' | 'Urgente' | 'Evento';
  content: string;
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  youtubeUrl?: string;
  gallery?: string[];
}

export interface Album {
  id: string;
  title: string;
  coverImage: string;
  date: string;
  images: string[];
}

export interface EventDate {
  id: string;
  title: string;
  date: string;
  type: 'Prova' | 'Vestibular' | 'Evento';
}

export interface Book {
  id: string;
  title: string;
  author: string;
  grade: string;
}

export interface GameResult {
  id: string;
  teamA: string;
  scoreA: number;
  teamB: string;
  scoreB: number;
  status: 'Finalizado' | 'Agendado';
  date: string;
  sport: 'futsal' | 'chess' | 'pingpong';
}

export interface FeedbackEntry {
  id: string;
  name: string;
  grade: string;
  category: string;
  message: string;
  anonymous: boolean;
  timestamp: string;
}
